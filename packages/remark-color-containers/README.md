# remark-text-alignment

Markdown extension for the Gentlemen's Gaming Society website.

## Usage

```js
import remark from 'remark'
import html from 'remark-html'
import color from 'remark-color-containers'

// Basic use
let output = remark()
  .use(html)
  .use(color)
  .processSync('example markdown text')
  .toString()

console.log(output)
```

## Options

TODO

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
!# 255,255,255
Hello!
!#

!# 255,255,255 (this is inline!)

# RGBA
!# 255,255,255,50
Hello!
!#

!# 255,255,255,50 (this is inline!)
```

