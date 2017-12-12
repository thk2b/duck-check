## duck-check

🦆 A minimalist runtime type checking utility.

[![npm version](https://badge.fury.io/js/duck-check.svg)](https://badge.fury.io/js/duck-check)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

## New in v2.0.0
- REMOVED: Error batching to improve efficiency.
- REMOVED: Complex error messages thronw by `assert` to improve efficiency.
- MODIFIED: Modifier behavior changed. 

## Usage:
### Installation
`duck-check` is a Javascript package published in the NPM registry. Install by running
```
npm install --save duck-check
```

### Quick Start

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

**[Basic checks](#basic-checks)**

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
is( { key: String } )( { wrong: 42 } ) // -> false
is( { key: String } )( { key: 'value', other: 42 } ) // -> true
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

**[Custom Modifiers](#custom-modifiers)**

```js
const odd = n => n % 2 !== 0
is(odd)(1) // -> true
is( [ odd ] )( [1,3,5] ) // -> true
is( [ odd ] )( [1,3,10] ) // -> false
```

### Guide
#### Importing:

In Node:
```js
const { check, assert, modifiers } = require('duck-check')
```

ES6 modules:

```js
import { check, assert, modifiers } from 'duck-check'
```

#### Concepts

**Schema**

#### Main API

**`check(schema)(data)`**

**`is(schema)(data)`**

**`assert(schema)(data)`**

#### Basic Checks

#### Typed Arrays

#### Positonal Arrays

#### Objects

#### Mixed Objects and Arrays

#### Modifiers 

#### Custom Modifiers 
