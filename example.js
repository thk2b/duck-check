const {assert, check} = require('./index')

const not = a => {
    return a
}

check(not(Number))('a')