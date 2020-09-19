import dedent from 'dedent'
import ggsmark from '../src'

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
    <pre><code class="hljs language-ruby"><span class="hljs-keyword">require</span> <span class="hljs-string">'redcarpet'</span>
    markdown = Redcarpet.new(<span class="hljs-string">"Hello World!"</span>)
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

  test('should not show iframe inline', () => {
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

describe('render twitch blocks', () => {
  test('single line', () => {
    // Arrange
    let string = dedent`
    !(https://clips.twitch.tv/LovelyAstuteCoffeeImGlitch)
    `

    // Act
    let result = ggsmark(string, { twitchParents: ['ggs.sx', 'example.com'] })

    // Assert
    expect(result).toBe(dedent`
    <iframe src="https://clips.twitch.tv/embed?parent=ggs.sx&#x26;parent=example.com&#x26;clip=LovelyAstuteCoffeeImGlitch" width="560" height="315" allowfullscreen frameborder="0"></iframe>
    `)
  })

  test('should not show iframe inline', () => {
    // Arrange
    let string = dedent`
    **bold text** before text !(https://clips.twitch.tv/LovelyAstuteCoffeeImGlitch) after text **bold**
    `

    // Act
    let result = ggsmark(string, { twitchParents: ['ggs.sx', 'example.com'] })

    // Assert
    expect(result).toBe(dedent`
    <p><strong>bold text</strong> before text !(<a href="https://clips.twitch.tv/LovelyAstuteCoffeeImGlitch">https://clips.twitch.tv/LovelyAstuteCoffeeImGlitch</a>) after text <strong>bold</strong></p>
    `)
  })

  test('multiple occurrences', () => {
    // Arrange
    let string = dedent`
    !(https://clips.twitch.tv/LovelyAstuteCoffeeImGlitch)
    !(https://clips.twitch.tv/LovelyAstuteCoffeeImGlitch)
    !(https://clips.twitch.tv/LovelyAstuteCoffeeImGlitch)
    `

    // Act
    let result = ggsmark(string, { twitchParents: ['ggs.sx', 'example.com'] })

    // Assert
    expect(result).toBe(dedent`
    <iframe src="https://clips.twitch.tv/embed?parent=ggs.sx&#x26;parent=example.com&#x26;clip=LovelyAstuteCoffeeImGlitch" width="560" height="315" allowfullscreen frameborder="0"></iframe>
    <iframe src="https://clips.twitch.tv/embed?parent=ggs.sx&#x26;parent=example.com&#x26;clip=LovelyAstuteCoffeeImGlitch" width="560" height="315" allowfullscreen frameborder="0"></iframe>
    <iframe src="https://clips.twitch.tv/embed?parent=ggs.sx&#x26;parent=example.com&#x26;clip=LovelyAstuteCoffeeImGlitch" width="560" height="315" allowfullscreen frameborder="0"></iframe>
    `)
  })

  test('set one twitch parent', () => {
    // Arrange
    let string = dedent`
    !(https://clips.twitch.tv/LovelyAstuteCoffeeImGlitch)
    `

    // Act
    let result = ggsmark(string, { twitchParents: ['ggs.sx'] })

    // Assert
    expect(result).toBe(dedent`
    <iframe src="https://clips.twitch.tv/embed?parent=ggs.sx&#x26;clip=LovelyAstuteCoffeeImGlitch" width="560" height="315" allowfullscreen frameborder="0"></iframe>
    `)
  })

  test('should show twitch video', () => {
    // Arrange
    let string = dedent`
    !(https://twitch.tv/videos/732347536)
    `

    // Act
    let result = ggsmark(string, { twitchParents: ['ggs.sx'] })

    // Assert
    expect(result).toBe(dedent`
    <iframe src="https://player.twitch.tv/?parent=ggs.sx&#x26;video=732347536" width="560" height="315" allowfullscreen frameborder="0"></iframe>
    `)
  })

  test('should show twitch channel', () => {
    // Arrange
    let string = dedent`
    !(https://twitch.tv/vinesauce)
    `

    // Act
    let result = ggsmark(string, { twitchParents: ['ggs.sx'] })

    // Assert
    expect(result).toBe(dedent`
    <iframe src="https://player.twitch.tv/?parent=ggs.sx&#x26;channel=vinesauce" width="560" height="315" allowfullscreen frameborder="0"></iframe>
    `)
  })

  test('should show twitch channel using player url', () => {
    // Arrange
    let string = dedent`
    !(https://player.twitch.tv/?channel=vinesauce)
    `

    // Act
    let result = ggsmark(string, { twitchParents: ['ggs.sx'] })

    // Assert
    expect(result).toBe(dedent`
    <iframe src="https://player.twitch.tv/?parent=ggs.sx&#x26;channel=vinesauce" width="560" height="315" allowfullscreen frameborder="0"></iframe>
    `)
  })

  test('should show twitch video using player url', () => {
    // Arrange
    let string = dedent`
    !(https://player.twitch.tv/?video=741520731)
    `

    // Act
    let result = ggsmark(string, { twitchParents: ['ggs.sx'] })

    // Assert
    expect(result).toBe(dedent`
    <iframe src="https://player.twitch.tv/?parent=ggs.sx&#x26;video=741520731" width="560" height="315" allowfullscreen frameborder="0"></iframe>
    `)
  })

  test('should show twitch video using player url', () => {
    // Arrange
    let string = dedent`
    !(https://player.twitch.tv/?video=741520731)
    `

    // Act
    let result = ggsmark(string, { twitchParents: ['ggs.sx'] })

    // Assert
    expect(result).toBe(dedent`
    <iframe src="https://player.twitch.tv/?parent=ggs.sx&#x26;video=741520731" width="560" height="315" allowfullscreen frameborder="0"></iframe>
    `)
  })
})

describe('render code blocks highlighted', () => {
  test('should highlight javascript', () => {
    // Arrange
    let string = dedent`
    \`\`\`javascript
    let dog = true

    if (dog) {
      console.log('woof')
    }
    \`\`\`
    `

    // Act
    let result = ggsmark(string, { twitchParents: ['ggs.sx'] })

    // Assert
    expect(result).toBe(dedent`
    <pre><code class="hljs language-javascript"><span class="hljs-keyword">let</span> dog = <span class="hljs-literal">true</span>

    <span class="hljs-keyword">if</span> (dog) {
      <span class="hljs-built_in">console</span>.log(<span class="hljs-string">'woof'</span>)
    }
    </code></pre>
    `)
  })
})
