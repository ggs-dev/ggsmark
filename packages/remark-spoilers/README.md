# remark-spoilers

remark spoiler plugin that uses native [details and summary](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary) HTML elements.

```html
<details>
  <summary>I have keys but no doors. I have space but no room. You can enter but can’t leave. What am I?</summary>
  A keyboard.
</details>
```

## Usage

```js
import remark from 'remark'
import html from 'remark-html'
import spoilers from 'remark-spoilers'

remark()
  .use(html)
  .use(spoilers)

...
```

## Options

### `.use(spoilers [, options])`

Add the spoilers plugin to remark.

### `options`

#### `options.defaultSummary`

The default summary text in the spoiler.

**Default** `Open spoiler`

#### `options.token`

Token used to open and close spoilers text.

**Default** `!spoiler`

#### `options.detailsClassName`

Class name for the `<details />` HTML element. No class name set by default.

**Default** `''`

#### `options.summaryClassName`

Class name for the `<summary />` HTML element. No class name set by default.

**Default** `''`

## Examples

```markdown
# Basic spoiler
!spoiler
Hello world, I'm in a spoiler
!spoiler

# Basic spoiler with custom summary
!spoiler Hello summary, click me to open the spoiler!
Hello world, I'm in a spoiler
!spoiler
```
