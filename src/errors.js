class InvalidType extends Error {
    /**
     * 
     * @param {String} expected - Expected type
     * @param {String} actual - Actual type
     */
    constructor(expected, actual){
        const message = (
            `Expected ${expected}. Was ${actual}`
        )
        super()
    }
}