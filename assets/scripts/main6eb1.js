(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.basicLightbox=e()}}(function(){return function e(t,n,o){function r(f,c){if(!n[f]){if(!t[f]){var a="function"==typeof require&&require;if(!c&&a)return a(f,!0);if(i)return i(f,!0);var l=new Error("Cannot find module '"+f+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[f]={exports:{}};t[f][0].call(u.exports,function(e){var n=t[f][1][e];return r(n||e)},u,u.exports,e,t,n,o)}return n[f].exports}for(var i="function"==typeof require&&require,f=0;f<o.length;f++)r(o[f]);return r}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=function(e){"function"==typeof e.stopPropagation&&e.stopPropagation(),"function"==typeof e.preventDefault&&e.preventDefault()},r=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return e=Object.assign({},e),!1!==e.closable&&(e.closable=!0),"function"==typeof e.className&&(e.className=e.className()),"string"!=typeof e.className&&(e.className=null),"function"!=typeof e.beforeShow&&(e.beforeShow=function(){}),"function"!=typeof e.afterShow&&(e.afterShow=function(){}),"function"!=typeof e.beforeClose&&(e.beforeClose=function(){}),"function"!=typeof e.afterClose&&(e.afterClose=function(){}),"function"==typeof e.beforePlaceholder&&(e.beforePlaceholder=e.beforePlaceholder()),"string"!=typeof e.beforePlaceholder&&(e.beforePlaceholder=""),"function"==typeof e.afterPlaceholder&&(e.afterPlaceholder=e.afterPlaceholder()),"string"!=typeof e.afterPlaceholder&&(e.afterPlaceholder=""),e},i=function(e){var t=e.children;return 1===t.length&&"IMG"===t[0].tagName},f=n.visible=function(e){return null!=(e=e||document.querySelector(".basicLightbox"))&&!0===e.ownerDocument.body.contains(e)},c=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments[1],n=document.createElement("div");return n.classList.add("basicLightbox"),null!=t.className&&n.classList.add(t.className),n.innerHTML="\n\t\t"+t.beforePlaceholder+'\n\t\t<div class="basicLightbox__placeholder" role="dialog">\n\t\t\t'+e+"\n\t\t</div>\n\t\t"+t.afterPlaceholder+"\n\t",!0===i(n.querySelector(".basicLightbox__placeholder"))&&n.classList.add("basicLightbox--img"),n},a=function(e,t){return document.body.appendChild(e),setTimeout(function(){requestAnimationFrame(function(){return e.classList.add("basicLightbox--visible"),t()})},10),!0},l=function(e,t){return e.classList.remove("basicLightbox--visible"),setTimeout(function(){requestAnimationFrame(function(){return!1===f(e)?t():(e.parentElement.removeChild(e),t())})},410),!0};n.create=function(e,t){t=r(t);var n=c(e,t),i=function(){return n},u=function(){return f(n)},s=function(e){return!1!==t.beforeShow(b)&&a(n,function(){if(t.afterShow(b),"function"==typeof e)return e(b)})},d=function(e){return!1!==t.beforeClose(b)&&l(n,function(){if(t.afterClose(b),"function"==typeof e)return e(b)})};!0===t.closable&&(n.onclick=function(e){e.target===this&&(d(),o(e))});var b={element:i,visible:u,show:s,close:d};return b}},{}]},{},[1])(1)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
/**
 * @module  color-alpha
 */
const parse = require('color-parse');

module.exports = alpha;

function alpha (color, value) {
	let obj = parse(color);

	if (value == null) value = obj.alpha;

	//catch percent
	if (obj.space[0] === 'h') {
		return obj.space + `a(${obj.values[0]},${obj.values[1]}%,${obj.values[2]}%,${value})`;
	}

	return obj.space + `a(${obj.values},${value})`;
}
},{"color-parse":5}],3:[function(require,module,exports){
/**
 * @module  color-interpolate
 * Pick color from palette by index
 */

const parse = require('color-parse');
const hsl = require('color-space/hsl');
const lerp = require('lerp');
const clamp = require('mumath/clamp');

module.exports = interpolate;

function interpolate (palette) {
	palette = palette.map(c => {
		c = parse(c);
		if (c.space != 'rgb') {
			if (c.space != 'hsl') throw `${c.space} space is not supported.`;
			c.values = hsl.rgb(c.values);
		}
		c.values.push(c.alpha);
		return c.values;
	});

	return (t, mix = lerp) => {
		t = clamp(t, 0, 1);

		let idx = ( palette.length - 1 ) * t,
			lIdx = Math.floor( idx ),
			rIdx = Math.ceil( idx );

		t = idx - lIdx;

		let lColor = palette[lIdx], rColor = palette[rIdx];

		let result = lColor.map((v, i) => {
			v = mix(v, rColor[i], t);
			if (i < 3) v = Math.round(v);
			return v;
		});

		if (result[3] === 1) {
			return `rgb(${result.slice(0,3)})`;
		}
		return `rgba(${result})`;
	};
}

},{"color-parse":5,"color-space/hsl":6,"lerp":12,"mumath/clamp":13}],4:[function(require,module,exports){
'use strict'

module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

},{}],5:[function(require,module,exports){
(function (global){
/**
 * @module color-parse
 */

'use strict'

var names = require('color-name')
var isObject = require('is-plain-obj')
var defined = require('defined')

module.exports = parse

/**
 * Base hues
 * http://dev.w3.org/csswg/css-color/#typedef-named-hue
 */
//FIXME: use external hue detector
var baseHues = {
	red: 0,
	orange: 60,
	yellow: 120,
	green: 180,
	blue: 240,
	purple: 300
}

/**
 * Parse color from the string passed
 *
 * @return {Object} A space indicator `space`, an array `values` and `alpha`
 */
function parse (cstr) {
	var m, parts = [], alpha = 1, space

	if (typeof cstr === 'string') {
		//keyword
		if (names[cstr]) {
			parts = names[cstr].slice()
			space = 'rgb'
		}

		//reserved words
		else if (cstr === 'transparent') {
			alpha = 0
			space = 'rgb'
			parts = [0,0,0]
		}

		//hex
		else if (/^#[A-Fa-f0-9]+$/.test(cstr)) {
			var base = cstr.slice(1)
			var size = base.length
			var isShort = size <= 4
			alpha = 1

			if (isShort) {
				parts = [
					parseInt(base[0] + base[0], 16),
					parseInt(base[1] + base[1], 16),
					parseInt(base[2] + base[2], 16)
				]
				if (size === 4) {
					alpha = parseInt(base[3] + base[3], 16) / 255
				}
			}
			else {
				parts = [
					parseInt(base[0] + base[1], 16),
					parseInt(base[2] + base[3], 16),
					parseInt(base[4] + base[5], 16)
				]
				if (size === 8) {
					alpha = parseInt(base[6] + base[7], 16) / 255
				}
			}

			if (!parts[0]) parts[0] = 0
			if (!parts[1]) parts[1] = 0
			if (!parts[2]) parts[2] = 0

			space = 'rgb'
		}

		//color space
		else if (m = /^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(cstr)) {
			var name = m[1]
			var base = name.replace(/a$/, '')
			space = base
			var size = base === 'cmyk' ? 4 : base === 'gray' ? 1 : 3
			parts = m[2].trim()
				.split(/\s*,\s*/)
				.map(function (x, i) {
					//<percentage>
					if (/%$/.test(x)) {
						//alpha
						if (i === size)	return parseFloat(x) / 100
						//rgb
						if (base === 'rgb') return parseFloat(x) * 255 / 100
						return parseFloat(x)
					}
					//hue
					else if (base[i] === 'h') {
						//<deg>
						if (/deg$/.test(x)) {
							return parseFloat(x)
						}
						//<base-hue>
						else if (baseHues[x] !== undefined) {
							return baseHues[x]
						}
					}
					return parseFloat(x)
				})

			if (name === base) parts.push(1)
			alpha = parts[size] === undefined ? 1 : parts[size]
			parts = parts.slice(0, size)
		}

		//named channels case
		else if (cstr.length > 10 && /[0-9](?:\s|\/)/.test(cstr)) {
			parts = cstr.match(/([0-9]+)/g).map(function (value) {
				return parseFloat(value)
			})

			space = cstr.match(/([a-z])/ig).join('').toLowerCase()
		}
	}

	//numeric case
	else if (typeof cstr === 'number') {
		space = 'rgb'
		parts = [cstr >>> 16, (cstr & 0x00ff00) >>> 8, cstr & 0x0000ff]
	}

	//object case - detects css cases of rgb and hsl
	else if (isObject(cstr)) {
		var r = defined(cstr.r, cstr.red, cstr.R, null)

		if (r !== null) {
			space = 'rgb'
			parts = [
				r,
				defined(cstr.g, cstr.green, cstr.G),
				defined(cstr.b, cstr.blue, cstr.B)
			]
		}
		else {
			space = 'hsl'
			parts = [
				defined(cstr.h, cstr.hue, cstr.H),
				defined(cstr.s, cstr.saturation, cstr.S),
				defined(cstr.l, cstr.lightness, cstr.L, cstr.b, cstr.brightness)
			]
		}

		alpha = defined(cstr.a, cstr.alpha, cstr.opacity, 1)

		if (cstr.opacity != null) alpha /= 100
	}

	//array
	else if (Array.isArray(cstr) || global.ArrayBuffer && ArrayBuffer.isView && ArrayBuffer.isView(cstr)) {
		parts = [cstr[0], cstr[1], cstr[2]]
		space = 'rgb'
		alpha = cstr.length === 4 ? cstr[3] : 1
	}

	return {
		space: space,
		values: parts,
		alpha: alpha
	}
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"color-name":4,"defined":9,"is-plain-obj":10}],6:[function(require,module,exports){
/**
 * @module color-space/hsl
 */
'use strict'

var rgb = require('./rgb');

module.exports = {
	name: 'hsl',
	min: [0,0,0],
	max: [360,100,100],
	channel: ['hue', 'saturation', 'lightness'],
	alias: ['HSL'],

	rgb: function(hsl) {
		var h = hsl[0] / 360,
				s = hsl[1] / 100,
				l = hsl[2] / 100,
				t1, t2, t3, rgb, val;

		if (s === 0) {
			val = l * 255;
			return [val, val, val];
		}

		if (l < 0.5) {
			t2 = l * (1 + s);
		}
		else {
			t2 = l + s - l * s;
		}
		t1 = 2 * l - t2;

		rgb = [0, 0, 0];
		for (var i = 0; i < 3; i++) {
			t3 = h + 1 / 3 * - (i - 1);
			if (t3 < 0) {
				t3++;
			}
			else if (t3 > 1) {
				t3--;
			}

			if (6 * t3 < 1) {
				val = t1 + (t2 - t1) * 6 * t3;
			}
			else if (2 * t3 < 1) {
				val = t2;
			}
			else if (3 * t3 < 2) {
				val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
			}
			else {
				val = t1;
			}

			rgb[i] = val * 255;
		}

		return rgb;
	}
};


//extend rgb
rgb.hsl = function(rgb) {
	var r = rgb[0]/255,
			g = rgb[1]/255,
			b = rgb[2]/255,
			min = Math.min(r, g, b),
			max = Math.max(r, g, b),
			delta = max - min,
			h, s, l;

	if (max === min) {
		h = 0;
	}
	else if (r === max) {
		h = (g - b) / delta;
	}
	else if (g === max) {
		h = 2 + (b - r) / delta;
	}
	else if (b === max) {
		h = 4 + (r - g)/ delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	}
	else if (l <= 0.5) {
		s = delta / (max + min);
	}
	else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

},{"./rgb":7}],7:[function(require,module,exports){
/**
 * RGB space.
 *
 * @module  color-space/rgb
 */
'use strict'

module.exports = {
	name: 'rgb',
	min: [0,0,0],
	max: [255,255,255],
	channel: ['red', 'green', 'blue'],
	alias: ['RGB']
};

},{}],8:[function(require,module,exports){
'use strict'

/**
 * Count up and down between two numbers.
 * @param {Number} min - Minimum number.
 * @param {Number} max - Maximum number.
 * @param {Number} initial - Initial number.
 * @returns {Function} instance - Count-between instance. Expects the following properties: modifier.
 */
module.exports = function(min, max, initial) {

	const length = max - min + 1

	let index = initial - min

	return (modifier = 0) => {

		index = (index + modifier) % length

		if (index>=0) index = 0 + index
		if (index<0)  index = length + index

		return min + index

	}

}
},{}],9:[function(require,module,exports){
module.exports = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};

},{}],10:[function(require,module,exports){
'use strict';
var toString = Object.prototype.toString;

module.exports = function (x) {
	var prototype;
	return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};

},{}],11:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Jump = factory());
}(this, (function () { 'use strict';

// Robert Penner's easeInOutQuad

// find the rest of his easing functions here: http://robertpenner.com/easing/
// find them exported for ES6 consumption here: https://github.com/jaxgeller/ez.js

var easeInOutQuad = function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var jumper = function jumper() {
  // private variable cache
  // no variables are created during a jump, preventing memory leaks

  var element = void 0; // element to scroll to                   (node)

  var start = void 0; // where scroll starts                    (px)
  var stop = void 0; // where scroll stops                     (px)

  var offset = void 0; // adjustment from the stop position      (px)
  var easing = void 0; // easing function                        (function)
  var a11y = void 0; // accessibility support flag             (boolean)

  var distance = void 0; // distance of scroll                     (px)
  var duration = void 0; // scroll duration                        (ms)

  var timeStart = void 0; // time scroll started                    (ms)
  var timeElapsed = void 0; // time spent scrolling thus far          (ms)

  var next = void 0; // next scroll position                   (px)

  var callback = void 0; // to call when done scrolling            (function)

  // scroll position helper

  function location() {
    return window.scrollY || window.pageYOffset;
  }

  // element offset helper

  function top(element) {
    return element.getBoundingClientRect().top + start;
  }

  // rAF loop helper

  function loop(timeCurrent) {
    // store time scroll started, if not started already
    if (!timeStart) {
      timeStart = timeCurrent;
    }

    // determine time spent scrolling so far
    timeElapsed = timeCurrent - timeStart;

    // calculate next scroll position
    next = easing(timeElapsed, start, distance, duration);

    // scroll to it
    window.scrollTo(0, next);

    // check progress
    timeElapsed < duration ? window.requestAnimationFrame(loop) // continue scroll loop
    : done(); // scrolling is done
  }

  // scroll finished helper

  function done() {
    // account for rAF time rounding inaccuracies
    window.scrollTo(0, start + distance);

    // if scrolling to an element, and accessibility is enabled
    if (element && a11y) {
      // add tabindex indicating programmatic focus
      element.setAttribute('tabindex', '-1');

      // focus the element
      element.focus();
    }

    // if it exists, fire the callback
    if (typeof callback === 'function') {
      callback();
    }

    // reset time for next jump
    timeStart = false;
  }

  // API

  function jump(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // resolve options, or use defaults
    duration = options.duration || 1000;
    offset = options.offset || 0;
    callback = options.callback; // "undefined" is a suitable default, and won't be called
    easing = options.easing || easeInOutQuad;
    a11y = options.a11y || false;

    // cache starting position
    start = location();

    // resolve target
    switch (typeof target === 'undefined' ? 'undefined' : _typeof(target)) {
      // scroll from current position
      case 'number':
        element = undefined; // no element to scroll to
        a11y = false; // make sure accessibility is off
        stop = start + target;
        break;

      // scroll to element (node)
      // bounding rect is relative to the viewport
      case 'object':
        element = target;
        stop = top(element);
        break;

      // scroll to element (selector)
      // bounding rect is relative to the viewport
      case 'string':
        element = document.querySelector(target);
        stop = top(element);
        break;
    }

    // resolve scroll distance, accounting for offset
    distance = stop - start + offset;

    // resolve duration
    switch (_typeof(options.duration)) {
      // number in ms
      case 'number':
        duration = options.duration;
        break;

      // function passed the distance of the scroll
      case 'function':
        duration = options.duration(distance);
        break;
    }

    // start the loop
    window.requestAnimationFrame(loop);
  }

  // expose only the jump method
  return jump;
};

// export singleton

var singleton = jumper();

return singleton;

})));

},{}],12:[function(require,module,exports){
function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}
module.exports = lerp
},{}],13:[function(require,module,exports){
/**
 * Clamp value.
 * Detects proper clamp min/max.
 *
 * @param {number} a Current value to cut off
 * @param {number} min One side limit
 * @param {number} max Other side limit
 *
 * @return {number} Clamped value
 */
'use strict';
module.exports = function(a, min, max){
	return max > min ? Math.max(Math.min(a,max),min) : Math.max(Math.min(a,min),max);
};

},{}],14:[function(require,module,exports){
'use strict';

var _helpers = require('./_helpers');

var _color = require('./_color');

var run = (0, _helpers.single)(_color.steps);
var points = (0, _helpers.fifo)(_color.steps);

var header = document.querySelector('.header');
var canvas = document.querySelector('.canvas');
var context = canvas == null ? null : canvas.getContext('2d');

var fixed = void 0;
var width = void 0;
var height = void 0;
var ratio = void 0;

var _x = void 0;
var _y = void 0;

var init = function init() {

	// Same as max-height in header and content CSS
	var minHeight = 750;

	var doc = document.documentElement;
	var header = document.querySelector('.header');

	var docSize = doc.getBoundingClientRect();
	var headerSize = header.getBoundingClientRect();

	fixed = docSize.height < minHeight ? false : true;
	width = headerSize.width;
	height = headerSize.height;
	ratio = window.devicePixelRatio;

	canvas.style.width = width + 'px';
	canvas.style.height = height + 'px';

	canvas.width = width * ratio;
	canvas.height = height * ratio;
};

var update = function update(e) {

	// Position calculation is different when hero is fixed
	var _ref = fixed === true ? (0, _helpers.positionFixed)(e) : (0, _helpers.positionRelative)(e),
	    x = _ref.x,
	    y = _ref.y;

	context.clearRect(0, 0, width * ratio, height * ratio);

	points({

		from: { x: _x, y: _y },
		to: { x: x, y: y }

	}).forEach(function (point, i) {

		var color = _color.gradient[i];

		context.beginPath();
		context.moveTo(point.from.x * ratio, point.from.y * ratio);
		context.lineTo(point.to.x * ratio, point.to.y * ratio);
		context.strokeStyle = color;
		context.lineWidth = 5 * ratio;
		context.stroke();
	});

	_x = x;
	_y = y;
};

// Safari calculates a wrong height for the header
// when calculating the height without a delay.
setTimeout(function () {

	if (canvas == null) return;

	init();

	window.addEventListener('resize', init);
	header.addEventListener('mousemove', function (e) {
		return run(function () {
			return update(e);
		});
	});
}, 500);

},{"./_color":15,"./_helpers":17}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.gradient = exports.steps = undefined;

var _countBetween = require('count-between');

var _countBetween2 = _interopRequireDefault(_countBetween);

var _helpers = require('./_helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var h = [160, 280, 310, 340];

var elem = document.documentElement;
var index = (0, _countBetween2.default)(0, h.length - 1, 0);

var start = void 0;
var end = void 0;

var steps = exports.steps = 25;
var gradient = exports.gradient = void 0;

var update = function update() {

	var i = index();

	start = (0, _helpers.hsl)(h[i], 55, 45);
	end = (0, _helpers.hsl)(h[i] - 60, 45, 55);

	exports.gradient = gradient = (0, _helpers.alphaGradient)([start, end], steps);

	elem.style.setProperty('--start', start);
	elem.style.setProperty('--end', end);

	index(1);
};

elem.addEventListener('click', function (e) {

	var clickable = ['canvas', 'header__inner'];
	var isClickable = (0, _helpers.hasClassNames)(e.target, clickable);

	if (isClickable === false) return;

	update();
});

update();

},{"./_helpers":17,"count-between":8}],16:[function(require,module,exports){
"use strict";

if (NodeList.prototype.forEach == null) NodeList.prototype.forEach = Array.prototype.forEach;

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.image = exports.single = exports.positionRelative = exports.positionFixed = exports.fifo = exports.alphaGradient = exports.hsl = exports.hasClassNames = exports.createArray = exports.esc = undefined;

var _colorInterpolate = require('color-interpolate');

var _colorInterpolate2 = _interopRequireDefault(_colorInterpolate);

var _colorAlpha = require('color-alpha');

var _colorAlpha2 = _interopRequireDefault(_colorAlpha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var esc = exports.esc = function esc(key) {
	return key === 27;
};

var createArray = exports.createArray = function createArray(length) {
	return Array.apply(null, Array(length));
};

var hasClassNames = exports.hasClassNames = function hasClassNames(elem, classNames) {
	return classNames.filter(function (className) {
		return elem.classList.contains(className);
	}).length > 0;
};

var hsl = exports.hsl = function hsl(h, s, l) {
	return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
};

var alphaGradient = exports.alphaGradient = function alphaGradient(colors, num) {

	var gradient = (0, _colorInterpolate2.default)(colors);

	return createArray(num).map(function (_, i, _ref) {
		var length = _ref.length;


		// Calculate value between 0 and 1 based on the total length
		var index = 1 / length * i;
		var color = gradient(index);

		return (0, _colorAlpha2.default)(color, index);
	});
};

var fifo = exports.fifo = function fifo(length) {

	var arr = [];

	return function (value) {

		if (value === undefined) return arr;
		if (arr.length >= length) arr.shift();

		arr.push(value);

		return arr;
	};
};

var positionFixed = exports.positionFixed = function positionFixed(e) {
	return {

		x: e.clientX,
		y: e.clientY

	};
};

var positionRelative = exports.positionRelative = function positionRelative(e) {
	return {

		x: e.pageX,
		y: e.pageY

	};
};

var single = exports.single = function single(max) {

	var id = void 0;
	var iterations = void 0;

	var loop = function loop(_id, fn) {

		if (id !== _id) return;
		if (max !== undefined && iterations >= max) return;

		++iterations;

		fn();
		requestAnimationFrame(function () {
			return loop(_id, fn);
		});
	};

	return function (fn) {

		id = Symbol();
		iterations = 0;

		loop(id, fn);

		return function () {
			return id = Symbol();
		};
	};
};

var image = exports.image = function image(href) {

	var extensions = ['.jpg', '.jpeg', '.png', '.gif'];

	return extensions.some(function (extension) {
		return href.endsWith(extension);
	});
};

},{"color-alpha":2,"color-interpolate":3}],18:[function(require,module,exports){
'use strict';

var _basiclightbox = require('basiclightbox');

var basicLightbox = _interopRequireWildcard(_basiclightbox);

var _helpers = require('./_helpers');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var img = function img(href) {
	return '<img src="' + href + '">';
};

var origin = function origin(e, instance) {
	var _positionFixed = (0, _helpers.positionFixed)(e),
	    y = _positionFixed.y;

	var _document$documentEle = document.documentElement.getBoundingClientRect(),
	    height = _document$documentEle.height;

	var reduction = 10;
	var offset = (y - height / 2) / reduction;

	var elem = instance.element();
	var placeholder = elem.querySelector('.basicLightbox__placeholder');

	placeholder.style.setProperty('--y', offset + 'px');
};

document.querySelectorAll('a[href]').forEach(function (elem) {

	var href = elem.href;

	if ((0, _helpers.image)(elem.href) === false) return;

	elem.onclick = function (e) {

		var instance = basicLightbox.create(img(href), {
			className: 'lightbox',
			beforeShow: function beforeShow(instance) {
				return origin(e, instance);
			}
		});

		instance.show();

		document.onkeydown = function (e) {
			return (0, _helpers.esc)(e.keyCode) === true ? instance.close() : null;
		};

		e.preventDefault();
		e.stopPropagation();
	};
});

},{"./_helpers":17,"basiclightbox":1}],19:[function(require,module,exports){
'use strict';

var _jump = require('jump.js');

var _jump2 = _interopRequireDefault(_jump);

require('./_foreach');

require('./_color');

require('./_canvas');

require('./_lightbox');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.querySelectorAll('a[href^="#"]').forEach(function (elem) {

	elem.onclick = function (e) {

		var href = elem.getAttribute('href');
		var target = document.querySelector(href);

		(0, _jump2.default)(target, {
			duration: 500,
			a11y: true
		});

		e.preventDefault();
		e.stopPropagation();
	};
});

},{"./_canvas":14,"./_color":15,"./_foreach":16,"./_lightbox":18,"jump.js":11}]},{},[19]);
