import ggsmark from '../src/ggsmark'

describe('render centered text', () => {
  test('single line text center', () => {
    let string = ':text-center Test123'
    let result = ggsmark(string)

    expect(result).toMatchSnapshot()
  })

  test('wrap text center', () => {
    let string = `:text-center yeet :text-center`
    let result = ggsmark(string)

    expect(result).toMatchSnapshot()
  })

  test('text center with some text before and after', () => {
    let string = `this should not be in text center :text-center yeet :text-center after text`
    let result = ggsmark(string)

    expect(result).toMatchSnapshot()
  })

  test('text center in text center', () => {
    let string = ':text-center test :text-center wtf :text-center test :text-center'
    let result = ggsmark(string)

    expect(result).toMatchSnapshot()
  })

  test('use bold text', () => {
    let string = '\n\n:text-center\n\n**test** \n:text-center'
    let result = ggsmark(string)

    expect(result).toMatchSnapshot()
  })

  test('use bold text single line', () => {
    let string = ':text-center **bold**'
    let result = ggsmark(string)

    expect(result).toMatchSnapshot()
  })

  test('use heading', () => {
    let string = '\n\n:text-center\n# test\n:text-center'
    let result = ggsmark(string)

    expect(result).toMatchSnapshot()
  })
})

describe('render right allignment text', () => {
  test('text-right', () => {
    let string = ':text-right Test123'
    let result = ggsmark(string)

    expect(result).toMatchSnapshot()
  })
})

describe('render left allignment text', () => {
  test('text-left', () => {
    let string = ':text-left Test123'
    let result = ggsmark(string)

    expect(result).toMatchSnapshot()
  })
})

describe('render soundcloud blocks', () => {
  test('single line', () => {
    // Arrange
    let string =
      ':soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion'

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('content before and after', () => {
    // Arrange
    let string =
      '**bold text** before text :soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion after text **bold**'

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('multiple occurrences', () => {
    // Arrange
    let string =
      ':soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion :soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion :soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion :soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion'

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })
})


describe('render youtube blocks', () => {
  test('repeated youtube with text before and after', () => {
    // Arrange
    let string = `
**bold** string before comyoutube :youtube http://www.youtube./watch?v=52c_QSg64fs after youtube :youtube http://www.youtube.com/watch?v=waefawefwaef *italics*
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
