const {assert, check} = require('./index')
// const {either} = require('./src/modifiers')

const Vector = check([Number, Number])

check([{a: Number}])([])