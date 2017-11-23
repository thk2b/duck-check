const { get_type } = require('./get_type')
const { error_message, generate_error } = require('./errors')


/**
 * Public facing curried function 
 * @param {*} schema - Schema declaration 
 * @returns {Function} - check function
 */
function check(schema){
    /**
     * Check function
     * @param {*} duck – Any object to be checked against the schema
     * @param {Boolean} _generate_message - Tell the checker function not to produce an error message. See check_function
     */
    return (duck, _generate_message = true) => {
        try {
            _check(schema, duck)
        } catch (e) {
            if(_generate_message){
                throw new TypeError(error_message(e) + '\n\n')
            } else {
                throw e
            }
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
            let value = ` '${duck}'`
            switch(duck_type){
                case 'null':
                case 'undefined':
                case 'NaN':
                    value = ''
            }

            throw {
                message: `Expected ${ schema_type }: Got ${ duck_type.replace('_', ' ') }${value}`
            }
        }
    }

    switch(schema_type){
        case 'object':
            check_object(schema, duck)
            break
        case 'array':
            check_array(schema, duck)
            break
        case 'anonymous_function':
            check_function(schema, duck)
            break
        default:
            break
    }
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
                    message: `Expected key '${key}': Was undefined`
                }
            }
            _check(schema[key], obj[key])
        } catch (e) {
            errors.push(e)
        }
    }

    generate_error(errors, 
        `Invalid property in object ${JSON.stringify(obj)}:`,
        `${errors.length} invalid properties in object ${JSON.stringify(obj)}:`
    )
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
        schema.forEach( (si, i) => {
            try {
                _check(si, arr[i])
            } catch (e) {
                errors.push(e)
            }
        })
    }

    generate_error(errors, 
        `Invalid element in array ${JSON.stringify(arr)}:`,
        `${errors.length} invalid elements in array ${JSON.stringify(arr)}:`
    )
}

/**
 * Checks if the value passes the check function provided. 
 * @param {Function} fn - the result of a previous `check(schema) call`
 * @param {*} value
 */
function check_function(fn, value){
    try {
        fn(value, false)
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