const fs = require('fs');
const postcss = require('postcss');
const utils = require('./utils');

function PostcssVarShim({
    mapFile = '',
    mapPrefix = '',
    mapSuffix = '',
    shimFile = 'css-var-shim.js',
    remove = false,
    cssFileName = ''
}) {
    const isSetVar = /^--/;
    const matchGetVar = /--[^\s,)]+/g;
    const count = utils.makeCount();

    return (root) => {
        let setVars = [];
        let getVars = {};

        root.walkRules((rule) => {
            const selector = utils.cleanCss(rule.selector);
            const selectorCount = count(selector);

            rule.walkDecls((decl) => {
                const { prop, value, important } = decl;
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

                    if (remove) {
                        decl.remove();
                    }
                }

                const varMatches = utils.getMatches(value, matchGetVar);
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

                    if (remove) {
                        decl.remove();
                    }
                }
            });
        });

        let map = JSON.stringify({
            setVars,
            getVars
        });

        const mapPromise = new Promise((resolve, reject) => {
            if (mapFile) {
                const format = `${mapPrefix}${map}${mapSuffix}`;
                fs.writeFile(mapFile, format, (err) => {
                    if (err) return reject(err);
                    return resolve();
                });
            } else {
                resolve();
            }
        });

        const shimPromise = new Promise((resolve, reject) => {
            fs.readFile(require.resolve('css-var-shim'), (err, shim) => {
                if (err) return reject(err);
                // Get the contents of the shim and append the executing shim
                // function with the css var map as an argument.
                shim += cssFileName ?
                  `cssVarShim(${map}, '${cssFileName}');` :
                  `cssVarShim(${map});`;
                return fs.writeFile(shimFile, shim, (writeErr) => {
                    if (writeErr) return reject(writeErr);
                    return resolve();
                });
            });
        });

        return Promise.all([mapPromise, shimPromise]);
    };
}

module.exports = postcss.plugin('postcss-var-shim', PostcssVarShim);
