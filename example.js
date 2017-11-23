const check = require('duck-check')

check({ x: Number, y: Number })({ x: 10, y: 15 })
check({ x: Number, y: Number })({ x: 10, y: 'hello' }) 
/* 
TypeError:
 - Invalid properties in object {"x":10,"y":"hello"}:
     - Expected number: Got string 'hello'
*/

const validate_point = check({ x: Number, y: Number })

validate_point({ x: 10, oups: 15 }) 
/*
TypeError:
 - Invalid properties in object {"x":10,"oups":15}:
     - Expected key 'y': Was undefined
*/

validate_point({
    x: 10, 
    y: 15, 
    some_other_key: 'some_other value'
})

check([ Number ])([1,2,3])
check([[Number]])([[1,'2','a'],[1,2,'a']]) 
/*
TypeError:
 - 2 invalid elements in array [[1,"2","a"],[1,2,"a"]]:
     - 2 invalid elements in array [1,"2","a"]:
         - Expected number: Got string '2'
         - Expected number: Got string 'a'
     - Invalid element in array [1,2,"a"]:
         - Expected number: Got string 'a'
*/

check([ Number ])(1) 
/*
TypeError:
 - Expected array: Got number '1'
*/

check([ Number, String ])([1, '1'])
check([ Number, String ])([1, 456, '1']) 
/*
TypeError:
 - Expected positional array of length '2': Was '3'
*/

check([[ Number, [ String ]]])([ /* array of (number and array of string) */
    [ 1, [ 'a', 'b' ]], [ 2, [ 'c','d' ]]
])
check([[ Number, [ String ]]])([
    [ 1, [ 'a', 'b' ]], [ 2, [ null,'d' ]]
]) 
/*
TypeError:
 - Invalid element in array [[1,["a","b"]],[2,[1,"d"]]]:
     - Invalid element in array [2,[1,"d"]]:
         - Invalid element in array [1,"d"]:
             - Expected string: Got number '1'
*/

check([ validate_point ])([{ x: 1, y: 1 }, { x: 10, y: 10 }])
check([ validate_point ])([{ x: 10, xyz: 10 },{ x: 'a', y: 1 } ]) 
/*
TypeError:
 - Invalid element in array [{"x":1,"y":1},{"x":10,"xyz":10}]:
     -
     - Invalid property in object {"x":10,"xyz":10}:
     - Expected key 'y': Was undefined
*/

const validate = check({ name: String, data: { x: Number, y: Number }})

const data = [
    { name: 'A', data: { x: 1, y: 2 } },
    { name: 'B', data: { x: NaN, y: 2 } },
    { full_name: 'C', data: { x: 1, y: 2 } }
] 

data.forEach( el => validate(el) ) 
/*
TypeError:
 - Invalid property in object {"name":"B","data":{"x":null,"y":2}}:
     - Invalid property in object {"x":null,"y":2}:
         - Expected number: Got NaN
*/