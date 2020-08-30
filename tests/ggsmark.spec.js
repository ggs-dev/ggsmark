import ggsmark from '../src/ggsmark'

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

describe('render centered text', () => {
  test('single line text center', () => {
    let string = ':text-center Test123'
    let result = ggsmark(string)

    expect(result).toContain(`<p>
</p><div style=\"text-align: center\">  Test123
</div>
<p></p>`)
  })

  test('wrap text center', () => {
    let string = `:text-center yeet :text-center`
    let result = ggsmark(string)

    expect(result).toContain(``) // TODO

  test('text center with some text before and after', () => {
    let string = `this should not be in text center :text-center yeet :text-center after text`
    let result = ggsmark(string)

    expect(result).toContain(``) // TODO
  })

  test('text center in text center', () => {
    let string = ':text-center :text-center wtf :text-center :text-center'
    let result = ggsmark(string)

    expect(result).toContain(``) // TODO
  })
})

describe('render right allignment text', () => {
  test('text-right', () => {
    let string = ':text-right Test123'
    let result = ggsmark(string)

    expect(result).toContain(`<p>
</p><div style=\"text-align: right\">  Test123
</div>
<p></p>`)
  })
})

describe('render left allignment text', () => {
  test('text-left', () => {
    let string = ':text-left Test123'
    let result = ggsmark(string)

    expect(result).toContain(`<p>
</p><div style=\"text-align: left\">  Test123
</div>
<p></p>`)
  })
})
