import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import align from 'remark-text-alignment'
import color from 'remark-color-text'
import spoilers from 'remark-spoilers'
import remarkIframes from './iframe.js'

const schema = {
  ...defaultSchema,
  tagNames: [...defaultSchema.tagNames, 'iframe'],
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...defaultSchema.attributes['*'],
      'allowFullScreen',
      'frameBorder',
      'src',
      'className',
      'style'
    ],
    iframe: [
      'allowFullScreen',
      'frameBorder',
      'src',
      'width',
      'height',
      'className',
      'style'
    ],
    div: [...(defaultSchema.attributes.div || []), 'style', 'className'],
    span: [...(defaultSchema.attributes.span || []), 'style', 'className']
  }
}

function stripRawHtml() {
  return (tree) => {
    strip(tree)
  }
}

function strip(node) {
  if (!node?.children) return

  for (let index = 0; index < node.children.length; index++) {
    const child = node.children[index]
    if (child.type === 'html') {
      const text = child.value.replace(/<\/?[^>]+>/g, '')
      if (node.type === 'root') {
        const value = text.trim()
        if (!value) {
          node.children.splice(index, 1)
          index -= 1
          continue
        }
        node.children[index] = {
          type: 'paragraph',
          children: [{ type: 'text', value }]
        }
      } else if (text) {
        node.children[index] = { type: 'text', value: text }
      } else {
        node.children.splice(index, 1)
        index -= 1
      }
      continue
    }

    strip(child)
  }
}

export default (text, options = {}) => {
  const twitchParents = options.twitchParents
    ? '?' +
      options.twitchParents.map((parent) => 'parent=' + parent).join('&') +
      '&'
    : '?'

  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkIframes, {
      'www.youtube.com': {
        tag: 'iframe',
        width: 560,
        height: 315,
        disabled: false,
        replace: [
          ['watch?v=', 'embed/'],
          ['http://', 'https://']
        ],
        thumbnail: {
          format: 'http://img.youtube.com/vi/{id}/0.jpg',
          id: '.+/(.+)$'
        },
        removeAfter: '&'
      },
      'youtu.be': {
        tag: 'iframe',
        width: 560,
        height: 315,
        disabled: false,
        replace: [
          ['watch?v=', 'embed/'],
          ['http://', 'https://'],
          ['youtu.be/', 'youtube.com/embed/']
        ],
        thumbnail: {
          format: 'http://img.youtube.com/vi/{id}/0.jpg',
          id: '.+/(.+)$'
        },
        removeAfter: '&'
      },
      'soundcloud.com': {
        tag: 'iframe',
        width: '100%',
        height: 150,
        disabled: false,
        replace: [
          [
            'soundcloud.com/',
            'w.soundcloud.com/player/?visual=true&url=https://soundcloud.com/'
          ],
          ['http://', 'https://']
        ]
      },
      'www.twitch.tv': {
        tag: 'iframe',
        width: 560,
        height: 315,
        disabled: false,
        replace: [
          [
            'https://twitch.tv/videos/',
            `https://player.twitch.tv/${twitchParents}video=`
          ],
          [
            'https://twitch.tv/',
            `https://player.twitch.tv/${twitchParents}channel=`
          ],
          ['http://', 'https://']
        ]
      },
      'twitch.tv': {
        tag: 'iframe',
        width: 560,
        height: 315,
        disabled: false,
        replace: [
          [
            'https://twitch.tv/videos/',
            `https://player.twitch.tv/${twitchParents}video=`
          ],
          [
            'https://twitch.tv/',
            `https://player.twitch.tv/${twitchParents}channel=`
          ],
          ['http://', 'https://']
        ]
      },
      'www.clips.twitch.tv': {
        tag: 'iframe',
        width: 560,
        height: 315,
        disabled: false,
        replace: [
          [
            'https://clips.twitch.tv/',
            `https://clips.twitch.tv/embed${twitchParents}clip=`
          ],
          ['http://', 'https://']
        ]
      },
      'clips.twitch.tv': {
        tag: 'iframe',
        width: 560,
        height: 315,
        disabled: false,
        replace: [
          [
            'https://clips.twitch.tv/',
            `https://clips.twitch.tv/embed${twitchParents}clip=`
          ],
          ['http://', 'https://']
        ]
      },
      'www.player.twitch.tv': {
        tag: 'iframe',
        width: 560,
        height: 315,
        disabled: false,
        replace: [
          [
            'https://player.twitch.tv/?channel=',
            `https://player.twitch.tv/${twitchParents}channel=`
          ],
          [
            'https://player.twitch.tv/?video=',
            `https://player.twitch.tv/${twitchParents}video=`
          ],
          ['http://', 'https://']
        ]
      },
      'player.twitch.tv': {
        tag: 'iframe',
        width: 560,
        height: 315,
        disabled: false,
        replace: [
          [
            'https://player.twitch.tv/?channel=',
            `https://player.twitch.tv/${twitchParents}channel=`
          ],
          [
            'https://player.twitch.tv/?video=',
            `https://player.twitch.tv/${twitchParents}video=`
          ],
          ['http://', 'https://']
        ]
      },
      'medal.tv': {
        tag: 'iframe',
        width: 640,
        height: 360,
        disabled: false
      },
      'codepen.io': {
        tag: 'iframe',
        width: 700,
        height: 1000,
        disabled: false,
        replace: [['http://', 'https://']]
      }
    })
    .use(align)
    .use(color)
    .use(spoilers, { defaultSummary: 'Spoiler' })
    .use(stripRawHtml)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .processSync(text)
    .toString()
}
