curlyfy
=======

[![Build Status](https://travis-ci.org/rstuven/curlyfy.svg)](https://travis-ci.org/rstuven/curlyfy)
[![Coverage Status](https://coveralls.io/repos/rstuven/curlyfy/badge.svg)](https://coveralls.io/r/rstuven/curlyfy)
[![dependencies Status](https://david-dm.org/rstuven/curlyfy.svg)](https://david-dm.org/rstuven/curlyfy#info=dependencies)
[![devDependencies Status](https://david-dm.org/rstuven/curlyfy/dev-status.svg)](https://david-dm.org/rstuven/curlyfy#info=devDependencies)

**curlyfy** adds curly brackets to a whitespace indented string like this:

``` javascript
/* input */
a
    b
        c
            d
            e
    f
```

``` javascript
/* output */
a {
    b {
        c {
            d
            e
        }
    }
    f
}
```

It handles some special cases too:

``` javascript
/* input and output, no curly brackets added */

// trailing opening curly bracket
a = {
  b: c
}

// trailing opening square bracket
a = [
  b,
  c
]

// trailing opening parentheses
fn(
  a,
  b,
  c)

// trailing comma
fn(a,
   b,
   c)

```

Usage
-----

``` shell
npm install --save curlyfy
```

``` javascript
var curlyfy = require('curlyfy');
var output = curlyfy(input [, options]);
```

Options
-------

**insertSemicolons**: *(default: false)*

Support
[JavaScript semicolon-less style]
(https://docs.npmjs.com/misc/coding-style#semicolons)
gotchas.
Because we guess that if you ditched braces
you will probably ditch semicolons too ;)

For example:

``` javascript
var output = curlyfy(input, {insertSemicolons: true})
```

``` javascript
/* input */
++i
--i
(x || y).doSomething()
[a, b, c].forEach(doSomething)
```

``` javascript
/* output */
;++i
;--i
;(x || y).doSomething()
;[a, b, c].forEach(doSomething)
```

TO-DO:
------

- Handle trailing comments
- Handle multiline comments
- Normalize indentations
- Make special cases optional
