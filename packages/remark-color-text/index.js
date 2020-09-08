const C_NEWLINE = '\n'
const C_NEWPARAGRAPH = '\n\n'

export default function plugin(options = {}) {
  const Parser = this.Parser
  const tokenizers = Parser.prototype.blockTokenizers
  const methods = Parser.prototype.blockMethods

  options.openCloseToken = options.openCloseToken ?? /^\!\#/
  options.colorExpression =
    options.colorExpression ??
    /^\!\#(\s(?:(\#?[A-z]{3,12}|\d{1,3}\,\s?\d{1,3}\,\s?\d{1,3}(\,\s?\d{1,3})?)))?$/

  tokenizers.colorContainer = tokenizeColorContainer

  methods.splice(methods.indexOf('list') + 1, 0, 'colorContainer')

  // tokenizeColorContainer.notInLink = true
  // tokenizeColorContainer.locator = locateMention

  function tokenizeColorContainer(eat, value, silent) {
    let match = value.match(options.openCloseToken)

    return

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

      endToken = entered && !!lineToEat.match(options.openCloseToken)
      entered = true

      if (
        (nextNewLine > blockStartIndex + 2 || nextNewLine === -1) &&
        lineToEat.length >= 2 &&
        endToken
      ) {
        finalEatLines.push(prepareEatLines.join(C_NEWLINE))

        prepareEatLines = []
        blockStartIndex = nextNewLine + 1
        entered = false
      }

      index = nextNewLine + 1
      canEatLine = nextNewLine !== -1
    }

    if (finalEatLines.length === 0) return

    let split = finalEatLines[0].split(options.colorExpression)

    const add = eat(finalEatLines[0].join(C_NEWLINE))
    const values = this.tokenizeBlock(stringToEat, now)
    this.enterBlock()

    return add({
      type: 'colorContainer',
      data: {
        hName: 'div',
        hProperties: {
          style: 'color: ' + color
        }
      }
    })
  }

  // function locateMention(value, fromIndex) {
  //   return value.indexOf('!#', fromIndex)
  // }
}
