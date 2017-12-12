## duck-check

🦆 A minimalist runtime type checking utility.

[![npm version](https://badge.fury.io/js/duck-check.svg)](https://badge.fury.io/js/duck-check)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

## New in v2.0.0
- Remove Error batching to improve efficiency.
- Remove complex error messages thrown by `assert` to improve efficiency.

## Usage:
### Installation
`duck-check` is a Javascript package published in the NPM registry. Install by running
```
npm install --save duck-check
```

### Quick Start

*([skip to guide](#guide))*

**Getting started**

```js
const { 
 assert, 
 is, 
 check, 
 not, 
 one_of, oneOf,
 either, 
 any 
} = require('duck-check')
```

**Basic checks**

```js
check(Number)(1) // -> true
check(Number)("i'm not a number") // -> TypeError

assert(String)('hello world!') // -> true
assert(String)(42) // -> false

is(String)('hello world!')// -> true
is(String)(42)// -> false

is(Date)(new Date()) // -> true
is(Date)('today') // -> false

is(Function)(() => "i'm a function") // -> true

const even = n => n % 2 === 0
is(even)(20) // -> true
is(even)(3) // -> false
```

**[Typed Arrays](#typed-arrays)**

```js
is([ Number ])([1,2,3]) // -> true
is([ Number ])([1,'2',3]) // -> false
is([ Number ])([]) // -> false
is([ Number ])(1) // -> false
```

**[Positional Arrays](#positional-arrays)**

```js
is([ Number, String, Boolean ])([1,'a', true]) // -> true
is([ Number, String, Boolean ])([1,false, 'a']) // -> false
```

**[Objects](#objects)**

```js
is( { key: String } )( { key: 'value '} ) // -> true
is( { key: String } )( { key: 42 } ) // -> false
is( { key: String } )( { wrong: 'value' } ) // -> false
is( { key: String } )( { key: 'value', other: 42 } ) // -> true
```

**[Reusing previous checker functions](#functions)**

```js
const Person = assert({ name: String, age: Number })
assert([ Person ])([ { name: 'John', age: 45 }, { name: 'Jane', age: 55 } ]) // -> true
```

**[Mixed Objects and Arrays](#midxed-objects-and-arrays)**

```js
is( [ { key: String } ] )( [ { key: 'first' }, { key: 'second' } ] ) // -> true
is( [ { key: String } ] )( [ { key: 'first' }, { wrong: 'second' } ] ) // -> false
```

**[Modifiers](#modifiers)**

```js
not(Number)(null) // -> true
not(Number)(1) // -> false
check(not(Number))(1) // -> TypeError

one_of(Number, String, null)(1) // -> true
one_of(Number, String, null)('a') // -> true
one_of(Number, String, null)(null) // -> true
one_of(Number, String, null)(NaN) // -> false

either([ Number ], { x: Number, y: Number } )( [ 1, 2 ] ) // -> true
either([ Number ], { x: Number, y: Number } )( { x: 1, y: 2 } ) // -> true
either([ Number ], { x: Number, y: Number } )( { x: 1, wrong: 2 } ) // -> false

is({ x: any })({ x: 1 }) // -> true
is({ x: any })({ x: NaN }) // -> true
is({ x: any })({ wrong: 1 }) // -> false
is({ x: either(Number, String)})({x: 1}) // -> true
is({ x: either(Number, String)})({x: false}) // -> false
```

### Guide
#### Importing:

In Node:
```js
const { check, assert, is, modifiers, not, one_of, oneOf, any, either } = require('duck-check')
```

ES6 modules:

```js
import { check, assert, is, modifiers, not, one_of, oneOf, any, either } from 'duck-check'
```

#### Schema

A schema represents the expected structure or type of your data. It is passed as an argument to the `check`, `assert` and other modifier functions. 

A valid schema is: 
- A primitive type constructor such as `Number`, `String`, `Boolean`, `Function`
- A primitive object, such as `null`, `undefined`, `NaN`
- Any class constructor
- An array litteral containing any valid schema (interpreted as a [typed array](typed-arays))
- An array litteral containing multiple valid schemas (interpreted as a [positional array](positional-arays))
- An object litteral with a key and any valid schema as a value
- A function

#### Main API

**`check(schema)(data)`**

Returns a function that takes data as its argument, and throws a `TypeError` if the data does not match the schema. Returns `undefined` otherwise.

**`is(schema)(data)`**

Alias for `assert`

**`assert(schema)(data)`**

Returns a function that takes data as its argument, and returns `false` if the data does not match the schema. Returns `true` otherwise.

#### Checking data

##### Typed Arrays

A typed array is an array where all elements are of one type. For instance, an array of numbers is a typed array.

```js
is([ Number ])( [1,2,3] )
```

##### Positional Arrays

A positional array is an array where each position in the array is of a specific type. For instance, an array with a first number, then a string.

```js
is([ Number, String ])( [1, 'a'] )
```

##### Objects

An object has keys and values. For instance, an object with a key of `key` and a value of type `String`.

```js
is({ key: String })( {key: 'value' })
```

The test passes if all keys declared in the schema object are defined in the data, and if the value of each key matches the type declared in the schema. Keys declared in the data but not in the schema are ignored. 

To check for a key with any value, use the `any` [modifier](#modifiers). 

##### Mixed Objects and Arrays

Since any schema can contain other schemas, you can check for arrays of objects, objects containing arrays, etc... You can compose your schemas as needed without limit (as long as they are not recursive).

##### Functions

If you pass a function in the schema, it will be called with the data as its argument. If the function returns `true`, the test passes. if it returns `false`, or throws an error, the test fails. 

This means previous calls to `check` or `assert` can be used in any schema.

```js
const Person = assert({ name: String, age: Number }) // ! \\ Do not use this naming convention in project involving OOP classes!
assert([ Person ])([ { name: 'John', age: 45 }, { name: 'Jane', age: 55 } ]) // -> true
```

You can also define your own functions as needed. 

```js
const even = n => n % 2 === 0
is([even])([20, 22]) // -> true
is([even])([20, 21]) // -> false
```

##### Modifiers

Modifiers take a schema, and alter the result of the check.

A modifier can be used anywhere in a schema, or even with other modifiers. For instance, you can declare an array of neither numbers nor strings. 

```js
is([ not(either(Number, String)) ])([1, 'a']) // -> false
```

**`any(data)`**

A function that always returns true. Do not call the function when declaring the schema.

```js
is(any)() // -> true
```

**`not(schema)`**

Returns a function that takes in data and returns the negation of `check(schema)(data)`. 

```js
not(Number)(null) // -> true
not(Number)(1) // -> false
check(not(Number))(1) // -> TypeError
```

**`either(schema_a, schema_b)`**

Returns a function that takes in data and returns `true` if either schemas match the data. 

```js
either([ Number ], { x: Number, y: Number } )( [ 1, 2 ] ) // -> true
either([ Number ], { x: Number, y: Number } )( { x: 1, y: 2 } ) // -> true
either([ Number ], { x: Number, y: Number } )( { x: 1, wrong: 2 } ) // -> false
```

**`oneOf(...args)`**

alias of `one_of`

**`one_of(...args)`**

Returns a function that takes in data and returns `true` if one of the schemas passed as arguments match the data. 

```js
one_of(Number, String, null)(1) // -> true
one_of(Number, String, null)('a') // -> true
one_of(Number, String, null)(null) // -> true
one_of(Number, String, null)(NaN) // -> false
```
