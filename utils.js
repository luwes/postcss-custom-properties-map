
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

function makeCount(countMap) {
    countMap = countMap || {};
    return function (key) {
        countMap[key] = isNaN(countMap[key]) ? 0 : countMap[key] + 1;
        return countMap[key];
    };
}

module.exports = {
    cleanCss,
    getMatches,
    makeCount
};
