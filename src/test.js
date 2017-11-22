const {
    check_type,
    check_array,
    check_object,
    check_function,
    check,
    _check
} = require('./index')

const {
    get_type,
    is_type,
} = require('./get_type')

describe('is_type', () => {
    it('should find array', () => {
        const thing = ['hello']
        expect(is_type['array'](thing)).toBe(true)
    })
    it('should find object', () => {
        const thing = {a: 'hello'}
        expect(is_type['object'](thing)).toBe(true)
    })
    it('should find string', () => {
        const thing = 'hello'
        expect(is_type['string'](thing)).toBe(true)
    })
    it('should find number', () => {
        const thing = 1
        expect(is_type['number'](thing)).toBe(true) 
    })
    it('should find function', () => {
        function thing(a){ console.log(a) }
        expect(is_type['function'](thing)).toBe(true)
    })
    it('should find anonymous funciton', () => {
        expect(is_type['anonymous_function'](a => { console.log(a)})).toBe(true)
    })
    it('should find undefined', () => {
        const thing = undefined
        expect(is_type['undefined'](thing)).toBe(true)
    })
    it('should find null', () => {
        const thing = null
        expect(is_type['null'](thing)).toBe(true)
    })
    it('should find NaN', () => {
        const thing = NaN
        expect(is_type['NaN'](thing)).toBe(true)
    })
})

describe('get_type', () => {
    it('should find array', () => {
        const thing = ['hello']
        expect(get_type(thing)).toBe('array')
    })
    it('should find object', () => {
        const thing = {a: 'hello'}
        expect(get_type(thing)).toBe('object')
    })
    it('should find string', () => {
        const thing = 'hello'
        expect(get_type(thing)).toBe('string')
    })
    it('should find number', () => {
        const thing = 1
        expect(get_type(thing)).toBe('number')
    })
    it('should find function', () => {
        function thing(a){ console.log(a) }
        expect(get_type(thing)).toBe('function')
    })
    it('should find anonymous function', () => {
        expect(get_type(a => console.log(a))).toBe('anonymous_function')
    })
    it('should find undefined', () => {
        const thing = undefined
        expect(get_type(thing)).toBe('undefined')
    })
    it('should find null', () => {
        const thing = null
        expect(get_type(thing)).toBe('null')
    })
    it('should find NaN', () => {
        const thing = NaN
        expect(get_type(thing)).toBe('NaN')
    })
})

describe('public check', () => {
    it('should accept a constructor', () => {
        expect( () => check_type(Number, 1) )
            .not.toThrow()
        expect( () => check_type(Number, undefined) )
            .toThrow()

        expect( () => check_type(String, '1') )
            .not.toThrow()
        expect( () => check_type(String, 1) )
            .toThrow()

        expect( () => check_type(Function, () => {}) )
            .not.toThrow()

    })
})

describe('check_object', () => {
    it('should verify an object', () => {
        const schema = {a: Number}

        expect(() => check_object(schema, {a: 1}))
            .not.toThrow()
        expect(() => check_object(schema, {a: 'a'}))
            .toThrow()
    })
})

describe('check_array', () => {
    it('should verify an array against an array of one type', () => {
        const schema = [Number]

        expect(() => check_array(schema, [1,2,3]))
            .not.toThrow()
        expect(() => check_array(schema, [1,2,'a']))
            .toThrow()
    })
    it('should verify an array against a positional array', () => {
        const schema = [String, Number]

        expect(() => check_array(schema, ['a',2]))
            .not.toThrow()
        expect(() => check_array(schema, [1,2]))
            .toThrow()
        expect(() => check_array(schema, ['a',2,3]))
            .toThrow()
        expect(() => check_array(schema, ['a']))
            .toThrow()
    })
})

describe('check_function', () => {
    it('should accept a type checker function', () => {
        const number_checker = check(Number)
        expect( () => check_function(number_checker, 1))
            .not.toThrow()
        expect( () => check_function(number_checker, 'a'))
            .toThrow()
    })
})

describe('check', () => {
    it('should work with arrays', () => {
        const schema = [Number]
        expect(() => _check(schema, [1,2,3]))
            .not.toThrow()
        expect(() => _check(schema, [1,2,'1']))
            .toThrow()
    })
    it('should work with objects', () => {
        const schema = {a: Number}
        expect(() => _check(schema, {a: 1}))
            .not.toThrow()
        expect(() => _check(schema, {b: 1}))
            .toThrow()
        expect(() => _check(schema, {a: 'a'}))
            .toThrow()
    })
    it('should work with base values', () => {
        const schema = Number
        expect(() => _check(schema,  1))
            .not.toThrow()
        expect(() => _check(schema, 'a'))
            .toThrow()
    })

    it('should work with type_check functions', () => {
        const check_number_array = check([Number])
        const schema =  {a: check_number_array}
        expect(() => _check(schema, {a: [1,2,3]}))
            .not.toThrow()
         expect(() => _check(schema, {a: [1,'2',3]}))
            .toThrow()
        expect(() => _check(schema, {a: 1}))
            .toThrow()
    })

    it('should work with the Function constructor', () => {
        const schema =  [Function]
        const fn = () => {}
        expect(() => _check(schema, [fn,fn]))
            .not.toThrow()
         expect(() => _check(schema, [fn, 1]))
            .toThrow()
        expect(() => _check(schema, fn))
            .toThrow()
    })
    it('should handle nested objects', () => {
        const schema = {a: {b: Number, c: Boolean}}
        expect(() => _check(schema, {a: {b: 1, c: true}}))
            .not.toThrow()
        expect(() => _check(schema, {a: {b: 1, c: 't'}}))
            .toThrow()
        expect(() => _check(schema, {a: {b: 1, z: 't'}}))
            .toThrow()
    })
    it('should handle nested arrays', () => {
        const schema = [[Number]]
        expect(() => _check(schema, [[1,2,3],[4,5]]))
            .not.toThrow()
        expect(() => _check(schema, [1,2,3,4,5]))
            .toThrow()
        expect(() => _check(schema, [[1,2,3],[4,'a']]))
            .toThrow()
    })
    it('should handle nested mixed objects and arrays', () => {
        const schema = [{a: Number, b: String}]
        expect(() => _check(schema, [{a: 1, b: 'a'}, {a: 123, b: 'abc'}]))
            .not.toThrow()
        expect(() => _check(schema, [{c: 1, b: 'a'}, {a: 123, b: 'abc'}]))
            .toThrow()
        expect(() => _check(schema, [{a: 1, b: 1}, {a: 123, b: 'abc'}]))
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

        expect(() => _check(schema, [{a: 1, b: 'a', c: [{d: true}, {d: false}]}]))
            .not.toThrow()
        expect(() => _check(schema, [{a: 1, b: 'a', c: [{d: 'a'}]}]))
            .toThrow()
        expect(() => _check(schema, [{a: 1, b: 'a', c: {d: true}}]))
            .toThrow()
        expect(() => _check(schema, [{a: 1, b: 'a', c: [{z: true}]}]))
            .toThrow()
    })
    it('should handle falsy values, arrays, objects, functions', () => {
        const str_array_check = check([String])
        const validate = check({
            a: [Number, String, Function],
            b: {
                c: [str_array_check]
            }
        })

        expect(() => validate({
            a: [1, 'a', String],
            b: {
                c: [['a', 'b'], ['c']]
            }
        })).not.toThrow()
        
        expect(() => validate({
            a: [1, 'a', null],
            b: {
                c: [['a', 'b'], ['c']]
            }
        })).toThrow()

        expect(() => validate({
            a: [1, 'a', String],
            b: {
                c: ['a', 'b']
            }
        })).toThrow()
    })
})

describe('checking with falsy values', () => {
    it('should handle null', () => {
        expect(() => check(Number)(null))
            .toThrow()
        expect(() => check({a: Number})({a: null}))
            .toThrow()
        expect(() => check({a: Number})(null))
            .toThrow()
        expect(() => check([Number])(null))
            .toThrow()
        expect(() => check([Number])([null]))
            .toThrow()
        expect(() => check(check([Number]))([null]))
            .toThrow()
    })
    it('should handle undefined', () => {
        expect(() => check(Number)(undefined))
            .toThrow()
        expect(() => check({a: Number})({a: undefined}))
            .toThrow()
        expect(() => check({a: Number})(undefined))
            .toThrow()
        expect(() => check([Number])(undefined))
            .toThrow()
        expect(() => check([Number])([undefined]))
            .toThrow()
        expect(() => check(check([Number]))([undefined]))
            .toThrow()
    })
    it('should handle NaN', () => {
        expect(() => check(Number)(NaN))
            .toThrow()
        expect(() => check({a: Number})({a: NaN}))
            .toThrow()
        expect(() => check({a: Number})(NaN))
            .toThrow()
        expect(() => check([Number])(NaN))
            .toThrow()
        expect(() => check([Number])([NaN]))
            .toThrow()
        expect(() => check(check([Number]))([NaN]))
            .toThrow()
    })
})

describe('check currying', () => {
    it('should return a function', () => {
        expect(typeof check({}))
            .toBe('function')
    })
    it('the returned function should test things', () => {
        const checker = check({a: Number, b: Number})
        expect(() => checker({a: 1, b: 2}))
            .not.toThrow()
        expect(() => checker({b: 'a', b: 2}))
            .toThrow()
    })
})