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
    const matchGetVar = /--[^\s,)]+/g;

    return (root) => {
        let getVars = {};

        root.walkRules((rule) => {
            const selector = cleanCss(rule.selector);
            const selectorCount = count(selector);

            rule.walkDecls(({ prop, value, important }) => {
                const varMatches = getMatches(value, matchGetVar);
                if (varMatches.length) {
                    varMatches.forEach((getVar) => {
                        const varDecl = [ prop, value ];
                        if (important) {
                            varDecl.push('important');
                        }

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

        let data = {};
        data.getVars = getVars;
        data = JSON.stringify(data);
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
