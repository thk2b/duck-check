const { assert } = require('./main')

/**
 * Inverts the result of a check.
 * @param {*} Schema - Any valid schema. 
 * @returns {Boolean} – False if duck matches schema.
 */
const not = schema => duck => {
    return !assert(schema)(duck)
}

/**
 * @param {...*} – Any number of valid schemas
 * @returns {Boolean} – True if duck matches one of the schemas
 */
function one_of(){
    return duck => {
        for(let arg of arguments){
            if( assert(arg)(duck)) return true
        }
        return false
    }
}

/**
 * @param {*} a - First option. Any valid schema
 * @param {*} b - Second option. Any valid schema
 * @returns {Boolean} - False if the duck matches neither schemas.
 */
const either = (a, b) => one_of(a, b)

/**
 * Wildcard: makes any type pass the test. To be used in an array or object schema
 * @returns {Boolean} - Always returns true. 
 */
const any = () => true

module.exports = {
    either, 
    not,
    any,
    one_of, oneOf: one_of
}