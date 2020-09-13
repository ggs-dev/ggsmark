# GGSMark

![npm](https://img.shields.io/npm/v/ggsmark)

Markdown package used in the [GGS.SX](https://ggs.sx/) website.

## Installation

```bash
npm i ggsmark
```

## Usage

```js
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

### SoundCloud

```markdown
!(https://soundcloud.com/djtechnoboy/tnt-sound-rush-right-now)
```

### YouTube

```markdown
!(https://www.youtube.com/watch?v=pwmY1XUTBpE)
```
