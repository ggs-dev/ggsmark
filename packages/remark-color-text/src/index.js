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

function readColor(token, colorExpression, lowercase, block) {
  const trimmedBlock = block.trim()
  if (!trimmedBlock.startsWith(token)) return

  const match = trimmedBlock.slice(token.length).match(colorExpression)
  if (!match || match[1] == null) return

  return lowercase ? match[1].toLowerCase() : match[1]
}

function inlineChildren(tree) {
  if (
    tree.children?.length === 1 &&
    tree.children[0].type === 'paragraph' &&
    tree.children[0].children
  ) {
    return tree.children[0].children
  }

  return tree.children || []
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

    if (child.children) {
      replaceInlinePlaceholders(child, entries)
      inject(child, entries)
    }
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
  return entries.get(line[0].value.trim())?.kind === 'block'
    ? entries.get(line[0].value.trim()).node
    : undefined
}

function replaceInlinePlaceholders(node, entries) {
  const pattern = /GGSMARKPH\d+END/g

  for (let index = 0; index < node.children.length; index++) {
    const child = node.children[index]
    if (child.type !== 'text' || !child.value.includes('GGSMARKPH')) continue

    const parts = []
    let last = 0
    pattern.lastIndex = 0
    let match = pattern.exec(child.value)
    if (!match) continue

    while (match) {
      if (match.index > last) {
        parts.push({
          type: 'text',
          value: child.value.slice(last, match.index)
        })
      }
      const entry = entries.get(match[0])
      parts.push(
        entry?.kind === 'inline'
          ? entry.node
          : { type: 'text', value: match[0] }
      )
      last = match.index + match[0].length
      match = pattern.exec(child.value)
    }

    if (last < child.value.length) {
      parts.push({ type: 'text', value: child.value.slice(last) })
    }

    node.children.splice(index, 1, ...parts)
    index += parts.length - 1
  }
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
  const token = options.token ?? '!#'
  const lowercase = options.lowercase ?? true
  const colorExpression =
    options.colorExpression ??
    /^\s*(rgba?\(\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*\d{1,3}\s*)?\)|(#?[A-z0-9]{3,12}))?/

  attachPreprocessor(this, (markdown, entries, parseInner) => {
    let value = replaceBlocks(
      markdown,
      entries,
      parseInner,
      token,
      lowercase,
      colorExpression
    )
    value = replaceInlines(
      value,
      entries,
      parseInner,
      token,
      lowercase,
      colorExpression
    )
    return value
  })
}

function replaceBlocks(
  markdown,
  entries,
  parseInner,
  token,
  lowercase,
  colorExpression
) {
  let result = ''
  let index = 0

  while (index < markdown.length) {
    if (isLineStart(markdown, index)) {
      const block = consumeBlock(markdown.slice(index), token)
      const color = block && readColor(token, colorExpression, lowercase, block)
      if (block && color) {
        const newline = block.indexOf(C_NEWLINE)
        const lastNewline = block.lastIndexOf(C_NEWLINE)
        const content =
          newline === -1 || newline === lastNewline
            ? ''
            : block.slice(newline + 1, lastNewline).trim()
        const inner = content ? parseInner(content) : { children: [] }
        const key = nextKey()
        entries.set(key, {
          kind: 'block',
          node: {
            type: 'colorText',
            data: {
              hName: 'div',
              hProperties: { style: `color: ${color}` }
            },
            children: inner.children || []
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

function replaceInlines(
  markdown,
  entries,
  parseInner,
  token,
  lowercase,
  colorExpression
) {
  let result = ''
  let index = 0

  while (index < markdown.length) {
    const found = markdown.indexOf(token, index)
    if (found === -1) {
      result += markdown.slice(index)
      break
    }

    const lineEnd = markdown.indexOf(C_NEWLINE, found)
    const line = markdown.slice(
      found,
      lineEnd === -1 ? markdown.length : lineEnd
    )
    const inline = parseInline(
      line,
      token,
      lowercase,
      colorExpression,
      parseInner
    )

    if (!inline) {
      result += markdown.slice(index, found + token.length)
      index = found + token.length
      continue
    }

    const key = nextKey()
    entries.set(key, { kind: 'inline', node: inline.node })
    result += markdown.slice(index, found) + key
    index = found + inline.length
  }

  return result
}

function parseInline(line, token, lowercase, colorExpression, parseInner) {
  if (!line.startsWith(token)) return

  const afterToken = line.slice(token.length)
  const match = afterToken.match(colorExpression)
  if (!match || match[1] == null) return

  const color = lowercase ? match[1].toLowerCase() : match[1]
  const afterColor = afterToken.slice(match[0].length)
  const open = afterColor.indexOf('(')
  const close = afterColor.indexOf(')')
  if (open === -1 || close === -1 || close < open) return

  const content = afterColor.slice(open + 1, close)
  const inner = parseInner(content)

  return {
    length: token.length + match[0].length + close + 1,
    node: {
      type: 'colorText',
      data: {
        hName: 'span',
        hProperties: { style: `color: ${color}` }
      },
      children: inlineChildren(inner)
    }
  }
}
