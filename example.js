const {assert, check} = require('./index')
const {either} = require('./src/modifiers')

check(either(Number, String)(null))