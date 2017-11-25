const { get_type } = require('./get_type')
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

    if(schema_type !== duck_type){
        if( schema_type === 'function'){
        /* is a constructor such as Number, String, Function 
           or a check or assert function 
        */
            const name = schema.name.toLowerCase()
            if(name !== duck_type){
                if(!(duck instanceof schema)){
                    throw {
                        message: error_messages[1](name, duck_type, duck)
                    }
                }
            }

            switch(duck_type){
                case 'number':
                case 'string':
                case 'boolean':
                    if(name !== duck_type){
                        throw{
                            message: error_messages[1](name, duck_type, duck)
                        }
                    }
                    break
                case 'object': 
                    if(!(duck instanceof schema)){
                        throw {
                            message: error_messages[7](name, duck_type)
                        }
                    }
                    break
                case 'anonymous_function':
                    break
                default:
                    throw {
                        message: error_messages[1](name, duck_type, duck)
                    }
            }
        } else if (schema_type === 'anonymous_function'){
            check_function(schema, duck)
        } else {
            throw {
                message: error_messages[1](schema_type, duck_type, duck)
            }
        }
    } else {
        switch(schema_type){
            case 'array':
                check_array(schema, duck)
                break
            case 'object':
                check_object(schema, duck)
                break
            default:
                break
        }
    }
    return duck
}

/**
 * Checks the type and existance of all keys declared on the schema
 * @param {Object} obj
 * @param {Object} schema 
 */
function check_object(schema, obj){
    let errors = []
    for(let key in schema){
        try{
            const val = obj[key]
            if(typeof val === 'undefined'){
                throw {
                    message: error_messages[4](key)
                }
            }
            _check(schema[key], obj[key])
        } catch (e) {
            errors.push(e)
        }
    }
    if(errors.length > 0){
        throw {
            message: error_messages[5](obj, errors.length),
            data: errors
        }
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
        if(errors.length > 0){
            throw {
                message: error_messages[2](arr, errors.length),
                data: errors
            }
        }
    } else if (schema.length >= 1){ /* positional array where each element is of a specific type */
        schema.forEach( (si, i) => {
            try {
                _check(si, arr[i])
            } catch (e) {
                errors.push(e)
            }
        })
        if(errors.length > 0){
            throw {
                message: error_messages[3](arr, errors.length),
                data: errors
            }
        }
    }
}

/**
 * Checks if the value passes the check function provided. 
 * @param {Function} fn - the result of a previous `check(schema) call`
 * @param {*} value
 */
function check_function(fn, value){
    let ret /* store return value in case the function is an assertion */
    
    try {
        ret = fn(value, true)
    } catch (e){
        throw { message: error_messages[6](value), data: [e] }
    }
    if(ret === false){
        throw { message: error_messages[6](value)}
    }
}

module.exports = {
    _check,
    check_array,
    check_object,
    check_function,
}