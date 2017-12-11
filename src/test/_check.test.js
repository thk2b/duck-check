const { _check } = require('../_check')

describe('private _check', () => {
    [Number, Boolean, String].forEach( constructor => {
        it(`should return true if duck is a ${constructor.name} and schema is the ${constructor.name} constructor`, () => {
            
            expect(
                _check(constructor, new constructor(1))
            ).toBe(true)
        })
        it(`should return false if duck is not ${constructor.name} and schema is the ${constructor.name} constructor`, () => {
            expect(
                _check(constructor, new Date())
            ).toBe(false)
        })
    });

    [null, undefined, NaN].forEach( falsy => {
        it(`should return true if duck is ${falsy} and schema is ${falsy}`, () => {
            expect(
                _check(falsy, falsy)
            ).toBe(true)
        })
        it(`should return false if duck is not ${falsy} and schema is ${falsy}`, () => {
            expect(
                _check(falsy, 1)
            ).toBe(false)
        })
    });

    it('should return true if duck is a function and schema is the Function constructor', () => {
        function _fn(){}
        expect(
            _check(Function, _fn)
        ).toBe(true)
    })
    it('should return false if duck is a function and schema is not Function constructor', () => {
        function _fn(){}
        expect(
            _check(String, _fn)
        ).toBe(false)
    })

    it(`should return true if duck is a custom class constructor and schema is the custom constructor`, () => {
        expect(
            _check(Date, new Date())
        ).toBe(true)
    })
    it(`should return false if duck is a custom class constructor and schema is not the custom constructor`, () => {
        expect(
            _check(Number, new Date())
        ).toBe(false)
    })

})

describe('private _check on array', () => {
    it('should return true if array matches positional array', () => {
        function _fn(){}
        const arr = [1,'1', _fn]
        const sch = [Number, String, Function]
        expect(
            _check(sch, arr)
        ).toBe(true)
    })
    it('should return false if array does not match positional array', () => {
        function _fn(){}
        const arr = [1,'1', _fn]
        const sch = [Number, String, String]
        expect(
            _check(sch, arr)
        ).toBe(false)
    })
    it('should return false if array is shorter than positional array', () => {
        const arr = [1,'1']
        const sch = [Number, String, Function]
        expect(
            _check(sch, arr)
        ).toBe(false)
    })
    it('should return false if positional array is longer than schema', () => {
        const arr = [1,'1', function a(){}, 2]
        const sch = [Number, String, Function]
        expect(
            _check(sch, arr)
        ).toBe(false)
    })
    it('should return false if array is empty when expecting positional array', () => {
        const arr = []
        const sch = [Number, String]
        expect(
            _check(sch, arr)
        ).toBe(false)
    })
    it('should return true if array matches typed array', () => {
        const arr = [1, 2, 3]
        const sch = [Number]
        expect(
            _check(sch, arr)
        ).toBe(true)
    })
    it('should return false if array does not match typed array', () => {
        const arr = [1, 2, 3]
        const sch = [String]
        expect(
            _check(sch, arr)
        ).toBe(false)
    })
    it('should return false if array is empty when expecting typed array', () => {
        const arr = []
        const sch = [Number]
        expect(
            _check(sch, arr)
        ).toBe(false)
    })

})

describe('private _check on object', () => {
    it('should return true if object matches schema', () => {
        const obj = {a: 'a', n: 1, d: new Date()}
        const sch = {a: String, n: Number, d: Date}
        expect(
            _check(sch, obj)
        ).toBe(true)
    })
    it('should return false if key defined in schema is not on the object', () => {
        const obj = {a: 'a', d: new Date()}
        const sch = {a: String, n: Number, d: Date}
        expect(
            _check(sch, obj)
        ).toBe(false)
    })
    it('should return true if the object has keys not defined on the schema', () => {
        const obj = {a: 'a', n: 1, d: new Date(), other: 'value'}
        const sch = {a: String, n: Number, d: Date}
        expect(
            _check(sch, obj)
        ).toBe(true)
    })
    it('should return false if a value on the object does not match the schema type', () => {
        const obj = {a: 'a', n: NaN, d: new Date()}
        const sch = {a: String, n: Number, d: Date}
        expect(
            _check(sch, obj)
        ).toBe(false)
    })
    it('should return false if the object is empty and the schema is not empty', () => {
        expect(
            _check({a: Number}, {})
        ).toBe(false)
    })
    it('should return true if the object is empty and the schema is empty', () => {
        expect(
            _check({}, {})
        ).toBe(true)
    })
})

describe('private _check with function to be called as schema', () => {
    it('should return true if anonymous function does not return false', () => {
        const val = 'a'
        expect( 
            _check( d => d === val, 'a')
        ).toBe(true)
    })
    it('should return false if anonymous function return false', () => {
        expect(
            _check(() => false, 'a')
        ).toBe(false)
    })
    it('should return false if anonymous function throws', () => {
        const _fn = () => { throw new Error() }
        expect(
            _check(_fn, 'a')
        ).toBe(false)
    })
    it('should return true if schema is a named function and duck passes the test', () => {
        function _fn(d){ return d > 10}
        expect(
            _check(_fn, 11)
        ).toBe(true)
    })
    it('should return true if schema is a named function and duck does not pass the test', () => {
        function _fn(d){ return d > 10}
        expect(
            _check(_fn, 1)
        ).toBe(false)
    })
    it('should return false if duck is an anonymous function and schema is an anonymous function', () => {
        expect(
            _check(() => {}, () => {})
        ).toBe(false)
    })
})

describe('private _check on nested schemas', () => {
    it('should return true if nested array matches schema', () => {
        const sch = [[Number], [Number], [[[String, Date]]]]
        const arr = [[1,2], [1,2], [[['a', new Date()], ['b', new Date()]]]]
        expect(
            _check(sch, arr)
        ).toBe(true)
    })
    it('should return false if nested array does not match schema', () => {
        const sch = [[Number], [Number], [[[String, Date]]]]
        const arr = [[1,2], [1,2], [[['a', 'another string'], ['b', new Date()]]]]
        expect(
            _check(sch, arr)
        ).toBe(false)
    })
    it('should return true if nested object matches schema', () => {
        const sch = {a: Number, b: { c: String, d: Date }}
        const obj = {a: 1, b: { c: 'a', d: new Date() }}
        expect(
            _check(sch, obj)
        ).toBe(true)
    })
    it('should return false if nested object does not match schema', () => {
        const sch = {a: Number, b: { c: String, d: Date }}
        const obj = { a: 1, b: { c: 123, e: new Date() }}
        expect(
            _check(sch, obj)
        ).toBe(false)
    })
    it('should return true if duck matches nested anonymous function', () => {
        const fn_1 = d => d > 2 
        
        expect(
            _check( d => fn_1(d), 20)
        ).toBe(true)
    })
    it('should return false if duck does not match nested anonymous function', () => {
        const fn_1 = d => d > 2 
        
        expect(
            _check( d => fn_1(d), 0)
        ).toBe(false)
    })
    it('should return true if nested array, objects match schema containing nested arrays, obects, anonymous functions', () => {
        const sch = [{ a: Number, b: { c: String, d: n => n > 10, e: [ Date ]}}]
        const d = [
            {a: 1, b: { c: 's', d: 12, e: [new Date(), new Date()]}},
            {a: 2, b: { c: 'a', d: 120, e: [new Date(), new Date()]}}
        ]
        expect(
            _check(sch, d)
        ).toBe(true)
    })
    it('should return false if nested array, objects does not match schema containing nested arrays, obects, anonymous functions', () => {
        const sch = [{ a: Number, b: { c: String, d: n => n > 10, e: [ Date ]}}]
        const d = [
            {a: 1, b: { c: 's', d: 12, e: [new Date(), new Date()]}},
            {a: 2, b: { c: 'a', d: 120, e: [new Date(), 1, new Date()]}}
        ]
        expect(
            _check(sch, d)
        ).toBe(false)
    })
})