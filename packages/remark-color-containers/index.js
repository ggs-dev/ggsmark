const C_NEWLINE = '\n'
const C_NEWPARAGRAPH = '\n\n'

export default function plugin() {
  const Parser = this.Parser
  const tokenizers = Parser.prototype.blockTokenizers
  const methods = Parser.prototype.blockMethods

  tokenizers.colorContainer = tokenizeColorContainer

  methods.splice(methods.indexOf('blockquote') + 1, 0, 'colorContainer')

  // tokenizeColorContainer.notInLink = true
  // tokenizeColorContainer.locator = locateMention

  function tokenizeColorContainer(eat, value, silent) {
    let match = /^\!\#\s(\w+||\#[A-z0-9]{3,6}||[A-z]+|\d{1,3}\,\d{1,3}\,\d{1,3}(?:\,\d{1,3})?)/.exec(
      value
    )

    if (!match) return

    if (silent) return true

    let [, color] = match
    let index = 0
    let linesToEat = []
    const finishedBlocks = []
    let canEatLine = true
    let blockStartIndex = 0

    while (canEatLine) {
      const nextIndex = value.indexOf(C_NEWLINE, index + 1)
      const lineToEat =
        nextIndex !== -1 ? value.slice(index, nextIndex) : value.slice(index)

      linesToEat.push(lineToEat)

      if (
        (nextIndex > blockStartIndex + 2 || nextIndex === -1) &&
        lineToEat.length >= 2
      ) {
        finishedBlocks.push(linesToEat.join(C_NEWLINE))

        linesToEat = []
        blockStartIndex = nextIndex + 1
      }

      index = nextIndex + 1
      canEatLine = nextIndex !== -1
    }

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
