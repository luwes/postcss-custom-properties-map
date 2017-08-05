var postcss = require('postcss');
var plugin = require('./');

it('produces a correct CSS var map', () => {

    const opts = {
        mapFile: 'test/css-var-map.js',
        mapPrefix: 'module.exports = ',
        mapSuffix: '',
        shimFile: 'test/css-var-shim.js'
    };

    const input = `
        :root {
          --tint: springgreen !important;
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
        },
        setVars: [
            [
                '--tint', 'springgreen', 'important',
                ':root', 0
            ], [
                '--hint', 'lemonchiffon', 0,
                ':root', 0
            ], [
                '--tint', 'rebeccapurple', 0,
                '.button', 1
            ]
        ]
    };

    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            const file = require('./test/css-var-map.js');
            expect(file).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
});
