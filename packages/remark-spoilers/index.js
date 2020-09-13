const C_NEWLINE = '\n'
const C_NEWPARAGRAPH = '\n\n'

/**
 * Match line against an array of token
 * @param {String} token token like '!#'
 * @param {String} value value to check of the token
 */
function matchToken(token, value) {
  return value.trim().startsWith(token)
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

    let startBlock,
      endBlock = 0
    let index,
      newLine = 0
    let completeBlock = false
    let firstRun = true

    do {
      newLine = value.indexOf(C_NEWLINE, index + 1)

      let line = value.substring(index, newLine === -1 ? value.length : newLine)
      let matchedEndToken = matchToken(options.token, line) && !firstRun

      // Found a match to end the block
      if (!!matchedEndToken) {
        endBlock = newLine === -1 ? value.length : newLine
        completeBlock = true
      }

      index = newLine
      firstRun = false
    } while (!completeBlock && newLine !== -1)

    if (!completeBlock) return

    let block = value.substring(startBlock, endBlock)
    let blockContent = block
      .substring(block.indexOf(C_NEWLINE), block.lastIndexOf(C_NEWLINE))
      .trim()

    const start = eat.now()
    const add = eat(block)
    const end = eat.now()
    const children = this.tokenizeBlock(blockContent, start)

    return add({
      type: 'spoiler',
      children: children,
      data: {
        hName: 'details'
      },
      position: {
        start,
        end
      }
    })
  }

  function locateInlineToken(value, fromIndex) {
    return value.indexOf(options.token, fromIndex)
  }

  function tokenizeInlines(eat, value, silent) {
    let match = matchToken(options.token, value)

    if (!match) return

    if (silent) return true

    let openBracket = value.indexOf('(') + 1
    let closeBracket = value.indexOf(')')
    let inline = value.substring(0, closeBracket + 1)
    let inlineContent = value.substring(openBracket, closeBracket)

    if (openBracket === -1 || closeBracket === -1) return

    const start = eat.now()
    const add = eat(inline)
    const end = eat.now()
    const children = this.tokenizeInline(inlineContent, start)

    return add({
      type: 'spoiler',
      children: children,
      data: {
        hName: 'span'
      },
      position: {
        start,
        end
      }
    })
  }

  tokenizeInlines.notInLink = true
  tokenizeInlines.locator = locateInlineToken

  blockTokenizers.spoiler = tokenizeBlocks
  inlineTokenizers.spoiler = tokenizeInlines

  blockMethods.splice(blockMethods.indexOf('blockquote') + 1, 0, 'spoiler')
  inlineMethods.splice(inlineMethods.indexOf('escape') + 1, 0, 'spoiler')
}
