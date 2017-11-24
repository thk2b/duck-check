const { _check } = require('./check')
const { generate_error_message } = require('./errors')

/**
 * Public function. Checks if the duck matches the schema 
 * @param {*} schema - Schema declaration 
 * @returns {Function} - check function
 */
function check(schema){
    /**
     * Check function
     * @param {*} duck – Any object to be checked against the schema
     * @return {undefined} - Returns undefined or throws a TypeError.
     */
    return (duck) => {
        try {
            _check(schema, duck)
        } catch (e) {
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
    assert
}