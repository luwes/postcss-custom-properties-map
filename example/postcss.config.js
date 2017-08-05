module.exports = {
    plugins: [
        // in your code it will be
        // require('postcss-var-map')({
        require('../index.js')({
            mapFile: 'example/css-var-map.json',
            shimFile: 'example/css-var-shim.js'
        })
    ]
};
