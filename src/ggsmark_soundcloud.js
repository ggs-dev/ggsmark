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

      let matchSoundCloudExp = /\:(?:soundcloud)\s((?:https?\:\/\/)?(?:www\.)?(?:soundcloud\.com\/)[^&#\s\?]+\/[^&#\s\?]+)/
      let splitText = node.literal.split(matchSoundCloudExp)

      for (let index in splitText) {
        if (index % 2 == 0) {
          let text = new Node('text')
          text.literal = splitText[index]
          node.insertBefore(text)
        } else {
          let div = new Node('custom_block')
          div.onEnter = '<div class="soundcloud_song">'
          div.onExit = '</div>'
          let iframe = new Node('custom_inline')
          await axios.get(`https://soundcloud.com/oembed?&format=json&url=${splitText[index]}&maxheight=166`).then((data) => {
            iframe.onEnter = "testt"
            iframe.onExit = ''
            div.appendChild(iframe)
            node.insertBefore(div)
          })
        }
      }

      node.unlink()
      // if (node.type === 'text' && !!node.parent && node.parent.type === 'paragraph')

      return DOMPurify.sanitize(writer.render(parsed), { ADD_TAGS: ['iframe'] })
    }
  }
}
