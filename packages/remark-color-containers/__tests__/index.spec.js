import remark from 'remark'
import html from 'remark-html'
import color from '..'
import dedent from 'dedent'

describe('align text with inline style', () => {
  test('should align single line', () => {
    // Arrange
    let string = dedent`
    <-LeftText<-
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('should align multi line', () => {
    // Arrange
    let string = dedent`
    <-This is a multiple line texts
    2nd line here<-
    `

    // Act
    let result = remark().use(html).use(color).processSync(string).toString()

    // Assert
    expect(result).toMatchSnapshot()
  })
})
