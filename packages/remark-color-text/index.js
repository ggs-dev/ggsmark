const C_NEWLINE = '\n'
const C_NEWPARAGRAPH = '\n\n'

export default function plugin(options = {}) {
  const Parser = this.Parser
  const tokenizers = Parser.prototype.blockTokenizers
  const methods = Parser.prototype.blockMethods
  options.token = options.token ?? ['!#']

  tokenizers.colorContainer = tokenizeColorContainer

  methods.splice(methods.indexOf('blockquote') + 1, 0, 'colorContainer')

  // tokenizeColorContainer.notInLink = true
  // tokenizeColorContainer.locator = locateMention

  function tokenizeColorContainer(eat, value, silent) {
    // let match = /^\!\#\s(\w+||\#[A-z0-9]{3,6}||[A-z]+|\d{1,3}\,\d{1,3}\,\d{1,3}(?:\,\d{1,3})?)/.exec(
    //   value
    // )
    let matchToken = value.indexOf(options.token)

    if (matchToken === -1) return

    if (silent) return true

    let [, color] = match
    let index = 0
    let prepareEatLines = []
    const finalEatLines = []
    let canEatLine = true
    let blockStartIndex = 0

    while (canEatLine) {
      // Find new line
      const nextIndex = value.indexOf(C_NEWLINE, index + 1)

      const lineToEat =
        nextIndex !== -1 ? value.slice(index, nextIndex) : value.slice(index)

      prepareEatLines.push(lineToEat)

      const endIndex = ['!#'].indexOf(lineToEat)

      if (
        (nextIndex > blockStartIndex + 2 || nextIndex === -1) &&
        lineToEat.length >= 2 &&
        endIndex !== -1
      ) {
        finalEatLines.push(prepareEatLines.join(C_NEWLINE))

        prepareEatLines = []
        blockStartIndex = nextIndex + 1
      }

      index = nextIndex + 1
      canEatLine = nextIndex !== -1
    }

    debugger

    // const add = eat(toEat.join(C_NEWLINE))
    // const exit = this.enterBlock()
    // const values = this.tokenizeBlock(stringToEat, now)
    // exit()

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
