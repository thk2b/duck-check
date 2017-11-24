const {assert, check} = require('./index')
const {either} = require('./src/modifiers')


// const checker = check({
//     a: either(null, String), 
//     b: either([String], [Date])
// })

// checker({
//     a: null,
//     b: ['null', new Date()]
// })

check(either(Date, String))(1)
check(either(Date, String))('a')