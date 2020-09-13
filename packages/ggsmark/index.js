import unified from 'unified'
import markdown from 'remark-parse'
import merge from 'deepmerge'
import gh from 'hast-util-sanitize/lib/github'
import sanitize from 'rehype-sanitize'

// Plugins
import iframe from 'remark-iframes'
import align from 'remark-text-alignment'
import color from 'remark-color-text'

// Don't use remark-html otherwise we can't customize HTML
import stringify from 'rehype-stringify'
import rehype from 'remark-rehype'

// Import this since remark-iframe needs it
import 'regenerator-runtime/runtime'

export default (text, options = {}) => {
  let schema = merge(gh, {
    attributes: {
      '*': [
        'allowfullscreen',
        'frameborder',
        'src',
        'className',
        'style',
        'width',
        'height'
      ]
    },
    tagNames: ['iframe']
  })
  return unified()
    .use(markdown, {
      blocks: []
    })
    .use(iframe, {
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
          ['http://', 'https://']
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
      'www.clips.twitch.tv': {
        tag: 'iframe',
        width: '100%',
        height: 378,
        disabled: false,
        replace: [
          [
            'www.clips.twitch.tv/',
            `www.clips.twitch.tv/embed?parent=${options.parent}&clip=`
          ],
          ['http://', 'https://']
        ]
      },
      'clips.twitch.tv': {
        tag: 'iframe',
        width: '100%',
        height: 378,
        disabled: false,
        replace: [
          [
            'clips.twitch.tv',
            `clips.twitch.tv/embed?parent=${options.parent}&clip=`
          ],
          ['http://', 'https://']
        ]
      },
      'www.twitch.tv': {
        tag: 'iframe',
        width: 620,
        height: 378,
        disabled: false,
        replace: [
          [
            'www.twitch.tv/videos/',
            `www.player.twitch.tv/?${options.parents}&video=`
          ],
          ['http://', 'https://']
        ]
      },
      'twitch.tv': {
        tag: 'iframe',
        width: 620,
        height: 378,
        disabled: false,
        replace: [
          [
            'twitch.tv/videos/',
            'player.twitch.tv/?parent=${options.parent}&video='
          ],
          ['http://', 'https://']
        ]
      }
    })
    .use(align)
    .use(rehype)
    .use(stringify)
    .use(color)
    .use(sanitize, schema)
    .processSync(text)
    .toString()
}
