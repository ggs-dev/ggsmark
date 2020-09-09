const C_NEWLINE = '\n'
const C_NEWPARAGRAPH = '\n\n'

/**
 * Match line against an array of tokens
 * @param {Array<String>} tokens list of tokens like '!#'
 * @param {String} line single line to check of the token
 */
function matchTokens(tokens, line) {
  return tokens.findIndex((token) => line.trim().startsWith(token)) !== -1
}

/**
 * Get the color of a block
 * @param {Array<String>} tokens list of tokens like '!#'
 * @param {String} colorExpression regular expression to match, it must capture the first group
 * @param {String} block final string block to be parsed
 */
function getBlockColor(tokens, colorExpression, block) {
  for (let token of tokens) {
    let trimmedBlock = block.trim()
    if (trimmedBlock.startsWith(token)) {
      return trimmedBlock.slice(token.length).match(colorExpression)[1]
      break
    }
  }
}

export default function plugin(options = {}) {
  const Parser = this.Parser
  const tokenizers = Parser.prototype.blockTokenizers
  const methods = Parser.prototype.blockMethods

  options.tokens = ['!#']

  // TODO: add RGB to regex
  options.colorExpression =
    options.colorExpression ??
    /^(?:(\#?[A-z0-9]{3,12}|\d{1,3}\,\s?\d{1,3}\,\s?\d{1,3}(\,\s?\d{1,3})?))?/

  function tokenizeBlocks(eat, value, silent) {
    // let match = value.match(options.colorExpression)
    let match = matchTokens(options.tokens, value)

    if (!match) return

    if (silent) return true

    // Get the color through expression
    let startBlockIndex,
      endBlockIndex = 0
    let index,
      newLineIndex = 0
    let completeBlock = false
    let firstRun = true

    do {
      newLineIndex = value.indexOf(C_NEWLINE, index + 1)

      let line = value.substring(
        index,
        newLineIndex === -1 ? value.length : newLineIndex
      )
      let matchedEndToken = matchTokens(options.tokens, line) && !firstRun

      // Found a match to end the block
      if (!!matchedEndToken) {
        endBlockIndex = newLineIndex === -1 ? value.length : newLineIndex
        completeBlock = true
      }

      index = newLineIndex
      firstRun = false
    } while (!completeBlock && newLineIndex !== -1)

    if (!completeBlock) return

    let block = value.substring(startBlockIndex, endBlockIndex)
    let blockContent = block
      .substring(block.indexOf(C_NEWLINE), block.lastIndexOf(C_NEWLINE))
      .trim()

    let color = getBlockColor(options.tokens, options.colorExpression, block)

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

  tokenizers.colorText = tokenizeBlocks

  // TODO: add inline tokenizer

  methods.splice(methods.indexOf('blockquote') + 1, 0, 'colorText')
}
