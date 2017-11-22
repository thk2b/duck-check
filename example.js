const check = require('./index')

// const check_vector = type_checker([Number])

// check_vector([1,2])
// check_vector(['1', 2])

// const check_matrix = type_checker([check_vector])
// check_matrix([[1,2], [3,4]])
// check_matrix([[1,2], ['a',4]])
// check_matrix([[1,2], 3,4])

// const Vector = check(Number)

// const checker = check({a: Vector, b: [ String, String ]})
// checker({a: 'a', b: ['a', '1']})

check(Number)(NaN)