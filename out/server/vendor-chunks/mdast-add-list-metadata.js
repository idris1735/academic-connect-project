/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/mdast-add-list-metadata";
exports.ids = ["vendor-chunks/mdast-add-list-metadata"];
exports.modules = {

/***/ "(ssr)/./node_modules/mdast-add-list-metadata/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/mdast-add-list-metadata/index.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var visitWithParents = __webpack_require__(/*! unist-util-visit-parents */ \"(ssr)/./node_modules/mdast-add-list-metadata/node_modules/unist-util-visit-parents/index.js\");\n\nfunction addListMetadata() {\n  return function (ast) {\n    visitWithParents(ast, 'list', function (listNode, parents) {\n      var depth = 0, i, n;\n      for (i = 0, n = parents.length; i < n; i++) {\n        if (parents[i].type === 'list') depth += 1;\n      }\n      for (i = 0, n = listNode.children.length; i < n; i++) {\n        var child = listNode.children[i];\n        child.index = i;\n        child.ordered = listNode.ordered;\n      }\n      listNode.depth = depth;\n    });\n    return ast;\n  };\n}\n\nmodule.exports = addListMetadata;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWRhc3QtYWRkLWxpc3QtbWV0YWRhdGEvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUEsdUJBQXVCLG1CQUFPLENBQUMsNkhBQTBCOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxPQUFPO0FBQzdDO0FBQ0E7QUFDQSxnREFBZ0QsT0FBTztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsiL2hvbWUvcmd0ZWNoMDA4L2FjYWRlbWljLWNvbm5lY3QtcHJvamVjdC9ub2RlX21vZHVsZXMvbWRhc3QtYWRkLWxpc3QtbWV0YWRhdGEvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHZpc2l0V2l0aFBhcmVudHMgPSByZXF1aXJlKCd1bmlzdC11dGlsLXZpc2l0LXBhcmVudHMnKTtcblxuZnVuY3Rpb24gYWRkTGlzdE1ldGFkYXRhKCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGFzdCkge1xuICAgIHZpc2l0V2l0aFBhcmVudHMoYXN0LCAnbGlzdCcsIGZ1bmN0aW9uIChsaXN0Tm9kZSwgcGFyZW50cykge1xuICAgICAgdmFyIGRlcHRoID0gMCwgaSwgbjtcbiAgICAgIGZvciAoaSA9IDAsIG4gPSBwYXJlbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICBpZiAocGFyZW50c1tpXS50eXBlID09PSAnbGlzdCcpIGRlcHRoICs9IDE7XG4gICAgICB9XG4gICAgICBmb3IgKGkgPSAwLCBuID0gbGlzdE5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IGxpc3ROb2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICBjaGlsZC5pbmRleCA9IGk7XG4gICAgICAgIGNoaWxkLm9yZGVyZWQgPSBsaXN0Tm9kZS5vcmRlcmVkO1xuICAgICAgfVxuICAgICAgbGlzdE5vZGUuZGVwdGggPSBkZXB0aDtcbiAgICB9KTtcbiAgICByZXR1cm4gYXN0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZExpc3RNZXRhZGF0YTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/mdast-add-list-metadata/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/mdast-add-list-metadata/node_modules/unist-util-visit-parents/index.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/mdast-add-list-metadata/node_modules/unist-util-visit-parents/index.js ***!
  \*********************************************************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/* Expose. */\nmodule.exports = visitParents\n\n/* Visit. */\nfunction visitParents(tree, type, visitor) {\n  var stack = []\n\n  if (typeof type === 'function') {\n    visitor = type\n    type = null\n  }\n\n  one(tree)\n\n  /* Visit a single node. */\n  function one(node) {\n    var result\n\n    if (!type || node.type === type) {\n      result = visitor(node, stack.concat())\n    }\n\n    if (node.children && result !== false) {\n      return all(node.children, node)\n    }\n\n    return result\n  }\n\n  /* Visit children in `parent`. */\n  function all(children, parent) {\n    var length = children.length\n    var index = -1\n    var child\n\n    stack.push(parent)\n\n    while (++index < length) {\n      child = children[index]\n\n      if (child && one(child) === false) {\n        return false\n      }\n    }\n\n    stack.pop()\n\n    return true\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWRhc3QtYWRkLWxpc3QtbWV0YWRhdGEvbm9kZV9tb2R1bGVzL3VuaXN0LXV0aWwtdmlzaXQtcGFyZW50cy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBWTs7QUFFWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9ob21lL3JndGVjaDAwOC9hY2FkZW1pYy1jb25uZWN0LXByb2plY3Qvbm9kZV9tb2R1bGVzL21kYXN0LWFkZC1saXN0LW1ldGFkYXRhL25vZGVfbW9kdWxlcy91bmlzdC11dGlsLXZpc2l0LXBhcmVudHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbi8qIEV4cG9zZS4gKi9cbm1vZHVsZS5leHBvcnRzID0gdmlzaXRQYXJlbnRzXG5cbi8qIFZpc2l0LiAqL1xuZnVuY3Rpb24gdmlzaXRQYXJlbnRzKHRyZWUsIHR5cGUsIHZpc2l0b3IpIHtcbiAgdmFyIHN0YWNrID0gW11cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2aXNpdG9yID0gdHlwZVxuICAgIHR5cGUgPSBudWxsXG4gIH1cblxuICBvbmUodHJlZSlcblxuICAvKiBWaXNpdCBhIHNpbmdsZSBub2RlLiAqL1xuICBmdW5jdGlvbiBvbmUobm9kZSkge1xuICAgIHZhciByZXN1bHRcblxuICAgIGlmICghdHlwZSB8fCBub2RlLnR5cGUgPT09IHR5cGUpIHtcbiAgICAgIHJlc3VsdCA9IHZpc2l0b3Iobm9kZSwgc3RhY2suY29uY2F0KCkpXG4gICAgfVxuXG4gICAgaWYgKG5vZGUuY2hpbGRyZW4gJiYgcmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGFsbChub2RlLmNoaWxkcmVuLCBub2RlKVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qIFZpc2l0IGNoaWxkcmVuIGluIGBwYXJlbnRgLiAqL1xuICBmdW5jdGlvbiBhbGwoY2hpbGRyZW4sIHBhcmVudCkge1xuICAgIHZhciBsZW5ndGggPSBjaGlsZHJlbi5sZW5ndGhcbiAgICB2YXIgaW5kZXggPSAtMVxuICAgIHZhciBjaGlsZFxuXG4gICAgc3RhY2sucHVzaChwYXJlbnQpXG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgY2hpbGQgPSBjaGlsZHJlbltpbmRleF1cblxuICAgICAgaWYgKGNoaWxkICYmIG9uZShjaGlsZCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIHN0YWNrLnBvcCgpXG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/mdast-add-list-metadata/node_modules/unist-util-visit-parents/index.js\n");

/***/ })

};
;