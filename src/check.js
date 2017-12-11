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
            if( name !== duck_type){
                if( !(duck instanceof schema)){
                    return false
                }
            }

            switch(duck_type){
                case 'number':
                case 'string':
                case 'boolean':
                    if( name !== duck_type){
                        return false
                    }
                    return true
                case 'object': 
                    if( !(duck instanceof schema)){
                        return false
                    }
                    return true
                case 'anonymous_function':
                default:
                    return false
            }
        } else if ( schema_type === 'anonymous_function'){
            return check_function(schema, duck)
        } else {
            return false
        }
    } else {
        switch(schema_type){
            case 'array':
                return check_array(schema, duck)
            case 'object':
                return check_object(schema, duck)
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
    for(let key in schema){
            const val = obj[key]
            if(typeof val === 'undefined'){
                return false
            }
            return _check(schema[key], obj[key])
    }
}

/**
 * Checks array elements against an array schema or positional array schema. 
 * @param {Array} schema 
 * @param {Array} arr 
 */
function check_array(schema, arr){
    if(schema.length === 1){ /* all elements are of one type */
        for(let el of arr){
            if( !_check(schema[0], el )){
                return false
            }
        }
        return true
    } else if (schema.length > 1){ /* positional array where each element is of a specific type */
        if(arr.length < schema.length){
            return false
        }
        for(let i = 0; i < arr.length; i++){
            if( !_check(schema[i], arr[i] )){
                return false
            }
        }
        return true
    }
}

/**
 * Checks if the value passes the check function provided. 
 * @param {Function} fn - the result of a previous `check(schema) call`
 * @param {*} value
 */
function check_function(fn, value){
    let ret 
    try {
        ret = fn(value, true)
    } catch(e) {
        return false
    }
    return ret
}

module.exports = {
    _check,
    check_array,
    check_object,
    check_function,
}