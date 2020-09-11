const C_NEWLINE = '\n'
const C_NEWPARAGRAPH = '\n\n'

/**
 * Match line against an array of token
 * @param {String} token token like '!#'
 * @param {String} value value to check of the token
 * @param {Integer} fromIndex where the index should start
 */
function matchToken(token, value, fromIndex = 0) {
  if (fromIndex > 0) {
    value.slice(fromIndex)
  }

  return value.trim().startsWith(token)
}

/**
 * Get the color of a block
 * @param {String} token token like '!#'
 * @param {String} colorExpression regular expression to match, it must capture the first group
 * @param {String} block final string block to be parsed
 */
function getBlockColor(token, colorExpression, block) {
  let trimmedBlock = block.trim()
  if (trimmedBlock.startsWith(token)) {
    return trimmedBlock.slice(token.length).match(colorExpression)[1]
  }
}

export default function plugin(options = {}) {
  const Parser = this.Parser
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods

  options.token = options.token ?? '!#'
  options.colorExpression =
    options.colorExpression ??
    /^\s*(rgba?\(\d{1,3}\s*\,\s*\d{1,3}\s*\,\s*\d{1,3}\s*(\,\s*\d{1,3}\s*)?\)|(\#?[A-z0-9]{3,12}))?/

  function tokenizeBlocks(eat, value, silent) {
    let match = matchToken(options.token, value)

    if (!match) return

    if (silent) return true

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
      let matchedEndToken = matchToken(options.token, line) && !firstRun

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

    let color = getBlockColor(options.token, options.colorExpression, block)

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

  // function locateInlineToken(value, fromIndex) {
  //   return matchToken(options.token, value, fromIndex)
  // }

  // function tokenizeInlines(eat, value, silent) {
  //   var match = matchToken(options.token, value)

  //   if (!match) return

  //   if (silent) return true

  //   return eat(match)({
  //     type: 'link',
  //     url: 'https://social-network/' + match[1],
  //     children: [{ type: 'text', value: match[0] }]
  //   })
  // }

  // tokenizeInlines.notInLink = true
  // tokenizeInlines.locator = locateInlineToken

  blockTokenizers.colorText = tokenizeBlocks
  // inlineTokenizers.colorText = tokenizeInlines

  blockMethods.splice(blockMethods.indexOf('blockquote') + 1, 0, 'colorText')
  // inlineMethods.splice(inlineMethods.indexOf('escape') + 1, 0, 'colorText')
}
