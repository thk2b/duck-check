
const is_object = val => (
    typeof val === 'object'
    && val !== null
)
const is_array = val => Array.isArray(val)
const is_function = val => (
    typeof val === 'function'
    && !val.name /* make sure it's not the Function constructor but a function to test the value*/ 
)

function check(duck, schema){
    if(is_array(schema)){ /* array */
        if(!is_array(duck)){
            //TODO: better error message
            throw new TypeError(
                `Expected an array. Got '${JSON.stringify(duck)}' instead.`
            )
        }
        check_array(duck, schema)
    } else if(is_object(schema)){ /* object */
        if(!is_object(duck)){
            throw new TypeError(
                `Expected an object. Got '${JSON.stringify(duck)}' instead.`
            )
        }
        check_object(duck, schema)
    } else if(is_function(schema)){
        check_function(duck, schema)
    } else { /* anyduck else */
        check_type(duck, schema)
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

function check_function(value, fn){
    try{
        fn(value)
    } catch(e){
        throw new TypeError(
            `Expected value '${value}' to pass through a test function. An error occured: \n` + e.message 
        )
    }
}

/**
 * Checks whether the type of value equals type
 * @param {*} value 
 * @param {*} type - Constructor 
 */
function check_type(value, type){
    if( !type.name ){        
        throw new Error(`Invalid schema: key '${type}' is not a valid type.`)
    } else if(typeof value !== type.name.toLowerCase()){
        throw new Error(
            `Expected '${type.name}'. Got '${value}' ${value?` of type '${typeof value}'`:''}`
        )
    }
}

function print_error(console, duck, schema){
    console.error(`\n>| Expected\n`)
    console.dir(schema)
    console.error(`\n>| But got\n`)
    console.dir(duck)
}

function type_checker(schema){
    return duck => {
        try{
            check(duck, schema)
        } catch(e) {
            //TODO: switch e.type
            setTimeout( 
                () => print_error(console, duck, schema)
            , 0)
            console.error(e)
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
