import remark from 'remark'
import html from 'remark-html'
import color from '../src'
import dedent from 'dedent'

describe('block color text with inline style', () => {
  test('should not color if token never ends', () => {
    // Arrange
    let string = dedent`
    !# red

    this should not be red

    there's no end!!!
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should short line', () => {
    // Arrange
    let string = dedent`
    !# red
    123
    !#
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should color in lowercase', () => {
    // Arrange
    let string = dedent`
    !# Red
    123
    !#
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should not color if lowercase is turned off', () => {
    // Arrange
    let string = dedent`
    !# rEd
    123
    !#
    `

    // Act
    let result = remark()
      .use(html)
      .use(color, { lowercase: false })
      .processSync(string)
      .toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should color rgba', () => {
    // Arrange
    let string = dedent`
    !# rgba(100 ,100, 100, 10)
    123
    !#
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should color rgb', () => {
    // Arrange
    let string = dedent`
    !# rgb(100 ,100, 100)
    123
    !#
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should color hex 3 characters', () => {
    // Arrange
    let string = dedent`
    !# #A0D
    123
    !#
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should color hex 6 characters', () => {
    // Arrange
    let string = dedent`
    !# #D0E10E
    123
    !#
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should not escape', () => {
    // Arrange
    let string = dedent`
    !# #D0E10E; height: 9999px; width: 9999px;"
    123
    !#
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('multiple lines of coloring', () => {
    // Arrange
    let string = dedent`
    # Hello world before color

    before color

    !# red
    Hello I should be in red text right under the start point

    # I should still be red text

    !#

    text in between

    !# blue
    Hello I should be in blue text right under the start point

    # I should still be blue text

    more text
    I'm right above the color token and should still be blue
    !#
    I'm right under the end token
    after text

    ## Some more headings
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })
})

describe('inline color text with inline style', () => {
  test('should color single line', () => {
    // Arrange
    let string = dedent`
    !# red (this is inline!)
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should not color if not closed', () => {
    // Arrange
    let string = dedent`
    !# red (this is inline!
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should color between text', () => {
    // Arrange
    let string = dedent`
    Test

    Lorem ipsum dolor sit !# red (**Vestibulum cursus volutpat auctor**), consectetur adipiscing elit.
    Vestibulum cursus volutpat auctor. !# #D0E10E (Pellentesque euismod) ipsum placerat arcu condimentum mattis.

    Lorem ipsum dolor sit !# red (amet), consectetur adipiscing elit.
    Vestibulum cursus volutpat auctor. !# #D0E10E (Pellentesque euismod) ipsum placerat arcu condimentum mattis.
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should not split by nbsp character', () => {
    // Arrange
    let string = `!# #D0E10E (hello&nbsp;world)`

    // Act
    let result = remark().use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })
})
