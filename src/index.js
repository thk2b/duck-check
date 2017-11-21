
const is_object = val => (
    typeof val === 'object'
    && val !== null
)
const is_array = val => Array.isArray(val)
const is_anonymous_function = val => (
    typeof val === 'function'
    && !val.name /* make sure it's not the Function constructor but a function to test the value */ 
)

function check(duck, schema){
    if(is_array(schema)){ /* array */
        if(!is_array(duck)){
            throw new TypeError(
                `Expected array. Got '${ typeof duck}'.`
            )
        }
        check_array(duck, schema)
    } else if(is_object(schema)){ /* object */
        if(!is_object(duck)){
            throw new TypeError(
                `Expected object. Got '${ typeof duck}'.`
            )
        }
        check_object(duck, schema)
    } else if(is_anonymous_function(schema)){
        check_function(duck, schema)
    } else { /* anyduck else */
        check_type(duck, schema)
    }
}

/**
 * Checks whether the type of value equals type
 * @param {*} value 
 * @param {*} type - Constructor 
 */
function check_type(value, type){
    // TODO: remove after implementing validate_schema     
    if( !type.name ){ 
        throw new TypeError(`Invalid schema key: '${type}' is not a valid type.`)
    } else if(typeof value !== type.name.toLowerCase()){
        throw new TypeError(`Expected '${type.name}'. Got '${value}' of type '${typeof value}'`)
    }
}

/**
 * Check the type of all keys on the object
 * @param {Object} obj
 * @param {*} schema 
 */

function check_object(obj, schema){
    for(let key in schema){
        const val = obj[key]
        const type = schema[key]
        if(val === 'undefined'){
            throw new TypeError(
                `Expected key '${key}' of type '${type}'.`
            )
        }
        check(obj[key], schema[key])
    }
}

function check_array(arr, schema){
    try {
        if(schema.length === 1){ /* all elements are of one type */
            arr.forEach( el => {
                check(el, schema[0])    
            })
        } else if (schema.length >= 1){ /* positional array where each element is of a specific type */
            if(schema.length !== arr.length){
                throw new TypeError(
                    `Expected positional array of length '${schema.length}'. Got array of length '${arr.length}'.`
                )
            }
            arr.forEach( (el, i) => {
                check(el, schema[i])    
            })
        }
    } catch (e) {
        throw new TypeError('Invalid element in array: ' + e.message)
    }
}

function check_function(value, fn){
    fn(value)
}

function print_error(console, duck, schema){
    console.error(`\n>| Expected\n`)
    console.dir(schema)
    console.error(`\n>| But got ${duck? '': 'undefined'}\n`)
    console.dir(duck)
}

function type_checker(schema){
    return duck => {
        try{
            check(duck, schema)
        } catch(e) {
            print_error(console, duck, schema)
            throw e
        }
    }
}

module.exports = {
    type_checker,
    check,
    check_array,
    check_object,
    check_function,
    check_type
}
