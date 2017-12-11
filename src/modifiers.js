const { assert } = require('../index')

const { _check } = require('./_check')
const get_type = require('./get_type')

/**
 * Throws if the test passes. Does nothing if the test fails.
 * @param {*} Schema - Any valid schema. Returns false if it does not match the duck.
 */
const not = schema => duck => {
    return !assert(schema)(duck)
}

/**
 * Throws if both options are invalid
 * @param {*} a - First option. Any valid schema
 * @param {*} b - Second option. Any valid schema
 * @returns {Boolean} - Returns false if the duck matches neither schemas
 */
const either = (a, b) => duck => {
    return assert(a)(duck) || assert(b)(duck)
}

function one_of(){
    return duck => {
        for(let arg of arguments){
            if( assert(arg)(duck)) return true
        }
        return false
    }
}

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