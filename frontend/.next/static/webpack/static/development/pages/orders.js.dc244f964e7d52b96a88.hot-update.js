webpackHotUpdate("static\\development\\pages\\orders.js",{

/***/ "./components/Orders.js":
/*!******************************!*\
  !*** ./components/Orders.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_apollo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-apollo */ "./node_modules/react-apollo/react-apollo.browser.umd.js");
/* harmony import */ var react_apollo__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_apollo__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _styles_OrderItemStyles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles/OrderItemStyles */ "./components/styles/OrderItemStyles.js");
var _jsxFileName = "C:\\Users\\Paul\\Documents\\Coding Stuff\\VSCode\\Wes Bos Advanced React\\Advanced-React\\sick-fits\\frontend\\components\\Orders.js";


function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  query ALL_ORDERS_QUERY {\n    orders {\n      id\n      total\n      createdAt\n      items {\n        image\n      }\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }




var ALL_ORDERS_QUERY = graphql_tag__WEBPACK_IMPORTED_MODULE_2___default()(_templateObject());

var Orders = function Orders(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_apollo__WEBPACK_IMPORTED_MODULE_1__["Query"], {
    query: ALL_ORDERS_QUERY,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: this
  }, function (_ref) {
    var data = _ref.data,
        loading = _ref.loading,
        error = _ref.error;
    console.log(data);
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_styles_OrderItemStyles__WEBPACK_IMPORTED_MODULE_3__["default"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 24
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 25
      },
      __self: this
    }, "Orders"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 26
      },
      __self: this
    }, data.orders.map(function (order) {
      react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 28
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        src: order.items[0].image,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 29
        },
        __self: this
      }));
    })));
  });
};

/* harmony default export */ __webpack_exports__["default"] = (Orders);

/***/ })

})
//# sourceMappingURL=orders.js.dc244f964e7d52b96a88.hot-update.js.map