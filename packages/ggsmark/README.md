# GGSMark

This is the Markdown package used in the GGS.SX website.

## Usage

Basic usage example:

```js
// If you use ESModules
import ggsmark from 'ggsmark'

let output = ggsmark('**foo** bar')

console.log(output) // <p><strong>foo</strong> bar</p>
```

It's also worth investigating unit tests to understand the expected output.

## Examples

### Strikethrough
```markdown
~~Text~~
```

<!-- ### Spoiler
```
||secret suprise||
``` -->

### SoundCloud

```markdown
!(https://soundcloud.com/djtechnoboy/tnt-sound-rush-right-now)
```

### YouTube

```markdown
!(https://www.youtube.com/watch?v=pwmY1XUTBpE)
```

