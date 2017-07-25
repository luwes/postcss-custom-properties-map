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
          --hint: lemonchiffon;
        }

        body {
          color: blueviolet;
          background-color: var(--tint);
        }

        .button {
            color: gray;
        }

        @media (min-width: 415px) {
          .button {
            --tint: rebeccapurple;
            padding: 5px;
            color: var(--tint, var(--hint, pink));
            border-color: var(--hint);
          }
        }
    `;

    const output = {
        getVars: {
            '--tint': {
                'body': {
                    0: [['background-color', 'var(--tint)']]
                },
                '.button': {
                    1: [
                        ['color', 'var(--tint, var(--hint, pink))']
                    ]
                }
            },
            '--hint': {
                '.button': {
                    1: [
                        ['color', 'var(--tint, var(--hint, pink))'],
                        ['border-color', 'var(--hint)']
                    ]
                }
            }
        }
    };

    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            const file = require('./test/css-var-map.js');
            expect(file).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
});

// rules: [
//     [':root', [['--tint', 'springgreen'], ['--hint', 'lemonchiffon']]],
//     ['body', [['background-color', 'var(--tint)']]],
//     ['.button', [
//         ['--tint', 'rebeccapurple'],
//         ['color', 'var(--tint, var(--hint, pink))'],
//         ['border-color', 'var(--hint)']
//     ]]
// ]
