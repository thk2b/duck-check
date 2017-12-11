const {assert, check, modifiers} = require('./index')
const {add, any, not, nonEmpty} = require('./src/modifiers')
const { _check } = require('./src/_check')

console.log(assert(any)('a'))
console.log(assert({a: any})({a: 'a'}))