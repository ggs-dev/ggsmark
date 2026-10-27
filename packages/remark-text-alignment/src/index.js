import { parse as parseClassNames } from 'space-separated-tokens'

const C_NEWLINE = '\n'
const C_NEWPARAGRAPH = '\n\n'

let placeholderId = 0

function nextKey() {
  placeholderId += 1
  return `GGSMARKPH${placeholderId}END`
}

function isLineStart(value, index) {
  if (value[index] === C_NEWLINE) return false
  return index === 0 || value[index - 1] === C_NEWLINE
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

export default function plugin(options = {}) {
  const useClassNames = options.useClassNames ?? false
  const classNames = options.classNames ?? {}

  attachPreprocessor(this, (markdown, entries, parseInner) =>
    replaceBlocks(markdown, entries, parseInner, { useClassNames, classNames })
  )
}

function replaceBlocks(markdown, entries, parseInner, options) {
  let result = ''
  let index = 0

  while (index < markdown.length) {
    if (isLineStart(markdown, index)) {
      const consumed = consumeAlignment(
        markdown.slice(index),
        parseInner,
        options
      )
      if (consumed) {
        const key = nextKey()
        entries.set(key, { kind: 'block', node: consumed.node })
        result += key
        index += consumed.raw.length
        continue
      }
    }

    result += markdown[index]
    index += 1
  }

  return result
}

function consumeAlignment(value, parseInner, options) {
  const locateMarker = /[^\\]?(->|<-)/
  const endMarkers = ['->', '<-']
  const keep = value.match(locateMarker)
  if (!keep || keep.index !== 0) return

  const startMarker = keep[1]
  let index = 0
  let linesToEat = []
  const finishedBlocks = []
  let endMarker = ''
  let canEatLine = true
  let blockStartIndex = 0

  while (canEatLine) {
    const nextIndex = value.indexOf(C_NEWLINE, index + 1)
    const lineToEat =
      nextIndex !== -1 ? value.slice(index, nextIndex) : value.slice(index)

    linesToEat.push(lineToEat)

    const endIndex = endMarkers.indexOf(lineToEat.slice(-2))

    if (
      (nextIndex > blockStartIndex + 2 || nextIndex === -1) &&
      lineToEat.length >= 2 &&
      endIndex !== -1
    ) {
      if (endMarker === '') endMarker = lineToEat.slice(-2)
      finishedBlocks.push(linesToEat.join(C_NEWLINE))
      if (value.indexOf('->', nextIndex) !== nextIndex + 1) break
      linesToEat = []
      blockStartIndex = nextIndex + 1
    }

    index = nextIndex + 1
    canEatLine = nextIndex !== -1
  }

  let elementType = ''
  let className
  let style

  if (startMarker === '<-' && endMarker === '<-') {
    elementType = 'leftAligned'
    if (options.useClassNames) {
      className = options.classNames.left
        ? parseClassNames(options.classNames.left)
        : 'align-left'
    } else {
      style = 'text-align: left'
    }
  }

  if (startMarker === '->' && endMarker === '<-') {
    elementType = 'centerAligned'
    if (options.useClassNames) {
      className = options.classNames.center
        ? parseClassNames(options.classNames.center)
        : 'align-center'
    } else {
      style = 'text-align: center'
    }
  }

  if (startMarker === '->' && endMarker === '->') {
    elementType = 'rightAligned'
    if (options.useClassNames) {
      className = options.classNames.right
        ? parseClassNames(options.classNames.right)
        : 'align-right'
    } else {
      style = 'text-align: right'
    }
  }

  if (!elementType || finishedBlocks.length === 0) return

  const marker = finishedBlocks[0].slice(-2)
  const toEat = []
  let stringToEat = ''

  for (const block of finishedBlocks) {
    if (marker !== block.slice(-2)) break
    toEat.push(block)
    stringToEat += block.slice(2, -2) + C_NEWPARAGRAPH
  }

  const raw = toEat.join(C_NEWLINE)
  if (!value.startsWith(raw)) return

  const inner = parseInner(stringToEat)
  const hProperties = {}
  if (className != null) hProperties.className = className
  if (style != null) hProperties.style = style

  return {
    raw,
    node: {
      type: elementType,
      data: {
        hName: 'div',
        hProperties
      },
      children: inner.children || []
    }
  }
}
