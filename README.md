curlyfy
=======

**curlyfy** adds curly brackets to a whitespace indented string like this:

```
/* input */
a
    b
        c
            d
            e
    f
```

```
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

```
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

```
npm install --save curlyfy
```

```
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

```
var output = curlyfy(input, {insertSemicolons: true})
```

```
/* input */
++i
--i
(x || y).doSomething()
[a, b, c].forEach(doSomething)
```

```
/* output */
;++i
;--i
;(x || y).doSomething()
;[a, b, c].forEach(doSomething)
```

TO-DO:
------

- Handle trailing comments
- Normalize indentations
- Make special cases optional
