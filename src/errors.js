const MAX_INDENT = 5

const generate_error = (data, singular, plural) => {
    if(data.length === 1){
        throw {
            message: singular,
            data
        }
    } else if(data.length > 1){
        throw {
            message: plural,
            data
        }
    }
}

const indent = (str, level) => {
    const space = Array(Math.min(MAX_INDENT, level+1 )).join('    ')
    return str.replace('\n', '\n' + space)
}

function error_message(error, indent_level=0){
    const prefix = '\n - '
    if(error.data && error.data.length >= 0){
        return prefix + error.message + error.data.map(
            e => (
                indent(error_message(e, indent_level + 1), indent_level + 1 )
            )
        ).join('')
    } else {
        return prefix + indent(error.message, indent_level)
    }
}

module.exports = {
    generate_error,
    error_message
}
