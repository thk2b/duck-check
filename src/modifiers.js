const { _check } = require('./_check')
const { get_type } = require('./get_type')
const { error_messages } = require('./errors')

/**
 * Throws if the test passes. Does nothing if the test fails.
 * @param {*} Schema - Any valid schema. Throws if it matches the duck.
 */
const not = schema => duck => {
    const schema_type = get_type(schema) 
    const schema_name = schema_type === 'function' ? schema.name.toLowerCase() : schema_type
    const duck_type = get_type(duck)

    return !_check(schema, duck, schema_type, duck_type)
}

/**
 * Throws if both options are invalid
 * @param {*} a - First option. Any valid schema
 * @param {*} b - Second option. Any valid schema
 */
const either = (a, b) => duck => {
    const type_a = get_type(a) 
    const name_a = type_a === 'function' ? a.name.toLowerCase() : type_a
    const type_b = get_type(b) 
    const name_b = type_b === 'function' ? b.name.toLowerCase() : type_b
    const duck_type = get_type(duck)

    return _check(a, duck, type_a, duck_type) || _check(b, duck, type_b, duck_type)
}

/**
 * Throws if the array is empty
 * @param {Array}
 */
const nonEmpty = non_empty = array => duck => {
    if(Array.isArray(array)){
        if(duck.length === 0){
            return false
        }
    }
    return _check(array, duck)
}

/**
 * Wildcard: makes any type pass the test
 */
const any = () => duck => {
    return true
}

module.exports = {
    either, 
    not,
    non_empty, nonEmpty,
    any
}