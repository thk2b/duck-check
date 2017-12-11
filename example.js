// const {assert, check, modifiers} = require('./index')
// const {add, any, not, nonEmpty} =  modifiers 

const { _check } = require('./src/_check')

console.log(_check({}, {a: Number}))