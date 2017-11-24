const { either, not, non_empty, any } = require('../modifiers')
const { check, assert } = require('../index')

describe('modifier either', ()=>{
    it('should work with simple assertions', () => {
        expect(() => check(either(Number, String)(1)))
            .not.toThrow()
        expect(() => check(either(Number, String)('a')))
            .not.toThrow()
        expect(() => check(either(Number, String)(NaN)))
            .toThrow()
        expect(() => check(either(null, String)(null)))
            .not.toThrow()
        expect(assert(either(Number, String))(NaN))
            .toBe(false)
    })
    it('should work in nested schemas', () => {
        expect(() => check([either(Number, String)])([1, 'a']))
            .not.toThrow()
        
        const checker = check({
            a: either(null, String), 
            b: either([String], [Number])
        })
        expect(() => checker({
            a: null,
            b: ['a', 'a']
        })).not.toThrow()
        expect(() => checker({
            a: 'null',
            b: [1,2,3]
        })).not.toThrow()
        expect(() => checker({
            a: null,
            b: [1, 'a']
        })).toThrow()
    })
})

describe('modifier not', ()=>{
    it('should work with simple assertions', () => {
        expect(() => check(not(Number)(1)))
            .toThrow()
        expect(() => check(not(Number)('a')))
            .not.toThrow()
        expect(() => check(not(Number)(NaN)))
            .not.toThrow()
        expect(() => check(not(null)(null)))
            .toThrow()
        expect(assert(not(Number))(NaN))
            .toBe(true)
    })
    it('should work in nested schemas', () => {
        expect(() => check([not(Number)])([null, NaN]))
            .not.toThrow()
        expect(() => check([not(Number)])([1, 'a']))
            .toThrow()
        
        const checker = assert({
            a: not(null), 
            b: not([String])
        })

        expect(checker({a: 1, b: 's'})).toBe(true)
        expect(checker({a: 1, b: ['s']})).toBe(false)
        expect(checker({a: null, b: 's'})).toBe(false)

        expect(assert(not(not(Number)))(1)).toBe(true)
    })
})

describe('modifier non_empty', () => {
    it('should throw on empty arrays', () => {
        expect(assert(non_empty([Number]))([1])).toBe(true)
        expect(assert(non_empty([Number]))([ ])).toBe(false)
    })
    it('should ignore non-arrays', () => {
        expect(assert(non_empty(Number))(1)).toBe(true)
    })
})

describe('modifier any', () => {
    it('should work', () => {
        expect(assert(any())(Number)).toBe(true)
        expect(assert(not(any()))(Number)).toBe(false)
        expect(() => check({a: any()})({a: null}))
            .not.toThrow()
        expect(() => check({a: any()})({b: null}))
            .toThrow()
    })
})