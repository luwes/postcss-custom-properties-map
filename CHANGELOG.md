# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.5.1 - 2017-08-14
### Changed
- Fixed npm dependency `css-var-shim`.

## 0.5.0 - 2017-08-06
### Added
- Added support for `element.style.getPropertyValue()`.

## 0.4.0 - 2017-08-05
### Added
- Renamed plugin from `postcss-var-map` to `postcss-var-shim`.

## 0.3.0 - 2017-08-04
### Added
- Posibility to output the css var shim script with the css var map.

## 0.2.1 - 2017-07-31
### Added
- `remove` option to remove declarations with CSS vars to test a shim in a browser that does support custom CSS properties.

## 0.2.0 - 2017-07-29
### Added
- `setVars` property to store the defining of the custom CSS properties.
The selectors and selector indexes are passed along so the cascade can be taken in account.

## 0.1.0 - 2017-07-24
### Changed
- Restructure map to have the CSS vars first then selectors with relative index followed by the CSS declarations in an array. This way the lookup can be much more performant.

## 0.0.3 - 2017-07-22
### Changed
- Use a 2D array instead of map object to keep order, might need to order the rules on CSS specificity in the future.

## 0.0.2 - 2017-07-21
### Added
- Include both the CSS var setters and getters to the outputted map.
- A test to confirm the outputted map file is correct.

### Changed
- Use a more flexible prefix and suffix option instead of a var name.

## 0.0.1 - 2017-07-12
### Added
- Basic functionality to generate a JS map from the custom CSS properties.
