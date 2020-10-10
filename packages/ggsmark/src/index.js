import unified from 'unified'
import markdown from 'remark-parse'
import merge from 'deepmerge'
import gh from 'hast-util-sanitize/lib/github'
import sanitize from 'rehype-sanitize'

// Plugins
import iframe from 'remark-iframes'
import align from 'remark-text-alignment'
import color from 'remark-color-text'
import spoilers from 'remark-spoilers'
import highlight from 'rehype-highlight'

// Don't use remark-html otherwise we can't customize HTML
import stringify from 'rehype-stringify'
import rehype from 'remark-rehype'

// Import this since remark-iframe needs it
import 'regenerator-runtime/runtime'

export default (text, options = {}) => {
  options.twitchParents = !!options.twitchParents
    ? '?' + options.twitchParents.map((i) => 'parent=' + i).join('&') + '&'
    : '?'

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
            `https://player.twitch.tv/${options.twitchParents}video=`
          ],
          [
            'https://twitch.tv/',
            `https://player.twitch.tv/${options.twitchParents}channel=`
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
            `https://player.twitch.tv/${options.twitchParents}video=`
          ],
          [
            'https://twitch.tv/',
            `https://player.twitch.tv/${options.twitchParents}channel=`
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
            `https://clips.twitch.tv/embed${options.twitchParents}clip=`
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
            `https://clips.twitch.tv/embed${options.twitchParents}clip=`
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
            `https://player.twitch.tv/${options.twitchParents}channel=`
          ],
          [
            'https://player.twitch.tv/?video=',
            `https://player.twitch.tv/${options.twitchParents}video=`
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
            `https://player.twitch.tv/${options.twitchParents}channel=`
          ],
          [
            'https://player.twitch.tv/?video=',
            `https://player.twitch.tv/${options.twitchParents}video=`
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
    .use(rehype)
    .use(highlight)
    .use(stringify)
    .use(color)
    .use(spoilers)
    .use(sanitize, schema)
    .processSync(text)
    .toString()
}
