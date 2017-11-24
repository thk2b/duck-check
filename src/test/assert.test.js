const { assert } = require('../check')

describe('assert', () => {
    it('should accept a constructor', () => {
        expect(assert(Number)(1) )
            .toBe(true)
        expect(assert(Number)(undefined) )
            .toBe(false)

        expect(assert(String)('1') )
            .toBe(true)
        expect(assert(String)(1) )
            .toBe(false)

        expect( assert(Function)(() => {}) )
            .toBe(true)

    })

    it('should work with arrays', () => {
        const schema = [Number]
        expect(assert(schema)([1,2,3]))
            .toBe(true)
        expect(assert(schema)([1,2,'1']))
            .toBe(false)
    })
    it('should work with objects', () => {
        const schema = {a: Number}
        expect(assert(schema)({a: 1}))
            .toBe(true)
        expect(assert(schema)({b: 1}))
            .toBe(false)
        expect(assert(schema)({a: 'a'}))
            .toBe(false)
    })
    it('should work with base values', () => {
        const schema = Number
        expect( assert(schema)( 1 ))
            .toBe(true)
        expect( assert(schema)('a'))
            .toBe(false)
    })

    it('should work with type_check functions', () => {
        const assert_number_array = assert([Number])
        const schema =  {a: assert_number_array}
        expect(assert(schema)({a: [1,2,3]}))
            .toBe(true)
         expect(assert(schema)({a: [1,'2',3]}))
            .toBe(false)
        expect(assert(schema)({a: 1}))
            .toBe(false)
    })

    it('should work with the Function constructor', () => {
        const schema =  [Function]
        const fn = () => {}
        expect( assert(schema)( [fn,fn]))
            .toBe(true)
         expect( assert(schema)( [fn, 1]))
            .toBe(false)
        expect( assert(schema)( fn))
            .toBe(false)
    })
    it('should handle finding instances of any non-primitive constructor', () => {
        const schema = [Date, Audio]
        expect(assert(schema)([new Date(), new Audio()]))
            .toBe(true)
        expect(assert(schema)(['a', new Audio()]))
            .toBe(false)
    })

    it('should handle nested objects', () => {
        const schema = {a: {b: Number, c: Boolean}}
        expect( assert(schema)( {a: {b: 1, c: true}}))
            .toBe(true)
        expect( assert(schema)( {a: {b: 1, c: 't'}}))
            .toBe(false)
        expect( assert(schema)( {a: {b: 1, z: 't'}}))
            .toBe(false)
    })
    it('should handle nested arrays', () => {
        const schema = [[Number]]
        expect( assert(schema)([[1,2,3],[4,5]]))
            .toBe(true)
        expect( assert(schema)([1,2,3,4,5]))
            .toBe(false)
        expect( assert(schema)([[1,2,3],[4,'a']]))
            .toBe(false)
    })
    it('should handle nested mixed objects and arrays', () => {
        const schema = [{a: Number, b: String}]
        expect( assert(schema)([{a: 1, b: 'a'}, {a: 123, b: 'abc'}]))
            .toBe(true)
        expect( assert(schema)([{c: 1, b: 'a'}, {a: 123, b: 'abc'}]))
            .toBe(false)
        expect( assert(schema)([{a: 1, b: 1}, {a: 123, b: 'abc'}]))
            .toBe(false)
    })
    it('should handle deep nested mixed objects and arrays', () => {
        const schema = [{
            a: Number, 
            b: String, 
            c: [
                {d: Boolean}
            ]
        }]

        expect( assert(schema)([{a: 1, b: 'a', c: [{d: true}, {d: false}]}]))
            .toBe(true)
        expect( assert(schema)([{a: 1, b: 'a', c: [{d: 'a'}]}]))
            .toBe(false)
        expect( assert(schema)([{a: 1, b: 'a', c: {d: true}}]))
            .toBe(false)
        expect( assert(schema)([{a: 1, b: 'a', c: [{z: true}]}]))
            .toBe(false)
    })
    it('should handle falsy values, arrays, objects, functions', () => {
        const str_array_assert = assert([String])
        const validate = assert({
            a: [Number, String, Function],
            b: {
                c: [str_array_assert]
            }
        })

        expect(validate({
            a: [1, 'a', String],
            b: {
                c: [['a', 'b'], ['c']]
            }
        })).toBe(true)
        
        expect(validate({
            a: [1, 'a', null],
            b: {
                c: [['a', 'b'], ['c']]
            }
        })).toBe(false)

        expect(validate({
            a: [1, 'a', String],
            b: {
                c: ['a', 'b']
            }
        })).toBe(false)
    })
})


describe('checking with falsy values', () => {
    it('should handle null', () => {
        expect(assert(Number)(null))
            .toBe(false)
        expect(assert({a: Number})({a: null}))
            .toBe(false)
        expect(assert({a: Number})(null))
            .toBe(false)
        expect(assert([Number])(null))
            .toBe(false)
        expect(assert([Number])([null]))
            .toBe(false)
        expect(assert(assert([Number]))([null]))
            .toBe(false)
    })
    it('should handle undefined', () => {
        expect(assert(Number)(undefined))
            .toBe(false)
        expect(assert({a: Number})({a: undefined}))
            .toBe(false)
        expect(assert({a: Number})(undefined))
            .toBe(false)
        expect(assert([Number])(undefined))
            .toBe(false)
        expect(assert([Number])([undefined]))
            .toBe(false)
        expect(assert(assert([Number]))([undefined]))
            .toBe(false)
    })
    it('should handle NaN', () => {
        expect(assert(Number)(NaN))
            .toBe(false)
        expect(assert({a: Number})({a: NaN}))
            .toBe(false)
        expect(assert({a: Number})(NaN))
            .toBe(false)
        expect(assert([Number])(NaN))
            .toBe(false)
        expect(assert([Number])([NaN]))
            .toBe(false)
        expect(assert(assert([Number]))([NaN]))
            .toBe(false)
    })
})