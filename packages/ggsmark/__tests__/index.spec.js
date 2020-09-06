import dedent from 'dedent'
import ggsmark from '../index'

describe('should have github-like markdown', () => {
  test('strikethrough', () => {
    // Arrange
    let string = dedent`
    ~~shit~~
    `
    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toBe(dedent`
    <p><del>shit</del></p>
    `)
  })

  test('auto-link', () => {
    // Arrange
    let string = dedent`
    visit https://ggs.sx/
    `
    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toBe(dedent`
    <p>visit <a href="https://ggs.sx/">https://ggs.sx/</a></p>
    `)
  })

  test('task lists', () => {
    // Arrange
    let string = dedent`
    - [x] Do work
    - [ ] Get a life
    - [ ] Open book
    `
    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toBe(dedent`
    <ul class="contains-task-list">
    <li class="task-list-item"><input type="checkbox" checked disabled> Do work</li>
    <li class="task-list-item"><input type="checkbox" disabled> Get a life</li>
    <li class="task-list-item"><input type="checkbox" disabled> Open book</li>
    </ul>
    `)
  })

  test('tables', () => {
    // Arrange
    let string = dedent`
    | Command | Description |
    | --- | --- |
    | git status | List all new or modified files |
    | git diff | Show file differences that haven't been staged |
    `
    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toBe(dedent`
    <table>
    <thead>
    <tr>
    <th>Command</th>
    <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>git status</td>
    <td>List all new or modified files</td>
    </tr>
    <tr>
    <td>git diff</td>
    <td>Show file differences that haven't been staged</td>
    </tr>
    </tbody>
    </table>
    `)
  })

  test('code fencing', () => {
    // Arrange
    let string = dedent`
    \`\`\`ruby
    require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
    \`\`\`
    `
    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toBe(dedent`
    <pre><code class="language-ruby">require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
    </code></pre>
    `)
  })
})

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

describe('do not render custom html', () => {
  test('span', () => {
    // Arrange
    let string = dedent`
    <span style="color: red">Test</span>
    `
    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toBe(dedent`
    <p>Test</p>
    `)
  })

  test('heading', () => {
    // Arrange
    let string = dedent`
    <h3 style="color: red">Test</h3>
    `
    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toBe(dedent`
    <p>Test</p>
    `)
  })

  test('div', () => {
    // Arrange
    let string = dedent`
    <div style="color: red">Test</div>
    `
    // Act
    let result = ggsmark(string)

    // Assert
    expect(result).toBe(dedent`
    <p>Test</p>
    `)
  })
})
