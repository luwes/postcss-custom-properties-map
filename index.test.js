var postcss = require('postcss');
var plugin = require('./');

it('produces a correct CSS var map', () => {

    const opts = {
        file: 'test/css-var-map.js',
        prefix: 'module.exports = ',
        suffix: ''
    };

    const input = `
        :root {
          --tint: springgreen;
        }

        body {
          color: blueviolet;
          background-color: var(--tint);
        }

        @media (min-width: 415px) {
          .button {
            --tint: rebeccapurple;
            padding: 5px;
            color: var(--tint, purple);
          }
        }
    `;

    const output = {
        ':root': [['--tint', 'springgreen']],
        'body': [['background-color', 'var(--tint)']],
        '.button': [
            ['--tint', 'rebeccapurple'],
            ['color', 'var(--tint, purple)']
        ]
    };

    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            const file = require('./test/css-var-map.js');
            expect(file).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
});
