import ggsmark from '../src/ggsmark_soundcloud'

// describe('render text alignment', () => {
//   test('text center', () => {

//     // Arrange
//     let string = `:text-right\n# Heading\n\n**bold text**\ntest\n:text-right\ntest`

//     // Act
//     let result = ggsmark(string)

//     // Assert
//     expect(result).toMatchSnapshot()
//   })
// })

describe('render soundcloud blocks', () => {
  test('soundcloud iframe test', () => {
    // Arrange
    let string = `:soundcloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion`

    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toBe(`
    <div class=\"soundcloud_song\">
    <iframe width=\"100%" height=\"166" scrolling=\"no" frameborder=\"no" src=\"https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F871426135&show_artwork=true&maxheight=166"></iframe>
    <p>:soundloud https://soundcloud.com/iamcardib/wap-feat-megan-thee-stallion</p>
    </div>
    `)
  })
})
