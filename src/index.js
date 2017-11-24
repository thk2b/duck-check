const { _check } = require('./check')
const { generate_error_message } = require('./errors')
const modifiers = require('./modifiers')

/**
 * Public function. Checks if the duck matches the schema 
 * @param {*} schema - Schema declaration 
 * @returns {Function} - check function
 */
function check(schema){
    /**
     * Check function
     * @param {*} duck – Any object to be checked against the schema
     * @param {Boolean} _throw_raw_error - Hack to allow a clean error message to be produced when using a check function in a schema
     * @return {undefined} - Returns undefined or throws a TypeError.
     */
    return (duck, _throw_raw_error=false) => {
        try {
            _check(schema, duck)
        } catch (e) {
            if(_throw_raw_error) throw e
            throw new TypeError(generate_error_message(e) + '\n\n')
        }
    }
}

/**
 * Public function. 
 * @param {*} schema - Schema declaration 
 * @returns {Function} - check function
 */
function assert(schema){
    /**
     * @param {*} duck – Any object to be checked against the schema
     * @param {Boolean} throw_raw_error  - Private - dirty hack to allow passing check functions in a schema
     * @return {Boolean} - Returns false if in assert mode and the test fails.
     */
    return duck => {
        try {
            _check(schema, duck)
        } catch (e) {
            return false
        }
        return true
    }
}

module.exports = {
    check, 
    assert,
    modifiers
}