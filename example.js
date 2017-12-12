const { assert, is, check, not, one_of, either, any, modifiers } = require('./')
/* Basic checks */

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

/* Typed arrays */

is([ Number ])([1,2,3]) // -> true
is([ Number ])([1,'2',3]) // -> false
is([ Number ])([]) // -> false
is([ Number ])(1) // -> false

/* Positional arrays */

is([ Number, String, Boolean ])([1,'a', true]) // -> true
is([ Number, String, Boolean ])([1,false, 'a']) // -> false

/* Objects */

is( { key: String } )( { key: 'value '} ) // -> true
is( { key: String } )( { key: 42 } ) // -> false
is( { key: String } )( { wrong: 42 } ) // -> false
is( { key: String } )( { key: 'value', other: 42 } ) // -> true

/* Mixed objects and arrays */

is( [ { key: String } ] )( [ { key: 'first' }, { key: 'second' } ] ) // -> true
is( [ { key: String } ] )( [ { key: 'first' }, { wrong: 'second' } ] ) // -> false

/* Modifiers */

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

/* custom modifiers */

const odd = n => n % 2 !== 0
is(odd)(1) // -> true
is( [ odd ] )( [1,3,5] ) // -> true
is( [ odd ] )( [1,3,10] ) // -> false