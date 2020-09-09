import remark from 'remark'
import html from 'remark-html'
import color from '..'
import dedent from 'dedent'

describe('color text with inline style', () => {
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

  test('should color multi line', () => {
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
