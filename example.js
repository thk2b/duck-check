const {assert, check, modifiers} = require('./index')
const {add, any, not, nonEmpty} = require('./src/modifiers')
const { _check } = require('./src/_check')

const schema = {a: {b: Number, c: Boolean}}
// console.log(assert(schema)( {a: {b: 1, c: true}}))
// console.log(_check(Number, 'a'))
console.log(_check(schema,{a: {b: 1, c: 't'}}))

// console.log(assert(schema)( {a: {b: 1, z: 't'}}))


// const fn = () => true
// console.log(_check(fn, 'a'))