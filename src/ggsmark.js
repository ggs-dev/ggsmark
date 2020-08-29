import { HtmlRenderer, Parser, Node } from 'commonmark'
import DOMPurify from 'dompurify'
import axios from 'axios'

export default async function (text) {
  let reader = new Parser()
  let writer = new HtmlRenderer()
  let parsed = reader.parse(text)
  var walker = parsed.walker()
  let event, node

  while ((event = walker.next())) {
    node = event.node

    if (
      node.type === 'text' &&
      !!node.parent &&
      node.parent.type === 'paragraph' &&
      node.literal.match(/\:youtube/)
    ) {
      let nestedEvent = walker.next()
      let nestedNode = nestedEvent.node

      // Make sure text nodes are not fragmented
      while (!!nestedNode.prev && nestedNode.type === 'text') {
        nestedNode.prev.literal = nestedNode.prev.literal + nestedNode.literal
        nestedNode.unlink()
        nestedEvent = walker.next()
        nestedNode = nestedEvent.node
      }

      let matchYoutubeExp = /\:(?:youtube)\s(?:https?\:\/\/)?(?:www\.)?(?:youtube\.com\/watch|youtu\.be\/)(?:\?v\=)?([^\s]+)/
      let splitText = node.literal.split(matchYoutubeExp)

      for (let index in splitText) {
        if (index % 2 == 0) {
          let text = new Node('text')
          text.literal = splitText[index]
          node.insertBefore(text)
        } else {
          let div = new Node('custom_block')
          div.onEnter = '<div class="youtube-video">'
          div.onExit = '</div>'
          let iframe = new Node('custom_inline')
          iframe.onEnter = `<iframe src="https://www.youtube.com/embed/${splitText[index]}" type="text/html" frameborder="0">`
          iframe.onExit = '</iframe>'
          div.appendChild(iframe)
          node.insertBefore(div)
        }
      }

      node.unlink()
    }

    if (
      node.type === 'text' &&
      !!node.parent &&
      node.parent.type === 'paragraph' &&
      node.literal.match(/\:soundcloud/)
    ) {
      let nestedEvent = walker.next()
      let nestedNode = nestedEvent.node

      // Make sure text nodes are not fragmented
      while (!!nestedNode.prev && nestedNode.type === 'text') {
        nestedNode.prev.literal = nestedNode.prev.literal + nestedNode.literal
        nestedNode.unlink()
        nestedEvent = walker.next()
        nestedNode = nestedEvent.node
      }

      let matchSoundCloudExp = /^(?:soundcloud|sc)\s((?:https?\:\/\/)?(?:www\.)?(?:soundcloud\.com\/)[^&#\s\?]+\/[^&#\s\?]+)/
      let splitText = node.literal.split(matchSoundCloudExp)

      for (let index in splitText) {
        if (index % 2 == 0) {
          let text = new Node('text')
          text.literal = splitText[index]
          node.insertBefore(text)
        } else {
          let div = new Node('custom_block')
          div.onEnter = '<div class="soundcloud">'
          div.onExit = '</div>'
          let iframe = new Node('custom_inline')
          iframe.onEnter = `<iframe src="https://www.youtube.com/embed/${splitText[index]}" type="text/html" frameborder="0">`
          iframe.onExit = '</iframe>'
          div.appendChild(iframe)
          node.insertBefore(div)
        }
      }

      node.unlink()
    }
  }

  return DOMPurify.sanitize(writer.render(parsed), { ADD_TAGS: ['iframe'] })
}
