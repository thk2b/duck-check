const get_type = require('../get_type')

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
