const {assert, check, modifiers} = require('./index')
const {add, any, not, nonEmpty} = require('./src/modifiers')

const c = check(Number)
console.log(c)
console.log(c('a'))

// const { _check } = require('./src/_check')
// const fn = () => true
// console.log(_check(fn, 'a'))