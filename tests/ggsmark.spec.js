import ggsmark from '../src/ggsmark'
import axios from 'axios'

jest.mock('axios')

describe('render soundcloud blocks', () => {
  // Arrange
  const response = {
    data: {
      html:
        '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F871426135&show_artwork=true&maxheight=166"></iframe>'
    }
  }
  axios.get.mockResolvedValue(response)

  test('single line', (done) => {
    // Arrange
    let string =
      ':soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion'

    // Act
    let result = ggsmark(string, (result) => {
      try {
        // Assert
        expect(result).toMatchSnapshot()
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  test('multiple occurrences', (done) => {
    // Arrange
    let string =
      ':soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion :soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion :soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion :soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion'

    // Act
    let result = ggsmark(string, (result) => {
      try {
        // Assert
        expect(result).toMatchSnapshot()
        done()
      } catch (error) {
        done(error)
      }
    })
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
