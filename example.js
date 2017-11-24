const {assert, check} = require('./index')
const { not, any } = require('./index').modifiers


// check(either(Number, null))()

check({x: not(any())})({x: 1})