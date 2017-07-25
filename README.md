# PostCSS Var Map [![Build Status][ci-img]][ci]

[PostCSS] plugin to generate a JS map with custom CSS props.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/luwes/postcss-var-map.svg
[ci]:      https://travis-ci.org/luwes/postcss-var-map

```css
.foo {
    color: var(--primary-color) !important;
}
```

```js
window.cssVarMap = {
  "--primary-color": { 
    ".foo": { 
      "0": [["color","var(--primary-color)","important"]]
    }
  }
};
```

## Usage

```js
postcss([ require('postcss-var-map')({
    file: 'css-var-map.js',
    prefix: 'window.cssVarMap = ',
    suffix: ';'
}) ])
```

## What is this for?

Provide a lookup map that can be used to build a fallback for IE and early Edge browsers for changing custom CSS properties at runtime. Based on rules who have declarations with custom CSS properties.

See [PostCSS] docs for examples for your environment.
