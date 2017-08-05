# PostCSS Var Shim [![Build Status][ci-img]][ci]

[PostCSS] plugin to generate a CSS var shim.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/luwes/postcss-var-shim.svg
[ci]:      https://travis-ci.org/luwes/postcss-var-shim

```css
.foo {
    color: var(--primary-color) !important;
}
```

```js
{
  "--primary-color": { 
    ".foo": { 
      "0": [["color","var(--primary-color)","important"]]
    }
  }
}
```

## Features

- Sets CSS vars at runtime 
- Sets CSS vars via `element.style.setProperty()`
- Adds fallback for HTML inline CSS vars

## Install

```bash
npm install --save-dev postcss-var-shim
```

## Usage

```js
postcss([ require('postcss-var-shim')({
    mapFile: 'css-var-map.js',
    shimFile: 'css-var-shim.js'
}) ])
```

## API

### Set a custom CSS property

On the `:root` selector

```js
document.documentElement.style.setProperty(propertyName, value, 'important');
```

On a specific element 

```js
myelement.style.setProperty(propertyName, value, null, myelement);
```

> Warning: the specific element is passed as a 4th argument. This does not follow the official API but was needed to make the shim work.

### Inline custom CSS properties

Normally it is possible to set custom CSS properties in the HTML style attribute for specific elements. Because IE and early Edge does not support them they are discarded at parsing.  

A workaround that this shim provides is to define the custom CSS properties in a `data-style` attribute. This way they can be accessed by the shim and set when the DOM is ready.

```html
<div style="--primary-color: #F44336; --primary-color-text: #FFF;" data-style="--primary-color: #F44336; --primary-color-text: #FFF;"></div>
```

Also keep the orginal `style` attribute of course for modern browsers.
