# GGSMark

[![Build Status](https://dev.azure.com/johnnyhuy/ggsmark/_apis/build/status/GGSMark.js%20Build%20%26%20Release?branchName=master)](https://dev.azure.com/johnnyhuy/ggsmark/_build/latest?definitionId=10&branchName=master) ![npm](https://img.shields.io/npm/v/ggsmark) ![GitHub followers](https://img.shields.io/github/followers/johnnyhuy?style=social)

CommonMark extension for the Gentlemen's Gaming Society website.

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
