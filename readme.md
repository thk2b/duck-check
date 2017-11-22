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

Sample usage:

```js
const make_checker = require('duck_checker')

const check_person = make_checker({
    name: String,
    age: Number
})
check_person({
    name: 'Jane Doe',
    age: 30
}) // OK
check_person({
    name: 'Jon Snow',
    age: 26
}) // OK
check_person({
    name: 10001,
    age: 'some age'
}) // TypeError

const check_people_list = make_checker([{name: String, age: Number}])

check_people_list([
    {
        name: 'Jon Snow',
        age: 26
    },
    {
        name: 'Jane Doe',
        age: 30
    }
]) // OK

check_people_list([
    {
        name: 'Jon Snow',
        age: 26
    },
    {
        name: 'Jane Doe',
        age: '30'
    }
]) // TypeError

check_people_list(
    {
        name: 'Jon Snow',
        age: 26
    }
) // TypeError
```

The make_checker function takes an object or array called a schema. 
The schema represents the blueprint against which to check any object. 
A schema is a set of key:value pairs.

`make_checker(schema)` returns a check function. To test any object, call the returned function with any object to be checked against the original schema.

Caveats:

Because of limitations of `typeof`, it is not currently possible to check for a `null` property on an object, as `typeof null` is `'object'`
