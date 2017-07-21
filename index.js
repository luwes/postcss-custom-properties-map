const fs = require('fs');
const postcss = require('postcss');

const cleanCss = (css) => css.replace(/\s+/g, ' ').replace(/'/g, '"').trim();

module.exports = postcss.plugin('postcss-var-map', function (opts) {
    opts = opts || {};
    return function (root) {
        let varRules = {};
        root.walkRules(function (rule) {
            rule.walkDecls(function (decl) {
                // Add both CSS var setters and getters
                if (/^--/.test(decl.prop) || decl.value.includes('var(--')) {
                    const key = cleanCss(rule.selector);
                    if (!varRules[key]) {
                        varRules[key] = [];
                    }
                    const varDecl = [ decl.prop, decl.value ];
                    if (decl.important) {
                        varDecl.push('important');
                    }
                    varRules[key].push(varDecl);
                }
            });
        });

        let data = JSON.stringify(varRules);
        if (opts.globalVarName) {
            data = `window.${opts.globalVarName} = ${data}`;
        }

        return new Promise(function (resolve, reject) {
            fs.writeFile(opts.file, data, function (err) {
                if (err) return reject(err);
                return resolve();
            });
        });
    };
});
