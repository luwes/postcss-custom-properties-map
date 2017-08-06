# PostCSS Var Shim [![Build Status][ci-img]][ci]

[PostCSS] plugin to generate a custom CSS var shim

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/luwes/postcss-var-shim.svg
[ci]:      https://travis-ci.org/luwes/postcss-var-shim

```css
.foo {
    color: var(--primary-color) !important;
}
```

```js
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.cssVarShim=e()}(this,function(){"use strict";function t(t,e){return(e=e||document).querySelectorAll(t)}function e(t){return u(t).reduce(function(t,n){return t.concat(n.cssRules?e(n.cssRules):n)},[])}function n(t,e,n){n=n||[];for(var r;null!==(r=e.exec(t));)n.push(r),e.lastIndex=r.index+r[0].length;return n}function r(t){return function(e){t.apply(this,e)}}function o(t,e){return e.reduce(function(t,e){return t?t[e]:void 0},t)}function c(t){return t=t||{},function(e){return t[e]=isNaN(t[e])?0:t[e]+1,t[e]}}function u(t){return[].slice.call(t)}function s(t){"loading"!==document.readyState?t():document.addEventListener("DOMContentLoaded",t)}return function(i){function a(t,e){var r=n(t,/--[^\s,)]+/g);return r.length&&r.forEach(function(n){var r=n[0],c=o(e,[r]);if(c){var u=new RegExp("var\\("+r+"(,[^)]+)?\\)");t=t.replace(u,c),t=a(t,e)}}),t}function f(e,n,r,o){var c=[document.documentElement];o&&":root"===o||(c=t(o)),u(c).forEach(function(t){t.style.setProperty(e,n,r||null,t)})}if(!(window.CSS&&CSS.supports&&CSS.supports("--a",0))){window.cssVarCache={};var l=CSSStyleDeclaration.prototype.setProperty;CSSStyleDeclaration.prototype.setProperty=function(n,s,f,d){if(/^--/.test(n)){window.cssVarCache[n]=s;var p=c();e(document.styleSheets).forEach(function(e){var c=e.selectorText,s=o(i.getVars,[n,c,p(c)]);s&&s.forEach(r(function(n,r,o){var s=a(r,window.cssVarCache);d?u(t(c)).forEach(function(t){d.contains(t)&&t.style.setProperty(n,s,o||null)}):e.style.setProperty(n,s,o||null)}))})}else l.call(this,n,s,f)},i.setVars.forEach(r(f)),s(function(){u(t('[data-style*="--"]')).forEach(function(t){var e=n(t.getAttribute("data-style"),/(--[^:]+)\s*:\s*([^;]+)/g);e.length&&e.forEach(r(function(e,n,r){t.style.setProperty(n,r,null,t)}))})})}}});
cssVarShim({
  "--primary-color": { 
    ".foo": { 
      "0": [["color","var(--primary-color)","important"]]
    }
  }
});
```

The shim consists of 2 parts, the [css var shim script](https://github.com/luwes/css-var-shim) (**2.36kb** minified) and a css var map which is created from the stylesheets you pass in this plugin.

## Features

- Sets CSS vars at runtime 
- Sets CSS vars via `element.style.setProperty()`
- Gets CSS vars via `element.style.getPropertyValue()`
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

## Add to HTML page

Unfortunately IE conditional comments were removed since IE11. If you don't mind an extra request you can add the shim directly to the head.

```html
<head>
    <link rel="stylesheet" href="app.css">
    <script src="css-var-shim.js"></script>
```

Alternatively add the shim dynamically with something like this. This has the drawback that if the HTML page is rendered before the shim gets executed a [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) is seen.

```html
<head>
    <link rel="stylesheet" href="app.css">
    <script>
        var cssVarSupport = window.CSS && CSS.supports && CSS.supports('--a', 0);
        cssVarSupport = false;
        if (!cssVarSupport) {
            var cssVarScript = document.createElement('script');
            cssVarScript.src = 'css-var-shim.js';
            cssVarScript.async = false;
            var firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore(cssVarScript, firstScript);
        }
    </script>
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

### Get a custom CSS property value

On the `:root` selector

```js
document.documentElement.style.getPropertyValue(propertyName);
```

On a specific element 

```js
myelement.style.getPropertyValue(propertyName, myelement);
```

> Warning: the specific element is passed as a 2nd argument. This does not follow the official API but was needed to make the shim work.

### Inline custom CSS properties

Normally it is possible to set custom CSS properties in the HTML style attribute for specific elements. Because IE and early Edge does not support them they are discarded at parsing.  

A workaround that this shim provides is to define the custom CSS properties in a `data-style` attribute. This way they can be accessed by the shim and set when the DOM is ready.

```html
<div style="--primary-color: #F44336; --primary-color-text: #FFF;" data-style="--primary-color: #F44336; --primary-color-text: #FFF;"></div>
```

## Support

Adds support for CSS Custom Properties to:

- Internet Explorer 11
- Edge 12
- Edge 13
- Edge 14
