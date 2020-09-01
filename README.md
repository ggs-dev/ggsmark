# GGSMark

Markdown extension for the Gentlemen's Gaming Society website.

## Credits

This package is built on top of the [remarkjs/remark](https://github.com/remarkjs/remark) ecosystem. Mad props to the community and their [plugins](https://github.com/remarkjs/remark/blob/HEAD/doc/plugins.md#list-of-plugins).

## Installing

When you have Node JS installed run the following command in your project.

```bash
npm install ggsmark

# If you're a Yarn fan run this command.
yarn add ggsmark
```

## Building

Clone this repository and install dependencies.

```bash
# NPM install packages
npm install

# Or Yarn install packages
yarn
```

Run JavaScript unit tests run the following command.

```bash
npm run test
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
