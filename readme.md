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


check({ x: Number, y: Number })({ x: 10, y: 15 }))
check({ x: Number, y: Number })({ x: 10, y: 'hello' })) /* -> TypeError */

const validate_point = check({ x: Number, y: Number })

validate_point({ x: 10, oups: 15 }) /* -> TypeError */

validate_point({
    x: 10, 
    y: 15, 
    some_other_key: 'some_other value'
})) /* -> undefined */


check([ Number ])([1,2,3])
check([ Number ])([1,2,'a']) /* -> TypeError */
check([ Number ])(1) /* -> TypeError */

check([ Number, String ])([1, '1'])
check([ Number, String ])([1, 456, '1']) /* -> TypeError */

check([[ Number, [ String ]]])([ /* array of (number and array of string) */
    [ 1, [ 'a', 'b' ]], [ 2, [ 'c','d' ]]
]
check([[ Number, [ String ]]])([
    [ 1, [ 'a', 'b' ]], [ 2, [ null,'d' ]]
] /* -> TypeError */

check([ validate_point ])([{ x: 1, y: 1 }, { x: 10, y: 10 }])
check([ validate_point ])([{ x: 1, y: 1 }, { x: 10, xyz: 10 }]) /* -> TypeError */


const validate = check({ name: String, data: { x: Number, y: Number }})

const data = [
    { name: 'A', data: { x: 1, y: 2 } },
    { name: 'B', data: { x: NaN, y: 2 } },
    { full_name: 'C', data: { x: 1, y: 2 } }
] 

data.forEach( el => validate(el) ) /* TypeError */



```

