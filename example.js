const {assert, check} = require('./index')
const { not, any, nonEmpty } = require('./index').modifiers
check([[Number]])([[1,'2','a'],[1,2,'a']]) 
check(nonEmpty([]))([]) /* false */
check(not(null))(null)
console.log(assert(not(any()))(1))

const Person = check({name: String, age: Number})
// check(either(Number, null))()
console.log(assert([Person])({name: 'jane', age: 30}, {name: 'john', age: 1}))
// check(not(null))(null)
