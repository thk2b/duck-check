const { assert, is } = require('../index')

describe('public assert', () => {
    it('should return a function', () => {
        expect(
            typeof assert(Number)
        ).toEqual('function')
    })
    it('should return undefined if duck is valid', () => {
        expect(
            assert({a: String, ns: [Number]})({a: 'a', ns: [1,2,3]})
        ).toBe(true)
    })

    it('should throw if duck is invalid', () => {
        expect(
            assert({a: String, ns: [Number]})({a: 'a', ns: [1,NaN,3]})
        ).toBe(false)
    })
})

describe('assert aliases', () => {
    it('assert should be identical to the "is" function', () => {
        expect(is).toBe(assert)
    })
})