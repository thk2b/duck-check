const is_type = {
    array: duck => Array.isArray(duck),
    null: duck => duck === null,
    object: duck => typeof duck === 'object',
    number: duck => typeof duck === 'number' && !isNaN(duck),
    string: duck => typeof duck === 'string',
    function: duck => !!(typeof duck === 'function' && duck.name),
    anonymous_function: duck => typeof duck === 'function' && !duck.name,
    undefined: duck => typeof duck === 'undefined',
    NaN: duck => isNaN(duck),
}

function get_type(duck){
    return [
        'array', 
        'null', 
        'object', 
        'number', 
        'string', 
        'function', 
        'anonymous_function', 
        'undefined', 
        'NaN'
    ].find( type => is_type[type](duck))
}

module.exports = {
    get_type,
    is_type
}