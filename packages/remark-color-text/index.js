const C_NEWLINE = '\n'
const C_NEWPARAGRAPH = '\n\n'

export default function plugin(options = {}) {
  const Parser = this.Parser
  const tokenizers = Parser.prototype.blockTokenizers
  const methods = Parser.prototype.blockMethods

  options.token = options.token ?? /^\!\#/

  tokenizers.colorContainer = tokenizeColorContainer

  methods.splice(methods.indexOf('blockquote') + 1, 0, 'colorContainer')

  // tokenizeColorContainer.notInLink = true
  // tokenizeColorContainer.locator = locateMention

  function tokenizeColorContainer(eat, value, silent) {
    let match = value.match(options.token)

    if (!match) return

    if (silent) return true

    const now = eat.now()
    let index = 0
    let prepareEatLines = []
    const finalEatLines = []
    let canEatLine = true
    let blockStartIndex = 0
    let entered = false
    let endToken = false

    while (canEatLine) {
      const nextNewLine = value.indexOf(C_NEWLINE, index + 1)

      const lineToEat =
        nextNewLine !== -1
          ? value.slice(index, nextNewLine)
          : value.slice(index)

      prepareEatLines.push(lineToEat)

      endToken = entered && !!lineToEat.match(options.token)
      entered = true

      if (
        (nextNewLine > blockStartIndex + 2 || nextNewLine === -1) &&
        lineToEat.length >= 2 &&
        endToken
      ) {
        finalEatLines.push(prepareEatLines.join(C_NEWLINE))

        prepareEatLines = []
        blockStartIndex = nextNewLine + 1
      }

      index = nextNewLine + 1
      canEatLine = nextNewLine !== -1
    }
    debugger
    // const add = eat(toEat.join(C_NEWLINE))
    // const values = this.tokenizeBlock(stringToEat, now)
    // this.enterBlock()

    return add({
      type: 'colorContainer',
      data: {
        hName: 'div',
        hProperties: {
          style: 'color: red'
        }
      }
    })
  }

  // function locateMention(value, fromIndex) {
  //   return value.indexOf('!#', fromIndex)
  // }
}
