const MAX_INDENT = 5

const error_messages = {
    /* checking errors*/
    1: (schema_type, duck_type, duck ) => {
        let value = duck
        switch(duck_type){
            case 'null':
            case 'undefined':
            case 'NaN':
                value = ''
        }
        return `Expected ${schema_type}: Got ${duck_type.replace('_', ' ')} ${value}`
    },
    2: (arr, n_errors) => (n_errors === 1 
        ? `Invalid element in array ${JSON.stringify(arr)}:`
        : `${n_errors} invalid elements in array ${JSON.stringify(arr)}:`
    ),
    3: (arr, n_errors) => (n_errors === 1 
        ? `Invalid element in positional array ${JSON.stringify(arr)}:`
        : `${n_errors} invalid elements in positional array ${JSON.stringify(arr)}:`
    ),
    4: key => `Expected key '${key}': Was undefined`,
    5: (obj, n_errors) =>  (n_errors === 1 
        ? `Invalid property in object ${JSON.stringify(obj)}:`
        : `${n_errors} invalid properties in object ${JSON.stringify(obj)}:`
    ),
    6: (duck) => `Invalid type: custom check failed on ${JSON.stringify(duck)}:`, // TODO: improve this message
    7: (class_name, duck_type) => ( duck_type === 'object'
        ? `Expected instance of class ${class_name}`
        :`Expected instance of ${class_name}: Got ${duck_type}`
    ),
    8: (element_type) => `Expected array. Was empty`,
    /* modifier errors*/
    10: (schema_name, duck_type) => `Expected not ${schema_name}: Got ${duck_type.replace('_', ' ')}`,
    11: (schema_name_a, schema_name_b, duck_type, duck) => {
        let value = duck
        switch(duck_type){
            case 'null':
            case 'undefined':
            case 'NaN':
                value = ''
        }
        return `Expected either ${schema_name_a} or ${schema_name_b}: Got ${duck_type.replace('_', ' ')} ${value}`
    },

    //  (schema_name_a, schema_name_b, duck_type, duck) => `Expected either ${schema_name_a} or ${schema_name_b}: Got ${duck_type} ${duck}`
}

const indent = (str, level) => {
    const space = Array(Math.min(MAX_INDENT, level+1 )).join('    ')
    return str.replace('\n', '\n' + space)
}

function generate_error_message(error, indent_level=0){
    const prefix = '\n - '
    if(error.data && error.data.length >= 0){
        return prefix + error.message + error.data.map(
            e => (
                indent(generate_error_message(e, indent_level + 1), indent_level + 1 )
            )
        ).join('')
    } else {
        return prefix + indent(error.message, indent_level)
    }
}

module.exports = {
    generate_error_message,
    error_messages
}
