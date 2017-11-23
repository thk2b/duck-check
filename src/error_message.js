const MAX_INDENT = 5

const indent = (str, level) => {
    const space = Array(Math.min(MAX_INDENT, level+1 )).join('\t')
    return str.replace('\n', '\n' + space)
}

function error_message(error, indent_level=0){
    if(error.data && error.data.length >= 0){
        return '\n' + error.message + error.data.map(
            e => (
                indent(error_message(e, indent_level + 1), indent_level + 1 )
            )
        ).join('')
    } else {
        return '\n' + indent(error.message, indent_level)
    }
}

module.exports = error_message