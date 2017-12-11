const {
    check_array,
    check_object,
    check_function,
    _check,
} = require('../check')

const {
    check,
    assert
} = require('../index')

describe('', () => {})

// describe('private check', () => {
//     it('should accept a constructor', () => {
//         expect( _check(Number, 1) )
//             .toBe(true)
//         expect( _check(Number, undefined) )
//             .toBe(false)

//         expect( _check(String, '1') )
//             .toBe(true)
//         expect( _check(String, 1) )
//             .toBe(false)

//         expect( _check(Function, () => {}) )
//             .toBe(true)

//     })

//     it('should return duck', () => {
//         const A = check({a: String})
//         const a = A({a:'a'})
//         expect(a).toEqual({a:'a'})
//     })
// })

// describe('check_object', () => {
//     it('should verify an object', () => {
//         const schema = {a: Number}

//         expect( check_object(schema, {a: 1}))
//             .toBe(true)
//         expect( check_object(schema, {a: 'a'}))
//             .toBe(false)
//     })
// })

// describe('check_array', () => {
//     it('should verify an array against an array of one type', () => {
//         const schema = [Number]

//         expect( check_array(schema, [1,2,3]))
//             .toBe(true)
//         expect( check_array(schema, [1,2,'a']))
//             .toBe(false)
//     })
//     it('should verify an array against a positional array', () => {
//         const schema = [String, Number]

//         expect( check_array(schema, ['a',2]))
//             .toBe(true)
//         expect( check_array(schema, [1,2]))
//             .toBe(false)
//         expect( check_array(schema, ['a',2,3]))
//             .toBe(true)
//         expect( _check(schema, ['a']))
//             .toBe(false) 
//     })
// })

// describe('check_function', () => {
//     it('should accept a type checker function', () => {
//         const number_checker = check(Number)
//         expect( check_function(number_checker, 1))
//             .toBe(true)
//         expect( check_function(number_checker, 'a'))
//             .toBe(false)
//     })
// })

// describe('_check', () => {
//     it('should work with arrays', () => {
//         const schema = [Number]
//         expect( _check(schema, [1,2,3]))
//             .toBe(true)
//         expect( _check(schema, [1,2,'1']))
//             .toBe(false)
//     })
//     it('should work with objects', () => {
//         const schema = {a: Number}
//         expect( _check(schema, {a: 1}))
//             .toBe(true)
//         expect( _check(schema, {b: 1}))
//             .toBe(false)
//         expect( _check(schema, {a: 'a'}))
//             .toBe(false)
//     })
//     it('should work with base values', () => {
//         const schema = Number
//         expect( _check(schema,  1))
//             .toBe(true)
//         expect( _check(schema, 'a'))
//             .toBe(false)
//     })

//     it('should work with type_check functions', () => {
//         const check_number_array = check([Number])
//         const schema =  {a: check_number_array}
//         expect( _check(schema, {a: [1,2,3]}))
//             .toBe(true)
//          expect( _check(schema, {a: [1,'2',3]}))
//             .toBe(false)
//         expect( _check(schema, {a: 1}))
//             .toBe(false)
//     })

//     it('should work with the Function constructor', () => {
//         const schema =  [Function]
//         const fn = () => {}
//         expect( _check(schema, [fn,fn]))
//             .toBe(true)
//          expect( _check(schema, [fn, 1]))
//             .toBe(false)
//         expect( _check(schema, fn))
//             .toBe(false)
//     })
//     it('should handle nested objects', () => {
//         const schema = {a: {b: Number, c: Boolean}}
//         expect( _check(schema, {a: {b: 1, c: true}}))
//             .toBe(true)
//         expect( _check(schema, {a: {b: 1, c: 't'}}))
//             .toBe(false)
//         expect( _check(schema, {a: {b: 1, z: 't'}}))
//             .toBe(false)
//     })
//     it('should handle nested arrays', () => {
//         const schema = [[Number]]
//         expect( _check(schema, [[1,2,3],[4,5]]))
//             .toBe(true)
//         expect( _check(schema, [1,2,3,4,5]))
//             .toBe(false)
//         expect( _check(schema, [[1,2,3],[4,'a']]))
//             .toBe(false)
//     })
//     it('should handle nested mixed objects and arrays', () => {
//         const schema = [{a: Number, b: String}]
//         expect( _check(schema, [{a: 1, b: 'a'}, {a: 123, b: 'abc'}]))
//             .toBe(true)
//         expect( _check(schema, [{c: 1, b: 'a'}, {a: 123, b: 'abc'}]))
//             .toBe(false)
//         expect( _check(schema, [{a: 1, b: 1}, {a: 123, b: 'abc'}]))
//             .toBe(false)
//     })
//     it('should handle positional arrays with objects', () => {
//         const schema = [{a: Number}, {b: String}]
//         expect( _check(schema, [{a: 1}, {b: 'a'}]))
//             .toBe(true)
//         expect( _check(schema,  [{c: 1}, {b: 'a'}]))
//             .toBe(false)
//         expect( _check(schema,  [{a: 1}, {b: 1}]))
//             .toBe(false)
//     })
//     it('should handle finding instances of any non-primitive constructor', () => {
//         const schema = [Date, Audio]
//         expect( _check(schema, [new Date(), new Audio()]))
//             .toBe(true)
//         expect( _check(schema,  ['a', new Audio()]))
//             .toBe(false)
//         expect( _check(Date, new Date()))
//             .toBe(true)
//         expect( _check(Date, 1))
//             .toBe(false)
//         expect( _check(String, new Date()))
//             .toBe(false)
//     })

//     it('should handle deep nested mixed objects and arrays', () => {
//         const schema = [{
//             a: Number, 
//             b: String, 
//             c: [
//                 {d: Boolean}
//             ]
//         }]

//         expect( _check(schema, [{a: 1, b: 'a', c: [{d: true}, {d: false}]}]))
//             .toBe(true)
//         expect( _check(schema, [{a: 1, b: 'a', c: [{d: 'a'}]}]))
//             .toBe(false)
//         expect( _check(schema, [{a: 1, b: 'a', c: {d: true}}]))
//             .toBe(false)
//         expect( _check(schema, [{a: 1, b: 'a', c: [{z: true}]}]))
//             .toBe(false)
//     })
//     it('should handle falsy values, arrays, objects, functions', () => {
//         const str_array_check = check([String])
//         const validate = check({
//             a: [Number, String, Function],
//             b: {
//                 c: [str_array_check]
//             }
//         })

//         expect( validate({
//             a: [1, 'a', String],
//             b: {
//                 c: [['a', 'b'], ['c']]
//             }
//         })).toBe(true)
        
//         expect( validate({
//             a: [1, 'a', null],
//             b: {
//                 c: [['a', 'b'], ['c']]
//             }
//         })).toBe(false)

//         expect( validate({
//             a: [1, 'a', String],
//             b: {
//                 c: ['a', 'b']
//             }
//         })).toBe(false)
//     })
// })

// describe('checking with falsy values', () => {
//     it('should handle null', () => {
//         expect( _check(Number, null))
//             .toBe(false)
//         expect( _check({a: Number}, {a: null}))
//             .toBe(false)
//         expect( _check({a: Number}, null))
//             .toBe(false)
//         expect( _check([Number], null))
//             .toBe(false)
//         expect( _check([Number], [null]))
//             .toBe(false)
//     })
//     it('should handle undefined', () => {
//         expect( _check(Number, undefined))
//             .toBe(false)
//         expect( _check({a: Number}, {a: undefined}))
//             .toBe(false)
//         expect( _check({a: Number}, undefined))
//             .toBe(false)
//         expect( _check([Number], undefined))
//             .toBe(false)
//         expect( _check([Number], [undefined]))
//             .toBe(false)
//         expect( check(check([Number]), [undefined]))
//             .toBe(false)
//     })
//     it('should handle NaN', () => {
//         expect( _check(Number, NaN))
//             .toBe(false)
//         expect( _check({a: Number}, {a: NaN}))
//             .toBe(false)
//         expect( _check({a: Number}, NaN))
//             .toBe(false)
//         expect( _check([Number], NaN))
//             .toBe(false)
//         expect( _check([Number], [NaN]))
//             .toBe(false)
//     })
// })

// describe('using assert function in schema and using check', () => {
//     it('should take an assert function', () => {
//         const asserter = assert([Number, String])
    
//         expect( _check(asserter, [1, 's']))
//             .toBe(true)
//         expect( _check({a: asserter, b: Number}, {a:[1, 's'], b: 1}))
//             .toBe(true)
//         expect( _check({a: asserter, b: Number}, {a:['1', 's'], b: 1}))
//             .toBe(false)
//         expect( _check({a: asserter, b: Number}, {a:['1', 's'], b: 1}))
//             .toBe(false)
//     })
//     it('should take any anonymous function that performs a check', () => {
//         expect( check(() => 1 === 2 )([1, 's']))
//             .toBe(false)
//     })
// })