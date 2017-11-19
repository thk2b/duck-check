##duck-check

duck-check is a minimalist runtime duck type checking utility.

Sample usage:
    
    const make_checker = require('duck-check')

    const check_vector = make_checker({
        x: 'number', /* we expect keys x, y */
        y: 'number'  /* to have a type of 'number' */
    })

    const vector1 = { x: 1,  y: 2  }
    const vector2 = { x: 23, y: 12 }
    const circle = {x: 1, y: 111, radius: 123} /* is a vector with a radius */
    const fake_vector = {x: '1', y: null}


    const add_vectors = (v1, v2) => {
        const {x1, y1} = check_vector(v1)
        const {x2, y2} = check_vector(v2)
        
        return ({
            x: x1 + x2,
            y: y1 + y2
        })
    }

    add_vectors(vector1, vector2)     /* {x: 24, y: 14} */
    add_vectors(vector1, fake_vector) /* TypeError */
    add_vectors(vector1, circle)      /* {x: 2, y: 113} */


The make_checker function takes an object called a schema. 
The schema represents the blueprint against which to check any object. 
A schema is a set of key:value pairs.

`make_checker(schema)` returns a check function. To test any object, call `check` with an object to be checked

For the test to pass:
- The object must have all keys declared in the schema. 
- The type of each property on the object, obtained through `typeof`, must equal (`===`) the string provided as a value in the schema. 

Caveats:

Because of limitations of `typeof`, it is not currently possible to check for a `null` property on an object, as `typeof null` is `'object'`