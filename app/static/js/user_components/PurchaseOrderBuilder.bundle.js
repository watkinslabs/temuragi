// Ensure window.Components exists
window.Components = window.Components || {};
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ PurchaseOrderBuilder)
});

;// external "React"
const external_React_namespaceObject = window["React"];
var external_React_default = /*#__PURE__*/__webpack_require__.n(external_React_namespaceObject);
;// ./node_modules/lucide-react/dist/esm/shared/src/utils.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};


//# sourceMappingURL=utils.js.map

;// ./node_modules/lucide-react/dist/esm/defaultAttributes.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};


//# sourceMappingURL=defaultAttributes.js.map

;// ./node_modules/lucide-react/dist/esm/Icon.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const Icon = (0,external_React_namespaceObject.forwardRef)(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => (0,external_React_namespaceObject.createElement)(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => (0,external_React_namespaceObject.createElement)(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);


//# sourceMappingURL=Icon.js.map

;// ./node_modules/lucide-react/dist/esm/createLucideIcon.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const createLucideIcon = (iconName, iconNode) => {
  const Component = (0,external_React_namespaceObject.forwardRef)(
    ({ className, ...props }, ref) => (0,external_React_namespaceObject.createElement)(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};


//# sourceMappingURL=createLucideIcon.js.map

;// ./node_modules/lucide-react/dist/esm/icons/plus.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode);


//# sourceMappingURL=plus.js.map

;// ./node_modules/lucide-react/dist/esm/icons/message-square.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const message_square_iconNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", message_square_iconNode);


//# sourceMappingURL=message-square.js.map

;// ./node_modules/lucide-react/dist/esm/icons/save.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const save_iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", save_iconNode);


//# sourceMappingURL=save.js.map

;// ./node_modules/lucide-react/dist/esm/icons/truck.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const truck_iconNode = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("truck", truck_iconNode);


//# sourceMappingURL=truck.js.map

;// ./node_modules/lucide-react/dist/esm/icons/x.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const x_iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", x_iconNode);


//# sourceMappingURL=x.js.map

;// ./node_modules/lucide-react/dist/esm/icons/copy.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const copy_iconNode = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", copy_iconNode);


//# sourceMappingURL=copy.js.map

;// ./node_modules/lucide-react/dist/esm/icons/trash-2.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const trash_2_iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", trash_2_iconNode);


//# sourceMappingURL=trash-2.js.map

;// ./src/user_components/PurchaseOrderBuilder.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/**
 * @routes ["PurchaseOrder"]
*/




// Main Purchase Order Builder Component
var PurchaseOrder = function PurchaseOrder(_ref) {
  var config = _ref.config;
  // Core state
  var _useState = (0,external_React_namespaceObject.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    loading = _useState2[0],
    setLoading = _useState2[1];
  var _useState3 = (0,external_React_namespaceObject.useState)(''),
    _useState4 = _slicedToArray(_useState3, 2),
    loadingMessage = _useState4[0],
    setLoadingMessage = _useState4[1];

  // PO Data state
  var _useState5 = (0,external_React_namespaceObject.useState)(config.po_number || null),
    _useState6 = _slicedToArray(_useState5, 1),
    poNumber = _useState6[0];
  var _useState7 = (0,external_React_namespaceObject.useState)(!!config.po_number && config.po_number !== 'NEW'),
    _useState8 = _slicedToArray(_useState7, 1),
    isEditMode = _useState8[0];
  var _useState9 = (0,external_React_namespaceObject.useState)(null),
    _useState0 = _slicedToArray(_useState9, 2),
    vendor = _useState0[0],
    setVendor = _useState0[1];
  var _useState1 = (0,external_React_namespaceObject.useState)(get_default_header(config)),
    _useState10 = _slicedToArray(_useState1, 2),
    header = _useState10[0],
    setHeader = _useState10[1];
  var _useState11 = (0,external_React_namespaceObject.useState)([]),
    _useState12 = _slicedToArray(_useState11, 2),
    lines = _useState12[0],
    setLines = _useState12[1];
  var _useState13 = (0,external_React_namespaceObject.useState)([]),
    _useState14 = _slicedToArray(_useState13, 2),
    deletedLineIds = _useState14[0],
    setDeletedLineIds = _useState14[1];

  // UI State
  var _useState15 = (0,external_React_namespaceObject.useState)({
      show: false,
      comments1: '',
      comments2: ''
    }),
    _useState16 = _slicedToArray(_useState15, 2),
    vendorComments = _useState16[0],
    setVendorComments = _useState16[1];
  var _useState17 = (0,external_React_namespaceObject.useState)(false),
    _useState18 = _slicedToArray(_useState17, 2),
    showReceiveModal = _useState18[0],
    setShowReceiveModal = _useState18[1];
  var _useState19 = (0,external_React_namespaceObject.useState)(new Set()),
    _useState20 = _slicedToArray(_useState19, 2),
    selectedReceiveLines = _useState20[0],
    setSelectedReceiveLines = _useState20[1];

  // Virtual inventory state (part -> inventory data)
  var _useState21 = (0,external_React_namespaceObject.useState)({}),
    _useState22 = _slicedToArray(_useState21, 2),
    virtualInventory = _useState22[0],
    setVirtualInventory = _useState22[1];
  var _useState23 = (0,external_React_namespaceObject.useState)({}),
    _useState24 = _slicedToArray(_useState23, 2),
    inventoryLoading = _useState24[0],
    setInventoryLoading = _useState24[1];

  // Pre-population data
  var prePopulateData = config.pre_populate_data || {
    location: config.location,
    ship_via: config.ship_via,
    shipping_address: config.shipping_address,
    initial_items: config.initial_items || [],
    vendors: config.vendors || false,
    parked_order_id: config.parked_order_id || 0
  };

  // API configuration
  var api_call = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(operation, model) {
      var params,
        request_data,
        _args = arguments;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            params = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            request_data = _objectSpread({
              operation: operation,
              model: model,
              company: config.company || 'PACIFIC'
            }, params); // Use your existing API manager
            _context.n = 1;
            return window.app.api.post(config.data_api, request_data);
          case 1:
            return _context.a(2, _context.v);
        }
      }, _callee);
    }));
    return function api_call(_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  // Initialize component
  (0,external_React_namespaceObject.useEffect)(function () {
    var init = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (!(config.po_number === 'NEW')) {
                _context2.n = 1;
                break;
              }
              // Apply pre-population for new POs
              apply_pre_population();
              if (prePopulateData.initial_items.length === 0) {
                add_line();
              }
              _context2.n = 4;
              break;
            case 1:
              if (!isEditMode) {
                _context2.n = 3;
                break;
              }
              _context2.n = 2;
              return load_existing_po();
            case 2:
              _context2.n = 4;
              break;
            case 3:
              // New PO without pre-population
              add_line();
            case 4:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      return function init() {
        return _ref3.apply(this, arguments);
      };
    }();
    init();
  }, []);

  // Load existing PO
  var load_existing_po = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var result, cleaned_data;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            setLoading(true);
            setLoadingMessage('Loading purchase order...');
            _context3.n = 1;
            return api_call('get', 'PurchaseOrder', {
              po_number: poNumber
            });
          case 1:
            result = _context3.v;
            if (!result.success) {
              _context3.n = 3;
              break;
            }
            cleaned_data = clean_po_data(result);
            setHeader(map_header_data(cleaned_data.header || {}));
            setLines(cleaned_data.lines || []);

            // Load vendor info if we have vendor code
            if (!cleaned_data.header.vendor_code) {
              _context3.n = 2;
              break;
            }
            _context3.n = 2;
            return load_vendor_details(cleaned_data.header.vendor_code);
          case 2:
            _context3.n = 4;
            break;
          case 3:
            show_error('Failed to load purchase order');
          case 4:
            setLoading(false);
          case 5:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    return function load_existing_po() {
      return _ref4.apply(this, arguments);
    };
  }();

  // Apply pre-population data
  var apply_pre_population = function apply_pre_population() {
    var data = prePopulateData;

    // Apply location
    if (data.location) {
      setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          location: data.location
        });
      });
    }

    // Apply ship_via
    if (data.ship_via) {
      setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          ship_via: data.ship_via
        });
      });
    }

    // Apply shipping address
    if (data.shipping_address) {
      setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          shipping: _objectSpread(_objectSpread({}, prev.shipping), data.shipping_address)
        });
      });
    }

    // Add initial items
    if (data.initial_items && data.initial_items.length > 0) {
      var new_lines = data.initial_items.map(function (item) {
        if (item.type === 'part' && item.part) {
          return {
            _source: 'active',
            part: item.part,
            pcode: item.part,
            description: item.description || '',
            pdesc: item.description || '',
            quantity: item.qty || 1,
            pqty: item.qty || 1,
            price: item.price || 0,
            pprce: item.price || 0,
            discount: 0,
            pdisc: 0,
            extended: (item.price || 0) * (item.qty || 1),
            pext: (item.price || 0) * (item.qty || 1),
            received_qty: 0,
            rqty: 0,
            erd: header.expected_receipt_date,
            type: 'R',
            taxable: false,
            message: '',
            msg: ''
          };
        } else if (item.type === 'note' && item.message) {
          return {
            _source: 'active',
            type: 'N',
            message: item.message,
            msg: item.message,
            part: '',
            pcode: '',
            description: '',
            pdesc: '',
            quantity: 0,
            pqty: 0,
            price: 0,
            pprce: 0,
            discount: 0,
            pdisc: 0,
            extended: 0,
            pext: 0,
            received_qty: 0,
            rqty: 0,
            erd: header.expected_receipt_date,
            taxable: false
          };
        }
        return null;
      }).filter(Boolean);
      setLines(new_lines);

      // Fetch virtual inventory for parts
      new_lines.forEach(function (line, index) {
        if (line.part) {
          fetch_virtual_inventory(line.part, index);
        }
      });
    }
  };

  // Vendor handling
  var handle_vendor_change = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(vendor_data) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            setVendor(vendor_data);

            // Update header
            setHeader(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                vendor_code: vendor_data.code,
                vendor_name: vendor_data.name,
                billing: {
                  name: vendor_data.name,
                  address1: vendor_data.add1 || '',
                  address2: vendor_data.add2 || '',
                  city: vendor_data.city || '',
                  state: vendor_data.state || '',
                  zip: vendor_data.zip_ || '',
                  country: vendor_data.country || 'USA'
                },
                terms: vendor_data.terms_num || prev.terms
              });
            });

            // Show vendor comments if any
            if (vendor_data.comments1 || vendor_data.comments2) {
              setVendorComments({
                show: true,
                comments1: vendor_data.comments1 || '',
                comments2: vendor_data.comments2 || ''
              });
            } else {
              setVendorComments({
                show: false,
                comments1: '',
                comments2: ''
              });
            }
          case 1:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return function handle_vendor_change(_x3) {
      return _ref5.apply(this, arguments);
    };
  }();
  var load_vendor_details = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(vendor_code) {
      var result;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.n = 1;
            return api_call('list', 'GPACIFIC_dbo_BKAPVEND', {
              filters: {
                code: {
                  operator: "eq",
                  value: vendor_code
                }
              },
              start: 0,
              length: 1
            });
          case 1:
            result = _context5.v;
            if (!(result.success && result.data && result.data.length > 0)) {
              _context5.n = 2;
              break;
            }
            _context5.n = 2;
            return handle_vendor_change(result.data[0]);
          case 2:
            return _context5.a(2);
        }
      }, _callee5);
    }));
    return function load_vendor_details(_x4) {
      return _ref6.apply(this, arguments);
    };
  }();

  // Line management
  var add_line = function add_line() {
    var new_line = {
      _source: 'active',
      part: '',
      pcode: '',
      description: '',
      pdesc: '',
      quantity: 1,
      pqty: 1,
      price: 0,
      pprce: 0,
      discount: 0,
      pdisc: 0,
      extended: 0,
      pext: 0,
      received_qty: 0,
      rqty: 0,
      erd: header.expected_receipt_date,
      type: 'R',
      taxable: false,
      message: '',
      msg: ''
    };
    setLines(function (prev) {
      return [].concat(_toConsumableArray(prev), [new_line]);
    });
  };
  var add_note_line = function add_note_line() {
    var new_note = {
      _source: 'active',
      type: 'N',
      message: '',
      msg: '',
      part: '',
      pcode: '',
      description: '',
      pdesc: '',
      quantity: 0,
      pqty: 0,
      price: 0,
      pprce: 0,
      discount: 0,
      pdisc: 0,
      extended: 0,
      pext: 0,
      received_qty: 0,
      rqty: 0,
      erd: header.expected_receipt_date,
      taxable: false
    };
    setLines(function (prev) {
      return [].concat(_toConsumableArray(prev), [new_note]);
    });
  };
  var remove_line = function remove_line(index) {
    var line = lines[index];
    if (line.rqty > 0) {
      show_error('Cannot remove received lines');
      return;
    }
    if (confirm('Remove this line?')) {
      if (line.record) {
        setDeletedLineIds(function (prev) {
          return [].concat(_toConsumableArray(prev), [line.record]);
        });
      }
      setLines(function (prev) {
        return prev.filter(function (_, i) {
          return i !== index;
        });
      });
    }
  };
  var update_line = function update_line(index, field, value) {
    setLines(function (prev) {
      var updated = _toConsumableArray(prev);
      var line = _objectSpread({}, updated[index]);

      // Update both field formats
      line[field] = value;

      // Map fields
      var field_map = {
        'part': 'pcode',
        'description': 'pdesc',
        'quantity': 'pqty',
        'price': 'pprce',
        'discount': 'pdisc',
        'message': 'msg'
      };
      if (field_map[field]) {
        line[field_map[field]] = value;
      }

      // Recalculate extended if needed
      if (line.type !== 'N' && ['quantity', 'price', 'discount'].includes(field)) {
        var qty = parseFloat(line.quantity || line.pqty || 0);
        var price = parseFloat(line.price || line.pprce || 0);
        var discount = parseFloat(line.discount || line.pdisc || 0);
        var extended = qty * (price - discount);
        line.extended = extended;
        line.pext = extended;
      }
      updated[index] = line;
      return updated;
    });
  };

  // Virtual inventory
  var fetch_virtual_inventory = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(part, index) {
      var result;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            if (part) {
              _context6.n = 1;
              break;
            }
            return _context6.a(2);
          case 1:
            setInventoryLoading(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, index, true));
            });
            _context6.n = 2;
            return api_call('list', 'JADVDATA_dbo_virtual_inventory', {
              filters: {
                part: {
                  operator: "eq",
                  value: part
                }
              },
              start: 0,
              length: 50
            });
          case 2:
            result = _context6.v;
            if (result.success && result.data && result.data.length > 0) {
              setVirtualInventory(function (prev) {
                return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, index, result.data));
              });
            } else {
              setVirtualInventory(function (prev) {
                return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, index, []));
              });
            }
            setInventoryLoading(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, index, false));
            });
          case 3:
            return _context6.a(2);
        }
      }, _callee6);
    }));
    return function fetch_virtual_inventory(_x5, _x6) {
      return _ref7.apply(this, arguments);
    };
  }();
  var select_vendor_from_inventory = /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(vendor_code, line_index) {
      var static_vendor;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            if (!(prePopulateData.vendors && prePopulateData.vendors.length > 0)) {
              _context7.n = 2;
              break;
            }
            static_vendor = prePopulateData.vendors.find(function (v) {
              return v.code === vendor_code;
            });
            if (!static_vendor) {
              _context7.n = 2;
              break;
            }
            _context7.n = 1;
            return handle_vendor_change(static_vendor);
          case 1:
            return _context7.a(2);
          case 2:
            _context7.n = 3;
            return load_vendor_details(vendor_code);
          case 3:
            return _context7.a(2);
        }
      }, _callee7);
    }));
    return function select_vendor_from_inventory(_x7, _x8) {
      return _ref8.apply(this, arguments);
    };
  }();

  // Save PO
  var save_po = /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      var save_data, operation, result;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            if (validate_po()) {
              _context8.n = 1;
              break;
            }
            return _context8.a(2);
          case 1:
            setLoading(true);
            setLoadingMessage('Saving purchase order...');
            save_data = {
              header: header,
              lines: lines,
              deleted_line_ids: deletedLineIds
            };
            if (isEditMode) {
              save_data.po_number = poNumber;
            }
            operation = isEditMode ? 'update' : 'create';
            _context8.n = 2;
            return api_call(operation, 'PurchaseOrder', {
              data: save_data
            });
          case 2:
            result = _context8.v;
            if (!result.success) {
              _context8.n = 5;
              break;
            }
            show_success('Purchase order saved successfully!');
            if (!(!isEditMode && result.data.po_number)) {
              _context8.n = 3;
              break;
            }
            // Redirect to edit mode
            window.location.href = "/purchase_orders/edit/".concat(result.data.po_number);
            _context8.n = 4;
            break;
          case 3:
            _context8.n = 4;
            return load_existing_po();
          case 4:
            setDeletedLineIds([]);
            _context8.n = 6;
            break;
          case 5:
            show_error(result.message || 'Failed to save purchase order');
          case 6:
            setLoading(false);
          case 7:
            return _context8.a(2);
        }
      }, _callee8);
    }));
    return function save_po() {
      return _ref9.apply(this, arguments);
    };
  }();

  // Calculations
  var totals = (0,external_React_namespaceObject.useMemo)(function () {
    var subtotal = 0;
    lines.forEach(function (line) {
      var extended = parseFloat(line.extended || line.pext || 0);
      subtotal += extended;
    });
    var freight = parseFloat(header.freight || 0);
    var tax_amount = parseFloat(header.tax_amount || 0);
    var total = subtotal + freight + tax_amount;
    return {
      subtotal: subtotal,
      freight: freight,
      tax_amount: tax_amount,
      total: total
    };
  }, [lines, header.freight, header.tax_amount]);

  // Validation
  var validate_po = function validate_po() {
    var errors = [];
    if (!header.vendor_code) {
      errors.push('Please select a vendor');
    }
    if (!header.order_date) {
      errors.push('Order date is required');
    }
    if (!header.expected_receipt_date) {
      errors.push('Expected receipt date is required');
    }
    if (lines.length === 0) {
      errors.push('At least one line item is required');
    }
    var has_valid_line = false;
    lines.forEach(function (line) {
      var part = line.part || line.pcode;
      var qty = parseFloat(line.quantity || line.pqty || 0);
      if (part && qty > 0) {
        has_valid_line = true;
      }
    });
    if (!has_valid_line) {
      errors.push('At least one line must have a part and quantity');
    }
    if (errors.length > 0) {
      show_error('Please fix the following errors:\n' + errors.join('\n'));
      return false;
    }
    return true;
  };

  // Utility functions
  var show_error = function show_error(message) {
    alert('Error: ' + message);
  };
  var show_success = function show_success(message) {
    alert('Success: ' + message);
  };

  // Render helpers
  var is_partially_received = lines.some(function (line) {
    return line.rqty > 0;
  });
  var can_edit_header = !is_partially_received;
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: "container-fluid mt-3"
  }, loading && /*#__PURE__*/external_React_default().createElement("div", {
    className: "position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center",
    style: {
      background: 'rgba(0,0,0,0.5)',
      zIndex: 9999
    }
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "text-center text-white"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "spinner-border text-light mb-2",
    role: "status"
  }, /*#__PURE__*/external_React_default().createElement("span", {
    className: "visually-hidden"
  }, "Loading...")), /*#__PURE__*/external_React_default().createElement("div", null, loadingMessage || 'Loading...'))), /*#__PURE__*/external_React_default().createElement("h4", {
    className: "mb-3"
  }, "Purchase Order", poNumber && /*#__PURE__*/external_React_default().createElement("span", {
    className: "ms-2"
  }, "#", poNumber), header.printed && /*#__PURE__*/external_React_default().createElement("span", {
    className: "badge bg-success ms-2"
  }, "Printed")), /*#__PURE__*/external_React_default().createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-lg-6 mb-3"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "card h-100"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "card-header"
  }, /*#__PURE__*/external_React_default().createElement("h6", {
    className: "mb-0"
  }, "Order Details")), /*#__PURE__*/external_React_default().createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "row g-2"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label"
  }, "Vendor ", /*#__PURE__*/external_React_default().createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/external_React_default().createElement(VendorSelect, {
    value: header.vendor_code,
    vendors: prePopulateData.vendors,
    onVendorChange: handle_vendor_change,
    api_call: api_call,
    disabled: !can_edit_header
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label"
  }, "Ordered By"), /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: header.orderd_by_customer || '',
    onChange: function onChange(e) {
      return setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          orderd_by_customer: e.target.value
        });
      });
    },
    placeholder: "Name..."
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label"
  }, "Order Date ", /*#__PURE__*/external_React_default().createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/external_React_default().createElement("input", {
    type: "date",
    className: "form-control form-control-sm",
    value: header.order_date,
    onChange: function onChange(e) {
      return setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          order_date: e.target.value
        });
      });
    },
    disabled: !can_edit_header,
    required: true
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label"
  }, "Expected Date ", /*#__PURE__*/external_React_default().createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/external_React_default().createElement("input", {
    type: "date",
    className: "form-control form-control-sm",
    value: header.expected_receipt_date,
    onChange: function onChange(e) {
      return setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          expected_receipt_date: e.target.value
        });
      });
    },
    required: true
  })))))), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-lg-6 mb-3"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "card h-100"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "card-header"
  }, /*#__PURE__*/external_React_default().createElement("h6", {
    className: "mb-0"
  }, "Shipping Details")), /*#__PURE__*/external_React_default().createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "row g-2"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label"
  }, "Terms"), /*#__PURE__*/external_React_default().createElement(TermsSelect, {
    value: header.terms,
    onChange: function onChange(value) {
      return setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          terms: value
        });
      });
    },
    api_call: api_call,
    disabled: !can_edit_header
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label"
  }, "Ship Via"), /*#__PURE__*/external_React_default().createElement(ShipViaInput, {
    value: header.ship_via,
    onChange: function onChange(value) {
      return setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          ship_via: value
        });
      });
    },
    api_call: api_call,
    disabled: !can_edit_header
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label"
  }, "Freight"), /*#__PURE__*/external_React_default().createElement("input", {
    type: "number",
    className: "form-control form-control-sm",
    value: header.freight,
    onChange: function onChange(e) {
      return setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          freight: parseFloat(e.target.value) || 0
        });
      });
    },
    min: "0",
    step: "0.01"
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label"
  }, "Location"), /*#__PURE__*/external_React_default().createElement(LocationSelect, {
    value: header.location,
    onChange: function onChange(value) {
      return setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          location: value
        });
      });
    },
    api_call: api_call,
    company: config.company
  }))))))), vendorComments.show && /*#__PURE__*/external_React_default().createElement("div", {
    className: "alert alert-warning"
  }, /*#__PURE__*/external_React_default().createElement("h6", {
    className: "alert-heading"
  }, "Vendor Notes:"), vendorComments.comments1 && /*#__PURE__*/external_React_default().createElement("p", {
    className: "mb-2"
  }, vendorComments.comments1), vendorComments.comments2 && /*#__PURE__*/external_React_default().createElement("p", {
    className: "mb-0"
  }, vendorComments.comments2)), /*#__PURE__*/external_React_default().createElement("div", {
    className: "row g-3 mb-3"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-lg-6"
  }, /*#__PURE__*/external_React_default().createElement(AddressCard, {
    title: "Billing Address",
    address: header.billing,
    onChange: function onChange(billing) {
      return setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          billing: billing
        });
      });
    },
    readonly: !can_edit_header
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-lg-6"
  }, /*#__PURE__*/external_React_default().createElement(AddressCard, {
    title: "Shipping Address",
    address: header.shipping,
    onChange: function onChange(shipping) {
      return setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          shipping: shipping
        });
      });
    },
    showCopyButton: true,
    onCopy: function onCopy() {
      return setHeader(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          shipping: _objectSpread(_objectSpread({}, prev.billing), {}, {
            attention: prev.shipping.attention
          })
        });
      });
    }
  }))), /*#__PURE__*/external_React_default().createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "card-header d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/external_React_default().createElement("h6", {
    className: "mb-0"
  }, "Line Items"), /*#__PURE__*/external_React_default().createElement("div", null, /*#__PURE__*/external_React_default().createElement("button", {
    className: "btn btn-primary btn-sm me-2",
    onClick: add_line
  }, /*#__PURE__*/external_React_default().createElement(Plus, {
    size: 16,
    className: "me-1"
  }), "Add Line"), /*#__PURE__*/external_React_default().createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: add_note_line
  }, /*#__PURE__*/external_React_default().createElement(MessageSquare, {
    size: 16,
    className: "me-1"
  }), "Add Note"))), /*#__PURE__*/external_React_default().createElement("div", {
    className: "card-body"
  }, lines.length === 0 ? /*#__PURE__*/external_React_default().createElement("div", {
    className: "text-muted text-center p-4"
  }, "No lines added. Click \"Add Line\" to start.") : lines.map(function (line, index) {
    return /*#__PURE__*/external_React_default().createElement(LineItem, {
      key: index,
      line: line,
      index: index,
      onUpdate: update_line,
      onRemove: remove_line,
      api_call: api_call,
      virtualInventory: virtualInventory[index],
      inventoryLoading: inventoryLoading[index],
      onFetchInventory: function onFetchInventory(part) {
        return fetch_virtual_inventory(part, index);
      },
      onSelectVendor: function onSelectVendor(vendor_code) {
        return select_vendor_from_inventory(vendor_code, index);
      }
    });
  }))), /*#__PURE__*/external_React_default().createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-4 offset-md-8"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "card"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "d-flex justify-content-between mb-2"
  }, /*#__PURE__*/external_React_default().createElement("span", null, "Subtotal:"), /*#__PURE__*/external_React_default().createElement("strong", null, "$", totals.subtotal.toFixed(2))), /*#__PURE__*/external_React_default().createElement("div", {
    className: "d-flex justify-content-between mb-2"
  }, /*#__PURE__*/external_React_default().createElement("span", null, "Tax:"), /*#__PURE__*/external_React_default().createElement("strong", null, "$", totals.tax_amount.toFixed(2))), /*#__PURE__*/external_React_default().createElement("div", {
    className: "d-flex justify-content-between mb-2"
  }, /*#__PURE__*/external_React_default().createElement("span", null, "Freight:"), /*#__PURE__*/external_React_default().createElement("strong", null, "$", totals.freight.toFixed(2))), /*#__PURE__*/external_React_default().createElement("hr", null), /*#__PURE__*/external_React_default().createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/external_React_default().createElement("span", {
    className: "h5"
  }, "Total:"), /*#__PURE__*/external_React_default().createElement("strong", {
    className: "h5"
  }, "$", totals.total.toFixed(2))))))), /*#__PURE__*/external_React_default().createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/external_React_default().createElement("button", {
    className: "btn btn-success me-2",
    onClick: save_po,
    disabled: loading
  }, /*#__PURE__*/external_React_default().createElement(Save, {
    size: 16,
    className: "me-1"
  }), isEditMode ? 'Update PO' : 'Create PO'), isEditMode && /*#__PURE__*/external_React_default().createElement("button", {
    className: "btn btn-primary me-2",
    onClick: function onClick() {
      return setShowReceiveModal(true);
    }
  }, /*#__PURE__*/external_React_default().createElement(Truck, {
    size: 16,
    className: "me-1"
  }), "Receive"), /*#__PURE__*/external_React_default().createElement("button", {
    className: "btn btn-secondary",
    onClick: function onClick() {
      return window.location.href = '/purchase_orders';
    }
  }, /*#__PURE__*/external_React_default().createElement(X, {
    size: 16,
    className: "me-1"
  }), "Cancel")), showReceiveModal && /*#__PURE__*/external_React_default().createElement(ReceiveModal, {
    lines: lines,
    onClose: function onClose() {
      return setShowReceiveModal(false);
    },
    onReceive: (/*#__PURE__*/function () {
      var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(selected_indices) {
        var result;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              setLoading(true);
              setLoadingMessage('Processing receipt...');
              _context9.n = 1;
              return api_call('update', 'PurchaseOrder', {
                po_number: poNumber,
                action: 'receive_lines',
                line_indices: selected_indices
              });
            case 1:
              result = _context9.v;
              if (!result.success) {
                _context9.n = 3;
                break;
              }
              show_success("Successfully received ".concat(selected_indices.length, " line(s)"));
              _context9.n = 2;
              return load_existing_po();
            case 2:
              _context9.n = 4;
              break;
            case 3:
              show_error(result.message || 'Failed to process receipt');
            case 4:
              setLoading(false);
              setShowReceiveModal(false);
            case 5:
              return _context9.a(2);
          }
        }, _callee9);
      }));
      return function (_x9) {
        return _ref0.apply(this, arguments);
      };
    }())
  }));
};

// Sub-components

var VendorSelect = function VendorSelect(_ref1) {
  var value = _ref1.value,
    vendors = _ref1.vendors,
    onVendorChange = _ref1.onVendorChange,
    api_call = _ref1.api_call,
    disabled = _ref1.disabled;
  var _useState25 = (0,external_React_namespaceObject.useState)(''),
    _useState26 = _slicedToArray(_useState25, 2),
    searchTerm = _useState26[0],
    setSearchTerm = _useState26[1];
  var _useState27 = (0,external_React_namespaceObject.useState)([]),
    _useState28 = _slicedToArray(_useState27, 2),
    suggestions = _useState28[0],
    setSuggestions = _useState28[1];
  var _useState29 = (0,external_React_namespaceObject.useState)(false),
    _useState30 = _slicedToArray(_useState29, 2),
    loading = _useState30[0],
    setLoading = _useState30[1];
  var _useState31 = (0,external_React_namespaceObject.useState)(false),
    _useState32 = _slicedToArray(_useState31, 2),
    showDropdown = _useState32[0],
    setShowDropdown = _useState32[1];

  // Static vendors mode
  if (vendors && vendors.length > 0) {
    return /*#__PURE__*/external_React_default().createElement("select", {
      className: "form-select form-select-sm",
      value: value,
      onChange: (/*#__PURE__*/function () {
        var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(e) {
          var _result$data;
          var vendor_code, result;
          return _regenerator().w(function (_context0) {
            while (1) switch (_context0.n) {
              case 0:
                vendor_code = e.target.value;
                if (vendor_code) {
                  _context0.n = 1;
                  break;
                }
                return _context0.a(2);
              case 1:
                _context0.n = 2;
                return api_call('list', 'GPACIFIC_dbo_BKAPVEND', {
                  filters: {
                    code: {
                      operator: "eq",
                      value: vendor_code
                    }
                  },
                  start: 0,
                  length: 1
                });
              case 2:
                result = _context0.v;
                if (result.success && (_result$data = result.data) !== null && _result$data !== void 0 && _result$data[0]) {
                  onVendorChange(result.data[0]);
                }
              case 3:
                return _context0.a(2);
            }
          }, _callee0);
        }));
        return function (_x0) {
          return _ref10.apply(this, arguments);
        };
      }()),
      disabled: disabled,
      required: true
    }, /*#__PURE__*/external_React_default().createElement("option", {
      value: ""
    }, "Select vendor..."), vendors.map(function (v) {
      return /*#__PURE__*/external_React_default().createElement("option", {
        key: v.code,
        value: v.code
      }, v.code, " - ", v.company);
    }));
  }

  // Autocomplete mode
  var search_vendors = /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(term) {
      var result;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            if (!(term.length < 2)) {
              _context1.n = 1;
              break;
            }
            setSuggestions([]);
            return _context1.a(2);
          case 1:
            setLoading(true);
            _context1.n = 2;
            return api_call('list', 'GPACIFIC_dbo_BKAPVEND', {
              filters: {
                name: {
                  operator: "ilike",
                  value: term
                }
              }
            });
          case 2:
            result = _context1.v;
            if (result.success && result.data) {
              setSuggestions(result.data.slice(0, 10));
            }
            setLoading(false);
          case 3:
            return _context1.a(2);
        }
      }, _callee1);
    }));
    return function search_vendors(_x1) {
      return _ref11.apply(this, arguments);
    };
  }();
  (0,external_React_namespaceObject.useEffect)(function () {
    var timer = setTimeout(function () {
      if (searchTerm && !value) {
        search_vendors(searchTerm);
      }
    }, 300);
    return function () {
      return clearTimeout(timer);
    };
  }, [searchTerm]);
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: "position-relative"
  }, /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: value ? "".concat(value, " - ").concat(searchTerm) : searchTerm,
    onChange: function onChange(e) {
      setSearchTerm(e.target.value);
      setShowDropdown(true);
    },
    onFocus: function onFocus() {
      return setShowDropdown(true);
    },
    onBlur: function onBlur() {
      return setTimeout(function () {
        return setShowDropdown(false);
      }, 200);
    },
    placeholder: "Search vendor...",
    disabled: disabled,
    required: true
  }), showDropdown && suggestions.length > 0 && /*#__PURE__*/external_React_default().createElement("div", {
    className: "position-absolute top-100 start-0 w-100 bg-white border rounded shadow-sm mt-1",
    style: {
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 1050
    }
  }, suggestions.map(function (vendor) {
    return /*#__PURE__*/external_React_default().createElement("div", {
      key: vendor.code,
      className: "p-2 hover-bg-light cursor-pointer",
      onClick: function onClick() {
        onVendorChange(vendor);
        setSearchTerm(vendor.name);
        setShowDropdown(false);
      }
    }, vendor.code, " - ", vendor.name);
  })));
};
var TermsSelect = function TermsSelect(_ref12) {
  var value = _ref12.value,
    _onChange = _ref12.onChange,
    api_call = _ref12.api_call,
    disabled = _ref12.disabled;
  var _useState33 = (0,external_React_namespaceObject.useState)([]),
    _useState34 = _slicedToArray(_useState33, 2),
    terms = _useState34[0],
    setTerms = _useState34[1];
  (0,external_React_namespaceObject.useEffect)(function () {
    var load_terms = /*#__PURE__*/function () {
      var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
        var result;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              _context10.n = 1;
              return api_call('list', 'BKSYSTERM', {
                start: 0,
                length: 0,
                return_columns: ["num", "desc"],
                order: [{
                  column: 0,
                  dir: 'asc'
                }],
                columns: [{
                  name: 'num'
                }, {
                  name: 'desc'
                }]
              });
            case 1:
              result = _context10.v;
              if (result.success && result.data) {
                setTerms(result.data);
              }
            case 2:
              return _context10.a(2);
          }
        }, _callee10);
      }));
      return function load_terms() {
        return _ref13.apply(this, arguments);
      };
    }();
    load_terms();
  }, []);
  return /*#__PURE__*/external_React_default().createElement("select", {
    className: "form-select form-select-sm",
    value: value,
    onChange: function onChange(e) {
      return _onChange(e.target.value);
    },
    disabled: disabled
  }, /*#__PURE__*/external_React_default().createElement("option", {
    value: ""
  }, "Select Terms..."), terms.map(function (term) {
    return /*#__PURE__*/external_React_default().createElement("option", {
      key: term.num,
      value: term.num
    }, term.desc);
  }));
};
var LocationSelect = function LocationSelect(_ref14) {
  var value = _ref14.value,
    _onChange2 = _ref14.onChange,
    api_call = _ref14.api_call,
    company = _ref14.company;
  var _useState35 = (0,external_React_namespaceObject.useState)([]),
    _useState36 = _slicedToArray(_useState35, 2),
    locations = _useState36[0],
    setLocations = _useState36[1];
  (0,external_React_namespaceObject.useEffect)(function () {
    var load_locations = /*#__PURE__*/function () {
      var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
        var result;
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.n) {
            case 0:
              _context11.n = 1;
              return api_call('list', 'JADVDATA_dbo_locations', {
                start: 0,
                length: 0,
                return_columns: ["location", "location_name"],
                order: [{
                  column: 1,
                  dir: 'asc'
                }],
                columns: [{
                  name: 'location'
                }, {
                  name: 'location_name'
                }],
                filters: {
                  company: {
                    operator: "eq",
                    value: company || "PACIFIC"
                  },
                  warehouse: {
                    operator: "eq",
                    value: "1"
                  },
                  active: {
                    operator: "eq",
                    value: "1"
                  }
                }
              });
            case 1:
              result = _context11.v;
              if (result.success && result.data) {
                setLocations(result.data);
              }
            case 2:
              return _context11.a(2);
          }
        }, _callee11);
      }));
      return function load_locations() {
        return _ref15.apply(this, arguments);
      };
    }();
    load_locations();
  }, []);
  return /*#__PURE__*/external_React_default().createElement("select", {
    className: "form-select form-select-sm",
    value: value,
    onChange: function onChange(e) {
      return _onChange2(e.target.value);
    }
  }, /*#__PURE__*/external_React_default().createElement("option", {
    value: ""
  }, "Select Location..."), locations.map(function (loc) {
    return /*#__PURE__*/external_React_default().createElement("option", {
      key: loc.location,
      value: loc.location
    }, loc.location, " - ", loc.location_name);
  }));
};
var ShipViaInput = function ShipViaInput(_ref16) {
  var value = _ref16.value,
    _onChange3 = _ref16.onChange,
    api_call = _ref16.api_call,
    disabled = _ref16.disabled;
  var _useState37 = (0,external_React_namespaceObject.useState)([]),
    _useState38 = _slicedToArray(_useState37, 2),
    suggestions = _useState38[0],
    setSuggestions = _useState38[1];
  var _useState39 = (0,external_React_namespaceObject.useState)(false),
    _useState40 = _slicedToArray(_useState39, 2),
    showDropdown = _useState40[0],
    setShowDropdown = _useState40[1];
  var common_options = ['UPS', 'FEDEX', 'USPS', 'DHL', 'FREIGHT', 'PICKUP'];
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: "position-relative"
  }, /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: value,
    onChange: function onChange(e) {
      return _onChange3(e.target.value);
    },
    onFocus: function onFocus() {
      return setShowDropdown(true);
    },
    onBlur: function onBlur() {
      return setTimeout(function () {
        return setShowDropdown(false);
      }, 200);
    },
    placeholder: "Ship via...",
    disabled: disabled
  }), showDropdown && /*#__PURE__*/external_React_default().createElement("div", {
    className: "position-absolute top-100 start-0 w-100 bg-white border rounded shadow-sm mt-1",
    style: {
      zIndex: 1050
    }
  }, common_options.filter(function (opt) {
    return opt.toLowerCase().includes(value.toLowerCase());
  }).map(function (opt) {
    return /*#__PURE__*/external_React_default().createElement("div", {
      key: opt,
      className: "p-2 hover-bg-light cursor-pointer",
      onClick: function onClick() {
        _onChange3(opt);
        setShowDropdown(false);
      }
    }, opt);
  })));
};
var AddressCard = function AddressCard(_ref17) {
  var title = _ref17.title,
    address = _ref17.address,
    _onChange4 = _ref17.onChange,
    readonly = _ref17.readonly,
    showCopyButton = _ref17.showCopyButton,
    onCopy = _ref17.onCopy;
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: "card h-100"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "card-header d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/external_React_default().createElement("h6", {
    className: "mb-0"
  }, title), showCopyButton && /*#__PURE__*/external_React_default().createElement("button", {
    type: "button",
    className: "btn btn-sm btn-secondary",
    onClick: onCopy
  }, /*#__PURE__*/external_React_default().createElement(Copy, {
    size: 14,
    className: "me-1"
  }), "Copy from Billing")), /*#__PURE__*/external_React_default().createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "row g-2"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: address.name,
    onChange: function onChange(e) {
      return _onChange4(_objectSpread(_objectSpread({}, address), {}, {
        name: e.target.value
      }));
    },
    placeholder: "Company Name",
    readOnly: readonly
  })), title === "Shipping Address" && /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: address.attention || '',
    onChange: function onChange(e) {
      return _onChange4(_objectSpread(_objectSpread({}, address), {}, {
        attention: e.target.value
      }));
    },
    placeholder: "Attention"
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: address.address1,
    onChange: function onChange(e) {
      return _onChange4(_objectSpread(_objectSpread({}, address), {}, {
        address1: e.target.value
      }));
    },
    placeholder: "Address Line 1",
    readOnly: readonly
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: address.address2,
    onChange: function onChange(e) {
      return _onChange4(_objectSpread(_objectSpread({}, address), {}, {
        address2: e.target.value
      }));
    },
    placeholder: "Address Line 2",
    readOnly: readonly
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: address.city,
    onChange: function onChange(e) {
      return _onChange4(_objectSpread(_objectSpread({}, address), {}, {
        city: e.target.value
      }));
    },
    placeholder: "City",
    readOnly: readonly
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-2"
  }, /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: address.state,
    onChange: function onChange(e) {
      return _onChange4(_objectSpread(_objectSpread({}, address), {}, {
        state: e.target.value
      }));
    },
    placeholder: "ST",
    maxLength: "2",
    readOnly: readonly
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-4"
  }, /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: address.zip,
    onChange: function onChange(e) {
      return _onChange4(_objectSpread(_objectSpread({}, address), {}, {
        zip: e.target.value
      }));
    },
    placeholder: "ZIP",
    readOnly: readonly
  })))));
};
var LineItem = function LineItem(_ref18) {
  var line = _ref18.line,
    index = _ref18.index,
    onUpdate = _ref18.onUpdate,
    onRemove = _ref18.onRemove,
    api_call = _ref18.api_call,
    virtualInventory = _ref18.virtualInventory,
    inventoryLoading = _ref18.inventoryLoading,
    onFetchInventory = _ref18.onFetchInventory,
    onSelectVendor = _ref18.onSelectVendor;
  var is_received = parseFloat(line.rqty || 0) > 0;
  var is_historical = line._source === 'historical';
  var is_readonly = is_received || is_historical;
  var line_number = index + 1;
  var is_note_line = line.type === 'N' || !line.pcode && !line.part && line.msg;
  if (is_note_line) {
    return /*#__PURE__*/external_React_default().createElement("div", {
      className: "card mb-2 ".concat(is_readonly ? 'bg-light' : '')
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "row align-items-center"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "col-auto"
    }, /*#__PURE__*/external_React_default().createElement("span", {
      className: "fw-bold text-muted"
    }, "Line ", line_number), is_received && /*#__PURE__*/external_React_default().createElement("span", {
      className: "badge bg-success ms-2"
    }, "RECEIVED")), /*#__PURE__*/external_React_default().createElement("div", {
      className: "col-auto"
    }, /*#__PURE__*/external_React_default().createElement("span", {
      className: "badge bg-info"
    }, "NOTE")), /*#__PURE__*/external_React_default().createElement("div", {
      className: "col"
    }, /*#__PURE__*/external_React_default().createElement("input", {
      type: "text",
      className: "form-control form-control-sm",
      value: line.message || line.msg || '',
      onChange: function onChange(e) {
        return onUpdate(index, 'message', e.target.value);
      },
      maxLength: "30",
      placeholder: "Note (max 30 characters)",
      readOnly: is_readonly
    })), !is_readonly && /*#__PURE__*/external_React_default().createElement("div", {
      className: "col-auto"
    }, /*#__PURE__*/external_React_default().createElement("button", {
      className: "btn btn-sm btn-danger",
      onClick: function onClick() {
        return onRemove(index);
      }
    }, /*#__PURE__*/external_React_default().createElement(Trash2, {
      size: 16
    }))))));
  }
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: "card mb-2 ".concat(is_readonly ? 'bg-light' : '')
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-2"
  }, /*#__PURE__*/external_React_default().createElement("div", null, /*#__PURE__*/external_React_default().createElement("span", {
    className: "fw-bold text-muted"
  }, "Line ", line_number), is_received && /*#__PURE__*/external_React_default().createElement("span", {
    className: "badge bg-success ms-2"
  }, "RECEIVED")), !is_readonly && /*#__PURE__*/external_React_default().createElement("button", {
    className: "btn btn-sm btn-danger",
    onClick: function onClick() {
      return onRemove(index);
    }
  }, /*#__PURE__*/external_React_default().createElement(Trash2, {
    size: 16
  }))), /*#__PURE__*/external_React_default().createElement("div", {
    className: "row g-2"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label small mb-1"
  }, "Part #"), /*#__PURE__*/external_React_default().createElement(PartSearch, {
    value: line.part || line.pcode || '',
    onChange: function onChange(value) {
      return onUpdate(index, 'part', value);
    },
    onPartSelect: (/*#__PURE__*/function () {
      var _ref19 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(part) {
        var _cost_result$data;
        var cost_result;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.n) {
            case 0:
              onUpdate(index, 'part', part.part);
              onUpdate(index, 'description', part.inventory_description);

              // Fetch cost
              _context12.n = 1;
              return api_call('list', 'GPACIFIC_dbo_BKICMSTR', {
                return_columns: ["code", "lstc"],
                order: [{
                  column: 0,
                  dir: 'asc'
                }],
                columns: [{
                  name: 'code'
                }, {
                  name: 'lstc'
                }],
                start: 0,
                length: 1,
                filters: {
                  code: {
                    operator: "eq",
                    value: part.part
                  }
                }
              });
            case 1:
              cost_result = _context12.v;
              if (cost_result.success && (_cost_result$data = cost_result.data) !== null && _cost_result$data !== void 0 && _cost_result$data[0]) {
                onUpdate(index, 'price', cost_result.data[0].lstc || 0);
              }

              // Fetch virtual inventory
              onFetchInventory(part.part);
            case 2:
              return _context12.a(2);
          }
        }, _callee12);
      }));
      return function (_x10) {
        return _ref19.apply(this, arguments);
      };
    }()),
    api_call: api_call,
    readonly: is_readonly
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label small mb-1"
  }, "Description"), /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: line.description || line.pdesc || '',
    onChange: function onChange(e) {
      return onUpdate(index, 'description', e.target.value);
    },
    placeholder: "Part description",
    readOnly: is_readonly
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-1"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label small mb-1"
  }, "Qty"), /*#__PURE__*/external_React_default().createElement("input", {
    type: "number",
    className: "form-control form-control-sm",
    value: line.quantity || line.pqty || 0,
    onChange: function onChange(e) {
      return onUpdate(index, 'quantity', parseFloat(e.target.value) || 0);
    },
    min: "0",
    step: "1",
    readOnly: is_readonly
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-1"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label small mb-1"
  }, "Price"), /*#__PURE__*/external_React_default().createElement("input", {
    type: "number",
    className: "form-control form-control-sm",
    value: line.price || line.pprce || 0,
    onChange: function onChange(e) {
      return onUpdate(index, 'price', parseFloat(e.target.value) || 0);
    },
    min: "0",
    step: "0.01",
    readOnly: is_readonly
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-1"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label small mb-1"
  }, "Disc"), /*#__PURE__*/external_React_default().createElement("input", {
    type: "number",
    className: "form-control form-control-sm",
    value: line.discount || line.pdisc || 0,
    onChange: function onChange(e) {
      return onUpdate(index, 'discount', parseFloat(e.target.value) || 0);
    },
    min: "0",
    readOnly: is_readonly
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-1"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label small mb-1"
  }, "Extended"), /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: "$".concat((line.extended || line.pext || 0).toFixed(2)),
    readOnly: true
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/external_React_default().createElement("label", {
    className: "form-label small mb-1"
  }, "Expected Date"), /*#__PURE__*/external_React_default().createElement("input", {
    type: "date",
    className: "form-control form-control-sm",
    value: line.erd || '',
    onChange: function onChange(e) {
      return onUpdate(index, 'erd', e.target.value);
    },
    readOnly: is_readonly
  }))), virtualInventory && virtualInventory.length > 0 && /*#__PURE__*/external_React_default().createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "card border-secondary"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "card-header py-2"
  }, /*#__PURE__*/external_React_default().createElement("h6", {
    className: "mb-0 small"
  }, "Integrated vendor inventory availability")), /*#__PURE__*/external_React_default().createElement("div", {
    className: "card-body p-2"
  }, inventoryLoading ? /*#__PURE__*/external_React_default().createElement("div", {
    className: "text-center py-2"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "spinner-border spinner-border-sm text-primary",
    role: "status"
  }, /*#__PURE__*/external_React_default().createElement("span", {
    className: "visually-hidden"
  }, "Loading...")), /*#__PURE__*/external_React_default().createElement("span", {
    className: "ms-2 small text-muted"
  }, "Loading inventory...")) : /*#__PURE__*/external_React_default().createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/external_React_default().createElement("table", {
    className: "table table-sm table-hover table-striped mb-0"
  }, /*#__PURE__*/external_React_default().createElement("thead", null, /*#__PURE__*/external_React_default().createElement("tr", null, /*#__PURE__*/external_React_default().createElement("th", null, "Company"), /*#__PURE__*/external_React_default().createElement("th", null, "Location"), /*#__PURE__*/external_React_default().createElement("th", null, "Qty"), /*#__PURE__*/external_React_default().createElement("th", {
    style: {
      width: '80px'
    }
  }, "Action"))), /*#__PURE__*/external_React_default().createElement("tbody", null, virtualInventory.map(function (item, idx) {
    return /*#__PURE__*/external_React_default().createElement("tr", {
      key: idx
    }, /*#__PURE__*/external_React_default().createElement("td", {
      className: "fw-bold"
    }, (item.company || '').toUpperCase()), /*#__PURE__*/external_React_default().createElement("td", null, item.loc || ''), /*#__PURE__*/external_React_default().createElement("td", null, item.qty || 0), /*#__PURE__*/external_React_default().createElement("td", null, /*#__PURE__*/external_React_default().createElement("button", {
      className: "btn btn-sm btn-primary",
      onClick: function onClick() {
        return onSelectVendor((item.company || '').toUpperCase());
      }
    }, "Use")));
  })))))))));
};
var PartSearch = function PartSearch(_ref20) {
  var value = _ref20.value,
    _onChange5 = _ref20.onChange,
    onPartSelect = _ref20.onPartSelect,
    api_call = _ref20.api_call,
    readonly = _ref20.readonly;
  var _useState41 = (0,external_React_namespaceObject.useState)(value),
    _useState42 = _slicedToArray(_useState41, 2),
    searchTerm = _useState42[0],
    setSearchTerm = _useState42[1];
  var _useState43 = (0,external_React_namespaceObject.useState)([]),
    _useState44 = _slicedToArray(_useState43, 2),
    suggestions = _useState44[0],
    setSuggestions = _useState44[1];
  var _useState45 = (0,external_React_namespaceObject.useState)(false),
    _useState46 = _slicedToArray(_useState45, 2),
    showDropdown = _useState46[0],
    setShowDropdown = _useState46[1];
  var _useState47 = (0,external_React_namespaceObject.useState)(false),
    _useState48 = _slicedToArray(_useState47, 2),
    loading = _useState48[0],
    setLoading = _useState48[1];
  (0,external_React_namespaceObject.useEffect)(function () {
    setSearchTerm(value);
  }, [value]);
  var search_parts = /*#__PURE__*/function () {
    var _ref21 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(term) {
      var result;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            if (!(term.length < 2)) {
              _context13.n = 1;
              break;
            }
            setSuggestions([]);
            return _context13.a(2);
          case 1:
            setLoading(true);
            _context13.n = 2;
            return api_call('list', 'JADVDATA_dbo_part_meta', {
              return_columns: ["part", "inventory_description"],
              order: [{
                column: 0,
                dir: 'asc'
              }],
              columns: [{
                name: 'part'
              }, {
                name: 'inventory_description'
              }],
              filters: {
                part: {
                  operator: "ilike",
                  value: term
                }
              }
            });
          case 2:
            result = _context13.v;
            if (result.success && result.data) {
              setSuggestions(result.data.slice(0, 20));
            }
            setLoading(false);
          case 3:
            return _context13.a(2);
        }
      }, _callee13);
    }));
    return function search_parts(_x11) {
      return _ref21.apply(this, arguments);
    };
  }();
  (0,external_React_namespaceObject.useEffect)(function () {
    var timer = setTimeout(function () {
      if (searchTerm && searchTerm !== value) {
        search_parts(searchTerm);
      }
    }, 300);
    return function () {
      return clearTimeout(timer);
    };
  }, [searchTerm]);
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: "position-relative"
  }, /*#__PURE__*/external_React_default().createElement("input", {
    type: "text",
    className: "form-control form-control-sm",
    value: searchTerm,
    onChange: function onChange(e) {
      setSearchTerm(e.target.value);
      _onChange5(e.target.value);
      setShowDropdown(true);
    },
    onFocus: function onFocus() {
      return setShowDropdown(true);
    },
    onBlur: function onBlur() {
      return setTimeout(function () {
        return setShowDropdown(false);
      }, 200);
    },
    placeholder: "Search...",
    readOnly: readonly
  }), showDropdown && suggestions.length > 0 && /*#__PURE__*/external_React_default().createElement("div", {
    className: "position-absolute top-100 start-0 w-100 bg-white border rounded shadow-sm mt-1",
    style: {
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 1050
    }
  }, suggestions.map(function (part) {
    return /*#__PURE__*/external_React_default().createElement("div", {
      key: part.part,
      className: "p-2 hover-bg-light cursor-pointer",
      onClick: function onClick() {
        onPartSelect(part);
        setSearchTerm(part.part);
        setShowDropdown(false);
      }
    }, part.part, " - ", part.inventory_description);
  })));
};
var ReceiveModal = function ReceiveModal(_ref22) {
  var lines = _ref22.lines,
    onClose = _ref22.onClose,
    onReceive = _ref22.onReceive;
  var _useState49 = (0,external_React_namespaceObject.useState)(new Set()),
    _useState50 = _slicedToArray(_useState49, 2),
    selected = _useState50[0],
    setSelected = _useState50[1];
  var receivable_lines = lines.map(function (line, index) {
    return {
      line: line,
      index: index
    };
  }).filter(function (_ref23) {
    var line = _ref23.line;
    return parseFloat(line.rqty || line.received_qty || 0) === 0;
  });
  if (receivable_lines.length === 0) {
    return /*#__PURE__*/external_React_default().createElement("div", {
      className: "modal d-block",
      style: {
        backgroundColor: 'rgba(0,0,0,0.5)'
      }
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "modal-dialog"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "modal-content"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "modal-header"
    }, /*#__PURE__*/external_React_default().createElement("h5", {
      className: "modal-title"
    }, "Receive Purchase Order Lines"), /*#__PURE__*/external_React_default().createElement("button", {
      type: "button",
      className: "btn-close",
      onClick: onClose
    })), /*#__PURE__*/external_React_default().createElement("div", {
      className: "modal-body"
    }, /*#__PURE__*/external_React_default().createElement("p", {
      className: "text-muted"
    }, "All lines have been received.")), /*#__PURE__*/external_React_default().createElement("div", {
      className: "modal-footer"
    }, /*#__PURE__*/external_React_default().createElement("button", {
      type: "button",
      className: "btn btn-secondary",
      onClick: onClose
    }, "Close")))));
  }
  var toggle_all = function toggle_all() {
    if (selected.size === receivable_lines.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(receivable_lines.map(function (_ref24) {
        var index = _ref24.index;
        return index;
      })));
    }
  };
  var toggle_line = function toggle_line(index) {
    var new_selected = new Set(selected);
    if (new_selected.has(index)) {
      new_selected["delete"](index);
    } else {
      new_selected.add(index);
    }
    setSelected(new_selected);
  };
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: "modal d-block",
    style: {
      backgroundColor: 'rgba(0,0,0,0.5)'
    }
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "modal-dialog modal-lg"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/external_React_default().createElement("h5", {
    className: "modal-title"
  }, "Receive Purchase Order Lines"), /*#__PURE__*/external_React_default().createElement("button", {
    type: "button",
    className: "btn-close",
    onClick: onClose
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/external_React_default().createElement("p", {
    className: "text-muted"
  }, "Select which lines to receive. Each selected line will be fully received."), /*#__PURE__*/external_React_default().createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/external_React_default().createElement("table", {
    className: "table"
  }, /*#__PURE__*/external_React_default().createElement("thead", null, /*#__PURE__*/external_React_default().createElement("tr", null, /*#__PURE__*/external_React_default().createElement("th", {
    width: "50"
  }, /*#__PURE__*/external_React_default().createElement("input", {
    type: "checkbox",
    className: "form-check-input",
    checked: selected.size === receivable_lines.length,
    onChange: toggle_all
  })), /*#__PURE__*/external_React_default().createElement("th", null, "Line"), /*#__PURE__*/external_React_default().createElement("th", null, "Part"), /*#__PURE__*/external_React_default().createElement("th", null, "Description"), /*#__PURE__*/external_React_default().createElement("th", null, "Quantity"))), /*#__PURE__*/external_React_default().createElement("tbody", null, receivable_lines.map(function (_ref25) {
    var line = _ref25.line,
      index = _ref25.index;
    return /*#__PURE__*/external_React_default().createElement("tr", {
      key: index
    }, /*#__PURE__*/external_React_default().createElement("td", null, /*#__PURE__*/external_React_default().createElement("input", {
      type: "checkbox",
      className: "form-check-input",
      checked: selected.has(index),
      onChange: function onChange() {
        return toggle_line(index);
      }
    })), /*#__PURE__*/external_React_default().createElement("td", null, index + 1), /*#__PURE__*/external_React_default().createElement("td", null, line.pcode || line.part || ''), /*#__PURE__*/external_React_default().createElement("td", null, line.pdesc || line.description || ''), /*#__PURE__*/external_React_default().createElement("td", null, line.pqty || line.quantity || 0));
  }))))), /*#__PURE__*/external_React_default().createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/external_React_default().createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/external_React_default().createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: function onClick() {
      return onReceive(Array.from(selected));
    },
    disabled: selected.size === 0
  }, "Receive Selected Lines (", selected.size, ")")))));
};

// Helper functions
function get_default_header(config) {
  var today = new Date().toISOString().split('T')[0];
  var expected_date = new Date();
  expected_date.setDate(expected_date.getDate() + 2);
  return {
    vendor_code: '',
    vendor_name: '',
    order_date: today,
    expected_receipt_date: expected_date.toISOString().split('T')[0],
    location: config.location || 'TAC',
    entered_by: '',
    orderd_by_customer: '',
    terms: '',
    ship_via: 'UPS',
    freight: 0.0,
    subtotal: 0.0,
    tax_amount: 0.0,
    total: 0.0,
    printed: false,
    billing: {
      name: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA'
    },
    shipping: {
      name: '',
      attention: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA'
    }
  };
}
function clean_po_data(data) {
  if (data.lines) {
    data.lines = data.lines.map(function (line) {
      if (line.msg) {
        var clean_msg = line.msg.split('\x00')[0].trim();
        line.msg = clean_msg;
      }
      ['gla', 'gldpta', 'tskcod', 'cat'].forEach(function (field) {
        if (line[field] && typeof line[field] === 'string') {
          line[field] = line[field].replace(/\x00/g, '').trim();
        }
      });
      return line;
    });
  }
  return {
    header: data.header || {},
    lines: data.lines || [],
    source_info: data.source_info || {}
  };
}
function map_header_data(header) {
  return {
    vendor_code: header.vndcod || header.vendor_code || '',
    vendor_name: header.vndnme || header.vendor_name || '',
    order_date: format_date(header.orddte || header.order_date),
    expected_receipt_date: format_date(header.erd || header.expected_receipt_date),
    location: header.loc || header.location || 'TAC',
    entered_by: header.entby || header.entered_by || '',
    terms: header.termd || header.terms || '',
    ship_via: header.shpvia || header.ship_via || 'UPS',
    freight: parseFloat(header.frght || header.freight || 0),
    subtotal: parseFloat(header.subtot || header.subtotal || 0),
    tax_amount: parseFloat(header.taxamt || header.tax_amount || 0),
    total: parseFloat(header.total || 0),
    printed: header.prtd === 'Y' || header.printed || false,
    orderd_by_customer: header.obycus || '',
    billing: {
      name: header.vndnme || header.vendor_name || '',
      address1: header.vnda1 || '',
      address2: header.vnda2 || '',
      city: header.vndcty || '',
      state: header.vndst || '',
      zip: header.vndzip || '',
      country: header.vndctry || 'USA'
    },
    shipping: {
      name: header.shpnme || '',
      attention: header.shpatn || '',
      address1: header.shpa1 || '',
      address2: header.shpa2 || '',
      city: header.shpcty || '',
      state: header.shpst || '',
      zip: header.shpzip || '',
      country: header.shpctry || 'USA'
    }
  };
}
function format_date(date) {
  if (!date) return '';
  if (typeof date === 'string') return date;
  if (date.year && date.month && date.day) {
    var year = date.year;
    var month = String(date.month).padStart(2, '0');
    var day = String(date.day).padStart(2, '0');
    return "".concat(year, "-").concat(month, "-").concat(day);
  }
  return '';
}

// Add CSS styles
var styles = "\n    .hover-bg-light:hover {\n        background-color: #f8f9fa;\n    }\n    .cursor-pointer {\n        cursor: pointer;\n    }\n";

// Add styles to head
if (typeof document !== 'undefined') {
  var style_element = document.createElement('style');
  style_element.textContent = styles;
  document.head.appendChild(style_element);
}
/* harmony default export */ const PurchaseOrderBuilder = (PurchaseOrder);
window["components/PurchaseOrderBuilder"] = __webpack_exports__["default"];
/******/ })()
;
//# sourceMappingURL=PurchaseOrderBuilder.bundle.js.map