export default function remarkIframes(providers) {
  if (
    !providers ||
    typeof providers !== 'object' ||
    !Object.keys(providers).length
  ) {
    throw new Error(
      'remark-iframes needs to be passed a configuration object as option'
    )
  }

  return (tree) => {
    visit(tree, providers)
  }
}

function visit(node, providers) {
  if (!node.children) return

  for (let index = 0; index < node.children.length; index++) {
    const child = node.children[index]
    const embeds = paragraphEmbeds(child)

    if (embeds) {
      const nodes = embeds.map(
        (url) => createIframe(url, providers) || plainEmbed(url)
      )
      node.children.splice(index, 1, ...nodes)
      index += nodes.length - 1
      continue
    }

    visit(child, providers)
  }
}

function paragraphEmbeds(node) {
  if (node.type !== 'paragraph' || !node.children?.length) return

  const lines = [[]]
  for (const child of node.children) {
    if (child.type === 'break') {
      lines.push([])
      continue
    }

    if (child.type === 'text' && child.value.includes('\n')) {
      const parts = child.value.split('\n')
      parts.forEach((part, partIndex) => {
        if (partIndex > 0) lines.push([])
        if (part) lines[lines.length - 1].push({ type: 'text', value: part })
      })
      continue
    }

    lines[lines.length - 1].push(child)
  }

  const urls = []
  for (const line of lines) {
    if (line.length === 0) continue
    const url = embedUrl({ type: 'paragraph', children: line })
    if (!url) return
    urls.push(url)
  }

  return urls.length ? urls : undefined
}

function embedUrl(node) {
  if (node.type !== 'paragraph' || !node.children?.length) return

  if (node.children.length === 1 && node.children[0].type === 'text') {
    return node.children[0].value.match(/^!\((https?:\/\/[^)\s]+)\)$/)?.[1]
  }

  const meaningful = node.children.filter((child) => child.type !== 'break')
  if (
    meaningful.length === 3 &&
    meaningful[0].type === 'text' &&
    meaningful[0].value.trim() === '!(' &&
    meaningful[1].type === 'link' &&
    meaningful[2].type === 'text' &&
    meaningful[2].value.trim() === ')'
  ) {
    return meaningful[1].url
  }
}

function plainEmbed(url) {
  return {
    type: 'paragraph',
    children: [{ type: 'text', value: `!(${url})` }]
  }
}

function createIframe(url, providers) {
  let hostname
  try {
    hostname = new URL(url).hostname
  } catch {
    return
  }

  const provider = providers[hostname]
  if (!provider || provider.disabled === true) return
  if (provider.match instanceof RegExp && !provider.match.test(url)) return

  return {
    type: 'iframe',
    data: {
      hName: provider.tag || 'iframe',
      hProperties: {
        src: computeFinalUrl(provider, url),
        width: provider.width,
        height: provider.height,
        allowFullScreen: true,
        frameBorder: '0'
      }
    },
    children: []
  }
}

function computeFinalUrl(provider, url) {
  let finalUrl = url

  if (provider.droppedQueryParameters) {
    const parsed = new URL(finalUrl)
    for (const ignored of provider.droppedQueryParameters) {
      parsed.searchParams.delete(ignored)
    }
    finalUrl = parsed.href
  }

  if (provider.replace?.length) {
    for (const [from, to] of provider.replace) {
      if (from && to) finalUrl = finalUrl.replace(from, to)
    }
  }

  if (provider.removeFileName) {
    const parsed = new URL(finalUrl)
    parsed.pathname = parsed.pathname.substring(
      0,
      parsed.pathname.lastIndexOf('/')
    )
    finalUrl = parsed.href
  }

  if (provider.removeAfter && finalUrl.includes(provider.removeAfter)) {
    finalUrl = finalUrl.substring(0, finalUrl.indexOf(provider.removeAfter))
  }

  if (provider.append) finalUrl += provider.append

  return finalUrl
}
