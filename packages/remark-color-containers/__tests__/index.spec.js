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

  test('should color multi line', () => {
    // Arrange
    let string = dedent`
    !# red
    Hello I should be in red text :D
    
    # Test

    Test
    123
    !#
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })
})

describe('color ast testing', () => {
  test('create color block', () => {
    // Arrange
    let string = dedent`
    # Hello world

    Test 123

    !# red
    Hello I should be in red text :D
    
    # Test

    Test
    123
    !#
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })
})
