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
window.cssVarMap = {".foo":[["color","var(--primary-color)","important"]]}
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

Provide a fallback for IE and early Edge browsers for changing custom CSS properties at runtime. Based on rules who have declarations with custom CSS properties. A naive implementation which does a simple find and replace:

```js
    function setCssVar(prop, value, el) {
        if (Support.cssVar) {
            el.style.setProperty(prop, value);
        }
        else {
            const foundSheet = Array.from(document.styleSheets).find((sheet) => /player\.css/.test(sheet.href));
            const cssRules = Array.from(foundSheet.cssRules);
            const varMap = window.cssVarMap;
            for (let selector in varMap) {
                const isStyleRuleWithSelector = (rule) => rule.type === 1
                    && cleanCss(rule.selectorText) === selector;
                const varRule = cssRules.find(isStyleRuleWithSelector);
                if (varRule) {
                    // One rule could have multiple declarations with custom css props.
                    const declarations = varMap[selector];
                    declarations.forEach(([declProp, declValue, declImportant]) => {
                        // Test if the property is used in the declaration value.
                        const varRegex = new RegExp('var\\(' + prop + '\\)');
                        if (varRegex.test(declValue)) {
                            const replacedValue = declValue.replace(varRegex, value);
                            // IE doesn't like undefined as the important argument
                            declImportant = declImportant || null;
                            varRule.style.setProperty(declProp, replacedValue, declImportant);
                        }
                    });
                }
            }
        }
    }
```

See [PostCSS] docs for examples for your environment.
