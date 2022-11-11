
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
    function thisAddElem(type, props, ...children) {
        return addElement(elem, type, props, ...children);
    }
    function thisWaitForSelector(selector, options) {
        return waitForSelector(selector, Object.assign(Object.assign({}, options), { parent: elem }));
    }
    return {
        elem,
        addElem: thisAddElem,
        waitForSelector: thisWaitForSelector,
    };
}
function waitForSelector(selector, { parent, checkInterval = 100, maxChecks = 50 } = {}) {
    const res = typeof selector === "function"
        ? selector()
        : (parent !== null && parent !== void 0 ? parent : document).querySelector(selector);
    return new Promise((resolve, reject) => {
        if (res === null) {
            if (maxChecks <= 0) {
                reject(new Error(`can't find element ${selector.toString()}`));
                return;
            }
            setTimeout(() => waitForSelector(selector, { checkInterval, maxChecks: maxChecks - 1 })
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
        var _a;
        //Check for contract page
        if (!(0,_helpers_url__WEBPACK_IMPORTED_MODULE_1__.urlCheck)("/icare/Be/VertragEdit.do"))
            return;
        const tabsContainer = yield (0,_helpers_elements__WEBPACK_IMPORTED_MODULE_0__.waitForSelector)("#tabs");
        const tabList = yield (0,_helpers_elements__WEBPACK_IMPORTED_MODULE_0__.e)(tabsContainer).waitForSelector("ul[role=tablist]");
        const otherTabListLIs = [...tabList.querySelectorAll("li")];
        otherTabListLIs.forEach((li) => {
            li.addEventListener("click", onDeselectDocsTab);
        });
        const docTabLI = (0,_helpers_elements__WEBPACK_IMPORTED_MODULE_0__.e)(tabList).addElem("li", {
            className: "ui-tabs-tab ui-corner-top ui-state-default ui-tab",
            style: {
                cursor: "pointer",
            },
            tabIndex: -1,
            attributes: {
                role: "tab",
                "aria-selected": "false",
                "aria-expanded": "false",
                "aria-controls": "ui-id-docs-content",
                "aria-labelledby": "ui-id-docs-tab",
            },
            onclick: onSelectDocsTab,
        }, (0,_helpers_elements__WEBPACK_IMPORTED_MODULE_0__.createElem)("a", {
            id: "ui-id-docs-tab",
            className: "ui-tabs-anchor",
            tabIndex: -1,
            attributes: {
                role: "presentation",
            },
        }, "Documents"));
        //MANAGE TAB STATE
        let lastSelectedLI = (_a = tabList.querySelector("li.ui-tabs-active.ui-state-active")) !== null && _a !== void 0 ? _a : undefined;
        function onSelectDocsTab(evt) {
            setVisualTab(docTabLI, true);
            if (lastSelectedLI)
                setVisualTab(lastSelectedLI, false);
            const lastTabContentDiv = getLITabContent(lastSelectedLI);
            if (lastTabContentDiv)
                setVisualTabContent(lastTabContentDiv, false);
            setVisualTabContent(docTabContentDiv, true);
        }
        function onDeselectDocsTab(evt) {
            if (evt.currentTarget === lastSelectedLI) {
                const lastTabContentDiv = getLITabContent(lastSelectedLI);
                if (lastTabContentDiv)
                    setVisualTabContent(lastTabContentDiv, true);
                setVisualTab(lastSelectedLI, true);
            }
            else {
                lastSelectedLI = evt.currentTarget;
            }
            setVisualTab(docTabLI, false);
            setVisualTabContent(docTabContentDiv, false);
        }
        function setVisualTab(elem, state) {
            elem.classList[state ? "add" : "remove"]("ui-tabs-active", "ui-state-active");
            elem.setAttribute("aria-selected", state ? "true" : "false");
            elem.setAttribute("aria-expanded", state ? "true" : "false");
        }
        function setVisualTabContent(elem, state) {
            elem.style.display = state ? "" : "none";
            elem.setAttribute("aria-hidden", state ? "false" : "true");
        }
        function getLITabContent(elem) {
            var _a;
            const tabContentId = elem === null || elem === void 0 ? void 0 : elem.getAttribute("aria-controls");
            if (tabContentId) {
                return ((_a = tabsContainer.querySelector(`div#${tabContentId}`)) !== null && _a !== void 0 ? _a : undefined);
            }
            return undefined;
        }
        const docTabContentDiv = (0,_helpers_elements__WEBPACK_IMPORTED_MODULE_0__.e)(tabsContainer).addElem("div", {
            id: "ui-id-doc-content",
            className: "ui-tabs-panel ui-corner-bottom ui-widget-content",
            attributes: {
                "aria-live": "polite",
                "aria-labelledby": "ui-id-doc-tab",
                "aria-hidden": "true",
                role: "tabpanel",
            },
            style: { display: "none" },
        }, (0,_helpers_elements__WEBPACK_IMPORTED_MODULE_0__.createElem)("br"), (0,_helpers_elements__WEBPACK_IMPORTED_MODULE_0__.createElem)("i", { className: "fa fa-exclamation-triangle" }), " L'onglet \"Documents\" ne fait pas partie de kibe-iCare et n'est pas maintenu par CSE");
        //TODO: dev
        // onSelectDocsTab();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TyxDQUFDLEVBQUU7SUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDO0NBQ3RDO0FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOzs7Ozs7Ozs7VUN4SDdDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsSUFBSTtXQUNKO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsQ0FBQztXQUNEO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7V0FDQSxzR0FBc0c7V0FDdEc7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBLEVBQUU7V0FDRjtXQUNBOzs7OztXQ2hFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9oZWxwZXJzL2VsZW1lbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9oZWxwZXJzL3VybC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudXNlci50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9hc3luYyBtb2R1bGUiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIEJpbmRSZWY8VD4ge1xyXG4gIGN1cnJlbnQ/OiBUO1xyXG59XHJcblxyXG50eXBlIEVsZW1Qcm9wczxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0gUGFydGlhbDxcclxuICBPbWl0PFQsIFwic3R5bGVcIiB8IFwiYXR0cmlidXRlc1wiPlxyXG4+ICYge1xyXG4gIC8vIFJlY29yZDxzdHJpbmcsIGFueT4gJlxyXG4gIGJpbmRUbz86IEJpbmRSZWY8VD47XHJcbiAgc3R5bGU/OiBQYXJ0aWFsPFRbXCJzdHlsZVwiXSAmIFJlY29yZDxgLS0ke3N0cmluZ31gLCBzdHJpbmc+PjtcclxuICAvKipcclxuICAgKiBSYXcgaHRtbCBhdHRyaWJ1dGVzXHJcbiAgICovXHJcbiAgYXR0cmlidXRlcz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XHJcbn07XHJcbnR5cGUgRWxlbVJlYWxQcm9wczxUIGV4dGVuZHMgRWxlbVR5cGU+ID0gRWxlbVByb3BzPFxyXG4gIEhUTUxFbGVtZW50VGFnTmFtZU1hcFtUXVxyXG4+IHwgbnVsbDtcclxuXHJcbnR5cGUgRWxlbVR5cGUgPSBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA7XHJcbnR5cGUgQ2hpbGRFbGVtID0gRWxlbWVudCB8IHN0cmluZztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtPFQgZXh0ZW5kcyBFbGVtVHlwZT4oXHJcbiAgdHlwZTogVCxcclxuICBwcm9wcz86IEVsZW1SZWFsUHJvcHM8VD4sXHJcbiAgLi4uY2hpbGRyZW46IENoaWxkRWxlbVtdXHJcbikge1xyXG4gIC8vOkhUTUxFbGVtZW50VGFnTmFtZU1hcFtFbGVtVHlwZV1cclxuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XHJcbiAgT2JqZWN0LmVudHJpZXMocHJvcHMgPz8ge30pLmZvckVhY2goKFtuYW1lLCB2YWxdKSA9PiB7XHJcbiAgICBpZiAobmFtZSA9PT0gXCJkYXRhc2V0XCIpIHtcclxuICAgICAgT2JqZWN0LmFzc2lnbihlbFtuYW1lXSwgdmFsKTtcclxuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gXCJzdHlsZVwiKSB7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKHZhbCBhcyBDU1NTdHlsZURlY2xhcmF0aW9uKS5mb3JFYWNoKChbaywgdl0pID0+IHtcclxuICAgICAgICBpZiAoZWwuc3R5bGVbayBhcyBhbnldICE9PSB1bmRlZmluZWQpIGVsLnN0eWxlW2sgYXMgYW55XSA9IHY7XHJcbiAgICAgICAgZWxzZSBlbC5zdHlsZS5zZXRQcm9wZXJ0eShrLCB2KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKG5hbWUgPT09IFwiYmluZFRvXCIpIHtcclxuICAgICAgY29uc3QgYmluZFJlZiA9IHZhbCBhcyBCaW5kUmVmPHR5cGVvZiBlbD47XHJcbiAgICAgIGJpbmRSZWYuY3VycmVudCA9IGVsO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBcImF0dHJpYnV0ZXNcIikge1xyXG4gICAgICBPYmplY3QuZW50cmllcyh2YWwgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPikuZm9yRWFjaChcclxuICAgICAgICAoW2F0dHJOYW1lLCBhdHRyVmFsXSkgPT4ge1xyXG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAoZWwgYXMgYW55KVtuYW1lXSA9IHZhbDtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgZWwuYXBwZW5kKC4uLmNoaWxkcmVuKTtcclxuXHJcbiAgcmV0dXJuIGVsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkRWxlbWVudDxUIGV4dGVuZHMgRWxlbVR5cGU+KFxyXG4gIHBhcmVudDogRWxlbWVudCxcclxuICB0eXBlOiBULFxyXG4gIHByb3BzPzogRWxlbVJlYWxQcm9wczxUPixcclxuICAuLi5jaGlsZHJlbjogQ2hpbGRFbGVtW11cclxuKSB7XHJcbiAgY29uc3QgZWwgPSBjcmVhdGVFbGVtKHR5cGUsIHByb3BzLCAuLi5jaGlsZHJlbik7XHJcbiAgcGFyZW50LmFwcGVuZENoaWxkKGVsKTtcclxuICByZXR1cm4gZWw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlKGVsZW06IEVsZW1lbnQpIHtcclxuICBmdW5jdGlvbiB0aGlzQWRkRWxlbTxUIGV4dGVuZHMgRWxlbVR5cGU+KFxyXG4gICAgdHlwZTogVCxcclxuICAgIHByb3BzPzogRWxlbVJlYWxQcm9wczxUPixcclxuICAgIC4uLmNoaWxkcmVuOiBDaGlsZEVsZW1bXVxyXG4gICkge1xyXG4gICAgcmV0dXJuIGFkZEVsZW1lbnQoZWxlbSwgdHlwZSwgcHJvcHMsIC4uLmNoaWxkcmVuKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gdGhpc1dhaXRGb3JTZWxlY3RvcjxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KFxyXG4gICAgc2VsZWN0b3I6IHN0cmluZyB8ICgoKSA9PiBUIHwgbnVsbCksXHJcbiAgICBvcHRpb25zPzogT21pdDxXYWl0Rm9yU2VsZWN0b3JPcHRpb25zLCBcInBhcmVudFwiPlxyXG4gICkge1xyXG4gICAgcmV0dXJuIHdhaXRGb3JTZWxlY3RvcihzZWxlY3RvciwgeyAuLi5vcHRpb25zLCBwYXJlbnQ6IGVsZW0gfSk7XHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBlbGVtLFxyXG4gICAgYWRkRWxlbTogdGhpc0FkZEVsZW0sXHJcbiAgICB3YWl0Rm9yU2VsZWN0b3I6IHRoaXNXYWl0Rm9yU2VsZWN0b3IsXHJcbiAgfTtcclxufVxyXG5cclxuaW50ZXJmYWNlIFdhaXRGb3JTZWxlY3Rvck9wdGlvbnMge1xyXG4gIHBhcmVudD86IEVsZW1lbnQ7XHJcbiAgY2hlY2tJbnRlcnZhbD86IG51bWJlcjtcclxuICBtYXhDaGVja3M/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yU2VsZWN0b3I8VCBleHRlbmRzIEhUTUxFbGVtZW50PihcclxuICBzZWxlY3Rvcjogc3RyaW5nIHwgKCgpID0+IFQgfCBudWxsKSxcclxuICB7IHBhcmVudCwgY2hlY2tJbnRlcnZhbCA9IDEwMCwgbWF4Q2hlY2tzID0gNTAgfTogV2FpdEZvclNlbGVjdG9yT3B0aW9ucyA9IHt9XHJcbik6IFByb21pc2U8VD4ge1xyXG4gIGNvbnN0IHJlczogVCB8IG51bGwgPVxyXG4gICAgdHlwZW9mIHNlbGVjdG9yID09PSBcImZ1bmN0aW9uXCJcclxuICAgICAgPyBzZWxlY3RvcigpXHJcbiAgICAgIDogKHBhcmVudCA/PyBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblxyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBpZiAocmVzID09PSBudWxsKSB7XHJcbiAgICAgIGlmIChtYXhDaGVja3MgPD0gMCkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYGNhbid0IGZpbmQgZWxlbWVudCAke3NlbGVjdG9yLnRvU3RyaW5nKCl9YCkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICgpID0+XHJcbiAgICAgICAgICB3YWl0Rm9yU2VsZWN0b3Ioc2VsZWN0b3IsIHsgY2hlY2tJbnRlcnZhbCwgbWF4Q2hlY2tzOiBtYXhDaGVja3MgLSAxIH0pXHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgYmVjYXVzZSBhbGwgaHRtbCBlbGVtZW50cyBpbmhlcml0IGZyb20gSFRNTEVsZW1lbnQgYW55d2F5c1xyXG4gICAgICAgICAgICAudGhlbihyZXNvbHZlKVxyXG4gICAgICAgICAgICAuY2F0Y2gocmVqZWN0KSxcclxuICAgICAgICBjaGVja0ludGVydmFsXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXNvbHZlKHJlcyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JWYWx1ZTxUPihcclxuICBnZXR0ZXI6ICgpID0+IChUIHwgdW5kZWZpbmVkKSB8IFByb21pc2U8VCB8IHVuZGVmaW5lZD4sXHJcbiAgY2hlY2tJbnRlcnZhbCA9IDEwMCxcclxuICBtYXhDaGVja3MgPSA1MFxyXG4pOiBQcm9taXNlPFQgfCB1bmRlZmluZWQ+IHtcclxuICBjb25zdCByZXMgPSBhd2FpdCBnZXR0ZXIoKTtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgIGlmIChyZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAobWF4Q2hlY2tzIDw9IDApIHtcclxuICAgICAgICByZXNvbHZlKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgKCkgPT4gd2FpdEZvclZhbHVlKGdldHRlciwgY2hlY2tJbnRlcnZhbCwgbWF4Q2hlY2tzIC0gMSkudGhlbihyZXNvbHZlKSxcclxuICAgICAgICBjaGVja0ludGVydmFsXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXNvbHZlKHJlcyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gbWluQ291bnQgbWluaW11bSBjb3VudCBvZiByZXR1cm5lZCBlbGVtZW50c1xyXG4gKi9cclxuZnVuY3Rpb24gd2FpdEZvclNlbGVjdG9yQWxsKFxyXG4gIHNlbGVjdG9yOiBzdHJpbmcgfCAoKCkgPT4gTm9kZUxpc3RPZjxFbGVtZW50PiksXHJcbiAgbWluQ291bnQgPSAxLFxyXG4gIGNoZWNrSW50ZXJ2YWwgPSAxMDAsXHJcbiAgbWF4Q2hlY2tzID0gNTBcclxuKTogUHJvbWlzZTxOb2RlTGlzdE9mPEVsZW1lbnQ+PiB7XHJcbiAgY29uc29sZS5sb2coXCJ3YWl0Rm9yU2VsZWN0b3JBbGxcIiwgbWF4Q2hlY2tzKTtcclxuICBjb25zdCByZXMgPVxyXG4gICAgdHlwZW9mIHNlbGVjdG9yID09PSBcImZ1bmN0aW9uXCJcclxuICAgICAgPyBzZWxlY3RvcigpXHJcbiAgICAgIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcblxyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBpZiAocmVzLmxlbmd0aCA8IG1pbkNvdW50KSB7XHJcbiAgICAgIGlmIChtYXhDaGVja3MgPD0gMCkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYGNhbid0IGZpbmQgZWxlbWVudHMgJHtzZWxlY3Rvci50b1N0cmluZygpfWApKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAoKSA9PlxyXG4gICAgICAgICAgd2FpdEZvclNlbGVjdG9yQWxsKHNlbGVjdG9yLCBtaW5Db3VudCwgY2hlY2tJbnRlcnZhbCwgbWF4Q2hlY2tzIC0gMSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSlcclxuICAgICAgICAgICAgLmNhdGNoKHJlamVjdCksXHJcbiAgICAgICAgY2hlY2tJbnRlcnZhbFxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzb2x2ZShyZXMpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcbiIsIi8qKlxyXG4gKiBjaGVja3MgZm9yIGNvcnJlY3QgdXJsIG9yIGdvZXMgdGhlcmVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB1cmxDaGVja09yR28odXJsOiBzdHJpbmcsIGV4Y2x1ZGU/OiBzdHJpbmcpIHtcclxuICBpZiAodXJsQ2hlY2sodXJsLCBleGNsdWRlKSkgcmV0dXJuIHRydWU7XHJcbiAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXJsQ2hlY2sodXJsOiBzdHJpbmcgfCBzdHJpbmdbXSwgZXhjbHVkZT86IHN0cmluZykge1xyXG4gIGlmICh0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiKSB1cmwgPSBbdXJsXTtcclxuICBpZiAoZXhjbHVkZSAmJiB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhleGNsdWRlKSkgcmV0dXJuIGZhbHNlO1xyXG4gIHJldHVybiB1cmwuc29tZSgodSkgPT4gd2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXModSkpO1xyXG59XHJcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW0sIGUsIHdhaXRGb3JTZWxlY3RvciB9IGZyb20gXCIuL2hlbHBlcnMvZWxlbWVudHNcIjtcclxuaW1wb3J0IHsgdXJsQ2hlY2sgfSBmcm9tIFwiLi9oZWxwZXJzL3VybFwiO1xyXG5cclxudHJ5IHtcclxuICBhd2FpdCAoYXN5bmMgKCkgPT4ge1xyXG4gICAgLy9DaGVjayBmb3IgY29udHJhY3QgcGFnZVxyXG4gICAgaWYgKCF1cmxDaGVjayhcIi9pY2FyZS9CZS9WZXJ0cmFnRWRpdC5kb1wiKSkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHRhYnNDb250YWluZXIgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3IoXCIjdGFic1wiKTtcclxuICAgIGNvbnN0IHRhYkxpc3QgPSBhd2FpdCBlKHRhYnNDb250YWluZXIpLndhaXRGb3JTZWxlY3RvcihcInVsW3JvbGU9dGFibGlzdF1cIik7XHJcbiAgICBjb25zdCBvdGhlclRhYkxpc3RMSXMgPSBbLi4udGFiTGlzdC5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIildO1xyXG5cclxuICAgIG90aGVyVGFiTGlzdExJcy5mb3JFYWNoKChsaSkgPT4ge1xyXG4gICAgICBsaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb25EZXNlbGVjdERvY3NUYWIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZG9jVGFiTEkgPSBlKHRhYkxpc3QpLmFkZEVsZW0oXHJcbiAgICAgIFwibGlcIixcclxuICAgICAge1xyXG4gICAgICAgIGNsYXNzTmFtZTogXCJ1aS10YWJzLXRhYiB1aS1jb3JuZXItdG9wIHVpLXN0YXRlLWRlZmF1bHQgdWktdGFiXCIsXHJcbiAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0YWJJbmRleDogLTEsXHJcbiAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgcm9sZTogXCJ0YWJcIixcclxuICAgICAgICAgIFwiYXJpYS1zZWxlY3RlZFwiOiBcImZhbHNlXCIsXHJcbiAgICAgICAgICBcImFyaWEtZXhwYW5kZWRcIjogXCJmYWxzZVwiLFxyXG4gICAgICAgICAgXCJhcmlhLWNvbnRyb2xzXCI6IFwidWktaWQtZG9jcy1jb250ZW50XCIsXHJcbiAgICAgICAgICBcImFyaWEtbGFiZWxsZWRieVwiOiBcInVpLWlkLWRvY3MtdGFiXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbmNsaWNrOiBvblNlbGVjdERvY3NUYWIsXHJcbiAgICAgIH0sXHJcbiAgICAgIGNyZWF0ZUVsZW0oXHJcbiAgICAgICAgXCJhXCIsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IFwidWktaWQtZG9jcy10YWJcIixcclxuICAgICAgICAgIGNsYXNzTmFtZTogXCJ1aS10YWJzLWFuY2hvclwiLFxyXG4gICAgICAgICAgdGFiSW5kZXg6IC0xLFxyXG4gICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICByb2xlOiBcInByZXNlbnRhdGlvblwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiRG9jdW1lbnRzXCJcclxuICAgICAgKVxyXG4gICAgKTtcclxuXHJcbiAgICAvL01BTkFHRSBUQUIgU1RBVEVcclxuICAgIGxldCBsYXN0U2VsZWN0ZWRMSSA9XHJcbiAgICAgIHRhYkxpc3QucXVlcnlTZWxlY3RvcjxIVE1MTElFbGVtZW50PihcclxuICAgICAgICBcImxpLnVpLXRhYnMtYWN0aXZlLnVpLXN0YXRlLWFjdGl2ZVwiXHJcbiAgICAgICkgPz8gdW5kZWZpbmVkO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9uU2VsZWN0RG9jc1RhYihldnQ/OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgIHNldFZpc3VhbFRhYihkb2NUYWJMSSwgdHJ1ZSk7XHJcbiAgICAgIGlmIChsYXN0U2VsZWN0ZWRMSSkgc2V0VmlzdWFsVGFiKGxhc3RTZWxlY3RlZExJLCBmYWxzZSk7XHJcblxyXG4gICAgICBjb25zdCBsYXN0VGFiQ29udGVudERpdiA9IGdldExJVGFiQ29udGVudChsYXN0U2VsZWN0ZWRMSSk7XHJcbiAgICAgIGlmIChsYXN0VGFiQ29udGVudERpdikgc2V0VmlzdWFsVGFiQ29udGVudChsYXN0VGFiQ29udGVudERpdiwgZmFsc2UpO1xyXG4gICAgICBzZXRWaXN1YWxUYWJDb250ZW50KGRvY1RhYkNvbnRlbnREaXYsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gb25EZXNlbGVjdERvY3NUYWIoZXZ0OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgIGlmIChldnQuY3VycmVudFRhcmdldCA9PT0gbGFzdFNlbGVjdGVkTEkpIHtcclxuICAgICAgICBjb25zdCBsYXN0VGFiQ29udGVudERpdiA9IGdldExJVGFiQ29udGVudChsYXN0U2VsZWN0ZWRMSSk7XHJcbiAgICAgICAgaWYgKGxhc3RUYWJDb250ZW50RGl2KSBzZXRWaXN1YWxUYWJDb250ZW50KGxhc3RUYWJDb250ZW50RGl2LCB0cnVlKTtcclxuICAgICAgICBzZXRWaXN1YWxUYWIobGFzdFNlbGVjdGVkTEksIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxhc3RTZWxlY3RlZExJID0gZXZ0LmN1cnJlbnRUYXJnZXQgYXMgSFRNTExJRWxlbWVudDtcclxuICAgICAgfVxyXG4gICAgICBzZXRWaXN1YWxUYWIoZG9jVGFiTEksIGZhbHNlKTtcclxuICAgICAgc2V0VmlzdWFsVGFiQ29udGVudChkb2NUYWJDb250ZW50RGl2LCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0VmlzdWFsVGFiKGVsZW06IEhUTUxMSUVsZW1lbnQsIHN0YXRlOiBib29sZWFuKSB7XHJcbiAgICAgIGVsZW0uY2xhc3NMaXN0W3N0YXRlID8gXCJhZGRcIiA6IFwicmVtb3ZlXCJdKFxyXG4gICAgICAgIFwidWktdGFicy1hY3RpdmVcIixcclxuICAgICAgICBcInVpLXN0YXRlLWFjdGl2ZVwiXHJcbiAgICAgICk7XHJcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwiYXJpYS1zZWxlY3RlZFwiLCBzdGF0ZSA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcclxuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIHN0YXRlID8gXCJ0cnVlXCIgOiBcImZhbHNlXCIpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gc2V0VmlzdWFsVGFiQ29udGVudChlbGVtOiBIVE1MRGl2RWxlbWVudCwgc3RhdGU6IGJvb2xlYW4pIHtcclxuICAgICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gc3RhdGUgPyBcIlwiIDogXCJub25lXCI7XHJcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgc3RhdGUgPyBcImZhbHNlXCIgOiBcInRydWVcIik7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBnZXRMSVRhYkNvbnRlbnQoZWxlbTogSFRNTExJRWxlbWVudCB8IHVuZGVmaW5lZCkge1xyXG4gICAgICBjb25zdCB0YWJDb250ZW50SWQgPSBlbGVtPy5nZXRBdHRyaWJ1dGUoXCJhcmlhLWNvbnRyb2xzXCIpO1xyXG4gICAgICBpZiAodGFiQ29udGVudElkKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIHRhYnNDb250YWluZXIucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oYGRpdiMke3RhYkNvbnRlbnRJZH1gKSA/P1xyXG4gICAgICAgICAgdW5kZWZpbmVkXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRvY1RhYkNvbnRlbnREaXYgPSBlKHRhYnNDb250YWluZXIpLmFkZEVsZW0oXHJcbiAgICAgIFwiZGl2XCIsXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogXCJ1aS1pZC1kb2MtY29udGVudFwiLFxyXG4gICAgICAgIGNsYXNzTmFtZTogXCJ1aS10YWJzLXBhbmVsIHVpLWNvcm5lci1ib3R0b20gdWktd2lkZ2V0LWNvbnRlbnRcIixcclxuICAgICAgICBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICBcImFyaWEtbGl2ZVwiOiBcInBvbGl0ZVwiLFxyXG4gICAgICAgICAgXCJhcmlhLWxhYmVsbGVkYnlcIjogXCJ1aS1pZC1kb2MtdGFiXCIsXHJcbiAgICAgICAgICBcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwiLFxyXG4gICAgICAgICAgcm9sZTogXCJ0YWJwYW5lbFwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3R5bGU6IHsgZGlzcGxheTogXCJub25lXCIgfSxcclxuICAgICAgfSxcclxuICAgICAgY3JlYXRlRWxlbShcImJyXCIpLFxyXG4gICAgICBjcmVhdGVFbGVtKFwiaVwiLCB7IGNsYXNzTmFtZTogXCJmYSBmYS1leGNsYW1hdGlvbi10cmlhbmdsZVwiIH0pLFxyXG4gICAgICBcIiBMJ29uZ2xldCBcXFwiRG9jdW1lbnRzXFxcIiBuZSBmYWl0IHBhcyBwYXJ0aWUgZGUga2liZS1pQ2FyZSBldCBuJ2VzdCBwYXMgbWFpbnRlbnUgcGFyIENTRVwiXHJcbiAgICApO1xyXG5cclxuICAgIC8vVE9ETzogZGV2XHJcbiAgICAvLyBvblNlbGVjdERvY3NUYWIoKTtcclxuICB9KSgpO1xyXG59IGNhdGNoIChlKSB7XHJcbiAgY29uc29sZS5lcnJvcihcIkFuIGVycm9yIG9jY3VyZWRcIiwgZSk7XHJcbn1cclxuY29uc29sZS5pbmZvKFwiZ2VkIGljYXJlIGludGVncmF0aW9uIGxvYWRlZFwiKTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsInZhciB3ZWJwYWNrUXVldWVzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBxdWV1ZXNcIikgOiBcIl9fd2VicGFja19xdWV1ZXNfX1wiO1xudmFyIHdlYnBhY2tFeHBvcnRzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBleHBvcnRzXCIpIDogXCJfX3dlYnBhY2tfZXhwb3J0c19fXCI7XG52YXIgd2VicGFja0Vycm9yID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBlcnJvclwiKSA6IFwiX193ZWJwYWNrX2Vycm9yX19cIjtcbnZhciByZXNvbHZlUXVldWUgPSAocXVldWUpID0+IHtcblx0aWYocXVldWUgJiYgIXF1ZXVlLmQpIHtcblx0XHRxdWV1ZS5kID0gMTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSkpO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tID8gZm4ucisrIDogZm4oKSkpO1xuXHR9XG59XG52YXIgd3JhcERlcHMgPSAoZGVwcykgPT4gKGRlcHMubWFwKChkZXApID0+IHtcblx0aWYoZGVwICE9PSBudWxsICYmIHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpIHtcblx0XHRpZihkZXBbd2VicGFja1F1ZXVlc10pIHJldHVybiBkZXA7XG5cdFx0aWYoZGVwLnRoZW4pIHtcblx0XHRcdHZhciBxdWV1ZSA9IFtdO1xuXHRcdFx0cXVldWUuZCA9IDA7XG5cdFx0XHRkZXAudGhlbigocikgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0V4cG9ydHNdID0gcjtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0sIChlKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXJyb3JdID0gZTtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0pO1xuXHRcdFx0dmFyIG9iaiA9IHt9O1xuXHRcdFx0b2JqW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAoZm4ocXVldWUpKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fVxuXHR9XG5cdHZhciByZXQgPSB7fTtcblx0cmV0W3dlYnBhY2tRdWV1ZXNdID0geCA9PiB7fTtcblx0cmV0W3dlYnBhY2tFeHBvcnRzXSA9IGRlcDtcblx0cmV0dXJuIHJldDtcbn0pKTtcbl9fd2VicGFja19yZXF1aXJlX18uYSA9IChtb2R1bGUsIGJvZHksIGhhc0F3YWl0KSA9PiB7XG5cdHZhciBxdWV1ZTtcblx0aGFzQXdhaXQgJiYgKChxdWV1ZSA9IFtdKS5kID0gMSk7XG5cdHZhciBkZXBRdWV1ZXMgPSBuZXcgU2V0KCk7XG5cdHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBjdXJyZW50RGVwcztcblx0dmFyIG91dGVyUmVzb2x2ZTtcblx0dmFyIHJlamVjdDtcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG5cdFx0cmVqZWN0ID0gcmVqO1xuXHRcdG91dGVyUmVzb2x2ZSA9IHJlc29sdmU7XG5cdH0pO1xuXHRwcm9taXNlW3dlYnBhY2tFeHBvcnRzXSA9IGV4cG9ydHM7XG5cdHByb21pc2Vbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChxdWV1ZSAmJiBmbihxdWV1ZSksIGRlcFF1ZXVlcy5mb3JFYWNoKGZuKSwgcHJvbWlzZVtcImNhdGNoXCJdKHggPT4ge30pKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlO1xuXHRib2R5KChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHR2YXIgZm47XG5cdFx0dmFyIGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblx0XHRcdGlmKGRbd2VicGFja0Vycm9yXSkgdGhyb3cgZFt3ZWJwYWNrRXJyb3JdO1xuXHRcdFx0cmV0dXJuIGRbd2VicGFja0V4cG9ydHNdO1xuXHRcdH0pKVxuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGZuID0gKCkgPT4gKHJlc29sdmUoZ2V0UmVzdWx0KSk7XG5cdFx0XHRmbi5yID0gMDtcblx0XHRcdHZhciBmblF1ZXVlID0gKHEpID0+IChxICE9PSBxdWV1ZSAmJiAhZGVwUXVldWVzLmhhcyhxKSAmJiAoZGVwUXVldWVzLmFkZChxKSwgcSAmJiAhcS5kICYmIChmbi5yKyssIHEucHVzaChmbikpKSk7XG5cdFx0XHRjdXJyZW50RGVwcy5tYXAoKGRlcCkgPT4gKGRlcFt3ZWJwYWNrUXVldWVzXShmblF1ZXVlKSkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmbi5yID8gcHJvbWlzZSA6IGdldFJlc3VsdCgpO1xuXHR9LCAoZXJyKSA9PiAoKGVyciA/IHJlamVjdChwcm9taXNlW3dlYnBhY2tFcnJvcl0gPSBlcnIpIDogb3V0ZXJSZXNvbHZlKGV4cG9ydHMpKSwgcmVzb2x2ZVF1ZXVlKHF1ZXVlKSkpO1xuXHRxdWV1ZSAmJiAocXVldWUuZCA9IDApO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnVzZXIudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=