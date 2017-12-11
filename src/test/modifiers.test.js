const { assert, modifiers } = require('../index')
const { either, not, any, one_of } = modifiers

describe('modifier either', () => {
    it('should return true if duck is either schemas', () => {
        const run = either({a: Number}, [String, Date])
        expect(
            run({a: 1}) && run(['a', new Date()])
        ).toBe(true)
    })
    it('should return false if duck is neither schemas', () => {
        const run = either({a: Number}, [String, Date])
        expect(
            run({b: 1}) && run(['a', 1])
        ).toBe(false)
    })
})

describe('modifier not', () => {
    it('should return false if duck matches schemas', () => {
        expect(
            not({a: Number})({a: 1})
        ).toBe(false)
    })
    it('should return true if duck does not match schema', () => {
        expect(
            not({a: Number})({b: 1})
        ).toBe(true)
    })
})

describe('modifier any', () => {
    it('should always return true', () => {
        expect(
            assert({a: any})({a: 'a'})
        ).toBe(true)
        /* ... */
    })
})

describe('modifier one_of', () => {
    it('should return false if duck matches none of the arguments', () => {
        expect(
            one_of({a: Number}, [Number], [Number, Date])(0)
        ).toBe(false)
    })
    it('should return true if duck matches one of the arguments', () => {
        expect(
            one_of({a: Number}, [Number], [Number, Date])({a: 1}) &&
            one_of({a: Number}, [Number], [Number, Date])([1,2,3]) &&
            one_of({a: Number}, [Number], [Number, Date])([1, new Date()])
        ).toBe(true)
    })
})