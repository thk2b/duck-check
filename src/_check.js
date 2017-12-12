const get_type = require('./get_type')

/**
 * Private function. 
 * Examines the schema and runs the appropriate checks
 * @param {*} schema 
 * @param {*} duck
 * @returns {Boolean} – True if duck matches schema
 */
function _check(schema, duck){
    const schema_type = get_type(schema)
    const duck_type = get_type(duck)

    switch(schema_type){
        case 'array':
            return duck_type === 'array' ?_check_array(schema, duck) : false
        case 'object':
            return duck_type === 'object' ? _check_object(schema, duck) : false
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

function _check_object(schema, obj){
    for(let key in schema){
        if( !_check(schema[key], obj[key])) return false
    }
    return true
}

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

function _check_function(fn, duck){
    if(fn.name === 'Boolean') return false /* hack */
    try {
        return fn(duck) === true
    } catch(e) {
        return false
    }
}

module.exports = {
    _check
}