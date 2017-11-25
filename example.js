const {assert, check} = require('./index')
const { not, any, nonEmpty } = require('./index').modifiers

const Person = check({name: String, age: Number})


let p = Person({name: 'j', age: 12})
console.log(p)
