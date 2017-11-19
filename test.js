const make_checker = require('./duck_check')

describe('creating a check function', () => {
    it('should return a function', () => {
        expect(make_checker({}))
            .toBeInstanceOf(Function)
    })
})

describe('checking objects', () => {
    const check = make_checker({
        a: 'number', 
        b: 'string', 
        c: {
            d: 'number'
        }
    })
    const correct = {
        a: 1, b: 'b', c: { d: 1}
    }
    const incorrect_prop_type = {
        a: 'a', b: 'b', c: { d: 1}
    }
    const incorrect_prop = {
        a2: 'a', b: 'b', c: { d: 1}
    }
    const nan_prop = {
        a: NaN, b: 'b', c: { d: 1}
    }
    const correct_additional_prop = {
        a: 1, b: 'b', c: { d: 1}, f: 'f'
    }

    it('should return the object when a correct object is given', () => {
        expect(
            check(correct)
        ).toBe(correct)
        
        // expected usage
        const { a, b, c } = check(correct)
        expect(a).toEqual(correct.a)
    })
    it('should do nothing when a correct object is given', () => {
        expect(() => {
            check(correct)
        }).not.toThrow()
    })
    it('should throw an error when a property has the wrong type', () => {
        expect(() => {
            check(incorrect_prop_type)
        }).toThrow()
    })
    it('should throw when a prop that is not in the schema is found', () => {
        expect(() => {
            check(incorrect_prop)
        }).toThrow()
    })
    it('should do nothing when the given object has props that are not in the schema', () => {
        expect(() => {
            check(correct_additional_prop)
        }).not.toThrow()
    })
    it('should handle NaN values when expecting numbers', ()=>{
        expect(() => {
            check(nan_prop)
        }).toThrow()
    })
})

