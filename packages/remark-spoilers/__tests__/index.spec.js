import remark from 'remark'
import html from 'remark-html'
import color from '..'
import dedent from 'dedent'

describe('spoilers', () => {
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
})
