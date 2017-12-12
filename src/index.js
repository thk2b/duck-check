const { check, assert } = require('./main')
const { either, not, any, one_of } = require('./modifiers')

module.exports = {
    check, 
    assert, is: assert,
    either, 
    not, 
    any, 
    one_of
}
