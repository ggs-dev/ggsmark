# GGSMark

Markdown extension for the Gentlemen's Gaming Society website.

## Credits

This package is built on top of the [remarkjs/remark](https://github.com/remarkjs/remark) ecosystem. Mad props to the community and their [plugins](https://github.com/remarkjs/remark/blob/HEAD/doc/plugins.md#list-of-plugins).

## Installing

When you have Node JS installed run the following command in your project.

```bash
yarn add ggsmark
```

## Building

Clone this repository and install dependencies.

```bash
yarn
```

Run JavaScript unit tests run the following command.

```bash
yarn test
```

## Usage

Basic usage example:

```js
// If you use ESModules
import ggsmark from 'ggsmark'

let output = ggsmark('**foo** bar')

console.log(output) // <p><strong>foo</strong> bar</p>
```

It's also worth investigating unit tests to understand the expected output.

## Wiki

I've composed a wiki page to describe features of this extension.

### Markdown features

#### Strikethrough
```markdown
~~Text~~
```

<!-- #### Spoiler
```
||secret suprise||
``` -->

#### SoundCloud

```markdown
!(https://soundcloud.com/djtechnoboy/tnt-sound-rush-right-now)
```

#### YouTube

```markdown
!(https://www.youtube.com/watch?v=pwmY1XUTBpE)
```

#### Color

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

#### Text Alignment

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

