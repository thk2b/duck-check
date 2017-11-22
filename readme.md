## duck-check

A minimalist runtime type checking utility.

🚧 This project is work-in-progress 🚧

___

<b>TODO:</b>

🚧 core:
- [x] Simplify public API: implement `check(schema)(duck)` 
- [x] Handle `null`, `NaN`, `undefined`
- [ ] Write `validate_schema`


🎨 printing:
- [x] Improve error messages
- [ ] Print schema 
- [ ] Batch errors in array and object checkers

🌐 share:
- [ ] Write Documentation
- [ ] Improve examples
- [ ] publish to NPM

🏆 possible improvments: 
- [ ] Check (and improve) performance 
- [ ] Consider making `check` return a boolean and error object instead of raising errors. 
Usage: `if(check(Number)(1)){...}`
___

Usage:

```js

const check = require('duck-check')

check({ x: Number, y: Number })({ x: 10, y: 15 })
check({ x: Number, y: Number })({ x: 10, y: 'hello' }) 
/* TypeError: Error in object: Expected 'number'. Got 'string'. */

const validate_point = check({ x: Number, y: Number })

validate_point({ x: 10, oups: 15 }) 
/* TypeError: Error in object: Expected key 'y' but was undefined.. */

validate_point({
    x: 10, 
    y: 15, 
    some_other_key: 'some_other value'
})

check([ Number ])([1,2,3])
check([ Number ])([1,2,'a']) 
/* TypeError: Invalid element in array: Expected 'number'. Got 'string'. */

check([ Number ])(1) 
/* TypeError: Expected 'array'. Got 'number'. */

check([ Number, String ])([1, '1'])
check([ Number, String ])([1, 456, '1']) 
/* TypeError: Invalid element in array: Expected positional array of length '2'. Got array of length '3'. */

check([[ Number, [ String ]]])([ /* array of (number and array of string) */
    [ 1, [ 'a', 'b' ]], [ 2, [ 'c','d' ]]
])
check([[ Number, [ String ]]])([
    [ 1, [ 'a', 'b' ]], [ 2, [ null,'d' ]]
]) 
/* TypeError: Invalid element in array: Invalid element in array: Invalid element in array: Expected 'string'. Got 'null'. */

check([ validate_point ])([{ x: 1, y: 1 }, { x: 10, y: 10 }])
check([ validate_point ])([{ x: 1, y: 1 }, { x: 10, xyz: 10 }]) 
/* TypeError: Invalid element in array: Error in object: Expected key 'y' but was undefined */

const validate = check({ name: String, data: { x: Number, y: Number }})

const data = [
    { name: 'A', data: { x: 1, y: 2 } },
    { name: 'B', data: { x: NaN, y: 2 } },
    { full_name: 'C', data: { x: 1, y: 2 } }
] 

data.forEach( el => validate(el) ) 
/* TypeError: Error in object: Error in object: Expected 'number'. Got 'NaN'. */

```

