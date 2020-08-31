import ggsmark from '../src/ggsmark'

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

describe('render colour blocks', () => {
  test('colour wrapped', () => {
    // Arrange
    let string = `
**before bold text**
before text

:colour red

# Start of colour heading

**bold text**

plain text

<h1>HTML Heading</h1>
<p>This is HTML inline <strong>bold</strong> text</p>
<p>another paragraph inline HTML</p>

:colour

**after colour bold text**

# Another Heading after colour
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })

  test('parse colour when no new lines between colour', () => {
    // Arrange
    let string = `
**before bold text**
before text
~color red
# Start of colour heading

**bold text**

plain text

<h1>HTML Heading</h1>
<p>This is HTML inline <strong>bold</strong> text</p>
<p>another paragraph inline HTML</p>
~color

**after colour bold text**

# Another Heading after colour
    `

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toMatchSnapshot()
  })
})
