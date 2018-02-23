(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("duck-check", [], factory);
	else if(typeof exports === 'object')
		exports["duck-check"] = factory();
	else
		root["duck-check"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(2),
    _check = _require._check;

/**
 * Public function. Checks if the duck matches the schema 
 * @param {*} schema - Schema declaration 
 * @returns {Function} - check function
 */


function check(schema) {
    /**
     * Check function
     * @param {*} duck – Any object to be checked against the schema
     * @param {Boolean} _throw_raw_error - Hack to allow a clean error message to be produced when using a check function in a schema
     * @return {undefined} - Returns undefined or throws a TypeError.
     */
    return function (duck) {
        if (_check(schema, duck)) {
            return;
        } else {
            throw new TypeError('Type check failed');
        }
    };
}

/**
 * Public function. 
 * @param {*} schema - Schema declaration 
 * @returns {Function} - check function
 */
function assert(schema) {
    /**
     * @param {*} duck – Any object to be checked against the schema
     * @return {Boolean} - Returns false if in assert mode and the test fails.
     */
    return function (duck) {
        return _check(schema, duck);
    };
}

module.exports = {
    assert: assert,
    check: check
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    check = _require.check,
    assert = _require.assert;

var modifiers = __webpack_require__(4);
var either = modifiers.either,
    not = modifiers.not,
    any = modifiers.any,
    one_of = modifiers.one_of;


module.exports = {
    check: check,
    assert: assert,
    modifiers: modifiers,
    is: assert,
    either: either,
    not: not,
    any: any,
    one_of: one_of,
    oneOf: one_of
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var get_type = __webpack_require__(3);

/**
 * Private function. 
 * Examines the schema and runs the appropriate checks
 * @param {*} schema 
 * @param {*} duck
 * @returns {Boolean} – True if duck matches schema
 */
function _check(schema, duck) {
    var schema_type = get_type(schema);
    var duck_type = get_type(duck);

    switch (schema_type) {
        case 'array':
            return duck_type === 'array' ? _check_array(schema, duck) : false;
        case 'object':
            return duck_type === 'object' ? _check_object(schema, duck) : false;
        case 'anonymous_function':
            return _check_function(schema, duck);
        case 'function':
            if (schema.name === 'Function') {
                return duck_type === 'function' || duck_type === 'anonymous_function';
            }
            return schema.name.toLowerCase() === duck_type ? true : duck_type === 'object' ? duck instanceof schema : _check_function(schema, duck);
        default:
            return schema_type === duck_type;
    }
}

function _check_object(schema, obj) {
    for (var key in schema) {
        if (!_check(schema[key], obj[key])) return false;
    }
    return true;
}

function _check_array(schema, arr) {
    if (schema.length === 1) {
        /* array of unique type */
        return arr.length && arr.findIndex(function (el, i) {
            return !_check(schema[0], el);
        }) === -1 ? true : false;
    } else if (schema.length > 1) {
        /* positional array */
        return arr.length === schema.length && arr.findIndex(function (el, i) {
            return !_check(schema[i], el);
        }) === -1 ? true : false;
    }
}

function _check_function(fn, duck) {
    if (fn.name === 'Boolean') return false; /* hack */
    try {
        return fn(duck) === true;
    } catch (e) {
        return false;
    }
}

module.exports = {
    _check: _check
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var types = [/* order is crutial: ie. must check null before object */
'array', 'null', 'object', 'number', 'string', 'boolean', 'function', 'anonymous_function', 'undefined', 'NaN'];

var is = {
    array: function array(duck) {
        return Array.isArray(duck);
    },
    null: function _null(duck) {
        return duck === null;
    },
    object: function object(duck) {
        return (typeof duck === 'undefined' ? 'undefined' : _typeof(duck)) === 'object';
    }, // warning: will return true for null
    number: function number(duck) {
        return typeof duck === 'number' && !isNaN(duck);
    },
    string: function string(duck) {
        return typeof duck === 'string';
    },
    boolean: function boolean(duck) {
        return typeof duck === 'boolean';
    },
    function: function _function(duck) {
        return !!(typeof duck === 'function' && duck.name);
    },
    anonymous_function: function anonymous_function(duck) {
        return typeof duck === 'function' && !duck.name;
    },
    undefined: function undefined(duck) {
        return typeof duck === 'undefined';
    },
    NaN: function NaN(duck) {
        return isNaN(duck);
    }
};

function get_type(duck) {
    var type = types.find(function (type) {
        return is[type](duck);
    });
    if (!type) throw new Error('Cannot find type of \'' + duck + '\'');
    return type;
}

module.exports = get_type;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    assert = _require.assert;

/**
 * Inverts the result of a check.
 * @param {*} Schema - Any valid schema. 
 * @returns {Boolean} – False if duck matches schema.
 */


var not = function not(schema) {
    return function (duck) {
        return !assert(schema)(duck);
    };
};

/**
 * @param {...*} – Any number of valid schemas
 * @returns {Boolean} – True if duck matches one of the schemas
 */
function one_of() {
    var _arguments = arguments;

    return function (duck) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _arguments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var arg = _step.value;

                if (assert(arg)(duck)) return true;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return false;
    };
}

/**
 * @param {*} a - First option. Any valid schema
 * @param {*} b - Second option. Any valid schema
 * @returns {Boolean} - False if the duck matches neither schemas.
 */
var either = function either(a, b) {
    return one_of(a, b);
};

/**
 * Wildcard: makes any type pass the test. To be used in an array or object schema
 * @returns {Boolean} - Always returns true. 
 */
var any = function any(d) {
    return d !== undefined;
};

module.exports = {
    either: either,
    not: not,
    any: any,
    one_of: one_of, oneOf: one_of
};

/***/ })
/******/ ]);
});