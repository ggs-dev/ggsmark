import { HtmlRenderer, Parser, Node } from 'commonmark'
import DOMPurify from 'dompurify'

/**
 * Render AST node into HTML
 * @param {Node} tree
 */
const render = (tree) => {
  let writer = new HtmlRenderer()
  return DOMPurify.sanitize(writer.render(tree), {
    ADD_TAGS: ['iframe']
  })
}

/**
 * Make sure text nodes are not fragmented
 * @param {NodeWalker} walker
 */
const mergeTextNodes = (walker) => {
  let event = walker.next()
  let node = event.node

  while (!!node.prev && node.type === 'text') {
    node.prev.literal = node.prev.literal + node.literal
    node.unlink()
    event = walker.next()
    node = event.node
  }
}

/**
 * Default exported function
 * @param {string} text
 */
export default (text) => {
  let reader = new Parser()
  let rootNode = reader.parse(text)
  let walker = rootNode.walker()
  let event, node
  let promises = []
  let inColour = false
  let inColourNodes = []

  while ((event = walker.next())) {
    node = event.node

    if (
      node.type === 'text' &&
      node.parent &&
      node.parent.type === 'paragraph' &&
      node.literal.match(/\:youtube/)
    ) {
      mergeTextNodes(walker)

      let matchYoutubeExp = /\:(?:youtube)\s(?:https?\:\/\/)?(?:www\.)?(?:youtube\.com\/watch|youtu\.be\/)(?:\?v\=)?([^\s]+)/
      let splitText = node.literal.split(matchYoutubeExp)

      for (let index in splitText) {
        if (index % 2 == 0) {
          let text = new Node('text')
          text.literal = splitText[index]
          node.insertBefore(text)
        } else {
          let div = new Node('custom_block')
          div.onEnter = '<div class="ggsmark-youtube">'
          div.onExit = '</div>'
          let iframe = new Node('html_block')
          iframe.literal =
            '<iframe src="https://www.youtube.com/embed/${splitText[index]}" type="text/html" frameborder="0"></iframe>'
          div.appendChild(iframe)
          node.insertBefore(div)
        }
      }

      node.unlink()
    }

    if (
      node.type === 'text' &&
      node.parent &&
      node.parent.type === 'paragraph' &&
      node.literal.match(/\:soundcloud/)
    ) {
      mergeTextNodes(walker)

      let soundCloudExp = /(?:\:soundcloud|sc)\s((?:https?\:\/\/)?(?:www\.)?(?:soundcloud\.com\/)[^&#\s\?]+\/[^&#\s\?]+)/
      let soundCloudSplit = node.literal.split(soundCloudExp)

      // Split the text string by the regex
      for (let index in soundCloudSplit) {
        // Non-SoundCloud text
        if (index % 2 == 0) {
          let text = new Node('text')
          text.literal = soundCloudSplit[index]

          node.insertBefore(text)
        } else {
          // SoundCloud
          let soundCloudUrl = soundCloudSplit[index]
          let iframe = new Node('html_block')
          iframe.literal = `<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${soundCloudUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>`
          node.insertBefore(iframe)
        }
      }

      node.unlink()
    }

    // let type = node.type
    // if (type === 'html_block') {
    //   debugger
    // }

    if (node.literal && node.literal.match(/\~(?:color|colour)/)) {
      mergeTextNodes(walker)

      let colourExp = /^\~(?:color|colour)(\s(?:(\#?[A-z]+|\d{1,3}\,\s?\d{1,3}\,\s?\d{1,3}(\,\s?\d{1,3})?)))?$/
      let colourMatch = node.literal.match(colourExp)
      node.literal = node.literal.replace(/\~(?:color|colour)(?:\s.+)?/, '')

      if (colourMatch && !inColour) {
        inColour = true
      } else if (inColour) {
        let div = new Node('custom_block')
        div.onEnter = `<div style="color: red">`
        div.onExit = '</div>'
        node.insertAfter(div)

        for (let colourNode of inColourNodes) {
          div.appendChild(colourNode)
        }

        inColour = false
      }

      // if (node.parent.type === 'paragraph') {
      //   node.parent.unlink()
      // }
    }

    if (node.parent && node.parent.type === 'document' && inColour) {
      inColourNodes.push(node)
    }
  }

  return render(rootNode)
}
