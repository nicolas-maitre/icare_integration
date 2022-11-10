
// ==UserScript==
// @name        iCare GED Integration
// @namespace   Violentmonkey Scripts
// @noframes
// @match       https://icare-vali.lausanne.ch/icare/*
// @match       https://icare.lausanne.ch/icare/*
// @grant       none
// @version     1.0
// @author      Nicolas Maitre (mail privé: nmaitre@ik.me)
// @description GED Integration in icare
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/helpers/elements.ts":
/*!*********************************!*\
  !*** ./src/helpers/elements.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addElement": () => (/* binding */ addElement),
/* harmony export */   "createElem": () => (/* binding */ createElem),
/* harmony export */   "e": () => (/* binding */ e),
/* harmony export */   "waitForSelector": () => (/* binding */ waitForSelector)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function createElem(type, props, ...children) {
    //:HTMLElementTagNameMap[ElemType]
    const el = document.createElement(type);
    Object.entries(props !== null && props !== void 0 ? props : {}).forEach(([name, val]) => {
        if (name === "dataset") {
            Object.assign(el[name], val);
        }
        else if (name === "style") {
            Object.entries(val).forEach(([k, v]) => {
                if (el.style[k] !== undefined)
                    el.style[k] = v;
                else
                    el.style.setProperty(k, v);
            });
        }
        else if (name === "bindTo") {
            const bindRef = val;
            bindRef.current = el;
        }
        else if (name === "attributes") {
            Object.entries(val).forEach(([attrName, attrVal]) => {
                el.setAttribute(attrName, attrVal);
            });
        }
        else {
            el[name] = val;
        }
    });
    el.append(...children);
    return el;
}
function addElement(parent, type, props, ...children) {
    const el = createElem(type, props, ...children);
    parent.appendChild(el);
    return el;
}
function e(elem) {
    function addElem(type, props, ...children) {
        return addElement(elem, type, props, ...children);
    }
    return { elem, addElem };
}
function waitForSelector(selector, checkInterval = 100, maxChecks = 50) {
    const res = typeof selector === "function"
        ? selector()
        : document.querySelector(selector);
    return new Promise((resolve, reject) => {
        if (res === null) {
            if (maxChecks <= 0) {
                reject(new Error(`can't find element ${selector.toString()}`));
                return;
            }
            setTimeout(() => waitForSelector(selector, checkInterval, maxChecks - 1)
                // @ts-ignore because all html elements inherit from HTMLElement anyways
                .then(resolve)
                .catch(reject), checkInterval);
        }
        else {
            resolve(res);
        }
    });
}
function waitForValue(getter, checkInterval = 100, maxChecks = 50) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield getter();
        return new Promise((resolve) => {
            if (res === undefined) {
                if (maxChecks <= 0) {
                    resolve(undefined);
                    return;
                }
                setTimeout(() => waitForValue(getter, checkInterval, maxChecks - 1).then(resolve), checkInterval);
            }
            else {
                resolve(res);
            }
        });
    });
}
/**
 * @param minCount minimum count of returned elements
 */
function waitForSelectorAll(selector, minCount = 1, checkInterval = 100, maxChecks = 50) {
    console.log("waitForSelectorAll", maxChecks);
    const res = typeof selector === "function"
        ? selector()
        : document.querySelectorAll(selector);
    return new Promise((resolve, reject) => {
        if (res.length < minCount) {
            if (maxChecks <= 0) {
                reject(new Error(`can't find elements ${selector.toString()}`));
                return;
            }
            setTimeout(() => waitForSelectorAll(selector, minCount, checkInterval, maxChecks - 1)
                .then(resolve)
                .catch(reject), checkInterval);
        }
        else {
            resolve(res);
        }
    });
}


/***/ }),

/***/ "./src/helpers/url.ts":
/*!****************************!*\
  !*** ./src/helpers/url.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "urlCheck": () => (/* binding */ urlCheck),
/* harmony export */   "urlCheckOrGo": () => (/* binding */ urlCheckOrGo)
/* harmony export */ });
/**
 * checks for correct url or goes there
 */
function urlCheckOrGo(url, exclude) {
    if (urlCheck(url, exclude))
        return true;
    window.location.href = url;
    return false;
}
function urlCheck(url, exclude) {
    if (typeof url === "string")
        url = [url];
    if (exclude && window.location.href.includes(exclude))
        return false;
    return url.some((u) => window.location.href.includes(u));
}


/***/ }),

/***/ "./src/index.user.ts":
/*!***************************!*\
  !*** ./src/index.user.ts ***!
  \***************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/elements */ "./src/helpers/elements.ts");
/* harmony import */ var _helpers_url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/url */ "./src/helpers/url.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


try {
    await (() => __awaiter(void 0, void 0, void 0, function* () {
        if (!(0,_helpers_url__WEBPACK_IMPORTED_MODULE_1__.urlCheck)("/icare/Be/VertragEdit.do"))
            return;
        const tabList = yield (0,_helpers_elements__WEBPACK_IMPORTED_MODULE_0__.waitForSelector)("ul[role=tablist]");
        (0,_helpers_elements__WEBPACK_IMPORTED_MODULE_0__.e)(tabList).addElem("li", {
            className: "ui-tabs-tab ui-corner-top ui-state-default ui-tab",
            style: {
                cursor: "pointer",
            },
            ariaSelected: "false",
            ariaExpanded: "false",
            tabIndex: -1,
            attributes: {
                role: "tab",
                "aria-controls": "ui-id-17",
                "aria-labelledby": "ui-id-17",
            },
        }, (0,_helpers_elements__WEBPACK_IMPORTED_MODULE_0__.createElem)("a", {
            id: "ui-id-17",
            className: "ui-tabs-anchor",
            tabIndex: -1,
            attributes: {
                role: "presentation",
            },
        }, "Documents"
        // createElem("i", {className: "fa fa-external-link-alt"})
        ));
    }))();
}
catch (e) {
    console.error("An error occured", e);
}
console.info("ged icare integration loaded");

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && !queue.d) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = 1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && (queue.d = 0);
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.user.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFnRCxhQUFhO1dBQzdEOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2hlbHBlcnMvZWxlbWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hlbHBlcnMvdXJsLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC51c2VyLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2FzeW5jIG1vZHVsZSIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgQmluZFJlZjxUPiB7XHJcbiAgY3VycmVudD86IFQ7XHJcbn1cclxuXHJcbnR5cGUgRWxlbVByb3BzPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4gPSBQYXJ0aWFsPFxyXG4gIE9taXQ8VCwgXCJzdHlsZVwiIHwgXCJhdHRyaWJ1dGVzXCI+XHJcbj4gJiB7XHJcbiAgLy8gUmVjb3JkPHN0cmluZywgYW55PiAmXHJcbiAgYmluZFRvPzogQmluZFJlZjxUPjtcclxuICBzdHlsZT86IFBhcnRpYWw8VFtcInN0eWxlXCJdICYgUmVjb3JkPGAtLSR7c3RyaW5nfWAsIHN0cmluZz4+O1xyXG4gIC8qKlxyXG4gICAqIFJhdyBodG1sIGF0dHJpYnV0ZXNcclxuICAgKi9cclxuICBhdHRyaWJ1dGVzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcclxufTtcclxudHlwZSBFbGVtUmVhbFByb3BzPFQgZXh0ZW5kcyBFbGVtVHlwZT4gPSBFbGVtUHJvcHM8XHJcbiAgSFRNTEVsZW1lbnRUYWdOYW1lTWFwW1RdXHJcbj4gfCBudWxsO1xyXG5cclxudHlwZSBFbGVtVHlwZSA9IGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcDtcclxudHlwZSBDaGlsZEVsZW0gPSBFbGVtZW50IHwgc3RyaW5nO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW08VCBleHRlbmRzIEVsZW1UeXBlPihcclxuICB0eXBlOiBULFxyXG4gIHByb3BzPzogRWxlbVJlYWxQcm9wczxUPixcclxuICAuLi5jaGlsZHJlbjogQ2hpbGRFbGVtW11cclxuKSB7XHJcbiAgLy86SFRNTEVsZW1lbnRUYWdOYW1lTWFwW0VsZW1UeXBlXVxyXG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcclxuICBPYmplY3QuZW50cmllcyhwcm9wcyA/PyB7fSkuZm9yRWFjaCgoW25hbWUsIHZhbF0pID0+IHtcclxuICAgIGlmIChuYW1lID09PSBcImRhdGFzZXRcIikge1xyXG4gICAgICBPYmplY3QuYXNzaWduKGVsW25hbWVdLCB2YWwpO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBcInN0eWxlXCIpIHtcclxuICAgICAgT2JqZWN0LmVudHJpZXModmFsIGFzIENTU1N0eWxlRGVjbGFyYXRpb24pLmZvckVhY2goKFtrLCB2XSkgPT4ge1xyXG4gICAgICAgIGlmIChlbC5zdHlsZVtrIGFzIGFueV0gIT09IHVuZGVmaW5lZCkgZWwuc3R5bGVbayBhcyBhbnldID0gdjtcclxuICAgICAgICBlbHNlIGVsLnN0eWxlLnNldFByb3BlcnR5KGssIHYpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gXCJiaW5kVG9cIikge1xyXG4gICAgICBjb25zdCBiaW5kUmVmID0gdmFsIGFzIEJpbmRSZWY8dHlwZW9mIGVsPjtcclxuICAgICAgYmluZFJlZi5jdXJyZW50ID0gZWw7XHJcbiAgICB9IGVsc2UgaWYgKG5hbWUgPT09IFwiYXR0cmlidXRlc1wiKSB7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKHZhbCBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KS5mb3JFYWNoKFxyXG4gICAgICAgIChbYXR0ck5hbWUsIGF0dHJWYWxdKSA9PiB7XHJcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIChlbCBhcyBhbnkpW25hbWVdID0gdmFsO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBlbC5hcHBlbmQoLi4uY2hpbGRyZW4pO1xyXG5cclxuICByZXR1cm4gZWw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRFbGVtZW50PFQgZXh0ZW5kcyBFbGVtVHlwZT4oXHJcbiAgcGFyZW50OiBFbGVtZW50LFxyXG4gIHR5cGU6IFQsXHJcbiAgcHJvcHM/OiBFbGVtUmVhbFByb3BzPFQ+LFxyXG4gIC4uLmNoaWxkcmVuOiBDaGlsZEVsZW1bXVxyXG4pIHtcclxuICBjb25zdCBlbCA9IGNyZWF0ZUVsZW0odHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKTtcclxuICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gIHJldHVybiBlbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGUoZWxlbTogRWxlbWVudCkge1xyXG4gIGZ1bmN0aW9uIGFkZEVsZW08VCBleHRlbmRzIEVsZW1UeXBlPihcclxuICAgIHR5cGU6IFQsXHJcbiAgICBwcm9wcz86IEVsZW1SZWFsUHJvcHM8VD4sXHJcbiAgICAuLi5jaGlsZHJlbjogQ2hpbGRFbGVtW11cclxuICApIHtcclxuICAgIHJldHVybiBhZGRFbGVtZW50KGVsZW0sIHR5cGUsIHByb3BzLCAuLi5jaGlsZHJlbik7XHJcbiAgfVxyXG4gIHJldHVybiB7IGVsZW0sIGFkZEVsZW0gfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3JTZWxlY3RvcjxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KFxyXG4gIHNlbGVjdG9yOiBzdHJpbmcgfCAoKCkgPT4gVCB8IG51bGwpLFxyXG4gIGNoZWNrSW50ZXJ2YWwgPSAxMDAsXHJcbiAgbWF4Q2hlY2tzID0gNTBcclxuKTogUHJvbWlzZTxUPiB7XHJcbiAgY29uc3QgcmVzOiBUIHwgbnVsbCA9XHJcbiAgICB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIlxyXG4gICAgICA/IHNlbGVjdG9yKClcclxuICAgICAgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGlmIChyZXMgPT09IG51bGwpIHtcclxuICAgICAgaWYgKG1heENoZWNrcyA8PSAwKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgY2FuJ3QgZmluZCBlbGVtZW50ICR7c2VsZWN0b3IudG9TdHJpbmcoKX1gKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgKCkgPT5cclxuICAgICAgICAgIHdhaXRGb3JTZWxlY3RvcihzZWxlY3RvciwgY2hlY2tJbnRlcnZhbCwgbWF4Q2hlY2tzIC0gMSlcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBiZWNhdXNlIGFsbCBodG1sIGVsZW1lbnRzIGluaGVyaXQgZnJvbSBIVE1MRWxlbWVudCBhbnl3YXlzXHJcbiAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXHJcbiAgICAgICAgICAgIC5jYXRjaChyZWplY3QpLFxyXG4gICAgICAgIGNoZWNrSW50ZXJ2YWxcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc29sdmUocmVzKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gd2FpdEZvclZhbHVlPFQ+KFxyXG4gIGdldHRlcjogKCkgPT4gKFQgfCB1bmRlZmluZWQpIHwgUHJvbWlzZTxUIHwgdW5kZWZpbmVkPixcclxuICBjaGVja0ludGVydmFsID0gMTAwLFxyXG4gIG1heENoZWNrcyA9IDUwXHJcbik6IFByb21pc2U8VCB8IHVuZGVmaW5lZD4ge1xyXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGdldHRlcigpO1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgaWYgKHJlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGlmIChtYXhDaGVja3MgPD0gMCkge1xyXG4gICAgICAgIHJlc29sdmUodW5kZWZpbmVkKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAoKSA9PiB3YWl0Rm9yVmFsdWUoZ2V0dGVyLCBjaGVja0ludGVydmFsLCBtYXhDaGVja3MgLSAxKS50aGVuKHJlc29sdmUpLFxyXG4gICAgICAgIGNoZWNrSW50ZXJ2YWxcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc29sdmUocmVzKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBtaW5Db3VudCBtaW5pbXVtIGNvdW50IG9mIHJldHVybmVkIGVsZW1lbnRzXHJcbiAqL1xyXG5mdW5jdGlvbiB3YWl0Rm9yU2VsZWN0b3JBbGwoXHJcbiAgc2VsZWN0b3I6IHN0cmluZyB8ICgoKSA9PiBOb2RlTGlzdE9mPEVsZW1lbnQ+KSxcclxuICBtaW5Db3VudCA9IDEsXHJcbiAgY2hlY2tJbnRlcnZhbCA9IDEwMCxcclxuICBtYXhDaGVja3MgPSA1MFxyXG4pOiBQcm9taXNlPE5vZGVMaXN0T2Y8RWxlbWVudD4+IHtcclxuICBjb25zb2xlLmxvZyhcIndhaXRGb3JTZWxlY3RvckFsbFwiLCBtYXhDaGVja3MpO1xyXG4gIGNvbnN0IHJlcyA9XHJcbiAgICB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIlxyXG4gICAgICA/IHNlbGVjdG9yKClcclxuICAgICAgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuXHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGlmIChyZXMubGVuZ3RoIDwgbWluQ291bnQpIHtcclxuICAgICAgaWYgKG1heENoZWNrcyA8PSAwKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgY2FuJ3QgZmluZCBlbGVtZW50cyAke3NlbGVjdG9yLnRvU3RyaW5nKCl9YCkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICgpID0+XHJcbiAgICAgICAgICB3YWl0Rm9yU2VsZWN0b3JBbGwoc2VsZWN0b3IsIG1pbkNvdW50LCBjaGVja0ludGVydmFsLCBtYXhDaGVja3MgLSAxKVxyXG4gICAgICAgICAgICAudGhlbihyZXNvbHZlKVxyXG4gICAgICAgICAgICAuY2F0Y2gocmVqZWN0KSxcclxuICAgICAgICBjaGVja0ludGVydmFsXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXNvbHZlKHJlcyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuIiwiLyoqXHJcbiAqIGNoZWNrcyBmb3IgY29ycmVjdCB1cmwgb3IgZ29lcyB0aGVyZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHVybENoZWNrT3JHbyh1cmw6IHN0cmluZywgZXhjbHVkZT86IHN0cmluZykge1xyXG4gIGlmICh1cmxDaGVjayh1cmwsIGV4Y2x1ZGUpKSByZXR1cm4gdHJ1ZTtcclxuICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cmxDaGVjayh1cmw6IHN0cmluZyB8IHN0cmluZ1tdLCBleGNsdWRlPzogc3RyaW5nKSB7XHJcbiAgaWYgKHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIpIHVybCA9IFt1cmxdO1xyXG4gIGlmIChleGNsdWRlICYmIHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKGV4Y2x1ZGUpKSByZXR1cm4gZmFsc2U7XHJcbiAgcmV0dXJuIHVybC5zb21lKCh1KSA9PiB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyh1KSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbSwgZSwgd2FpdEZvclNlbGVjdG9yIH0gZnJvbSBcIi4vaGVscGVycy9lbGVtZW50c1wiO1xyXG5pbXBvcnQgeyB1cmxDaGVjayB9IGZyb20gXCIuL2hlbHBlcnMvdXJsXCI7XHJcbnRyeSB7XHJcbiAgYXdhaXQgKGFzeW5jICgpID0+IHtcclxuICAgIGlmICghdXJsQ2hlY2soXCIvaWNhcmUvQmUvVmVydHJhZ0VkaXQuZG9cIikpIHJldHVybjtcclxuICAgIGNvbnN0IHRhYkxpc3QgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3IoXCJ1bFtyb2xlPXRhYmxpc3RdXCIpO1xyXG5cclxuICAgIGUodGFiTGlzdCkuYWRkRWxlbShcclxuICAgICAgXCJsaVwiLFxyXG4gICAgICB7XHJcbiAgICAgICAgY2xhc3NOYW1lOiBcInVpLXRhYnMtdGFiIHVpLWNvcm5lci10b3AgdWktc3RhdGUtZGVmYXVsdCB1aS10YWJcIixcclxuICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFyaWFTZWxlY3RlZDogXCJmYWxzZVwiLFxyXG4gICAgICAgIGFyaWFFeHBhbmRlZDogXCJmYWxzZVwiLFxyXG4gICAgICAgIHRhYkluZGV4OiAtMSxcclxuICAgICAgICBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICByb2xlOiBcInRhYlwiLFxyXG4gICAgICAgICAgXCJhcmlhLWNvbnRyb2xzXCI6IFwidWktaWQtMTdcIixcclxuICAgICAgICAgIFwiYXJpYS1sYWJlbGxlZGJ5XCI6IFwidWktaWQtMTdcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBjcmVhdGVFbGVtKFxyXG4gICAgICAgIFwiYVwiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiBcInVpLWlkLTE3XCIsXHJcbiAgICAgICAgICBjbGFzc05hbWU6IFwidWktdGFicy1hbmNob3JcIixcclxuICAgICAgICAgIHRhYkluZGV4OiAtMSxcclxuICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgcm9sZTogXCJwcmVzZW50YXRpb25cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkRvY3VtZW50c1wiXHJcbiAgICAgICAgLy8gY3JlYXRlRWxlbShcImlcIiwge2NsYXNzTmFtZTogXCJmYSBmYS1leHRlcm5hbC1saW5rLWFsdFwifSlcclxuICAgICAgKVxyXG4gICAgKTtcclxuICB9KSgpO1xyXG59IGNhdGNoIChlKSB7XHJcbiAgY29uc29sZS5lcnJvcihcIkFuIGVycm9yIG9jY3VyZWRcIiwgZSk7XHJcbn1cclxuY29uc29sZS5pbmZvKFwiZ2VkIGljYXJlIGludGVncmF0aW9uIGxvYWRlZFwiKTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsInZhciB3ZWJwYWNrUXVldWVzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBxdWV1ZXNcIikgOiBcIl9fd2VicGFja19xdWV1ZXNfX1wiO1xudmFyIHdlYnBhY2tFeHBvcnRzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBleHBvcnRzXCIpIDogXCJfX3dlYnBhY2tfZXhwb3J0c19fXCI7XG52YXIgd2VicGFja0Vycm9yID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBlcnJvclwiKSA6IFwiX193ZWJwYWNrX2Vycm9yX19cIjtcbnZhciByZXNvbHZlUXVldWUgPSAocXVldWUpID0+IHtcblx0aWYocXVldWUgJiYgIXF1ZXVlLmQpIHtcblx0XHRxdWV1ZS5kID0gMTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSkpO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tID8gZm4ucisrIDogZm4oKSkpO1xuXHR9XG59XG52YXIgd3JhcERlcHMgPSAoZGVwcykgPT4gKGRlcHMubWFwKChkZXApID0+IHtcblx0aWYoZGVwICE9PSBudWxsICYmIHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpIHtcblx0XHRpZihkZXBbd2VicGFja1F1ZXVlc10pIHJldHVybiBkZXA7XG5cdFx0aWYoZGVwLnRoZW4pIHtcblx0XHRcdHZhciBxdWV1ZSA9IFtdO1xuXHRcdFx0cXVldWUuZCA9IDA7XG5cdFx0XHRkZXAudGhlbigocikgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0V4cG9ydHNdID0gcjtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0sIChlKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXJyb3JdID0gZTtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0pO1xuXHRcdFx0dmFyIG9iaiA9IHt9O1xuXHRcdFx0b2JqW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAoZm4ocXVldWUpKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fVxuXHR9XG5cdHZhciByZXQgPSB7fTtcblx0cmV0W3dlYnBhY2tRdWV1ZXNdID0geCA9PiB7fTtcblx0cmV0W3dlYnBhY2tFeHBvcnRzXSA9IGRlcDtcblx0cmV0dXJuIHJldDtcbn0pKTtcbl9fd2VicGFja19yZXF1aXJlX18uYSA9IChtb2R1bGUsIGJvZHksIGhhc0F3YWl0KSA9PiB7XG5cdHZhciBxdWV1ZTtcblx0aGFzQXdhaXQgJiYgKChxdWV1ZSA9IFtdKS5kID0gMSk7XG5cdHZhciBkZXBRdWV1ZXMgPSBuZXcgU2V0KCk7XG5cdHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBjdXJyZW50RGVwcztcblx0dmFyIG91dGVyUmVzb2x2ZTtcblx0dmFyIHJlamVjdDtcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG5cdFx0cmVqZWN0ID0gcmVqO1xuXHRcdG91dGVyUmVzb2x2ZSA9IHJlc29sdmU7XG5cdH0pO1xuXHRwcm9taXNlW3dlYnBhY2tFeHBvcnRzXSA9IGV4cG9ydHM7XG5cdHByb21pc2Vbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChxdWV1ZSAmJiBmbihxdWV1ZSksIGRlcFF1ZXVlcy5mb3JFYWNoKGZuKSwgcHJvbWlzZVtcImNhdGNoXCJdKHggPT4ge30pKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlO1xuXHRib2R5KChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHR2YXIgZm47XG5cdFx0dmFyIGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblx0XHRcdGlmKGRbd2VicGFja0Vycm9yXSkgdGhyb3cgZFt3ZWJwYWNrRXJyb3JdO1xuXHRcdFx0cmV0dXJuIGRbd2VicGFja0V4cG9ydHNdO1xuXHRcdH0pKVxuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGZuID0gKCkgPT4gKHJlc29sdmUoZ2V0UmVzdWx0KSk7XG5cdFx0XHRmbi5yID0gMDtcblx0XHRcdHZhciBmblF1ZXVlID0gKHEpID0+IChxICE9PSBxdWV1ZSAmJiAhZGVwUXVldWVzLmhhcyhxKSAmJiAoZGVwUXVldWVzLmFkZChxKSwgcSAmJiAhcS5kICYmIChmbi5yKyssIHEucHVzaChmbikpKSk7XG5cdFx0XHRjdXJyZW50RGVwcy5tYXAoKGRlcCkgPT4gKGRlcFt3ZWJwYWNrUXVldWVzXShmblF1ZXVlKSkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmbi5yID8gcHJvbWlzZSA6IGdldFJlc3VsdCgpO1xuXHR9LCAoZXJyKSA9PiAoKGVyciA/IHJlamVjdChwcm9taXNlW3dlYnBhY2tFcnJvcl0gPSBlcnIpIDogb3V0ZXJSZXNvbHZlKGV4cG9ydHMpKSwgcmVzb2x2ZVF1ZXVlKHF1ZXVlKSkpO1xuXHRxdWV1ZSAmJiAocXVldWUuZCA9IDApO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnVzZXIudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=