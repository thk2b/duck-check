const {
    get_type,
    is,
} = require('../get_type')

describe('is type', () => {
    it('should find array', () => {
        const thing = ['hello']
        expect(is['array'](thing)).toBe(true)
    })
    it('should find object', () => {
        const thing = {a: 'hello'}
        expect(is['object'](thing)).toBe(true)
    })
    it('should find number', () => {
        const thing = 1
        expect(is['number'](thing)).toBe(true) 
    })
    it('should find string', () => {
        const thing = 'hello'
        expect(is['string'](thing)).toBe(true)
    })
    it('should find boolean', () => {
        const thing = true
        expect(is['boolean'](thing)).toBe(true) 
    })
    it('should find function', () => {
        function thing(a){ console.log(a) }
        expect(is['function'](thing)).toBe(true)
    })
    it('should find anonymous funciton', () => {
        expect(is['anonymous_function'](a => { console.log(a)})).toBe(true)
    })
    it('should find undefined', () => {
        const thing = undefined
        expect(is['undefined'](thing)).toBe(true)
    })
    it('should find null', () => {
        const thing = null
        expect(is['null'](thing)).toBe(true)
    })
    it('should find NaN', () => {
        const thing = NaN
        expect(is['NaN'](thing)).toBe(true)
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
    it('should find number', () => {
        const thing = 1
        expect(get_type(thing)).toBe('number')
    })
    it('should find string', () => {
        const thing = 'hello'
        expect(get_type(thing)).toBe('string')
    })
    it('should find boolean', () => {
        const thing = true
        expect(get_type(thing)).toBe('boolean') 
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
