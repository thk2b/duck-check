const {assert, check} = require('./index')
const { not, any, nonEmpty } = require('./index').modifiers

const Person = check({name: String, age: Number})

check([Person])({name: 'jane', age: 30}, {name: 'john', age: 1})

