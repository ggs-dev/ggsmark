import remark from 'remark'
import html from 'remark-html'
import color from '..'
import dedent from 'dedent'

describe('spoilers', () => {
  test('should show spoiler without custom summary', () => {
    // Arrange
    let string = dedent`
    !spoiler
    peek-a-boo!
    !spoiler
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should show spoiler with custom summary', () => {
    // Arrange
    let string = dedent`
    !spoiler Click me to see a surprise
    peek-a-boo!
    !spoiler
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should show multiple spoilers', () => {
    // Arrange
    let string = dedent`
    # Hello world

    This is some text.

    !spoiler Click me to see a surprise
    peek-a-boo!
    !spoiler

    between the spoilers

    !spoiler Another click me to see a surprise
    peek-a-boo!
    !spoiler

    the end
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should not show spoiler if not closed', () => {
    // Arrange
    let string = dedent`
    !spoiler
    
    why isn't this working!?

    there's no end!!!
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })
})
