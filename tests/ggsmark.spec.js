import ggsmark from '../src/ggsmark'
import axios from 'axios'

jest.mock('axios')

// describe('render text alignment', () => {
//   test('text center', () => {

//     // Arrange
//     let string = `:text-right\n# Heading\n\n**bold text**\ntest\n:text-right\ntest`

//     // Act
//     let result = ggsmark(string)

//     // Assert
//     expect(result).toMatchSnapshot()
//   })
// })

describe('render soundcloud blocks', () => {
  test('soundcloud iframe test', () => {
    // Arrange
    const response = {
      data: {
        version: 1.0,
        type: 'rich',
        provider_name: 'SoundCloud',
        provider_url: 'https://soundcloud.com',
        height: 166,
        width: '100%',
        title: 'WAP feat. Megan Thee Stallion by Cardi B',
        description:
          'Cardi B - WAP feat. Megan Thee Stallion\nStream/Download: https://CardiB.lnk.to/WAP\n\nSubscribe for more official content from Cardi B: https://CardiB.lnk.to/Subscribe\n\nFollow Cardi B\nhttp://cardibofficial.com\nhttp://Twitter.com/IAmCardiB\nhttp://Facebook.com/IAmCardiB\nhttp://Instagram.com/f/iamcardib\nhttp://Soundcloud.com/IAmCardiB\n\nExclusive Bardi Gang merchandise available here: http://smarturl.it/BardiGangMerchYT',
        thumbnail_url:
          'https://i1.sndcdn.com/artworks-xRcHRzwpJGpfGt1d-wqhSGQ-t500x500.jpg',
        html:
          '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F871426135&show_artwork=true&maxheight=166"></iframe>',
        author_name: 'Cardi B',
        author_url: 'https://soundcloud.com/iamcardib'
      }
    }
    axios.get.mockResolvedValue(response)
    let string = `:soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion`

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result)
      .toBe(`<iframe width=\"100%\" height=\"166\" scrolling=\"no\" frameborder=\"no\" src=\"https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F871426135&show_artwork=true&maxheight=166\"></iframe>
    `)
  })
})

describe('render youtube blocks', () => {
  test('repeated youtube with text before and after', () => {
    // Arrange
    let string = `
**bold** string before youtube :youtube http://www.youtube.com/watch?v=52c_QSg64fs after youtube :youtube http://www.youtube.com/watch?v=waefawefwaef *italics*
soft new line

new line
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('repeated youtube', () => {
    // Arrange
    let string = `:youtube http://www.youtube.com/watch?v=52c_QSg64fs :youtube http://www.youtube.com/watch?v=52c_QSg64fs :youtube http://www.youshit.com`

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('youtube with timestamp', () => {
    // Arrange
    let string = `:youtube https://youtu.be/IJhgZBn-LHg?t=712`

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })
})
