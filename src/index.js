
const is_object = val => typeof val === 'object'
const is_array = val => Array.isArray(val)

function check(thing, schema){
    if(is_array(schema)){ /* array */
        check_arraygit (thing, schema)
    } else if(is_object(schema)){ /* object */
        check_object(thing, schema)
    } else { /* anything else */
        check_type(thing, schema)
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
                `Expected key '${key}' of type '${type} on object '${JSON.stringify(obj)}'.`
            )
        }
        check(obj[key], schema[key])
    }
}

function check_array(arr, schema){
    if(schema.length === 1){ /* all elements are of one type */
        arr.forEach( el => {
            check(el, schema[0])    
        })
    } else if (schema.length >= 1){ /* positional array where each element is of a specific type */
        if(schema.length !== arr.length){
            throw new Typerror(
                `Expected positional array of length '${arr.length}' matching '${JSON.stringify(schema)}. Got '${JSON.stringify(arr)} of length '${arr.length} instead.'`
            )
        }
        arr.forEach( (el, i) => {
            check(el, schema[i])    
        })
    }
}

/**
 * Checks whether the type of value equals type
 * @param {*} value 
 * @param {*} type - Constructor 
 */
function check_type(value, type){
    if( !type.name ){
        if(typeof type === 'function'){ /* type is a custom type checker */
            type(value)
        } else {
            throw new Error(`Invalid schema: key'${type}' is not a valid type.`)
        }
    } else if(typeof value !== type.name.toLowerCase()){
        throw new Error(
            `Expected value of type '${type}'. Got '${value}' of type '${typeof value}.`
        )
    }
}


function type_checker(schema){
    return thing => check(thing, schema)
}

module.exports = {
    type_checker,
    check,
    check_array,
    check_object,
    check_type
}
