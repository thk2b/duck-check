
const is_object = val => (
    typeof val === 'object'
    && val !== null
)
const is_array = val => Array.isArray(val)
const is_anonymous_function = val => (
    typeof val === 'function'
    && !val.name /* make sure it's not the Function constructor but a function to test the value */ 
)

function print_error(console, duck, schema){
    console.error(`\n| Expected\n`)
    console.dir(schema)
    console.error(`\n| But got \n`)
    console.dir(duck)
}

/**
 * Public facing curried function 
 */
function check(schema){
    return duck => {
        try {
            _check(schema, duck)
        } catch (e) {
            print_error(console, duck, schema)
            throw e
        }
    }
}

function _check(schema, duck){
    if(is_array(schema)){ /* array */
        if(!is_array(duck)){
            throw new TypeError(
                `Expected array. Got '${ typeof duck}'.`
            )
        }
        check_array(schema, duck)
    } else if(is_object(schema)){ /* object */
        if(!is_object(duck)){
            throw new TypeError(
                `Expected object. Got '${ typeof duck}'.`
            )
        }
        check_object(schema, duck)
    } else if(is_anonymous_function(schema)){
        check_function(schema, duck)
    } else { /* anyduck else */
        check_type(schema, duck)
    }
}

/**
 * Checks whether the type of value equals type
 * @param {*} value 
 * @param {*} type - Constructor 
 */
function check_type(type, value){
    if( !type.name ){ 
        // TODO: remove after implementing validate_schema     
        throw new TypeError(`Invalid schema key: '${type}' is not a valid type.`)
    } else if (
        typeof value === 'number' && isNaN(value) || 
        typeof value !== type.name.toLowerCase()
    ){
        const got = value
            ?`Got '${value}' of type '${typeof value}'` 
            :`Got '${value}'`
        throw new TypeError(`Expected '${type.name}'. ` + got)
    }
}

/**
 * Check the type of all keys on the object
 * @param {Object} obj
 * @param {*} schema 
 */

function check_object(schema, obj){
    try {
        for(let key in schema){
            const val = obj[key]
            const type = schema[key]
            if(val === 'undefined'){
                throw new TypeError(
                    `Expected key '${key}' of type '${type}'.`
                )
            }
            _check(schema[key], obj[key])
        }
    } catch (e) {
        throw new TypeError('Error in object: ' + e.message)
    }
}

function check_array(schema, arr){
    try {
        if(schema.length === 1){ /* all elements are of one type */
            arr.forEach( el => {
                _check(schema[0], el)    
            })
        } else if (schema.length >= 1){ /* positional array where each element is of a specific type */
            if(schema.length !== arr.length){
                throw new TypeError(
                    `Expected positional array of length '${schema.length}'. Got array of length '${arr.length}'.`
                )
            }
            arr.forEach( (el, i) => {
                _check(schema[i], el)
            })
        }
    } catch (e) {
        throw new TypeError('Invalid element in array: ' + e.message)
    }
}

function check_function(fn, value){
    try {
        fn(value)
    } catch (e){
        throw e
    }
}

module.exports = {
    check,
    _check,
    check_array,
    check_object,
    check_function,
    check_type
}
