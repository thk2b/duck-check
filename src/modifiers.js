const { _check } = require('./check')

const not = schema => duck => {
    try{
        _check(schema, duck)
    } catch(e){
        return 
    }
    throw {
        message: `Expected not ${schema}: Got ${duck}`
    }
}

/**
 * Throws if both options are invalid
 * @param {*} a - First option. Any valid schema
 * @param {*} b - Second option. Any valid schema
 */

const either = (a, b) => duck => {
    try {
        _check(a, duck)
    } catch(e) {
        try {
            _check(b, duck)
        } catch (e) {
            throw {
                message: `Expected either ${a} or ${b}:`,
                data: e.data
            }
        }
    }
}

const nonEmpty = non_empty = schema => duck => {

}

module.exports = {
    either
}