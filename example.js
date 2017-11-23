const check = require('./index')

const Vector = check([Number])

class Player {
    constructor(position, size){
        check([Vector, Vector])(arguments)
        this.position = position
        this.size = size
    }
}

new Player([1,2], ['3',4])

// check(Player)({position: [1,2,'a']})