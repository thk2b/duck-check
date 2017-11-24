const { either } = require('../modifiers')
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
            b: either([Date], [Number])
        })
        expect(() => checker({
            a: null,
            b: [new Date(), new Date()]
        })).not.toThrow()
        expect(() => checker({
            a: 'null',
            b: [1,2,3]
        })).not.toThrow()
        expect(() => checker({
            a: null,
            b: [1, new Date()]
        })).toThrow()
    })
})