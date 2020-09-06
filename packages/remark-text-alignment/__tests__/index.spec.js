import remark from 'remark'
import html from 'remark-html'
import alignment from '..'
import dedent from 'dedent'

describe('align text with inline style', () => {
  test('should align single line', () => {
    // Arrange
    let string = dedent`
    <-LeftText<-
    `

    // Act
    let result = remark()
      .use(html)
      .use(alignment, { useInlineStyles: true })
      .processSync(string)
      .toString()

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
    let result = remark()
      .use(html)
      .use(alignment, { useInlineStyles: true })
      .processSync(string)
      .toString()

    // Assert
    expect(result).toMatchSnapshot()
  })
})

describe('align text with class names', () => {
  test('should align single line', () => {
    // Arrange
    let string = dedent`
    <-LeftText<-
    `

    // Act
    let result = remark()
      .use(html)
      .use(alignment)
      .processSync(string)
      .toString()

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
    let result = remark()
      .use(html)
      .use(alignment)
      .processSync(string)
      .toString()

    // Assert
    expect(result).toMatchSnapshot()
  })
})
