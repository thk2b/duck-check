## duck-check

A minimalist runtime type checking utility.

[![npm version](https://badge.fury.io/js/duck-check.svg)](https://badge.fury.io/js/duck-check)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

### v1.1 TODO

- [x] Assert function: retrurns a Boolean instead of throwing a TypeError.
- [x] Support checking for instances of a class. Usage: `check(Date)(new Date())`.
- [x] Add modifiers. Usage: `either(Number,null)`, `not(null)`
- [ ] Update Docs and examples. Add API section to docs. Work with jsdocs

## Usage:
### Installation
`duck-check` is a Javascript package published in the NPM registry. Install by running
```
npm install --save duck-check
```

### Quick Start
```js

const { check, assert, modifiers } = require('duck-check')
const { not, any, either, nonEmpty } = modifiers

check(Number)(1)
check(Number)(NaN) 
/*
TypeError:
 - Expected number: Got NaN
*/

assert(Number)(1) /* true */
assert(Number)('a') /* false */

check(Boolean)(true)
check(Boolean)('very true')
/*
TypeError:
 - Expected boolean: Got string 'very true'
*/

// Reuse a checker-function
const validate_person = check({
  name: String, 
  age: Number,
  transactions: [{
      amount: Number
  }]
})

validate_person({
  name: 'Jane Doe', 
  age: 46,
  transactions: [{
      amount: 12.32
  },{
      amount: 1234,
  }]
})

validate_person({
  name: 'Joe Blank', 
  age: 46,
  transactions: [{
      amount: NaN
  }]
})
/*
TypeError:
 - Invalid property in object {"name":"Joe Blank","age":46,"transactions":[{"amount":null}]}:
     - Invalid element in array [{"amount":null}]:
         - 2 invalid properties in object {"amount":null}:
             - Expected number: Got NaN
*/

// check for class instance
assert(Date)(new Date()) /* true */
assert(Date)(null) /* false */

assert(not(null))(1) /* true */
check(not(null))(null)
/*
TypeError:
 - Invalid type: custom check failed on null:
     - Expected not null: Got null 
*/

assert(not(not(Number)))(Number) /* true */
assert({x: any()})({x: 1}) /* true */
assert({x: any()})({abc: 1}) /* false */

assert(either(String, Number))(1) /* true */
assert(either(String, Number))('a') /* true */
assert(either(String, Number))(undefined) /* false */
```

### Guide
#### Importing:

In Node:
```js
const check = require('duck-check')
```

ES6 modules:

```js
import check from 'duck-check'
```

#### API

`duck-check` exposes two functions and an object.

##### check(schema)(data)
##### assert(schema)(data) 

A valid schema is either a constructor, an object, an array, or an anonymous function.
Objects and array schemas are valid if they also contain a valid schema.
The following are examples of basic valid schemas: 

```js
check(Number)
check([Boolean]) // Array of Booleans
check({a: String}) // Object with key a of type string
```

`check` and `assert` both return functions that take any data as argument. 
You can directly call this function:

```js
check(Number)(1)
assert(Number)(NaN) /* false */
```
Or you can assign it to a variable:

```js
validate_person = check({name: String, age: Number})
assert_person = assert({name: String, age: Number})
validate_person({name: 'jane', age: 30}) 
```

We will use the following naming convention: 

```js
const Person = check({name: String, age: Number})
```
Warning: Do not use this naming convention in a project involving classes.

We refer to the function returned by `check` or `assert` as a 'checker function'. 
Any checker function can be declared in a schema. 
For instance, we can declare an array of `Person`

```js
assert([Person])([{name: 'jane', age: 30}, {name: 'john', age: 60}]) /* true */
check([Person])([{name: 'jane', age: 30}, {name: 'john', age: NaN}]) 
/*
TypeError:
 - Invalid element in array [{"name":"jane","age":30},{"name":"john","age":"01"}]:
     - Invalid type: custom check failed on {"name":"john","age":"01"}:
         - Invalid property in object {"name":"john","age":"01"}:
             - Expected number: Got string 01
*/
```

You can freely mix checker-functions obtained through `assert` and `check`. 

```js
const asserter = assert(Number)
const checker = check(Number)

assert([checker])([1,2,3]) /* true */
check([asserter])([1,2,3]) 

assert([checker])([1,2,'a']) /* false */
check([asserter])([1,2,3]) /* TypeError */
```

This means that any anonymous function in the schema that returns false causes the test to fail. 

#### Arrays

`duck-check` will check all the elements in the array and find all invalid ones.
There are two ways of declaring arrays.

The followinf declaration means we want an array of numbers of any length, potentially empty. Use the `nonEmpty` modifier to declare a non-empty array, see the modifier section below.

```js
check([ Number ])([1,2,3])
check([[Number]])([[1,'2','a'],[1,2,'a']]) 
/*
TypeError:
 - 2 invalid elements in array [[1,"2","a"],[1,2,"a"]]:
     - 2 invalid elements in array [1,"2","a"]:
         - Expected number: Got string '2'
         - Expected number: Got string 'a'
     - Invalid element in array [1,2,"a"]:
         - Expected number: Got string 'a'
*/
assert([Number])(1) /* false */
```
 
The following declaration means we want an array with a number in first position, an a string in second.
This refered to as a positional array, since the position of element matters.

```js

check([ Number, String ])([1, '1'])
check([ Number, String ])([1, 456, '1']) 
/*
TypeError:
 - Invalid element in array [1,456,"1"]:
     - Expected string: Got number '456'
*/
```

We can declare much more complicated schemas.

```js
check([[ Number, [ String ]]])([ /* array of (number and array of string) */
    [ 1, [ 'a', 'b' ]], [ 2, [ 'c','d' ]]
])
check([[ Number, [ String ]]])([
    [ 1, [ 'a', 'b' ]], [ 2, [ null,'d' ]]
]) 
/*
TypeError:
 - Invalid element in array [[1,["a","b"]],[2,[1,"d"]]]:
     - Invalid element in array [2,[1,"d"]]:
         - Invalid element in array [1,"d"]:
             - Expected string: Got number '1'
*/
```

#### Modifiers

Modifiers are called with schemas and return anonymous functions that take the data being tested. 
There are four modifiers: 

##### any() - Takes no argument. You MUST call the function. Passing the function without calling makes the schema invalid, because functions in schemas must be anonymous. 
```js
assert(any())() /* always true */
assert({x: any()})({x: 1}) /* true */
assert({x: any()})({y: 1}) /* false */
```
##### not(schema) - Inverts the result of the check
```js
assert(not(any()))(1) /* always false */
check(not(null))(null) 
/*
TypeError:
 - Invalid type: custom check failed on null:
     - Expected not null: Got null
*/
```
##### either(schema_a, schema_b) - First tests with the first schema. If it fails, tests with the second schema. 
```js
assert(either(String, Number))(1) /* true */
assert(either(String, Number))('a') /* true */
assert(either(String, Number))( undefined ) /* false */
```
##### nonEmpty - Specify a non-empty array
```js
check(nonEmpty([]))([]) 
/*
TypeError:
 - Invalid type: custom check failed on []:
     - Expected non-empty array.
*/
```
#### Objects

If a key declared in the schema is not in the object, an error is thrown.

```js
validate_point({ x: 10, oups: 15 }) 
/*
TypeError:
 - Invalid properties in object {"x":10,"oups":15}:
     - Expected key 'y': Was undefined
*/
```

Keys not declared in the schema are ignored. 

```js
validate_point({
    x: 10, 
    y: 15, 
    some_other_key: 'some_other value'
})
```