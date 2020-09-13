# remark-color-text

[remark](https://github.com/remarkjs/remark) plugin to color text via block and inline text in Markdown.

## Usage

```js
import remark from 'remark'
import html from 'remark-html'
import color from 'remark-color-text'

remark()
  .use(html)
  .use(color)

...
```

## Options

### `.use(color [, options])`

Add the color plugin to remark.

### `options`

#### `options.token`

Token used to open and close colored text.

**Default** `!#`

#### `options.colorExpression`

Regular expression used to get the color from a tokenized block. The **first** capture group is set as the color.

**Default** `/^\s*(rgba?\(\d{1,3}\s*\,\s*\d{1,3}\s*\,\s*\d{1,3}\s*(\,\s*\d{1,3}\s*)?\)|(\#?[A-z0-9]{3,12}))?/`

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

