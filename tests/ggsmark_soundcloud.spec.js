import ggsmark from '../src/ggsmark_soundcloud'

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
  test('repeated soundcloud with text before and after', () => {
    // Arrange
    let string = `
**bold** string before youtube :soundloud http://www.youtube.com/watch?v=52c_QSg64fs after youtube :soundcloud http://www.youtube.com/watch?v=waefawefwaef *italics*
soft new line

new line
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('repeated soundcloud', () => {
    // Arrange
    let string = `:soundcloud http://www.youtube.com/watch?v=52c_QSg64fs :soundcloud http://www.youtube.com/watch?v=52c_QSg64fs :soundcloud http://www.youshit.com`

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })
})
