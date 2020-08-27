import ggsmark from '../src/ggsmark'

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
