const check_object = (obj, schema) => {
    for(let key in schema){
        if(typeof schema[key] === 'object' && typeof schema[key] !== null){
            check_object(obj[key], schema[key])
        } else if(typeof obj[key] !== schema[key]){
            if(typeof obj[key] === 'undefined'){
                const difference = Object.keys(obj).filter(x => Object.keys(schema).indexOf(x) == -1)
                throw new Error(
                    `Expected object to have properties {${Object.keys(schema)}}. Found propert${difference.length > 1? 'ies':'y'} {${difference}}`
                )
            } else {
                throw new Error(
                    `Expected property of type '${schema[key]}' in object '${JSON.stringify(obj)}.' Got '${obj[key]}' of type '${typeof obj[key]}' instead.`
                )

            }
        } else if (schema[key] === 'number' && isNaN(obj[key])){
            throw new Error(
                `Expected property of type 'number' in object '${JSON.stringify(obj)}'. Got NaN instead`
            )
        }
    }
    return obj
}

function make_checker(schema){
    for(let key in schema){
        if(typeof key !== 'string'){
            schema[key] = typeof schema[key]
        }
    }
    return obj => check_object(obj, schema)
}

module.exports = make_checker
