# remark-text-alignment

![npm](https://img.shields.io/npm/v/remark-text-alignment)

![GitHub followers](https://img.shields.io/github/followers/johnnyhuy?style=social) ![GitHub stars](https://img.shields.io/github/stars/johnnyhuy/ggsmark?style=social)

[remark](https://github.com/remarkjs/remark) plugin to align text.

## Credits

Plugin was originally built on top of [zMarkdown's remark-align plugin](https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-align).

## Installation

```bash
npm i remark-text-alignment
```

## Usage

```js
import remark from 'remark'
import html from 'remark-html'
import alignment from 'remark-text-alignment'

// Basic use
remark()
  .use(html)
  .use(alignment)

...

// Use class names and set right class name to example-right
remark()
  .use(html)
  .use(alignment, {
    useClassNames: true,
    classNames: {
      left: 'example-right'
    }
  })

...
```

## Options

### `.use(color [, options])`

Add the color plugin to remark.

### `options`

#### `options.classNames`

Enable class names instead of inline CSS

**Default** `{}`

#### `options.useClassNames`

Object that contains left, right and center class names (useClassNames must be enabled)

**Default** `false`

## Examples

```markdown
# Center alignment
->
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tincidunt urna maximus sem congue, viverra ultrices purus porta. Aenean at porta mi. Donec ut felis consectetur, rutrum mauris non, sagittis ipsum. Quisque sit amet fringilla lorem. Curabitur euismod imperdiet nunc, et vehicula lorem scelerisque et. Fusce rutrum id lectus in pellentesque. Donec vel cursus dolor. Ut placerat justo nunc, a imperdiet libero posuere non. Nullam dolor ligula, efficitur a accumsan non, viverra quis lorem. Mauris at auctor ligula.
<-

# Right alignment
->
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tincidunt urna maximus sem congue, viverra ultrices purus porta. Aenean at porta mi. Donec ut felis consectetur, rutrum mauris non, sagittis ipsum. Quisque sit amet fringilla lorem. Curabitur euismod imperdiet nunc, et vehicula lorem scelerisque et. Fusce rutrum id lectus in pellentesque. Donec vel cursus dolor. Ut placerat justo nunc, a imperdiet libero posuere non. Nullam dolor ligula, efficitur a accumsan non, viverra quis lorem. Mauris at auctor ligula.
->

# Left alignment
<-
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tincidunt urna maximus sem congue, viverra ultrices purus porta. Aenean at porta mi. Donec ut felis consectetur, rutrum mauris non, sagittis ipsum. Quisque sit amet fringilla lorem. Curabitur euismod imperdiet nunc, et vehicula lorem scelerisque et. Fusce rutrum id lectus in pellentesque. Donec vel cursus dolor. Ut placerat justo nunc, a imperdiet libero posuere non. Nullam dolor ligula, efficitur a accumsan non, viverra quis lorem. Mauris at auctor ligula.
<-
```

