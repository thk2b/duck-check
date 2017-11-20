function check_object(obj, schema){
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

function check_array(arr, schema){
    if(schema.length === 1){ /* all elements have the same type */
        if(arr.length === 0){
            throw new TypeError(
                `Expected array elements to have type '${schema[0]}'. Got an empty array instead`
            )
        } else {
            arr.forEach( el => {
                if(typeof el !== schema[0]){
                    throw new TypeError(
                        `Expected array element to have type '${schema[0]}'. Got '${el}' of type ${typeof el} instead`
                    )
                }
            })
        }
    } else if(schema.length > 1){ /* positional array of diffeernt types */
        arr.forEach( (el, i) => {
            if(typeof el !== schema[i]){
                throw new TypeError(
                    `Expected array element to have type '${schema[i]}'. Got '${el}' of type ${typeof el} instead`
                )
            }
        })
    } else { /* array of any */
        if(!Array.isArray(arr)){
            throw new TypeError(
                `Expected an array. Got '${arr}' of type '${typeof arr} instead'`
            )
        }
    }
} 

function make_checker(schema){
    if(Array.isArray(schema)){
        return arr => check_object(arr, schema)
    } else {
        return obj => check_object(obj, schema)
    }
}

module.exports = make_checker
