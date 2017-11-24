const {assert, check} = require('./index')

const asserter = assert(Number)

check([asserter])([1,2,'3'])