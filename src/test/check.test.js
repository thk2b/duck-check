const { check } = require('../index')

describe('public check', () => {
    it('should return a function', () => {
        expect(
            typeof check(Number)
        ).toEqual('function')
    })
    it('should return undefined if duck is valid', () => {
        expect(
            check({a: String, ns: [Number]})({a: 'a', ns: [1,2,3]})
        ).toBe(undefined)
    })

    it('should throw if duck is invalid', () => {
        expect(
            () => check({a: String, ns: [Number]})({a: 'a', ns: [1,NaN,3]})
        ).toThrow()
    })
})
