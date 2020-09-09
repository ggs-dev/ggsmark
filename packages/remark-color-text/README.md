# remark-color-text

Markdown extension for the Gentlemen's Gaming Society website.

## Usage

```js
import remark from 'remark'
import html from 'remark-html'
import color from 'remark-color-text'

// Basic use
let output = remark()
  .use(html)
  .use(color)
  .processSync('example markdown text')
  .toString()

console.log(output)
```

## Options

### `.use(color [, options])`

Add the color plugin to remark.

### `options`

#### `options.tokens`

Array of strings used to check tokens.

**Default** `['!#']`

#### `options.colorExpression`

Regular expression used to get the color from a tokenized block. The **first** capture group is set as the color.

**Default** `/^(?:(\#?[A-z0-9]{3,12}|\d{1,3}\,\s?\d{1,3}\,\s?\d{1,3}(\,\s?\d{1,3})?))?/`

## Examples

```markdown
# Worded colors
!# red
Hello I should be in red text :D
!#

!# red (this is inline!)

# 3 Character hex
!# #AAA
Hello!
!#

!# #AAA (this is inline!)

# 6 Character hex
!# #DADADA
Hello!
!#

!# #DADADA (this is inline!)

# RGB
!# rgb(255,255,255)
Hello!
!#

!# rgb(255,255,255) (this is inline!)

# RGBA
!# rgba(255,255,255,50)
Hello!
!#

!# rgba(255,255,255,50) (this is inline!)
```

