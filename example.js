const type_checker = require('./index')

// const check_vector = type_checker([Number])

// check_vector([1,2])
// check_vector(['1', 2])

// const check_matrix = type_checker([check_vector])
// check_matrix([[1,2], [3,4]])
// check_matrix([[1,2], ['a',4]])
// check_matrix([[1,2], 3,4])

const check = type_checker({a: Number, b: {c: String}})
check({a: 1, b: {d: 'a'}})