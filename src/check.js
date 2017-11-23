const { get_type } = require('./get_type')
const error_message = require('./error_message')

/**
 * Public facing curried function 
 * @param {*} schema - Schema declaration 
 * @returns {Function} - check function
 */
function check(schema){
    /**
     * Check function
     * @param {*} duck – Any object to be checked against the schema
     */
    return duck => {
        try {
            _check(schema, duck)
        } catch (e) {
            throw new TypeError(error_message(e))
        }
    }
}
    
/**
 * Private function. 
 * Examines the schema and runs the appropriate checks
 * @param {*} schema 
 * @param {*} duck 
 */
function _check(schema, duck){
    let schema_type = get_type(schema)
    if(schema_type === 'function'){
        schema_type = schema.name.toLowerCase()
    }
    const duck_type = get_type(duck)

    if(schema_type !== duck_type){
        if(!(
            schema_type === 'anonymous_function' || 
        /* assume it's a check() function, so ignore the differentce in types */
            schema_type === 'function' && duck_type === 'anonymous_function'
        /* the Function constructor was passed and the duck is an anonymous function, it is valid*/
        )){
            throw {
                message: `Expected ${ schema_type } – Got ${ duck_type.replace('_', ' ') } '${duck}'`
            }
        }
    }

    switch(schema_type){
        case 'array':
            check_array(schema, duck)
            break
        case 'object':
            check_object(schema, duck)
            break
        case 'anonymous_function':
            check_function(schema, duck)
            break
        default:
            break
            // check_type(schema, duck)
    }
}

/**
 * Checks the existance of all keys declared on the schema and their type
 * @param {Object} obj
 * @param {Object} schema 
 */
function check_object(schema, obj){
    try {
        for(let key in schema){
            const val = obj[key]
            const type = schema[key]
            if(typeof val === 'undefined'){
                throw new TypeError(
                    `Expected key '${key}' but was undefined`
                )
            }
            _check(schema[key], obj[key])
        }
    } catch (e) {
        throw new TypeError('Error in object: ' + e.message)
    }
}

/**
 * Checks array elements against an array schema or positional array schema. 
 * @param {Array} schema 
 * @param {Array} arr 
 */
function check_array(schema, arr){
    let errors = []

    if(schema.length === 1){ /* all elements are of one type */
        arr.forEach( el => {
            try {
                _check(schema[0], el)    
            } catch (e) {
                errors.push(e)
            }
        })
    } else if (schema.length >= 1){ /* positional array where each element is of a specific type */
        if(schema.length !== arr.length){
            throw {
                message: `Expected positional array of length '${schema.length}'. Got array of length '${arr.length}'`
            }
        }
        arr.forEach( (el, i) => {
            try {
                _check(schema[i], el)
            } catch (e) {
                errors.push(e)
            }
        })
    }

    if(errors.length === 1){
        throw {
            message: `Invalid element in array ${JSON.stringify(arr)}`,
            data: errors
        }
    } else if(errors.length > 1){
        throw {
            message: `${errors.length} invalid elements in array ${JSON.stringify(arr)}`,
            data: errors
        }
    }
}
/**
 * Checks if the value passes the check function provided. 
 * @param {Function} fn - the result of a previous `check(schema) call`
 * @param {*} value
 */
function check_function(fn, value){
    try {
        fn(value)
    } catch (e){
        throw e
    }
}

module.exports = {
    check, /* only public function */
    _check, /* export for testing */
    check_array,
    check_object,
    check_function,
}
