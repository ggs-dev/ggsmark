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

  options.defaultSummary = options.defaultSummary ?? 'Open spoiler'
  options.token = options.token ?? '!spoiler'
  options.detailsClassName = options.detailsClassName ?? ''
  options.summaryClassName = options.summaryClassName ?? ''

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
    let summary = block
      .slice(options.token.length, block.indexOf(C_NEWLINE))
      .trim()

    const start = eat.now()
    const add = eat(block)
    const end = eat.now()
    let children = []
    let childrenBlockContent = this.tokenizeBlock(blockContent, start)

    if (summary !== '') {
      children.push({
        type: 'summary',
        data: {
          hName: 'summary'
        },
        children: [
          {
            type: 'text',
            value: summary
          }
        ]
      })
    }

    children = [...children, ...childrenBlockContent]

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

  blockTokenizers.spoiler = tokenizeBlocks

  blockMethods.splice(blockMethods.indexOf('blockquote') + 1, 0, 'spoiler')
}
