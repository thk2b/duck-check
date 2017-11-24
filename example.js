const {assert, check} = require('./index')
const {either, not, any} = require('./src/modifiers')


// check(either(Number, null))()

check({x: not(any())})({x: 1})