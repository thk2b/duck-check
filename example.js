const type_checker = require('./index')

// const check_vector = type_checker([Number])

// check_vector([1,2])
// check_vector(['1', 2])

// const check_matrix = type_checker([check_vector])
// check_matrix([[1,2], [3,4]])
// check_matrix([[1,2], ['a',4]])
// check_matrix([[1,2], 3,4])

const Vector = type_checker(Number)

const check = type_checker({a: Vector, b: [ String, String ]})
check({a: 'a', b: ['a', '1']})