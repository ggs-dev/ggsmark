import { parse as parseClassNames } from 'space-separated-tokens'

const C_NEWLINE = '\n'

let placeholderId = 0

function nextKey() {
  placeholderId += 1
  return `GGSMARKPH${placeholderId}END`
}

function isLineStart(value, index) {
  if (value[index] === C_NEWLINE) return false
  return index === 0 || value[index - 1] === C_NEWLINE
}

function matchToken(token, value) {
  return value.trim().startsWith(token)
}

function attachPreprocessor(processor, rewrite) {
  const previousParse = processor.parse.bind(processor)

  processor.parse = function parse(file) {
    const owned = !file || typeof file !== 'object' || !('value' in file)
    const target = owned ? { value: file == null ? '' : String(file) } : file
    const original = target.value == null ? '' : String(target.value)
    const entries = new Map()
    const value = rewrite(original, entries, (inner) => processor.parse(inner))
    target.value = value
    const tree = previousParse(target)
    if (!owned) target.value = original
    inject(tree, entries)
    return tree
  }
}

function inject(tree, entries) {
  if (!tree?.children?.length || entries.size === 0) return

  for (let index = 0; index < tree.children.length; index++) {
    const child = tree.children[index]
    const pieces = splitMixed(child, entries)
    if (pieces) {
      tree.children.splice(index, 1, ...pieces)
      index += pieces.length - 1
      continue
    }

    if (child.children) inject(child, entries)
  }
}

function splitMixed(node, entries) {
  if (node.type !== 'paragraph' || !node.children?.length) return

  const lines = paragraphLines(node)
  if (!lines.some((line) => lineBlock(line, entries))) return

  const nodes = []
  let textLines = []
  const flush = () => {
    if (!textLines.length) return
    const children = []
    textLines.forEach((line, lineIndex) => {
      if (lineIndex > 0) children.push({ type: 'text', value: C_NEWLINE })
      children.push(...line)
    })
    nodes.push({ type: 'paragraph', children })
    textLines = []
  }

  for (const line of lines) {
    const block = lineBlock(line, entries)
    if (block) {
      flush()
      nodes.push(block)
      continue
    }
    if (line.length) textLines.push(line)
  }

  flush()
  return nodes
}

function paragraphLines(node) {
  const lines = [[]]
  for (const child of node.children) {
    if (child.type === 'break') {
      lines.push([])
      continue
    }
    if (child.type === 'text' && child.value.includes(C_NEWLINE)) {
      const parts = child.value.split(C_NEWLINE)
      parts.forEach((part, partIndex) => {
        if (partIndex > 0) lines.push([])
        if (part) lines[lines.length - 1].push({ type: 'text', value: part })
      })
      continue
    }
    lines[lines.length - 1].push(child)
  }
  return lines
}

function lineBlock(line, entries) {
  if (line.length !== 1 || line[0].type !== 'text') return
  const entry = entries.get(line[0].value.trim())
  return entry?.kind === 'block' ? entry.node : undefined
}

function consumeBlock(value, token) {
  if (!matchToken(token, value)) return

  let endBlock = 0
  let index
  let newLine = 0
  let completeBlock = false
  let firstRun = true

  do {
    newLine = value.indexOf(C_NEWLINE, index + 1)
    const line = value.substring(index, newLine === -1 ? value.length : newLine)
    if (matchToken(token, line) && !firstRun) {
      endBlock = newLine === -1 ? value.length : newLine
      completeBlock = true
    }
    index = newLine
    firstRun = false
  } while (!completeBlock && newLine !== -1)

  if (!completeBlock) return

  return value.substring(0, endBlock)
}

export default function plugin(options = {}) {
  const token = options.token ?? '!spoiler'
  const defaultSummary = options.defaultSummary ?? 'Open spoiler'
  const detailsClassName = options.detailsClassName
    ? parseClassNames(options.detailsClassName)
    : undefined
  const summaryClassName = options.summaryClassName
    ? parseClassNames(options.summaryClassName)
    : undefined

  attachPreprocessor(this, (markdown, entries, parseInner) =>
    replaceBlocks(markdown, entries, parseInner, {
      token,
      defaultSummary,
      detailsClassName,
      summaryClassName
    })
  )
}

function replaceBlocks(markdown, entries, parseInner, options) {
  let result = ''
  let index = 0

  while (index < markdown.length) {
    if (isLineStart(markdown, index)) {
      const block = consumeBlock(markdown.slice(index), options.token)
      if (block) {
        const newline = block.indexOf(C_NEWLINE)
        const lastNewline = block.lastIndexOf(C_NEWLINE)
        const summary =
          newline === -1
            ? ''
            : block.slice(options.token.length, newline).trim()
        const content =
          newline === -1 || newline === lastNewline
            ? ''
            : block.slice(newline + 1, lastNewline).trim()
        const inner = content ? parseInner(content) : { children: [] }
        const key = nextKey()
        entries.set(key, {
          kind: 'block',
          node: {
            type: 'spoiler',
            data: {
              hName: 'details',
              hProperties: options.detailsClassName
                ? { className: options.detailsClassName }
                : {}
            },
            children: [
              {
                type: 'summary',
                data: {
                  hName: 'summary',
                  hProperties: options.summaryClassName
                    ? { className: options.summaryClassName }
                    : {}
                },
                children: [
                  {
                    type: 'text',
                    value: summary !== '' ? summary : options.defaultSummary
                  }
                ]
              },
              ...(inner.children || [])
            ]
          }
        })
        result += key
        index += block.length
        continue
      }
    }

    result += markdown[index]
    index += 1
  }

  return result
}
