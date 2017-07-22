const fs = require('fs');
const postcss = require('postcss');

const cleanCss = (css) => css.replace(/\s+/g, ' ').replace(/'/g, '"').trim();

function PostcssVarMap({ file, prefix = '', suffix = '' }) {
    return function (root) {
        let varRules = new Map();
        root.walkRules(function (rule) {
            rule.walkDecls(function (decl) {
                // Add both CSS var setters and getters
                if (/^--/.test(decl.prop) || decl.value.includes('var(--')) {
                    const varDecl = [ decl.prop, decl.value ];
                    if (decl.important) {
                        varDecl.push('important');
                    }
                    const key = cleanCss(rule.selector);
                    varRules.set(key,
                        (varRules.get(key) || []).concat([varDecl])
                    );
                }
            });
        });

        let data = JSON.stringify(Array.from(varRules));
        data = `${prefix}${data}${suffix}`;

        return new Promise(function (resolve, reject) {
            fs.writeFile(file, data, function (err) {
                if (err) return reject(err);
                return resolve();
            });
        });
    };
}

module.exports = postcss.plugin('postcss-var-map', PostcssVarMap);
