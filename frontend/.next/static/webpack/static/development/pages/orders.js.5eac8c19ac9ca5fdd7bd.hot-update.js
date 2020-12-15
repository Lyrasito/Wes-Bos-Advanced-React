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
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! date-fns */ "./node_modules/date-fns/esm/index.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var _lib_formatMoney__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/formatMoney */ "./lib/formatMoney.js");
/* harmony import */ var _styles_OrderItemStyles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./styles/OrderItemStyles */ "./components/styles/OrderItemStyles.js");
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
var OrdersUl = styled_components__WEBPACK_IMPORTED_MODULE_5__["default"].ul.withConfig({
  displayName: "Orders__OrdersUl",
  componentId: "sc-1km0nir-0"
})(["display:grid;grid-gap:4rem;grid-template-columns:repeat(auto-fit,minmax(40%,1fr));"]);

var Orders = function Orders(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_apollo__WEBPACK_IMPORTED_MODULE_1__["Query"], {
    query: ALL_ORDERS_QUERY,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  }, function (_ref) {
    var data = _ref.data,
        loading = _ref.loading,
        error = _ref.error;
    console.log(data);
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 34
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 35
      },
      __self: this
    }, "You have ", data.orders.length, " orders."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(OrdersUl, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 36
      },
      __self: this
    }, data.orders.map(function (order) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_styles_OrderItemStyles__WEBPACK_IMPORTED_MODULE_7__["default"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        src: order.items[0].image,
        alt: order.items[0].title,
        width: "100",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 39
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(next_link__WEBPACK_IMPORTED_MODULE_4___default.a, {
        href: "/order?id=".concat(order.id),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 44
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 45
        },
        __self: this
      }, order.id)));
    })));
  });
};

/* harmony default export */ __webpack_exports__["default"] = (Orders);

/***/ })

})
//# sourceMappingURL=orders.js.5eac8c19ac9ca5fdd7bd.hot-update.js.map