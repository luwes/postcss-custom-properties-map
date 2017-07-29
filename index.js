const fs = require('fs');
const postcss = require('postcss');

function cleanCss(css) {
    return css.replace(/\s+/g, ' ').replace(/'/g, '"').trim();
}

function getMatches(str, regex, result = []) {
    let match;
    while ((match = regex.exec(str)) !== null) {
        result.push(match[0]);
        regex.lastIndex = match.index + match[0].length;
    }
    return result;
}

var count = (function makeCount(countMap) {
    countMap = countMap || {};
    return function (key) {
        countMap[key] = isNaN(countMap[key]) ? 0 : countMap[key] + 1;
        return countMap[key];
    };
}());

function PostcssVarMap({ file, prefix = '', suffix = '' }) {
    const isSetVar = /^--/;
    const matchGetVar = /--[^\s,)]+/g;

    return (root) => {
        let setVars = [];
        let getVars = {};

        root.walkRules((rule) => {
            const selector = cleanCss(rule.selector);
            const selectorCount = count(selector);

            rule.walkDecls(({ prop, value, important }) => {
                const varDecl = [ prop, value ];
                if (important) {
                    varDecl.push('important');
                }

                if (isSetVar.test(prop)) {
                    setVars.push([
                        prop,
                        value,
                        important ? 'important' : 0,
                        selector,
                        selectorCount
                    ]);
                }

                const varMatches = getMatches(value, matchGetVar);
                if (varMatches.length) {
                    varMatches.forEach((getVar) => {
                        if (!getVars[getVar]) {
                            getVars[getVar] = {};
                        }
                        if (!getVars[getVar][selector]) {
                            getVars[getVar][selector] = {};
                        }
                        if (!getVars[getVar][selector][selectorCount]) {
                            getVars[getVar][selector][selectorCount] = [];
                        }
                        getVars[getVar][selector][selectorCount].push(varDecl);
                    });
                }
            });
        });

        let data = JSON.stringify({
            setVars,
            getVars
        });
        data = `${prefix}${data}${suffix}`;

        return new Promise((resolve, reject) => {
            fs.writeFile(file, data, (err) => {
                if (err) return reject(err);
                return resolve();
            });
        });
    };
}

module.exports = postcss.plugin('postcss-var-map', PostcssVarMap);
