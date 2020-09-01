import unified from 'unified'
import parse from 'remark-parse'
import stringify from 'rehype-stringify'
import rehype from 'remark-rehype'
import iframe from 'remark-iframes'

export default (text) => {
  return unified()
    .use(parse)
    .use(iframe, {
      // Youtube RegEx example
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
      // Youtube oEmbed example
      'youtu.be': {
        width: 560,
        height: 315,
        disabled: false,
        oembed: 'https://www.youtube.com/oembed'
      }
    })
    .use(rehype)
    .use(stringify)
}
