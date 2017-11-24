## duck-check

A minimalist runtime type checking utility.

[![npm version](https://badge.fury.io/js/duck-check.svg)](https://badge.fury.io/js/duck-check)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

### Usage:

#### Quick Start

##### Installation

```
npm install --save duck-check
```
```js

const check = require('duck-check')

check(Number)(1)
check(Number)(NaN) 

/*
TypeError:
 - Expected number: Got NaN
*/

check(Boolean)(true)
check(Boolean)('very true')
/*
TypeError:
 - Expected boolean: Got string 'very true'
*/

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
```

#### Guide
##### Importing:

In Node:
```js
const check = require('duck-check')
```

ES6 modules:

```js
import check from 'duck-check'
```

The check function takes a *schema* as an argument, and returns a function. Pass anything to this function, and a helpful error will be thrown if the argument does not match the schema.  
Suported types in a schema are array literal, object literals, and the Number, String, Boolean and Function constructors. 
This will NOT work with other constructors.

```js
check({ x: Number, y: Number })({ x: 10, y: 15 })
/* Does nothing*/

check({ x: Number, y: Number })({ x: 10, y: 'hello' }) 
/* 
TypeError:
 - Invalid properties in object {"x":10,"y":"hello"}:
     - Expected number: Got string 'hello'
*/
check({ x: Number, y: Number })({ x: 10, y: NaN })
/* 
TypeError:
 - Invalid properties in object {"x":10,"y":NaN}:
     - Expected number: Got NaN
*/
```

##### Objects

You can save checker-function by assigning a variable to a call to `check`.

Here, the schema is `{ x: Number, y: Number }`. It means that we expect an object with keys `x` and `y`, each with a type of Number. 

```js
const validate_point = check({ x: Number, y: Number })
```

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
Passing other types raise errors as expected.

```js
validate_point('how did I get there ?')
/*
TypeError:
 - Expected object: Got string 'how did I get there ?'
 */
```

##### Arrays

`duck-check` will check all the elements in the array and find all invalid ones.
There are two ways of declaring arrays.
This declaration means we want an array of numbers of any non-zero length.

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
check([Number])(1)
/*
TypeError:
 - Expected array: Got number '1'
*/
```
 
This means we want an array with a number in first position, an a string in second.
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
##### Functions

A previously declared checker-function can be used anywhere in a schema.
Here, `Point` is the same as `validate_point` from earlier but with a more convenient name. 
Note: Do not use this naming convention in a project involving object-oriented classes! 

```js
const Point = check({
    x: Number, 
    y: Number
})

```
Here, `check(Point)({x:1, y:1})` and `Point({x:1, y:1})` are equivalent, though the latter is more efficient. This shows that a previously declared checker function can be used in a schema. 

More interesting schemas can be built. This one checks for an array of elements that are expected to pass the `Point` checker function. 

```js
check([ Point ])([{ x: 1, y: 1 }, { x: 10, y: 10 }])
check([ Point ])([{ x: 10, xyz: 10 },{ x: 'a', y: 1 } ]) 
/*
TypeError:
 - 2 invalid elements in array [{"x":10,"xyz":10},{"x":"a","y":1}]:
     - Invalid property in object {"x":10,"xyz":10}:
         - Expected key 'y': Was undefined
     - Invalid property in object {"x":"a","y":1}:
         - Expected number: Got string 'a'
*/
```


Of course, you can stil check for functions as values

```js
check([Function])([console.log, a => {console.log(a)}])
```
___

<b>TODO:</b>

🚧 core:
- [ ] Write `validate_schema`


🎨 printing:
- [ ] Print schema 

🌐 share:
- [ ] Write Documentation

🏆 possible improvments: 
- [ ] Check (and improve) performance 
- [x] Batch errors in array and object checkers: instead of throwing after first error is found, run through the rest of the array / object and find all errors.
___
