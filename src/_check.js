const get_type = require('./get_type')
const { error_messages } = require('./errors')

/**
 * Private function. 
 * Examines the schema and runs the appropriate checks
 * @param {*} schema 
 * @param {*} duck 
 * @param {String} schema_type - Optional type - In modifiers, it is necesary to know the type before calling check. So it is more efficient to get them once and pass them
 * @param {String} duck_type - idem
 */
function _check(schema, duck, schema_type=get_type(schema), duck_type=get_type(duck)){
    switch(schema_type){
        case 'array':
            return _check_array(schema, duck)
        case 'object':
            return _check_object(schema, duck)
        case 'anonymous_function':
            return _check_function(schema, duck)
        case 'function':            
            return schema.name.toLowerCase() === duck_type ?
                true : duck_type === 'anonymous_function' ? 
                    true : duck_type === 'object' ? 
                        duck instanceof schema : _check_function(schema, duck)
        default:
            return schema_type === duck_type
    }
}

/**
 * Checks the type and existance of all keys declared on the schema
 * @param {Object} obj
 * @param {Object} schema 
 */
function _check_object(schema, obj){
    for(let key in schema){
        if( !_check(schema[key], obj[key])) return false
    }
    return true
}

/**
 * Checks array elements against an array schema or positional array schema. 
 * @param {Array} schema 
 * @param {Array} arr 
 */
function _check_array(schema, arr){
    if(schema.length === 1){ 
        /* array of unique type */
        return arr.length && arr.findIndex(
            (el, i) => ! _check(schema[0], el)
        ) === -1 ? true : false
    } else if (schema.length > 1){ 
        /* positional array */
        return arr.length === schema.length && arr.findIndex(
            (el, i) => ! _check(schema[i], el)
        ) === -1 ? true : false
    }
}

/**
 * Checks if the value passes the check function provided. 
 * @param {Function} fn - the result of a previous `check(schema) call` or a modifier or a custom anonymous function
 * @param {*} duck
 */
function _check_function(fn, duck){
    try {
        return fn(duck) === true
    } catch(e) {
        return false
    }
}

module.exports = {
    _check
}