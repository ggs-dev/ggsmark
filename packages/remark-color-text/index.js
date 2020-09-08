const C_NEWLINE = '\n'
const C_NEWPARAGRAPH = '\n\n'

export default function plugin(options = {}) {
  const Parser = this.Parser
  const tokenizers = Parser.prototype.blockTokenizers
  const methods = Parser.prototype.blockMethods

  options.colorExpression =
    options.colorExpression ??
    /^\s*\!\#(?:\s(?:(\#?[A-z0-9]{3,12}|\d{1,3}\,\s?\d{1,3}\,\s?\d{1,3}(\,\s?\d{1,3})?)))?/

  function tokenize(eat, value, silent) {
    let match = value.match(options.colorExpression)

    if (!match) return

    if (silent) return true

    // Get the color through expression
    let [, color] = match
    let startBlockIndex,
      endBlockIndex = 0
    let index,
      newLineIndex = 0
    let completeBlock = false
    let matchedEndToken = []
    let firstRun = true

    do {
      newLineIndex = value.indexOf(C_NEWLINE, index + 1)
      let line = value.substring(index, newLineIndex)

      matchedEndToken = line.match(options.colorExpression)

      // Found a match to end the block
      if (!!matchedEndToken && !firstRun) {
        endBlockIndex = newLineIndex
        completeBlock = true
      }
      // debugger
      index = newLineIndex
      firstRun = false
    } while (!completeBlock || newLineIndex >= value.length)

    let block = value.substring(startBlockIndex, endBlockIndex)
    let blockContent = block
      .substring(block.indexOf(C_NEWLINE), block.lastIndexOf(C_NEWLINE))
      .trim()

    const start = eat.now()
    const add = eat(block)
    const end = eat.now()
    const children = this.tokenizeBlock(blockContent, start)

    return add({
      type: 'colorText',
      children: children,
      data: {
        hName: 'div',
        hProperties: {
          style: `color: ${color}`
        }
      },
      position: {
        start,
        end
      }
    })
  }

  tokenizers.colorText = tokenize

  methods.splice(methods.indexOf('blockquote') + 1, 0, 'colorText')

  // tokenizeColorText.notInLink = true
  // tokenizeColorText.locator = locateMention

  // function locateMention(value, fromIndex) {
  //   return value.indexOf('!#', fromIndex)
  // }
}
