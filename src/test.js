const {
    check_type,
    check_array,
    check_object,
    check_function,
    check,
    type_checker,
} = require('./index')

describe('check_type', () => {
    it('should accept a constructor', () => {
        expect( () => check_type(1, Number) )
            .not.toThrow()
        expect( () => check_type(undefined, Number) )
            .toThrow()

        expect( () => check_type('1', String) )
            .not.toThrow()
        expect( () => check_type(1, String) )
            .toThrow()

        expect( () => check_type(() => {}, Function) )
            .not.toThrow()

    })
})

describe('check_object', () => {
    it('should verify an object', () => {
        const schema = {a: Number}

        expect(() => check_object({a: 1}, schema))
            .not.toThrow()
        expect(() => check_object({a: 'a'}, schema))
            .toThrow()
    })
})

describe('check_array', () => {
    it('should verify an array against an array of one type', () => {
        const schema = [Number]

        expect(() => check_array([1,2,3], schema))
            .not.toThrow()
        expect(() => check_array([1,2,'a'], schema))
            .toThrow()
    })
    it('should verify an array against a positional array', () => {
        const schema = [String, Number]

        expect(() => check_array(['a',2], schema))
            .not.toThrow()
        expect(() => check_array([1,2], schema))
            .toThrow()
        expect(() => check_array(['a',2,3], schema))
            .toThrow()
        expect(() => check_array(['a'], schema))
            .toThrow()
    })
})

describe('check_function', () => {
    it('should accept a type_checker function', () => {
        const number_checker = type_checker(Number)
        expect( () => check_function(1, number_checker))
            .not.toThrow()
        expect( () => check_function('a', number_checker))
            .toThrow()
    })
})

describe('check', () => {
    it('should work with arrays', () => {
        const schema = [Number]
        expect(() => check([1,2,3], schema))
            .not.toThrow()
        expect(() => check([1,2,'1'], schema))
            .toThrow()
    })
    it('should work with objects', () => {
        const schema = {a: Number}
        expect(() => check({a: 1}, schema))
            .not.toThrow()
        expect(() => check({b: 1}, schema))
            .toThrow()
        expect(() => check({a: 'a'}, schema))
            .toThrow()
    })
    it('should work with base values', () => {
        const schema = Number
        expect(() => check( 1, schema))
            .not.toThrow()
        expect(() => check('a', schema))
            .toThrow()
    })

    it('should work with type_check functions', () => {
        const check_number_array = [Number]
        const schema =  {a: check_number_array}
        expect(() => check( {a: [1,2,3]}, schema))
            .not.toThrow()
         expect(() => check( {a: [1,'2',3]}, schema))
            .toThrow()
        expect(() => check( {a: 1}, schema))
            .toThrow()
    })

    it('should work with the Function constructor', () => {
        const schema =  [Function]
        const fn = () => {}
        expect(() => check( [fn,fn], schema))
            .not.toThrow()
         expect(() => check( [fn, 1], schema))
            .toThrow()
        expect(() => check( fn, schema))
            .toThrow()
    })
    it('should handle nested objects', () => {
        const schema = {a: {b: Number, c: Boolean}}
        expect(() => check( {a: {b: 1, c: true}}, schema))
            .not.toThrow()
        expect(() => check( {a: {b: 1, c: 't'}}, schema))
            .toThrow()
        expect(() => check( {a: {b: 1, z: 't'}}, schema))
            .toThrow()
    })
    it('should handle nested arrays', () => {
        const schema = [[Number]]
        expect(() => check( [[1,2,3],[4,5]], schema))
            .not.toThrow()
        expect(() => check( [1,2,3,4,5], schema))
            .toThrow()
        expect(() => check( [[1,2,3],[4,'a']], schema))
            .toThrow()
    })
    it('should handle nested mixed objects and arrays', () => {
        const schema = [{a: Number, b: String}]
        expect(() => check( [{a: 1, b: 'a'}, {a: 123, b: 'abc'}], schema))
            .not.toThrow()
        expect(() => check( [{c: 1, b: 'a'}, {a: 123, b: 'abc'}], schema))
            .toThrow()
        expect(() => check( [{a: 1, b: 1}, {a: 123, b: 'abc'}], schema))
            .toThrow()
    })
    it('should handle deep nested mixed objects and arrays', () => {
        const schema = [{
            a: Number, 
            b: String, 
            c: [
                {d: Boolean}
            ]
        }]

        expect(() => check( [{a: 1, b: 'a', c: [{d: true}, {d: false}]}], schema))
            .not.toThrow()
        expect(() => check( [{a: 1, b: 'a', c: [{d: 'a'}]}], schema))
            .toThrow()
        expect(() => check( [{a: 1, b: 'a', c: {d: true}}], schema))
            .toThrow()
        expect(() => check( [{a: 1, b: 'a', c: [{z: true}]}], schema))
            .toThrow()
    })
})

describe('type_checker', () => {
    it('should return a function', () => {
        expect(typeof type_checker({}))
            .toBe('function')
    })
    it('the returned function should test things', () => {
        const checker = type_checker({a: Number, b: Number})
        expect(() => checker({a: 1, b: 2}))
            .not.toThrow()
        expect(() => checker({a: 'a', b: 2}))
            .toThrow()
    })
})