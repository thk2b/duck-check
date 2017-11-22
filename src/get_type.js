const is_type = {
    array: duck => Array.isArray(duck),
    null: duck => duck === null,
    object: duck => typeof duck === 'object', // warning: will return true for null
    number: duck => typeof duck === 'number' && !isNaN(duck),
    string: duck => typeof duck === 'string',
    boolean: duck => typeof duck === 'boolean',
    function: duck => !!(typeof duck === 'function' && duck.name),
    anonymous_function: duck => typeof duck === 'function' && !duck.name,
    undefined: duck => typeof duck === 'undefined',
    NaN: duck => isNaN(duck),
}

const types = [ /* order is crutial: ie. must check null before object */
    'array', 
    'null', 
    'object', 
    'number', 
    'string',
    'boolean', 
    'function', 
    'anonymous_function', 
    'undefined', 
    'NaN'
]

function get_type(duck){
    const type = types.find( type => is_type[type](duck))
    if(!type){
        throw new Error(`Cannot find type of '${duck}'`)
    }
    return type
}

module.exports = {
    get_type,
    is_type
}