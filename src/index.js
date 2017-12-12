const { check, assert } = require('./main')
const modifiers = require('./modifiers')
const { either, not, any, one_of } = modifiers

module.exports = {
    check, 
    assert, 
    modifiers,
    is: assert,
    either, 
    not, 
    any, 
    one_of,
    oneOf: one_of
}
