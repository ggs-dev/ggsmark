import dedent from 'dedent'
import ggsmark from '../src/ggsmark'

describe('render soundcloud blocks', () => {
  test('single line', () => {
    // Arrange
    let string = dedent`
    !(https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion)
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('content before and after', () => {
    // Arrange
    let string =
      '**bold text** before text !(https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion) after text **bold**'

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('multiple occurrences', () => {
    // Arrange
    let string = dedent`
    !(https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion)
    !(https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion)
    !(https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion)
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })
})

describe('render youtube blocks', () => {
  test('repeated youtube with text before and after', () => {
    // Arrange
    let string = dedent`
    **bold** string before comyoutube !(http://www.youtube./watch?v=52c_QSg64fs) after youtube !(http://www.youtube.com/watch?v=waefawefwaef) *italics*
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
    let string = dedent`
    !(http://www.youtube.com/watch?v=52c_QSg64fs)
    !(http://www.youtube.com/watch?v=52c_QSg64fs)
    !(http://www.youshit.com)
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('youtube with timestamp', () => {
    // Arrange
    let string = dedent`!(https://youtu.be/IJhgZBn-LHg?t=712)`

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })
})
describe('render left alignment text', () => {
  test('single line', () => {
    // Arrange
    let string = dedent`
    <-LeftText<-
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })
  test('multi line', () => {
    // Arrange
    let string = dedent`
    <-This is a multiple line texts\n 2nd line here<-
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })
})

describe('render center alignment text', () => {
  test('single line', () => {
    // Arrange
    let string = dedent`
    ->CenterText<-
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })
  test('multi line', () => {
    // Arrange
    let string = dedent`
    ->This is a multiple line texts\n 2nd line here<-
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })
})

describe('render right alignment text', () => {
  test('single line', () => {
    // Arrange
    let string = dedent`
    ->RightText->
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })
  test('multi line', () => {
    // Arrange
    let string = dedent`
    ->This is a multiple line texts\n 2nd line here->
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })
})
