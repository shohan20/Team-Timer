! function() {
    "use strict";

    function t(e, r) {
        var i;
        if (r = r || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = r.touchBoundary || 10, this.layer = e, this.tapDelay = r.tapDelay || 200, this.tapTimeout = r.tapTimeout || 700, !t.notNeeded(e)) {
            for (var o = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], u = this, a = 0, s = o.length; a < s; a++) u[o[a]] = function(t, e) {
                return function() {
                    return t.apply(e, arguments)
                }
            }(u[o[a]], u);
            n && (e.addEventListener("mouseover", this.onMouse, !0), e.addEventListener("mousedown", this.onMouse, !0), e.addEventListener("mouseup", this.onMouse, !0)), e.addEventListener("click", this.onClick, !0), e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1), e.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (e.removeEventListener = function(t, n, r) {
                var i = Node.prototype.removeEventListener;
                "click" === t ? i.call(e, t, n.hijacked || n, r) : i.call(e, t, n, r)
            }, e.addEventListener = function(t, n, r) {
                var i = Node.prototype.addEventListener;
                "click" === t ? i.call(e, t, n.hijacked || (n.hijacked = function(t) {
                    t.propagationStopped || n(t)
                }), r) : i.call(e, t, n, r)
            }), "function" == typeof e.onclick && (i = e.onclick, e.addEventListener("click", function(t) {
                i(t)
            }, !1), e.onclick = null)
        }
    }
    var e = navigator.userAgent.indexOf("Windows Phone") >= 0,
        n = navigator.userAgent.indexOf("Android") > 0 && !e,
        r = /iP(ad|hone|od)/.test(navigator.userAgent) && !e,
        i = r && /OS 4_\d(_\d)?/.test(navigator.userAgent),
        o = r && /OS [6-7]_\d/.test(navigator.userAgent),
        u = navigator.userAgent.indexOf("BB10") > 0;
    t.prototype.needsClick = function(t) {
        switch (t.nodeName.toLowerCase()) {
            case "button":
            case "select":
            case "textarea":
                if (t.disabled) return !0;
                break;
            case "input":
                if (r && "file" === t.type || t.disabled) return !0;
                break;
            case "label":
            case "iframe":
            case "video":
                return !0
        }
        return /\bneedsclick\b/.test(t.className)
    }, t.prototype.needsFocus = function(t) {
        switch (t.nodeName.toLowerCase()) {
            case "textarea":
                return !0;
            case "select":
                return !n;
            case "input":
                switch (t.type) {
                    case "button":
                    case "checkbox":
                    case "file":
                    case "image":
                    case "radio":
                    case "submit":
                        return !1
                }
                return !t.disabled && !t.readOnly;
            default:
                return /\bneedsfocus\b/.test(t.className)
        }
    }, t.prototype.sendClick = function(t, e) {
        var n, r;
        document.activeElement && document.activeElement !== t && document.activeElement.blur(), r = e.changedTouches[0], (n = document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(t), !0, !0, window, 1, r.screenX, r.screenY, r.clientX, r.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, t.dispatchEvent(n)
    }, t.prototype.determineEventType = function(t) {
        return n && "select" === t.tagName.toLowerCase() ? "mousedown" : "click"
    }, t.prototype.focus = function(t) {
        var e;
        r && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length, t.setSelectionRange(e, e)) : t.focus()
    }, t.prototype.updateScrollParent = function(t) {
        var e, n;
        if (!(e = t.fastClickScrollParent) || !e.contains(t)) {
            n = t;
            do {
                if (n.scrollHeight > n.offsetHeight) {
                    e = n, t.fastClickScrollParent = n;
                    break
                }
                n = n.parentElement
            } while (n)
        }
        e && (e.fastClickLastScrollTop = e.scrollTop)
    }, t.prototype.getTargetElementFromEventTarget = function(t) {
        return t.nodeType === Node.TEXT_NODE ? t.parentNode : t
    }, t.prototype.onTouchStart = function(t) {
        var e, n, o;
        if (t.targetTouches.length > 1) return !0;
        if (e = this.getTargetElementFromEventTarget(t.target), n = t.targetTouches[0], r) {
            if ((o = window.getSelection()).rangeCount && !o.isCollapsed) return !0;
            if (!i) {
                if (n.identifier && n.identifier === this.lastTouchIdentifier) return t.preventDefault(), !1;
                this.lastTouchIdentifier = n.identifier, this.updateScrollParent(e)
            }
        }
        return this.trackingClick = !0, this.trackingClickStart = t.timeStamp, this.targetElement = e, this.touchStartX = n.pageX, this.touchStartY = n.pageY, t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(), !0
    }, t.prototype.touchHasMoved = function(t) {
        var e = t.changedTouches[0],
            n = this.touchBoundary;
        return Math.abs(e.pageX - this.touchStartX) > n || Math.abs(e.pageY - this.touchStartY) > n
    }, t.prototype.onTouchMove = function(t) {
        return !this.trackingClick || ((this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1, this.targetElement = null), !0)
    }, t.prototype.findControl = function(t) {
        return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }, t.prototype.onTouchEnd = function(t) {
        var e, u, a, s, c, l = this.targetElement;
        if (!this.trackingClick) return !0;
        if (t.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0;
        if (t.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;
        if (this.cancelNextClick = !1, this.lastClickTime = t.timeStamp, u = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, o && (c = t.changedTouches[0], (l = document.elementFromPoint(c.pageX - window.pageXOffset, c.pageY - window.pageYOffset) || l).fastClickScrollParent = this.targetElement.fastClickScrollParent), "label" === (a = l.tagName.toLowerCase())) {
            if (e = this.findControl(l)) {
                if (this.focus(l), n) return !1;
                l = e
            }
        } else if (this.needsFocus(l)) return t.timeStamp - u > 100 || r && window.top !== window && "input" === a ? (this.targetElement = null, !1) : (this.focus(l), this.sendClick(l, t), r && "select" === a || (this.targetElement = null, t.preventDefault()), !1);
        return !(!r || i || !(s = l.fastClickScrollParent) || s.fastClickLastScrollTop === s.scrollTop) || (this.needsClick(l) || (t.preventDefault(), this.sendClick(l, t)), !1)
    }, t.prototype.onTouchCancel = function() {
        this.trackingClick = !1, this.targetElement = null
    }, t.prototype.onMouse = function(t) {
        return !(this.targetElement && !t.forwardedTouchEvent && t.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) && (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0, t.stopPropagation(), t.preventDefault(), 1))
    }, t.prototype.onClick = function(t) {
        var e;
        return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === t.target.type && 0 === t.detail || ((e = this.onMouse(t)) || (this.targetElement = null), e)
    }, t.prototype.destroy = function() {
        var t = this.layer;
        n && (t.removeEventListener("mouseover", this.onMouse, !0), t.removeEventListener("mousedown", this.onMouse, !0), t.removeEventListener("mouseup", this.onMouse, !0)), t.removeEventListener("click", this.onClick, !0), t.removeEventListener("touchstart", this.onTouchStart, !1), t.removeEventListener("touchmove", this.onTouchMove, !1), t.removeEventListener("touchend", this.onTouchEnd, !1), t.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }, t.notNeeded = function(t) {
        var e, r, i;
        if (void 0 === window.ontouchstart) return !0;
        if (r = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!n) return !0;
            if (e = document.querySelector("meta[name=viewport]")) {
                if (-1 !== e.content.indexOf("user-scalable=no")) return !0;
                if (r > 31 && document.documentElement.scrollWidth <= window.outerWidth) return !0
            }
        }
        if (u && (i = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/))[1] >= 10 && i[2] >= 3 && (e = document.querySelector("meta[name=viewport]"))) {
            if (-1 !== e.content.indexOf("user-scalable=no")) return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth) return !0
        }
        return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction || !!(+(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] >= 27 && (e = document.querySelector("meta[name=viewport]")) && (-1 !== e.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) || "none" === t.style.touchAction || "manipulation" === t.style.touchAction
    }, t.attach = function(e, n) {
        return new t(e, n)
    }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
        return t
    }) : "undefined" != typeof module && module.exports ? (module.exports = t.attach, module.exports.FastClick = t) : window.FastClick = t
}(),
    function(t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).Clipboard = t()
    }(function() {
        return function t(e, n, r) {
            function i(u, a) {
                if (!n[u]) {
                    if (!e[u]) {
                        var s = "function" == typeof require && require;
                        if (!a && s) return s(u, !0);
                        if (o) return o(u, !0);
                        var c = new Error("Cannot find module '" + u + "'");
                        throw c.code = "MODULE_NOT_FOUND", c
                    }
                    var l = n[u] = {
                        exports: {}
                    };
                    e[u][0].call(l.exports, function(t) {
                        return i(e[u][1][t] || t)
                    }, l, l.exports, t, e, n, r)
                }
                return n[u].exports
            }
            for (var o = "function" == typeof require && require, u = 0; u < r.length; u++) i(r[u]);
            return i
        }({
            1: [function(t, e, n) {
                if ("undefined" != typeof Element && !Element.prototype.matches) {
                    var r = Element.prototype;
                    r.matches = r.matchesSelector || r.mozMatchesSelector || r.msMatchesSelector || r.oMatchesSelector || r.webkitMatchesSelector
                }
                e.exports = function(t, e) {
                    for (; t && 9 !== t.nodeType;) {
                        if ("function" == typeof t.matches && t.matches(e)) return t;
                        t = t.parentNode
                    }
                }
            }, {}],
            2: [function(t, e, n) {
                function r(t, e, n, r) {
                    return function(n) {
                        n.delegateTarget = i(n.target, e), n.delegateTarget && r.call(t, n)
                    }
                }
                var i = t("./closest");
                e.exports = function(t, e, n, i, o) {
                    var u = r.apply(this, arguments);
                    return t.addEventListener(n, u, o), {
                        destroy: function() {
                            t.removeEventListener(n, u, o)
                        }
                    }
                }
            }, {
                "./closest": 1
            }],
            3: [function(t, e, n) {
                n.node = function(t) {
                    return void 0 !== t && t instanceof HTMLElement && 1 === t.nodeType
                }, n.nodeList = function(t) {
                    var e = Object.prototype.toString.call(t);
                    return void 0 !== t && ("[object NodeList]" === e || "[object HTMLCollection]" === e) && "length" in t && (0 === t.length || n.node(t[0]))
                }, n.string = function(t) {
                    return "string" == typeof t || t instanceof String
                }, n.fn = function(t) {
                    return "[object Function]" === Object.prototype.toString.call(t)
                }
            }, {}],
            4: [function(t, e, n) {
                function r(t, e, n) {
                    return t.addEventListener(e, n), {
                        destroy: function() {
                            t.removeEventListener(e, n)
                        }
                    }
                }

                function i(t, e, n) {
                    return Array.prototype.forEach.call(t, function(t) {
                        t.addEventListener(e, n)
                    }), {
                        destroy: function() {
                            Array.prototype.forEach.call(t, function(t) {
                                t.removeEventListener(e, n)
                            })
                        }
                    }
                }

                function o(t, e, n) {
                    return a(document.body, t, e, n)
                }
                var u = t("./is"),
                    a = t("delegate");
                e.exports = function(t, e, n) {
                    if (!t && !e && !n) throw new Error("Missing required arguments");
                    if (!u.string(e)) throw new TypeError("Second argument must be a String");
                    if (!u.fn(n)) throw new TypeError("Third argument must be a Function");
                    if (u.node(t)) return r(t, e, n);
                    if (u.nodeList(t)) return i(t, e, n);
                    if (u.string(t)) return o(t, e, n);
                    throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")
                }
            }, {
                "./is": 3,
                delegate: 2
            }],
            5: [function(t, e, n) {
                e.exports = function(t) {
                    var e;
                    if ("SELECT" === t.nodeName) t.focus(), e = t.value;
                    else if ("INPUT" === t.nodeName || "TEXTAREA" === t.nodeName) {
                        var n = t.hasAttribute("readonly");
                        n || t.setAttribute("readonly", ""), t.select(), t.setSelectionRange(0, t.value.length), n || t.removeAttribute("readonly"), e = t.value
                    } else {
                        t.hasAttribute("contenteditable") && t.focus();
                        var r = window.getSelection(),
                            i = document.createRange();
                        i.selectNodeContents(t), r.removeAllRanges(), r.addRange(i), e = r.toString()
                    }
                    return e
                }
            }, {}],
            6: [function(t, e, n) {
                function r() {}
                r.prototype = {
                    on: function(t, e, n) {
                        var r = this.e || (this.e = {});
                        return (r[t] || (r[t] = [])).push({
                            fn: e,
                            ctx: n
                        }), this
                    },
                    once: function(t, e, n) {
                        function r() {
                            i.off(t, r), e.apply(n, arguments)
                        }
                        var i = this;
                        return r._ = e, this.on(t, r, n)
                    },
                    emit: function(t) {
                        var e = [].slice.call(arguments, 1),
                            n = ((this.e || (this.e = {}))[t] || []).slice(),
                            r = 0,
                            i = n.length;
                        for (r; r < i; r++) n[r].fn.apply(n[r].ctx, e);
                        return this
                    },
                    off: function(t, e) {
                        var n = this.e || (this.e = {}),
                            r = n[t],
                            i = [];
                        if (r && e)
                            for (var o = 0, u = r.length; o < u; o++) r[o].fn !== e && r[o].fn._ !== e && i.push(r[o]);
                        return i.length ? n[t] = i : delete n[t], this
                    }
                }, e.exports = r
            }, {}],
            7: [function(t, e, n) {
                ! function(r, i) {
                    if (void 0 !== n) i(e, t("select"));
                    else {
                        var o = {
                            exports: {}
                        };
                        i(o, r.select), r.clipboardAction = o.exports
                    }
                }(this, function(t, e) {
                    "use strict";

                    function n(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }
                    var r = function(t) {
                            return t && t.__esModule ? t : {
                                default: t
                            }
                        }(e),
                        i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                            return typeof t
                        } : function(t) {
                            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                        },
                        o = function() {
                            function t(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }
                            return function(e, n, r) {
                                return n && t(e.prototype, n), r && t(e, r), e
                            }
                        }(),
                        u = function() {
                            function t(e) {
                                n(this, t), this.resolveOptions(e), this.initSelection()
                            }
                            return o(t, [{
                                key: "resolveOptions",
                                value: function() {
                                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                    this.action = t.action, this.container = t.container, this.emitter = t.emitter, this.target = t.target, this.text = t.text, this.trigger = t.trigger, this.selectedText = ""
                                }
                            }, {
                                key: "initSelection",
                                value: function() {
                                    this.text ? this.selectFake() : this.target && this.selectTarget()
                                }
                            }, {
                                key: "selectFake",
                                value: function() {
                                    var t = this,
                                        e = "rtl" == document.documentElement.getAttribute("dir");
                                    this.removeFake(), this.fakeHandlerCallback = function() {
                                        return t.removeFake()
                                    }, this.fakeHandler = this.container.addEventListener("click", this.fakeHandlerCallback) || !0, this.fakeElem = document.createElement("textarea"), this.fakeElem.style.fontSize = "12pt", this.fakeElem.style.border = "0", this.fakeElem.style.padding = "0", this.fakeElem.style.margin = "0", this.fakeElem.style.position = "absolute", this.fakeElem.style[e ? "right" : "left"] = "-9999px";
                                    var n = window.pageYOffset || document.documentElement.scrollTop;
                                    this.fakeElem.style.top = n + "px", this.fakeElem.setAttribute("readonly", ""), this.fakeElem.value = this.text, this.container.appendChild(this.fakeElem), this.selectedText = (0, r.default)(this.fakeElem), this.copyText()
                                }
                            }, {
                                key: "removeFake",
                                value: function() {
                                    this.fakeHandler && (this.container.removeEventListener("click", this.fakeHandlerCallback), this.fakeHandler = null, this.fakeHandlerCallback = null), this.fakeElem && (this.container.removeChild(this.fakeElem), this.fakeElem = null)
                                }
                            }, {
                                key: "selectTarget",
                                value: function() {
                                    this.selectedText = (0, r.default)(this.target), this.copyText()
                                }
                            }, {
                                key: "copyText",
                                value: function() {
                                    var t = void 0;
                                    try {
                                        t = document.execCommand(this.action)
                                    } catch (e) {
                                        t = !1
                                    }
                                    this.handleResult(t)
                                }
                            }, {
                                key: "handleResult",
                                value: function(t) {
                                    this.emitter.emit(t ? "success" : "error", {
                                        action: this.action,
                                        text: this.selectedText,
                                        trigger: this.trigger,
                                        clearSelection: this.clearSelection.bind(this)
                                    })
                                }
                            }, {
                                key: "clearSelection",
                                value: function() {
                                    this.trigger && this.trigger.focus(), window.getSelection().removeAllRanges()
                                }
                            }, {
                                key: "destroy",
                                value: function() {
                                    this.removeFake()
                                }
                            }, {
                                key: "action",
                                set: function() {
                                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "copy";
                                    if (this._action = t, "copy" !== this._action && "cut" !== this._action) throw new Error('Invalid "action" value, use either "copy" or "cut"')
                                },
                                get: function() {
                                    return this._action
                                }
                            }, {
                                key: "target",
                                set: function(t) {
                                    if (void 0 !== t) {
                                        if (!t || "object" !== (void 0 === t ? "undefined" : i(t)) || 1 !== t.nodeType) throw new Error('Invalid "target" value, use a valid Element');
                                        if ("copy" === this.action && t.hasAttribute("disabled")) throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                                        if ("cut" === this.action && (t.hasAttribute("readonly") || t.hasAttribute("disabled"))) throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                                        this._target = t
                                    }
                                },
                                get: function() {
                                    return this._target
                                }
                            }]), t
                        }();
                    t.exports = u
                })
            }, {
                select: 5
            }],
            8: [function(t, e, n) {
                ! function(r, i) {
                    if (void 0 !== n) i(e, t("./clipboard-action"), t("tiny-emitter"), t("good-listener"));
                    else {
                        var o = {
                            exports: {}
                        };
                        i(o, r.clipboardAction, r.tinyEmitter, r.goodListener), r.clipboard = o.exports
                    }
                }(this, function(t, e, n, r) {
                    "use strict";

                    function i(t) {
                        return t && t.__esModule ? t : {
                            default: t
                        }
                    }

                    function o(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }

                    function u(t, e) {
                        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return !e || "object" != typeof e && "function" != typeof e ? t : e
                    }

                    function a(t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                    }

                    function s(t, e) {
                        var n = "data-clipboard-" + t;
                        if (e.hasAttribute(n)) return e.getAttribute(n)
                    }
                    var c = i(e),
                        l = i(n),
                        f = i(r),
                        h = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                            return typeof t
                        } : function(t) {
                            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                        },
                        p = function() {
                            function t(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }
                            return function(e, n, r) {
                                return n && t(e.prototype, n), r && t(e, r), e
                            }
                        }(),
                        d = function(t) {
                            function e(t, n) {
                                o(this, e);
                                var r = u(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
                                return r.resolveOptions(n), r.listenClick(t), r
                            }
                            return a(e, l.default), p(e, [{
                                key: "resolveOptions",
                                value: function() {
                                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                    this.action = "function" == typeof t.action ? t.action : this.defaultAction, this.target = "function" == typeof t.target ? t.target : this.defaultTarget, this.text = "function" == typeof t.text ? t.text : this.defaultText, this.container = "object" === h(t.container) ? t.container : document.body
                                }
                            }, {
                                key: "listenClick",
                                value: function(t) {
                                    var e = this;
                                    this.listener = (0, f.default)(t, "click", function(t) {
                                        return e.onClick(t)
                                    })
                                }
                            }, {
                                key: "onClick",
                                value: function(t) {
                                    var e = t.delegateTarget || t.currentTarget;
                                    this.clipboardAction && (this.clipboardAction = null), this.clipboardAction = new c.default({
                                        action: this.action(e),
                                        target: this.target(e),
                                        text: this.text(e),
                                        container: this.container,
                                        trigger: e,
                                        emitter: this
                                    })
                                }
                            }, {
                                key: "defaultAction",
                                value: function(t) {
                                    return s("action", t)
                                }
                            }, {
                                key: "defaultTarget",
                                value: function(t) {
                                    var e = s("target", t);
                                    if (e) return document.querySelector(e)
                                }
                            }, {
                                key: "defaultText",
                                value: function(t) {
                                    return s("text", t)
                                }
                            }, {
                                key: "destroy",
                                value: function() {
                                    this.listener.destroy(), this.clipboardAction && (this.clipboardAction.destroy(), this.clipboardAction = null)
                                }
                            }], [{
                                key: "isSupported",
                                value: function() {
                                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ["copy", "cut"],
                                        e = "string" == typeof t ? [t] : t,
                                        n = !!document.queryCommandSupported;
                                    return e.forEach(function(t) {
                                        n = n && !!document.queryCommandSupported(t)
                                    }), n
                                }
                            }]), e
                        }();
                    t.exports = d
                })
            }, {
                "./clipboard-action": 7,
                "good-listener": 4,
                "tiny-emitter": 6
            }]
        }, {}, [8])(8)
    }),
    function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(t.Notify = t.Notify || {})
    }(this, function(t) {
        "use strict";

        function e(t) {
            return "function" == typeof t
        }

        function n(t) {
            var n = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1];
            if ("string" != typeof t) throw new Error("Notify(): first arg (title) must be a string.");
            if ("object" != typeof n) throw new Error("Notify(): second arg (options) must be an object.");
            var i = n.notifyShow,
                o = void 0 === i ? null : i,
                u = n.notifyClose,
                a = void 0 === u ? null : u,
                s = n.notifyClick,
                c = void 0 === s ? null : s,
                l = n.notifyError,
                f = void 0 === l ? null : l,
                h = n.closeOnClick,
                p = void 0 !== h && h,
                d = n.timeout,
                g = void 0 === d ? null : d,
                v = r(n, ["notifyShow", "notifyClose", "notifyClick", "notifyError", "closeOnClick", "timeout"]);
            this.title = t, this.options = v, this.permission = null, this.closeOnClick = p, this.timeout = g, e(o) && (this.onShowCallback = o), e(a) && (this.onCloseCallback = a), e(c) && (this.onClickCallback = c), e(f) && (this.onErrorCallback = f)
        }
        var r = function(t, e) {
                var n = {};
                for (var r in t) e.indexOf(r) >= 0 || Object.prototype.hasOwnProperty.call(t, r) && (n[r] = t[r]);
                return n
            },
            i = window.Notification;
        n.isSupported = function(t) {
            if (!i || !i.requestPermission) return !1;
            if ("granted" === t || "granted" === i.permission) throw new Error("You must only call this before calling Notification.requestPermission(), otherwise this feature detect would trigger an actual notification!");
            try {
                new i("")
            } catch (t) {
                if ("TypeError" === t.name) return !1
            }
            return !0
        }, n.needsPermission = !i || !i.permission || "granted" !== i.permission, n.requestPermission = function(t, r) {
            i.requestPermission(function(i) {
                switch (i) {
                    case "granted":
                        n.needsPermission = !1, e(t) && t();
                        break;
                    case "denied":
                        n.needsPermission = !0, e(r) && r()
                }
            })
        }, n.prototype.show = function() {
            this.myNotify = new i(this.title, this.options), this.options.requireInteraction || !this.timeout || isNaN(this.timeout) || setTimeout(this.close.bind(this), 1e3 * this.timeout), this.myNotify.addEventListener("show", this, !1), this.myNotify.addEventListener("error", this, !1), this.myNotify.addEventListener("close", this, !1), this.myNotify.addEventListener("click", this, !1)
        }, n.prototype.onShowNotification = function(t) {
            this.onShowCallback && this.onShowCallback(t)
        }, n.prototype.onCloseNotification = function(t) {
            this.onCloseCallback && this.onCloseCallback(t), this.destroy()
        }, n.prototype.onClickNotification = function(t) {
            this.onClickCallback && this.onClickCallback(t), this.closeOnClick && this.close()
        }, n.prototype.onErrorNotification = function(t) {
            this.onErrorCallback && this.onErrorCallback(t), this.destroy()
        }, n.prototype.destroy = function() {
            this.myNotify.removeEventListener("show", this, !1), this.myNotify.removeEventListener("error", this, !1), this.myNotify.removeEventListener("close", this, !1), this.myNotify.removeEventListener("click", this, !1)
        }, n.prototype.close = function() {
            this.myNotify.close()
        }, n.prototype.handleEvent = function(t) {
            switch (t.type) {
                case "show":
                    this.onShowNotification(t);
                    break;
                case "close":
                    this.onCloseNotification(t);
                    break;
                case "click":
                    this.onClickNotification(t);
                    break;
                case "error":
                    this.onErrorNotification(t)
            }
        }, t.default = n
    }),
    function(t, e) {
        "use strict";
        "undefined" != typeof module && module.exports ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : t.buzz = e()
    }(this, function() {
        "use strict";
        var t = window.AudioContext || window.webkitAudioContext,
            e = {
                defaults: {
                    autoplay: !1,
                    crossOrigin: null,
                    duration: 5e3,
                    formats: [],
                    loop: !1,
                    placeholder: "--",
                    preload: "metadata",
                    volume: 80,
                    webAudioApi: !1,
                    document: window.document
                },
                types: {
                    mp3: "audio/mpeg",
                    ogg: "audio/ogg",
                    wav: "audio/wav",
                    aac: "audio/aac",
                    m4a: "audio/x-m4a"
                },
                sounds: [],
                el: document.createElement("audio"),
                getAudioContext: function() {
                    if (void 0 === this.audioCtx) try {
                        this.audioCtx = t ? new t : null
                    } catch (t) {
                        this.audioCtx = null
                    }
                    return this.audioCtx
                },
                sound: function(t, n) {
                    function r(t) {
                        for (var e = [], n = t.length - 1, r = 0; r <= n; r++) e.push({
                            start: t.start(r),
                            end: t.end(r)
                        });
                        return e
                    }

                    function i(t) {
                        return t.split(".").pop()
                    }
                    var o = (n = n || {}).document || e.defaults.document,
                        u = 0,
                        a = [],
                        s = {},
                        c = e.isSupported();
                    if (this.load = function() {
                            return c ? (this.sound.load(), this) : this
                        }, this.play = function() {
                            return c ? (this.sound.play(), this) : this
                        }, this.togglePlay = function() {
                            return c ? (this.sound.paused ? this.sound.play() : this.sound.pause(), this) : this
                        }, this.pause = function() {
                            return c ? (this.sound.pause(), this) : this
                        }, this.isPaused = function() {
                            return c ? this.sound.paused : null
                        }, this.stop = function() {
                            return c ? (this.setTime(0), this.sound.pause(), this) : this
                        }, this.isEnded = function() {
                            return c ? this.sound.ended : null
                        }, this.loop = function() {
                            return c ? (this.sound.loop = "loop", this.bind("ended.buzzloop", function() {
                                this.currentTime = 0, this.play()
                            }), this) : this
                        }, this.unloop = function() {
                            return c ? (this.sound.removeAttribute("loop"), this.unbind("ended.buzzloop"), this) : this
                        }, this.mute = function() {
                            return c ? (this.sound.muted = !0, this) : this
                        }, this.unmute = function() {
                            return c ? (this.sound.muted = !1, this) : this
                        }, this.toggleMute = function() {
                            return c ? (this.sound.muted = !this.sound.muted, this) : this
                        }, this.isMuted = function() {
                            return c ? this.sound.muted : null
                        }, this.setVolume = function(t) {
                            return c ? (t < 0 && (t = 0), t > 100 && (t = 100), this.volume = t, this.sound.volume = t / 100, this) : this
                        }, this.getVolume = function() {
                            return c ? this.volume : this
                        }, this.increaseVolume = function(t) {
                            return this.setVolume(this.volume + (t || 1))
                        }, this.decreaseVolume = function(t) {
                            return this.setVolume(this.volume - (t || 1))
                        }, this.setTime = function(t) {
                            if (!c) return this;
                            var e = !0;
                            return this.whenReady(function() {
                                !0 === e && (e = !1, this.sound.currentTime = t)
                            }), this
                        }, this.getTime = function() {
                            if (!c) return null;
                            var t = Math.round(100 * this.sound.currentTime) / 100;
                            return isNaN(t) ? e.defaults.placeholder : t
                        }, this.setPercent = function(t) {
                            return c ? this.setTime(e.fromPercent(t, this.sound.duration)) : this
                        }, this.getPercent = function() {
                            if (!c) return null;
                            var t = Math.round(e.toPercent(this.sound.currentTime, this.sound.duration));
                            return isNaN(t) ? e.defaults.placeholder : t
                        }, this.setSpeed = function(t) {
                            return c ? (this.sound.playbackRate = t, this) : this
                        }, this.getSpeed = function() {
                            return c ? this.sound.playbackRate : null
                        }, this.getDuration = function() {
                            if (!c) return null;
                            var t = Math.round(100 * this.sound.duration) / 100;
                            return isNaN(t) ? e.defaults.placeholder : t
                        }, this.getPlayed = function() {
                            return c ? r(this.sound.played) : null
                        }, this.getBuffered = function() {
                            return c ? r(this.sound.buffered) : null
                        }, this.getSeekable = function() {
                            return c ? r(this.sound.seekable) : null
                        }, this.getErrorCode = function() {
                            return c && this.sound.error ? this.sound.error.code : 0
                        }, this.getErrorMessage = function() {
                            if (!c) return null;
                            switch (this.getErrorCode()) {
                                case 1:
                                    return "MEDIA_ERR_ABORTED";
                                case 2:
                                    return "MEDIA_ERR_NETWORK";
                                case 3:
                                    return "MEDIA_ERR_DECODE";
                                case 4:
                                    return "MEDIA_ERR_SRC_NOT_SUPPORTED";
                                default:
                                    return null
                            }
                        }, this.getStateCode = function() {
                            return c ? this.sound.readyState : null
                        }, this.getStateMessage = function() {
                            if (!c) return null;
                            switch (this.getStateCode()) {
                                case 0:
                                    return "HAVE_NOTHING";
                                case 1:
                                    return "HAVE_METADATA";
                                case 2:
                                    return "HAVE_CURRENT_DATA";
                                case 3:
                                    return "HAVE_FUTURE_DATA";
                                case 4:
                                    return "HAVE_ENOUGH_DATA";
                                default:
                                    return null
                            }
                        }, this.getNetworkStateCode = function() {
                            return c ? this.sound.networkState : null
                        }, this.getNetworkStateMessage = function() {
                            if (!c) return null;
                            switch (this.getNetworkStateCode()) {
                                case 0:
                                    return "NETWORK_EMPTY";
                                case 1:
                                    return "NETWORK_IDLE";
                                case 2:
                                    return "NETWORK_LOADING";
                                case 3:
                                    return "NETWORK_NO_SOURCE";
                                default:
                                    return null
                            }
                        }, this.set = function(t, e) {
                            return c ? (this.sound[t] = e, this) : this
                        }, this.get = function(t) {
                            return c ? t ? this.sound[t] : this.sound : null
                        }, this.bind = function(t, e) {
                            if (!c) return this;
                            t = t.split(" ");
                            for (var n = this, r = function(t) {
                                e.call(n, t)
                            }, i = 0; i < t.length; i++) {
                                var o = t[i],
                                    u = o;
                                o = u.split(".")[0], a.push({
                                    idx: u,
                                    func: r
                                }), this.sound.addEventListener(o, r, !0)
                            }
                            return this
                        }, this.unbind = function(t) {
                            if (!c) return this;
                            t = t.split(" ");
                            for (var e = 0; e < t.length; e++)
                                for (var n = t[e], r = n.split(".")[0], i = 0; i < a.length; i++) {
                                    var o = a[i].idx.split(".");
                                    (a[i].idx === n || o[1] && o[1] === n.replace(".", "")) && (this.sound.removeEventListener(r, a[i].func, !0), a.splice(i, 1))
                                }
                            return this
                        }, this.bindOnce = function(t, e) {
                            if (!c) return this;
                            var n = this;
                            return s[u++] = !1, this.bind(t + "." + u, function() {
                                s[u] || (s[u] = !0, e.call(n)), n.unbind(t + "." + u)
                            }), this
                        }, this.trigger = function(t, e) {
                            if (!c) return this;
                            t = t.split(" ");
                            for (var n = 0; n < t.length; n++)
                                for (var r = t[n], i = 0; i < a.length; i++) {
                                    var u = a[i].idx.split(".");
                                    if (a[i].idx === r || u[0] && u[0] === r.replace(".", "")) {
                                        var s = o.createEvent("HTMLEvents");
                                        s.initEvent(u[0], !1, !0), s.originalEvent = e, this.sound.dispatchEvent(s)
                                    }
                                }
                            return this
                        }, this.fadeTo = function(t, n, r) {
                            function i() {
                                clearTimeout(o), o = setTimeout(function() {
                                    u < t && s.volume < t ? (s.setVolume(s.volume += 1), i()) : u > t && s.volume > t ? (s.setVolume(s.volume -= 1), i()) : r instanceof Function && r.apply(s)
                                }, a)
                            }
                            if (!c) return this;
                            n instanceof Function ? (r = n, n = e.defaults.duration) : n = n || e.defaults.duration;
                            var o, u = this.volume,
                                a = n / Math.abs(u - t),
                                s = this;
                            return this.play(), this.whenReady(function() {
                                i()
                            }), this
                        }, this.fadeIn = function(t, e) {
                            return c ? this.setVolume(0).fadeTo(100, t, e) : this
                        }, this.fadeOut = function(t, e) {
                            return c ? this.fadeTo(0, t, e) : this
                        }, this.fadeWith = function(t, e) {
                            return c ? (this.fadeOut(e, function() {
                                this.stop()
                            }), t.play().fadeIn(e), this) : this
                        }, this.whenReady = function(t) {
                            if (!c) return null;
                            var e = this;
                            0 === this.sound.readyState ? this.bind("canplay.buzzwhenready", function() {
                                t.call(e)
                            }) : t.call(e)
                        }, this.addSource = function(t) {
                            var n = this,
                                r = o.createElement("source");
                            return r.src = t, e.types[i(t)] && (r.type = e.types[i(t)]), this.sound.appendChild(r), r.addEventListener("error", function(t) {
                                n.trigger("sourceerror", t)
                            }), r
                        }, c && t) {
                        for (var l in e.defaults) e.defaults.hasOwnProperty(l) && void 0 === n[l] && (n[l] = e.defaults[l]);
                        if (this.sound = o.createElement("audio"), null !== n.crossOrigin && (this.sound.crossOrigin = n.crossOrigin), n.webAudioApi) {
                            var f = e.getAudioContext();
                            f && (this.source = f.createMediaElementSource(this.sound), this.source.connect(f.destination))
                        }
                        if (t instanceof Array)
                            for (var h in t) t.hasOwnProperty(h) && this.addSource(t[h]);
                        else if (n.formats.length)
                            for (var p in n.formats) n.formats.hasOwnProperty(p) && this.addSource(t + "." + n.formats[p]);
                        else this.addSource(t);
                        n.loop && this.loop(), n.autoplay && (this.sound.autoplay = "autoplay"), !0 === n.preload ? this.sound.preload = "auto" : !1 === n.preload ? this.sound.preload = "none" : this.sound.preload = n.preload, this.setVolume(n.volume), e.sounds.push(this)
                    }
                },
                group: function(t) {
                    function e() {
                        for (var e = n(null, arguments), r = e.shift(), i = 0; i < t.length; i++) t[i][r].apply(t[i], e)
                    }

                    function n(t, e) {
                        return t instanceof Array ? t : Array.prototype.slice.call(e)
                    }
                    t = n(t, arguments), this.getSounds = function() {
                        return t
                    }, this.add = function(e) {
                        e = n(e, arguments);
                        for (var r = 0; r < e.length; r++) t.push(e[r])
                    }, this.remove = function(e) {
                        e = n(e, arguments);
                        for (var r = 0; r < e.length; r++)
                            for (var i = 0; i < t.length; i++)
                                if (t[i] === e[r]) {
                                    t.splice(i, 1);
                                    break
                                }
                    }, this.load = function() {
                        return e("load"), this
                    }, this.play = function() {
                        return e("play"), this
                    }, this.togglePlay = function() {
                        return e("togglePlay"), this
                    }, this.pause = function(t) {
                        return e("pause", t), this
                    }, this.stop = function() {
                        return e("stop"), this
                    }, this.mute = function() {
                        return e("mute"), this
                    }, this.unmute = function() {
                        return e("unmute"), this
                    }, this.toggleMute = function() {
                        return e("toggleMute"), this
                    }, this.setVolume = function(t) {
                        return e("setVolume", t), this
                    }, this.increaseVolume = function(t) {
                        return e("increaseVolume", t), this
                    }, this.decreaseVolume = function(t) {
                        return e("decreaseVolume", t), this
                    }, this.loop = function() {
                        return e("loop"), this
                    }, this.unloop = function() {
                        return e("unloop"), this
                    }, this.setSpeed = function(t) {
                        return e("setSpeed", t), this
                    }, this.setTime = function(t) {
                        return e("setTime", t), this
                    }, this.set = function(t, n) {
                        return e("set", t, n), this
                    }, this.bind = function(t, n) {
                        return e("bind", t, n), this
                    }, this.unbind = function(t) {
                        return e("unbind", t), this
                    }, this.bindOnce = function(t, n) {
                        return e("bindOnce", t, n), this
                    }, this.trigger = function(t) {
                        return e("trigger", t), this
                    }, this.fade = function(t, n, r, i) {
                        return e("fade", t, n, r, i), this
                    }, this.fadeIn = function(t, n) {
                        return e("fadeIn", t, n), this
                    }, this.fadeOut = function(t, n) {
                        return e("fadeOut", t, n), this
                    }
                },
                all: function() {
                    return new e.group(e.sounds)
                },
                isSupported: function() {
                    return !!e.el.canPlayType
                },
                isOGGSupported: function() {
                    return !!e.el.canPlayType && e.el.canPlayType('audio/ogg; codecs="vorbis"')
                },
                isWAVSupported: function() {
                    return !!e.el.canPlayType && e.el.canPlayType('audio/wav; codecs="1"')
                },
                isMP3Supported: function() {
                    return !!e.el.canPlayType && e.el.canPlayType("audio/mpeg;")
                },
                isAACSupported: function() {
                    return !!e.el.canPlayType && (e.el.canPlayType("audio/x-m4a;") || e.el.canPlayType("audio/aac;"))
                },
                toTimer: function(t, e) {
                    var n, r, i;
                    return n = Math.floor(t / 3600), n = isNaN(n) ? "--" : n >= 10 ? n : "0" + n, r = e ? Math.floor(t / 60 % 60) : Math.floor(t / 60), r = isNaN(r) ? "--" : r >= 10 ? r : "0" + r, i = Math.floor(t % 60), i = isNaN(i) ? "--" : i >= 10 ? i : "0" + i, e ? n + ":" + r + ":" + i : r + ":" + i
                },
                fromTimer: function(t) {
                    var e = t.toString().split(":");
                    return e && 3 === e.length && (t = 3600 * parseInt(e[0], 10) + 60 * parseInt(e[1], 10) + parseInt(e[2], 10)), e && 2 === e.length && (t = 60 * parseInt(e[0], 10) + parseInt(e[1], 10)), t
                },
                toPercent: function(t, e, n) {
                    var r = Math.pow(10, n || 0);
                    return Math.round(100 * t / e * r) / r
                },
                fromPercent: function(t, e, n) {
                    var r = Math.pow(10, n || 0);
                    return Math.round(e / 100 * t * r) / r
                }
            };
        return e
    }),
    function() {
        var t = {},
            e = null,
            n = null,
            r = null,
            i = null,
            o = {},
            u = {
                color: "#ff0084",
                background: "#bbb",
                shadow: "#fff",
                fallback: !1
            },
            a = window.devicePixelRatio > 1,
            s = function() {
                var t = navigator.userAgent.toLowerCase();
                return function(e) {
                    return -1 !== t.indexOf(e)
                }
            }(),
            c = {
                ie: s("msie"),
                chrome: s("chrome"),
                webkit: s("chrome") || s("safari"),
                safari: s("safari") && !s("chrome"),
                mozilla: s("mozilla") && !s("chrome") && !s("safari")
            },
            l = function() {
                for (var t = document.getElementsByTagName("link"), e = 0, n = t.length; e < n; e++)
                    if ("icon" === t[e].getAttribute("rel") || "shortcut icon" === t[e].getAttribute("rel")) return t[e];
                return !1
            },
            f = function() {
                for (var t = Array.prototype.slice.call(document.getElementsByTagName("link"), 0), e = document.getElementsByTagName("head")[0], n = 0, r = t.length; n < r; n++) "icon" !== t[n].getAttribute("rel") && "shortcut icon" !== t[n].getAttribute("rel") || e.removeChild(t[n])
            },
            h = function(t) {
                f();
                var e = document.createElement("link");
                e.type = "image/x-icon", e.rel = "icon", e.href = t, document.getElementsByTagName("head")[0].appendChild(e)
            },
            p = function() {
                return i || (i = document.createElement("canvas"), a ? (i.width = 32, i.height = 32) : (i.width = 16, i.height = 16)), i
            },
            d = function(t) {
                var e = p(),
                    n = e.getContext("2d");
                t = t || 0, n && (n.clearRect(0, 0, e.width, e.height), n.beginPath(), n.moveTo(e.width / 2, e.height / 2), n.arc(e.width / 2, e.height / 2, Math.min(e.width / 2, e.height / 2), 0, 2 * Math.PI, !1), n.fillStyle = o.shadow, n.fill(), n.beginPath(), n.moveTo(e.width / 2, e.height / 2), n.arc(e.width / 2, e.height / 2, Math.min(e.width / 2, e.height / 2) - 2, 0, 2 * Math.PI, !1), n.fillStyle = o.background, n.fill(), t > 0 && (n.beginPath(), n.moveTo(e.width / 2, e.height / 2), n.arc(e.width / 2, e.height / 2, Math.min(e.width / 2, e.height / 2) - 2, -.5 * Math.PI, (2 * t / 100 - .5) * Math.PI, !1), n.lineTo(e.width / 2, e.height / 2), n.fillStyle = o.color, n.fill()), h(e.toDataURL()))
            },
            g = function(t) {
                document.title = t > 0 ? "(" + t + "%) " + r : r
            };
        t.setOptions = function(t) {
            o = {};
            for (var e in u) o[e] = t.hasOwnProperty(e) ? t[e] : u[e];
            return this
        }, t.setProgress = function(t) {
            if (r || (r = document.title), !n || !e) {
                var i = l();
                n = e = i ? i.getAttribute("href") : "/favicon.ico"
            }
            return !(isNaN(parseFloat(t)) || !isFinite(t)) && (!p().getContext || c.ie || c.safari || !0 === o.fallback ? g(t) : ("force" === o.fallback && g(t), d(t)))
        }, t.reset = function() {
            r && (document.title = r), n && h(e = n)
        }, t.setOptions(u), "function" == typeof define && define.amd ? define(t) : "undefined" != typeof module ? module.exports = t : window.Piecon = t
    }(),
    function(t, e) {
        "use strict";
        "object" == typeof module && "object" == typeof module.exports ? module.exports = t.document ? e(t, !0) : function(t) {
            if (!t.document) throw new Error("jQuery requires a window with a document");
            return e(t)
        } : e(t)
    }("undefined" != typeof window ? window : this, function(t, e) {
        "use strict";

        function n(t, e) {
            var n = (e = e || et).createElement("script");
            n.text = t, e.head.appendChild(n).parentNode.removeChild(n)
        }

        function r(t) {
            var e = !!t && "length" in t && t.length,
                n = pt.type(t);
            return "function" !== n && !pt.isWindow(t) && ("array" === n || 0 === e || "number" == typeof e && e > 0 && e - 1 in t)
        }

        function i(t, e) {
            return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
        }

        function o(t, e, n) {
            return pt.isFunction(e) ? pt.grep(t, function(t, r) {
                return !!e.call(t, r, t) !== n
            }) : e.nodeType ? pt.grep(t, function(t) {
                return t === e !== n
            }) : "string" != typeof e ? pt.grep(t, function(t) {
                return ut.call(e, t) > -1 !== n
            }) : kt.test(e) ? pt.filter(e, t, n) : (e = pt.filter(e, t), pt.grep(t, function(t) {
                return ut.call(e, t) > -1 !== n && 1 === t.nodeType
            }))
        }

        function u(t, e) {
            for (;
                (t = t[e]) && 1 !== t.nodeType;);
            return t
        }

        function a(t) {
            var e = {};
            return pt.each(t.match(Nt) || [], function(t, n) {
                e[n] = !0
            }), e
        }

        function s(t) {
            return t
        }

        function c(t) {
            throw t
        }

        function l(t, e, n, r) {
            var i;
            try {
                t && pt.isFunction(i = t.promise) ? i.call(t).done(e).fail(n) : t && pt.isFunction(i = t.then) ? i.call(t, e, n) : e.apply(void 0, [t].slice(r))
            } catch (t) {
                n.apply(void 0, [t])
            }
        }

        function f() {
            et.removeEventListener("DOMContentLoaded", f), t.removeEventListener("load", f), pt.ready()
        }

        function h() {
            this.expando = pt.expando + h.uid++
        }

        function p(t) {
            return "true" === t || "false" !== t && ("null" === t ? null : t === +t + "" ? +t : Pt.test(t) ? JSON.parse(t) : t)
        }

        function d(t, e, n) {
            var r;
            if (void 0 === n && 1 === t.nodeType)
                if (r = "data-" + e.replace(Ot, "-$&").toLowerCase(), "string" == typeof(n = t.getAttribute(r))) {
                    try {
                        n = p(n)
                    } catch (t) {}
                    jt.set(t, e, n)
                } else n = void 0;
            return n
        }

        function g(t, e, n, r) {
            var i, o = 1,
                u = 20,
                a = r ? function() {
                    return r.cur()
                } : function() {
                    return pt.css(t, e, "")
                },
                s = a(),
                c = n && n[3] || (pt.cssNumber[e] ? "" : "px"),
                l = (pt.cssNumber[e] || "px" !== c && +s) && Ht.exec(pt.css(t, e));
            if (l && l[3] !== c) {
                c = c || l[3], n = n || [], l = +s || 1;
                do {
                    l /= o = o || ".5", pt.style(t, e, l + c)
                } while (o !== (o = a() / s) && 1 !== o && --u)
            }
            return n && (l = +l || +s || 0, i = n[1] ? l + (n[1] + 1) * n[2] : +n[2], r && (r.unit = c, r.start = l, r.end = i)), i
        }

        function v(t) {
            var e, n = t.ownerDocument,
                r = t.nodeName,
                i = Ut[r];
            return i || (e = n.body.appendChild(n.createElement(r)), i = pt.css(e, "display"), e.parentNode.removeChild(e), "none" === i && (i = "block"), Ut[r] = i, i)
        }

        function y(t, e) {
            for (var n, r, i = [], o = 0, u = t.length; o < u; o++)(r = t[o]).style && (n = r.style.display, e ? ("none" === n && (i[o] = qt.get(r, "display") || null, i[o] || (r.style.display = "")), "" === r.style.display && zt(r) && (i[o] = v(r))) : "none" !== n && (i[o] = "none", qt.set(r, "display", n)));
            for (o = 0; o < u; o++) null != i[o] && (t[o].style.display = i[o]);
            return t
        }

        function m(t, e) {
            var n;
            return n = void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e || "*") : void 0 !== t.querySelectorAll ? t.querySelectorAll(e || "*") : [], void 0 === e || e && i(t, e) ? pt.merge([t], n) : n
        }

        function x(t, e) {
            for (var n = 0, r = t.length; n < r; n++) qt.set(t[n], "globalEval", !e || qt.get(e[n], "globalEval"))
        }

        function b(t, e, n, r, i) {
            for (var o, u, a, s, c, l, f = e.createDocumentFragment(), h = [], p = 0, d = t.length; p < d; p++)
                if ((o = t[p]) || 0 === o)
                    if ("object" === pt.type(o)) pt.merge(h, o.nodeType ? [o] : o);
                    else if (Yt.test(o)) {
                        for (u = u || f.appendChild(e.createElement("div")), a = (Bt.exec(o) || ["", ""])[1].toLowerCase(), s = Vt[a] || Vt._default, u.innerHTML = s[1] + pt.htmlPrefilter(o) + s[2], l = s[0]; l--;) u = u.lastChild;
                        pt.merge(h, u.childNodes), (u = f.firstChild).textContent = ""
                    } else h.push(e.createTextNode(o));
            for (f.textContent = "", p = 0; o = h[p++];)
                if (r && pt.inArray(o, r) > -1) i && i.push(o);
                else if (c = pt.contains(o.ownerDocument, o), u = m(f.appendChild(o), "script"), c && x(u), n)
                    for (l = 0; o = u[l++];) $t.test(o.type || "") && n.push(o);
            return f
        }

        function w() {
            return !0
        }

        function M() {
            return !1
        }

        function k() {
            try {
                return et.activeElement
            } catch (t) {}
        }

        function E(t, e, n, r, i, o) {
            var u, a;
            if ("object" == typeof e) {
                "string" != typeof n && (r = r || n, n = void 0);
                for (a in e) E(t, a, n, r, e[a], o);
                return t
            }
            if (null == r && null == i ? (i = n, r = n = void 0) : null == i && ("string" == typeof n ? (i = r, r = void 0) : (i = r, r = n, n = void 0)), !1 === i) i = M;
            else if (!i) return t;
            return 1 === o && (u = i, (i = function(t) {
                return pt().off(t), u.apply(this, arguments)
            }).guid = u.guid || (u.guid = pt.guid++)), t.each(function() {
                pt.event.add(this, e, i, r, n)
            })
        }

        function C(t, e) {
            return i(t, "table") && i(11 !== e.nodeType ? e : e.firstChild, "tr") ? pt(">tbody", t)[0] || t : t
        }

        function T(t) {
            return t.type = (null !== t.getAttribute("type")) + "/" + t.type, t
        }

        function S(t) {
            var e = ee.exec(t.type);
            return e ? t.type = e[1] : t.removeAttribute("type"), t
        }

        function N(t, e) {
            var n, r, i, o, u, a, s, c;
            if (1 === e.nodeType) {
                if (qt.hasData(t) && (o = qt.access(t), u = qt.set(e, o), c = o.events)) {
                    delete u.handle, u.events = {};
                    for (i in c)
                        for (n = 0, r = c[i].length; n < r; n++) pt.event.add(e, i, c[i][n])
                }
                jt.hasData(t) && (a = jt.access(t), s = pt.extend({}, a), jt.set(e, s))
            }
        }

        function _(t, e) {
            var n = e.nodeName.toLowerCase();
            "input" === n && Wt.test(t.type) ? e.checked = t.checked : "input" !== n && "textarea" !== n || (e.defaultValue = t.defaultValue)
        }

        function A(t, e, r, i) {
            e = it.apply([], e);
            var o, u, a, s, c, l, f = 0,
                h = t.length,
                p = h - 1,
                d = e[0],
                g = pt.isFunction(d);
            if (g || h > 1 && "string" == typeof d && !ht.checkClone && te.test(d)) return t.each(function(n) {
                var o = t.eq(n);
                g && (e[0] = d.call(this, n, o.html())), A(o, e, r, i)
            });
            if (h && (o = b(e, t[0].ownerDocument, !1, t, i), u = o.firstChild, 1 === o.childNodes.length && (o = u), u || i)) {
                for (s = (a = pt.map(m(o, "script"), T)).length; f < h; f++) c = o, f !== p && (c = pt.clone(c, !0, !0), s && pt.merge(a, m(c, "script"))), r.call(t[f], c, f);
                if (s)
                    for (l = a[a.length - 1].ownerDocument, pt.map(a, S), f = 0; f < s; f++) c = a[f], $t.test(c.type || "") && !qt.access(c, "globalEval") && pt.contains(l, c) && (c.src ? pt._evalUrl && pt._evalUrl(c.src) : n(c.textContent.replace(ne, ""), l))
            }
            return t
        }

        function L(t, e, n) {
            for (var r, i = e ? pt.filter(e, t) : t, o = 0; null != (r = i[o]); o++) n || 1 !== r.nodeType || pt.cleanData(m(r)), r.parentNode && (n && pt.contains(r.ownerDocument, r) && x(m(r, "script")), r.parentNode.removeChild(r));
            return t
        }

        function D(t, e, n) {
            var r, i, o, u, a = t.style;
            return (n = n || oe(t)) && ("" !== (u = n.getPropertyValue(e) || n[e]) || pt.contains(t.ownerDocument, t) || (u = pt.style(t, e)), !ht.pixelMarginRight() && ie.test(u) && re.test(e) && (r = a.width, i = a.minWidth, o = a.maxWidth, a.minWidth = a.maxWidth = a.width = u, u = n.width, a.width = r, a.minWidth = i, a.maxWidth = o)), void 0 !== u ? u + "" : u
        }

        function q(t, e) {
            return {
                get: function() {
                    if (!t()) return (this.get = e).apply(this, arguments);
                    delete this.get
                }
            }
        }

        function j(t) {
            if (t in fe) return t;
            for (var e = t[0].toUpperCase() + t.slice(1), n = le.length; n--;)
                if ((t = le[n] + e) in fe) return t
        }

        function P(t) {
            var e = pt.cssProps[t];
            return e || (e = pt.cssProps[t] = j(t) || t), e
        }

        function O(t, e, n) {
            var r = Ht.exec(e);
            return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : e
        }

        function R(t, e, n, r, i) {
            var o, u = 0;
            for (o = n === (r ? "border" : "content") ? 4 : "width" === e ? 1 : 0; o < 4; o += 2) "margin" === n && (u += pt.css(t, n + Ft[o], !0, i)), r ? ("content" === n && (u -= pt.css(t, "padding" + Ft[o], !0, i)), "margin" !== n && (u -= pt.css(t, "border" + Ft[o] + "Width", !0, i))) : (u += pt.css(t, "padding" + Ft[o], !0, i), "padding" !== n && (u += pt.css(t, "border" + Ft[o] + "Width", !0, i)));
            return u
        }

        function H(t, e, n) {
            var r, i = oe(t),
                o = D(t, e, i),
                u = "border-box" === pt.css(t, "boxSizing", !1, i);
            return ie.test(o) ? o : (r = u && (ht.boxSizingReliable() || o === t.style[e]), "auto" === o && (o = t["offset" + e[0].toUpperCase() + e.slice(1)]), (o = parseFloat(o) || 0) + R(t, e, n || (u ? "border" : "content"), r, i) + "px")
        }

        function F(t, e, n, r, i) {
            return new F.prototype.init(t, e, n, r, i)
        }

        function z() {
            pe && (!1 === et.hidden && t.requestAnimationFrame ? t.requestAnimationFrame(z) : t.setTimeout(z, pt.fx.interval), pt.fx.tick())
        }

        function I() {
            return t.setTimeout(function() {
                he = void 0
            }), he = pt.now()
        }

        function U(t, e) {
            var n, r = 0,
                i = {
                    height: t
                };
            for (e = e ? 1 : 0; r < 4; r += 2 - e) i["margin" + (n = Ft[r])] = i["padding" + n] = t;
            return e && (i.opacity = i.width = t), i
        }

        function W(t, e, n) {
            for (var r, i = ($.tweeners[e] || []).concat($.tweeners["*"]), o = 0, u = i.length; o < u; o++)
                if (r = i[o].call(n, e, t)) return r
        }

        function B(t, e) {
            var n, r, i, o, u;
            for (n in t)
                if (r = pt.camelCase(n), i = e[r], o = t[n], Array.isArray(o) && (i = o[1], o = t[n] = o[0]), n !== r && (t[r] = o, delete t[n]), (u = pt.cssHooks[r]) && "expand" in u) {
                    o = u.expand(o), delete t[r];
                    for (n in o) n in t || (t[n] = o[n], e[n] = i)
                } else e[r] = i
        }

        function $(t, e, n) {
            var r, i, o = 0,
                u = $.prefilters.length,
                a = pt.Deferred().always(function() {
                    delete s.elem
                }),
                s = function() {
                    if (i) return !1;
                    for (var e = he || I(), n = Math.max(0, c.startTime + c.duration - e), r = 1 - (n / c.duration || 0), o = 0, u = c.tweens.length; o < u; o++) c.tweens[o].run(r);
                    return a.notifyWith(t, [c, r, n]), r < 1 && u ? n : (u || a.notifyWith(t, [c, 1, 0]), a.resolveWith(t, [c]), !1)
                },
                c = a.promise({
                    elem: t,
                    props: pt.extend({}, e),
                    opts: pt.extend(!0, {
                        specialEasing: {},
                        easing: pt.easing._default
                    }, n),
                    originalProperties: e,
                    originalOptions: n,
                    startTime: he || I(),
                    duration: n.duration,
                    tweens: [],
                    createTween: function(e, n) {
                        var r = pt.Tween(t, c.opts, e, n, c.opts.specialEasing[e] || c.opts.easing);
                        return c.tweens.push(r), r
                    },
                    stop: function(e) {
                        var n = 0,
                            r = e ? c.tweens.length : 0;
                        if (i) return this;
                        for (i = !0; n < r; n++) c.tweens[n].run(1);
                        return e ? (a.notifyWith(t, [c, 1, 0]), a.resolveWith(t, [c, e])) : a.rejectWith(t, [c, e]), this
                    }
                }),
                l = c.props;
            for (B(l, c.opts.specialEasing); o < u; o++)
                if (r = $.prefilters[o].call(c, t, l, c.opts)) return pt.isFunction(r.stop) && (pt._queueHooks(c.elem, c.opts.queue).stop = pt.proxy(r.stop, r)), r;
            return pt.map(l, W, c), pt.isFunction(c.opts.start) && c.opts.start.call(t, c), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always), pt.fx.timer(pt.extend(s, {
                elem: t,
                anim: c,
                queue: c.opts.queue
            })), c
        }

        function V(t) {
            return (t.match(Nt) || []).join(" ")
        }

        function Y(t) {
            return t.getAttribute && t.getAttribute("class") || ""
        }

        function X(t, e, n, r) {
            var i;
            if (Array.isArray(e)) pt.each(e, function(e, i) {
                n || Ce.test(t) ? r(t, i) : X(t + "[" + ("object" == typeof i && null != i ? e : "") + "]", i, n, r)
            });
            else if (n || "object" !== pt.type(e)) r(t, e);
            else
                for (i in e) X(t + "[" + i + "]", e[i], n, r)
        }

        function Z(t) {
            return function(e, n) {
                "string" != typeof e && (n = e, e = "*");
                var r, i = 0,
                    o = e.toLowerCase().match(Nt) || [];
                if (pt.isFunction(n))
                    for (; r = o[i++];) "+" === r[0] ? (r = r.slice(1) || "*", (t[r] = t[r] || []).unshift(n)) : (t[r] = t[r] || []).push(n)
            }
        }

        function G(t, e, n, r) {
            function i(a) {
                var s;
                return o[a] = !0, pt.each(t[a] || [], function(t, a) {
                    var c = a(e, n, r);
                    return "string" != typeof c || u || o[c] ? u ? !(s = c) : void 0 : (e.dataTypes.unshift(c), i(c), !1)
                }), s
            }
            var o = {},
                u = t === Re;
            return i(e.dataTypes[0]) || !o["*"] && i("*")
        }

        function K(t, e) {
            var n, r, i = pt.ajaxSettings.flatOptions || {};
            for (n in e) void 0 !== e[n] && ((i[n] ? t : r || (r = {}))[n] = e[n]);
            return r && pt.extend(!0, t, r), t
        }

        function J(t, e, n) {
            for (var r, i, o, u, a = t.contents, s = t.dataTypes;
                 "*" === s[0];) s.shift(), void 0 === r && (r = t.mimeType || e.getResponseHeader("Content-Type"));
            if (r)
                for (i in a)
                    if (a[i] && a[i].test(r)) {
                        s.unshift(i);
                        break
                    }
            if (s[0] in n) o = s[0];
            else {
                for (i in n) {
                    if (!s[0] || t.converters[i + " " + s[0]]) {
                        o = i;
                        break
                    }
                    u || (u = i)
                }
                o = o || u
            }
            if (o) return o !== s[0] && s.unshift(o), n[o]
        }

        function Q(t, e, n, r) {
            var i, o, u, a, s, c = {},
                l = t.dataTypes.slice();
            if (l[1])
                for (u in t.converters) c[u.toLowerCase()] = t.converters[u];
            for (o = l.shift(); o;)
                if (t.responseFields[o] && (n[t.responseFields[o]] = e), !s && r && t.dataFilter && (e = t.dataFilter(e, t.dataType)), s = o, o = l.shift())
                    if ("*" === o) o = s;
                    else if ("*" !== s && s !== o) {
                        if (!(u = c[s + " " + o] || c["* " + o]))
                            for (i in c)
                                if ((a = i.split(" "))[1] === o && (u = c[s + " " + a[0]] || c["* " + a[0]])) {
                                    !0 === u ? u = c[i] : !0 !== c[i] && (o = a[0], l.unshift(a[1]));
                                    break
                                }
                        if (!0 !== u)
                            if (u && t.throws) e = u(e);
                            else try {
                                e = u(e)
                            } catch (t) {
                                return {
                                    state: "parsererror",
                                    error: u ? t : "No conversion from " + s + " to " + o
                                }
                            }
                    }
            return {
                state: "success",
                data: e
            }
        }
        var tt = [],
            et = t.document,
            nt = Object.getPrototypeOf,
            rt = tt.slice,
            it = tt.concat,
            ot = tt.push,
            ut = tt.indexOf,
            at = {},
            st = at.toString,
            ct = at.hasOwnProperty,
            lt = ct.toString,
            ft = lt.call(Object),
            ht = {},
            pt = function(t, e) {
                return new pt.fn.init(t, e)
            },
            dt = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            gt = /^-ms-/,
            vt = /-([a-z])/g,
            yt = function(t, e) {
                return e.toUpperCase()
            };
        pt.fn = pt.prototype = {
            jquery: "3.2.1",
            constructor: pt,
            length: 0,
            toArray: function() {
                return rt.call(this)
            },
            get: function(t) {
                return null == t ? rt.call(this) : t < 0 ? this[t + this.length] : this[t]
            },
            pushStack: function(t) {
                var e = pt.merge(this.constructor(), t);
                return e.prevObject = this, e
            },
            each: function(t) {
                return pt.each(this, t)
            },
            map: function(t) {
                return this.pushStack(pt.map(this, function(e, n) {
                    return t.call(e, n, e)
                }))
            },
            slice: function() {
                return this.pushStack(rt.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(t) {
                var e = this.length,
                    n = +t + (t < 0 ? e : 0);
                return this.pushStack(n >= 0 && n < e ? [this[n]] : [])
            },
            end: function() {
                return this.prevObject || this.constructor()
            },
            push: ot,
            sort: tt.sort,
            splice: tt.splice
        }, pt.extend = pt.fn.extend = function() {
            var t, e, n, r, i, o, u = arguments[0] || {},
                a = 1,
                s = arguments.length,
                c = !1;
            for ("boolean" == typeof u && (c = u, u = arguments[a] || {}, a++), "object" == typeof u || pt.isFunction(u) || (u = {}), a === s && (u = this, a--); a < s; a++)
                if (null != (t = arguments[a]))
                    for (e in t) n = u[e], u !== (r = t[e]) && (c && r && (pt.isPlainObject(r) || (i = Array.isArray(r))) ? (i ? (i = !1, o = n && Array.isArray(n) ? n : []) : o = n && pt.isPlainObject(n) ? n : {}, u[e] = pt.extend(c, o, r)) : void 0 !== r && (u[e] = r));
            return u
        }, pt.extend({
            expando: "jQuery" + ("3.2.1" + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(t) {
                throw new Error(t)
            },
            noop: function() {},
            isFunction: function(t) {
                return "function" === pt.type(t)
            },
            isWindow: function(t) {
                return null != t && t === t.window
            },
            isNumeric: function(t) {
                var e = pt.type(t);
                return ("number" === e || "string" === e) && !isNaN(t - parseFloat(t))
            },
            isPlainObject: function(t) {
                var e, n;
                return !(!t || "[object Object]" !== st.call(t) || (e = nt(t)) && ("function" != typeof(n = ct.call(e, "constructor") && e.constructor) || lt.call(n) !== ft))
            },
            isEmptyObject: function(t) {
                var e;
                for (e in t) return !1;
                return !0
            },
            type: function(t) {
                return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? at[st.call(t)] || "object" : typeof t
            },
            globalEval: function(t) {
                n(t)
            },
            camelCase: function(t) {
                return t.replace(gt, "ms-").replace(vt, yt)
            },
            each: function(t, e) {
                var n, i = 0;
                if (r(t))
                    for (n = t.length; i < n && !1 !== e.call(t[i], i, t[i]); i++);
                else
                    for (i in t)
                        if (!1 === e.call(t[i], i, t[i])) break;
                return t
            },
            trim: function(t) {
                return null == t ? "" : (t + "").replace(dt, "")
            },
            makeArray: function(t, e) {
                var n = e || [];
                return null != t && (r(Object(t)) ? pt.merge(n, "string" == typeof t ? [t] : t) : ot.call(n, t)), n
            },
            inArray: function(t, e, n) {
                return null == e ? -1 : ut.call(e, t, n)
            },
            merge: function(t, e) {
                for (var n = +e.length, r = 0, i = t.length; r < n; r++) t[i++] = e[r];
                return t.length = i, t
            },
            grep: function(t, e, n) {
                for (var r = [], i = 0, o = t.length, u = !n; i < o; i++) !e(t[i], i) !== u && r.push(t[i]);
                return r
            },
            map: function(t, e, n) {
                var i, o, u = 0,
                    a = [];
                if (r(t))
                    for (i = t.length; u < i; u++) null != (o = e(t[u], u, n)) && a.push(o);
                else
                    for (u in t) null != (o = e(t[u], u, n)) && a.push(o);
                return it.apply([], a)
            },
            guid: 1,
            proxy: function(t, e) {
                var n, r, i;
                if ("string" == typeof e && (n = t[e], e = t, t = n), pt.isFunction(t)) return r = rt.call(arguments, 2), i = function() {
                    return t.apply(e || this, r.concat(rt.call(arguments)))
                }, i.guid = t.guid = t.guid || pt.guid++, i
            },
            now: Date.now,
            support: ht
        }), "function" == typeof Symbol && (pt.fn[Symbol.iterator] = tt[Symbol.iterator]), pt.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(t, e) {
            at["[object " + e + "]"] = e.toLowerCase()
        });
        var mt = function(t) {
            function e(t, e, n, r) {
                var i, o, u, a, s, l, h, p = e && e.ownerDocument,
                    d = e ? e.nodeType : 9;
                if (n = n || [], "string" != typeof t || !t || 1 !== d && 9 !== d && 11 !== d) return n;
                if (!r && ((e ? e.ownerDocument || e : F) !== L && A(e), e = e || L, q)) {
                    if (11 !== d && (s = gt.exec(t)))
                        if (i = s[1]) {
                            if (9 === d) {
                                if (!(u = e.getElementById(i))) return n;
                                if (u.id === i) return n.push(u), n
                            } else if (p && (u = p.getElementById(i)) && R(e, u) && u.id === i) return n.push(u), n
                        } else {
                            if (s[2]) return G.apply(n, e.getElementsByTagName(t)), n;
                            if ((i = s[3]) && b.getElementsByClassName && e.getElementsByClassName) return G.apply(n, e.getElementsByClassName(i)), n
                        }
                    if (b.qsa && !B[t + " "] && (!j || !j.test(t))) {
                        if (1 !== d) p = e, h = t;
                        else if ("object" !== e.nodeName.toLowerCase()) {
                            for ((a = e.getAttribute("id")) ? a = a.replace(xt, bt) : e.setAttribute("id", a = H), o = (l = E(t)).length; o--;) l[o] = "#" + a + " " + f(l[o]);
                            h = l.join(","), p = vt.test(t) && c(e.parentNode) || e
                        }
                        if (h) try {
                            return G.apply(n, p.querySelectorAll(h)), n
                        } catch (t) {} finally {
                            a === H && e.removeAttribute("id")
                        }
                    }
                }
                return T(t.replace(ot, "$1"), e, n, r)
            }

            function n() {
                function t(n, r) {
                    return e.push(n + " ") > w.cacheLength && delete t[e.shift()], t[n + " "] = r
                }
                var e = [];
                return t
            }

            function r(t) {
                return t[H] = !0, t
            }

            function i(t) {
                var e = L.createElement("fieldset");
                try {
                    return !!t(e)
                } catch (t) {
                    return !1
                } finally {
                    e.parentNode && e.parentNode.removeChild(e), e = null
                }
            }

            function o(t, e) {
                for (var n = t.split("|"), r = n.length; r--;) w.attrHandle[n[r]] = e
            }

            function u(t, e) {
                var n = e && t,
                    r = n && 1 === t.nodeType && 1 === e.nodeType && t.sourceIndex - e.sourceIndex;
                if (r) return r;
                if (n)
                    for (; n = n.nextSibling;)
                        if (n === e) return -1;
                return t ? 1 : -1
            }

            function a(t) {
                return function(e) {
                    return "form" in e ? e.parentNode && !1 === e.disabled ? "label" in e ? "label" in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && Mt(e) === t : e.disabled === t : "label" in e && e.disabled === t
                }
            }

            function s(t) {
                return r(function(e) {
                    return e = +e, r(function(n, r) {
                        for (var i, o = t([], n.length, e), u = o.length; u--;) n[i = o[u]] && (n[i] = !(r[i] = n[i]))
                    })
                })
            }

            function c(t) {
                return t && void 0 !== t.getElementsByTagName && t
            }

            function l() {}

            function f(t) {
                for (var e = 0, n = t.length, r = ""; e < n; e++) r += t[e].value;
                return r
            }

            function h(t, e, n) {
                var r = e.dir,
                    i = e.next,
                    o = i || r,
                    u = n && "parentNode" === o,
                    a = I++;
                return e.first ? function(e, n, i) {
                    for (; e = e[r];)
                        if (1 === e.nodeType || u) return t(e, n, i);
                    return !1
                } : function(e, n, s) {
                    var c, l, f, h = [z, a];
                    if (s) {
                        for (; e = e[r];)
                            if ((1 === e.nodeType || u) && t(e, n, s)) return !0
                    } else
                        for (; e = e[r];)
                            if (1 === e.nodeType || u)
                                if (f = e[H] || (e[H] = {}), l = f[e.uniqueID] || (f[e.uniqueID] = {}), i && i === e.nodeName.toLowerCase()) e = e[r] || e;
                                else {
                                    if ((c = l[o]) && c[0] === z && c[1] === a) return h[2] = c[2];
                                    if (l[o] = h, h[2] = t(e, n, s)) return !0
                                } return !1
                }
            }

            function p(t) {
                return t.length > 1 ? function(e, n, r) {
                    for (var i = t.length; i--;)
                        if (!t[i](e, n, r)) return !1;
                    return !0
                } : t[0]
            }

            function d(t, n, r) {
                for (var i = 0, o = n.length; i < o; i++) e(t, n[i], r);
                return r
            }

            function g(t, e, n, r, i) {
                for (var o, u = [], a = 0, s = t.length, c = null != e; a < s; a++)(o = t[a]) && (n && !n(o, r, i) || (u.push(o), c && e.push(a)));
                return u
            }

            function v(t, e, n, i, o, u) {
                return i && !i[H] && (i = v(i)), o && !o[H] && (o = v(o, u)), r(function(r, u, a, s) {
                    var c, l, f, h = [],
                        p = [],
                        v = u.length,
                        y = r || d(e || "*", a.nodeType ? [a] : a, []),
                        m = !t || !r && e ? y : g(y, h, t, a, s),
                        x = n ? o || (r ? t : v || i) ? [] : u : m;
                    if (n && n(m, x, a, s), i)
                        for (c = g(x, p), i(c, [], a, s), l = c.length; l--;)(f = c[l]) && (x[p[l]] = !(m[p[l]] = f));
                    if (r) {
                        if (o || t) {
                            if (o) {
                                for (c = [], l = x.length; l--;)(f = x[l]) && c.push(m[l] = f);
                                o(null, x = [], c, s)
                            }
                            for (l = x.length; l--;)(f = x[l]) && (c = o ? J(r, f) : h[l]) > -1 && (r[c] = !(u[c] = f))
                        }
                    } else x = g(x === u ? x.splice(v, x.length) : x), o ? o(null, u, x, s) : G.apply(u, x)
                })
            }

            function y(t) {
                for (var e, n, r, i = t.length, o = w.relative[t[0].type], u = o || w.relative[" "], a = o ? 1 : 0, s = h(function(t) {
                    return t === e
                }, u, !0), c = h(function(t) {
                    return J(e, t) > -1
                }, u, !0), l = [function(t, n, r) {
                    var i = !o && (r || n !== S) || ((e = n).nodeType ? s(t, n, r) : c(t, n, r));
                    return e = null, i
                }]; a < i; a++)
                    if (n = w.relative[t[a].type]) l = [h(p(l), n)];
                    else {
                        if ((n = w.filter[t[a].type].apply(null, t[a].matches))[H]) {
                            for (r = ++a; r < i && !w.relative[t[r].type]; r++);
                            return v(a > 1 && p(l), a > 1 && f(t.slice(0, a - 1).concat({
                                value: " " === t[a - 2].type ? "*" : ""
                            })).replace(ot, "$1"), n, a < r && y(t.slice(a, r)), r < i && y(t = t.slice(r)), r < i && f(t))
                        }
                        l.push(n)
                    }
                return p(l)
            }

            function m(t, n) {
                var i = n.length > 0,
                    o = t.length > 0,
                    u = function(r, u, a, s, c) {
                        var l, f, h, p = 0,
                            d = "0",
                            v = r && [],
                            y = [],
                            m = S,
                            x = r || o && w.find.TAG("*", c),
                            b = z += null == m ? 1 : Math.random() || .1,
                            M = x.length;
                        for (c && (S = u === L || u || c); d !== M && null != (l = x[d]); d++) {
                            if (o && l) {
                                for (f = 0, u || l.ownerDocument === L || (A(l), a = !q); h = t[f++];)
                                    if (h(l, u || L, a)) {
                                        s.push(l);
                                        break
                                    }
                                c && (z = b)
                            }
                            i && ((l = !h && l) && p--, r && v.push(l))
                        }
                        if (p += d, i && d !== p) {
                            for (f = 0; h = n[f++];) h(v, y, u, a);
                            if (r) {
                                if (p > 0)
                                    for (; d--;) v[d] || y[d] || (y[d] = X.call(s));
                                y = g(y)
                            }
                            G.apply(s, y), c && !r && y.length > 0 && p + n.length > 1 && e.uniqueSort(s)
                        }
                        return c && (z = b, S = m), v
                    };
                return i ? r(u) : u
            }
            var x, b, w, M, k, E, C, T, S, N, _, A, L, D, q, j, P, O, R, H = "sizzle" + 1 * new Date,
                F = t.document,
                z = 0,
                I = 0,
                U = n(),
                W = n(),
                B = n(),
                $ = function(t, e) {
                    return t === e && (_ = !0), 0
                },
                V = {}.hasOwnProperty,
                Y = [],
                X = Y.pop,
                Z = Y.push,
                G = Y.push,
                K = Y.slice,
                J = function(t, e) {
                    for (var n = 0, r = t.length; n < r; n++)
                        if (t[n] === e) return n;
                    return -1
                },
                Q = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                tt = "[\\x20\\t\\r\\n\\f]",
                et = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
                nt = "\\[" + tt + "*(" + et + ")(?:" + tt + "*([*^$|!~]?=)" + tt + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + et + "))|)" + tt + "*\\]",
                rt = ":(" + et + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + nt + ")*)|.*)\\)|)",
                it = new RegExp(tt + "+", "g"),
                ot = new RegExp("^" + tt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + tt + "+$", "g"),
                ut = new RegExp("^" + tt + "*," + tt + "*"),
                at = new RegExp("^" + tt + "*([>+~]|" + tt + ")" + tt + "*"),
                st = new RegExp("=" + tt + "*([^\\]'\"]*?)" + tt + "*\\]", "g"),
                ct = new RegExp(rt),
                lt = new RegExp("^" + et + "$"),
                ft = {
                    ID: new RegExp("^#(" + et + ")"),
                    CLASS: new RegExp("^\\.(" + et + ")"),
                    TAG: new RegExp("^(" + et + "|[*])"),
                    ATTR: new RegExp("^" + nt),
                    PSEUDO: new RegExp("^" + rt),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + tt + "*(even|odd|(([+-]|)(\\d*)n|)" + tt + "*(?:([+-]|)" + tt + "*(\\d+)|))" + tt + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + Q + ")$", "i"),
                    needsContext: new RegExp("^" + tt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + tt + "*((?:-\\d)?\\d*)" + tt + "*\\)|)(?=[^-]|$)", "i")
                },
                ht = /^(?:input|select|textarea|button)$/i,
                pt = /^h\d$/i,
                dt = /^[^{]+\{\s*\[native \w/,
                gt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                vt = /[+~]/,
                yt = new RegExp("\\\\([\\da-f]{1,6}" + tt + "?|(" + tt + ")|.)", "ig"),
                mt = function(t, e, n) {
                    var r = "0x" + e - 65536;
                    return r !== r || n ? e : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
                },
                xt = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
                bt = function(t, e) {
                    return e ? "\0" === t ? "�" : t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " " : "\\" + t
                },
                wt = function() {
                    A()
                },
                Mt = h(function(t) {
                    return !0 === t.disabled && ("form" in t || "label" in t)
                }, {
                    dir: "parentNode",
                    next: "legend"
                });
            try {
                G.apply(Y = K.call(F.childNodes), F.childNodes), Y[F.childNodes.length].nodeType
            } catch (t) {
                G = {
                    apply: Y.length ? function(t, e) {
                        Z.apply(t, K.call(e))
                    } : function(t, e) {
                        for (var n = t.length, r = 0; t[n++] = e[r++];);
                        t.length = n - 1
                    }
                }
            }
            b = e.support = {}, k = e.isXML = function(t) {
                var e = t && (t.ownerDocument || t).documentElement;
                return !!e && "HTML" !== e.nodeName
            }, A = e.setDocument = function(t) {
                var e, n, r = t ? t.ownerDocument || t : F;
                return r !== L && 9 === r.nodeType && r.documentElement ? (L = r, D = L.documentElement, q = !k(L), F !== L && (n = L.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", wt, !1) : n.attachEvent && n.attachEvent("onunload", wt)), b.attributes = i(function(t) {
                    return t.className = "i", !t.getAttribute("className")
                }), b.getElementsByTagName = i(function(t) {
                    return t.appendChild(L.createComment("")), !t.getElementsByTagName("*").length
                }), b.getElementsByClassName = dt.test(L.getElementsByClassName), b.getById = i(function(t) {
                    return D.appendChild(t).id = H, !L.getElementsByName || !L.getElementsByName(H).length
                }), b.getById ? (w.filter.ID = function(t) {
                    var e = t.replace(yt, mt);
                    return function(t) {
                        return t.getAttribute("id") === e
                    }
                }, w.find.ID = function(t, e) {
                    if (void 0 !== e.getElementById && q) {
                        var n = e.getElementById(t);
                        return n ? [n] : []
                    }
                }) : (w.filter.ID = function(t) {
                    var e = t.replace(yt, mt);
                    return function(t) {
                        var n = void 0 !== t.getAttributeNode && t.getAttributeNode("id");
                        return n && n.value === e
                    }
                }, w.find.ID = function(t, e) {
                    if (void 0 !== e.getElementById && q) {
                        var n, r, i, o = e.getElementById(t);
                        if (o) {
                            if ((n = o.getAttributeNode("id")) && n.value === t) return [o];
                            for (i = e.getElementsByName(t), r = 0; o = i[r++];)
                                if ((n = o.getAttributeNode("id")) && n.value === t) return [o]
                        }
                        return []
                    }
                }), w.find.TAG = b.getElementsByTagName ? function(t, e) {
                    return void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t) : b.qsa ? e.querySelectorAll(t) : void 0
                } : function(t, e) {
                    var n, r = [],
                        i = 0,
                        o = e.getElementsByTagName(t);
                    if ("*" === t) {
                        for (; n = o[i++];) 1 === n.nodeType && r.push(n);
                        return r
                    }
                    return o
                }, w.find.CLASS = b.getElementsByClassName && function(t, e) {
                    if (void 0 !== e.getElementsByClassName && q) return e.getElementsByClassName(t)
                }, P = [], j = [], (b.qsa = dt.test(L.querySelectorAll)) && (i(function(t) {
                    D.appendChild(t).innerHTML = "<a id='" + H + "'></a><select id='" + H + "-\r\\' msallowcapture=''><option selected=''></option></select>", t.querySelectorAll("[msallowcapture^='']").length && j.push("[*^$]=" + tt + "*(?:''|\"\")"), t.querySelectorAll("[selected]").length || j.push("\\[" + tt + "*(?:value|" + Q + ")"), t.querySelectorAll("[id~=" + H + "-]").length || j.push("~="), t.querySelectorAll(":checked").length || j.push(":checked"), t.querySelectorAll("a#" + H + "+*").length || j.push(".#.+[+~]")
                }), i(function(t) {
                    t.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                    var e = L.createElement("input");
                    e.setAttribute("type", "hidden"), t.appendChild(e).setAttribute("name", "D"), t.querySelectorAll("[name=d]").length && j.push("name" + tt + "*[*^$|!~]?="), 2 !== t.querySelectorAll(":enabled").length && j.push(":enabled", ":disabled"), D.appendChild(t).disabled = !0, 2 !== t.querySelectorAll(":disabled").length && j.push(":enabled", ":disabled"), t.querySelectorAll("*,:x"), j.push(",.*:")
                })), (b.matchesSelector = dt.test(O = D.matches || D.webkitMatchesSelector || D.mozMatchesSelector || D.oMatchesSelector || D.msMatchesSelector)) && i(function(t) {
                    b.disconnectedMatch = O.call(t, "*"), O.call(t, "[s!='']:x"), P.push("!=", rt)
                }), j = j.length && new RegExp(j.join("|")), P = P.length && new RegExp(P.join("|")), e = dt.test(D.compareDocumentPosition), R = e || dt.test(D.contains) ? function(t, e) {
                    var n = 9 === t.nodeType ? t.documentElement : t,
                        r = e && e.parentNode;
                    return t === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : t.compareDocumentPosition && 16 & t.compareDocumentPosition(r)))
                } : function(t, e) {
                    if (e)
                        for (; e = e.parentNode;)
                            if (e === t) return !0;
                    return !1
                }, $ = e ? function(t, e) {
                    if (t === e) return _ = !0, 0;
                    var n = !t.compareDocumentPosition - !e.compareDocumentPosition;
                    return n || (1 & (n = (t.ownerDocument || t) === (e.ownerDocument || e) ? t.compareDocumentPosition(e) : 1) || !b.sortDetached && e.compareDocumentPosition(t) === n ? t === L || t.ownerDocument === F && R(F, t) ? -1 : e === L || e.ownerDocument === F && R(F, e) ? 1 : N ? J(N, t) - J(N, e) : 0 : 4 & n ? -1 : 1)
                } : function(t, e) {
                    if (t === e) return _ = !0, 0;
                    var n, r = 0,
                        i = t.parentNode,
                        o = e.parentNode,
                        a = [t],
                        s = [e];
                    if (!i || !o) return t === L ? -1 : e === L ? 1 : i ? -1 : o ? 1 : N ? J(N, t) - J(N, e) : 0;
                    if (i === o) return u(t, e);
                    for (n = t; n = n.parentNode;) a.unshift(n);
                    for (n = e; n = n.parentNode;) s.unshift(n);
                    for (; a[r] === s[r];) r++;
                    return r ? u(a[r], s[r]) : a[r] === F ? -1 : s[r] === F ? 1 : 0
                }, L) : L
            }, e.matches = function(t, n) {
                return e(t, null, null, n)
            }, e.matchesSelector = function(t, n) {
                if ((t.ownerDocument || t) !== L && A(t), n = n.replace(st, "='$1']"), b.matchesSelector && q && !B[n + " "] && (!P || !P.test(n)) && (!j || !j.test(n))) try {
                    var r = O.call(t, n);
                    if (r || b.disconnectedMatch || t.document && 11 !== t.document.nodeType) return r
                } catch (t) {}
                return e(n, L, null, [t]).length > 0
            }, e.contains = function(t, e) {
                return (t.ownerDocument || t) !== L && A(t), R(t, e)
            }, e.attr = function(t, e) {
                (t.ownerDocument || t) !== L && A(t);
                var n = w.attrHandle[e.toLowerCase()],
                    r = n && V.call(w.attrHandle, e.toLowerCase()) ? n(t, e, !q) : void 0;
                return void 0 !== r ? r : b.attributes || !q ? t.getAttribute(e) : (r = t.getAttributeNode(e)) && r.specified ? r.value : null
            }, e.escape = function(t) {
                return (t + "").replace(xt, bt)
            }, e.error = function(t) {
                throw new Error("Syntax error, unrecognized expression: " + t)
            }, e.uniqueSort = function(t) {
                var e, n = [],
                    r = 0,
                    i = 0;
                if (_ = !b.detectDuplicates, N = !b.sortStable && t.slice(0), t.sort($), _) {
                    for (; e = t[i++];) e === t[i] && (r = n.push(i));
                    for (; r--;) t.splice(n[r], 1)
                }
                return N = null, t
            }, M = e.getText = function(t) {
                var e, n = "",
                    r = 0,
                    i = t.nodeType;
                if (i) {
                    if (1 === i || 9 === i || 11 === i) {
                        if ("string" == typeof t.textContent) return t.textContent;
                        for (t = t.firstChild; t; t = t.nextSibling) n += M(t)
                    } else if (3 === i || 4 === i) return t.nodeValue
                } else
                    for (; e = t[r++];) n += M(e);
                return n
            }, (w = e.selectors = {
                cacheLength: 50,
                createPseudo: r,
                match: ft,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(t) {
                        return t[1] = t[1].replace(yt, mt), t[3] = (t[3] || t[4] || t[5] || "").replace(yt, mt), "~=" === t[2] && (t[3] = " " + t[3] + " "), t.slice(0, 4)
                    },
                    CHILD: function(t) {
                        return t[1] = t[1].toLowerCase(), "nth" === t[1].slice(0, 3) ? (t[3] || e.error(t[0]), t[4] = +(t[4] ? t[5] + (t[6] || 1) : 2 * ("even" === t[3] || "odd" === t[3])), t[5] = +(t[7] + t[8] || "odd" === t[3])) : t[3] && e.error(t[0]), t
                    },
                    PSEUDO: function(t) {
                        var e, n = !t[6] && t[2];
                        return ft.CHILD.test(t[0]) ? null : (t[3] ? t[2] = t[4] || t[5] || "" : n && ct.test(n) && (e = E(n, !0)) && (e = n.indexOf(")", n.length - e) - n.length) && (t[0] = t[0].slice(0, e), t[2] = n.slice(0, e)), t.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(t) {
                        var e = t.replace(yt, mt).toLowerCase();
                        return "*" === t ? function() {
                            return !0
                        } : function(t) {
                            return t.nodeName && t.nodeName.toLowerCase() === e
                        }
                    },
                    CLASS: function(t) {
                        var e = U[t + " "];
                        return e || (e = new RegExp("(^|" + tt + ")" + t + "(" + tt + "|$)")) && U(t, function(t) {
                            return e.test("string" == typeof t.className && t.className || void 0 !== t.getAttribute && t.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(t, n, r) {
                        return function(i) {
                            var o = e.attr(i, t);
                            return null == o ? "!=" === n : !n || (o += "", "=" === n ? o === r : "!=" === n ? o !== r : "^=" === n ? r && 0 === o.indexOf(r) : "*=" === n ? r && o.indexOf(r) > -1 : "$=" === n ? r && o.slice(-r.length) === r : "~=" === n ? (" " + o.replace(it, " ") + " ").indexOf(r) > -1 : "|=" === n && (o === r || o.slice(0, r.length + 1) === r + "-"))
                        }
                    },
                    CHILD: function(t, e, n, r, i) {
                        var o = "nth" !== t.slice(0, 3),
                            u = "last" !== t.slice(-4),
                            a = "of-type" === e;
                        return 1 === r && 0 === i ? function(t) {
                            return !!t.parentNode
                        } : function(e, n, s) {
                            var c, l, f, h, p, d, g = o !== u ? "nextSibling" : "previousSibling",
                                v = e.parentNode,
                                y = a && e.nodeName.toLowerCase(),
                                m = !s && !a,
                                x = !1;
                            if (v) {
                                if (o) {
                                    for (; g;) {
                                        for (h = e; h = h[g];)
                                            if (a ? h.nodeName.toLowerCase() === y : 1 === h.nodeType) return !1;
                                        d = g = "only" === t && !d && "nextSibling"
                                    }
                                    return !0
                                }
                                if (d = [u ? v.firstChild : v.lastChild], u && m) {
                                    for (x = (p = (c = (l = (f = (h = v)[H] || (h[H] = {}))[h.uniqueID] || (f[h.uniqueID] = {}))[t] || [])[0] === z && c[1]) && c[2], h = p && v.childNodes[p]; h = ++p && h && h[g] || (x = p = 0) || d.pop();)
                                        if (1 === h.nodeType && ++x && h === e) {
                                            l[t] = [z, p, x];
                                            break
                                        }
                                } else if (m && (x = p = (c = (l = (f = (h = e)[H] || (h[H] = {}))[h.uniqueID] || (f[h.uniqueID] = {}))[t] || [])[0] === z && c[1]), !1 === x)
                                    for (;
                                        (h = ++p && h && h[g] || (x = p = 0) || d.pop()) && ((a ? h.nodeName.toLowerCase() !== y : 1 !== h.nodeType) || !++x || (m && ((l = (f = h[H] || (h[H] = {}))[h.uniqueID] || (f[h.uniqueID] = {}))[t] = [z, x]), h !== e)););
                                return (x -= i) === r || x % r == 0 && x / r >= 0
                            }
                        }
                    },
                    PSEUDO: function(t, n) {
                        var i, o = w.pseudos[t] || w.setFilters[t.toLowerCase()] || e.error("unsupported pseudo: " + t);
                        return o[H] ? o(n) : o.length > 1 ? (i = [t, t, "", n], w.setFilters.hasOwnProperty(t.toLowerCase()) ? r(function(t, e) {
                            for (var r, i = o(t, n), u = i.length; u--;) t[r = J(t, i[u])] = !(e[r] = i[u])
                        }) : function(t) {
                            return o(t, 0, i)
                        }) : o
                    }
                },
                pseudos: {
                    not: r(function(t) {
                        var e = [],
                            n = [],
                            i = C(t.replace(ot, "$1"));
                        return i[H] ? r(function(t, e, n, r) {
                            for (var o, u = i(t, null, r, []), a = t.length; a--;)(o = u[a]) && (t[a] = !(e[a] = o))
                        }) : function(t, r, o) {
                            return e[0] = t, i(e, null, o, n), e[0] = null, !n.pop()
                        }
                    }),
                    has: r(function(t) {
                        return function(n) {
                            return e(t, n).length > 0
                        }
                    }),
                    contains: r(function(t) {
                        return t = t.replace(yt, mt),
                            function(e) {
                                return (e.textContent || e.innerText || M(e)).indexOf(t) > -1
                            }
                    }),
                    lang: r(function(t) {
                        return lt.test(t || "") || e.error("unsupported lang: " + t), t = t.replace(yt, mt).toLowerCase(),
                            function(e) {
                                var n;
                                do {
                                    if (n = q ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) return (n = n.toLowerCase()) === t || 0 === n.indexOf(t + "-")
                                } while ((e = e.parentNode) && 1 === e.nodeType);
                                return !1
                            }
                    }),
                    target: function(e) {
                        var n = t.location && t.location.hash;
                        return n && n.slice(1) === e.id
                    },
                    root: function(t) {
                        return t === D
                    },
                    focus: function(t) {
                        return t === L.activeElement && (!L.hasFocus || L.hasFocus()) && !!(t.type || t.href || ~t.tabIndex)
                    },
                    enabled: a(!1),
                    disabled: a(!0),
                    checked: function(t) {
                        var e = t.nodeName.toLowerCase();
                        return "input" === e && !!t.checked || "option" === e && !!t.selected
                    },
                    selected: function(t) {
                        return t.parentNode && t.parentNode.selectedIndex, !0 === t.selected
                    },
                    empty: function(t) {
                        for (t = t.firstChild; t; t = t.nextSibling)
                            if (t.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(t) {
                        return !w.pseudos.empty(t)
                    },
                    header: function(t) {
                        return pt.test(t.nodeName)
                    },
                    input: function(t) {
                        return ht.test(t.nodeName)
                    },
                    button: function(t) {
                        var e = t.nodeName.toLowerCase();
                        return "input" === e && "button" === t.type || "button" === e
                    },
                    text: function(t) {
                        var e;
                        return "input" === t.nodeName.toLowerCase() && "text" === t.type && (null == (e = t.getAttribute("type")) || "text" === e.toLowerCase())
                    },
                    first: s(function() {
                        return [0]
                    }),
                    last: s(function(t, e) {
                        return [e - 1]
                    }),
                    eq: s(function(t, e, n) {
                        return [n < 0 ? n + e : n]
                    }),
                    even: s(function(t, e) {
                        for (var n = 0; n < e; n += 2) t.push(n);
                        return t
                    }),
                    odd: s(function(t, e) {
                        for (var n = 1; n < e; n += 2) t.push(n);
                        return t
                    }),
                    lt: s(function(t, e, n) {
                        for (var r = n < 0 ? n + e : n; --r >= 0;) t.push(r);
                        return t
                    }),
                    gt: s(function(t, e, n) {
                        for (var r = n < 0 ? n + e : n; ++r < e;) t.push(r);
                        return t
                    })
                }
            }).pseudos.nth = w.pseudos.eq;
            for (x in {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) w.pseudos[x] = function(t) {
                return function(e) {
                    return "input" === e.nodeName.toLowerCase() && e.type === t
                }
            }(x);
            for (x in {
                submit: !0,
                reset: !0
            }) w.pseudos[x] = function(t) {
                return function(e) {
                    var n = e.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && e.type === t
                }
            }(x);
            return l.prototype = w.filters = w.pseudos, w.setFilters = new l, E = e.tokenize = function(t, n) {
                var r, i, o, u, a, s, c, l = W[t + " "];
                if (l) return n ? 0 : l.slice(0);
                for (a = t, s = [], c = w.preFilter; a;) {
                    r && !(i = ut.exec(a)) || (i && (a = a.slice(i[0].length) || a), s.push(o = [])), r = !1, (i = at.exec(a)) && (r = i.shift(), o.push({
                        value: r,
                        type: i[0].replace(ot, " ")
                    }), a = a.slice(r.length));
                    for (u in w.filter) !(i = ft[u].exec(a)) || c[u] && !(i = c[u](i)) || (r = i.shift(), o.push({
                        value: r,
                        type: u,
                        matches: i
                    }), a = a.slice(r.length));
                    if (!r) break
                }
                return n ? a.length : a ? e.error(t) : W(t, s).slice(0)
            }, C = e.compile = function(t, e) {
                var n, r = [],
                    i = [],
                    o = B[t + " "];
                if (!o) {
                    for (e || (e = E(t)), n = e.length; n--;)(o = y(e[n]))[H] ? r.push(o) : i.push(o);
                    (o = B(t, m(i, r))).selector = t
                }
                return o
            }, T = e.select = function(t, e, n, r) {
                var i, o, u, a, s, l = "function" == typeof t && t,
                    h = !r && E(t = l.selector || t);
                if (n = n || [], 1 === h.length) {
                    if ((o = h[0] = h[0].slice(0)).length > 2 && "ID" === (u = o[0]).type && 9 === e.nodeType && q && w.relative[o[1].type]) {
                        if (!(e = (w.find.ID(u.matches[0].replace(yt, mt), e) || [])[0])) return n;
                        l && (e = e.parentNode), t = t.slice(o.shift().value.length)
                    }
                    for (i = ft.needsContext.test(t) ? 0 : o.length; i-- && (u = o[i], !w.relative[a = u.type]);)
                        if ((s = w.find[a]) && (r = s(u.matches[0].replace(yt, mt), vt.test(o[0].type) && c(e.parentNode) || e))) {
                            if (o.splice(i, 1), !(t = r.length && f(o))) return G.apply(n, r), n;
                            break
                        }
                }
                return (l || C(t, h))(r, e, !q, n, !e || vt.test(t) && c(e.parentNode) || e), n
            }, b.sortStable = H.split("").sort($).join("") === H, b.detectDuplicates = !!_, A(), b.sortDetached = i(function(t) {
                return 1 & t.compareDocumentPosition(L.createElement("fieldset"))
            }), i(function(t) {
                return t.innerHTML = "<a href='#'></a>", "#" === t.firstChild.getAttribute("href")
            }) || o("type|href|height|width", function(t, e, n) {
                if (!n) return t.getAttribute(e, "type" === e.toLowerCase() ? 1 : 2)
            }), b.attributes && i(function(t) {
                return t.innerHTML = "<input/>", t.firstChild.setAttribute("value", ""), "" === t.firstChild.getAttribute("value")
            }) || o("value", function(t, e, n) {
                if (!n && "input" === t.nodeName.toLowerCase()) return t.defaultValue
            }), i(function(t) {
                return null == t.getAttribute("disabled")
            }) || o(Q, function(t, e, n) {
                var r;
                if (!n) return !0 === t[e] ? e.toLowerCase() : (r = t.getAttributeNode(e)) && r.specified ? r.value : null
            }), e
        }(t);
        pt.find = mt, pt.expr = mt.selectors, pt.expr[":"] = pt.expr.pseudos, pt.uniqueSort = pt.unique = mt.uniqueSort, pt.text = mt.getText, pt.isXMLDoc = mt.isXML, pt.contains = mt.contains, pt.escapeSelector = mt.escape;
        var xt = function(t, e, n) {
                for (var r = [], i = void 0 !== n;
                     (t = t[e]) && 9 !== t.nodeType;)
                    if (1 === t.nodeType) {
                        if (i && pt(t).is(n)) break;
                        r.push(t)
                    }
                return r
            },
            bt = function(t, e) {
                for (var n = []; t; t = t.nextSibling) 1 === t.nodeType && t !== e && n.push(t);
                return n
            },
            wt = pt.expr.match.needsContext,
            Mt = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,
            kt = /^.[^:#\[\.,]*$/;
        pt.filter = function(t, e, n) {
            var r = e[0];
            return n && (t = ":not(" + t + ")"), 1 === e.length && 1 === r.nodeType ? pt.find.matchesSelector(r, t) ? [r] : [] : pt.find.matches(t, pt.grep(e, function(t) {
                return 1 === t.nodeType
            }))
        }, pt.fn.extend({
            find: function(t) {
                var e, n, r = this.length,
                    i = this;
                if ("string" != typeof t) return this.pushStack(pt(t).filter(function() {
                    for (e = 0; e < r; e++)
                        if (pt.contains(i[e], this)) return !0
                }));
                for (n = this.pushStack([]), e = 0; e < r; e++) pt.find(t, i[e], n);
                return r > 1 ? pt.uniqueSort(n) : n
            },
            filter: function(t) {
                return this.pushStack(o(this, t || [], !1))
            },
            not: function(t) {
                return this.pushStack(o(this, t || [], !0))
            },
            is: function(t) {
                return !!o(this, "string" == typeof t && wt.test(t) ? pt(t) : t || [], !1).length
            }
        });
        var Et, Ct = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
        (pt.fn.init = function(t, e, n) {
            var r, i;
            if (!t) return this;
            if (n = n || Et, "string" == typeof t) {
                if (!(r = "<" === t[0] && ">" === t[t.length - 1] && t.length >= 3 ? [null, t, null] : Ct.exec(t)) || !r[1] && e) return !e || e.jquery ? (e || n).find(t) : this.constructor(e).find(t);
                if (r[1]) {
                    if (e = e instanceof pt ? e[0] : e, pt.merge(this, pt.parseHTML(r[1], e && e.nodeType ? e.ownerDocument || e : et, !0)), Mt.test(r[1]) && pt.isPlainObject(e))
                        for (r in e) pt.isFunction(this[r]) ? this[r](e[r]) : this.attr(r, e[r]);
                    return this
                }
                return (i = et.getElementById(r[2])) && (this[0] = i, this.length = 1), this
            }
            return t.nodeType ? (this[0] = t, this.length = 1, this) : pt.isFunction(t) ? void 0 !== n.ready ? n.ready(t) : t(pt) : pt.makeArray(t, this)
        }).prototype = pt.fn, Et = pt(et);
        var Tt = /^(?:parents|prev(?:Until|All))/,
            St = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        pt.fn.extend({
            has: function(t) {
                var e = pt(t, this),
                    n = e.length;
                return this.filter(function() {
                    for (var t = 0; t < n; t++)
                        if (pt.contains(this, e[t])) return !0
                })
            },
            closest: function(t, e) {
                var n, r = 0,
                    i = this.length,
                    o = [],
                    u = "string" != typeof t && pt(t);
                if (!wt.test(t))
                    for (; r < i; r++)
                        for (n = this[r]; n && n !== e; n = n.parentNode)
                            if (n.nodeType < 11 && (u ? u.index(n) > -1 : 1 === n.nodeType && pt.find.matchesSelector(n, t))) {
                                o.push(n);
                                break
                            }
                return this.pushStack(o.length > 1 ? pt.uniqueSort(o) : o)
            },
            index: function(t) {
                return t ? "string" == typeof t ? ut.call(pt(t), this[0]) : ut.call(this, t.jquery ? t[0] : t) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(t, e) {
                return this.pushStack(pt.uniqueSort(pt.merge(this.get(), pt(t, e))))
            },
            addBack: function(t) {
                return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
            }
        }), pt.each({
            parent: function(t) {
                var e = t.parentNode;
                return e && 11 !== e.nodeType ? e : null
            },
            parents: function(t) {
                return xt(t, "parentNode")
            },
            parentsUntil: function(t, e, n) {
                return xt(t, "parentNode", n)
            },
            next: function(t) {
                return u(t, "nextSibling")
            },
            prev: function(t) {
                return u(t, "previousSibling")
            },
            nextAll: function(t) {
                return xt(t, "nextSibling")
            },
            prevAll: function(t) {
                return xt(t, "previousSibling")
            },
            nextUntil: function(t, e, n) {
                return xt(t, "nextSibling", n)
            },
            prevUntil: function(t, e, n) {
                return xt(t, "previousSibling", n)
            },
            siblings: function(t) {
                return bt((t.parentNode || {}).firstChild, t)
            },
            children: function(t) {
                return bt(t.firstChild)
            },
            contents: function(t) {
                return i(t, "iframe") ? t.contentDocument : (i(t, "template") && (t = t.content || t), pt.merge([], t.childNodes))
            }
        }, function(t, e) {
            pt.fn[t] = function(n, r) {
                var i = pt.map(this, e, n);
                return "Until" !== t.slice(-5) && (r = n), r && "string" == typeof r && (i = pt.filter(r, i)), this.length > 1 && (St[t] || pt.uniqueSort(i), Tt.test(t) && i.reverse()), this.pushStack(i)
            }
        });
        var Nt = /[^\x20\t\r\n\f]+/g;
        pt.Callbacks = function(t) {
            t = "string" == typeof t ? a(t) : pt.extend({}, t);
            var e, n, r, i, o = [],
                u = [],
                s = -1,
                c = function() {
                    for (i = i || t.once, r = e = !0; u.length; s = -1)
                        for (n = u.shift(); ++s < o.length;) !1 === o[s].apply(n[0], n[1]) && t.stopOnFalse && (s = o.length, n = !1);
                    t.memory || (n = !1), e = !1, i && (o = n ? [] : "")
                },
                l = {
                    add: function() {
                        return o && (n && !e && (s = o.length - 1, u.push(n)), function e(n) {
                            pt.each(n, function(n, r) {
                                pt.isFunction(r) ? t.unique && l.has(r) || o.push(r) : r && r.length && "string" !== pt.type(r) && e(r)
                            })
                        }(arguments), n && !e && c()), this
                    },
                    remove: function() {
                        return pt.each(arguments, function(t, e) {
                            for (var n;
                                 (n = pt.inArray(e, o, n)) > -1;) o.splice(n, 1), n <= s && s--
                        }), this
                    },
                    has: function(t) {
                        return t ? pt.inArray(t, o) > -1 : o.length > 0
                    },
                    empty: function() {
                        return o && (o = []), this
                    },
                    disable: function() {
                        return i = u = [], o = n = "", this
                    },
                    disabled: function() {
                        return !o
                    },
                    lock: function() {
                        return i = u = [], n || e || (o = n = ""), this
                    },
                    locked: function() {
                        return !!i
                    },
                    fireWith: function(t, n) {
                        return i || (n = [t, (n = n || []).slice ? n.slice() : n], u.push(n), e || c()), this
                    },
                    fire: function() {
                        return l.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!r
                    }
                };
            return l
        }, pt.extend({
            Deferred: function(e) {
                var n = [
                        ["notify", "progress", pt.Callbacks("memory"), pt.Callbacks("memory"), 2],
                        ["resolve", "done", pt.Callbacks("once memory"), pt.Callbacks("once memory"), 0, "resolved"],
                        ["reject", "fail", pt.Callbacks("once memory"), pt.Callbacks("once memory"), 1, "rejected"]
                    ],
                    r = "pending",
                    i = {
                        state: function() {
                            return r
                        },
                        always: function() {
                            return o.done(arguments).fail(arguments), this
                        },
                        catch: function(t) {
                            return i.then(null, t)
                        },
                        pipe: function() {
                            var t = arguments;
                            return pt.Deferred(function(e) {
                                pt.each(n, function(n, r) {
                                    var i = pt.isFunction(t[r[4]]) && t[r[4]];
                                    o[r[1]](function() {
                                        var t = i && i.apply(this, arguments);
                                        t && pt.isFunction(t.promise) ? t.promise().progress(e.notify).done(e.resolve).fail(e.reject) : e[r[0] + "With"](this, i ? [t] : arguments)
                                    })
                                }), t = null
                            }).promise()
                        },
                        then: function(e, r, i) {
                            function o(e, n, r, i) {
                                return function() {
                                    var a = this,
                                        l = arguments,
                                        f = function() {
                                            var t, f;
                                            if (!(e < u)) {
                                                if ((t = r.apply(a, l)) === n.promise()) throw new TypeError("Thenable self-resolution");
                                                f = t && ("object" == typeof t || "function" == typeof t) && t.then, pt.isFunction(f) ? i ? f.call(t, o(u, n, s, i), o(u, n, c, i)) : (u++, f.call(t, o(u, n, s, i), o(u, n, c, i), o(u, n, s, n.notifyWith))) : (r !== s && (a = void 0, l = [t]), (i || n.resolveWith)(a, l))
                                            }
                                        },
                                        h = i ? f : function() {
                                            try {
                                                f()
                                            } catch (t) {
                                                pt.Deferred.exceptionHook && pt.Deferred.exceptionHook(t, h.stackTrace), e + 1 >= u && (r !== c && (a = void 0, l = [t]), n.rejectWith(a, l))
                                            }
                                        };
                                    e ? h() : (pt.Deferred.getStackHook && (h.stackTrace = pt.Deferred.getStackHook()), t.setTimeout(h))
                                }
                            }
                            var u = 0;
                            return pt.Deferred(function(t) {
                                n[0][3].add(o(0, t, pt.isFunction(i) ? i : s, t.notifyWith)), n[1][3].add(o(0, t, pt.isFunction(e) ? e : s)), n[2][3].add(o(0, t, pt.isFunction(r) ? r : c))
                            }).promise()
                        },
                        promise: function(t) {
                            return null != t ? pt.extend(t, i) : i
                        }
                    },
                    o = {};
                return pt.each(n, function(t, e) {
                    var u = e[2],
                        a = e[5];
                    i[e[1]] = u.add, a && u.add(function() {
                        r = a
                    }, n[3 - t][2].disable, n[0][2].lock), u.add(e[3].fire), o[e[0]] = function() {
                        return o[e[0] + "With"](this === o ? void 0 : this, arguments), this
                    }, o[e[0] + "With"] = u.fireWith
                }), i.promise(o), e && e.call(o, o), o
            },
            when: function(t) {
                var e = arguments.length,
                    n = e,
                    r = Array(n),
                    i = rt.call(arguments),
                    o = pt.Deferred(),
                    u = function(t) {
                        return function(n) {
                            r[t] = this, i[t] = arguments.length > 1 ? rt.call(arguments) : n, --e || o.resolveWith(r, i)
                        }
                    };
                if (e <= 1 && (l(t, o.done(u(n)).resolve, o.reject, !e), "pending" === o.state() || pt.isFunction(i[n] && i[n].then))) return o.then();
                for (; n--;) l(i[n], u(n), o.reject);
                return o.promise()
            }
        });
        var _t = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        pt.Deferred.exceptionHook = function(e, n) {
            t.console && t.console.warn && e && _t.test(e.name) && t.console.warn("jQuery.Deferred exception: " + e.message, e.stack, n)
        }, pt.readyException = function(e) {
            t.setTimeout(function() {
                throw e
            })
        };
        var At = pt.Deferred();
        pt.fn.ready = function(t) {
            return At.then(t).catch(function(t) {
                pt.readyException(t)
            }), this
        }, pt.extend({
            isReady: !1,
            readyWait: 1,
            ready: function(t) {
                (!0 === t ? --pt.readyWait : pt.isReady) || (pt.isReady = !0, !0 !== t && --pt.readyWait > 0 || At.resolveWith(et, [pt]))
            }
        }), pt.ready.then = At.then, "complete" === et.readyState || "loading" !== et.readyState && !et.documentElement.doScroll ? t.setTimeout(pt.ready) : (et.addEventListener("DOMContentLoaded", f), t.addEventListener("load", f));
        var Lt = function(t, e, n, r, i, o, u) {
                var a = 0,
                    s = t.length,
                    c = null == n;
                if ("object" === pt.type(n)) {
                    i = !0;
                    for (a in n) Lt(t, e, a, n[a], !0, o, u)
                } else if (void 0 !== r && (i = !0, pt.isFunction(r) || (u = !0), c && (u ? (e.call(t, r), e = null) : (c = e, e = function(t, e, n) {
                        return c.call(pt(t), n)
                    })), e))
                    for (; a < s; a++) e(t[a], n, u ? r : r.call(t[a], a, e(t[a], n)));
                return i ? t : c ? e.call(t) : s ? e(t[0], n) : o
            },
            Dt = function(t) {
                return 1 === t.nodeType || 9 === t.nodeType || !+t.nodeType
            };
        h.uid = 1, h.prototype = {
            cache: function(t) {
                var e = t[this.expando];
                return e || (e = {}, Dt(t) && (t.nodeType ? t[this.expando] = e : Object.defineProperty(t, this.expando, {
                    value: e,
                    configurable: !0
                }))), e
            },
            set: function(t, e, n) {
                var r, i = this.cache(t);
                if ("string" == typeof e) i[pt.camelCase(e)] = n;
                else
                    for (r in e) i[pt.camelCase(r)] = e[r];
                return i
            },
            get: function(t, e) {
                return void 0 === e ? this.cache(t) : t[this.expando] && t[this.expando][pt.camelCase(e)]
            },
            access: function(t, e, n) {
                return void 0 === e || e && "string" == typeof e && void 0 === n ? this.get(t, e) : (this.set(t, e, n), void 0 !== n ? n : e)
            },
            remove: function(t, e) {
                var n, r = t[this.expando];
                if (void 0 !== r) {
                    if (void 0 !== e) {
                        n = (e = Array.isArray(e) ? e.map(pt.camelCase) : (e = pt.camelCase(e)) in r ? [e] : e.match(Nt) || []).length;
                        for (; n--;) delete r[e[n]]
                    }(void 0 === e || pt.isEmptyObject(r)) && (t.nodeType ? t[this.expando] = void 0 : delete t[this.expando])
                }
            },
            hasData: function(t) {
                var e = t[this.expando];
                return void 0 !== e && !pt.isEmptyObject(e)
            }
        };
        var qt = new h,
            jt = new h,
            Pt = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            Ot = /[A-Z]/g;
        pt.extend({
            hasData: function(t) {
                return jt.hasData(t) || qt.hasData(t)
            },
            data: function(t, e, n) {
                return jt.access(t, e, n)
            },
            removeData: function(t, e) {
                jt.remove(t, e)
            },
            _data: function(t, e, n) {
                return qt.access(t, e, n)
            },
            _removeData: function(t, e) {
                qt.remove(t, e)
            }
        }), pt.fn.extend({
            data: function(t, e) {
                var n, r, i, o = this[0],
                    u = o && o.attributes;
                if (void 0 === t) {
                    if (this.length && (i = jt.get(o), 1 === o.nodeType && !qt.get(o, "hasDataAttrs"))) {
                        for (n = u.length; n--;) u[n] && 0 === (r = u[n].name).indexOf("data-") && (r = pt.camelCase(r.slice(5)), d(o, r, i[r]));
                        qt.set(o, "hasDataAttrs", !0)
                    }
                    return i
                }
                return "object" == typeof t ? this.each(function() {
                    jt.set(this, t)
                }) : Lt(this, function(e) {
                    var n;
                    if (o && void 0 === e) {
                        if (void 0 !== (n = jt.get(o, t))) return n;
                        if (void 0 !== (n = d(o, t))) return n
                    } else this.each(function() {
                        jt.set(this, t, e)
                    })
                }, null, e, arguments.length > 1, null, !0)
            },
            removeData: function(t) {
                return this.each(function() {
                    jt.remove(this, t)
                })
            }
        }), pt.extend({
            queue: function(t, e, n) {
                var r;
                if (t) return e = (e || "fx") + "queue", r = qt.get(t, e), n && (!r || Array.isArray(n) ? r = qt.access(t, e, pt.makeArray(n)) : r.push(n)), r || []
            },
            dequeue: function(t, e) {
                e = e || "fx";
                var n = pt.queue(t, e),
                    r = n.length,
                    i = n.shift(),
                    o = pt._queueHooks(t, e);
                "inprogress" === i && (i = n.shift(), r--), i && ("fx" === e && n.unshift("inprogress"), delete o.stop, i.call(t, function() {
                    pt.dequeue(t, e)
                }, o)), !r && o && o.empty.fire()
            },
            _queueHooks: function(t, e) {
                var n = e + "queueHooks";
                return qt.get(t, n) || qt.access(t, n, {
                    empty: pt.Callbacks("once memory").add(function() {
                        qt.remove(t, [e + "queue", n])
                    })
                })
            }
        }), pt.fn.extend({
            queue: function(t, e) {
                var n = 2;
                return "string" != typeof t && (e = t, t = "fx", n--), arguments.length < n ? pt.queue(this[0], t) : void 0 === e ? this : this.each(function() {
                    var n = pt.queue(this, t, e);
                    pt._queueHooks(this, t), "fx" === t && "inprogress" !== n[0] && pt.dequeue(this, t)
                })
            },
            dequeue: function(t) {
                return this.each(function() {
                    pt.dequeue(this, t)
                })
            },
            clearQueue: function(t) {
                return this.queue(t || "fx", [])
            },
            promise: function(t, e) {
                var n, r = 1,
                    i = pt.Deferred(),
                    o = this,
                    u = this.length,
                    a = function() {
                        --r || i.resolveWith(o, [o])
                    };
                for ("string" != typeof t && (e = t, t = void 0), t = t || "fx"; u--;)(n = qt.get(o[u], t + "queueHooks")) && n.empty && (r++, n.empty.add(a));
                return a(), i.promise(e)
            }
        });
        var Rt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            Ht = new RegExp("^(?:([+-])=|)(" + Rt + ")([a-z%]*)$", "i"),
            Ft = ["Top", "Right", "Bottom", "Left"],
            zt = function(t, e) {
                return "none" === (t = e || t).style.display || "" === t.style.display && pt.contains(t.ownerDocument, t) && "none" === pt.css(t, "display")
            },
            It = function(t, e, n, r) {
                var i, o, u = {};
                for (o in e) u[o] = t.style[o], t.style[o] = e[o];
                i = n.apply(t, r || []);
                for (o in e) t.style[o] = u[o];
                return i
            },
            Ut = {};
        pt.fn.extend({
            show: function() {
                return y(this, !0)
            },
            hide: function() {
                return y(this)
            },
            toggle: function(t) {
                return "boolean" == typeof t ? t ? this.show() : this.hide() : this.each(function() {
                    zt(this) ? pt(this).show() : pt(this).hide()
                })
            }
        });
        var Wt = /^(?:checkbox|radio)$/i,
            Bt = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
            $t = /^$|\/(?:java|ecma)script/i,
            Vt = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                thead: [1, "<table>", "</table>"],
                col: [2, "<table><colgroup>", "</colgroup></table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: [0, "", ""]
            };
        Vt.optgroup = Vt.option, Vt.tbody = Vt.tfoot = Vt.colgroup = Vt.caption = Vt.thead, Vt.th = Vt.td;
        var Yt = /<|&#?\w+;/;
        ! function() {
            var t = et.createDocumentFragment().appendChild(et.createElement("div")),
                e = et.createElement("input");
            e.setAttribute("type", "radio"), e.setAttribute("checked", "checked"), e.setAttribute("name", "t"), t.appendChild(e), ht.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, t.innerHTML = "<textarea>x</textarea>", ht.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue
        }();
        var Xt = et.documentElement,
            Zt = /^key/,
            Gt = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
            Kt = /^([^.]*)(?:\.(.+)|)/;
        pt.event = {
            global: {},
            add: function(t, e, n, r, i) {
                var o, u, a, s, c, l, f, h, p, d, g, v = qt.get(t);
                if (v)
                    for (n.handler && (n = (o = n).handler, i = o.selector), i && pt.find.matchesSelector(Xt, i), n.guid || (n.guid = pt.guid++), (s = v.events) || (s = v.events = {}), (u = v.handle) || (u = v.handle = function(e) {
                        return void 0 !== pt && pt.event.triggered !== e.type ? pt.event.dispatch.apply(t, arguments) : void 0
                    }), c = (e = (e || "").match(Nt) || [""]).length; c--;) p = g = (a = Kt.exec(e[c]) || [])[1], d = (a[2] || "").split(".").sort(), p && (f = pt.event.special[p] || {}, p = (i ? f.delegateType : f.bindType) || p, f = pt.event.special[p] || {}, l = pt.extend({
                        type: p,
                        origType: g,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: i,
                        needsContext: i && pt.expr.match.needsContext.test(i),
                        namespace: d.join(".")
                    }, o), (h = s[p]) || ((h = s[p] = []).delegateCount = 0, f.setup && !1 !== f.setup.call(t, r, d, u) || t.addEventListener && t.addEventListener(p, u)), f.add && (f.add.call(t, l), l.handler.guid || (l.handler.guid = n.guid)), i ? h.splice(h.delegateCount++, 0, l) : h.push(l), pt.event.global[p] = !0)
            },
            remove: function(t, e, n, r, i) {
                var o, u, a, s, c, l, f, h, p, d, g, v = qt.hasData(t) && qt.get(t);
                if (v && (s = v.events)) {
                    for (c = (e = (e || "").match(Nt) || [""]).length; c--;)
                        if (a = Kt.exec(e[c]) || [], p = g = a[1], d = (a[2] || "").split(".").sort(), p) {
                            for (f = pt.event.special[p] || {}, h = s[p = (r ? f.delegateType : f.bindType) || p] || [], a = a[2] && new RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)"), u = o = h.length; o--;) l = h[o], !i && g !== l.origType || n && n.guid !== l.guid || a && !a.test(l.namespace) || r && r !== l.selector && ("**" !== r || !l.selector) || (h.splice(o, 1), l.selector && h.delegateCount--, f.remove && f.remove.call(t, l));
                            u && !h.length && (f.teardown && !1 !== f.teardown.call(t, d, v.handle) || pt.removeEvent(t, p, v.handle), delete s[p])
                        } else
                            for (p in s) pt.event.remove(t, p + e[c], n, r, !0);
                    pt.isEmptyObject(s) && qt.remove(t, "handle events")
                }
            },
            dispatch: function(t) {
                var e, n, r, i, o, u, a = pt.event.fix(t),
                    s = new Array(arguments.length),
                    c = (qt.get(this, "events") || {})[a.type] || [],
                    l = pt.event.special[a.type] || {};
                for (s[0] = a, e = 1; e < arguments.length; e++) s[e] = arguments[e];
                if (a.delegateTarget = this, !l.preDispatch || !1 !== l.preDispatch.call(this, a)) {
                    for (u = pt.event.handlers.call(this, a, c), e = 0;
                         (i = u[e++]) && !a.isPropagationStopped();)
                        for (a.currentTarget = i.elem, n = 0;
                             (o = i.handlers[n++]) && !a.isImmediatePropagationStopped();) a.rnamespace && !a.rnamespace.test(o.namespace) || (a.handleObj = o, a.data = o.data, void 0 !== (r = ((pt.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s)) && !1 === (a.result = r) && (a.preventDefault(), a.stopPropagation()));
                    return l.postDispatch && l.postDispatch.call(this, a), a.result
                }
            },
            handlers: function(t, e) {
                var n, r, i, o, u, a = [],
                    s = e.delegateCount,
                    c = t.target;
                if (s && c.nodeType && !("click" === t.type && t.button >= 1))
                    for (; c !== this; c = c.parentNode || this)
                        if (1 === c.nodeType && ("click" !== t.type || !0 !== c.disabled)) {
                            for (o = [], u = {}, n = 0; n < s; n++) void 0 === u[i = (r = e[n]).selector + " "] && (u[i] = r.needsContext ? pt(i, this).index(c) > -1 : pt.find(i, this, null, [c]).length), u[i] && o.push(r);
                            o.length && a.push({
                                elem: c,
                                handlers: o
                            })
                        }
                return c = this, s < e.length && a.push({
                    elem: c,
                    handlers: e.slice(s)
                }), a
            },
            addProp: function(t, e) {
                Object.defineProperty(pt.Event.prototype, t, {
                    enumerable: !0,
                    configurable: !0,
                    get: pt.isFunction(e) ? function() {
                        if (this.originalEvent) return e(this.originalEvent)
                    } : function() {
                        if (this.originalEvent) return this.originalEvent[t]
                    },
                    set: function(e) {
                        Object.defineProperty(this, t, {
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                            value: e
                        })
                    }
                })
            },
            fix: function(t) {
                return t[pt.expando] ? t : new pt.Event(t)
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== k() && this.focus) return this.focus(), !1
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        if (this === k() && this.blur) return this.blur(), !1
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        if ("checkbox" === this.type && this.click && i(this, "input")) return this.click(), !1
                    },
                    _default: function(t) {
                        return i(t.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(t) {
                        void 0 !== t.result && t.originalEvent && (t.originalEvent.returnValue = t.result)
                    }
                }
            }
        }, pt.removeEvent = function(t, e, n) {
            t.removeEventListener && t.removeEventListener(e, n)
        }, pt.Event = function(t, e) {
            if (!(this instanceof pt.Event)) return new pt.Event(t, e);
            t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || void 0 === t.defaultPrevented && !1 === t.returnValue ? w : M, this.target = t.target && 3 === t.target.nodeType ? t.target.parentNode : t.target, this.currentTarget = t.currentTarget, this.relatedTarget = t.relatedTarget) : this.type = t, e && pt.extend(this, e), this.timeStamp = t && t.timeStamp || pt.now(), this[pt.expando] = !0
        }, pt.Event.prototype = {
            constructor: pt.Event,
            isDefaultPrevented: M,
            isPropagationStopped: M,
            isImmediatePropagationStopped: M,
            isSimulated: !1,
            preventDefault: function() {
                var t = this.originalEvent;
                this.isDefaultPrevented = w, t && !this.isSimulated && t.preventDefault()
            },
            stopPropagation: function() {
                var t = this.originalEvent;
                this.isPropagationStopped = w, t && !this.isSimulated && t.stopPropagation()
            },
            stopImmediatePropagation: function() {
                var t = this.originalEvent;
                this.isImmediatePropagationStopped = w, t && !this.isSimulated && t.stopImmediatePropagation(), this.stopPropagation()
            }
        }, pt.each({
            altKey: !0,
            bubbles: !0,
            cancelable: !0,
            changedTouches: !0,
            ctrlKey: !0,
            detail: !0,
            eventPhase: !0,
            metaKey: !0,
            pageX: !0,
            pageY: !0,
            shiftKey: !0,
            view: !0,
            char: !0,
            charCode: !0,
            key: !0,
            keyCode: !0,
            button: !0,
            buttons: !0,
            clientX: !0,
            clientY: !0,
            offsetX: !0,
            offsetY: !0,
            pointerId: !0,
            pointerType: !0,
            screenX: !0,
            screenY: !0,
            targetTouches: !0,
            toElement: !0,
            touches: !0,
            which: function(t) {
                var e = t.button;
                return null == t.which && Zt.test(t.type) ? null != t.charCode ? t.charCode : t.keyCode : !t.which && void 0 !== e && Gt.test(t.type) ? 1 & e ? 1 : 2 & e ? 3 : 4 & e ? 2 : 0 : t.which
            }
        }, pt.event.addProp), pt.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(t, e) {
            pt.event.special[t] = {
                delegateType: e,
                bindType: e,
                handle: function(t) {
                    var n, r = this,
                        i = t.relatedTarget,
                        o = t.handleObj;
                    return i && (i === r || pt.contains(r, i)) || (t.type = o.origType, n = o.handler.apply(this, arguments), t.type = e), n
                }
            }
        }), pt.fn.extend({
            on: function(t, e, n, r) {
                return E(this, t, e, n, r)
            },
            one: function(t, e, n, r) {
                return E(this, t, e, n, r, 1)
            },
            off: function(t, e, n) {
                var r, i;
                if (t && t.preventDefault && t.handleObj) return r = t.handleObj, pt(t.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
                if ("object" == typeof t) {
                    for (i in t) this.off(i, e, t[i]);
                    return this
                }
                return !1 !== e && "function" != typeof e || (n = e, e = void 0), !1 === n && (n = M), this.each(function() {
                    pt.event.remove(this, t, n, e)
                })
            }
        });
        var Jt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
            Qt = /<script|<style|<link/i,
            te = /checked\s*(?:[^=]|=\s*.checked.)/i,
            ee = /^true\/(.*)/,
            ne = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
        pt.extend({
            htmlPrefilter: function(t) {
                return t.replace(Jt, "<$1></$2>")
            },
            clone: function(t, e, n) {
                var r, i, o, u, a = t.cloneNode(!0),
                    s = pt.contains(t.ownerDocument, t);
                if (!(ht.noCloneChecked || 1 !== t.nodeType && 11 !== t.nodeType || pt.isXMLDoc(t)))
                    for (u = m(a), r = 0, i = (o = m(t)).length; r < i; r++) _(o[r], u[r]);
                if (e)
                    if (n)
                        for (o = o || m(t), u = u || m(a), r = 0, i = o.length; r < i; r++) N(o[r], u[r]);
                    else N(t, a);
                return (u = m(a, "script")).length > 0 && x(u, !s && m(t, "script")), a
            },
            cleanData: function(t) {
                for (var e, n, r, i = pt.event.special, o = 0; void 0 !== (n = t[o]); o++)
                    if (Dt(n)) {
                        if (e = n[qt.expando]) {
                            if (e.events)
                                for (r in e.events) i[r] ? pt.event.remove(n, r) : pt.removeEvent(n, r, e.handle);
                            n[qt.expando] = void 0
                        }
                        n[jt.expando] && (n[jt.expando] = void 0)
                    }
            }
        }), pt.fn.extend({
            detach: function(t) {
                return L(this, t, !0)
            },
            remove: function(t) {
                return L(this, t)
            },
            text: function(t) {
                return Lt(this, function(t) {
                    return void 0 === t ? pt.text(this) : this.empty().each(function() {
                        1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = t)
                    })
                }, null, t, arguments.length)
            },
            append: function() {
                return A(this, arguments, function(t) {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || C(this, t).appendChild(t)
                })
            },
            prepend: function() {
                return A(this, arguments, function(t) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var e = C(this, t);
                        e.insertBefore(t, e.firstChild)
                    }
                })
            },
            before: function() {
                return A(this, arguments, function(t) {
                    this.parentNode && this.parentNode.insertBefore(t, this)
                })
            },
            after: function() {
                return A(this, arguments, function(t) {
                    this.parentNode && this.parentNode.insertBefore(t, this.nextSibling)
                })
            },
            empty: function() {
                for (var t, e = 0; null != (t = this[e]); e++) 1 === t.nodeType && (pt.cleanData(m(t, !1)), t.textContent = "");
                return this
            },
            clone: function(t, e) {
                return t = null != t && t, e = null == e ? t : e, this.map(function() {
                    return pt.clone(this, t, e)
                })
            },
            html: function(t) {
                return Lt(this, function(t) {
                    var e = this[0] || {},
                        n = 0,
                        r = this.length;
                    if (void 0 === t && 1 === e.nodeType) return e.innerHTML;
                    if ("string" == typeof t && !Qt.test(t) && !Vt[(Bt.exec(t) || ["", ""])[1].toLowerCase()]) {
                        t = pt.htmlPrefilter(t);
                        try {
                            for (; n < r; n++) 1 === (e = this[n] || {}).nodeType && (pt.cleanData(m(e, !1)), e.innerHTML = t);
                            e = 0
                        } catch (t) {}
                    }
                    e && this.empty().append(t)
                }, null, t, arguments.length)
            },
            replaceWith: function() {
                var t = [];
                return A(this, arguments, function(e) {
                    var n = this.parentNode;
                    pt.inArray(this, t) < 0 && (pt.cleanData(m(this)), n && n.replaceChild(e, this))
                }, t)
            }
        }), pt.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(t, e) {
            pt.fn[t] = function(t) {
                for (var n, r = [], i = pt(t), o = i.length - 1, u = 0; u <= o; u++) n = u === o ? this : this.clone(!0), pt(i[u])[e](n), ot.apply(r, n.get());
                return this.pushStack(r)
            }
        });
        var re = /^margin/,
            ie = new RegExp("^(" + Rt + ")(?!px)[a-z%]+$", "i"),
            oe = function(e) {
                var n = e.ownerDocument.defaultView;
                return n && n.opener || (n = t), n.getComputedStyle(e)
            };
        ! function() {
            function e() {
                if (a) {
                    a.style.cssText = "box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", a.innerHTML = "", Xt.appendChild(u);
                    var e = t.getComputedStyle(a);
                    n = "1%" !== e.top, o = "2px" === e.marginLeft, r = "4px" === e.width, a.style.marginRight = "50%", i = "4px" === e.marginRight, Xt.removeChild(u), a = null
                }
            }
            var n, r, i, o, u = et.createElement("div"),
                a = et.createElement("div");
            a.style && (a.style.backgroundClip = "content-box", a.cloneNode(!0).style.backgroundClip = "", ht.clearCloneStyle = "content-box" === a.style.backgroundClip, u.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", u.appendChild(a), pt.extend(ht, {
                pixelPosition: function() {
                    return e(), n
                },
                boxSizingReliable: function() {
                    return e(), r
                },
                pixelMarginRight: function() {
                    return e(), i
                },
                reliableMarginLeft: function() {
                    return e(), o
                }
            }))
        }();
        var ue = /^(none|table(?!-c[ea]).+)/,
            ae = /^--/,
            se = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            ce = {
                letterSpacing: "0",
                fontWeight: "400"
            },
            le = ["Webkit", "Moz", "ms"],
            fe = et.createElement("div").style;
        pt.extend({
            cssHooks: {
                opacity: {
                    get: function(t, e) {
                        if (e) {
                            var n = D(t, "opacity");
                            return "" === n ? "1" : n
                        }
                    }
                }
            },
            cssNumber: {
                animationIterationCount: !0,
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                float: "cssFloat"
            },
            style: function(t, e, n, r) {
                if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
                    var i, o, u, a = pt.camelCase(e),
                        s = ae.test(e),
                        c = t.style;
                    if (s || (e = P(a)), u = pt.cssHooks[e] || pt.cssHooks[a], void 0 === n) return u && "get" in u && void 0 !== (i = u.get(t, !1, r)) ? i : c[e];
                    "string" == (o = typeof n) && (i = Ht.exec(n)) && i[1] && (n = g(t, e, i), o = "number"), null != n && n === n && ("number" === o && (n += i && i[3] || (pt.cssNumber[a] ? "" : "px")), ht.clearCloneStyle || "" !== n || 0 !== e.indexOf("background") || (c[e] = "inherit"), u && "set" in u && void 0 === (n = u.set(t, n, r)) || (s ? c.setProperty(e, n) : c[e] = n))
                }
            },
            css: function(t, e, n, r) {
                var i, o, u, a = pt.camelCase(e);
                return ae.test(e) || (e = P(a)), (u = pt.cssHooks[e] || pt.cssHooks[a]) && "get" in u && (i = u.get(t, !0, n)), void 0 === i && (i = D(t, e, r)), "normal" === i && e in ce && (i = ce[e]), "" === n || n ? (o = parseFloat(i), !0 === n || isFinite(o) ? o || 0 : i) : i
            }
        }), pt.each(["height", "width"], function(t, e) {
            pt.cssHooks[e] = {
                get: function(t, n, r) {
                    if (n) return !ue.test(pt.css(t, "display")) || t.getClientRects().length && t.getBoundingClientRect().width ? H(t, e, r) : It(t, se, function() {
                        return H(t, e, r)
                    })
                },
                set: function(t, n, r) {
                    var i, o = r && oe(t),
                        u = r && R(t, e, r, "border-box" === pt.css(t, "boxSizing", !1, o), o);
                    return u && (i = Ht.exec(n)) && "px" !== (i[3] || "px") && (t.style[e] = n, n = pt.css(t, e)), O(0, n, u)
                }
            }
        }), pt.cssHooks.marginLeft = q(ht.reliableMarginLeft, function(t, e) {
            if (e) return (parseFloat(D(t, "marginLeft")) || t.getBoundingClientRect().left - It(t, {
                marginLeft: 0
            }, function() {
                return t.getBoundingClientRect().left
            })) + "px"
        }), pt.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(t, e) {
            pt.cssHooks[t + e] = {
                expand: function(n) {
                    for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; r < 4; r++) i[t + Ft[r] + e] = o[r] || o[r - 2] || o[0];
                    return i
                }
            }, re.test(t) || (pt.cssHooks[t + e].set = O)
        }), pt.fn.extend({
            css: function(t, e) {
                return Lt(this, function(t, e, n) {
                    var r, i, o = {},
                        u = 0;
                    if (Array.isArray(e)) {
                        for (r = oe(t), i = e.length; u < i; u++) o[e[u]] = pt.css(t, e[u], !1, r);
                        return o
                    }
                    return void 0 !== n ? pt.style(t, e, n) : pt.css(t, e)
                }, t, e, arguments.length > 1)
            }
        }), pt.Tween = F, F.prototype = {
            constructor: F,
            init: function(t, e, n, r, i, o) {
                this.elem = t, this.prop = n, this.easing = i || pt.easing._default, this.options = e, this.start = this.now = this.cur(), this.end = r, this.unit = o || (pt.cssNumber[n] ? "" : "px")
            },
            cur: function() {
                var t = F.propHooks[this.prop];
                return t && t.get ? t.get(this) : F.propHooks._default.get(this)
            },
            run: function(t) {
                var e, n = F.propHooks[this.prop];
                return this.options.duration ? this.pos = e = pt.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : this.pos = e = t, this.now = (this.end - this.start) * e + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : F.propHooks._default.set(this), this
            }
        }, F.prototype.init.prototype = F.prototype, F.propHooks = {
            _default: {
                get: function(t) {
                    var e;
                    return 1 !== t.elem.nodeType || null != t.elem[t.prop] && null == t.elem.style[t.prop] ? t.elem[t.prop] : (e = pt.css(t.elem, t.prop, "")) && "auto" !== e ? e : 0
                },
                set: function(t) {
                    pt.fx.step[t.prop] ? pt.fx.step[t.prop](t) : 1 !== t.elem.nodeType || null == t.elem.style[pt.cssProps[t.prop]] && !pt.cssHooks[t.prop] ? t.elem[t.prop] = t.now : pt.style(t.elem, t.prop, t.now + t.unit)
                }
            }
        }, F.propHooks.scrollTop = F.propHooks.scrollLeft = {
            set: function(t) {
                t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
            }
        }, pt.easing = {
            linear: function(t) {
                return t
            },
            swing: function(t) {
                return .5 - Math.cos(t * Math.PI) / 2
            },
            _default: "swing"
        }, pt.fx = F.prototype.init, pt.fx.step = {};
        var he, pe, de = /^(?:toggle|show|hide)$/,
            ge = /queueHooks$/;
        pt.Animation = pt.extend($, {
            tweeners: {
                "*": [function(t, e) {
                    var n = this.createTween(t, e);
                    return g(n.elem, t, Ht.exec(e), n), n
                }]
            },
            tweener: function(t, e) {
                pt.isFunction(t) ? (e = t, t = ["*"]) : t = t.match(Nt);
                for (var n, r = 0, i = t.length; r < i; r++) n = t[r], $.tweeners[n] = $.tweeners[n] || [], $.tweeners[n].unshift(e)
            },
            prefilters: [function(t, e, n) {
                var r, i, o, u, a, s, c, l, f = "width" in e || "height" in e,
                    h = this,
                    p = {},
                    d = t.style,
                    g = t.nodeType && zt(t),
                    v = qt.get(t, "fxshow");
                n.queue || (null == (u = pt._queueHooks(t, "fx")).unqueued && (u.unqueued = 0, a = u.empty.fire, u.empty.fire = function() {
                    u.unqueued || a()
                }), u.unqueued++, h.always(function() {
                    h.always(function() {
                        u.unqueued--, pt.queue(t, "fx").length || u.empty.fire()
                    })
                }));
                for (r in e)
                    if (i = e[r], de.test(i)) {
                        if (delete e[r], o = o || "toggle" === i, i === (g ? "hide" : "show")) {
                            if ("show" !== i || !v || void 0 === v[r]) continue;
                            g = !0
                        }
                        p[r] = v && v[r] || pt.style(t, r)
                    }
                if ((s = !pt.isEmptyObject(e)) || !pt.isEmptyObject(p)) {
                    f && 1 === t.nodeType && (n.overflow = [d.overflow, d.overflowX, d.overflowY], null == (c = v && v.display) && (c = qt.get(t, "display")), "none" === (l = pt.css(t, "display")) && (c ? l = c : (y([t], !0), c = t.style.display || c, l = pt.css(t, "display"), y([t]))), ("inline" === l || "inline-block" === l && null != c) && "none" === pt.css(t, "float") && (s || (h.done(function() {
                        d.display = c
                    }), null == c && (l = d.display, c = "none" === l ? "" : l)), d.display = "inline-block")), n.overflow && (d.overflow = "hidden", h.always(function() {
                        d.overflow = n.overflow[0], d.overflowX = n.overflow[1], d.overflowY = n.overflow[2]
                    })), s = !1;
                    for (r in p) s || (v ? "hidden" in v && (g = v.hidden) : v = qt.access(t, "fxshow", {
                        display: c
                    }), o && (v.hidden = !g), g && y([t], !0), h.done(function() {
                        g || y([t]),
                            qt.remove(t, "fxshow");
                        for (r in p) pt.style(t, r, p[r])
                    })), s = W(g ? v[r] : 0, r, h), r in v || (v[r] = s.start, g && (s.end = s.start, s.start = 0))
                }
            }],
            prefilter: function(t, e) {
                e ? $.prefilters.unshift(t) : $.prefilters.push(t)
            }
        }), pt.speed = function(t, e, n) {
            var r = t && "object" == typeof t ? pt.extend({}, t) : {
                complete: n || !n && e || pt.isFunction(t) && t,
                duration: t,
                easing: n && e || e && !pt.isFunction(e) && e
            };
            return pt.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in pt.fx.speeds ? r.duration = pt.fx.speeds[r.duration] : r.duration = pt.fx.speeds._default), null != r.queue && !0 !== r.queue || (r.queue = "fx"), r.old = r.complete, r.complete = function() {
                pt.isFunction(r.old) && r.old.call(this), r.queue && pt.dequeue(this, r.queue)
            }, r
        }, pt.fn.extend({
            fadeTo: function(t, e, n, r) {
                return this.filter(zt).css("opacity", 0).show().end().animate({
                    opacity: e
                }, t, n, r)
            },
            animate: function(t, e, n, r) {
                var i = pt.isEmptyObject(t),
                    o = pt.speed(e, n, r),
                    u = function() {
                        var e = $(this, pt.extend({}, t), o);
                        (i || qt.get(this, "finish")) && e.stop(!0)
                    };
                return u.finish = u, i || !1 === o.queue ? this.each(u) : this.queue(o.queue, u)
            },
            stop: function(t, e, n) {
                var r = function(t) {
                    var e = t.stop;
                    delete t.stop, e(n)
                };
                return "string" != typeof t && (n = e, e = t, t = void 0), e && !1 !== t && this.queue(t || "fx", []), this.each(function() {
                    var e = !0,
                        i = null != t && t + "queueHooks",
                        o = pt.timers,
                        u = qt.get(this);
                    if (i) u[i] && u[i].stop && r(u[i]);
                    else
                        for (i in u) u[i] && u[i].stop && ge.test(i) && r(u[i]);
                    for (i = o.length; i--;) o[i].elem !== this || null != t && o[i].queue !== t || (o[i].anim.stop(n), e = !1, o.splice(i, 1));
                    !e && n || pt.dequeue(this, t)
                })
            },
            finish: function(t) {
                return !1 !== t && (t = t || "fx"), this.each(function() {
                    var e, n = qt.get(this),
                        r = n[t + "queue"],
                        i = n[t + "queueHooks"],
                        o = pt.timers,
                        u = r ? r.length : 0;
                    for (n.finish = !0, pt.queue(this, t, []), i && i.stop && i.stop.call(this, !0), e = o.length; e--;) o[e].elem === this && o[e].queue === t && (o[e].anim.stop(!0), o.splice(e, 1));
                    for (e = 0; e < u; e++) r[e] && r[e].finish && r[e].finish.call(this);
                    delete n.finish
                })
            }
        }), pt.each(["toggle", "show", "hide"], function(t, e) {
            var n = pt.fn[e];
            pt.fn[e] = function(t, r, i) {
                return null == t || "boolean" == typeof t ? n.apply(this, arguments) : this.animate(U(e, !0), t, r, i)
            }
        }), pt.each({
            slideDown: U("show"),
            slideUp: U("hide"),
            slideToggle: U("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(t, e) {
            pt.fn[t] = function(t, n, r) {
                return this.animate(e, t, n, r)
            }
        }), pt.timers = [], pt.fx.tick = function() {
            var t, e = 0,
                n = pt.timers;
            for (he = pt.now(); e < n.length; e++)(t = n[e])() || n[e] !== t || n.splice(e--, 1);
            n.length || pt.fx.stop(), he = void 0
        }, pt.fx.timer = function(t) {
            pt.timers.push(t), pt.fx.start()
        }, pt.fx.interval = 13, pt.fx.start = function() {
            pe || (pe = !0, z())
        }, pt.fx.stop = function() {
            pe = null
        }, pt.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, pt.fn.delay = function(e, n) {
            return e = pt.fx ? pt.fx.speeds[e] || e : e, n = n || "fx", this.queue(n, function(n, r) {
                var i = t.setTimeout(n, e);
                r.stop = function() {
                    t.clearTimeout(i)
                }
            })
        },
            function() {
                var t = et.createElement("input"),
                    e = et.createElement("select").appendChild(et.createElement("option"));
                t.type = "checkbox", ht.checkOn = "" !== t.value, ht.optSelected = e.selected, (t = et.createElement("input")).value = "t", t.type = "radio", ht.radioValue = "t" === t.value
            }();
        var ve, ye = pt.expr.attrHandle;
        pt.fn.extend({
            attr: function(t, e) {
                return Lt(this, pt.attr, t, e, arguments.length > 1)
            },
            removeAttr: function(t) {
                return this.each(function() {
                    pt.removeAttr(this, t)
                })
            }
        }), pt.extend({
            attr: function(t, e, n) {
                var r, i, o = t.nodeType;
                if (3 !== o && 8 !== o && 2 !== o) return void 0 === t.getAttribute ? pt.prop(t, e, n) : (1 === o && pt.isXMLDoc(t) || (i = pt.attrHooks[e.toLowerCase()] || (pt.expr.match.bool.test(e) ? ve : void 0)), void 0 !== n ? null === n ? void pt.removeAttr(t, e) : i && "set" in i && void 0 !== (r = i.set(t, n, e)) ? r : (t.setAttribute(e, n + ""), n) : i && "get" in i && null !== (r = i.get(t, e)) ? r : null == (r = pt.find.attr(t, e)) ? void 0 : r)
            },
            attrHooks: {
                type: {
                    set: function(t, e) {
                        if (!ht.radioValue && "radio" === e && i(t, "input")) {
                            var n = t.value;
                            return t.setAttribute("type", e), n && (t.value = n), e
                        }
                    }
                }
            },
            removeAttr: function(t, e) {
                var n, r = 0,
                    i = e && e.match(Nt);
                if (i && 1 === t.nodeType)
                    for (; n = i[r++];) t.removeAttribute(n)
            }
        }), ve = {
            set: function(t, e, n) {
                return !1 === e ? pt.removeAttr(t, n) : t.setAttribute(n, n), n
            }
        }, pt.each(pt.expr.match.bool.source.match(/\w+/g), function(t, e) {
            var n = ye[e] || pt.find.attr;
            ye[e] = function(t, e, r) {
                var i, o, u = e.toLowerCase();
                return r || (o = ye[u], ye[u] = i, i = null != n(t, e, r) ? u : null, ye[u] = o), i
            }
        });
        var me = /^(?:input|select|textarea|button)$/i,
            xe = /^(?:a|area)$/i;
        pt.fn.extend({
            prop: function(t, e) {
                return Lt(this, pt.prop, t, e, arguments.length > 1)
            },
            removeProp: function(t) {
                return this.each(function() {
                    delete this[pt.propFix[t] || t]
                })
            }
        }), pt.extend({
            prop: function(t, e, n) {
                var r, i, o = t.nodeType;
                if (3 !== o && 8 !== o && 2 !== o) return 1 === o && pt.isXMLDoc(t) || (e = pt.propFix[e] || e, i = pt.propHooks[e]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(t, n, e)) ? r : t[e] = n : i && "get" in i && null !== (r = i.get(t, e)) ? r : t[e]
            },
            propHooks: {
                tabIndex: {
                    get: function(t) {
                        var e = pt.find.attr(t, "tabindex");
                        return e ? parseInt(e, 10) : me.test(t.nodeName) || xe.test(t.nodeName) && t.href ? 0 : -1
                    }
                }
            },
            propFix: {
                for: "htmlFor",
                class: "className"
            }
        }), ht.optSelected || (pt.propHooks.selected = {
            get: function(t) {
                var e = t.parentNode;
                return e && e.parentNode && e.parentNode.selectedIndex, null
            },
            set: function(t) {
                var e = t.parentNode;
                e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex)
            }
        }), pt.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            pt.propFix[this.toLowerCase()] = this
        }), pt.fn.extend({
            addClass: function(t) {
                var e, n, r, i, o, u, a, s = 0;
                if (pt.isFunction(t)) return this.each(function(e) {
                    pt(this).addClass(t.call(this, e, Y(this)))
                });
                if ("string" == typeof t && t)
                    for (e = t.match(Nt) || []; n = this[s++];)
                        if (i = Y(n), r = 1 === n.nodeType && " " + V(i) + " ") {
                            for (u = 0; o = e[u++];) r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                            i !== (a = V(r)) && n.setAttribute("class", a)
                        }
                return this
            },
            removeClass: function(t) {
                var e, n, r, i, o, u, a, s = 0;
                if (pt.isFunction(t)) return this.each(function(e) {
                    pt(this).removeClass(t.call(this, e, Y(this)))
                });
                if (!arguments.length) return this.attr("class", "");
                if ("string" == typeof t && t)
                    for (e = t.match(Nt) || []; n = this[s++];)
                        if (i = Y(n), r = 1 === n.nodeType && " " + V(i) + " ") {
                            for (u = 0; o = e[u++];)
                                for (; r.indexOf(" " + o + " ") > -1;) r = r.replace(" " + o + " ", " ");
                            i !== (a = V(r)) && n.setAttribute("class", a)
                        }
                return this
            },
            toggleClass: function(t, e) {
                var n = typeof t;
                return "boolean" == typeof e && "string" === n ? e ? this.addClass(t) : this.removeClass(t) : pt.isFunction(t) ? this.each(function(n) {
                    pt(this).toggleClass(t.call(this, n, Y(this), e), e)
                }) : this.each(function() {
                    var e, r, i, o;
                    if ("string" === n)
                        for (r = 0, i = pt(this), o = t.match(Nt) || []; e = o[r++];) i.hasClass(e) ? i.removeClass(e) : i.addClass(e);
                    else void 0 !== t && "boolean" !== n || ((e = Y(this)) && qt.set(this, "__className__", e), this.setAttribute && this.setAttribute("class", e || !1 === t ? "" : qt.get(this, "__className__") || ""))
                })
            },
            hasClass: function(t) {
                var e, n, r = 0;
                for (e = " " + t + " "; n = this[r++];)
                    if (1 === n.nodeType && (" " + V(Y(n)) + " ").indexOf(e) > -1) return !0;
                return !1
            }
        });
        var be = /\r/g;
        pt.fn.extend({
            val: function(t) {
                var e, n, r, i = this[0];
                return arguments.length ? (r = pt.isFunction(t), this.each(function(n) {
                    var i;
                    1 === this.nodeType && (null == (i = r ? t.call(this, n, pt(this).val()) : t) ? i = "" : "number" == typeof i ? i += "" : Array.isArray(i) && (i = pt.map(i, function(t) {
                        return null == t ? "" : t + ""
                    })), (e = pt.valHooks[this.type] || pt.valHooks[this.nodeName.toLowerCase()]) && "set" in e && void 0 !== e.set(this, i, "value") || (this.value = i))
                })) : i ? (e = pt.valHooks[i.type] || pt.valHooks[i.nodeName.toLowerCase()]) && "get" in e && void 0 !== (n = e.get(i, "value")) ? n : "string" == typeof(n = i.value) ? n.replace(be, "") : null == n ? "" : n : void 0
            }
        }), pt.extend({
            valHooks: {
                option: {
                    get: function(t) {
                        var e = pt.find.attr(t, "value");
                        return null != e ? e : V(pt.text(t))
                    }
                },
                select: {
                    get: function(t) {
                        var e, n, r, o = t.options,
                            u = t.selectedIndex,
                            a = "select-one" === t.type,
                            s = a ? null : [],
                            c = a ? u + 1 : o.length;
                        for (r = u < 0 ? c : a ? u : 0; r < c; r++)
                            if (((n = o[r]).selected || r === u) && !n.disabled && (!n.parentNode.disabled || !i(n.parentNode, "optgroup"))) {
                                if (e = pt(n).val(), a) return e;
                                s.push(e)
                            }
                        return s
                    },
                    set: function(t, e) {
                        for (var n, r, i = t.options, o = pt.makeArray(e), u = i.length; u--;)((r = i[u]).selected = pt.inArray(pt.valHooks.option.get(r), o) > -1) && (n = !0);
                        return n || (t.selectedIndex = -1), o
                    }
                }
            }
        }), pt.each(["radio", "checkbox"], function() {
            pt.valHooks[this] = {
                set: function(t, e) {
                    if (Array.isArray(e)) return t.checked = pt.inArray(pt(t).val(), e) > -1
                }
            }, ht.checkOn || (pt.valHooks[this].get = function(t) {
                return null === t.getAttribute("value") ? "on" : t.value
            })
        });
        var we = /^(?:focusinfocus|focusoutblur)$/;
        pt.extend(pt.event, {
            trigger: function(e, n, r, i) {
                var o, u, a, s, c, l, f, h = [r || et],
                    p = ct.call(e, "type") ? e.type : e,
                    d = ct.call(e, "namespace") ? e.namespace.split(".") : [];
                if (u = a = r = r || et, 3 !== r.nodeType && 8 !== r.nodeType && !we.test(p + pt.event.triggered) && (p.indexOf(".") > -1 && (p = (d = p.split(".")).shift(), d.sort()), c = p.indexOf(":") < 0 && "on" + p, e = e[pt.expando] ? e : new pt.Event(p, "object" == typeof e && e), e.isTrigger = i ? 2 : 3, e.namespace = d.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = r), n = null == n ? [e] : pt.makeArray(n, [e]), f = pt.event.special[p] || {}, i || !f.trigger || !1 !== f.trigger.apply(r, n))) {
                    if (!i && !f.noBubble && !pt.isWindow(r)) {
                        for (s = f.delegateType || p, we.test(s + p) || (u = u.parentNode); u; u = u.parentNode) h.push(u), a = u;
                        a === (r.ownerDocument || et) && h.push(a.defaultView || a.parentWindow || t)
                    }
                    for (o = 0;
                         (u = h[o++]) && !e.isPropagationStopped();) e.type = o > 1 ? s : f.bindType || p, (l = (qt.get(u, "events") || {})[e.type] && qt.get(u, "handle")) && l.apply(u, n), (l = c && u[c]) && l.apply && Dt(u) && (e.result = l.apply(u, n), !1 === e.result && e.preventDefault());
                    return e.type = p, i || e.isDefaultPrevented() || f._default && !1 !== f._default.apply(h.pop(), n) || !Dt(r) || c && pt.isFunction(r[p]) && !pt.isWindow(r) && ((a = r[c]) && (r[c] = null), pt.event.triggered = p, r[p](), pt.event.triggered = void 0, a && (r[c] = a)), e.result
                }
            },
            simulate: function(t, e, n) {
                var r = pt.extend(new pt.Event, n, {
                    type: t,
                    isSimulated: !0
                });
                pt.event.trigger(r, null, e)
            }
        }), pt.fn.extend({
            trigger: function(t, e) {
                return this.each(function() {
                    pt.event.trigger(t, e, this)
                })
            },
            triggerHandler: function(t, e) {
                var n = this[0];
                if (n) return pt.event.trigger(t, e, n, !0)
            }
        }), pt.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(t, e) {
            pt.fn[e] = function(t, n) {
                return arguments.length > 0 ? this.on(e, null, t, n) : this.trigger(e)
            }
        }), pt.fn.extend({
            hover: function(t, e) {
                return this.mouseenter(t).mouseleave(e || t)
            }
        }), ht.focusin = "onfocusin" in t, ht.focusin || pt.each({
            focus: "focusin",
            blur: "focusout"
        }, function(t, e) {
            var n = function(t) {
                pt.event.simulate(e, t.target, pt.event.fix(t))
            };
            pt.event.special[e] = {
                setup: function() {
                    var r = this.ownerDocument || this,
                        i = qt.access(r, e);
                    i || r.addEventListener(t, n, !0), qt.access(r, e, (i || 0) + 1)
                },
                teardown: function() {
                    var r = this.ownerDocument || this,
                        i = qt.access(r, e) - 1;
                    i ? qt.access(r, e, i) : (r.removeEventListener(t, n, !0), qt.remove(r, e))
                }
            }
        });
        var Me = t.location,
            ke = pt.now(),
            Ee = /\?/;
        pt.parseXML = function(e) {
            var n;
            if (!e || "string" != typeof e) return null;
            try {
                n = (new t.DOMParser).parseFromString(e, "text/xml")
            } catch (t) {
                n = void 0
            }
            return n && !n.getElementsByTagName("parsererror").length || pt.error("Invalid XML: " + e), n
        };
        var Ce = /\[\]$/,
            Te = /\r?\n/g,
            Se = /^(?:submit|button|image|reset|file)$/i,
            Ne = /^(?:input|select|textarea|keygen)/i;
        pt.param = function(t, e) {
            var n, r = [],
                i = function(t, e) {
                    var n = pt.isFunction(e) ? e() : e;
                    r[r.length] = encodeURIComponent(t) + "=" + encodeURIComponent(null == n ? "" : n)
                };
            if (Array.isArray(t) || t.jquery && !pt.isPlainObject(t)) pt.each(t, function() {
                i(this.name, this.value)
            });
            else
                for (n in t) X(n, t[n], e, i);
            return r.join("&")
        }, pt.fn.extend({
            serialize: function() {
                return pt.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var t = pt.prop(this, "elements");
                    return t ? pt.makeArray(t) : this
                }).filter(function() {
                    var t = this.type;
                    return this.name && !pt(this).is(":disabled") && Ne.test(this.nodeName) && !Se.test(t) && (this.checked || !Wt.test(t))
                }).map(function(t, e) {
                    var n = pt(this).val();
                    return null == n ? null : Array.isArray(n) ? pt.map(n, function(t) {
                        return {
                            name: e.name,
                            value: t.replace(Te, "\r\n")
                        }
                    }) : {
                        name: e.name,
                        value: n.replace(Te, "\r\n")
                    }
                }).get()
            }
        });
        var _e = /%20/g,
            Ae = /#.*$/,
            Le = /([?&])_=[^&]*/,
            De = /^(.*?):[ \t]*([^\r\n]*)$/gm,
            qe = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            je = /^(?:GET|HEAD)$/,
            Pe = /^\/\//,
            Oe = {},
            Re = {},
            He = "*/".concat("*"),
            Fe = et.createElement("a");
        Fe.href = Me.href, pt.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: Me.href,
                type: "GET",
                isLocal: qe.test(Me.protocol),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": He,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /\bxml\b/,
                    html: /\bhtml/,
                    json: /\bjson\b/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": JSON.parse,
                    "text xml": pt.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(t, e) {
                return e ? K(K(t, pt.ajaxSettings), e) : K(pt.ajaxSettings, t)
            },
            ajaxPrefilter: Z(Oe),
            ajaxTransport: Z(Re),
            ajax: function(e, n) {
                function r(e, n, r, a) {
                    var c, h, p, b, w, M = n;
                    l || (l = !0, s && t.clearTimeout(s), i = void 0, u = a || "", k.readyState = e > 0 ? 4 : 0, c = e >= 200 && e < 300 || 304 === e, r && (b = J(d, k, r)), b = Q(d, b, k, c), c ? (d.ifModified && ((w = k.getResponseHeader("Last-Modified")) && (pt.lastModified[o] = w), (w = k.getResponseHeader("etag")) && (pt.etag[o] = w)), 204 === e || "HEAD" === d.type ? M = "nocontent" : 304 === e ? M = "notmodified" : (M = b.state, h = b.data, c = !(p = b.error))) : (p = M, !e && M || (M = "error", e < 0 && (e = 0))), k.status = e, k.statusText = (n || M) + "", c ? y.resolveWith(g, [h, M, k]) : y.rejectWith(g, [k, M, p]), k.statusCode(x), x = void 0, f && v.trigger(c ? "ajaxSuccess" : "ajaxError", [k, d, c ? h : p]), m.fireWith(g, [k, M]), f && (v.trigger("ajaxComplete", [k, d]), --pt.active || pt.event.trigger("ajaxStop")))
                }
                "object" == typeof e && (n = e, e = void 0), n = n || {};
                var i, o, u, a, s, c, l, f, h, p, d = pt.ajaxSetup({}, n),
                    g = d.context || d,
                    v = d.context && (g.nodeType || g.jquery) ? pt(g) : pt.event,
                    y = pt.Deferred(),
                    m = pt.Callbacks("once memory"),
                    x = d.statusCode || {},
                    b = {},
                    w = {},
                    M = "canceled",
                    k = {
                        readyState: 0,
                        getResponseHeader: function(t) {
                            var e;
                            if (l) {
                                if (!a)
                                    for (a = {}; e = De.exec(u);) a[e[1].toLowerCase()] = e[2];
                                e = a[t.toLowerCase()]
                            }
                            return null == e ? null : e
                        },
                        getAllResponseHeaders: function() {
                            return l ? u : null
                        },
                        setRequestHeader: function(t, e) {
                            return null == l && (t = w[t.toLowerCase()] = w[t.toLowerCase()] || t, b[t] = e), this
                        },
                        overrideMimeType: function(t) {
                            return null == l && (d.mimeType = t), this
                        },
                        statusCode: function(t) {
                            var e;
                            if (t)
                                if (l) k.always(t[k.status]);
                                else
                                    for (e in t) x[e] = [x[e], t[e]];
                            return this
                        },
                        abort: function(t) {
                            var e = t || M;
                            return i && i.abort(e), r(0, e), this
                        }
                    };
                if (y.promise(k), d.url = ((e || d.url || Me.href) + "").replace(Pe, Me.protocol + "//"), d.type = n.method || n.type || d.method || d.type, d.dataTypes = (d.dataType || "*").toLowerCase().match(Nt) || [""], null == d.crossDomain) {
                    c = et.createElement("a");
                    try {
                        c.href = d.url, c.href = c.href, d.crossDomain = Fe.protocol + "//" + Fe.host != c.protocol + "//" + c.host
                    } catch (t) {
                        d.crossDomain = !0
                    }
                }
                if (d.data && d.processData && "string" != typeof d.data && (d.data = pt.param(d.data, d.traditional)), G(Oe, d, n, k), l) return k;
                (f = pt.event && d.global) && 0 == pt.active++ && pt.event.trigger("ajaxStart"), d.type = d.type.toUpperCase(), d.hasContent = !je.test(d.type), o = d.url.replace(Ae, ""), d.hasContent ? d.data && d.processData && 0 === (d.contentType || "").indexOf("application/x-www-form-urlencoded") && (d.data = d.data.replace(_e, "+")) : (p = d.url.slice(o.length), d.data && (o += (Ee.test(o) ? "&" : "?") + d.data, delete d.data), !1 === d.cache && (o = o.replace(Le, "$1"), p = (Ee.test(o) ? "&" : "?") + "_=" + ke++ + p), d.url = o + p), d.ifModified && (pt.lastModified[o] && k.setRequestHeader("If-Modified-Since", pt.lastModified[o]), pt.etag[o] && k.setRequestHeader("If-None-Match", pt.etag[o])), (d.data && d.hasContent && !1 !== d.contentType || n.contentType) && k.setRequestHeader("Content-Type", d.contentType), k.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + He + "; q=0.01" : "") : d.accepts["*"]);
                for (h in d.headers) k.setRequestHeader(h, d.headers[h]);
                if (d.beforeSend && (!1 === d.beforeSend.call(g, k, d) || l)) return k.abort();
                if (M = "abort", m.add(d.complete), k.done(d.success), k.fail(d.error), i = G(Re, d, n, k)) {
                    if (k.readyState = 1, f && v.trigger("ajaxSend", [k, d]), l) return k;
                    d.async && d.timeout > 0 && (s = t.setTimeout(function() {
                        k.abort("timeout")
                    }, d.timeout));
                    try {
                        l = !1, i.send(b, r)
                    } catch (t) {
                        if (l) throw t;
                        r(-1, t)
                    }
                } else r(-1, "No Transport");
                return k
            },
            getJSON: function(t, e, n) {
                return pt.get(t, e, n, "json")
            },
            getScript: function(t, e) {
                return pt.get(t, void 0, e, "script")
            }
        }), pt.each(["get", "post"], function(t, e) {
            pt[e] = function(t, n, r, i) {
                return pt.isFunction(n) && (i = i || r, r = n, n = void 0), pt.ajax(pt.extend({
                    url: t,
                    type: e,
                    dataType: i,
                    data: n,
                    success: r
                }, pt.isPlainObject(t) && t))
            }
        }), pt._evalUrl = function(t) {
            return pt.ajax({
                url: t,
                type: "GET",
                dataType: "script",
                cache: !0,
                async: !1,
                global: !1,
                throws: !0
            })
        }, pt.fn.extend({
            wrapAll: function(t) {
                var e;
                return this[0] && (pt.isFunction(t) && (t = t.call(this[0])), e = pt(t, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && e.insertBefore(this[0]), e.map(function() {
                    for (var t = this; t.firstElementChild;) t = t.firstElementChild;
                    return t
                }).append(this)), this
            },
            wrapInner: function(t) {
                return pt.isFunction(t) ? this.each(function(e) {
                    pt(this).wrapInner(t.call(this, e))
                }) : this.each(function() {
                    var e = pt(this),
                        n = e.contents();
                    n.length ? n.wrapAll(t) : e.append(t)
                })
            },
            wrap: function(t) {
                var e = pt.isFunction(t);
                return this.each(function(n) {
                    pt(this).wrapAll(e ? t.call(this, n) : t)
                })
            },
            unwrap: function(t) {
                return this.parent(t).not("body").each(function() {
                    pt(this).replaceWith(this.childNodes)
                }), this
            }
        }), pt.expr.pseudos.hidden = function(t) {
            return !pt.expr.pseudos.visible(t)
        }, pt.expr.pseudos.visible = function(t) {
            return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length)
        }, pt.ajaxSettings.xhr = function() {
            try {
                return new t.XMLHttpRequest
            } catch (t) {}
        };
        var ze = {
                0: 200,
                1223: 204
            },
            Ie = pt.ajaxSettings.xhr();
        ht.cors = !!Ie && "withCredentials" in Ie, ht.ajax = Ie = !!Ie, pt.ajaxTransport(function(e) {
            var n, r;
            if (ht.cors || Ie && !e.crossDomain) return {
                send: function(i, o) {
                    var u, a = e.xhr();
                    if (a.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                        for (u in e.xhrFields) a[u] = e.xhrFields[u];
                    e.mimeType && a.overrideMimeType && a.overrideMimeType(e.mimeType), e.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest");
                    for (u in i) a.setRequestHeader(u, i[u]);
                    n = function(t) {
                        return function() {
                            n && (n = r = a.onload = a.onerror = a.onabort = a.onreadystatechange = null, "abort" === t ? a.abort() : "error" === t ? "number" != typeof a.status ? o(0, "error") : o(a.status, a.statusText) : o(ze[a.status] || a.status, a.statusText, "text" !== (a.responseType || "text") || "string" != typeof a.responseText ? {
                                binary: a.response
                            } : {
                                text: a.responseText
                            }, a.getAllResponseHeaders()))
                        }
                    }, a.onload = n(), r = a.onerror = n("error"), void 0 !== a.onabort ? a.onabort = r : a.onreadystatechange = function() {
                        4 === a.readyState && t.setTimeout(function() {
                            n && r()
                        })
                    }, n = n("abort");
                    try {
                        a.send(e.hasContent && e.data || null)
                    } catch (t) {
                        if (n) throw t
                    }
                },
                abort: function() {
                    n && n()
                }
            }
        }), pt.ajaxPrefilter(function(t) {
            t.crossDomain && (t.contents.script = !1)
        }), pt.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /\b(?:java|ecma)script\b/
            },
            converters: {
                "text script": function(t) {
                    return pt.globalEval(t), t
                }
            }
        }), pt.ajaxPrefilter("script", function(t) {
            void 0 === t.cache && (t.cache = !1), t.crossDomain && (t.type = "GET")
        }), pt.ajaxTransport("script", function(t) {
            if (t.crossDomain) {
                var e, n;
                return {
                    send: function(r, i) {
                        e = pt("<script>").prop({
                            charset: t.scriptCharset,
                            src: t.url
                        }).on("load error", n = function(t) {
                            e.remove(), n = null, t && i("error" === t.type ? 404 : 200, t.type)
                        }), et.head.appendChild(e[0])
                    },
                    abort: function() {
                        n && n()
                    }
                }
            }
        });
        var Ue = [],
            We = /(=)\?(?=&|$)|\?\?/;
        pt.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var t = Ue.pop() || pt.expando + "_" + ke++;
                return this[t] = !0, t
            }
        }), pt.ajaxPrefilter("json jsonp", function(e, n, r) {
            var i, o, u, a = !1 !== e.jsonp && (We.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && We.test(e.data) && "data");
            if (a || "jsonp" === e.dataTypes[0]) return i = e.jsonpCallback = pt.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, a ? e[a] = e[a].replace(We, "$1" + i) : !1 !== e.jsonp && (e.url += (Ee.test(e.url) ? "&" : "?") + e.jsonp + "=" + i), e.converters["script json"] = function() {
                return u || pt.error(i + " was not called"), u[0]
            }, e.dataTypes[0] = "json", o = t[i], t[i] = function() {
                u = arguments
            }, r.always(function() {
                void 0 === o ? pt(t).removeProp(i) : t[i] = o, e[i] && (e.jsonpCallback = n.jsonpCallback, Ue.push(i)), u && pt.isFunction(o) && o(u[0]), u = o = void 0
            }), "script"
        }), ht.createHTMLDocument = function() {
            var t = et.implementation.createHTMLDocument("").body;
            return t.innerHTML = "<form></form><form></form>", 2 === t.childNodes.length
        }(), pt.parseHTML = function(t, e, n) {
            if ("string" != typeof t) return [];
            "boolean" == typeof e && (n = e, e = !1);
            var r, i, o;
            return e || (ht.createHTMLDocument ? ((r = (e = et.implementation.createHTMLDocument("")).createElement("base")).href = et.location.href, e.head.appendChild(r)) : e = et), i = Mt.exec(t), o = !n && [], i ? [e.createElement(i[1])] : (i = b([t], e, o), o && o.length && pt(o).remove(), pt.merge([], i.childNodes))
        }, pt.fn.load = function(t, e, n) {
            var r, i, o, u = this,
                a = t.indexOf(" ");
            return a > -1 && (r = V(t.slice(a)), t = t.slice(0, a)), pt.isFunction(e) ? (n = e, e = void 0) : e && "object" == typeof e && (i = "POST"), u.length > 0 && pt.ajax({
                url: t,
                type: i || "GET",
                dataType: "html",
                data: e
            }).done(function(t) {
                o = arguments, u.html(r ? pt("<div>").append(pt.parseHTML(t)).find(r) : t)
            }).always(n && function(t, e) {
                u.each(function() {
                    n.apply(this, o || [t.responseText, e, t])
                })
            }), this
        }, pt.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(t, e) {
            pt.fn[e] = function(t) {
                return this.on(e, t)
            }
        }), pt.expr.pseudos.animated = function(t) {
            return pt.grep(pt.timers, function(e) {
                return t === e.elem
            }).length
        }, pt.offset = {
            setOffset: function(t, e, n) {
                var r, i, o, u, a, s, c = pt.css(t, "position"),
                    l = pt(t),
                    f = {};
                "static" === c && (t.style.position = "relative"), a = l.offset(), o = pt.css(t, "top"), s = pt.css(t, "left"), ("absolute" === c || "fixed" === c) && (o + s).indexOf("auto") > -1 ? (u = (r = l.position()).top, i = r.left) : (u = parseFloat(o) || 0, i = parseFloat(s) || 0), pt.isFunction(e) && (e = e.call(t, n, pt.extend({}, a))), null != e.top && (f.top = e.top - a.top + u), null != e.left && (f.left = e.left - a.left + i), "using" in e ? e.using.call(t, f) : l.css(f)
            }
        }, pt.fn.extend({
            offset: function(t) {
                if (arguments.length) return void 0 === t ? this : this.each(function(e) {
                    pt.offset.setOffset(this, t, e)
                });
                var e, n, r, i, o = this[0];
                return o ? o.getClientRects().length ? (r = o.getBoundingClientRect(), e = o.ownerDocument, n = e.documentElement, i = e.defaultView, {
                    top: r.top + i.pageYOffset - n.clientTop,
                    left: r.left + i.pageXOffset - n.clientLeft
                }) : {
                    top: 0,
                    left: 0
                } : void 0
            },
            position: function() {
                if (this[0]) {
                    var t, e, n = this[0],
                        r = {
                            top: 0,
                            left: 0
                        };
                    return "fixed" === pt.css(n, "position") ? e = n.getBoundingClientRect() : (t = this.offsetParent(), e = this.offset(), i(t[0], "html") || (r = t.offset()), r = {
                        top: r.top + pt.css(t[0], "borderTopWidth", !0),
                        left: r.left + pt.css(t[0], "borderLeftWidth", !0)
                    }), {
                        top: e.top - r.top - pt.css(n, "marginTop", !0),
                        left: e.left - r.left - pt.css(n, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var t = this.offsetParent; t && "static" === pt.css(t, "position");) t = t.offsetParent;
                    return t || Xt
                })
            }
        }), pt.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(t, e) {
            var n = "pageYOffset" === e;
            pt.fn[t] = function(r) {
                return Lt(this, function(t, r, i) {
                    var o;
                    if (pt.isWindow(t) ? o = t : 9 === t.nodeType && (o = t.defaultView), void 0 === i) return o ? o[e] : t[r];
                    o ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset) : t[r] = i
                }, t, r, arguments.length)
            }
        }), pt.each(["top", "left"], function(t, e) {
            pt.cssHooks[e] = q(ht.pixelPosition, function(t, n) {
                if (n) return n = D(t, e), ie.test(n) ? pt(t).position()[e] + "px" : n
            })
        }), pt.each({
            Height: "height",
            Width: "width"
        }, function(t, e) {
            pt.each({
                padding: "inner" + t,
                content: e,
                "": "outer" + t
            }, function(n, r) {
                pt.fn[r] = function(i, o) {
                    var u = arguments.length && (n || "boolean" != typeof i),
                        a = n || (!0 === i || !0 === o ? "margin" : "border");
                    return Lt(this, function(e, n, i) {
                        var o;
                        return pt.isWindow(e) ? 0 === r.indexOf("outer") ? e["inner" + t] : e.document.documentElement["client" + t] : 9 === e.nodeType ? (o = e.documentElement, Math.max(e.body["scroll" + t], o["scroll" + t], e.body["offset" + t], o["offset" + t], o["client" + t])) : void 0 === i ? pt.css(e, n, a) : pt.style(e, n, i, a)
                    }, e, u ? i : void 0, u)
                }
            })
        }), pt.fn.extend({
            bind: function(t, e, n) {
                return this.on(t, null, e, n)
            },
            unbind: function(t, e) {
                return this.off(t, null, e)
            },
            delegate: function(t, e, n, r) {
                return this.on(e, t, n, r)
            },
            undelegate: function(t, e, n) {
                return 1 === arguments.length ? this.off(t, "**") : this.off(e, t || "**", n)
            }
        }), pt.holdReady = function(t) {
            t ? pt.readyWait++ : pt.ready(!0)
        }, pt.isArray = Array.isArray, pt.parseJSON = JSON.parse, pt.nodeName = i, "function" == typeof define && define.amd && define("jquery", [], function() {
            return pt
        });
        var Be = t.jQuery,
            $e = t.$;
        return pt.noConflict = function(e) {
            return t.$ === pt && (t.$ = $e), e && t.jQuery === pt && (t.jQuery = Be), pt
        }, e || (t.jQuery = t.$ = pt), pt
    }),
    function() {
        function t(t) {
            return t && (t.ownerDocument || t.document || t).documentElement
        }

        function e(t) {
            return t && (t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView)
        }

        function n(t, e) {
            return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN
        }

        function r(t) {
            return null === t ? NaN : +t
        }

        function i(t) {
            return !isNaN(t)
        }

        function o(t) {
            return {
                left: function(e, n, r, i) {
                    for (arguments.length < 3 && (r = 0), arguments.length < 4 && (i = e.length); r < i;) {
                        var o = r + i >>> 1;
                        t(e[o], n) < 0 ? r = o + 1 : i = o
                    }
                    return r
                },
                right: function(e, n, r, i) {
                    for (arguments.length < 3 && (r = 0), arguments.length < 4 && (i = e.length); r < i;) {
                        var o = r + i >>> 1;
                        t(e[o], n) > 0 ? i = o : r = o + 1
                    }
                    return r
                }
            }
        }

        function u(t) {
            return t.length
        }

        function a(t) {
            for (var e = 1; t * e % 1;) e *= 10;
            return e
        }

        function s(t, e) {
            for (var n in e) Object.defineProperty(t.prototype, n, {
                value: e[n],
                enumerable: !1
            })
        }

        function c() {
            this._ = Object.create(null)
        }

        function l(t) {
            return (t += "") === Qo || t[0] === tu ? tu + t : t
        }

        function f(t) {
            return (t += "")[0] === tu ? t.slice(1) : t
        }

        function h(t) {
            return l(t) in this._
        }

        function p(t) {
            return (t = l(t)) in this._ && delete this._[t]
        }

        function d() {
            var t = [];
            for (var e in this._) t.push(f(e));
            return t
        }

        function g() {
            var t = 0;
            for (var e in this._) ++t;
            return t
        }

        function v() {
            for (var t in this._) return !1;
            return !0
        }

        function y() {
            this._ = Object.create(null)
        }

        function m(t) {
            return t
        }

        function x(t, e, n) {
            return function() {
                var r = n.apply(e, arguments);
                return r === e ? t : r
            }
        }

        function b(t, e) {
            if (e in t) return e;
            e = e.charAt(0).toUpperCase() + e.slice(1);
            for (var n = 0, r = eu.length; n < r; ++n) {
                var i = eu[n] + e;
                if (i in t) return i
            }
        }

        function w() {}

        function M() {}

        function k(t) {
            function e() {
                for (var e, r = n, i = -1, o = r.length; ++i < o;)(e = r[i].on) && e.apply(this, arguments);
                return t
            }
            var n = [],
                r = new c;
            return e.on = function(e, i) {
                var o, u = r.get(e);
                return arguments.length < 2 ? u && u.on : (u && (u.on = null, n = n.slice(0, o = n.indexOf(u)).concat(n.slice(o + 1)), r.remove(e)), i && n.push(r.set(e, {
                    on: i
                })), t)
            }, e
        }

        function E() {
            Uo.event.preventDefault()
        }

        function C() {
            for (var t, e = Uo.event; t = e.sourceEvent;) e = t;
            return e
        }

        function T(t) {
            for (var e = new M, n = 0, r = arguments.length; ++n < r;) e[arguments[n]] = k(e);
            return e.of = function(n, r) {
                return function(i) {
                    try {
                        var o = i.sourceEvent = Uo.event;
                        i.target = t, Uo.event = i, e[i.type].apply(n, r)
                    } finally {
                        Uo.event = o
                    }
                }
            }, e
        }

        function S(t) {
            return ru(t, au), t
        }

        function N(t) {
            return "function" == typeof t ? t : function() {
                return iu(t, this)
            }
        }

        function _(t) {
            return "function" == typeof t ? t : function() {
                return ou(t, this)
            }
        }

        function A(t, e) {
            return t = Uo.ns.qualify(t), null == e ? t.local ? function() {
                this.removeAttributeNS(t.space, t.local)
            } : function() {
                this.removeAttribute(t)
            } : "function" == typeof e ? t.local ? function() {
                var n = e.apply(this, arguments);
                null == n ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n)
            } : function() {
                var n = e.apply(this, arguments);
                null == n ? this.removeAttribute(t) : this.setAttribute(t, n)
            } : t.local ? function() {
                this.setAttributeNS(t.space, t.local, e)
            } : function() {
                this.setAttribute(t, e)
            }
        }

        function L(t) {
            return t.trim().replace(/\s+/g, " ")
        }

        function D(t) {
            return new RegExp("(?:^|\\s+)" + Uo.requote(t) + "(?:\\s+|$)", "g")
        }

        function q(t) {
            return (t + "").trim().split(/^|\s+/)
        }

        function j(t, e) {
            var n = (t = q(t).map(P)).length;
            return "function" == typeof e ? function() {
                for (var r = -1, i = e.apply(this, arguments); ++r < n;) t[r](this, i)
            } : function() {
                for (var r = -1; ++r < n;) t[r](this, e)
            }
        }

        function P(t) {
            var e = D(t);
            return function(n, r) {
                if (i = n.classList) return r ? i.add(t) : i.remove(t);
                var i = n.getAttribute("class") || "";
                r ? (e.lastIndex = 0, e.test(i) || n.setAttribute("class", L(i + " " + t))) : n.setAttribute("class", L(i.replace(e, " ")))
            }
        }

        function O(t, e, n) {
            return null == e ? function() {
                this.style.removeProperty(t)
            } : "function" == typeof e ? function() {
                var r = e.apply(this, arguments);
                null == r ? this.style.removeProperty(t) : this.style.setProperty(t, r, n)
            } : function() {
                this.style.setProperty(t, e, n)
            }
        }

        function R(t, e) {
            return null == e ? function() {
                delete this[t]
            } : "function" == typeof e ? function() {
                var n = e.apply(this, arguments);
                null == n ? delete this[t] : this[t] = n
            } : function() {
                this[t] = e
            }
        }

        function H(t) {
            return "function" == typeof t ? t : (t = Uo.ns.qualify(t)).local ? function() {
                return this.ownerDocument.createElementNS(t.space, t.local)
            } : function() {
                var e = this.ownerDocument,
                    n = this.namespaceURI;
                return n === su && e.documentElement.namespaceURI === su ? e.createElement(t) : e.createElementNS(n, t)
            }
        }

        function F() {
            var t = this.parentNode;
            t && t.removeChild(this)
        }

        function z(t) {
            return {
                __data__: t
            }
        }

        function I(t) {
            return function() {
                return uu(this, t)
            }
        }

        function U(t) {
            return arguments.length || (t = n),
                function(e, n) {
                    return e && n ? t(e.__data__, n.__data__) : !e - !n
                }
        }

        function W(t, e) {
            for (var n = 0, r = t.length; n < r; n++)
                for (var i, o = t[n], u = 0, a = o.length; u < a; u++)(i = o[u]) && e(i, u, n);
            return t
        }

        function B(t) {
            return ru(t, lu), t
        }

        function $(t) {
            var e, n;
            return function(r, i, o) {
                var u, a = t[o].update,
                    s = a.length;
                for (o != n && (n = o, e = 0), i >= e && (e = i + 1); !(u = a[e]) && ++e < s;);
                return u
            }
        }

        function V(t, e, n) {
            function r() {
                var e = this[i];
                e && (this.removeEventListener(t, e, e.$), delete this[i])
            }
            var i = "__on" + t,
                o = t.indexOf("."),
                u = Y;
            o > 0 && (t = t.slice(0, o));
            var a = fu.get(t);
            return a && (t = a, u = X), o ? e ? function() {
                var o = u(e, Bo(arguments));
                r.call(this), this.addEventListener(t, this[i] = o, o.$ = n), o._ = e
            } : r : e ? w : function() {
                var e, n = new RegExp("^__on([^.]+)" + Uo.requote(t) + "$");
                for (var r in this)
                    if (e = r.match(n)) {
                        var i = this[r];
                        this.removeEventListener(e[1], i, i.$), delete this[r]
                    }
            }
        }

        function Y(t, e) {
            return function(n) {
                var r = Uo.event;
                Uo.event = n, e[0] = this.__data__;
                try {
                    t.apply(this, e)
                } finally {
                    Uo.event = r
                }
            }
        }

        function X(t, e) {
            var n = Y(t, e);
            return function(t) {
                var e = this,
                    r = t.relatedTarget;
                r && (r === e || 8 & r.compareDocumentPosition(e)) || n.call(e, t)
            }
        }

        function Z(n) {
            var r = ".dragsuppress-" + ++pu,
                i = "click" + r,
                o = Uo.select(e(n)).on("touchmove" + r, E).on("dragstart" + r, E).on("selectstart" + r, E);
            if (null == hu && (hu = !("onselectstart" in n) && b(n.style, "userSelect")), hu) {
                var u = t(n).style,
                    a = u[hu];
                u[hu] = "none"
            }
            return function(t) {
                if (o.on(r, null), hu && (u[hu] = a), t) {
                    var e = function() {
                        o.on(i, null)
                    };
                    o.on(i, function() {
                        E(), e()
                    }, !0), setTimeout(e, 0)
                }
            }
        }

        function G(t, n) {
            n.changedTouches && (n = n.changedTouches[0]);
            var r = t.ownerSVGElement || t;
            if (r.createSVGPoint) {
                var i = r.createSVGPoint();
                if (du < 0) {
                    var o = e(t);
                    if (o.scrollX || o.scrollY) {
                        var u = (r = Uo.select("body").append("svg").style({
                            position: "absolute",
                            top: 0,
                            left: 0,
                            margin: 0,
                            padding: 0,
                            border: "none"
                        }, "important"))[0][0].getScreenCTM();
                        du = !(u.f || u.e), r.remove()
                    }
                }
                return du ? (i.x = n.pageX, i.y = n.pageY) : (i.x = n.clientX, i.y = n.clientY), i = i.matrixTransform(t.getScreenCTM().inverse()), [i.x, i.y]
            }
            var a = t.getBoundingClientRect();
            return [n.clientX - a.left - t.clientLeft, n.clientY - a.top - t.clientTop]
        }

        function K() {
            return Uo.event.changedTouches[0].identifier
        }

        function J(t) {
            return t > 0 ? 1 : t < 0 ? -1 : 0
        }

        function Q(t, e, n) {
            return (e[0] - t[0]) * (n[1] - t[1]) - (e[1] - t[1]) * (n[0] - t[0])
        }

        function tt(t) {
            return t > 1 ? 0 : t < -1 ? yu : Math.acos(t)
        }

        function et(t) {
            return t > 1 ? bu : t < -1 ? -bu : Math.asin(t)
        }

        function nt(t) {
            return ((t = Math.exp(t)) - 1 / t) / 2
        }

        function rt(t) {
            return ((t = Math.exp(t)) + 1 / t) / 2
        }

        function it(t) {
            return ((t = Math.exp(2 * t)) - 1) / (t + 1)
        }

        function ot(t) {
            return (t = Math.sin(t / 2)) * t
        }

        function ut() {}

        function at(t, e, n) {
            return this instanceof at ? (this.h = +t, this.s = +e, void(this.l = +n)) : arguments.length < 2 ? t instanceof at ? new at(t.h, t.s, t.l) : wt("" + t, Mt, at) : new at(t, e, n)
        }

        function st(t, e, n) {
            function r(t) {
                return t > 360 ? t -= 360 : t < 0 && (t += 360), t < 60 ? o + (u - o) * t / 60 : t < 180 ? u : t < 240 ? o + (u - o) * (240 - t) / 60 : o
            }

            function i(t) {
                return Math.round(255 * r(t))
            }
            var o, u;
            return t = isNaN(t) ? 0 : (t %= 360) < 0 ? t + 360 : t, e = isNaN(e) ? 0 : e < 0 ? 0 : e > 1 ? 1 : e, n = n < 0 ? 0 : n > 1 ? 1 : n, u = n <= .5 ? n * (1 + e) : n + e - n * e, o = 2 * n - u, new yt(i(t + 120), i(t), i(t - 120))
        }

        function ct(t, e, n) {
            return this instanceof ct ? (this.h = +t, this.c = +e, void(this.l = +n)) : arguments.length < 2 ? t instanceof ct ? new ct(t.h, t.c, t.l) : t instanceof ft ? pt(t.l, t.a, t.b) : pt((t = kt((t = Uo.rgb(t)).r, t.g, t.b)).l, t.a, t.b) : new ct(t, e, n)
        }

        function lt(t, e, n) {
            return isNaN(t) && (t = 0), isNaN(e) && (e = 0), new ft(n, Math.cos(t *= wu) * e, Math.sin(t) * e)
        }

        function ft(t, e, n) {
            return this instanceof ft ? (this.l = +t, this.a = +e,
                void(this.b = +n)) : arguments.length < 2 ? t instanceof ft ? new ft(t.l, t.a, t.b) : t instanceof ct ? lt(t.h, t.c, t.l) : kt((t = yt(t)).r, t.g, t.b) : new ft(t, e, n)
        }

        function ht(t, e, n) {
            var r = (t + 16) / 116,
                i = r + e / 500,
                o = r - n / 200;
            return i = dt(i) * Au, r = dt(r) * Lu, o = dt(o) * Du, new yt(vt(3.2404542 * i - 1.5371385 * r - .4985314 * o), vt(-.969266 * i + 1.8760108 * r + .041556 * o), vt(.0556434 * i - .2040259 * r + 1.0572252 * o))
        }

        function pt(t, e, n) {
            return t > 0 ? new ct(Math.atan2(n, e) * Mu, Math.sqrt(e * e + n * n), t) : new ct(NaN, NaN, t)
        }

        function dt(t) {
            return t > .206893034 ? t * t * t : (t - 4 / 29) / 7.787037
        }

        function gt(t) {
            return t > .008856 ? Math.pow(t, 1 / 3) : 7.787037 * t + 4 / 29
        }

        function vt(t) {
            return Math.round(255 * (t <= .00304 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - .055))
        }

        function yt(t, e, n) {
            return this instanceof yt ? (this.r = ~~t, this.g = ~~e, void(this.b = ~~n)) : arguments.length < 2 ? t instanceof yt ? new yt(t.r, t.g, t.b) : wt("" + t, yt, st) : new yt(t, e, n)
        }

        function mt(t) {
            return new yt(t >> 16, t >> 8 & 255, 255 & t)
        }

        function xt(t) {
            return mt(t) + ""
        }

        function bt(t) {
            return t < 16 ? "0" + Math.max(0, t).toString(16) : Math.min(255, t).toString(16)
        }

        function wt(t, e, n) {
            var r, i, o, u = 0,
                a = 0,
                s = 0;
            if (r = /([a-z]+)\((.*)\)/.exec(t = t.toLowerCase())) switch (i = r[2].split(","), r[1]) {
                case "hsl":
                    return n(parseFloat(i[0]), parseFloat(i[1]) / 100, parseFloat(i[2]) / 100);
                case "rgb":
                    return e(Ct(i[0]), Ct(i[1]), Ct(i[2]))
            }
            return (o = Pu.get(t)) ? e(o.r, o.g, o.b) : (null == t || "#" !== t.charAt(0) || isNaN(o = parseInt(t.slice(1), 16)) || (4 === t.length ? (u = (3840 & o) >> 4, u |= u >> 4, a = 240 & o, a |= a >> 4, s = 15 & o, s |= s << 4) : 7 === t.length && (u = (16711680 & o) >> 16, a = (65280 & o) >> 8, s = 255 & o)), e(u, a, s))
        }

        function Mt(t, e, n) {
            var r, i, o = Math.min(t /= 255, e /= 255, n /= 255),
                u = Math.max(t, e, n),
                a = u - o,
                s = (u + o) / 2;
            return a ? (i = s < .5 ? a / (u + o) : a / (2 - u - o), r = t == u ? (e - n) / a + (e < n ? 6 : 0) : e == u ? (n - t) / a + 2 : (t - e) / a + 4, r *= 60) : (r = NaN, i = s > 0 && s < 1 ? 0 : r), new at(r, i, s)
        }

        function kt(t, e, n) {
            var r = gt((.4124564 * (t = Et(t)) + .3575761 * (e = Et(e)) + .1804375 * (n = Et(n))) / Au),
                i = gt((.2126729 * t + .7151522 * e + .072175 * n) / Lu);
            return ft(116 * i - 16, 500 * (r - i), 200 * (i - gt((.0193339 * t + .119192 * e + .9503041 * n) / Du)))
        }

        function Et(t) {
            return (t /= 255) <= .04045 ? t / 12.92 : Math.pow((t + .055) / 1.055, 2.4)
        }

        function Ct(t) {
            var e = parseFloat(t);
            return "%" === t.charAt(t.length - 1) ? Math.round(2.55 * e) : e
        }

        function Tt(t) {
            return "function" == typeof t ? t : function() {
                return t
            }
        }

        function St(t) {
            return function(e, n, r) {
                return 2 === arguments.length && "function" == typeof n && (r = n, n = null), Nt(e, n, t, r)
            }
        }

        function Nt(t, e, n, r) {
            function i() {
                var t, e = s.status;
                if (!e && At(s) || e >= 200 && e < 300 || 304 === e) {
                    try {
                        t = n.call(o, s)
                    } catch (t) {
                        return void u.error.call(o, t)
                    }
                    u.load.call(o, t)
                } else u.error.call(o, s)
            }
            var o = {},
                u = Uo.dispatch("beforesend", "progress", "load", "error"),
                a = {},
                s = new XMLHttpRequest,
                c = null;
            return !this.XDomainRequest || "withCredentials" in s || !/^(http(s)?:)?\/\//.test(t) || (s = new XDomainRequest), "onload" in s ? s.onload = s.onerror = i : s.onreadystatechange = function() {
                s.readyState > 3 && i()
            }, s.onprogress = function(t) {
                var e = Uo.event;
                Uo.event = t;
                try {
                    u.progress.call(o, s)
                } finally {
                    Uo.event = e
                }
            }, o.header = function(t, e) {
                return t = (t + "").toLowerCase(), arguments.length < 2 ? a[t] : (null == e ? delete a[t] : a[t] = e + "", o)
            }, o.mimeType = function(t) {
                return arguments.length ? (e = null == t ? null : t + "", o) : e
            }, o.responseType = function(t) {
                return arguments.length ? (c = t, o) : c
            }, o.response = function(t) {
                return n = t, o
            }, ["get", "post"].forEach(function(t) {
                o[t] = function() {
                    return o.send.apply(o, [t].concat(Bo(arguments)))
                }
            }), o.send = function(n, r, i) {
                if (2 === arguments.length && "function" == typeof r && (i = r, r = null), s.open(n, t, !0), null == e || "accept" in a || (a.accept = e + ",*/*"), s.setRequestHeader)
                    for (var l in a) s.setRequestHeader(l, a[l]);
                return null != e && s.overrideMimeType && s.overrideMimeType(e), null != c && (s.responseType = c), null != i && o.on("error", i).on("load", function(t) {
                    i(null, t)
                }), u.beforesend.call(o, s), s.send(null == r ? null : r), o
            }, o.abort = function() {
                return s.abort(), o
            }, Uo.rebind(o, u, "on"), null == r ? o : o.get(_t(r))
        }

        function _t(t) {
            return 1 === t.length ? function(e, n) {
                t(null == e ? n : null)
            } : t
        }

        function At(t) {
            var e = t.responseType;
            return e && "text" !== e ? t.response : t.responseText
        }

        function Lt(t, e, n) {
            var r = arguments.length;
            r < 2 && (e = 0), r < 3 && (n = Date.now());
            var i = {
                c: t,
                t: n + e,
                n: null
            };
            return Ru ? Ru.n = i : Ou = i, Ru = i, Hu || (Fu = clearTimeout(Fu), Hu = 1, zu(Dt)), i
        }

        function Dt() {
            var t = qt(),
                e = jt() - t;
            e > 24 ? (isFinite(e) && (clearTimeout(Fu), Fu = setTimeout(Dt, e)), Hu = 0) : (Hu = 1, zu(Dt))
        }

        function qt() {
            for (var t = Date.now(), e = Ou; e;) t >= e.t && e.c(t - e.t) && (e.c = null), e = e.n;
            return t
        }

        function jt() {
            for (var t, e = Ou, n = 1 / 0; e;) e.c ? (e.t < n && (n = e.t), e = (t = e).n) : e = t ? t.n = e.n : Ou = e.n;
            return Ru = t, n
        }

        function Pt(t, e) {
            return e - (t ? Math.ceil(Math.log(t) / Math.LN10) : 1)
        }

        function Ot(t) {
            var e = t.decimal,
                n = t.thousands,
                r = t.grouping,
                i = t.currency,
                o = r && n ? function(t, e) {
                    for (var i = t.length, o = [], u = 0, a = r[0], s = 0; i > 0 && a > 0 && (s + a + 1 > e && (a = Math.max(1, e - s)), o.push(t.substring(i -= a, i + a)), !((s += a + 1) > e));) a = r[u = (u + 1) % r.length];
                    return o.reverse().join(n)
                } : m;
            return function(t) {
                var n = Uu.exec(t),
                    r = n[1] || " ",
                    u = n[2] || ">",
                    a = n[3] || "-",
                    s = n[4] || "",
                    c = n[5],
                    l = +n[6],
                    f = n[7],
                    h = n[8],
                    p = n[9],
                    d = 1,
                    g = "",
                    v = "",
                    y = !1,
                    m = !0;
                switch (h && (h = +h.substring(1)), (c || "0" === r && "=" === u) && (c = r = "0", u = "="), p) {
                    case "n":
                        f = !0, p = "g";
                        break;
                    case "%":
                        d = 100, v = "%", p = "f";
                        break;
                    case "p":
                        d = 100, v = "%", p = "r";
                        break;
                    case "b":
                    case "o":
                    case "x":
                    case "X":
                        "#" === s && (g = "0" + p.toLowerCase());
                    case "c":
                        m = !1;
                    case "d":
                        y = !0, h = 0;
                        break;
                    case "s":
                        d = -1, p = "r"
                }
                "$" === s && (g = i[0], v = i[1]), "r" != p || h || (p = "g"), null != h && ("g" == p ? h = Math.max(1, Math.min(21, h)) : "e" != p && "f" != p || (h = Math.max(0, Math.min(20, h)))), p = Wu.get(p) || Rt;
                var x = c && f;
                return function(t) {
                    var n = v;
                    if (y && t % 1) return "";
                    var i = t < 0 || 0 === t && 1 / t < 0 ? (t = -t, "-") : "-" === a ? "" : a;
                    if (d < 0) {
                        var s = Uo.formatPrefix(t, h);
                        t = s.scale(t), n = s.symbol + v
                    } else t *= d;
                    var b, w, M = (t = p(t, h)).lastIndexOf(".");
                    if (M < 0) {
                        var k = m ? t.lastIndexOf("e") : -1;
                        k < 0 ? (b = t, w = "") : (b = t.substring(0, k), w = t.substring(k))
                    } else b = t.substring(0, M), w = e + t.substring(M + 1);
                    !c && f && (b = o(b, 1 / 0));
                    var E = g.length + b.length + w.length + (x ? 0 : i.length),
                        C = E < l ? new Array(E = l - E + 1).join(r) : "";
                    return x && (b = o(C + b, C.length ? l - w.length : 1 / 0)), i += g, t = b + w, ("<" === u ? i + t + C : ">" === u ? C + i + t : "^" === u ? C.substring(0, E >>= 1) + i + t + C.substring(E) : i + (x ? t : C + t)) + n
                }
            }
        }

        function Rt(t) {
            return t + ""
        }

        function Ht() {
            this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0])
        }

        function Ft(t, e, n) {
            function r(e) {
                var n = t(e),
                    r = o(n, 1);
                return e - n < r - e ? n : r
            }

            function i(n) {
                return e(n = t(new $u(n - 1)), 1), n
            }

            function o(t, n) {
                return e(t = new $u(+t), n), t
            }

            function u(t, r, o) {
                var u = i(t),
                    a = [];
                if (o > 1)
                    for (; u < r;) n(u) % o || a.push(new Date(+u)), e(u, 1);
                else
                    for (; u < r;) a.push(new Date(+u)), e(u, 1);
                return a
            }
            t.floor = t, t.round = r, t.ceil = i, t.offset = o, t.range = u;
            var a = t.utc = zt(t);
            return a.floor = a, a.round = zt(r), a.ceil = zt(i), a.offset = zt(o), a.range = function(t, e, n) {
                try {
                    $u = Ht;
                    var r = new Ht;
                    return r._ = t, u(r, e, n)
                } finally {
                    $u = Date
                }
            }, t
        }

        function zt(t) {
            return function(e, n) {
                try {
                    $u = Ht;
                    var r = new Ht;
                    return r._ = e, t(r, n)._
                } finally {
                    $u = Date
                }
            }
        }

        function It(t) {
            function e(t) {
                function e(e) {
                    for (var n, i, o, u = [], a = -1, s = 0; ++a < r;) 37 === t.charCodeAt(a) && (u.push(t.slice(s, a)), null != (i = Yu[n = t.charAt(++a)]) && (n = t.charAt(++a)), (o = b[n]) && (n = o(e, null == i ? "e" === n ? " " : "0" : i)), u.push(n), s = a + 1);
                    return u.push(t.slice(s, a)), u.join("")
                }
                var r = t.length;
                return e.parse = function(e) {
                    var r = {
                        y: 1900,
                        m: 0,
                        d: 1,
                        H: 0,
                        M: 0,
                        S: 0,
                        L: 0,
                        Z: null
                    };
                    if (n(r, t, e, 0) != e.length) return null;
                    "p" in r && (r.H = r.H % 12 + 12 * r.p);
                    var i = null != r.Z && $u !== Ht,
                        o = new(i ? Ht : $u);
                    return "j" in r ? o.setFullYear(r.y, 0, r.j) : "W" in r || "U" in r ? ("w" in r || (r.w = "W" in r ? 1 : 0), o.setFullYear(r.y, 0, 1), o.setFullYear(r.y, 0, "W" in r ? (r.w + 6) % 7 + 7 * r.W - (o.getDay() + 5) % 7 : r.w + 7 * r.U - (o.getDay() + 6) % 7)) : o.setFullYear(r.y, r.m, r.d), o.setHours(r.H + (r.Z / 100 | 0), r.M + r.Z % 100, r.S, r.L), i ? o._ : o
                }, e.toString = function() {
                    return t
                }, e
            }

            function n(t, e, n, r) {
                for (var i, o, u, a = 0, s = e.length, c = n.length; a < s;) {
                    if (r >= c) return -1;
                    if (37 === (i = e.charCodeAt(a++))) {
                        if (u = e.charAt(a++), !(o = w[u in Yu ? e.charAt(a++) : u]) || (r = o(t, n, r)) < 0) return -1
                    } else if (i != n.charCodeAt(r++)) return -1
                }
                return r
            }
            var r = t.dateTime,
                i = t.date,
                o = t.time,
                u = t.periods,
                a = t.days,
                s = t.shortDays,
                c = t.months,
                l = t.shortMonths;
            e.utc = function(t) {
                function n(t) {
                    try {
                        var e = new($u = Ht);
                        return e._ = t, r(e)
                    } finally {
                        $u = Date
                    }
                }
                var r = e(t);
                return n.parse = function(t) {
                    try {
                        $u = Ht;
                        var e = r.parse(t);
                        return e && e._
                    } finally {
                        $u = Date
                    }
                }, n.toString = r.toString, n
            }, e.multi = e.utc.multi = ae;
            var f = Uo.map(),
                h = Wt(a),
                p = Bt(a),
                d = Wt(s),
                g = Bt(s),
                v = Wt(c),
                y = Bt(c),
                m = Wt(l),
                x = Bt(l);
            u.forEach(function(t, e) {
                f.set(t.toLowerCase(), e)
            });
            var b = {
                    a: function(t) {
                        return s[t.getDay()]
                    },
                    A: function(t) {
                        return a[t.getDay()]
                    },
                    b: function(t) {
                        return l[t.getMonth()]
                    },
                    B: function(t) {
                        return c[t.getMonth()]
                    },
                    c: e(r),
                    d: function(t, e) {
                        return Ut(t.getDate(), e, 2)
                    },
                    e: function(t, e) {
                        return Ut(t.getDate(), e, 2)
                    },
                    H: function(t, e) {
                        return Ut(t.getHours(), e, 2)
                    },
                    I: function(t, e) {
                        return Ut(t.getHours() % 12 || 12, e, 2)
                    },
                    j: function(t, e) {
                        return Ut(1 + Bu.dayOfYear(t), e, 3)
                    },
                    L: function(t, e) {
                        return Ut(t.getMilliseconds(), e, 3)
                    },
                    m: function(t, e) {
                        return Ut(t.getMonth() + 1, e, 2)
                    },
                    M: function(t, e) {
                        return Ut(t.getMinutes(), e, 2)
                    },
                    p: function(t) {
                        return u[+(t.getHours() >= 12)]
                    },
                    S: function(t, e) {
                        return Ut(t.getSeconds(), e, 2)
                    },
                    U: function(t, e) {
                        return Ut(Bu.sundayOfYear(t), e, 2)
                    },
                    w: function(t) {
                        return t.getDay()
                    },
                    W: function(t, e) {
                        return Ut(Bu.mondayOfYear(t), e, 2)
                    },
                    x: e(i),
                    X: e(o),
                    y: function(t, e) {
                        return Ut(t.getFullYear() % 100, e, 2)
                    },
                    Y: function(t, e) {
                        return Ut(t.getFullYear() % 1e4, e, 4)
                    },
                    Z: oe,
                    "%": function() {
                        return "%"
                    }
                },
                w = {
                    a: function(t, e, n) {
                        d.lastIndex = 0;
                        var r = d.exec(e.slice(n));
                        return r ? (t.w = g.get(r[0].toLowerCase()), n + r[0].length) : -1
                    },
                    A: function(t, e, n) {
                        h.lastIndex = 0;
                        var r = h.exec(e.slice(n));
                        return r ? (t.w = p.get(r[0].toLowerCase()), n + r[0].length) : -1
                    },
                    b: function(t, e, n) {
                        m.lastIndex = 0;
                        var r = m.exec(e.slice(n));
                        return r ? (t.m = x.get(r[0].toLowerCase()), n + r[0].length) : -1
                    },
                    B: function(t, e, n) {
                        v.lastIndex = 0;
                        var r = v.exec(e.slice(n));
                        return r ? (t.m = y.get(r[0].toLowerCase()), n + r[0].length) : -1
                    },
                    c: function(t, e, r) {
                        return n(t, b.c.toString(), e, r)
                    },
                    d: Qt,
                    e: Qt,
                    H: ee,
                    I: ee,
                    j: te,
                    L: ie,
                    m: Jt,
                    M: ne,
                    p: function(t, e, n) {
                        var r = f.get(e.slice(n, n += 2).toLowerCase());
                        return null == r ? -1 : (t.p = r, n)
                    },
                    S: re,
                    U: Vt,
                    w: $t,
                    W: Yt,
                    x: function(t, e, r) {
                        return n(t, b.x.toString(), e, r)
                    },
                    X: function(t, e, r) {
                        return n(t, b.X.toString(), e, r)
                    },
                    y: Zt,
                    Y: Xt,
                    Z: Gt,
                    "%": ue
                };
            return e
        }

        function Ut(t, e, n) {
            var r = t < 0 ? "-" : "",
                i = (r ? -t : t) + "",
                o = i.length;
            return r + (o < n ? new Array(n - o + 1).join(e) + i : i)
        }

        function Wt(t) {
            return new RegExp("^(?:" + t.map(Uo.requote).join("|") + ")", "i")
        }

        function Bt(t) {
            for (var e = new c, n = -1, r = t.length; ++n < r;) e.set(t[n].toLowerCase(), n);
            return e
        }

        function $t(t, e, n) {
            Xu.lastIndex = 0;
            var r = Xu.exec(e.slice(n, n + 1));
            return r ? (t.w = +r[0], n + r[0].length) : -1
        }

        function Vt(t, e, n) {
            Xu.lastIndex = 0;
            var r = Xu.exec(e.slice(n));
            return r ? (t.U = +r[0], n + r[0].length) : -1
        }

        function Yt(t, e, n) {
            Xu.lastIndex = 0;
            var r = Xu.exec(e.slice(n));
            return r ? (t.W = +r[0], n + r[0].length) : -1
        }

        function Xt(t, e, n) {
            Xu.lastIndex = 0;
            var r = Xu.exec(e.slice(n, n + 4));
            return r ? (t.y = +r[0], n + r[0].length) : -1
        }

        function Zt(t, e, n) {
            Xu.lastIndex = 0;
            var r = Xu.exec(e.slice(n, n + 2));
            return r ? (t.y = Kt(+r[0]), n + r[0].length) : -1
        }

        function Gt(t, e, n) {
            return /^[+-]\d{4}$/.test(e = e.slice(n, n + 5)) ? (t.Z = -e, n + 5) : -1
        }

        function Kt(t) {
            return t + (t > 68 ? 1900 : 2e3)
        }

        function Jt(t, e, n) {
            Xu.lastIndex = 0;
            var r = Xu.exec(e.slice(n, n + 2));
            return r ? (t.m = r[0] - 1, n + r[0].length) : -1
        }

        function Qt(t, e, n) {
            Xu.lastIndex = 0;
            var r = Xu.exec(e.slice(n, n + 2));
            return r ? (t.d = +r[0], n + r[0].length) : -1
        }

        function te(t, e, n) {
            Xu.lastIndex = 0;
            var r = Xu.exec(e.slice(n, n + 3));
            return r ? (t.j = +r[0], n + r[0].length) : -1
        }

        function ee(t, e, n) {
            Xu.lastIndex = 0;
            var r = Xu.exec(e.slice(n, n + 2));
            return r ? (t.H = +r[0], n + r[0].length) : -1
        }

        function ne(t, e, n) {
            Xu.lastIndex = 0;
            var r = Xu.exec(e.slice(n, n + 2));
            return r ? (t.M = +r[0], n + r[0].length) : -1
        }

        function re(t, e, n) {
            Xu.lastIndex = 0;
            var r = Xu.exec(e.slice(n, n + 2));
            return r ? (t.S = +r[0], n + r[0].length) : -1
        }

        function ie(t, e, n) {
            Xu.lastIndex = 0;
            var r = Xu.exec(e.slice(n, n + 3));
            return r ? (t.L = +r[0], n + r[0].length) : -1
        }

        function oe(t) {
            var e = t.getTimezoneOffset(),
                n = e > 0 ? "-" : "+",
                r = Jo(e) / 60 | 0,
                i = Jo(e) % 60;
            return n + Ut(r, "0", 2) + Ut(i, "0", 2)
        }

        function ue(t, e, n) {
            Zu.lastIndex = 0;
            var r = Zu.exec(e.slice(n, n + 1));
            return r ? n + r[0].length : -1
        }

        function ae(t) {
            for (var e = t.length, n = -1; ++n < e;) t[n][0] = this(t[n][0]);
            return function(e) {
                for (var n = 0, r = t[n]; !r[1](e);) r = t[++n];
                return r[0](e)
            }
        }

        function se() {}

        function ce(t, e, n) {
            var r = n.s = t + e,
                i = r - t,
                o = r - i;
            n.t = t - o + (e - i)
        }

        function le(t, e) {
            t && Qu.hasOwnProperty(t.type) && Qu[t.type](t, e)
        }

        function fe(t, e, n) {
            var r, i = -1,
                o = t.length - n;
            for (e.lineStart(); ++i < o;) r = t[i], e.point(r[0], r[1], r[2]);
            e.lineEnd()
        }

        function he(t, e) {
            var n = -1,
                r = t.length;
            for (e.polygonStart(); ++n < r;) fe(t[n], e, 1);
            e.polygonEnd()
        }

        function pe() {
            function t(t, e) {
                e = e * wu / 2 + yu / 4;
                var n = (t *= wu) - r,
                    u = n >= 0 ? 1 : -1,
                    a = u * n,
                    s = Math.cos(e),
                    c = Math.sin(e),
                    l = o * c,
                    f = i * s + l * Math.cos(a),
                    h = l * u * Math.sin(a);
                ea.add(Math.atan2(h, f)), r = t, i = s, o = c
            }
            var e, n, r, i, o;
            na.point = function(u, a) {
                na.point = t, r = (e = u) * wu, i = Math.cos(a = (n = a) * wu / 2 + yu / 4), o = Math.sin(a)
            }, na.lineEnd = function() {
                t(e, n)
            }
        }

        function de(t) {
            var e = t[0],
                n = t[1],
                r = Math.cos(n);
            return [r * Math.cos(e), r * Math.sin(e), Math.sin(n)]
        }

        function ge(t, e) {
            return t[0] * e[0] + t[1] * e[1] + t[2] * e[2]
        }

        function ve(t, e) {
            return [t[1] * e[2] - t[2] * e[1], t[2] * e[0] - t[0] * e[2], t[0] * e[1] - t[1] * e[0]]
        }

        function ye(t, e) {
            t[0] += e[0], t[1] += e[1], t[2] += e[2]
        }

        function me(t, e) {
            return [t[0] * e, t[1] * e, t[2] * e]
        }

        function xe(t) {
            var e = Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2]);
            t[0] /= e, t[1] /= e, t[2] /= e
        }

        function be(t) {
            return [Math.atan2(t[1], t[0]), et(t[2])]
        }

        function we(t, e) {
            return Jo(t[0] - e[0]) < gu && Jo(t[1] - e[1]) < gu
        }

        function Me(t, e) {
            t *= wu;
            var n = Math.cos(e *= wu);
            ke(n * Math.cos(t), n * Math.sin(t), Math.sin(e))
        }

        function ke(t, e, n) {
            oa += (t - oa) / ++ra, ua += (e - ua) / ra, aa += (n - aa) / ra
        }

        function Ee() {
            function t(t, i) {
                t *= wu;
                var o = Math.cos(i *= wu),
                    u = o * Math.cos(t),
                    a = o * Math.sin(t),
                    s = Math.sin(i),
                    c = Math.atan2(Math.sqrt((c = n * s - r * a) * c + (c = r * u - e * s) * c + (c = e * a - n * u) * c), e * u + n * a + r * s);
                ia += c, sa += c * (e + (e = u)), ca += c * (n + (n = a)), la += c * (r + (r = s)), ke(e, n, r)
            }
            var e, n, r;
            da.point = function(i, o) {
                i *= wu;
                var u = Math.cos(o *= wu);
                e = u * Math.cos(i), n = u * Math.sin(i), r = Math.sin(o), da.point = t, ke(e, n, r)
            }
        }

        function Ce() {
            da.point = Me
        }

        function Te() {
            function t(t, e) {
                t *= wu;
                var n = Math.cos(e *= wu),
                    u = n * Math.cos(t),
                    a = n * Math.sin(t),
                    s = Math.sin(e),
                    c = i * s - o * a,
                    l = o * u - r * s,
                    f = r * a - i * u,
                    h = Math.sqrt(c * c + l * l + f * f),
                    p = r * u + i * a + o * s,
                    d = h && -tt(p) / h,
                    g = Math.atan2(h, p);
                fa += d * c, ha += d * l, pa += d * f, ia += g, sa += g * (r + (r = u)), ca += g * (i + (i = a)), la += g * (o + (o = s)), ke(r, i, o)
            }
            var e, n, r, i, o;
            da.point = function(u, a) {
                e = u, n = a, da.point = t, u *= wu;
                var s = Math.cos(a *= wu);
                r = s * Math.cos(u), i = s * Math.sin(u), o = Math.sin(a), ke(r, i, o)
            }, da.lineEnd = function() {
                t(e, n), da.lineEnd = Ce, da.point = Me
            }
        }

        function Se(t, e) {
            function n(n, r) {
                return n = t(n, r), e(n[0], n[1])
            }
            return t.invert && e.invert && (n.invert = function(n, r) {
                return (n = e.invert(n, r)) && t.invert(n[0], n[1])
            }), n
        }

        function Ne() {
            return !0
        }

        function _e(t, e, n, r, i) {
            var o = [],
                u = [];
            if (t.forEach(function(t) {
                    if (!((e = t.length - 1) <= 0)) {
                        var e, n = t[0],
                            r = t[e];
                        if (we(n, r)) {
                            i.lineStart();
                            for (var a = 0; a < e; ++a) i.point((n = t[a])[0], n[1]);
                            i.lineEnd()
                        } else {
                            var s = new Le(n, t, null, !0),
                                c = new Le(n, null, s, !1);
                            s.o = c, o.push(s), u.push(c), c = new Le(r, null, s = new Le(r, t, null, !1), !0), s.o = c, o.push(s), u.push(c)
                        }
                    }
                }), u.sort(e), Ae(o), Ae(u), o.length) {
                for (var a = 0, s = n, c = u.length; a < c; ++a) u[a].e = s = !s;
                for (var l, f, h = o[0];;) {
                    for (var p = h, d = !0; p.v;)
                        if ((p = p.n) === h) return;
                    l = p.z, i.lineStart();
                    do {
                        if (p.v = p.o.v = !0, p.e) {
                            if (d)
                                for (var a = 0, c = l.length; a < c; ++a) i.point((f = l[a])[0], f[1]);
                            else r(p.x, p.n.x, 1, i);
                            p = p.n
                        } else {
                            if (d)
                                for (a = (l = p.p.z).length - 1; a >= 0; --a) i.point((f = l[a])[0], f[1]);
                            else r(p.x, p.p.x, -1, i);
                            p = p.p
                        }
                        l = (p = p.o).z, d = !d
                    } while (!p.v);
                    i.lineEnd()
                }
            }
        }

        function Ae(t) {
            if (e = t.length) {
                for (var e, n, r = 0, i = t[0]; ++r < e;) i.n = n = t[r], n.p = i, i = n;
                i.n = n = t[0], n.p = i
            }
        }

        function Le(t, e, n, r) {
            this.x = t, this.z = e, this.o = n, this.e = r, this.v = !1, this.n = this.p = null
        }

        function De(t, e, n, r) {
            return function(i, o) {
                function u(e, n) {
                    var r = i(e, n);
                    t(e = r[0], n = r[1]) && o.point(e, n)
                }

                function a(t, e) {
                    var n = i(t, e);
                    v.point(n[0], n[1])
                }

                function s() {
                    m.point = a, v.lineStart()
                }

                function c() {
                    m.point = u, v.lineEnd()
                }

                function l(t, e) {
                    g.push([t, e]);
                    var n = i(t, e);
                    b.point(n[0], n[1])
                }

                function f() {
                    b.lineStart(), g = []
                }

                function h() {
                    l(g[0][0], g[0][1]), b.lineEnd();
                    var t, e = b.clean(),
                        n = x.buffer(),
                        r = n.length;
                    if (g.pop(), d.push(g), g = null, r)
                        if (1 & e) {
                            var i, u = -1;
                            if ((r = (t = n[0]).length - 1) > 0) {
                                for (w || (o.polygonStart(), w = !0), o.lineStart(); ++u < r;) o.point((i = t[u])[0], i[1]);
                                o.lineEnd()
                            }
                        } else r > 1 && 2 & e && n.push(n.pop().concat(n.shift())), p.push(n.filter(qe))
                }
                var p, d, g, v = e(o),
                    y = i.invert(r[0], r[1]),
                    m = {
                        point: u,
                        lineStart: s,
                        lineEnd: c,
                        polygonStart: function() {
                            m.point = l, m.lineStart = f, m.lineEnd = h, p = [], d = []
                        },
                        polygonEnd: function() {
                            m.point = u, m.lineStart = s, m.lineEnd = c, p = Uo.merge(p);
                            var t = Re(y, d);
                            p.length ? (w || (o.polygonStart(), w = !0), _e(p, Pe, t, n, o)) : t && (w || (o.polygonStart(), w = !0), o.lineStart(), n(null, null, 1, o), o.lineEnd()), w && (o.polygonEnd(), w = !1), p = d = null
                        },
                        sphere: function() {
                            o.polygonStart(), o.lineStart(), n(null, null, 1, o), o.lineEnd(), o.polygonEnd()
                        }
                    },
                    x = je(),
                    b = e(x),
                    w = !1;
                return m
            }
        }

        function qe(t) {
            return t.length > 1
        }

        function je() {
            var t, e = [];
            return {
                lineStart: function() {
                    e.push(t = [])
                },
                point: function(e, n) {
                    t.push([e, n])
                },
                lineEnd: w,
                buffer: function() {
                    var n = e;
                    return e = [], t = null, n
                },
                rejoin: function() {
                    e.length > 1 && e.push(e.pop().concat(e.shift()))
                }
            }
        }

        function Pe(t, e) {
            return ((t = t.x)[0] < 0 ? t[1] - bu - gu : bu - t[1]) - ((e = e.x)[0] < 0 ? e[1] - bu - gu : bu - e[1])
        }

        function Oe(t, e, n, r) {
            var i, o, u = Math.sin(t - n);
            return Jo(u) > gu ? Math.atan((Math.sin(e) * (o = Math.cos(r)) * Math.sin(n) - Math.sin(r) * (i = Math.cos(e)) * Math.sin(t)) / (i * o * u)) : (e + r) / 2
        }

        function Re(t, e) {
            var n = t[0],
                r = t[1],
                i = [Math.sin(n), -Math.cos(n), 0],
                o = 0,
                u = 0;
            ea.reset();
            for (var a = 0, s = e.length; a < s; ++a) {
                var c = e[a],
                    l = c.length;
                if (l)
                    for (var f = c[0], h = f[0], p = f[1] / 2 + yu / 4, d = Math.sin(p), g = Math.cos(p), v = 1;;) {
                        v === l && (v = 0);
                        var y = (t = c[v])[0],
                            m = t[1] / 2 + yu / 4,
                            x = Math.sin(m),
                            b = Math.cos(m),
                            w = y - h,
                            M = w >= 0 ? 1 : -1,
                            k = M * w,
                            E = k > yu,
                            C = d * x;
                        if (ea.add(Math.atan2(C * M * Math.sin(k), g * b + C * Math.cos(k))), o += E ? w + M * mu : w, E ^ h >= n ^ y >= n) {
                            var T = ve(de(f), de(t));
                            xe(T);
                            var S = ve(i, T);
                            xe(S);
                            var N = (E ^ w >= 0 ? -1 : 1) * et(S[2]);
                            (r > N || r === N && (T[0] || T[1])) && (u += E ^ w >= 0 ? 1 : -1)
                        }
                        if (!v++) break;
                        h = y, d = x, g = b, f = t
                    }
            }
            return (o < -gu || o < gu && ea < -gu) ^ 1 & u
        }

        function He(t) {
            function e(t, e) {
                return Math.cos(t) * Math.cos(e) > i
            }

            function n(t, e, n) {
                var r = [1, 0, 0],
                    o = ve(de(t), de(e)),
                    u = ge(o, o),
                    a = o[0],
                    s = u - a * a;
                if (!s) return !n && t;
                var c = i * u / s,
                    l = -i * a / s,
                    f = ve(r, o),
                    h = me(r, c);
                ye(h, me(o, l));
                var p = f,
                    d = ge(h, p),
                    g = ge(p, p),
                    v = d * d - g * (ge(h, h) - 1);
                if (!(v < 0)) {
                    var y = Math.sqrt(v),
                        m = me(p, (-d - y) / g);
                    if (ye(m, h), m = be(m), !n) return m;
                    var x, b = t[0],
                        w = e[0],
                        M = t[1],
                        k = e[1];
                    w < b && (x = b, b = w, w = x);
                    var E = w - b,
                        C = Jo(E - yu) < gu,
                        T = C || E < gu;
                    if (!C && k < M && (x = M, M = k, k = x), T ? C ? M + k > 0 ^ m[1] < (Jo(m[0] - b) < gu ? M : k) : M <= m[1] && m[1] <= k : E > yu ^ (b <= m[0] && m[0] <= w)) {
                        var S = me(p, (-d + y) / g);
                        return ye(S, h), [m, be(S)]
                    }
                }
            }

            function r(e, n) {
                var r = o ? t : yu - t,
                    i = 0;
                return e < -r ? i |= 1 : e > r && (i |= 2), n < -r ? i |= 4 : n > r && (i |= 8), i
            }
            var i = Math.cos(t),
                o = i > 0,
                u = Jo(i) > gu;
            return De(e, function(t) {
                var i, a, s, c, l;
                return {
                    lineStart: function() {
                        c = s = !1, l = 1
                    },
                    point: function(f, h) {
                        var p, d = [f, h],
                            g = e(f, h),
                            v = o ? g ? 0 : r(f, h) : g ? r(f + (f < 0 ? yu : -yu), h) : 0;
                        if (!i && (c = s = g) && t.lineStart(), g !== s && (p = n(i, d), (we(i, p) || we(d, p)) && (d[0] += gu, d[1] += gu, g = e(d[0], d[1]))), g !== s) l = 0, g ? (t.lineStart(), p = n(d, i), t.point(p[0], p[1])) : (p = n(i, d), t.point(p[0], p[1]), t.lineEnd()), i = p;
                        else if (u && i && o ^ g) {
                            var y;
                            v & a || !(y = n(d, i, !0)) || (l = 0, o ? (t.lineStart(), t.point(y[0][0], y[0][1]), t.point(y[1][0], y[1][1]), t.lineEnd()) : (t.point(y[1][0], y[1][1]), t.lineEnd(), t.lineStart(), t.point(y[0][0], y[0][1])))
                        }!g || i && we(i, d) || t.point(d[0], d[1]), i = d, s = g, a = v
                    },
                    lineEnd: function() {
                        s && t.lineEnd(), i = null
                    },
                    clean: function() {
                        return l | (c && s) << 1
                    }
                }
            }, fn(t, 6 * wu), o ? [0, -t] : [-yu, t - yu])
        }

        function Fe(t, e, n, r) {
            return function(i) {
                var o, u = i.a,
                    a = i.b,
                    s = u.x,
                    c = u.y,
                    l = 0,
                    f = 1,
                    h = a.x - s,
                    p = a.y - c;
                if (o = t - s, h || !(o > 0)) {
                    if (o /= h, h < 0) {
                        if (o < l) return;
                        o < f && (f = o)
                    } else if (h > 0) {
                        if (o > f) return;
                        o > l && (l = o)
                    }
                    if (o = n - s, h || !(o < 0)) {
                        if (o /= h, h < 0) {
                            if (o > f) return;
                            o > l && (l = o)
                        } else if (h > 0) {
                            if (o < l) return;
                            o < f && (f = o)
                        }
                        if (o = e - c, p || !(o > 0)) {
                            if (o /= p, p < 0) {
                                if (o < l) return;
                                o < f && (f = o)
                            } else if (p > 0) {
                                if (o > f) return;
                                o > l && (l = o)
                            }
                            if (o = r - c, p || !(o < 0)) {
                                if (o /= p, p < 0) {
                                    if (o > f) return;
                                    o > l && (l = o)
                                } else if (p > 0) {
                                    if (o < l) return;
                                    o < f && (f = o)
                                }
                                return l > 0 && (i.a = {
                                    x: s + l * h,
                                    y: c + l * p
                                }), f < 1 && (i.b = {
                                    x: s + f * h,
                                    y: c + f * p
                                }), i
                            }
                        }
                    }
                }
            }
        }

        function ze(t, e, n, r) {
            function i(r, i) {
                return Jo(r[0] - t) < gu ? i > 0 ? 0 : 3 : Jo(r[0] - n) < gu ? i > 0 ? 2 : 1 : Jo(r[1] - e) < gu ? i > 0 ? 1 : 0 : i > 0 ? 3 : 2
            }

            function o(t, e) {
                return u(t.x, e.x)
            }

            function u(t, e) {
                var n = i(t, 1),
                    r = i(e, 1);
                return n !== r ? n - r : 0 === n ? e[1] - t[1] : 1 === n ? t[0] - e[0] : 2 === n ? t[1] - e[1] : e[0] - t[0]
            }
            return function(a) {
                function s(t) {
                    for (var e = 0, n = d.length, r = t[1], i = 0; i < n; ++i)
                        for (var o, u = 1, a = d[i], s = a.length, c = a[0]; u < s; ++u) o = a[u], c[1] <= r ? o[1] > r && Q(c, o, t) > 0 && ++e : o[1] <= r && Q(c, o, t) < 0 && --e, c = o;
                    return 0 !== e
                }

                function c(o, a, s, c) {
                    var l = 0,
                        f = 0;
                    if (null == o || (l = i(o, s)) !== (f = i(a, s)) || u(o, a) < 0 ^ s > 0)
                        do {
                            c.point(0 === l || 3 === l ? t : n, l > 1 ? r : e)
                        } while ((l = (l + s + 4) % 4) !== f);
                    else c.point(a[0], a[1])
                }

                function l(i, o) {
                    return t <= i && i <= n && e <= o && o <= r
                }

                function f(t, e) {
                    l(t, e) && a.point(t, e)
                }

                function h(t, e) {
                    var n = l(t = Math.max(-va, Math.min(va, t)), e = Math.max(-va, Math.min(va, e)));
                    if (d && g.push([t, e]), M) v = t, y = e, m = n, M = !1, n && (a.lineStart(), a.point(t, e));
                    else if (n && w) a.point(t, e);
                    else {
                        var r = {
                            a: {
                                x: x,
                                y: b
                            },
                            b: {
                                x: t,
                                y: e
                            }
                        };
                        T(r) ? (w || (a.lineStart(), a.point(r.a.x, r.a.y)), a.point(r.b.x, r.b.y), n || a.lineEnd(), k = !1) : n && (a.lineStart(), a.point(t, e), k = !1)
                    }
                    x = t, b = e, w = n
                }
                var p, d, g, v, y, m, x, b, w, M, k, E = a,
                    C = je(),
                    T = Fe(t, e, n, r),
                    S = {
                        point: f,
                        lineStart: function() {
                            S.point = h, d && d.push(g = []), M = !0, w = !1, x = b = NaN
                        },
                        lineEnd: function() {
                            p && (h(v, y), m && w && C.rejoin(), p.push(C.buffer())), S.point = f, w && a.lineEnd()
                        },
                        polygonStart: function() {
                            a = C, p = [], d = [], k = !0
                        },
                        polygonEnd: function() {
                            a = E, p = Uo.merge(p);
                            var e = s([t, r]),
                                n = k && e,
                                i = p.length;
                            (n || i) && (a.polygonStart(), n && (a.lineStart(), c(null, null, 1, a), a.lineEnd()), i && _e(p, o, e, c, a), a.polygonEnd()), p = d = g = null
                        }
                    };
                return S
            }
        }

        function Ie(t) {
            var e = 0,
                n = yu / 3,
                r = nn(t),
                i = r(e, n);
            return i.parallels = function(t) {
                return arguments.length ? r(e = t[0] * yu / 180, n = t[1] * yu / 180) : [e / yu * 180, n / yu * 180]
            }, i
        }

        function Ue(t, e) {
            function n(t, e) {
                var n = Math.sqrt(o - 2 * i * Math.sin(e)) / i;
                return [n * Math.sin(t *= i), u - n * Math.cos(t)]
            }
            var r = Math.sin(t),
                i = (r + Math.sin(e)) / 2,
                o = 1 + r * (2 * i - r),
                u = Math.sqrt(o) / i;
            return n.invert = function(t, e) {
                var n = u - e;
                return [Math.atan2(t, n) / i, et((o - (t * t + n * n) * i * i) / (2 * i))]
            }, n
        }

        function We() {
            function t(t, e) {
                ma += i * t - r * e, r = t, i = e
            }
            var e, n, r, i;
            ka.point = function(o, u) {
                ka.point = t, e = r = o, n = i = u
            }, ka.lineEnd = function() {
                t(e, n)
            }
        }

        function Be() {
            function t(t, e) {
                u.push("M", t, ",", e, o)
            }

            function e(t, e) {
                u.push("M", t, ",", e), a.point = n
            }

            function n(t, e) {
                u.push("L", t, ",", e)
            }

            function r() {
                a.point = t
            }

            function i() {
                u.push("Z")
            }
            var o = $e(4.5),
                u = [],
                a = {
                    point: t,
                    lineStart: function() {
                        a.point = e
                    },
                    lineEnd: r,
                    polygonStart: function() {
                        a.lineEnd = i
                    },
                    polygonEnd: function() {
                        a.lineEnd = r, a.point = t
                    },
                    pointRadius: function(t) {
                        return o = $e(t), a
                    },
                    result: function() {
                        if (u.length) {
                            var t = u.join("");
                            return u = [], t
                        }
                    }
                };
            return a
        }

        function $e(t) {
            return "m0," + t + "a" + t + "," + t + " 0 1,1 0," + -2 * t + "a" + t + "," + t + " 0 1,1 0," + 2 * t + "z"
        }

        function Ve(t, e) {
            oa += t, ua += e, ++aa
        }

        function Ye() {
            function t(t, r) {
                var i = t - e,
                    o = r - n,
                    u = Math.sqrt(i * i + o * o);
                sa += u * (e + t) / 2, ca += u * (n + r) / 2, la += u, Ve(e = t, n = r)
            }
            var e, n;
            Ca.point = function(r, i) {
                Ca.point = t, Ve(e = r, n = i)
            }
        }

        function Xe() {
            Ca.point = Ve
        }

        function Ze() {
            function t(t, e) {
                var n = t - r,
                    o = e - i,
                    u = Math.sqrt(n * n + o * o);
                sa += u * (r + t) / 2, ca += u * (i + e) / 2, la += u, fa += (u = i * t - r * e) * (r + t), ha += u * (i + e), pa += 3 * u, Ve(r = t, i = e)
            }
            var e, n, r, i;
            Ca.point = function(o, u) {
                Ca.point = t, Ve(e = r = o, n = i = u)
            }, Ca.lineEnd = function() {
                t(e, n)
            }
        }

        function Ge(t) {
            function e(e, n) {
                t.moveTo(e + u, n), t.arc(e, n, u, 0, mu)
            }

            function n(e, n) {
                t.moveTo(e, n), a.point = r
            }

            function r(e, n) {
                t.lineTo(e, n)
            }

            function i() {
                a.point = e
            }

            function o() {
                t.closePath()
            }
            var u = 4.5,
                a = {
                    point: e,
                    lineStart: function() {
                        a.point = n
                    },
                    lineEnd: i,
                    polygonStart: function() {
                        a.lineEnd = o
                    },
                    polygonEnd: function() {
                        a.lineEnd = i, a.point = e
                    },
                    pointRadius: function(t) {
                        return u = t, a
                    },
                    result: w
                };
            return a
        }

        function Ke(t) {
            function e(t) {
                return (a ? r : n)(t)
            }

            function n(e) {
                return tn(e, function(n, r) {
                    n = t(n, r), e.point(n[0], n[1])
                })
            }

            function r(e) {
                function n(n, r) {
                    n = t(n, r), e.point(n[0], n[1])
                }

                function r() {
                    x = NaN, E.point = o, e.lineStart()
                }

                function o(n, r) {
                    var o = de([n, r]),
                        u = t(n, r);
                    i(x, b, m, w, M, k, x = u[0], b = u[1], m = n, w = o[0], M = o[1], k = o[2], a, e), e.point(x, b)
                }

                function u() {
                    E.point = n, e.lineEnd()
                }

                function s() {
                    r(), E.point = c, E.lineEnd = l
                }

                function c(t, e) {
                    o(f = t, h = e), p = x, d = b, g = w, v = M, y = k, E.point = o
                }

                function l() {
                    i(x, b, m, w, M, k, p, d, f, g, v, y, a, e), E.lineEnd = u, u()
                }
                var f, h, p, d, g, v, y, m, x, b, w, M, k, E = {
                    point: n,
                    lineStart: r,
                    lineEnd: u,
                    polygonStart: function() {
                        e.polygonStart(), E.lineStart = s
                    },
                    polygonEnd: function() {
                        e.polygonEnd(), E.lineStart = r
                    }
                };
                return E
            }

            function i(e, n, r, a, s, c, l, f, h, p, d, g, v, y) {
                var m = l - e,
                    x = f - n,
                    b = m * m + x * x;
                if (b > 4 * o && v--) {
                    var w = a + p,
                        M = s + d,
                        k = c + g,
                        E = Math.sqrt(w * w + M * M + k * k),
                        C = Math.asin(k /= E),
                        T = Jo(Jo(k) - 1) < gu || Jo(r - h) < gu ? (r + h) / 2 : Math.atan2(M, w),
                        S = t(T, C),
                        N = S[0],
                        _ = S[1],
                        A = N - e,
                        L = _ - n,
                        D = x * A - m * L;
                    (D * D / b > o || Jo((m * A + x * L) / b - .5) > .3 || a * p + s * d + c * g < u) && (i(e, n, r, a, s, c, N, _, T, w /= E, M /= E, k, v, y), y.point(N, _), i(N, _, T, w, M, k, l, f, h, p, d, g, v, y))
                }
            }
            var o = .5,
                u = Math.cos(30 * wu),
                a = 16;
            return e.precision = function(t) {
                return arguments.length ? (a = (o = t * t) > 0 && 16, e) : Math.sqrt(o)
            }, e
        }

        function Je(t) {
            var e = Ke(function(e, n) {
                return t([e * Mu, n * Mu])
            });
            return function(t) {
                return rn(e(t))
            }
        }

        function Qe(t) {
            this.stream = t
        }

        function tn(t, e) {
            return {
                point: e,
                sphere: function() {
                    t.sphere()
                },
                lineStart: function() {
                    t.lineStart()
                },
                lineEnd: function() {
                    t.lineEnd()
                },
                polygonStart: function() {
                    t.polygonStart()
                },
                polygonEnd: function() {
                    t.polygonEnd()
                }
            }
        }

        function en(t) {
            return nn(function() {
                return t
            })()
        }

        function nn(t) {
            function e(t) {
                return t = a(t[0] * wu, t[1] * wu), [t[0] * h + s, c - t[1] * h]
            }

            function n(t) {
                return (t = a.invert((t[0] - s) / h, (c - t[1]) / h)) && [t[0] * Mu, t[1] * Mu]
            }

            function r() {
                a = Se(u = an(y, x, b), o);
                var t = o(g, v);
                return s = p - t[0] * h, c = d + t[1] * h, i()
            }

            function i() {
                return l && (l.valid = !1, l = null), e
            }
            var o, u, a, s, c, l, f = Ke(function(t, e) {
                    return t = o(t, e), [t[0] * h + s, c - t[1] * h]
                }),
                h = 150,
                p = 480,
                d = 250,
                g = 0,
                v = 0,
                y = 0,
                x = 0,
                b = 0,
                w = ga,
                M = m,
                k = null,
                E = null;
            return e.stream = function(t) {
                return l && (l.valid = !1), l = rn(w(u, f(M(t)))), l.valid = !0, l
            }, e.clipAngle = function(t) {
                return arguments.length ? (w = null == t ? (k = t, ga) : He((k = +t) * wu), i()) : k
            }, e.clipExtent = function(t) {
                return arguments.length ? (E = t, M = t ? ze(t[0][0], t[0][1], t[1][0], t[1][1]) : m, i()) : E
            }, e.scale = function(t) {
                return arguments.length ? (h = +t, r()) : h
            }, e.translate = function(t) {
                return arguments.length ? (p = +t[0], d = +t[1], r()) : [p, d]
            }, e.center = function(t) {
                return arguments.length ? (g = t[0] % 360 * wu, v = t[1] % 360 * wu, r()) : [g * Mu, v * Mu]
            }, e.rotate = function(t) {
                return arguments.length ? (y = t[0] % 360 * wu, x = t[1] % 360 * wu, b = t.length > 2 ? t[2] % 360 * wu : 0, r()) : [y * Mu, x * Mu, b * Mu]
            }, Uo.rebind(e, f, "precision"),
                function() {
                    return o = t.apply(this, arguments), e.invert = o.invert && n, r()
                }
        }

        function rn(t) {
            return tn(t, function(e, n) {
                t.point(e * wu, n * wu)
            })
        }

        function on(t, e) {
            return [t, e]
        }

        function un(t, e) {
            return [t > yu ? t - mu : t < -yu ? t + mu : t, e]
        }

        function an(t, e, n) {
            return t ? e || n ? Se(cn(t), ln(e, n)) : cn(t) : e || n ? ln(e, n) : un
        }

        function sn(t) {
            return function(e, n) {
                return e += t, [e > yu ? e - mu : e < -yu ? e + mu : e, n]
            }
        }

        function cn(t) {
            var e = sn(t);
            return e.invert = sn(-t), e
        }

        function ln(t, e) {
            function n(t, e) {
                var n = Math.cos(e),
                    a = Math.cos(t) * n,
                    s = Math.sin(t) * n,
                    c = Math.sin(e),
                    l = c * r + a * i;
                return [Math.atan2(s * o - l * u, a * r - c * i), et(l * o + s * u)]
            }
            var r = Math.cos(t),
                i = Math.sin(t),
                o = Math.cos(e),
                u = Math.sin(e);
            return n.invert = function(t, e) {
                var n = Math.cos(e),
                    a = Math.cos(t) * n,
                    s = Math.sin(t) * n,
                    c = Math.sin(e),
                    l = c * o - s * u;
                return [Math.atan2(s * o + c * u, a * r + l * i), et(l * r - a * i)]
            }, n
        }

        function fn(t, e) {
            var n = Math.cos(t),
                r = Math.sin(t);
            return function(i, o, u, a) {
                var s = u * e;
                null != i ? (i = hn(n, i), o = hn(n, o), (u > 0 ? i < o : i > o) && (i += u * mu)) : (i = t + u * mu, o = t - .5 * s);
                for (var c, l = i; u > 0 ? l > o : l < o; l -= s) a.point((c = be([n, -r * Math.cos(l), -r * Math.sin(l)]))[0], c[1])
            }
        }

        function hn(t, e) {
            var n = de(e);
            n[0] -= t, xe(n);
            var r = tt(-n[1]);
            return ((-n[2] < 0 ? -r : r) + 2 * Math.PI - gu) % (2 * Math.PI)
        }

        function pn(t, e, n) {
            var r = Uo.range(t, e - gu, n).concat(e);
            return function(t) {
                return r.map(function(e) {
                    return [t, e]
                })
            }
        }

        function dn(t, e, n) {
            var r = Uo.range(t, e - gu, n).concat(e);
            return function(t) {
                return r.map(function(e) {
                    return [e, t]
                })
            }
        }

        function gn(t) {
            return t.source
        }

        function vn(t) {
            return t.target
        }

        function yn(t, e, n, r) {
            var i = Math.cos(e),
                o = Math.sin(e),
                u = Math.cos(r),
                a = Math.sin(r),
                s = i * Math.cos(t),
                c = i * Math.sin(t),
                l = u * Math.cos(n),
                f = u * Math.sin(n),
                h = 2 * Math.asin(Math.sqrt(ot(r - e) + i * u * ot(n - t))),
                p = 1 / Math.sin(h),
                d = h ? function(t) {
                    var e = Math.sin(t *= h) * p,
                        n = Math.sin(h - t) * p,
                        r = n * s + e * l,
                        i = n * c + e * f,
                        u = n * o + e * a;
                    return [Math.atan2(i, r) * Mu, Math.atan2(u, Math.sqrt(r * r + i * i)) * Mu]
                } : function() {
                    return [t * Mu, e * Mu]
                };
            return d.distance = h, d
        }

        function mn(t, e) {
            function n(e, n) {
                var r = Math.cos(e),
                    i = Math.cos(n),
                    o = t(r * i);
                return [o * i * Math.sin(e), o * Math.sin(n)]
            }
            return n.invert = function(t, n) {
                var r = Math.sqrt(t * t + n * n),
                    i = e(r),
                    o = Math.sin(i),
                    u = Math.cos(i);
                return [Math.atan2(t * o, r * u), Math.asin(r && n * o / r)]
            }, n
        }

        function xn(t, e) {
            function n(t, e) {
                u > 0 ? e < -bu + gu && (e = -bu + gu) : e > bu - gu && (e = bu - gu);
                var n = u / Math.pow(i(e), o);
                return [n * Math.sin(o * t), u - n * Math.cos(o * t)]
            }
            var r = Math.cos(t),
                i = function(t) {
                    return Math.tan(yu / 4 + t / 2)
                },
                o = t === e ? Math.sin(t) : Math.log(r / Math.cos(e)) / Math.log(i(e) / i(t)),
                u = r * Math.pow(i(t), o) / o;
            return o ? (n.invert = function(t, e) {
                var n = u - e,
                    r = J(o) * Math.sqrt(t * t + n * n);
                return [Math.atan2(t, n) / o, 2 * Math.atan(Math.pow(u / r, 1 / o)) - bu]
            }, n) : wn
        }

        function bn(t, e) {
            function n(t, e) {
                var n = o - e;
                return [n * Math.sin(i * t), o - n * Math.cos(i * t)]
            }
            var r = Math.cos(t),
                i = t === e ? Math.sin(t) : (r - Math.cos(e)) / (e - t),
                o = r / i + t;
            return Jo(i) < gu ? on : (n.invert = function(t, e) {
                var n = o - e;
                return [Math.atan2(t, n) / i, o - J(i) * Math.sqrt(t * t + n * n)]
            }, n)
        }

        function wn(t, e) {
            return [t, Math.log(Math.tan(yu / 4 + e / 2))]
        }

        function Mn(t) {
            var e, n = en(t),
                r = n.scale,
                i = n.translate,
                o = n.clipExtent;
            return n.scale = function() {
                var t = r.apply(n, arguments);
                return t === n ? e ? n.clipExtent(null) : n : t
            }, n.translate = function() {
                var t = i.apply(n, arguments);
                return t === n ? e ? n.clipExtent(null) : n : t
            }, n.clipExtent = function(t) {
                var u = o.apply(n, arguments);
                if (u === n) {
                    if (e = null == t) {
                        var a = yu * r(),
                            s = i();
                        o([
                            [s[0] - a, s[1] - a],
                            [s[0] + a, s[1] + a]
                        ])
                    }
                } else e && (u = null);
                return u
            }, n.clipExtent(null)
        }

        function kn(t, e) {
            return [Math.log(Math.tan(yu / 4 + e / 2)), -t]
        }

        function En(t) {
            return t[0]
        }

        function Cn(t) {
            return t[1]
        }

        function Tn(t) {
            for (var e = t.length, n = [0, 1], r = 2, i = 2; i < e; i++) {
                for (; r > 1 && Q(t[n[r - 2]], t[n[r - 1]], t[i]) <= 0;) --r;
                n[r++] = i
            }
            return n.slice(0, r)
        }

        function Sn(t, e) {
            return t[0] - e[0] || t[1] - e[1]
        }

        function Nn(t, e, n) {
            return (n[0] - e[0]) * (t[1] - e[1]) < (n[1] - e[1]) * (t[0] - e[0])
        }

        function _n(t, e, n, r) {
            var i = t[0],
                o = n[0],
                u = e[0] - i,
                a = r[0] - o,
                s = t[1],
                c = n[1],
                l = e[1] - s,
                f = r[1] - c,
                h = (a * (s - c) - f * (i - o)) / (f * u - a * l);
            return [i + h * u, s + h * l]
        }

        function An(t) {
            var e = t[0],
                n = t[t.length - 1];
            return !(e[0] - n[0] || e[1] - n[1])
        }

        function Ln() {
            Jn(this), this.edge = this.site = this.circle = null
        }

        function Dn(t) {
            var e = Fa.pop() || new Ln;
            return e.site = t, e
        }

        function qn(t) {
            Wn(t), Oa.remove(t), Fa.push(t), Jn(t)
        }

        function jn(t) {
            var e = t.circle,
                n = e.x,
                r = e.cy,
                i = {
                    x: n,
                    y: r
                },
                o = t.P,
                u = t.N,
                a = [t];
            qn(t);
            for (var s = o; s.circle && Jo(n - s.circle.x) < gu && Jo(r - s.circle.cy) < gu;) o = s.P, a.unshift(s), qn(s), s = o;
            a.unshift(s), Wn(s);
            for (var c = u; c.circle && Jo(n - c.circle.x) < gu && Jo(r - c.circle.cy) < gu;) u = c.N, a.push(c), qn(c), c = u;
            a.push(c), Wn(c);
            var l, f = a.length;
            for (l = 1; l < f; ++l) c = a[l], s = a[l - 1], Zn(c.edge, s.site, c.site, i);
            s = a[0], (c = a[f - 1]).edge = Yn(s.site, c.site, null, i), Un(s), Un(c)
        }

        function Pn(t) {
            for (var e, n, r, i, o = t.x, u = t.y, a = Oa._; a;)
                if ((r = On(a, u) - o) > gu) a = a.L;
                else {
                    if (!((i = o - Rn(a, u)) > gu)) {
                        r > -gu ? (e = a.P, n = a) : i > -gu ? (e = a, n = a.N) : e = n = a;
                        break
                    }
                    if (!a.R) {
                        e = a;
                        break
                    }
                    a = a.R
                }
            var s = Dn(t);
            if (Oa.insert(e, s), e || n) {
                if (e === n) return Wn(e), n = Dn(e.site), Oa.insert(s, n), s.edge = n.edge = Yn(e.site, s.site), Un(e), void Un(n);
                if (n) {
                    Wn(e), Wn(n);
                    var c = e.site,
                        l = c.x,
                        f = c.y,
                        h = t.x - l,
                        p = t.y - f,
                        d = n.site,
                        g = d.x - l,
                        v = d.y - f,
                        y = 2 * (h * v - p * g),
                        m = h * h + p * p,
                        x = g * g + v * v,
                        b = {
                            x: (v * m - p * x) / y + l,
                            y: (h * x - g * m) / y + f
                        };
                    Zn(n.edge, c, d, b), s.edge = Yn(c, t, null, b), n.edge = Yn(t, d, null, b), Un(e), Un(n)
                } else s.edge = Yn(e.site, s.site)
            }
        }

        function On(t, e) {
            var n = t.site,
                r = n.x,
                i = n.y,
                o = i - e;
            if (!o) return r;
            var u = t.P;
            if (!u) return -1 / 0;
            var a = (n = u.site).x,
                s = n.y,
                c = s - e;
            if (!c) return a;
            var l = a - r,
                f = 1 / o - 1 / c,
                h = l / c;
            return f ? (-h + Math.sqrt(h * h - 2 * f * (l * l / (-2 * c) - s + c / 2 + i - o / 2))) / f + r : (r + a) / 2
        }

        function Rn(t, e) {
            var n = t.N;
            if (n) return On(n, e);
            var r = t.site;
            return r.y === e ? r.x : 1 / 0
        }

        function Hn(t) {
            this.site = t, this.edges = []
        }

        function Fn(t) {
            for (var e, n, r, i, o, u, a, s, c, l, f = t[0][0], h = t[1][0], p = t[0][1], d = t[1][1], g = Pa, v = g.length; v--;)
                if ((o = g[v]) && o.prepare())
                    for (s = (a = o.edges).length, u = 0; u < s;) r = (l = a[u].end()).x, i = l.y, e = (c = a[++u % s].start()).x, n = c.y, (Jo(r - e) > gu || Jo(i - n) > gu) && (a.splice(u, 0, new Gn(Xn(o.site, l, Jo(r - f) < gu && d - i > gu ? {
                        x: f,
                        y: Jo(e - f) < gu ? n : d
                    } : Jo(i - d) < gu && h - r > gu ? {
                        x: Jo(n - d) < gu ? e : h,
                        y: d
                    } : Jo(r - h) < gu && i - p > gu ? {
                        x: h,
                        y: Jo(e - h) < gu ? n : p
                    } : Jo(i - p) < gu && r - f > gu ? {
                        x: Jo(n - p) < gu ? e : f,
                        y: p
                    } : null), o.site, null)), ++s)
        }

        function zn(t, e) {
            return e.angle - t.angle
        }

        function In() {
            Jn(this), this.x = this.y = this.arc = this.site = this.cy = null
        }

        function Un(t) {
            var e = t.P,
                n = t.N;
            if (e && n) {
                var r = e.site,
                    i = t.site,
                    o = n.site;
                if (r !== o) {
                    var u = i.x,
                        a = i.y,
                        s = r.x - u,
                        c = r.y - a,
                        l = o.x - u,
                        f = 2 * (s * (v = o.y - a) - c * l);
                    if (!(f >= -vu)) {
                        var h = s * s + c * c,
                            p = l * l + v * v,
                            d = (v * h - c * p) / f,
                            g = (s * p - l * h) / f,
                            v = g + a,
                            y = za.pop() || new In;
                        y.arc = t, y.site = i, y.x = d + u, y.y = v + Math.sqrt(d * d + g * g), y.cy = v, t.circle = y;
                        for (var m = null, x = Ha._; x;)
                            if (y.y < x.y || y.y === x.y && y.x <= x.x) {
                                if (!x.L) {
                                    m = x.P;
                                    break
                                }
                                x = x.L
                            } else {
                                if (!x.R) {
                                    m = x;
                                    break
                                }
                                x = x.R
                            }
                        Ha.insert(m, y), m || (Ra = y)
                    }
                }
            }
        }

        function Wn(t) {
            var e = t.circle;
            e && (e.P || (Ra = e.N), Ha.remove(e), za.push(e), Jn(e),
                t.circle = null)
        }

        function Bn(t) {
            for (var e, n = ja, r = Fe(t[0][0], t[0][1], t[1][0], t[1][1]), i = n.length; i--;)(!$n(e = n[i], t) || !r(e) || Jo(e.a.x - e.b.x) < gu && Jo(e.a.y - e.b.y) < gu) && (e.a = e.b = null, n.splice(i, 1))
        }

        function $n(t, e) {
            var n = t.b;
            if (n) return !0;
            var r, i, o = t.a,
                u = e[0][0],
                a = e[1][0],
                s = e[0][1],
                c = e[1][1],
                l = t.l,
                f = t.r,
                h = l.x,
                p = l.y,
                d = f.x,
                g = f.y,
                v = (h + d) / 2,
                y = (p + g) / 2;
            if (g === p) {
                if (v < u || v >= a) return;
                if (h > d) {
                    if (o) {
                        if (o.y >= c) return
                    } else o = {
                        x: v,
                        y: s
                    };
                    n = {
                        x: v,
                        y: c
                    }
                } else {
                    if (o) {
                        if (o.y < s) return
                    } else o = {
                        x: v,
                        y: c
                    };
                    n = {
                        x: v,
                        y: s
                    }
                }
            } else if (r = (h - d) / (g - p), i = y - r * v, r < -1 || r > 1)
                if (h > d) {
                    if (o) {
                        if (o.y >= c) return
                    } else o = {
                        x: (s - i) / r,
                        y: s
                    };
                    n = {
                        x: (c - i) / r,
                        y: c
                    }
                } else {
                    if (o) {
                        if (o.y < s) return
                    } else o = {
                        x: (c - i) / r,
                        y: c
                    };
                    n = {
                        x: (s - i) / r,
                        y: s
                    }
                }
            else if (p < g) {
                if (o) {
                    if (o.x >= a) return
                } else o = {
                    x: u,
                    y: r * u + i
                };
                n = {
                    x: a,
                    y: r * a + i
                }
            } else {
                if (o) {
                    if (o.x < u) return
                } else o = {
                    x: a,
                    y: r * a + i
                };
                n = {
                    x: u,
                    y: r * u + i
                }
            }
            return t.a = o, t.b = n, !0
        }

        function Vn(t, e) {
            this.l = t, this.r = e, this.a = this.b = null
        }

        function Yn(t, e, n, r) {
            var i = new Vn(t, e);
            return ja.push(i), n && Zn(i, t, e, n), r && Zn(i, e, t, r), Pa[t.i].edges.push(new Gn(i, t, e)), Pa[e.i].edges.push(new Gn(i, e, t)), i
        }

        function Xn(t, e, n) {
            var r = new Vn(t, null);
            return r.a = e, r.b = n, ja.push(r), r
        }

        function Zn(t, e, n, r) {
            t.a || t.b ? t.l === n ? t.b = r : t.a = r : (t.a = r, t.l = e, t.r = n)
        }

        function Gn(t, e, n) {
            var r = t.a,
                i = t.b;
            this.edge = t, this.site = e, this.angle = n ? Math.atan2(n.y - e.y, n.x - e.x) : t.l === e ? Math.atan2(i.x - r.x, r.y - i.y) : Math.atan2(r.x - i.x, i.y - r.y)
        }

        function Kn() {
            this._ = null
        }

        function Jn(t) {
            t.U = t.C = t.L = t.R = t.P = t.N = null
        }

        function Qn(t, e) {
            var n = e,
                r = e.R,
                i = n.U;
            i ? i.L === n ? i.L = r : i.R = r : t._ = r, r.U = i, n.U = r, n.R = r.L, n.R && (n.R.U = n), r.L = n
        }

        function tr(t, e) {
            var n = e,
                r = e.L,
                i = n.U;
            i ? i.L === n ? i.L = r : i.R = r : t._ = r, r.U = i, n.U = r, n.L = r.R, n.L && (n.L.U = n), r.R = n
        }

        function er(t) {
            for (; t.L;) t = t.L;
            return t
        }

        function nr(t, e) {
            var n, r, i, o = t.sort(rr).pop();
            for (ja = [], Pa = new Array(t.length), Oa = new Kn, Ha = new Kn;;)
                if (i = Ra, o && (!i || o.y < i.y || o.y === i.y && o.x < i.x)) o.x === n && o.y === r || (Pa[o.i] = new Hn(o), Pn(o), n = o.x, r = o.y), o = t.pop();
                else {
                    if (!i) break;
                    jn(i.arc)
                }
            e && (Bn(e), Fn(e));
            var u = {
                cells: Pa,
                edges: ja
            };
            return Oa = Ha = ja = Pa = null, u
        }

        function rr(t, e) {
            return e.y - t.y || e.x - t.x
        }

        function ir(t, e, n) {
            return (t.x - n.x) * (e.y - t.y) - (t.x - e.x) * (n.y - t.y)
        }

        function or(t) {
            return t.x
        }

        function ur(t) {
            return t.y
        }

        function ar(t, e, n, r, i, o) {
            if (!t(e, n, r, i, o)) {
                var u = .5 * (n + i),
                    a = .5 * (r + o),
                    s = e.nodes;
                s[0] && ar(t, s[0], n, r, u, a), s[1] && ar(t, s[1], u, r, i, a), s[2] && ar(t, s[2], n, a, u, o), s[3] && ar(t, s[3], u, a, i, o)
            }
        }

        function sr(t, e, n, r, i, o, u) {
            var a, s = 1 / 0;
            return function t(c, l, f, h, p) {
                if (!(l > o || f > u || h < r || p < i)) {
                    if (d = c.point) {
                        var d, g = e - c.x,
                            v = n - c.y,
                            y = g * g + v * v;
                        if (y < s) {
                            var m = Math.sqrt(s = y);
                            r = e - m, i = n - m, o = e + m, u = n + m, a = d
                        }
                    }
                    for (var x = c.nodes, b = .5 * (l + h), w = .5 * (f + p), M = (n >= w) << 1 | e >= b, k = M + 4; M < k; ++M)
                        if (c = x[3 & M]) switch (3 & M) {
                            case 0:
                                t(c, l, f, b, w);
                                break;
                            case 1:
                                t(c, b, f, h, w);
                                break;
                            case 2:
                                t(c, l, w, b, p);
                                break;
                            case 3:
                                t(c, b, w, h, p)
                        }
                }
            }(t, r, i, o, u), a
        }

        function cr(t, e) {
            t = Uo.rgb(t), e = Uo.rgb(e);
            var n = t.r,
                r = t.g,
                i = t.b,
                o = e.r - n,
                u = e.g - r,
                a = e.b - i;
            return function(t) {
                return "#" + bt(Math.round(n + o * t)) + bt(Math.round(r + u * t)) + bt(Math.round(i + a * t))
            }
        }

        function lr(t, e) {
            var n, r = {},
                i = {};
            for (n in t) n in e ? r[n] = pr(t[n], e[n]) : i[n] = t[n];
            for (n in e) n in t || (i[n] = e[n]);
            return function(t) {
                for (n in r) i[n] = r[n](t);
                return i
            }
        }

        function fr(t, e) {
            return t = +t, e = +e,
                function(n) {
                    return t * (1 - n) + e * n
                }
        }

        function hr(t, e) {
            var n, r, i, o = Ua.lastIndex = Wa.lastIndex = 0,
                u = -1,
                a = [],
                s = [];
            for (t += "", e += "";
                 (n = Ua.exec(t)) && (r = Wa.exec(e));)(i = r.index) > o && (i = e.slice(o, i), a[u] ? a[u] += i : a[++u] = i), (n = n[0]) === (r = r[0]) ? a[u] ? a[u] += r : a[++u] = r : (a[++u] = null, s.push({
                i: u,
                x: fr(n, r)
            })), o = Wa.lastIndex;
            return o < e.length && (i = e.slice(o), a[u] ? a[u] += i : a[++u] = i), a.length < 2 ? s[0] ? (e = s[0].x, function(t) {
                return e(t) + ""
            }) : function() {
                return e
            } : (e = s.length, function(t) {
                for (var n, r = 0; r < e; ++r) a[(n = s[r]).i] = n.x(t);
                return a.join("")
            })
        }

        function pr(t, e) {
            for (var n, r = Uo.interpolators.length; --r >= 0 && !(n = Uo.interpolators[r](t, e)););
            return n
        }

        function dr(t, e) {
            var n, r = [],
                i = [],
                o = t.length,
                u = e.length,
                a = Math.min(t.length, e.length);
            for (n = 0; n < a; ++n) r.push(pr(t[n], e[n]));
            for (; n < o; ++n) i[n] = t[n];
            for (; n < u; ++n) i[n] = e[n];
            return function(t) {
                for (n = 0; n < a; ++n) i[n] = r[n](t);
                return i
            }
        }

        function gr(t) {
            return function(e) {
                return e <= 0 ? 0 : e >= 1 ? 1 : t(e)
            }
        }

        function vr(t) {
            return function(e) {
                return 1 - t(1 - e)
            }
        }

        function yr(t) {
            return function(e) {
                return .5 * (e < .5 ? t(2 * e) : 2 - t(2 - 2 * e))
            }
        }

        function mr(t) {
            return t * t
        }

        function xr(t) {
            return t * t * t
        }

        function br(t) {
            if (t <= 0) return 0;
            if (t >= 1) return 1;
            var e = t * t,
                n = e * t;
            return 4 * (t < .5 ? n : 3 * (t - e) + n - .75)
        }

        function wr(t) {
            return 1 - Math.cos(t * bu)
        }

        function Mr(t) {
            return Math.pow(2, 10 * (t - 1))
        }

        function kr(t) {
            return 1 - Math.sqrt(1 - t * t)
        }

        function Er(t) {
            return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
        }

        function Cr(t, e) {
            return e -= t,
                function(n) {
                    return Math.round(t + e * n)
                }
        }

        function Tr(t) {
            var e = [t.a, t.b],
                n = [t.c, t.d],
                r = Nr(e),
                i = Sr(e, n),
                o = Nr(_r(n, e, -i)) || 0;
            e[0] * n[1] < n[0] * e[1] && (e[0] *= -1, e[1] *= -1, r *= -1, i *= -1), this.rotate = (r ? Math.atan2(e[1], e[0]) : Math.atan2(-n[0], n[1])) * Mu, this.translate = [t.e, t.f], this.scale = [r, o], this.skew = o ? Math.atan2(i, o) * Mu : 0
        }

        function Sr(t, e) {
            return t[0] * e[0] + t[1] * e[1]
        }

        function Nr(t) {
            var e = Math.sqrt(Sr(t, t));
            return e && (t[0] /= e, t[1] /= e), e
        }

        function _r(t, e, n) {
            return t[0] += n * e[0], t[1] += n * e[1], t
        }

        function Ar(t) {
            return t.length ? t.pop() + "," : ""
        }

        function Lr(t, e, n, r) {
            if (t[0] !== e[0] || t[1] !== e[1]) {
                var i = n.push("translate(", null, ",", null, ")");
                r.push({
                    i: i - 4,
                    x: fr(t[0], e[0])
                }, {
                    i: i - 2,
                    x: fr(t[1], e[1])
                })
            } else(e[0] || e[1]) && n.push("translate(" + e + ")")
        }

        function Dr(t, e, n, r) {
            t !== e ? (t - e > 180 ? e += 360 : e - t > 180 && (t += 360), r.push({
                i: n.push(Ar(n) + "rotate(", null, ")") - 2,
                x: fr(t, e)
            })) : e && n.push(Ar(n) + "rotate(" + e + ")")
        }

        function qr(t, e, n, r) {
            t !== e ? r.push({
                i: n.push(Ar(n) + "skewX(", null, ")") - 2,
                x: fr(t, e)
            }) : e && n.push(Ar(n) + "skewX(" + e + ")")
        }

        function jr(t, e, n, r) {
            if (t[0] !== e[0] || t[1] !== e[1]) {
                var i = n.push(Ar(n) + "scale(", null, ",", null, ")");
                r.push({
                    i: i - 4,
                    x: fr(t[0], e[0])
                }, {
                    i: i - 2,
                    x: fr(t[1], e[1])
                })
            } else 1 === e[0] && 1 === e[1] || n.push(Ar(n) + "scale(" + e + ")")
        }

        function Pr(t, e) {
            var n = [],
                r = [];
            return t = Uo.transform(t), e = Uo.transform(e), Lr(t.translate, e.translate, n, r), Dr(t.rotate, e.rotate, n, r), qr(t.skew, e.skew, n, r), jr(t.scale, e.scale, n, r), t = e = null,
                function(t) {
                    for (var e, i = -1, o = r.length; ++i < o;) n[(e = r[i]).i] = e.x(t);
                    return n.join("")
                }
        }

        function Or(t, e) {
            return e = (e -= t = +t) || 1 / e,
                function(n) {
                    return (n - t) / e
                }
        }

        function Rr(t, e) {
            return e = (e -= t = +t) || 1 / e,
                function(n) {
                    return Math.max(0, Math.min(1, (n - t) / e))
                }
        }

        function Hr(t) {
            for (var e = t.source, n = t.target, r = zr(e, n), i = [e]; e !== r;) e = e.parent, i.push(e);
            for (var o = i.length; n !== r;) i.splice(o, 0, n), n = n.parent;
            return i
        }

        function Fr(t) {
            for (var e = [], n = t.parent; null != n;) e.push(t), t = n, n = n.parent;
            return e.push(t), e
        }

        function zr(t, e) {
            if (t === e) return t;
            for (var n = Fr(t), r = Fr(e), i = n.pop(), o = r.pop(), u = null; i === o;) u = i, i = n.pop(), o = r.pop();
            return u
        }

        function Ir(t) {
            t.fixed |= 2
        }

        function Ur(t) {
            t.fixed &= -7
        }

        function Wr(t) {
            t.fixed |= 4, t.px = t.x, t.py = t.y
        }

        function Br(t) {
            t.fixed &= -5
        }

        function $r(t, e, n) {
            var r = 0,
                i = 0;
            if (t.charge = 0, !t.leaf)
                for (var o, u = t.nodes, a = u.length, s = -1; ++s < a;) null != (o = u[s]) && ($r(o, e, n), t.charge += o.charge, r += o.charge * o.cx, i += o.charge * o.cy);
            if (t.point) {
                t.leaf || (t.point.x += Math.random() - .5, t.point.y += Math.random() - .5);
                var c = e * n[t.point.index];
                t.charge += t.pointCharge = c, r += c * t.point.x, i += c * t.point.y
            }
            t.cx = r / t.charge, t.cy = i / t.charge
        }

        function Vr(t, e) {
            return Uo.rebind(t, e, "sort", "children", "value"), t.nodes = t, t.links = Jr, t
        }

        function Yr(t, e) {
            for (var n = [t]; null != (t = n.pop());)
                if (e(t), (i = t.children) && (r = i.length))
                    for (var r, i; --r >= 0;) n.push(i[r])
        }

        function Xr(t, e) {
            for (var n = [t], r = []; null != (t = n.pop());)
                if (r.push(t), (o = t.children) && (i = o.length))
                    for (var i, o, u = -1; ++u < i;) n.push(o[u]);
            for (; null != (t = r.pop());) e(t)
        }

        function Zr(t) {
            return t.children
        }

        function Gr(t) {
            return t.value
        }

        function Kr(t, e) {
            return e.value - t.value
        }

        function Jr(t) {
            return Uo.merge(t.map(function(t) {
                return (t.children || []).map(function(e) {
                    return {
                        source: t,
                        target: e
                    }
                })
            }))
        }

        function Qr(t) {
            return t.x
        }

        function ti(t) {
            return t.y
        }

        function ei(t, e, n) {
            t.y0 = e, t.y = n
        }

        function ni(t) {
            return Uo.range(t.length)
        }

        function ri(t) {
            for (var e = -1, n = t[0].length, r = []; ++e < n;) r[e] = 0;
            return r
        }

        function ii(t) {
            for (var e, n = 1, r = 0, i = t[0][1], o = t.length; n < o; ++n)(e = t[n][1]) > i && (r = n, i = e);
            return r
        }

        function oi(t) {
            return t.reduce(ui, 0)
        }

        function ui(t, e) {
            return t + e[1]
        }

        function ai(t, e) {
            return si(t, Math.ceil(Math.log(e.length) / Math.LN2 + 1))
        }

        function si(t, e) {
            for (var n = -1, r = +t[0], i = (t[1] - r) / e, o = []; ++n <= e;) o[n] = i * n + r;
            return o
        }

        function ci(t) {
            return [Uo.min(t), Uo.max(t)]
        }

        function li(t, e) {
            return t.value - e.value
        }

        function fi(t, e) {
            var n = t._pack_next;
            t._pack_next = e, e._pack_prev = t, e._pack_next = n, n._pack_prev = e
        }

        function hi(t, e) {
            t._pack_next = e, e._pack_prev = t
        }

        function pi(t, e) {
            var n = e.x - t.x,
                r = e.y - t.y,
                i = t.r + e.r;
            return .999 * i * i > n * n + r * r
        }

        function di(t) {
            function e(t) {
                l = Math.min(t.x - t.r, l), f = Math.max(t.x + t.r, f), h = Math.min(t.y - t.r, h), p = Math.max(t.y + t.r, p)
            }
            if ((n = t.children) && (c = n.length)) {
                var n, r, i, o, u, a, s, c, l = 1 / 0,
                    f = -1 / 0,
                    h = 1 / 0,
                    p = -1 / 0;
                if (n.forEach(gi), r = n[0], r.x = -r.r, r.y = 0, e(r), c > 1 && (i = n[1], i.x = i.r, i.y = 0, e(i), c > 2))
                    for (mi(r, i, o = n[2]), e(o), fi(r, o), r._pack_prev = o, fi(o, i), i = r._pack_next, u = 3; u < c; u++) {
                        mi(r, i, o = n[u]);
                        var d = 0,
                            g = 1,
                            v = 1;
                        for (a = i._pack_next; a !== i; a = a._pack_next, g++)
                            if (pi(a, o)) {
                                d = 1;
                                break
                            }
                        if (1 == d)
                            for (s = r._pack_prev; s !== a._pack_prev && !pi(s, o); s = s._pack_prev, v++);
                        d ? (g < v || g == v && i.r < r.r ? hi(r, i = a) : hi(r = s, i), u--) : (fi(r, o), i = o, e(o))
                    }
                var y = (l + f) / 2,
                    m = (h + p) / 2,
                    x = 0;
                for (u = 0; u < c; u++)(o = n[u]).x -= y, o.y -= m, x = Math.max(x, o.r + Math.sqrt(o.x * o.x + o.y * o.y));
                t.r = x, n.forEach(vi)
            }
        }

        function gi(t) {
            t._pack_next = t._pack_prev = t
        }

        function vi(t) {
            delete t._pack_next, delete t._pack_prev
        }

        function yi(t, e, n, r) {
            var i = t.children;
            if (t.x = e += r * t.x, t.y = n += r * t.y, t.r *= r, i)
                for (var o = -1, u = i.length; ++o < u;) yi(i[o], e, n, r)
        }

        function mi(t, e, n) {
            var r = t.r + n.r,
                i = e.x - t.x,
                o = e.y - t.y;
            if (r && (i || o)) {
                var u = e.r + n.r,
                    a = i * i + o * o,
                    s = .5 + ((r *= r) - (u *= u)) / (2 * a),
                    c = Math.sqrt(Math.max(0, 2 * u * (r + a) - (r -= a) * r - u * u)) / (2 * a);
                n.x = t.x + s * i + c * o, n.y = t.y + s * o - c * i
            } else n.x = t.x + r, n.y = t.y
        }

        function xi(t, e) {
            return t.parent == e.parent ? 1 : 2
        }

        function bi(t) {
            var e = t.children;
            return e.length ? e[0] : t.t
        }

        function wi(t) {
            var e, n = t.children;
            return (e = n.length) ? n[e - 1] : t.t
        }

        function Mi(t, e, n) {
            var r = n / (e.i - t.i);
            e.c -= r, e.s += n, t.c += r, e.z += n, e.m += n
        }

        function ki(t) {
            for (var e, n = 0, r = 0, i = t.children, o = i.length; --o >= 0;)(e = i[o]).z += n, e.m += n, n += e.s + (r += e.c)
        }

        function Ei(t, e, n) {
            return t.a.parent === e.parent ? t.a : n
        }

        function Ci(t) {
            return 1 + Uo.max(t, function(t) {
                return t.y
            })
        }

        function Ti(t) {
            return t.reduce(function(t, e) {
                return t + e.x
            }, 0) / t.length
        }

        function Si(t) {
            var e = t.children;
            return e && e.length ? Si(e[0]) : t
        }

        function Ni(t) {
            var e, n = t.children;
            return n && (e = n.length) ? Ni(n[e - 1]) : t
        }

        function _i(t) {
            return {
                x: t.x,
                y: t.y,
                dx: t.dx,
                dy: t.dy
            }
        }

        function Ai(t, e) {
            var n = t.x + e[3],
                r = t.y + e[0],
                i = t.dx - e[1] - e[3],
                o = t.dy - e[0] - e[2];
            return i < 0 && (n += i / 2, i = 0), o < 0 && (r += o / 2, o = 0), {
                x: n,
                y: r,
                dx: i,
                dy: o
            }
        }

        function Li(t) {
            var e = t[0],
                n = t[t.length - 1];
            return e < n ? [e, n] : [n, e]
        }

        function Di(t) {
            return t.rangeExtent ? t.rangeExtent() : Li(t.range())
        }

        function qi(t, e, n, r) {
            var i = n(t[0], t[1]),
                o = r(e[0], e[1]);
            return function(t) {
                return o(i(t))
            }
        }

        function ji(t, e) {
            var n, r = 0,
                i = t.length - 1,
                o = t[r],
                u = t[i];
            return u < o && (n = r, r = i, i = n, n = o, o = u, u = n), t[r] = e.floor(o), t[i] = e.ceil(u), t
        }

        function Pi(t) {
            return t ? {
                floor: function(e) {
                    return Math.floor(e / t) * t
                },
                ceil: function(e) {
                    return Math.ceil(e / t) * t
                }
            } : ts
        }

        function Oi(t, e, n, r) {
            var i = [],
                o = [],
                u = 0,
                a = Math.min(t.length, e.length) - 1;
            for (t[a] < t[0] && (t = t.slice().reverse(), e = e.slice().reverse()); ++u <= a;) i.push(n(t[u - 1], t[u])), o.push(r(e[u - 1], e[u]));
            return function(e) {
                var n = Uo.bisect(t, e, 1, a) - 1;
                return o[n](i[n](e))
            }
        }

        function Ri(t, e, n, r) {
            function i() {
                var i = Math.min(t.length, e.length) > 2 ? Oi : qi,
                    s = r ? Rr : Or;
                return u = i(t, e, s, n), a = i(e, t, s, pr), o
            }

            function o(t) {
                return u(t)
            }
            var u, a;
            return o.invert = function(t) {
                return a(t)
            }, o.domain = function(e) {
                return arguments.length ? (t = e.map(Number), i()) : t
            }, o.range = function(t) {
                return arguments.length ? (e = t, i()) : e
            }, o.rangeRound = function(t) {
                return o.range(t).interpolate(Cr)
            }, o.clamp = function(t) {
                return arguments.length ? (r = t, i()) : r
            }, o.interpolate = function(t) {
                return arguments.length ? (n = t, i()) : n
            }, o.ticks = function(e) {
                return Ii(t, e)
            }, o.tickFormat = function(e, n) {
                return Ui(t, e, n)
            }, o.nice = function(e) {
                return Fi(t, e), i()
            }, o.copy = function() {
                return Ri(t, e, n, r)
            }, i()
        }

        function Hi(t, e) {
            return Uo.rebind(t, e, "range", "rangeRound", "interpolate", "clamp")
        }

        function Fi(t, e) {
            return ji(t, Pi(zi(t, e)[2])), ji(t, Pi(zi(t, e)[2])), t
        }

        function zi(t, e) {
            null == e && (e = 10);
            var n = Li(t),
                r = n[1] - n[0],
                i = Math.pow(10, Math.floor(Math.log(r / e) / Math.LN10)),
                o = e / r * i;
            return o <= .15 ? i *= 10 : o <= .35 ? i *= 5 : o <= .75 && (i *= 2), n[0] = Math.ceil(n[0] / i) * i, n[1] = Math.floor(n[1] / i) * i + .5 * i, n[2] = i, n
        }

        function Ii(t, e) {
            return Uo.range.apply(Uo, zi(t, e))
        }

        function Ui(t, e, n) {
            var r = zi(t, e);
            if (n) {
                var i = Uu.exec(n);
                if (i.shift(), "s" === i[8]) {
                    var o = Uo.formatPrefix(Math.max(Jo(r[0]), Jo(r[1])));
                    return i[7] || (i[7] = "." + Wi(o.scale(r[2]))), i[8] = "f", n = Uo.format(i.join("")),
                        function(t) {
                            return n(o.scale(t)) + o.symbol
                        }
                }
                i[7] || (i[7] = "." + Bi(i[8], r)), n = i.join("")
            } else n = ",." + Wi(r[2]) + "f";
            return Uo.format(n)
        }

        function Wi(t) {
            return -Math.floor(Math.log(t) / Math.LN10 + .01)
        }

        function Bi(t, e) {
            var n = Wi(e[2]);
            return t in es ? Math.abs(n - Wi(Math.max(Jo(e[0]), Jo(e[1])))) + +("e" !== t) : n - 2 * ("%" === t)
        }

        function $i(t, e, n, r) {
            function i(t) {
                return (n ? Math.log(t < 0 ? 0 : t) : -Math.log(t > 0 ? 0 : -t)) / Math.log(e)
            }

            function o(t) {
                return n ? Math.pow(e, t) : -Math.pow(e, -t)
            }

            function u(e) {
                return t(i(e))
            }
            return u.invert = function(e) {
                return o(t.invert(e))
            }, u.domain = function(e) {
                return arguments.length ? (n = e[0] >= 0, t.domain((r = e.map(Number)).map(i)), u) : r
            }, u.base = function(n) {
                return arguments.length ? (e = +n, t.domain(r.map(i)), u) : e
            }, u.nice = function() {
                var e = ji(r.map(i), n ? Math : rs);
                return t.domain(e), r = e.map(o), u
            }, u.ticks = function() {
                var t = Li(r),
                    u = [],
                    a = t[0],
                    s = t[1],
                    c = Math.floor(i(a)),
                    l = Math.ceil(i(s)),
                    f = e % 1 ? 2 : e;
                if (isFinite(l - c)) {
                    if (n) {
                        for (; c < l; c++)
                            for (h = 1; h < f; h++) u.push(o(c) * h);
                        u.push(o(c))
                    } else
                        for (u.push(o(c)); c++ < l;)
                            for (var h = f - 1; h > 0; h--) u.push(o(c) * h);
                    for (c = 0; u[c] < a; c++);
                    for (l = u.length; u[l - 1] > s; l--);
                    u = u.slice(c, l)
                }
                return u
            }, u.tickFormat = function(t, n) {
                if (!arguments.length) return ns;
                arguments.length < 2 ? n = ns : "function" != typeof n && (n = Uo.format(n));
                var r = Math.max(1, e * t / u.ticks().length);
                return function(t) {
                    var u = t / o(Math.round(i(t)));
                    return u * e < e - .5 && (u *= e), u <= r ? n(t) : ""
                }
            }, u.copy = function() {
                return $i(t.copy(), e, n, r)
            }, Hi(u, t)
        }

        function Vi(t, e, n) {
            function r(e) {
                return t(i(e))
            }
            var i = Yi(e),
                o = Yi(1 / e);
            return r.invert = function(e) {
                return o(t.invert(e))
            }, r.domain = function(e) {
                return arguments.length ? (t.domain((n = e.map(Number)).map(i)), r) : n
            }, r.ticks = function(t) {
                return Ii(n, t)
            }, r.tickFormat = function(t, e) {
                return Ui(n, t, e)
            }, r.nice = function(t) {
                return r.domain(Fi(n, t))
            }, r.exponent = function(u) {
                return arguments.length ? (i = Yi(e = u), o = Yi(1 / e), t.domain(n.map(i)), r) : e
            }, r.copy = function() {
                return Vi(t.copy(), e, n)
            }, Hi(r, t)
        }

        function Yi(t) {
            return function(e) {
                return e < 0 ? -Math.pow(-e, t) : Math.pow(e, t)
            }
        }

        function Xi(t, e) {
            function n(n) {
                return o[((i.get(n) || ("range" === e.t ? i.set(n, t.push(n)) : NaN)) - 1) % o.length]
            }

            function r(e, n) {
                return Uo.range(t.length).map(function(t) {
                    return e + n * t
                })
            }
            var i, o, u;
            return n.domain = function(r) {
                if (!arguments.length) return t;
                t = [], i = new c;
                for (var o, u = -1, a = r.length; ++u < a;) i.has(o = r[u]) || i.set(o, t.push(o));
                return n[e.t].apply(n, e.a)
            }, n.range = function(t) {
                return arguments.length ? (o = t, u = 0, e = {
                    t: "range",
                    a: arguments
                }, n) : o
            }, n.rangePoints = function(i, a) {
                arguments.length < 2 && (a = 0);
                var s = i[0],
                    c = i[1],
                    l = t.length < 2 ? (s = (s + c) / 2, 0) : (c - s) / (t.length - 1 + a);
                return o = r(s + l * a / 2, l), u = 0, e = {
                    t: "rangePoints",
                    a: arguments
                }, n
            }, n.rangeRoundPoints = function(i, a) {
                arguments.length < 2 && (a = 0);
                var s = i[0],
                    c = i[1],
                    l = t.length < 2 ? (s = c = Math.round((s + c) / 2), 0) : (c - s) / (t.length - 1 + a) | 0;
                return o = r(s + Math.round(l * a / 2 + (c - s - (t.length - 1 + a) * l) / 2), l), u = 0, e = {
                    t: "rangeRoundPoints",
                    a: arguments
                }, n
            }, n.rangeBands = function(i, a, s) {
                arguments.length < 2 && (a = 0), arguments.length < 3 && (s = a);
                var c = i[1] < i[0],
                    l = i[c - 0],
                    f = (i[1 - c] - l) / (t.length - a + 2 * s);
                return o = r(l + f * s, f), c && o.reverse(), u = f * (1 - a), e = {
                    t: "rangeBands",
                    a: arguments
                }, n
            }, n.rangeRoundBands = function(i, a, s) {
                arguments.length < 2 && (a = 0), arguments.length < 3 && (s = a);
                var c = i[1] < i[0],
                    l = i[c - 0],
                    f = i[1 - c],
                    h = Math.floor((f - l) / (t.length - a + 2 * s));
                return o = r(l + Math.round((f - l - (t.length - a) * h) / 2), h), c && o.reverse(), u = Math.round(h * (1 - a)), e = {
                    t: "rangeRoundBands",
                    a: arguments
                }, n
            }, n.rangeBand = function() {
                return u
            }, n.rangeExtent = function() {
                return Li(e.a[0])
            }, n.copy = function() {
                return Xi(t, e)
            }, n.domain(t)
        }

        function Zi(t, e) {
            function o() {
                var n = 0,
                    r = e.length;
                for (a = []; ++n < r;) a[n - 1] = Uo.quantile(t, n / r);
                return u
            }

            function u(t) {
                if (!isNaN(t = +t)) return e[Uo.bisect(a, t)]
            }
            var a;
            return u.domain = function(e) {
                return arguments.length ? (t = e.map(r).filter(i).sort(n), o()) : t
            }, u.range = function(t) {
                return arguments.length ? (e = t, o()) : e
            }, u.quantiles = function() {
                return a
            }, u.invertExtent = function(n) {
                return (n = e.indexOf(n)) < 0 ? [NaN, NaN] : [n > 0 ? a[n - 1] : t[0], n < a.length ? a[n] : t[t.length - 1]]
            }, u.copy = function() {
                return Zi(t, e)
            }, o()
        }

        function Gi(t, e, n) {
            function r(e) {
                return n[Math.max(0, Math.min(u, Math.floor(o * (e - t))))]
            }

            function i() {
                return o = n.length / (e - t), u = n.length - 1, r
            }
            var o, u;
            return r.domain = function(n) {
                return arguments.length ? (t = +n[0], e = +n[n.length - 1], i()) : [t, e]
            }, r.range = function(t) {
                return arguments.length ? (n = t, i()) : n
            }, r.invertExtent = function(e) {
                return e = n.indexOf(e), e = e < 0 ? NaN : e / o + t, [e, e + 1 / o]
            }, r.copy = function() {
                return Gi(t, e, n)
            }, i()
        }

        function Ki(t, e) {
            function n(n) {
                if (n <= n) return e[Uo.bisect(t, n)]
            }
            return n.domain = function(e) {
                return arguments.length ? (t = e, n) : t
            }, n.range = function(t) {
                return arguments.length ? (e = t, n) : e
            }, n.invertExtent = function(n) {
                return n = e.indexOf(n), [t[n - 1], t[n]]
            }, n.copy = function() {
                return Ki(t, e)
            }, n
        }

        function Ji(t) {
            function e(t) {
                return +t
            }
            return e.invert = e, e.domain = e.range = function(n) {
                return arguments.length ? (t = n.map(e), e) : t
            }, e.ticks = function(e) {
                return Ii(t, e)
            }, e.tickFormat = function(e, n) {
                return Ui(t, e, n)
            }, e.copy = function() {
                return Ji(t)
            }, e
        }

        function Qi() {
            return 0
        }

        function to(t) {
            return t.innerRadius
        }

        function eo(t) {
            return t.outerRadius
        }

        function no(t) {
            return t.startAngle
        }

        function ro(t) {
            return t.endAngle
        }

        function io(t) {
            return t && t.padAngle
        }

        function oo(t, e, n, r) {
            return (t - n) * e - (e - r) * t > 0 ? 0 : 1
        }

        function uo(t, e, n, r, i) {
            var o = t[0] - e[0],
                u = t[1] - e[1],
                a = (i ? r : -r) / Math.sqrt(o * o + u * u),
                s = a * u,
                c = -a * o,
                l = t[0] + s,
                f = t[1] + c,
                h = e[0] + s,
                p = e[1] + c,
                d = (l + h) / 2,
                g = (f + p) / 2,
                v = h - l,
                y = p - f,
                m = v * v + y * y,
                x = n - r,
                b = l * p - h * f,
                w = (y < 0 ? -1 : 1) * Math.sqrt(Math.max(0, x * x * m - b * b)),
                M = (b * y - v * w) / m,
                k = (-b * v - y * w) / m,
                E = (b * y + v * w) / m,
                C = (-b * v + y * w) / m,
                T = M - d,
                S = k - g,
                N = E - d,
                _ = C - g;
            return T * T + S * S > N * N + _ * _ && (M = E, k = C), [
                [M - s, k - c],
                [M * n / x, k * n / x]
            ]
        }

        function ao(t) {
            function e(e) {
                function u() {
                    c.push("M", o(t(l), a))
                }
                for (var s, c = [], l = [], f = -1, h = e.length, p = Tt(n), d = Tt(r); ++f < h;) i.call(this, s = e[f], f) ? l.push([+p.call(this, s, f), +d.call(this, s, f)]) : l.length && (u(), l = []);
                return l.length && u(), c.length ? c.join("") : null
            }
            var n = En,
                r = Cn,
                i = Ne,
                o = so,
                u = o.key,
                a = .7;
            return e.x = function(t) {
                return arguments.length ? (n = t, e) : n
            }, e.y = function(t) {
                return arguments.length ? (r = t, e) : r
            }, e.defined = function(t) {
                return arguments.length ? (i = t, e) : i
            }, e.interpolate = function(t) {
                return arguments.length ? (u = "function" == typeof t ? o = t : (o = cs.get(t) || so).key, e) : u
            }, e.tension = function(t) {
                return arguments.length ? (a = t, e) : a
            }, e
        }

        function so(t) {
            return t.length > 1 ? t.join("L") : t + "Z"
        }

        function co(t) {
            return t.join("L") + "Z"
        }

        function lo(t) {
            for (var e = 0, n = t.length, r = t[0], i = [r[0], ",", r[1]]; ++e < n;) i.push("V", (r = t[e])[1], "H", r[0]);
            return i.join("")
        }

        function fo(t) {
            for (var e = 0, n = t.length, r = t[0], i = [r[0], ",", r[1]]; ++e < n;) i.push("H", (r = t[e])[0], "V", r[1]);
            return i.join("")
        }

        function ho(t, e) {
            if (e.length < 1 || t.length != e.length && t.length != e.length + 2) return so(t);
            var n = t.length != e.length,
                r = "",
                i = t[0],
                o = t[1],
                u = e[0],
                a = u,
                s = 1;
            if (n && (r += "Q" + (o[0] - 2 * u[0] / 3) + "," + (o[1] - 2 * u[1] / 3) + "," + o[0] + "," + o[1], i = t[1], s = 2), e.length > 1) {
                a = e[1], o = t[s], s++, r += "C" + (i[0] + u[0]) + "," + (i[1] + u[1]) + "," + (o[0] - a[0]) + "," + (o[1] - a[1]) + "," + o[0] + "," + o[1];
                for (var c = 2; c < e.length; c++, s++) o = t[s], a = e[c], r += "S" + (o[0] - a[0]) + "," + (o[1] - a[1]) + "," + o[0] + "," + o[1]
            }
            if (n) {
                var l = t[s];
                r += "Q" + (o[0] + 2 * a[0] / 3) + "," + (o[1] + 2 * a[1] / 3) + "," + l[0] + "," + l[1]
            }
            return r
        }

        function po(t, e) {
            for (var n, r = [], i = (1 - e) / 2, o = t[0], u = t[1], a = 1, s = t.length; ++a < s;) n = o, o = u, u = t[a], r.push([i * (u[0] - n[0]), i * (u[1] - n[1])]);
            return r
        }

        function go(t) {
            if (t.length < 3) return so(t);
            var e = 1,
                n = t.length,
                r = t[0],
                i = r[0],
                o = r[1],
                u = [i, i, i, (r = t[1])[0]],
                a = [o, o, o, r[1]],
                s = [i, ",", o, "L", vo(hs, u), ",", vo(hs, a)];
            for (t.push(t[n - 1]); ++e <= n;) r = t[e], u.shift(), u.push(r[0]), a.shift(), a.push(r[1]), yo(s, u, a);
            return t.pop(), s.push("L", r), s.join("")
        }

        function vo(t, e) {
            return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3] * e[3]
        }

        function yo(t, e, n) {
            t.push("C", vo(ls, e), ",", vo(ls, n), ",", vo(fs, e), ",", vo(fs, n), ",", vo(hs, e), ",", vo(hs, n))
        }

        function mo(t, e) {
            return (e[1] - t[1]) / (e[0] - t[0])
        }

        function xo(t) {
            for (var e = 0, n = t.length - 1, r = [], i = t[0], o = t[1], u = r[0] = mo(i, o); ++e < n;) r[e] = (u + (u = mo(i = o, o = t[e + 1]))) / 2;
            return r[e] = u, r
        }

        function bo(t) {
            for (var e, n, r, i, o = [], u = xo(t), a = -1, s = t.length - 1; ++a < s;) e = mo(t[a], t[a + 1]), Jo(e) < gu ? u[a] = u[a + 1] = 0 : (i = (n = u[a] / e) * n + (r = u[a + 1] / e) * r) > 9 && (i = 3 * e / Math.sqrt(i), u[a] = i * n, u[a + 1] = i * r);
            for (a = -1; ++a <= s;) i = (t[Math.min(s, a + 1)][0] - t[Math.max(0, a - 1)][0]) / (6 * (1 + u[a] * u[a])), o.push([i || 0, u[a] * i || 0]);
            return o
        }

        function wo(t) {
            for (var e, n, r, i = -1, o = t.length; ++i < o;) n = (e = t[i])[0], r = e[1] - bu, e[0] = n * Math.cos(r), e[1] = n * Math.sin(r);
            return t
        }

        function Mo(t) {
            function e(e) {
                function s() {
                    g.push("M", a(t(y), f), l, c(t(v.reverse()), f), "Z")
                }
                for (var h, p, d, g = [], v = [], y = [], m = -1, x = e.length, b = Tt(n), w = Tt(i), M = n === r ? function() {
                    return p
                } : Tt(r), k = i === o ? function() {
                    return d
                } : Tt(o); ++m < x;) u.call(this, h = e[m], m) ? (v.push([p = +b.call(this, h, m), d = +w.call(this, h, m)]), y.push([+M.call(this, h, m), +k.call(this, h, m)])) : v.length && (s(), v = [], y = []);
                return v.length && s(), g.length ? g.join("") : null
            }
            var n = En,
                r = En,
                i = 0,
                o = Cn,
                u = Ne,
                a = so,
                s = a.key,
                c = a,
                l = "L",
                f = .7;
            return e.x = function(t) {
                return arguments.length ? (n = r = t, e) : r
            }, e.x0 = function(t) {
                return arguments.length ? (n = t, e) : n
            }, e.x1 = function(t) {
                return arguments.length ? (r = t, e) : r
            }, e.y = function(t) {
                return arguments.length ? (i = o = t, e) : o
            }, e.y0 = function(t) {
                return arguments.length ? (i = t, e) : i
            }, e.y1 = function(t) {
                return arguments.length ? (o = t, e) : o
            }, e.defined = function(t) {
                return arguments.length ? (u = t, e) : u
            }, e.interpolate = function(t) {
                return arguments.length ? (s = "function" == typeof t ? a = t : (a = cs.get(t) || so).key, c = a.reverse || a, l = a.closed ? "M" : "L", e) : s
            }, e.tension = function(t) {
                return arguments.length ? (f = t, e) : f
            }, e
        }

        function ko(t) {
            return t.radius
        }

        function Eo(t) {
            return [t.x, t.y]
        }

        function Co(t) {
            return function() {
                var e = t.apply(this, arguments),
                    n = e[0],
                    r = e[1] - bu;
                return [n * Math.cos(r), n * Math.sin(r)]
            }
        }

        function To() {
            return 64
        }

        function So() {
            return "circle"
        }

        function No(t) {
            var e = Math.sqrt(t / yu);
            return "M0," + e + "A" + e + "," + e + " 0 1,1 0," + -e + "A" + e + "," + e + " 0 1,1 0," + e + "Z"
        }

        function _o(t) {
            return function() {
                var e, n, r;
                (e = this[t]) && (r = e[n = e.active]) && (r.timer.c = null, r.timer.t = NaN, --e.count ? delete e[n] : delete this[t], e.active += .5, r.event && r.event.interrupt.call(this, this.__data__, r.index))
            }
        }

        function Ao(t, e, n) {
            return ru(t, xs), t.namespace = e, t.id = n, t
        }

        function Lo(t, e, n, r) {
            var i = t.id,
                o = t.namespace;
            return W(t, "function" == typeof n ? function(t, u, a) {
                t[o][i].tween.set(e, r(n.call(t, t.__data__, u, a)))
            } : (n = r(n), function(t) {
                t[o][i].tween.set(e, n)
            }))
        }

        function Do(t) {
            return null == t && (t = ""),
                function() {
                    this.textContent = t
                }
        }

        function qo(t) {
            return null == t ? "__transition__" : "__transition_" + t + "__"
        }

        function jo(t, e, n, r, i) {
            function o(n) {
                var i = p.active,
                    o = p[i];
                o && (o.timer.c = null, o.timer.t = NaN, --p.count, delete p[i], o.event && o.event.interrupt.call(t, t.__data__, o.index));
                for (var c in p)
                    if (+c < r) {
                        var g = p[c];
                        g.timer.c = null, g.timer.t = NaN, --p.count, delete p[c]
                    }
                s.c = u, Lt(function() {
                    return s.c && u(n || 1) && (s.c = null, s.t = NaN), 1
                }, 0, a), p.active = r, d.event && d.event.start.call(t, t.__data__, e), h = [], d.tween.forEach(function(n, r) {
                    (r = r.call(t, t.__data__, e)) && h.push(r)
                }), f = d.ease, l = d.duration
            }

            function u(i) {
                for (var o = i / l, u = f(o), a = h.length; a > 0;) h[--a].call(t, u);
                if (o >= 1) return d.event && d.event.end.call(t, t.__data__, e), --p.count ? delete p[r] : delete t[n], 1
            }
            var a, s, l, f, h, p = t[n] || (t[n] = {
                    active: 0,
                    count: 0
                }),
                d = p[r];
            d || (a = i.time, s = Lt(function(t) {
                var e = d.delay;
                if (s.t = e + a, e <= t) return o(t - e);
                s.c = o
            }, 0, a), d = p[r] = {
                tween: new c,
                time: a,
                timer: s,
                delay: i.delay,
                duration: i.duration,
                ease: i.ease,
                index: e
            }, i = null, ++p.count)
        }

        function Po(t, e, n) {
            t.attr("transform", function(t) {
                var r = e(t);
                return "translate(" + (isFinite(r) ? r : n(t)) + ",0)"
            })
        }

        function Oo(t, e, n) {
            t.attr("transform", function(t) {
                var r = e(t);
                return "translate(0," + (isFinite(r) ? r : n(t)) + ")"
            })
        }

        function Ro(t) {
            return t.toISOString()
        }

        function Ho(t, e, n) {
            function r(e) {
                return t(e)
            }

            function i(t, n) {
                var r = (t[1] - t[0]) / n,
                    i = Uo.bisect(Ns, r);
                return i == Ns.length ? [e.year, zi(t.map(function(t) {
                    return t / 31536e6
                }), n)[2]] : i ? e[r / Ns[i - 1] < Ns[i] / r ? i - 1 : i] : [Ls, zi(t, n)[2]]
            }
            return r.invert = function(e) {
                return Fo(t.invert(e))
            }, r.domain = function(e) {
                return arguments.length ? (t.domain(e), r) : t.domain().map(Fo)
            }, r.nice = function(t, e) {
                function n(n) {
                    return !isNaN(n) && !t.range(n, Fo(+n + 1), e).length
                }
                var o = r.domain(),
                    u = Li(o),
                    a = null == t ? i(u, 10) : "number" == typeof t && i(u, t);
                return a && (t = a[0], e = a[1]), r.domain(ji(o, e > 1 ? {
                    floor: function(e) {
                        for (; n(e = t.floor(e));) e = Fo(e - 1);
                        return e
                    },
                    ceil: function(e) {
                        for (; n(e = t.ceil(e));) e = Fo(+e + 1);
                        return e
                    }
                } : t))
            }, r.ticks = function(t, e) {
                var n = Li(r.domain()),
                    o = null == t ? i(n, 10) : "number" == typeof t ? i(n, t) : !t.range && [{
                        range: t
                    }, e];
                return o && (t = o[0], e = o[1]), t.range(n[0], Fo(+n[1] + 1), e < 1 ? 1 : e)
            }, r.tickFormat = function() {
                return n
            }, r.copy = function() {
                return Ho(t.copy(), e, n)
            }, Hi(r, t)
        }

        function Fo(t) {
            return new Date(t)
        }

        function zo(t) {
            return JSON.parse(t.responseText)
        }

        function Io(t) {
            var e = $o.createRange();
            return e.selectNode($o.body), e.createContextualFragment(t.responseText)
        }
        var Uo = {
                version: "3.5.17"
            },
            Wo = [].slice,
            Bo = function(t) {
                return Wo.call(t)
            },
            $o = this.document;
        if ($o) try {
            Bo($o.documentElement.childNodes)[0].nodeType
        } catch (t) {
            Bo = function(t) {
                for (var e = t.length, n = new Array(e); e--;) n[e] = t[e];
                return n
            }
        }
        if (Date.now || (Date.now = function() {
                return +new Date
            }), $o) try {
            $o.createElement("DIV").style.setProperty("opacity", 0, "")
        } catch (t) {
            var Vo = this.Element.prototype,
                Yo = Vo.setAttribute,
                Xo = Vo.setAttributeNS,
                Zo = this.CSSStyleDeclaration.prototype,
                Go = Zo.setProperty;
            Vo.setAttribute = function(t, e) {
                Yo.call(this, t, e + "")
            }, Vo.setAttributeNS = function(t, e, n) {
                Xo.call(this, t, e, n + "")
            }, Zo.setProperty = function(t, e, n) {
                Go.call(this, t, e + "", n)
            }
        }
        Uo.ascending = n, Uo.descending = function(t, e) {
            return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN
        }, Uo.min = function(t, e) {
            var n, r, i = -1,
                o = t.length;
            if (1 === arguments.length) {
                for (; ++i < o;)
                    if (null != (r = t[i]) && r >= r) {
                        n = r;
                        break
                    }
                for (; ++i < o;) null != (r = t[i]) && n > r && (n = r)
            } else {
                for (; ++i < o;)
                    if (null != (r = e.call(t, t[i], i)) && r >= r) {
                        n = r;
                        break
                    }
                for (; ++i < o;) null != (r = e.call(t, t[i], i)) && n > r && (n = r)
            }
            return n
        }, Uo.max = function(t, e) {
            var n, r, i = -1,
                o = t.length;
            if (1 === arguments.length) {
                for (; ++i < o;)
                    if (null != (r = t[i]) && r >= r) {
                        n = r;
                        break
                    }
                for (; ++i < o;) null != (r = t[i]) && r > n && (n = r)
            } else {
                for (; ++i < o;)
                    if (null != (r = e.call(t, t[i], i)) && r >= r) {
                        n = r;
                        break
                    }
                for (; ++i < o;) null != (r = e.call(t, t[i], i)) && r > n && (n = r)
            }
            return n
        }, Uo.extent = function(t, e) {
            var n, r, i, o = -1,
                u = t.length;
            if (1 === arguments.length) {
                for (; ++o < u;)
                    if (null != (r = t[o]) && r >= r) {
                        n = i = r;
                        break
                    }
                for (; ++o < u;) null != (r = t[o]) && (n > r && (n = r), i < r && (i = r))
            } else {
                for (; ++o < u;)
                    if (null != (r = e.call(t, t[o], o)) && r >= r) {
                        n = i = r;
                        break
                    }
                for (; ++o < u;) null != (r = e.call(t, t[o], o)) && (n > r && (n = r), i < r && (i = r))
            }
            return [n, i]
        }, Uo.sum = function(t, e) {
            var n, r = 0,
                o = t.length,
                u = -1;
            if (1 === arguments.length)
                for (; ++u < o;) i(n = +t[u]) && (r += n);
            else
                for (; ++u < o;) i(n = +e.call(t, t[u], u)) && (r += n);
            return r
        }, Uo.mean = function(t, e) {
            var n, o = 0,
                u = t.length,
                a = -1,
                s = u;
            if (1 === arguments.length)
                for (; ++a < u;) i(n = r(t[a])) ? o += n : --s;
            else
                for (; ++a < u;) i(n = r(e.call(t, t[a], a))) ? o += n : --s;
            if (s) return o / s
        }, Uo.quantile = function(t, e) {
            var n = (t.length - 1) * e + 1,
                r = Math.floor(n),
                i = +t[r - 1],
                o = n - r;
            return o ? i + o * (t[r] - i) : i
        }, Uo.median = function(t, e) {
            var o, u = [],
                a = t.length,
                s = -1;
            if (1 === arguments.length)
                for (; ++s < a;) i(o = r(t[s])) && u.push(o);
            else
                for (; ++s < a;) i(o = r(e.call(t, t[s], s))) && u.push(o);
            if (u.length) return Uo.quantile(u.sort(n), .5)
        }, Uo.variance = function(t, e) {
            var n, o, u = t.length,
                a = 0,
                s = 0,
                c = -1,
                l = 0;
            if (1 === arguments.length)
                for (; ++c < u;) i(n = r(t[c])) && (s += (o = n - a) * (n - (a += o / ++l)));
            else
                for (; ++c < u;) i(n = r(e.call(t, t[c], c))) && (s += (o = n - a) * (n - (a += o / ++l)));
            if (l > 1) return s / (l - 1)
        }, Uo.deviation = function() {
            var t = Uo.variance.apply(this, arguments);
            return t ? Math.sqrt(t) : t
        };
        var Ko = o(n);
        Uo.bisectLeft = Ko.left, Uo.bisect = Uo.bisectRight = Ko.right, Uo.bisector = function(t) {
            return o(1 === t.length ? function(e, r) {
                return n(t(e), r)
            } : t)
        }, Uo.shuffle = function(t, e, n) {
            (o = arguments.length) < 3 && (n = t.length, o < 2 && (e = 0));
            for (var r, i, o = n - e; o;) i = Math.random() * o-- | 0, r = t[o + e], t[o + e] = t[i + e], t[i + e] = r;
            return t
        }, Uo.permute = function(t, e) {
            for (var n = e.length, r = new Array(n); n--;) r[n] = t[e[n]];
            return r
        }, Uo.pairs = function(t) {
            for (var e = 0, n = t.length - 1, r = t[0], i = new Array(n < 0 ? 0 : n); e < n;) i[e] = [r, r = t[++e]];
            return i
        }, Uo.transpose = function(t) {
            if (!(i = t.length)) return [];
            for (var e = -1, n = Uo.min(t, u), r = new Array(n); ++e < n;)
                for (var i, o = -1, a = r[e] = new Array(i); ++o < i;) a[o] = t[o][e];
            return r
        }, Uo.zip = function() {
            return Uo.transpose(arguments)
        }, Uo.keys = function(t) {
            var e = [];
            for (var n in t) e.push(n);
            return e
        }, Uo.values = function(t) {
            var e = [];
            for (var n in t) e.push(t[n]);
            return e
        }, Uo.entries = function(t) {
            var e = [];
            for (var n in t) e.push({
                key: n,
                value: t[n]
            });
            return e
        }, Uo.merge = function(t) {
            for (var e, n, r, i = t.length, o = -1, u = 0; ++o < i;) u += t[o].length;
            for (n = new Array(u); --i >= 0;)
                for (e = (r = t[i]).length; --e >= 0;) n[--u] = r[e];
            return n
        };
        var Jo = Math.abs;
        Uo.range = function(t, e, n) {
            if (arguments.length < 3 && (n = 1, arguments.length < 2 && (e = t, t = 0)), (e - t) / n == 1 / 0) throw new Error("infinite range");
            var r, i = [],
                o = a(Jo(n)),
                u = -1;
            if (t *= o, e *= o, (n *= o) < 0)
                for (;
                    (r = t + n * ++u) > e;) i.push(r / o);
            else
                for (;
                    (r = t + n * ++u) < e;) i.push(r / o);
            return i
        }, Uo.map = function(t, e) {
            var n = new c;
            if (t instanceof c) t.forEach(function(t, e) {
                n.set(t, e)
            });
            else if (Array.isArray(t)) {
                var r, i = -1,
                    o = t.length;
                if (1 === arguments.length)
                    for (; ++i < o;) n.set(i, t[i]);
                else
                    for (; ++i < o;) n.set(e.call(t, r = t[i], i), r)
            } else
                for (var u in t) n.set(u, t[u]);
            return n
        };
        var Qo = "__proto__",
            tu = "\0";
        s(c, {
            has: h,
            get: function(t) {
                return this._[l(t)]
            },
            set: function(t, e) {
                return this._[l(t)] = e
            },
            remove: p,
            keys: d,
            values: function() {
                var t = [];
                for (var e in this._) t.push(this._[e]);
                return t
            },
            entries: function() {
                var t = [];
                for (var e in this._) t.push({
                    key: f(e),
                    value: this._[e]
                });
                return t
            },
            size: g,
            empty: v,
            forEach: function(t) {
                for (var e in this._) t.call(this, f(e), this._[e])
            }
        }), Uo.nest = function() {
            function t(e, u, a) {
                if (a >= o.length) return r ? r.call(i, u) : n ? u.sort(n) : u;
                for (var s, l, f, h, p = -1, d = u.length, g = o[a++], v = new c; ++p < d;)(h = v.get(s = g(l = u[p]))) ? h.push(l) : v.set(s, [l]);
                return e ? (l = e(), f = function(n, r) {
                    l.set(n, t(e, r, a))
                }) : (l = {}, f = function(n, r) {
                    l[n] = t(e, r, a)
                }), v.forEach(f), l
            }

            function e(t, n) {
                if (n >= o.length) return t;
                var r = [],
                    i = u[n++];
                return t.forEach(function(t, i) {
                    r.push({
                        key: t,
                        values: e(i, n)
                    })
                }), i ? r.sort(function(t, e) {
                    return i(t.key, e.key)
                }) : r
            }
            var n, r, i = {},
                o = [],
                u = [];
            return i.map = function(e, n) {
                return t(n, e, 0)
            }, i.entries = function(n) {
                return e(t(Uo.map, n, 0), 0)
            }, i.key = function(t) {
                return o.push(t), i
            }, i.sortKeys = function(t) {
                return u[o.length - 1] = t, i
            }, i.sortValues = function(t) {
                return n = t, i
            }, i.rollup = function(t) {
                return r = t, i
            }, i
        }, Uo.set = function(t) {
            var e = new y;
            if (t)
                for (var n = 0, r = t.length; n < r; ++n) e.add(t[n]);
            return e
        }, s(y, {
            has: h,
            add: function(t) {
                return this._[l(t += "")] = !0, t
            },
            remove: p,
            values: d,
            size: g,
            empty: v,
            forEach: function(t) {
                for (var e in this._) t.call(this, f(e))
            }
        }), Uo.behavior = {}, Uo.rebind = function(t, e) {
            for (var n, r = 1, i = arguments.length; ++r < i;) t[n = arguments[r]] = x(t, e, e[n]);
            return t
        };
        var eu = ["webkit", "ms", "moz", "Moz", "o", "O"];
        Uo.dispatch = function() {
            for (var t = new M, e = -1, n = arguments.length; ++e < n;) t[arguments[e]] = k(t);
            return t
        }, M.prototype.on = function(t, e) {
            var n = t.indexOf("."),
                r = "";
            if (n >= 0 && (r = t.slice(n + 1), t = t.slice(0, n)), t) return arguments.length < 2 ? this[t].on(r) : this[t].on(r, e);
            if (2 === arguments.length) {
                if (null == e)
                    for (t in this) this.hasOwnProperty(t) && this[t].on(r, null);
                return this
            }
        }, Uo.event = null, Uo.requote = function(t) {
            return t.replace(nu, "\\$&")
        };
        var nu = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,
            ru = {}.__proto__ ? function(t, e) {
                t.__proto__ = e
            } : function(t, e) {
                for (var n in e) t[n] = e[n]
            },
            iu = function(t, e) {
                return e.querySelector(t)
            },
            ou = function(t, e) {
                return e.querySelectorAll(t)
            },
            uu = function(t, e) {
                var n = t.matches || t[b(t, "matchesSelector")];
                return (uu = function(t, e) {
                    return n.call(t, e)
                })(t, e)
            };
        "function" == typeof Sizzle && (iu = function(t, e) {
            return Sizzle(t, e)[0] || null
        }, ou = Sizzle, uu = Sizzle.matchesSelector), Uo.selection = function() {
            return Uo.select($o.documentElement)
        };
        var au = Uo.selection.prototype = [];
        au.select = function(t) {
            var e, n, r, i, o = [];
            t = N(t);
            for (var u = -1, a = this.length; ++u < a;) {
                o.push(e = []), e.parentNode = (r = this[u]).parentNode;
                for (var s = -1, c = r.length; ++s < c;)(i = r[s]) ? (e.push(n = t.call(i, i.__data__, s, u)), n && "__data__" in i && (n.__data__ = i.__data__)) : e.push(null)
            }
            return S(o)
        }, au.selectAll = function(t) {
            var e, n, r = [];
            t = _(t);
            for (var i = -1, o = this.length; ++i < o;)
                for (var u = this[i], a = -1, s = u.length; ++a < s;)(n = u[a]) && (r.push(e = Bo(t.call(n, n.__data__, a, i))), e.parentNode = n);
            return S(r)
        };
        var su = "http://www.w3.org/1999/xhtml",
            cu = {
                svg: "http://www.w3.org/2000/svg",
                xhtml: su,
                xlink: "http://www.w3.org/1999/xlink",
                xml: "http://www.w3.org/XML/1998/namespace",
                xmlns: "http://www.w3.org/2000/xmlns/"
            };
        Uo.ns = {
            prefix: cu,
            qualify: function(t) {
                var e = t.indexOf(":"),
                    n = t;
                return e >= 0 && "xmlns" !== (n = t.slice(0, e)) && (t = t.slice(e + 1)), cu.hasOwnProperty(n) ? {
                    space: cu[n],
                    local: t
                } : t
            }
        }, au.attr = function(t, e) {
            if (arguments.length < 2) {
                if ("string" == typeof t) {
                    var n = this.node();
                    return (t = Uo.ns.qualify(t)).local ? n.getAttributeNS(t.space, t.local) : n.getAttribute(t)
                }
                for (e in t) this.each(A(e, t[e]));
                return this
            }
            return this.each(A(t, e))
        }, au.classed = function(t, e) {
            if (arguments.length < 2) {
                if ("string" == typeof t) {
                    var n = this.node(),
                        r = (t = q(t)).length,
                        i = -1;
                    if (e = n.classList) {
                        for (; ++i < r;)
                            if (!e.contains(t[i])) return !1
                    } else
                        for (e = n.getAttribute("class"); ++i < r;)
                            if (!D(t[i]).test(e)) return !1;
                    return !0
                }
                for (e in t) this.each(j(e, t[e]));
                return this
            }
            return this.each(j(t, e))
        }, au.style = function(t, n, r) {
            var i = arguments.length;
            if (i < 3) {
                if ("string" != typeof t) {
                    i < 2 && (n = "");
                    for (r in t) this.each(O(r, t[r], n));
                    return this
                }
                if (i < 2) {
                    var o = this.node();
                    return e(o).getComputedStyle(o, null).getPropertyValue(t)
                }
                r = ""
            }
            return this.each(O(t, n, r))
        }, au.property = function(t, e) {
            if (arguments.length < 2) {
                if ("string" == typeof t) return this.node()[t];
                for (e in t) this.each(R(e, t[e]));
                return this
            }
            return this.each(R(t, e))
        }, au.text = function(t) {
            return arguments.length ? this.each("function" == typeof t ? function() {
                var e = t.apply(this, arguments);
                this.textContent = null == e ? "" : e
            } : null == t ? function() {
                this.textContent = ""
            } : function() {
                this.textContent = t
            }) : this.node().textContent
        }, au.html = function(t) {
            return arguments.length ? this.each("function" == typeof t ? function() {
                var e = t.apply(this, arguments);
                this.innerHTML = null == e ? "" : e
            } : null == t ? function() {
                this.innerHTML = ""
            } : function() {
                this.innerHTML = t
            }) : this.node().innerHTML
        }, au.append = function(t) {
            return t = H(t), this.select(function() {
                return this.appendChild(t.apply(this, arguments))
            })
        }, au.insert = function(t, e) {
            return t = H(t), e = N(e), this.select(function() {
                return this.insertBefore(t.apply(this, arguments), e.apply(this, arguments) || null)
            })
        }, au.remove = function() {
            return this.each(F)
        }, au.data = function(t, e) {
            function n(t, n) {
                var r, i, o, u = t.length,
                    f = n.length,
                    h = Math.min(u, f),
                    p = new Array(f),
                    d = new Array(f),
                    g = new Array(u);
                if (e) {
                    var v, y = new c,
                        m = new Array(u);
                    for (r = -1; ++r < u;)(i = t[r]) && (y.has(v = e.call(i, i.__data__, r)) ? g[r] = i : y.set(v, i), m[r] = v);
                    for (r = -1; ++r < f;)(i = y.get(v = e.call(n, o = n[r], r))) ? !0 !== i && (p[r] = i, i.__data__ = o) : d[r] = z(o), y.set(v, !0);
                    for (r = -1; ++r < u;) r in m && !0 !== y.get(m[r]) && (g[r] = t[r])
                } else {
                    for (r = -1; ++r < h;) i = t[r], o = n[r], i ? (i.__data__ = o, p[r] = i) : d[r] = z(o);
                    for (; r < f; ++r) d[r] = z(n[r]);
                    for (; r < u; ++r) g[r] = t[r]
                }
                d.update = p, d.parentNode = p.parentNode = g.parentNode = t.parentNode, a.push(d), s.push(p), l.push(g)
            }
            var r, i, o = -1,
                u = this.length;
            if (!arguments.length) {
                for (t = new Array(u = (r = this[0]).length); ++o < u;)(i = r[o]) && (t[o] = i.__data__);
                return t
            }
            var a = B([]),
                s = S([]),
                l = S([]);
            if ("function" == typeof t)
                for (; ++o < u;) n(r = this[o], t.call(r, r.parentNode.__data__, o));
            else
                for (; ++o < u;) n(r = this[o], t);
            return s.enter = function() {
                return a
            }, s.exit = function() {
                return l
            }, s
        }, au.datum = function(t) {
            return arguments.length ? this.property("__data__", t) : this.property("__data__")
        }, au.filter = function(t) {
            var e, n, r, i = [];
            "function" != typeof t && (t = I(t));
            for (var o = 0, u = this.length; o < u; o++) {
                i.push(e = []), e.parentNode = (n = this[o]).parentNode;
                for (var a = 0, s = n.length; a < s; a++)(r = n[a]) && t.call(r, r.__data__, a, o) && e.push(r)
            }
            return S(i)
        }, au.order = function() {
            for (var t = -1, e = this.length; ++t < e;)
                for (var n, r = this[t], i = r.length - 1, o = r[i]; --i >= 0;)(n = r[i]) && (o && o !== n.nextSibling && o.parentNode.insertBefore(n, o), o = n);
            return this
        }, au.sort = function(t) {
            t = U.apply(this, arguments);
            for (var e = -1, n = this.length; ++e < n;) this[e].sort(t);
            return this.order()
        }, au.each = function(t) {
            return W(this, function(e, n, r) {
                t.call(e, e.__data__, n, r)
            })
        }, au.call = function(t) {
            var e = Bo(arguments);
            return t.apply(e[0] = this, e), this
        }, au.empty = function() {
            return !this.node()
        }, au.node = function() {
            for (var t = 0, e = this.length; t < e; t++)
                for (var n = this[t], r = 0, i = n.length; r < i; r++) {
                    var o = n[r];
                    if (o) return o
                }
            return null
        }, au.size = function() {
            var t = 0;
            return W(this, function() {
                ++t
            }), t
        };
        var lu = [];
        Uo.selection.enter = B, Uo.selection.enter.prototype = lu, lu.append = au.append, lu.empty = au.empty, lu.node = au.node, lu.call = au.call, lu.size = au.size, lu.select = function(t) {
            for (var e, n, r, i, o, u = [], a = -1, s = this.length; ++a < s;) {
                r = (i = this[a]).update, u.push(e = []), e.parentNode = i.parentNode;
                for (var c = -1, l = i.length; ++c < l;)(o = i[c]) ? (e.push(r[c] = n = t.call(i.parentNode, o.__data__, c, a)), n.__data__ = o.__data__) : e.push(null)
            }
            return S(u)
        }, lu.insert = function(t, e) {
            return arguments.length < 2 && (e = $(this)), au.insert.call(this, t, e)
        }, Uo.select = function(e) {
            var n;
            return "string" == typeof e ? (n = [iu(e, $o)]).parentNode = $o.documentElement : (n = [e]).parentNode = t(e), S([n])
        }, Uo.selectAll = function(t) {
            var e;
            return "string" == typeof t ? (e = Bo(ou(t, $o))).parentNode = $o.documentElement : (e = Bo(t)).parentNode = null, S([e])
        }, au.on = function(t, e, n) {
            var r = arguments.length;
            if (r < 3) {
                if ("string" != typeof t) {
                    r < 2 && (e = !1);
                    for (n in t) this.each(V(n, t[n], e));
                    return this
                }
                if (r < 2) return (r = this.node()["__on" + t]) && r._;
                n = !1
            }
            return this.each(V(t, e, n))
        };
        var fu = Uo.map({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        });
        $o && fu.forEach(function(t) {
            "on" + t in $o && fu.remove(t)
        });
        var hu, pu = 0;
        Uo.mouse = function(t) {
            return G(t, C())
        };
        var du = this.navigator && /WebKit/.test(this.navigator.userAgent) ? -1 : 0;
        Uo.touch = function(t, e, n) {
            if (arguments.length < 3 && (n = e, e = C().changedTouches), e)
                for (var r, i = 0, o = e.length; i < o; ++i)
                    if ((r = e[i]).identifier === n) return G(t, r)
        }, Uo.behavior.drag = function() {
            function t() {
                this.on("mousedown.drag", o).on("touchstart.drag", u)
            }

            function n(t, e, n, o, u) {
                return function() {
                    var a, s = this,
                        c = Uo.event.target.correspondingElement || Uo.event.target,
                        l = s.parentNode,
                        f = r.of(s, arguments),
                        h = 0,
                        p = t(),
                        d = ".drag" + (null == p ? "" : "-" + p),
                        g = Uo.select(n(c)).on(o + d, function() {
                            var t, n, r = e(l, p);
                            r && (t = r[0] - y[0], n = r[1] - y[1], h |= t | n, y = r, f({
                                type: "drag",
                                x: r[0] + a[0],
                                y: r[1] + a[1],
                                dx: t,
                                dy: n
                            }))
                        }).on(u + d, function() {
                            e(l, p) && (g.on(o + d, null).on(u + d, null), v(h), f({
                                type: "dragend"
                            }))
                        }),
                        v = Z(c),
                        y = e(l, p);
                    i ? (a = i.apply(s, arguments), a = [a.x - y[0], a.y - y[1]]) : a = [0, 0], f({
                        type: "dragstart"
                    })
                }
            }
            var r = T(t, "drag", "dragstart", "dragend"),
                i = null,
                o = n(w, Uo.mouse, e, "mousemove", "mouseup"),
                u = n(K, Uo.touch, m, "touchmove", "touchend");
            return t.origin = function(e) {
                return arguments.length ? (i = e, t) : i
            }, Uo.rebind(t, r, "on")
        }, Uo.touches = function(t, e) {
            return arguments.length < 2 && (e = C().touches), e ? Bo(e).map(function(e) {
                var n = G(t, e);
                return n.identifier = e.identifier, n
            }) : []
        };
        var gu = 1e-6,
            vu = gu * gu,
            yu = Math.PI,
            mu = 2 * yu,
            xu = mu - gu,
            bu = yu / 2,
            wu = yu / 180,
            Mu = 180 / yu,
            ku = Math.SQRT2;
        Uo.interpolateZoom = function(t, e) {
            var n, r, i = t[0],
                o = t[1],
                u = t[2],
                a = e[0],
                s = e[1],
                c = e[2],
                l = a - i,
                f = s - o,
                h = l * l + f * f;
            if (h < vu) r = Math.log(c / u) / ku, n = function(t) {
                return [i + t * l, o + t * f, u * Math.exp(ku * t * r)]
            };
            else {
                var p = Math.sqrt(h),
                    d = (c * c - u * u + 4 * h) / (2 * u * 2 * p),
                    g = (c * c - u * u - 4 * h) / (2 * c * 2 * p),
                    v = Math.log(Math.sqrt(d * d + 1) - d),
                    y = Math.log(Math.sqrt(g * g + 1) - g);
                r = (y - v) / ku, n = function(t) {
                    var e = t * r,
                        n = rt(v),
                        a = u / (2 * p) * (n * it(ku * e + v) - nt(v));
                    return [i + a * l, o + a * f, u * n / rt(ku * e + v)]
                }
            }
            return n.duration = 1e3 * r, n
        }, Uo.behavior.zoom = function() {
            function t(t) {
                t.on(L, f).on(Cu + ".zoom", p).on("dblclick.zoom", d).on(j, h)
            }

            function n(t) {
                return [(t[0] - C.x) / C.k, (t[1] - C.y) / C.k]
            }

            function r(t) {
                return [t[0] * C.k + C.x, t[1] * C.k + C.y]
            }

            function i(t) {
                C.k = Math.max(N[0], Math.min(N[1], t))
            }

            function o(t, e) {
                e = r(e), C.x += t[0] - e[0], C.y += t[1] - e[1]
            }

            function u(e, n, r, u) {
                e.__chart__ = {
                    x: C.x,
                    y: C.y,
                    k: C.k
                }, i(Math.pow(2, u)), o(v = n, r), e = Uo.select(e), _ > 0 && (e = e.transition().duration(_)), e.call(t.event)
            }

            function a() {
                w && w.domain(b.range().map(function(t) {
                    return (t - C.x) / C.k
                }).map(b.invert)), k && k.domain(M.range().map(function(t) {
                    return (t - C.y) / C.k
                }).map(M.invert))
            }

            function s(t) {
                A++ || t({
                    type: "zoomstart"
                })
            }

            function c(t) {
                a(), t({
                    type: "zoom",
                    scale: C.k,
                    translate: [C.x, C.y]
                })
            }

            function l(t) {
                --A || (t({
                    type: "zoomend"
                }), v = null)
            }

            function f() {
                var t = this,
                    r = P.of(t, arguments),
                    i = 0,
                    u = Uo.select(e(t)).on(D, function() {
                        i = 1, o(Uo.mouse(t), a), c(r)
                    }).on(q, function() {
                        u.on(D, null).on(q, null), f(i), l(r)
                    }),
                    a = n(Uo.mouse(t)),
                    f = Z(t);
                ms.call(t), s(r)
            }

            function h() {
                function t() {
                    var t = Uo.touches(d);
                    return p = C.k, t.forEach(function(t) {
                        t.identifier in v && (v[t.identifier] = n(t))
                    }), t
                }

                function e() {
                    var e = Uo.event.target;
                    Uo.select(e).on(b, r).on(w, a), M.push(e);
                    for (var n = Uo.event.changedTouches, i = 0, o = n.length; i < o; ++i) v[n[i].identifier] = null;
                    var s = t(),
                        c = Date.now();
                    if (1 === s.length) c - x < 500 && (l = s[0], u(d, l, v[l.identifier], Math.floor(Math.log(C.k) / Math.LN2) + 1), E()), x = c;
                    else if (s.length > 1) {
                        var l = s[0],
                            f = s[1],
                            h = l[0] - f[0],
                            p = l[1] - f[1];
                        y = h * h + p * p
                    }
                }

                function r() {
                    var t, e, n, r, u = Uo.touches(d);
                    ms.call(d);
                    for (var a = 0, s = u.length; a < s; ++a, r = null)
                        if (n = u[a], r = v[n.identifier]) {
                            if (e) break;
                            t = n, e = r
                        }
                    if (r) {
                        var l = (l = n[0] - t[0]) * l + (l = n[1] - t[1]) * l,
                            f = y && Math.sqrt(l / y);
                        t = [(t[0] + n[0]) / 2, (t[1] + n[1]) / 2], e = [(e[0] + r[0]) / 2, (e[1] + r[1]) / 2], i(f * p)
                    }
                    x = null, o(t, e), c(g)
                }

                function a() {
                    if (Uo.event.touches.length) {
                        for (var e = Uo.event.changedTouches, n = 0, r = e.length; n < r; ++n) delete v[e[n].identifier];
                        for (var i in v) return void t()
                    }
                    Uo.selectAll(M).on(m, null), k.on(L, f).on(j, h), T(), l(g)
                }
                var p, d = this,
                    g = P.of(d, arguments),
                    v = {},
                    y = 0,
                    m = ".zoom-" + Uo.event.changedTouches[0].identifier,
                    b = "touchmove" + m,
                    w = "touchend" + m,
                    M = [],
                    k = Uo.select(d),
                    T = Z(d);
                e(), s(g), k.on(L, null).on(j, e)
            }

            function p() {
                var t = P.of(this, arguments);
                m ? clearTimeout(m) : (ms.call(this), g = n(v = y || Uo.mouse(this)), s(t)), m = setTimeout(function() {
                    m = null, l(t)
                }, 50), E(), i(Math.pow(2, .002 * Eu()) * C.k), o(v, g), c(t)
            }

            function d() {
                var t = Uo.mouse(this),
                    e = Math.log(C.k) / Math.LN2;
                u(this, t, n(t), Uo.event.shiftKey ? Math.ceil(e) - 1 : Math.floor(e) + 1)
            }
            var g, v, y, m, x, b, w, M, k, C = {
                    x: 0,
                    y: 0,
                    k: 1
                },
                S = [960, 500],
                N = Tu,
                _ = 250,
                A = 0,
                L = "mousedown.zoom",
                D = "mousemove.zoom",
                q = "mouseup.zoom",
                j = "touchstart.zoom",
                P = T(t, "zoomstart", "zoom", "zoomend");
            return Cu || (Cu = "onwheel" in $o ? (Eu = function() {
                return -Uo.event.deltaY * (Uo.event.deltaMode ? 120 : 1)
            }, "wheel") : "onmousewheel" in $o ? (Eu = function() {
                return Uo.event.wheelDelta
            }, "mousewheel") : (Eu = function() {
                return -Uo.event.detail
            }, "MozMousePixelScroll")), t.event = function(t) {
                t.each(function() {
                    var t = P.of(this, arguments),
                        e = C;
                    vs ? Uo.select(this).transition().each("start.zoom", function() {
                        C = this.__chart__ || {
                            x: 0,
                            y: 0,
                            k: 1
                        }, s(t)
                    }).tween("zoom:zoom", function() {
                        var n = S[0],
                            r = S[1],
                            i = v ? v[0] : n / 2,
                            o = v ? v[1] : r / 2,
                            u = Uo.interpolateZoom([(i - C.x) / C.k, (o - C.y) / C.k, n / C.k], [(i - e.x) / e.k, (o - e.y) / e.k, n / e.k]);
                        return function(e) {
                            var r = u(e),
                                a = n / r[2];
                            this.__chart__ = C = {
                                x: i - r[0] * a,
                                y: o - r[1] * a,
                                k: a
                            }, c(t)
                        }
                    }).each("interrupt.zoom", function() {
                        l(t)
                    }).each("end.zoom", function() {
                        l(t)
                    }) : (this.__chart__ = C, s(t), c(t), l(t))
                })
            }, t.translate = function(e) {
                return arguments.length ? (C = {
                    x: +e[0],
                    y: +e[1],
                    k: C.k
                }, a(), t) : [C.x, C.y]
            }, t.scale = function(e) {
                return arguments.length ? (C = {
                    x: C.x,
                    y: C.y,
                    k: null
                }, i(+e), a(), t) : C.k
            }, t.scaleExtent = function(e) {
                return arguments.length ? (N = null == e ? Tu : [+e[0], +e[1]], t) : N
            }, t.center = function(e) {
                return arguments.length ? (y = e && [+e[0], +e[1]], t) : y
            }, t.size = function(e) {
                return arguments.length ? (S = e && [+e[0], +e[1]], t) : S
            }, t.duration = function(e) {
                return arguments.length ? (_ = +e, t) : _
            }, t.x = function(e) {
                return arguments.length ? (w = e, b = e.copy(), C = {
                    x: 0,
                    y: 0,
                    k: 1
                }, t) : w
            }, t.y = function(e) {
                return arguments.length ? (k = e, M = e.copy(), C = {
                    x: 0,
                    y: 0,
                    k: 1
                }, t) : k
            }, Uo.rebind(t, P, "on")
        };
        var Eu, Cu, Tu = [0, 1 / 0];
        Uo.color = ut, ut.prototype.toString = function() {
            return this.rgb() + ""
        }, Uo.hsl = at;
        var Su = at.prototype = new ut;
        Su.brighter = function(t) {
            return t = Math.pow(.7, arguments.length ? t : 1), new at(this.h, this.s, this.l / t)
        }, Su.darker = function(t) {
            return t = Math.pow(.7, arguments.length ? t : 1), new at(this.h, this.s, t * this.l)
        }, Su.rgb = function() {
            return st(this.h, this.s, this.l)
        }, Uo.hcl = ct;
        var Nu = ct.prototype = new ut;
        Nu.brighter = function(t) {
            return new ct(this.h, this.c, Math.min(100, this.l + _u * (arguments.length ? t : 1)))
        }, Nu.darker = function(t) {
            return new ct(this.h, this.c, Math.max(0, this.l - _u * (arguments.length ? t : 1)))
        }, Nu.rgb = function() {
            return lt(this.h, this.c, this.l).rgb()
        }, Uo.lab = ft;
        var _u = 18,
            Au = .95047,
            Lu = 1,
            Du = 1.08883,
            qu = ft.prototype = new ut;
        qu.brighter = function(t) {
            return new ft(Math.min(100, this.l + _u * (arguments.length ? t : 1)), this.a, this.b)
        }, qu.darker = function(t) {
            return new ft(Math.max(0, this.l - _u * (arguments.length ? t : 1)), this.a, this.b)
        }, qu.rgb = function() {
            return ht(this.l, this.a, this.b)
        }, Uo.rgb = yt;
        var ju = yt.prototype = new ut;
        ju.brighter = function(t) {
            t = Math.pow(.7, arguments.length ? t : 1);
            var e = this.r,
                n = this.g,
                r = this.b,
                i = 30;
            return e || n || r ? (e && e < i && (e = i), n && n < i && (n = i), r && r < i && (r = i), new yt(Math.min(255, e / t), Math.min(255, n / t), Math.min(255, r / t))) : new yt(i, i, i)
        }, ju.darker = function(t) {
            return t = Math.pow(.7, arguments.length ? t : 1), new yt(t * this.r, t * this.g, t * this.b)
        }, ju.hsl = function() {
            return Mt(this.r, this.g, this.b)
        }, ju.toString = function() {
            return "#" + bt(this.r) + bt(this.g) + bt(this.b)
        };
        var Pu = Uo.map({
            aliceblue: 15792383,
            antiquewhite: 16444375,
            aqua: 65535,
            aquamarine: 8388564,
            azure: 15794175,
            beige: 16119260,
            bisque: 16770244,
            black: 0,
            blanchedalmond: 16772045,
            blue: 255,
            blueviolet: 9055202,
            brown: 10824234,
            burlywood: 14596231,
            cadetblue: 6266528,
            chartreuse: 8388352,
            chocolate: 13789470,
            coral: 16744272,
            cornflowerblue: 6591981,
            cornsilk: 16775388,
            crimson: 14423100,
            cyan: 65535,
            darkblue: 139,
            darkcyan: 35723,
            darkgoldenrod: 12092939,
            darkgray: 11119017,
            darkgreen: 25600,
            darkgrey: 11119017,
            darkkhaki: 12433259,
            darkmagenta: 9109643,
            darkolivegreen: 5597999,
            darkorange: 16747520,
            darkorchid: 10040012,
            darkred: 9109504,
            darksalmon: 15308410,
            darkseagreen: 9419919,
            darkslateblue: 4734347,
            darkslategray: 3100495,
            darkslategrey: 3100495,
            darkturquoise: 52945,
            darkviolet: 9699539,
            deeppink: 16716947,
            deepskyblue: 49151,
            dimgray: 6908265,
            dimgrey: 6908265,
            dodgerblue: 2003199,
            firebrick: 11674146,
            floralwhite: 16775920,
            forestgreen: 2263842,
            fuchsia: 16711935,
            gainsboro: 14474460,
            ghostwhite: 16316671,
            gold: 16766720,
            goldenrod: 14329120,
            gray: 8421504,
            green: 32768,
            greenyellow: 11403055,
            grey: 8421504,
            honeydew: 15794160,
            hotpink: 16738740,
            indianred: 13458524,
            indigo: 4915330,
            ivory: 16777200,
            khaki: 15787660,
            lavender: 15132410,
            lavenderblush: 16773365,
            lawngreen: 8190976,
            lemonchiffon: 16775885,
            lightblue: 11393254,
            lightcoral: 15761536,
            lightcyan: 14745599,
            lightgoldenrodyellow: 16448210,
            lightgray: 13882323,
            lightgreen: 9498256,
            lightgrey: 13882323,
            lightpink: 16758465,
            lightsalmon: 16752762,
            lightseagreen: 2142890,
            lightskyblue: 8900346,
            lightslategray: 7833753,
            lightslategrey: 7833753,
            lightsteelblue: 11584734,
            lightyellow: 16777184,
            lime: 65280,
            limegreen: 3329330,
            linen: 16445670,
            magenta: 16711935,
            maroon: 8388608,
            mediumaquamarine: 6737322,
            mediumblue: 205,
            mediumorchid: 12211667,
            mediumpurple: 9662683,
            mediumseagreen: 3978097,
            mediumslateblue: 8087790,
            mediumspringgreen: 64154,
            mediumturquoise: 4772300,
            mediumvioletred: 13047173,
            midnightblue: 1644912,
            mintcream: 16121850,
            mistyrose: 16770273,
            moccasin: 16770229,
            navajowhite: 16768685,
            navy: 128,
            oldlace: 16643558,
            olive: 8421376,
            olivedrab: 7048739,
            orange: 16753920,
            orangered: 16729344,
            orchid: 14315734,
            palegoldenrod: 15657130,
            palegreen: 10025880,
            paleturquoise: 11529966,
            palevioletred: 14381203,
            papayawhip: 16773077,
            peachpuff: 16767673,
            peru: 13468991,
            pink: 16761035,
            plum: 14524637,
            powderblue: 11591910,
            purple: 8388736,
            rebeccapurple: 6697881,
            red: 16711680,
            rosybrown: 12357519,
            royalblue: 4286945,
            saddlebrown: 9127187,
            salmon: 16416882,
            sandybrown: 16032864,
            seagreen: 3050327,
            seashell: 16774638,
            sienna: 10506797,
            silver: 12632256,
            skyblue: 8900331,
            slateblue: 6970061,
            slategray: 7372944,
            slategrey: 7372944,
            snow: 16775930,
            springgreen: 65407,
            steelblue: 4620980,
            tan: 13808780,
            teal: 32896,
            thistle: 14204888,
            tomato: 16737095,
            turquoise: 4251856,
            violet: 15631086,
            wheat: 16113331,
            white: 16777215,
            whitesmoke: 16119285,
            yellow: 16776960,
            yellowgreen: 10145074
        });
        Pu.forEach(function(t, e) {
            Pu.set(t, mt(e))
        }), Uo.functor = Tt, Uo.xhr = St(m), Uo.dsv = function(t, e) {
            function n(t, n, o) {
                arguments.length < 3 && (o = n, n = null);
                var u = Nt(t, e, null == n ? r : i(n), o);
                return u.row = function(t) {
                    return arguments.length ? u.response(null == (n = t) ? r : i(t)) : n
                }, u
            }

            function r(t) {
                return n.parse(t.responseText)
            }

            function i(t) {
                return function(e) {
                    return n.parse(e.responseText, t)
                }
            }

            function o(e) {
                return e.map(u).join(t)
            }

            function u(t) {
                return a.test(t) ? '"' + t.replace(/\"/g, '""') + '"' : t
            }
            var a = new RegExp('["' + t + "\n]"),
                s = t.charCodeAt(0);
            return n.parse = function(t, e) {
                var r;
                return n.parseRows(t, function(t, n) {
                    if (r) return r(t, n - 1);
                    var i = new Function("d", "return {" + t.map(function(t, e) {
                        return JSON.stringify(t) + ": d[" + e + "]"
                    }).join(",") + "}");
                    r = e ? function(t, n) {
                        return e(i(t), n)
                    } : i
                })
            }, n.parseRows = function(t, e) {
                function n() {
                    if (l >= c) return u;
                    if (i) return i = !1, o;
                    var e = l;
                    if (34 === t.charCodeAt(e)) {
                        for (var n = e; n++ < c;)
                            if (34 === t.charCodeAt(n)) {
                                if (34 !== t.charCodeAt(n + 1)) break;
                                ++n
                            }
                        return l = n + 2, 13 === (r = t.charCodeAt(n + 1)) ? (i = !0, 10 === t.charCodeAt(n + 2) && ++l) : 10 === r && (i = !0), t.slice(e + 1, n).replace(/""/g, '"')
                    }
                    for (; l < c;) {
                        var r = t.charCodeAt(l++),
                            a = 1;
                        if (10 === r) i = !0;
                        else if (13 === r) i = !0, 10 === t.charCodeAt(l) && (++l, ++a);
                        else if (r !== s) continue;
                        return t.slice(e, l - a)
                    }
                    return t.slice(e)
                }
                for (var r, i, o = {}, u = {}, a = [], c = t.length, l = 0, f = 0;
                     (r = n()) !== u;) {
                    for (var h = []; r !== o && r !== u;) h.push(r), r = n();
                    e && null == (h = e(h, f++)) || a.push(h)
                }
                return a
            }, n.format = function(e) {
                if (Array.isArray(e[0])) return n.formatRows(e);
                var r = new y,
                    i = [];
                return e.forEach(function(t) {
                    for (var e in t) r.has(e) || i.push(r.add(e))
                }), [i.map(u).join(t)].concat(e.map(function(e) {
                    return i.map(function(t) {
                        return u(e[t])
                    }).join(t)
                })).join("\n")
            }, n.formatRows = function(t) {
                return t.map(o).join("\n")
            }, n
        }, Uo.csv = Uo.dsv(",", "text/csv"), Uo.tsv = Uo.dsv("\t", "text/tab-separated-values");
        var Ou, Ru, Hu, Fu, zu = this[b(this, "requestAnimationFrame")] || function(t) {
            setTimeout(t, 17)
        };
        Uo.timer = function() {
            Lt.apply(this, arguments)
        }, Uo.timer.flush = function() {
            qt(), jt()
        }, Uo.round = function(t, e) {
            return e ? Math.round(t * (e = Math.pow(10, e))) / e : Math.round(t)
        };
        var Iu = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"].map(function(t, e) {
            var n = Math.pow(10, 3 * Jo(8 - e));
            return {
                scale: e > 8 ? function(t) {
                    return t / n
                } : function(t) {
                    return t * n
                },
                symbol: t
            }
        });
        Uo.formatPrefix = function(t, e) {
            var n = 0;
            return (t = +t) && (t < 0 && (t *= -1), e && (t = Uo.round(t, Pt(t, e))), n = 1 + Math.floor(1e-12 + Math.log(t) / Math.LN10), n = Math.max(-24, Math.min(24, 3 * Math.floor((n - 1) / 3)))), Iu[8 + n / 3]
        };
        var Uu = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,
            Wu = Uo.map({
                b: function(t) {
                    return t.toString(2)
                },
                c: function(t) {
                    return String.fromCharCode(t)
                },
                o: function(t) {
                    return t.toString(8)
                },
                x: function(t) {
                    return t.toString(16)
                },
                X: function(t) {
                    return t.toString(16).toUpperCase()
                },
                g: function(t, e) {
                    return t.toPrecision(e)
                },
                e: function(t, e) {
                    return t.toExponential(e)
                },
                f: function(t, e) {
                    return t.toFixed(e)
                },
                r: function(t, e) {
                    return (t = Uo.round(t, Pt(t, e))).toFixed(Math.max(0, Math.min(20, Pt(t * (1 + 1e-15), e))))
                }
            }),
            Bu = Uo.time = {},
            $u = Date;
        Ht.prototype = {
            getDate: function() {
                return this._.getUTCDate()
            },
            getDay: function() {
                return this._.getUTCDay()
            },
            getFullYear: function() {
                return this._.getUTCFullYear()
            },
            getHours: function() {
                return this._.getUTCHours()
            },
            getMilliseconds: function() {
                return this._.getUTCMilliseconds()
            },
            getMinutes: function() {
                return this._.getUTCMinutes()
            },
            getMonth: function() {
                return this._.getUTCMonth()
            },
            getSeconds: function() {
                return this._.getUTCSeconds()
            },
            getTime: function() {
                return this._.getTime()
            },
            getTimezoneOffset: function() {
                return 0
            },
            valueOf: function() {
                return this._.valueOf()
            },
            setDate: function() {
                Vu.setUTCDate.apply(this._, arguments)
            },
            setDay: function() {
                Vu.setUTCDay.apply(this._, arguments)
            },
            setFullYear: function() {
                Vu.setUTCFullYear.apply(this._, arguments)
            },
            setHours: function() {
                Vu.setUTCHours.apply(this._, arguments)
            },
            setMilliseconds: function() {
                Vu.setUTCMilliseconds.apply(this._, arguments)
            },
            setMinutes: function() {
                Vu.setUTCMinutes.apply(this._, arguments)
            },
            setMonth: function() {
                Vu.setUTCMonth.apply(this._, arguments)
            },
            setSeconds: function() {
                Vu.setUTCSeconds.apply(this._, arguments)
            },
            setTime: function() {
                Vu.setTime.apply(this._, arguments)
            }
        };
        var Vu = Date.prototype;
        Bu.year = Ft(function(t) {
            return (t = Bu.day(t)).setMonth(0, 1), t
        }, function(t, e) {
            t.setFullYear(t.getFullYear() + e)
        }, function(t) {
            return t.getFullYear()
        }), Bu.years = Bu.year.range, Bu.years.utc = Bu.year.utc.range, Bu.day = Ft(function(t) {
            var e = new $u(2e3, 0);
            return e.setFullYear(t.getFullYear(), t.getMonth(), t.getDate()), e
        }, function(t, e) {
            t.setDate(t.getDate() + e)
        }, function(t) {
            return t.getDate() - 1
        }), Bu.days = Bu.day.range, Bu.days.utc = Bu.day.utc.range, Bu.dayOfYear = function(t) {
            var e = Bu.year(t);
            return Math.floor((t - e - 6e4 * (t.getTimezoneOffset() - e.getTimezoneOffset())) / 864e5)
        }, ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].forEach(function(t, e) {
            e = 7 - e;
            var n = Bu[t] = Ft(function(t) {
                return (t = Bu.day(t)).setDate(t.getDate() - (t.getDay() + e) % 7), t
            }, function(t, e) {
                t.setDate(t.getDate() + 7 * Math.floor(e))
            }, function(t) {
                var n = Bu.year(t).getDay();
                return Math.floor((Bu.dayOfYear(t) + (n + e) % 7) / 7) - (n !== e)
            });
            Bu[t + "s"] = n.range, Bu[t + "s"].utc = n.utc.range, Bu[t + "OfYear"] = function(t) {
                var n = Bu.year(t).getDay();
                return Math.floor((Bu.dayOfYear(t) + (n + e) % 7) / 7)
            }
        }), Bu.week = Bu.sunday, Bu.weeks = Bu.sunday.range, Bu.weeks.utc = Bu.sunday.utc.range, Bu.weekOfYear = Bu.sundayOfYear;
        var Yu = {
                "-": "",
                _: " ",
                0: "0"
            },
            Xu = /^\s*\d+/,
            Zu = /^%/;
        Uo.locale = function(t) {
            return {
                numberFormat: Ot(t),
                timeFormat: It(t)
            }
        };
        var Gu = Uo.locale({
            decimal: ".",
            thousands: ",",
            grouping: [3],
            currency: ["$", ""],
            dateTime: "%a %b %e %X %Y",
            date: "%m/%d/%Y",
            time: "%H:%M:%S",
            periods: ["AM", "PM"],
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        });
        Uo.format = Gu.numberFormat, Uo.geo = {}, se.prototype = {
            s: 0,
            t: 0,
            add: function(t) {
                ce(t, this.t, Ku), ce(Ku.s, this.s, this), this.s ? this.t += Ku.t : this.s = Ku.t
            },
            reset: function() {
                this.s = this.t = 0
            },
            valueOf: function() {
                return this.s
            }
        };
        var Ku = new se;
        Uo.geo.stream = function(t, e) {
            t && Ju.hasOwnProperty(t.type) ? Ju[t.type](t, e) : le(t, e)
        };
        var Ju = {
                Feature: function(t, e) {
                    le(t.geometry, e)
                },
                FeatureCollection: function(t, e) {
                    for (var n = t.features, r = -1, i = n.length; ++r < i;) le(n[r].geometry, e)
                }
            },
            Qu = {
                Sphere: function(t, e) {
                    e.sphere()
                },
                Point: function(t, e) {
                    t = t.coordinates, e.point(t[0], t[1], t[2])
                },
                MultiPoint: function(t, e) {
                    for (var n = t.coordinates, r = -1, i = n.length; ++r < i;) t = n[r], e.point(t[0], t[1], t[2])
                },
                LineString: function(t, e) {
                    fe(t.coordinates, e, 0)
                },
                MultiLineString: function(t, e) {
                    for (var n = t.coordinates, r = -1, i = n.length; ++r < i;) fe(n[r], e, 0)
                },
                Polygon: function(t, e) {
                    he(t.coordinates, e)
                },
                MultiPolygon: function(t, e) {
                    for (var n = t.coordinates, r = -1, i = n.length; ++r < i;) he(n[r], e)
                },
                GeometryCollection: function(t, e) {
                    for (var n = t.geometries, r = -1, i = n.length; ++r < i;) le(n[r], e)
                }
            };
        Uo.geo.area = function(t) {
            return ta = 0, Uo.geo.stream(t, na), ta
        };
        var ta, ea = new se,
            na = {
                sphere: function() {
                    ta += 4 * yu
                },
                point: w,
                lineStart: w,
                lineEnd: w,
                polygonStart: function() {
                    ea.reset(), na.lineStart = pe
                },
                polygonEnd: function() {
                    var t = 2 * ea;
                    ta += t < 0 ? 4 * yu + t : t, na.lineStart = na.lineEnd = na.point = w
                }
            };
        Uo.geo.bounds = function() {
            function t(t, e) {
                x.push(b = [l = t, h = t]), e < f && (f = e), e > p && (p = e)
            }

            function e(e, n) {
                var r = de([e * wu, n * wu]);
                if (y) {
                    var i = ve(y, r),
                        o = ve([i[1], -i[0], 0], i);
                    xe(o), o = be(o);
                    var u = e - d,
                        s = u > 0 ? 1 : -1,
                        c = o[0] * Mu * s,
                        g = Jo(u) > 180;
                    if (g ^ (s * d < c && c < s * e))(v = o[1] * Mu) > p && (p = v);
                    else if (c = (c + 360) % 360 - 180, g ^ (s * d < c && c < s * e)) {
                        var v = -o[1] * Mu;
                        v < f && (f = v)
                    } else n < f && (f = n), n > p && (p = n);
                    g ? e < d ? a(l, e) > a(l, h) && (h = e) : a(e, h) > a(l, h) && (l = e) : h >= l ? (e < l && (l = e), e > h && (h = e)) : e > d ? a(l, e) > a(l, h) && (h = e) : a(e, h) > a(l, h) && (l = e)
                } else t(e, n);
                y = r, d = e
            }

            function n() {
                w.point = e
            }

            function r() {
                b[0] = l, b[1] = h, w.point = t, y = null
            }

            function i(t, n) {
                if (y) {
                    var r = t - d;
                    m += Jo(r) > 180 ? r + (r > 0 ? 360 : -360) : r
                } else g = t, v = n;
                na.point(t, n), e(t, n)
            }

            function o() {
                na.lineStart()
            }

            function u() {
                i(g, v), na.lineEnd(), Jo(m) > gu && (l = -(h = 180)), b[0] = l, b[1] = h, y = null
            }

            function a(t, e) {
                return (e -= t) < 0 ? e + 360 : e
            }

            function s(t, e) {
                return t[0] - e[0]
            }

            function c(t, e) {
                return e[0] <= e[1] ? e[0] <= t && t <= e[1] : t < e[0] || e[1] < t
            }
            var l, f, h, p, d, g, v, y, m, x, b, w = {
                point: t,
                lineStart: n,
                lineEnd: r,
                polygonStart: function() {
                    w.point = i, w.lineStart = o, w.lineEnd = u, m = 0, na.polygonStart()
                },
                polygonEnd: function() {
                    na.polygonEnd(), w.point = t, w.lineStart = n, w.lineEnd = r, ea < 0 ? (l = -(h = 180), f = -(p = 90)) : m > gu ? p = 90 : m < -gu && (f = -90), b[0] = l, b[1] = h
                }
            };
            return function(t) {
                p = h = -(l = f = 1 / 0), x = [], Uo.geo.stream(t, w);
                var e = x.length;
                if (e) {
                    x.sort(s);
                    for (var n = 1, r = [d = x[0]]; n < e; ++n) c((o = x[n])[0], d) || c(o[1], d) ? (a(d[0], o[1]) > a(d[0], d[1]) && (d[1] = o[1]), a(o[0], d[1]) > a(d[0], d[1]) && (d[0] = o[0])) : r.push(d = o);
                    for (var i, o, u = -1 / 0, n = 0, d = r[e = r.length - 1]; n <= e; d = o, ++n) o = r[n], (i = a(d[1], o[0])) > u && (u = i, l = o[0], h = d[1])
                }
                return x = b = null, l === 1 / 0 || f === 1 / 0 ? [
                    [NaN, NaN],
                    [NaN, NaN]
                ] : [
                    [l, f],
                    [h, p]
                ]
            }
        }(), Uo.geo.centroid = function(t) {
            ra = ia = oa = ua = aa = sa = ca = la = fa = ha = pa = 0, Uo.geo.stream(t, da);
            var e = fa,
                n = ha,
                r = pa,
                i = e * e + n * n + r * r;
            return i < vu && (e = sa, n = ca, r = la, ia < gu && (e = oa, n = ua, r = aa), (i = e * e + n * n + r * r) < vu) ? [NaN, NaN] : [Math.atan2(n, e) * Mu, et(r / Math.sqrt(i)) * Mu]
        };
        var ra, ia, oa, ua, aa, sa, ca, la, fa, ha, pa, da = {
                sphere: w,
                point: Me,
                lineStart: Ee,
                lineEnd: Ce,
                polygonStart: function() {
                    da.lineStart = Te
                },
                polygonEnd: function() {
                    da.lineStart = Ee
                }
            },
            ga = De(Ne, function(t) {
                var e, n = NaN,
                    r = NaN,
                    i = NaN;
                return {
                    lineStart: function() {
                        t.lineStart(), e = 1
                    },
                    point: function(o, u) {
                        var a = o > 0 ? yu : -yu,
                            s = Jo(o - n);
                        Jo(s - yu) < gu ? (t.point(n, r = (r + u) / 2 > 0 ? bu : -bu), t.point(i, r), t.lineEnd(), t.lineStart(), t.point(a, r), t.point(o, r), e = 0) : i !== a && s >= yu && (Jo(n - i) < gu && (n -= i * gu), Jo(o - a) < gu && (o -= a * gu), r = Oe(n, r, o, u), t.point(i, r), t.lineEnd(), t.lineStart(), t.point(a, r), e = 0), t.point(n = o, r = u), i = a
                    },
                    lineEnd: function() {
                        t.lineEnd(), n = r = NaN
                    },
                    clean: function() {
                        return 2 - e
                    }
                }
            }, function(t, e, n, r) {
                var i;
                if (null == t) i = n * bu, r.point(-yu, i), r.point(0, i), r.point(yu, i), r.point(yu, 0), r.point(yu, -i), r.point(0, -i), r.point(-yu, -i), r.point(-yu, 0), r.point(-yu, i);
                else if (Jo(t[0] - e[0]) > gu) {
                    var o = t[0] < e[0] ? yu : -yu;
                    i = n * o / 2, r.point(-o, i), r.point(0, i), r.point(o, i)
                } else r.point(e[0], e[1])
            }, [-yu, -yu / 2]),
            va = 1e9;
        Uo.geo.clipExtent = function() {
            var t, e, n, r, i, o, u = {
                stream: function(t) {
                    return i && (i.valid = !1), i = o(t), i.valid = !0, i
                },
                extent: function(a) {
                    return arguments.length ? (o = ze(t = +a[0][0], e = +a[0][1], n = +a[1][0], r = +a[1][1]), i && (i.valid = !1, i = null), u) : [
                        [t, e],
                        [n, r]
                    ]
                }
            };
            return u.extent([
                [0, 0],
                [960, 500]
            ])
        }, (Uo.geo.conicEqualArea = function() {
            return Ie(Ue)
        }).raw = Ue, Uo.geo.albers = function() {
            return Uo.geo.conicEqualArea().rotate([96, 0]).center([-.6, 38.7]).parallels([29.5, 45.5]).scale(1070)
        }, Uo.geo.albersUsa = function() {
            function t(t) {
                var o = t[0],
                    u = t[1];
                return e = null, n(o, u), e || (r(o, u), e) || i(o, u), e
            }
            var e, n, r, i, o = Uo.geo.albers(),
                u = Uo.geo.conicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]),
                a = Uo.geo.conicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]),
                s = {
                    point: function(t, n) {
                        e = [t, n]
                    }
                };
            return t.invert = function(t) {
                var e = o.scale(),
                    n = o.translate(),
                    r = (t[0] - n[0]) / e,
                    i = (t[1] - n[1]) / e;
                return (i >= .12 && i < .234 && r >= -.425 && r < -.214 ? u : i >= .166 && i < .234 && r >= -.214 && r < -.115 ? a : o).invert(t)
            }, t.stream = function(t) {
                var e = o.stream(t),
                    n = u.stream(t),
                    r = a.stream(t);
                return {
                    point: function(t, i) {
                        e.point(t, i), n.point(t, i), r.point(t, i)
                    },
                    sphere: function() {
                        e.sphere(), n.sphere(), r.sphere()
                    },
                    lineStart: function() {
                        e.lineStart(), n.lineStart(), r.lineStart()
                    },
                    lineEnd: function() {
                        e.lineEnd(), n.lineEnd(), r.lineEnd()
                    },
                    polygonStart: function() {
                        e.polygonStart(), n.polygonStart(), r.polygonStart()
                    },
                    polygonEnd: function() {
                        e.polygonEnd(), n.polygonEnd(), r.polygonEnd()
                    }
                }
            }, t.precision = function(e) {
                return arguments.length ? (o.precision(e), u.precision(e), a.precision(e), t) : o.precision()
            }, t.scale = function(e) {
                return arguments.length ? (o.scale(e), u.scale(.35 * e), a.scale(e), t.translate(o.translate())) : o.scale()
            }, t.translate = function(e) {
                if (!arguments.length) return o.translate();
                var c = o.scale(),
                    l = +e[0],
                    f = +e[1];
                return n = o.translate(e).clipExtent([
                    [l - .455 * c, f - .238 * c],
                    [l + .455 * c, f + .238 * c]
                ]).stream(s).point, r = u.translate([l - .307 * c, f + .201 * c]).clipExtent([
                    [l - .425 * c + gu, f + .12 * c + gu],
                    [l - .214 * c - gu, f + .234 * c - gu]
                ]).stream(s).point, i = a.translate([l - .205 * c, f + .212 * c]).clipExtent([
                    [l - .214 * c + gu, f + .166 * c + gu],
                    [l - .115 * c - gu, f + .234 * c - gu]
                ]).stream(s).point, t
            }, t.scale(1070)
        };
        var ya, ma, xa, ba, wa, Ma, ka = {
                point: w,
                lineStart: w,
                lineEnd: w,
                polygonStart: function() {
                    ma = 0, ka.lineStart = We
                },
                polygonEnd: function() {
                    ka.lineStart = ka.lineEnd = ka.point = w, ya += Jo(ma / 2)
                }
            },
            Ea = {
                point: function(t, e) {
                    t < xa && (xa = t), t > wa && (wa = t), e < ba && (ba = e), e > Ma && (Ma = e)
                },
                lineStart: w,
                lineEnd: w,
                polygonStart: w,
                polygonEnd: w
            },
            Ca = {
                point: Ve,
                lineStart: Ye,
                lineEnd: Xe,
                polygonStart: function() {
                    Ca.lineStart = Ze
                },
                polygonEnd: function() {
                    Ca.point = Ve, Ca.lineStart = Ye, Ca.lineEnd = Xe
                }
            };
        Uo.geo.path = function() {
            function t(t) {
                return t && ("function" == typeof a && o.pointRadius(+a.apply(this, arguments)), u && u.valid || (u = i(o)), Uo.geo.stream(t, u)), o.result()
            }

            function e() {
                return u = null, t
            }
            var n, r, i, o, u, a = 4.5;
            return t.area = function(t) {
                return ya = 0, Uo.geo.stream(t, i(ka)), ya
            }, t.centroid = function(t) {
                return oa = ua = aa = sa = ca = la = fa = ha = pa = 0, Uo.geo.stream(t, i(Ca)), pa ? [fa / pa, ha / pa] : la ? [sa / la, ca / la] : aa ? [oa / aa, ua / aa] : [NaN, NaN]
            }, t.bounds = function(t) {
                return wa = Ma = -(xa = ba = 1 / 0), Uo.geo.stream(t, i(Ea)), [
                    [xa, ba],
                    [wa, Ma]
                ]
            }, t.projection = function(t) {
                return arguments.length ? (i = (n = t) ? t.stream || Je(t) : m, e()) : n
            }, t.context = function(t) {
                return arguments.length ? (o = null == (r = t) ? new Be : new Ge(t), "function" != typeof a && o.pointRadius(a), e()) : r
            }, t.pointRadius = function(e) {
                return arguments.length ? (a = "function" == typeof e ? e : (o.pointRadius(+e), +e), t) : a
            }, t.projection(Uo.geo.albersUsa()).context(null)
        }, Uo.geo.transform = function(t) {
            return {
                stream: function(e) {
                    var n = new Qe(e);
                    for (var r in t) n[r] = t[r];
                    return n
                }
            }
        }, Qe.prototype = {
            point: function(t, e) {
                this.stream.point(t, e)
            },
            sphere: function() {
                this.stream.sphere()
            },
            lineStart: function() {
                this.stream.lineStart()
            },
            lineEnd: function() {
                this.stream.lineEnd()
            },
            polygonStart: function() {
                this.stream.polygonStart()
            },
            polygonEnd: function() {
                this.stream.polygonEnd()
            }
        }, Uo.geo.projection = en, Uo.geo.projectionMutator = nn, (Uo.geo.equirectangular = function() {
            return en(on)
        }).raw = on.invert = on, Uo.geo.rotation = function(t) {
            function e(e) {
                return e = t(e[0] * wu, e[1] * wu), e[0] *= Mu, e[1] *= Mu, e
            }
            return t = an(t[0] % 360 * wu, t[1] * wu, t.length > 2 ? t[2] * wu : 0), e.invert = function(e) {
                return e = t.invert(e[0] * wu, e[1] * wu), e[0] *= Mu, e[1] *= Mu, e
            }, e
        }, un.invert = on, Uo.geo.circle = function() {
            function t() {
                var t = "function" == typeof r ? r.apply(this, arguments) : r,
                    e = an(-t[0] * wu, -t[1] * wu, 0).invert,
                    i = [];
                return n(null, null, 1, {
                    point: function(t, n) {
                        i.push(t = e(t, n)), t[0] *= Mu, t[1] *= Mu
                    }
                }), {
                    type: "Polygon",
                    coordinates: [i]
                }
            }
            var e, n, r = [0, 0],
                i = 6;
            return t.origin = function(e) {
                return arguments.length ? (r = e, t) : r
            }, t.angle = function(r) {
                return arguments.length ? (n = fn((e = +r) * wu, i * wu), t) : e
            }, t.precision = function(r) {
                return arguments.length ? (n = fn(e * wu, (i = +r) * wu), t) : i
            }, t.angle(90)
        }, Uo.geo.distance = function(t, e) {
            var n, r = (e[0] - t[0]) * wu,
                i = t[1] * wu,
                o = e[1] * wu,
                u = Math.sin(r),
                a = Math.cos(r),
                s = Math.sin(i),
                c = Math.cos(i),
                l = Math.sin(o),
                f = Math.cos(o);
            return Math.atan2(Math.sqrt((n = f * u) * n + (n = c * l - s * f * a) * n), s * l + c * f * a)
        }, Uo.geo.graticule = function() {
            function t() {
                return {
                    type: "MultiLineString",
                    coordinates: e()
                }
            }

            function e() {
                return Uo.range(Math.ceil(o / v) * v, i, v).map(h).concat(Uo.range(Math.ceil(c / y) * y, s, y).map(p)).concat(Uo.range(Math.ceil(r / d) * d, n, d).filter(function(t) {
                    return Jo(t % v) > gu
                }).map(l)).concat(Uo.range(Math.ceil(a / g) * g, u, g).filter(function(t) {
                    return Jo(t % y) > gu
                }).map(f))
            }
            var n, r, i, o, u, a, s, c, l, f, h, p, d = 10,
                g = d,
                v = 90,
                y = 360,
                m = 2.5;
            return t.lines = function() {
                return e().map(function(t) {
                    return {
                        type: "LineString",
                        coordinates: t
                    }
                })
            }, t.outline = function() {
                return {
                    type: "Polygon",
                    coordinates: [h(o).concat(p(s).slice(1), h(i).reverse().slice(1), p(c).reverse().slice(1))]
                }
            }, t.extent = function(e) {
                return arguments.length ? t.majorExtent(e).minorExtent(e) : t.minorExtent()
            }, t.majorExtent = function(e) {
                return arguments.length ? (o = +e[0][0], i = +e[1][0], c = +e[0][1], s = +e[1][1], o > i && (e = o, o = i, i = e), c > s && (e = c, c = s, s = e), t.precision(m)) : [
                    [o, c],
                    [i, s]
                ]
            }, t.minorExtent = function(e) {
                return arguments.length ? (r = +e[0][0], n = +e[1][0], a = +e[0][1], u = +e[1][1], r > n && (e = r, r = n, n = e), a > u && (e = a, a = u, u = e), t.precision(m)) : [
                    [r, a],
                    [n, u]
                ]
            }, t.step = function(e) {
                return arguments.length ? t.majorStep(e).minorStep(e) : t.minorStep()
            }, t.majorStep = function(e) {
                return arguments.length ? (v = +e[0], y = +e[1], t) : [v, y]
            }, t.minorStep = function(e) {
                return arguments.length ? (d = +e[0], g = +e[1], t) : [d, g]
            }, t.precision = function(e) {
                return arguments.length ? (m = +e, l = pn(a, u, 90), f = dn(r, n, m), h = pn(c, s, 90), p = dn(o, i, m), t) : m
            }, t.majorExtent([
                [-180, -90 + gu],
                [180, 90 - gu]
            ]).minorExtent([
                [-180, -80 - gu],
                [180, 80 + gu]
            ])
        }, Uo.geo.greatArc = function() {
            function t() {
                return {
                    type: "LineString",
                    coordinates: [e || r.apply(this, arguments), n || i.apply(this, arguments)]
                }
            }
            var e, n, r = gn,
                i = vn;
            return t.distance = function() {
                return Uo.geo.distance(e || r.apply(this, arguments), n || i.apply(this, arguments))
            },
                t.source = function(n) {
                    return arguments.length ? (r = n, e = "function" == typeof n ? null : n, t) : r
                }, t.target = function(e) {
                return arguments.length ? (i = e, n = "function" == typeof e ? null : e, t) : i
            }, t.precision = function() {
                return arguments.length ? t : 0
            }, t
        }, Uo.geo.interpolate = function(t, e) {
            return yn(t[0] * wu, t[1] * wu, e[0] * wu, e[1] * wu)
        }, Uo.geo.length = function(t) {
            return Ta = 0, Uo.geo.stream(t, Sa), Ta
        };
        var Ta, Sa = {
                sphere: w,
                point: w,
                lineStart: function() {
                    function t(t, i) {
                        var o = Math.sin(i *= wu),
                            u = Math.cos(i),
                            a = Jo((t *= wu) - e),
                            s = Math.cos(a);
                        Ta += Math.atan2(Math.sqrt((a = u * Math.sin(a)) * a + (a = r * o - n * u * s) * a), n * o + r * u * s), e = t, n = o, r = u
                    }
                    var e, n, r;
                    Sa.point = function(i, o) {
                        e = i * wu, n = Math.sin(o *= wu), r = Math.cos(o), Sa.point = t
                    }, Sa.lineEnd = function() {
                        Sa.point = Sa.lineEnd = w
                    }
                },
                lineEnd: w,
                polygonStart: w,
                polygonEnd: w
            },
            Na = mn(function(t) {
                return Math.sqrt(2 / (1 + t))
            }, function(t) {
                return 2 * Math.asin(t / 2)
            });
        (Uo.geo.azimuthalEqualArea = function() {
            return en(Na)
        }).raw = Na;
        var _a = mn(function(t) {
            var e = Math.acos(t);
            return e && e / Math.sin(e)
        }, m);
        (Uo.geo.azimuthalEquidistant = function() {
            return en(_a)
        }).raw = _a, (Uo.geo.conicConformal = function() {
            return Ie(xn)
        }).raw = xn, (Uo.geo.conicEquidistant = function() {
            return Ie(bn)
        }).raw = bn;
        var Aa = mn(function(t) {
            return 1 / t
        }, Math.atan);
        (Uo.geo.gnomonic = function() {
            return en(Aa)
        }).raw = Aa, wn.invert = function(t, e) {
            return [t, 2 * Math.atan(Math.exp(e)) - bu]
        }, (Uo.geo.mercator = function() {
            return Mn(wn)
        }).raw = wn;
        var La = mn(function() {
            return 1
        }, Math.asin);
        (Uo.geo.orthographic = function() {
            return en(La)
        }).raw = La;
        var Da = mn(function(t) {
            return 1 / (1 + t)
        }, function(t) {
            return 2 * Math.atan(t)
        });
        (Uo.geo.stereographic = function() {
            return en(Da)
        }).raw = Da, kn.invert = function(t, e) {
            return [-e, 2 * Math.atan(Math.exp(t)) - bu]
        }, (Uo.geo.transverseMercator = function() {
            var t = Mn(kn),
                e = t.center,
                n = t.rotate;
            return t.center = function(t) {
                return t ? e([-t[1], t[0]]) : (t = e(), [t[1], -t[0]])
            }, t.rotate = function(t) {
                return t ? n([t[0], t[1], t.length > 2 ? t[2] + 90 : 90]) : (t = n(), [t[0], t[1], t[2] - 90])
            }, n([0, 0, 90])
        }).raw = kn, Uo.geom = {}, Uo.geom.hull = function(t) {
            function e(t) {
                if (t.length < 3) return [];
                var e, i = Tt(n),
                    o = Tt(r),
                    u = t.length,
                    a = [],
                    s = [];
                for (e = 0; e < u; e++) a.push([+i.call(this, t[e], e), +o.call(this, t[e], e), e]);
                for (a.sort(Sn), e = 0; e < u; e++) s.push([a[e][0], -a[e][1]]);
                var c = Tn(a),
                    l = Tn(s),
                    f = l[0] === c[0],
                    h = l[l.length - 1] === c[c.length - 1],
                    p = [];
                for (e = c.length - 1; e >= 0; --e) p.push(t[a[c[e]][2]]);
                for (e = +f; e < l.length - h; ++e) p.push(t[a[l[e]][2]]);
                return p
            }
            var n = En,
                r = Cn;
            return arguments.length ? e(t) : (e.x = function(t) {
                return arguments.length ? (n = t, e) : n
            }, e.y = function(t) {
                return arguments.length ? (r = t, e) : r
            }, e)
        }, Uo.geom.polygon = function(t) {
            return ru(t, qa), t
        };
        var qa = Uo.geom.polygon.prototype = [];
        qa.area = function() {
            for (var t, e = -1, n = this.length, r = this[n - 1], i = 0; ++e < n;) t = r, r = this[e], i += t[1] * r[0] - t[0] * r[1];
            return .5 * i
        }, qa.centroid = function(t) {
            var e, n, r = -1,
                i = this.length,
                o = 0,
                u = 0,
                a = this[i - 1];
            for (arguments.length || (t = -1 / (6 * this.area())); ++r < i;) e = a, a = this[r], n = e[0] * a[1] - a[0] * e[1], o += (e[0] + a[0]) * n, u += (e[1] + a[1]) * n;
            return [o * t, u * t]
        }, qa.clip = function(t) {
            for (var e, n, r, i, o, u, a = An(t), s = -1, c = this.length - An(this), l = this[c - 1]; ++s < c;) {
                for (e = t.slice(), t.length = 0, i = this[s], o = e[(r = e.length - a) - 1], n = -1; ++n < r;) Nn(u = e[n], l, i) ? (Nn(o, l, i) || t.push(_n(o, u, l, i)), t.push(u)) : Nn(o, l, i) && t.push(_n(o, u, l, i)), o = u;
                a && t.push(t[0]), l = i
            }
            return t
        };
        var ja, Pa, Oa, Ra, Ha, Fa = [],
            za = [];
        Hn.prototype.prepare = function() {
            for (var t, e = this.edges, n = e.length; n--;)(t = e[n].edge).b && t.a || e.splice(n, 1);
            return e.sort(zn), e.length
        }, Gn.prototype = {
            start: function() {
                return this.edge.l === this.site ? this.edge.a : this.edge.b
            },
            end: function() {
                return this.edge.l === this.site ? this.edge.b : this.edge.a
            }
        }, Kn.prototype = {
            insert: function(t, e) {
                var n, r, i;
                if (t) {
                    if (e.P = t, e.N = t.N, t.N && (t.N.P = e), t.N = e, t.R) {
                        for (t = t.R; t.L;) t = t.L;
                        t.L = e
                    } else t.R = e;
                    n = t
                } else this._ ? (t = er(this._), e.P = null, e.N = t, t.P = t.L = e, n = t) : (e.P = e.N = null, this._ = e, n = null);
                for (e.L = e.R = null, e.U = n, e.C = !0, t = e; n && n.C;) n === (r = n.U).L ? (i = r.R) && i.C ? (n.C = i.C = !1, r.C = !0, t = r) : (t === n.R && (Qn(this, n), n = (t = n).U), n.C = !1, r.C = !0, tr(this, r)) : (i = r.L) && i.C ? (n.C = i.C = !1, r.C = !0, t = r) : (t === n.L && (tr(this, n), n = (t = n).U), n.C = !1, r.C = !0, Qn(this, r)), n = t.U;
                this._.C = !1
            },
            remove: function(t) {
                t.N && (t.N.P = t.P), t.P && (t.P.N = t.N), t.N = t.P = null;
                var e, n, r, i = t.U,
                    o = t.L,
                    u = t.R;
                if (n = o ? u ? er(u) : o : u, i ? i.L === t ? i.L = n : i.R = n : this._ = n, o && u ? (r = n.C, n.C = t.C, n.L = o, o.U = n, n !== u ? (i = n.U, n.U = t.U, t = n.R, i.L = t, n.R = u, u.U = n) : (n.U = i, i = n, t = n.R)) : (r = t.C, t = n), t && (t.U = i), !r)
                    if (t && t.C) t.C = !1;
                    else {
                        do {
                            if (t === this._) break;
                            if (t === i.L) {
                                if ((e = i.R).C && (e.C = !1, i.C = !0, Qn(this, i), e = i.R), e.L && e.L.C || e.R && e.R.C) {
                                    e.R && e.R.C || (e.L.C = !1, e.C = !0, tr(this, e), e = i.R), e.C = i.C, i.C = e.R.C = !1, Qn(this, i), t = this._;
                                    break
                                }
                            } else if ((e = i.L).C && (e.C = !1, i.C = !0, tr(this, i), e = i.L), e.L && e.L.C || e.R && e.R.C) {
                                e.L && e.L.C || (e.R.C = !1, e.C = !0, Qn(this, e), e = i.L), e.C = i.C, i.C = e.L.C = !1, tr(this, i), t = this._;
                                break
                            }
                            e.C = !0, t = i, i = i.U
                        } while (!t.C);
                        t && (t.C = !1)
                    }
            }
        }, Uo.geom.voronoi = function(t) {
            function e(t) {
                var e = new Array(t.length),
                    r = a[0][0],
                    i = a[0][1],
                    o = a[1][0],
                    u = a[1][1];
                return nr(n(t), a).cells.forEach(function(n, a) {
                    var s = n.edges,
                        c = n.site;
                    (e[a] = s.length ? s.map(function(t) {
                        var e = t.start();
                        return [e.x, e.y]
                    }) : c.x >= r && c.x <= o && c.y >= i && c.y <= u ? [
                        [r, u],
                        [o, u],
                        [o, i],
                        [r, i]
                    ] : []).point = t[a]
                }), e
            }

            function n(t) {
                return t.map(function(t, e) {
                    return {
                        x: Math.round(o(t, e) / gu) * gu,
                        y: Math.round(u(t, e) / gu) * gu,
                        i: e
                    }
                })
            }
            var r = En,
                i = Cn,
                o = r,
                u = i,
                a = Ia;
            return t ? e(t) : (e.links = function(t) {
                return nr(n(t)).edges.filter(function(t) {
                    return t.l && t.r
                }).map(function(e) {
                    return {
                        source: t[e.l.i],
                        target: t[e.r.i]
                    }
                })
            }, e.triangles = function(t) {
                var e = [];
                return nr(n(t)).cells.forEach(function(n, r) {
                    for (var i, o = n.site, u = n.edges.sort(zn), a = -1, s = u.length, c = u[s - 1].edge, l = c.l === o ? c.r : c.l; ++a < s;) i = l, l = (c = u[a].edge).l === o ? c.r : c.l, r < i.i && r < l.i && ir(o, i, l) < 0 && e.push([t[r], t[i.i], t[l.i]])
                }), e
            }, e.x = function(t) {
                return arguments.length ? (o = Tt(r = t), e) : r
            }, e.y = function(t) {
                return arguments.length ? (u = Tt(i = t), e) : i
            }, e.clipExtent = function(t) {
                return arguments.length ? (a = null == t ? Ia : t, e) : a === Ia ? null : a
            }, e.size = function(t) {
                return arguments.length ? e.clipExtent(t && [
                    [0, 0], t
                ]) : a === Ia ? null : a && a[1]
            }, e)
        };
        var Ia = [
            [-1e6, -1e6],
            [1e6, 1e6]
        ];
        Uo.geom.delaunay = function(t) {
            return Uo.geom.voronoi().triangles(t)
        }, Uo.geom.quadtree = function(t, e, n, r, i) {
            function o(t) {
                function o(t, e, n, r, i, o, u, a) {
                    if (!isNaN(n) && !isNaN(r))
                        if (t.leaf) {
                            var s = t.x,
                                l = t.y;
                            if (null != s)
                                if (Jo(s - n) + Jo(l - r) < .01) c(t, e, n, r, i, o, u, a);
                                else {
                                    var f = t.point;
                                    t.x = t.y = t.point = null, c(t, f, s, l, i, o, u, a), c(t, e, n, r, i, o, u, a)
                                }
                            else t.x = n, t.y = r, t.point = e
                        } else c(t, e, n, r, i, o, u, a)
                }

                function c(t, e, n, r, i, u, a, s) {
                    var c = .5 * (i + a),
                        l = .5 * (u + s),
                        f = n >= c,
                        h = r >= l,
                        p = h << 1 | f;
                    t.leaf = !1, t = t.nodes[p] || (t.nodes[p] = {
                        leaf: !0,
                        nodes: [],
                        point: null,
                        x: null,
                        y: null
                    }), f ? i = c : a = c, h ? u = l : s = l, o(t, e, n, r, i, u, a, s)
                }
                var l, f, h, p, d, g, v, y, m, x = Tt(a),
                    b = Tt(s);
                if (null != e) g = e, v = n, y = r, m = i;
                else if (y = m = -(g = v = 1 / 0), f = [], h = [], d = t.length, u)
                    for (p = 0; p < d; ++p)(l = t[p]).x < g && (g = l.x), l.y < v && (v = l.y), l.x > y && (y = l.x), l.y > m && (m = l.y), f.push(l.x), h.push(l.y);
                else
                    for (p = 0; p < d; ++p) {
                        var w = +x(l = t[p], p),
                            M = +b(l, p);
                        w < g && (g = w), M < v && (v = M), w > y && (y = w), M > m && (m = M), f.push(w), h.push(M)
                    }
                var k = y - g,
                    E = m - v;
                k > E ? m = v + k : y = g + E;
                var C = {
                    leaf: !0,
                    nodes: [],
                    point: null,
                    x: null,
                    y: null
                };
                if (C.add = function(t) {
                        o(C, t, +x(t, ++p), +b(t, p), g, v, y, m)
                    }, C.visit = function(t) {
                        ar(t, C, g, v, y, m)
                    }, C.find = function(t) {
                        return sr(C, t[0], t[1], g, v, y, m)
                    }, p = -1, null == e) {
                    for (; ++p < d;) o(C, t[p], f[p], h[p], g, v, y, m);
                    --p
                } else t.forEach(C.add);
                return f = h = t = l = null, C
            }
            var u, a = En,
                s = Cn;
            return (u = arguments.length) ? (a = or, s = ur, 3 === u && (i = n, r = e, n = e = 0), o(t)) : (o.x = function(t) {
                return arguments.length ? (a = t, o) : a
            }, o.y = function(t) {
                return arguments.length ? (s = t, o) : s
            }, o.extent = function(t) {
                return arguments.length ? (null == t ? e = n = r = i = null : (e = +t[0][0], n = +t[0][1], r = +t[1][0], i = +t[1][1]), o) : null == e ? null : [
                    [e, n],
                    [r, i]
                ]
            }, o.size = function(t) {
                return arguments.length ? (null == t ? e = n = r = i = null : (e = n = 0, r = +t[0], i = +t[1]), o) : null == e ? null : [r - e, i - n]
            }, o)
        }, Uo.interpolateRgb = cr, Uo.interpolateObject = lr, Uo.interpolateNumber = fr, Uo.interpolateString = hr;
        var Ua = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
            Wa = new RegExp(Ua.source, "g");
        Uo.interpolate = pr, Uo.interpolators = [function(t, e) {
            var n = typeof e;
            return ("string" === n ? Pu.has(e.toLowerCase()) || /^(#|rgb\(|hsl\()/i.test(e) ? cr : hr : e instanceof ut ? cr : Array.isArray(e) ? dr : "object" === n && isNaN(e) ? lr : fr)(t, e)
        }], Uo.interpolateArray = dr;
        var Ba = function() {
                return m
            },
            $a = Uo.map({
                linear: Ba,
                poly: function(t) {
                    return function(e) {
                        return Math.pow(e, t)
                    }
                },
                quad: function() {
                    return mr
                },
                cubic: function() {
                    return xr
                },
                sin: function() {
                    return wr
                },
                exp: function() {
                    return Mr
                },
                circle: function() {
                    return kr
                },
                elastic: function(t, e) {
                    var n;
                    return arguments.length < 2 && (e = .45), arguments.length ? n = e / mu * Math.asin(1 / t) : (t = 1, n = e / 4),
                        function(r) {
                            return 1 + t * Math.pow(2, -10 * r) * Math.sin((r - n) * mu / e)
                        }
                },
                back: function(t) {
                    return t || (t = 1.70158),
                        function(e) {
                            return e * e * ((t + 1) * e - t)
                        }
                },
                bounce: function() {
                    return Er
                }
            }),
            Va = Uo.map({ in: m,
                out: vr,
                "in-out": yr,
                "out-in": function(t) {
                    return yr(vr(t))
                }
            });
        Uo.ease = function(t) {
            var e = t.indexOf("-"),
                n = e >= 0 ? t.slice(0, e) : t,
                r = e >= 0 ? t.slice(e + 1) : "in";
            return n = $a.get(n) || Ba, r = Va.get(r) || m, gr(r(n.apply(null, Wo.call(arguments, 1))))
        }, Uo.interpolateHcl = function(t, e) {
            t = Uo.hcl(t), e = Uo.hcl(e);
            var n = t.h,
                r = t.c,
                i = t.l,
                o = e.h - n,
                u = e.c - r,
                a = e.l - i;
            return isNaN(u) && (u = 0, r = isNaN(r) ? e.c : r), isNaN(o) ? (o = 0, n = isNaN(n) ? e.h : n) : o > 180 ? o -= 360 : o < -180 && (o += 360),
                function(t) {
                    return lt(n + o * t, r + u * t, i + a * t) + ""
                }
        }, Uo.interpolateHsl = function(t, e) {
            t = Uo.hsl(t), e = Uo.hsl(e);
            var n = t.h,
                r = t.s,
                i = t.l,
                o = e.h - n,
                u = e.s - r,
                a = e.l - i;
            return isNaN(u) && (u = 0, r = isNaN(r) ? e.s : r), isNaN(o) ? (o = 0, n = isNaN(n) ? e.h : n) : o > 180 ? o -= 360 : o < -180 && (o += 360),
                function(t) {
                    return st(n + o * t, r + u * t, i + a * t) + ""
                }
        }, Uo.interpolateLab = function(t, e) {
            t = Uo.lab(t), e = Uo.lab(e);
            var n = t.l,
                r = t.a,
                i = t.b,
                o = e.l - n,
                u = e.a - r,
                a = e.b - i;
            return function(t) {
                return ht(n + o * t, r + u * t, i + a * t) + ""
            }
        }, Uo.interpolateRound = Cr, Uo.transform = function(t) {
            var e = $o.createElementNS(Uo.ns.prefix.svg, "g");
            return (Uo.transform = function(t) {
                if (null != t) {
                    e.setAttribute("transform", t);
                    var n = e.transform.baseVal.consolidate()
                }
                return new Tr(n ? n.matrix : Ya)
            })(t)
        }, Tr.prototype.toString = function() {
            return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")"
        };
        var Ya = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: 0,
            f: 0
        };
        Uo.interpolateTransform = Pr, Uo.layout = {}, Uo.layout.bundle = function() {
            return function(t) {
                for (var e = [], n = -1, r = t.length; ++n < r;) e.push(Hr(t[n]));
                return e
            }
        }, Uo.layout.chord = function() {
            function t() {
                var t, c, f, h, p, d = {},
                    g = [],
                    v = Uo.range(o),
                    y = [];
                for (n = [], r = [], t = 0, h = -1; ++h < o;) {
                    for (c = 0, p = -1; ++p < o;) c += i[h][p];
                    g.push(c), y.push(Uo.range(o)), t += c
                }
                for (u && v.sort(function(t, e) {
                    return u(g[t], g[e])
                }), a && y.forEach(function(t, e) {
                    t.sort(function(t, n) {
                        return a(i[e][t], i[e][n])
                    })
                }), t = (mu - l * o) / t, c = 0, h = -1; ++h < o;) {
                    for (f = c, p = -1; ++p < o;) {
                        var m = v[h],
                            x = y[m][p],
                            b = i[m][x],
                            w = c,
                            M = c += b * t;
                        d[m + "-" + x] = {
                            index: m,
                            subindex: x,
                            startAngle: w,
                            endAngle: M,
                            value: b
                        }
                    }
                    r[m] = {
                        index: m,
                        startAngle: f,
                        endAngle: c,
                        value: g[m]
                    }, c += l
                }
                for (h = -1; ++h < o;)
                    for (p = h - 1; ++p < o;) {
                        var k = d[h + "-" + p],
                            E = d[p + "-" + h];
                        (k.value || E.value) && n.push(k.value < E.value ? {
                            source: E,
                            target: k
                        } : {
                            source: k,
                            target: E
                        })
                    }
                s && e()
            }

            function e() {
                n.sort(function(t, e) {
                    return s((t.source.value + t.target.value) / 2, (e.source.value + e.target.value) / 2)
                })
            }
            var n, r, i, o, u, a, s, c = {},
                l = 0;
            return c.matrix = function(t) {
                return arguments.length ? (o = (i = t) && i.length, n = r = null, c) : i
            }, c.padding = function(t) {
                return arguments.length ? (l = t, n = r = null, c) : l
            }, c.sortGroups = function(t) {
                return arguments.length ? (u = t, n = r = null, c) : u
            }, c.sortSubgroups = function(t) {
                return arguments.length ? (a = t, n = null, c) : a
            }, c.sortChords = function(t) {
                return arguments.length ? (s = t, n && e(), c) : s
            }, c.chords = function() {
                return n || t(), n
            }, c.groups = function() {
                return r || t(), r
            }, c
        }, Uo.layout.force = function() {
            function t(t) {
                return function(e, n, r, i) {
                    if (e.point !== t) {
                        var o = e.cx - t.x,
                            u = e.cy - t.y,
                            a = i - n,
                            s = o * o + u * u;
                        if (a * a / y < s) return s < g && (c = e.charge / s, t.px -= o * c, t.py -= u * c), !0;
                        if (e.point && s && s < g) {
                            var c = e.pointCharge / s;
                            t.px -= o * c, t.py -= u * c
                        }
                    }
                    return !e.charge
                }
            }

            function e(t) {
                t.px = Uo.event.x, t.py = Uo.event.y, s.resume()
            }
            var n, r, i, o, u, a, s = {},
                c = Uo.dispatch("start", "tick", "end"),
                l = [1, 1],
                f = .9,
                h = Xa,
                p = Za,
                d = -30,
                g = Ga,
                v = .1,
                y = .64,
                x = [],
                b = [];
            return s.tick = function() {
                if ((i *= .99) < .005) return n = null, c.end({
                    type: "end",
                    alpha: i = 0
                }), !0;
                var e, r, s, h, p, g, y, m, w, M = x.length,
                    k = b.length;
                for (r = 0; r < k; ++r) h = (s = b[r]).source, (g = (m = (p = s.target).x - h.x) * m + (w = p.y - h.y) * w) && (m *= g = i * u[r] * ((g = Math.sqrt(g)) - o[r]) / g, w *= g, p.x -= m * (y = h.weight + p.weight ? h.weight / (h.weight + p.weight) : .5), p.y -= w * y, h.x += m * (y = 1 - y), h.y += w * y);
                if ((y = i * v) && (m = l[0] / 2, w = l[1] / 2, r = -1, y))
                    for (; ++r < M;)(s = x[r]).x += (m - s.x) * y, s.y += (w - s.y) * y;
                if (d)
                    for ($r(e = Uo.geom.quadtree(x), i, a), r = -1; ++r < M;)(s = x[r]).fixed || e.visit(t(s));
                for (r = -1; ++r < M;)(s = x[r]).fixed ? (s.x = s.px, s.y = s.py) : (s.x -= (s.px - (s.px = s.x)) * f, s.y -= (s.py - (s.py = s.y)) * f);
                c.tick({
                    type: "tick",
                    alpha: i
                })
            }, s.nodes = function(t) {
                return arguments.length ? (x = t, s) : x
            }, s.links = function(t) {
                return arguments.length ? (b = t, s) : b
            }, s.size = function(t) {
                return arguments.length ? (l = t, s) : l
            }, s.linkDistance = function(t) {
                return arguments.length ? (h = "function" == typeof t ? t : +t, s) : h
            }, s.distance = s.linkDistance, s.linkStrength = function(t) {
                return arguments.length ? (p = "function" == typeof t ? t : +t, s) : p
            }, s.friction = function(t) {
                return arguments.length ? (f = +t, s) : f
            }, s.charge = function(t) {
                return arguments.length ? (d = "function" == typeof t ? t : +t, s) : d
            }, s.chargeDistance = function(t) {
                return arguments.length ? (g = t * t, s) : Math.sqrt(g)
            }, s.gravity = function(t) {
                return arguments.length ? (v = +t, s) : v
            }, s.theta = function(t) {
                return arguments.length ? (y = t * t, s) : Math.sqrt(y)
            }, s.alpha = function(t) {
                return arguments.length ? (t = +t, i ? t > 0 ? i = t : (n.c = null, n.t = NaN, n = null, c.end({
                    type: "end",
                    alpha: i = 0
                })) : t > 0 && (c.start({
                    type: "start",
                    alpha: i = t
                }), n = Lt(s.tick)), s) : i
            }, s.start = function() {
                function t(t, r) {
                    if (!n) {
                        for (n = new Array(i), s = 0; s < i; ++s) n[s] = [];
                        for (s = 0; s < c; ++s) {
                            var o = b[s];
                            n[o.source.index].push(o.target), n[o.target.index].push(o.source)
                        }
                    }
                    for (var u, a = n[e], s = -1, l = a.length; ++s < l;)
                        if (!isNaN(u = a[s][t])) return u;
                    return Math.random() * r
                }
                var e, n, r, i = x.length,
                    c = b.length,
                    f = l[0],
                    g = l[1];
                for (e = 0; e < i; ++e)(r = x[e]).index = e, r.weight = 0;
                for (e = 0; e < c; ++e) "number" == typeof(r = b[e]).source && (r.source = x[r.source]), "number" == typeof r.target && (r.target = x[r.target]), ++r.source.weight, ++r.target.weight;
                for (e = 0; e < i; ++e) r = x[e], isNaN(r.x) && (r.x = t("x", f)), isNaN(r.y) && (r.y = t("y", g)), isNaN(r.px) && (r.px = r.x), isNaN(r.py) && (r.py = r.y);
                if (o = [], "function" == typeof h)
                    for (e = 0; e < c; ++e) o[e] = +h.call(this, b[e], e);
                else
                    for (e = 0; e < c; ++e) o[e] = h;
                if (u = [], "function" == typeof p)
                    for (e = 0; e < c; ++e) u[e] = +p.call(this, b[e], e);
                else
                    for (e = 0; e < c; ++e) u[e] = p;
                if (a = [], "function" == typeof d)
                    for (e = 0; e < i; ++e) a[e] = +d.call(this, x[e], e);
                else
                    for (e = 0; e < i; ++e) a[e] = d;
                return s.resume()
            }, s.resume = function() {
                return s.alpha(.1)
            }, s.stop = function() {
                return s.alpha(0)
            }, s.drag = function() {
                if (r || (r = Uo.behavior.drag().origin(m).on("dragstart.force", Ir).on("drag.force", e).on("dragend.force", Ur)), !arguments.length) return r;
                this.on("mouseover.force", Wr).on("mouseout.force", Br).call(r)
            }, Uo.rebind(s, c, "on")
        };
        var Xa = 20,
            Za = 1,
            Ga = 1 / 0;
        Uo.layout.hierarchy = function() {
            function t(i) {
                var o, u = [i],
                    a = [];
                for (i.depth = 0; null != (o = u.pop());)
                    if (a.push(o), (c = n.call(t, o, o.depth)) && (s = c.length)) {
                        for (var s, c, l; --s >= 0;) u.push(l = c[s]), l.parent = o, l.depth = o.depth + 1;
                        r && (o.value = 0), o.children = c
                    } else r && (o.value = +r.call(t, o, o.depth) || 0), delete o.children;
                return Xr(i, function(t) {
                    var n, i;
                    e && (n = t.children) && n.sort(e), r && (i = t.parent) && (i.value += t.value)
                }), a
            }
            var e = Kr,
                n = Zr,
                r = Gr;
            return t.sort = function(n) {
                return arguments.length ? (e = n, t) : e
            }, t.children = function(e) {
                return arguments.length ? (n = e, t) : n
            }, t.value = function(e) {
                return arguments.length ? (r = e, t) : r
            }, t.revalue = function(e) {
                return r && (Yr(e, function(t) {
                    t.children && (t.value = 0)
                }), Xr(e, function(e) {
                    var n;
                    e.children || (e.value = +r.call(t, e, e.depth) || 0), (n = e.parent) && (n.value += e.value)
                })), e
            }, t
        }, Uo.layout.partition = function() {
            function t(e, n, r, i) {
                var o = e.children;
                if (e.x = n, e.y = e.depth * i, e.dx = r, e.dy = i, o && (u = o.length)) {
                    var u, a, s, c = -1;
                    for (r = e.value ? r / e.value : 0; ++c < u;) t(a = o[c], n, s = a.value * r, i), n += s
                }
            }

            function e(t) {
                var n = t.children,
                    r = 0;
                if (n && (i = n.length))
                    for (var i, o = -1; ++o < i;) r = Math.max(r, e(n[o]));
                return 1 + r
            }

            function n(n, o) {
                var u = r.call(this, n, o);
                return t(u[0], 0, i[0], i[1] / e(u[0])), u
            }
            var r = Uo.layout.hierarchy(),
                i = [1, 1];
            return n.size = function(t) {
                return arguments.length ? (i = t, n) : i
            }, Vr(n, r)
        }, Uo.layout.pie = function() {
            function t(u) {
                var a, s = u.length,
                    c = u.map(function(n, r) {
                        return +e.call(t, n, r)
                    }),
                    l = +("function" == typeof r ? r.apply(this, arguments) : r),
                    f = ("function" == typeof i ? i.apply(this, arguments) : i) - l,
                    h = Math.min(Math.abs(f) / s, +("function" == typeof o ? o.apply(this, arguments) : o)),
                    p = h * (f < 0 ? -1 : 1),
                    d = Uo.sum(c),
                    g = d ? (f - s * p) / d : 0,
                    v = Uo.range(s),
                    y = [];
                return null != n && v.sort(n === Ka ? function(t, e) {
                    return c[e] - c[t]
                } : function(t, e) {
                    return n(u[t], u[e])
                }), v.forEach(function(t) {
                    y[t] = {
                        data: u[t],
                        value: a = c[t],
                        startAngle: l,
                        endAngle: l += a * g + p,
                        padAngle: h
                    }
                }), y
            }
            var e = Number,
                n = Ka,
                r = 0,
                i = mu,
                o = 0;
            return t.value = function(n) {
                return arguments.length ? (e = n, t) : e
            }, t.sort = function(e) {
                return arguments.length ? (n = e, t) : n
            }, t.startAngle = function(e) {
                return arguments.length ? (r = e, t) : r
            }, t.endAngle = function(e) {
                return arguments.length ? (i = e, t) : i
            }, t.padAngle = function(e) {
                return arguments.length ? (o = e, t) : o
            }, t
        };
        var Ka = {};
        Uo.layout.stack = function() {
            function t(a, s) {
                if (!(h = a.length)) return a;
                var c = a.map(function(n, r) {
                        return e.call(t, n, r)
                    }),
                    l = c.map(function(e) {
                        return e.map(function(e, n) {
                            return [o.call(t, e, n), u.call(t, e, n)]
                        })
                    }),
                    f = n.call(t, l, s);
                c = Uo.permute(c, f), l = Uo.permute(l, f);
                var h, p, d, g, v = r.call(t, l, s),
                    y = c[0].length;
                for (d = 0; d < y; ++d)
                    for (i.call(t, c[0][d], g = v[d], l[0][d][1]), p = 1; p < h; ++p) i.call(t, c[p][d], g += l[p - 1][d][1], l[p][d][1]);
                return a
            }
            var e = m,
                n = ni,
                r = ri,
                i = ei,
                o = Qr,
                u = ti;
            return t.values = function(n) {
                return arguments.length ? (e = n, t) : e
            }, t.order = function(e) {
                return arguments.length ? (n = "function" == typeof e ? e : Ja.get(e) || ni, t) : n
            }, t.offset = function(e) {
                return arguments.length ? (r = "function" == typeof e ? e : Qa.get(e) || ri, t) : r
            }, t.x = function(e) {
                return arguments.length ? (o = e, t) : o
            }, t.y = function(e) {
                return arguments.length ? (u = e, t) : u
            }, t.out = function(e) {
                return arguments.length ? (i = e, t) : i
            }, t
        };
        var Ja = Uo.map({
                "inside-out": function(t) {
                    var e, n, r = t.length,
                        i = t.map(ii),
                        o = t.map(oi),
                        u = Uo.range(r).sort(function(t, e) {
                            return i[t] - i[e]
                        }),
                        a = 0,
                        s = 0,
                        c = [],
                        l = [];
                    for (e = 0; e < r; ++e) n = u[e], a < s ? (a += o[n], c.push(n)) : (s += o[n], l.push(n));
                    return l.reverse().concat(c)
                },
                reverse: function(t) {
                    return Uo.range(t.length).reverse()
                },
                default: ni
            }),
            Qa = Uo.map({
                silhouette: function(t) {
                    var e, n, r, i = t.length,
                        o = t[0].length,
                        u = [],
                        a = 0,
                        s = [];
                    for (n = 0; n < o; ++n) {
                        for (e = 0, r = 0; e < i; e++) r += t[e][n][1];
                        r > a && (a = r), u.push(r)
                    }
                    for (n = 0; n < o; ++n) s[n] = (a - u[n]) / 2;
                    return s
                },
                wiggle: function(t) {
                    var e, n, r, i, o, u, a, s, c, l = t.length,
                        f = t[0],
                        h = f.length,
                        p = [];
                    for (p[0] = s = c = 0, n = 1; n < h; ++n) {
                        for (e = 0, i = 0; e < l; ++e) i += t[e][n][1];
                        for (e = 0, o = 0, a = f[n][0] - f[n - 1][0]; e < l; ++e) {
                            for (r = 0, u = (t[e][n][1] - t[e][n - 1][1]) / (2 * a); r < e; ++r) u += (t[r][n][1] - t[r][n - 1][1]) / a;
                            o += u * t[e][n][1]
                        }
                        p[n] = s -= i ? o / i * a : 0, s < c && (c = s)
                    }
                    for (n = 0; n < h; ++n) p[n] -= c;
                    return p
                },
                expand: function(t) {
                    var e, n, r, i = t.length,
                        o = t[0].length,
                        u = 1 / i,
                        a = [];
                    for (n = 0; n < o; ++n) {
                        for (e = 0, r = 0; e < i; e++) r += t[e][n][1];
                        if (r)
                            for (e = 0; e < i; e++) t[e][n][1] /= r;
                        else
                            for (e = 0; e < i; e++) t[e][n][1] = u
                    }
                    for (n = 0; n < o; ++n) a[n] = 0;
                    return a
                },
                zero: ri
            });
        Uo.layout.histogram = function() {
            function t(t, o) {
                for (var u, a, s = [], c = t.map(n, this), l = r.call(this, c, o), f = i.call(this, l, c, o), o = -1, h = c.length, p = f.length - 1, d = e ? 1 : 1 / h; ++o < p;)(u = s[o] = []).dx = f[o + 1] - (u.x = f[o]), u.y = 0;
                if (p > 0)
                    for (o = -1; ++o < h;)(a = c[o]) >= l[0] && a <= l[1] && ((u = s[Uo.bisect(f, a, 1, p) - 1]).y += d, u.push(t[o]));
                return s
            }
            var e = !0,
                n = Number,
                r = ci,
                i = ai;
            return t.value = function(e) {
                return arguments.length ? (n = e, t) : n
            }, t.range = function(e) {
                return arguments.length ? (r = Tt(e), t) : r
            }, t.bins = function(e) {
                return arguments.length ? (i = "number" == typeof e ? function(t) {
                    return si(t, e)
                } : Tt(e), t) : i
            }, t.frequency = function(n) {
                return arguments.length ? (e = !!n, t) : e
            }, t
        }, Uo.layout.pack = function() {
            function t(t, o) {
                var u = n.call(this, t, o),
                    a = u[0],
                    s = i[0],
                    c = i[1],
                    l = null == e ? Math.sqrt : "function" == typeof e ? e : function() {
                        return e
                    };
                if (a.x = a.y = 0, Xr(a, function(t) {
                        t.r = +l(t.value)
                    }), Xr(a, di), r) {
                    var f = r * (e ? 1 : Math.max(2 * a.r / s, 2 * a.r / c)) / 2;
                    Xr(a, function(t) {
                        t.r += f
                    }), Xr(a, di), Xr(a, function(t) {
                        t.r -= f
                    })
                }
                return yi(a, s / 2, c / 2, e ? 1 : 1 / Math.max(2 * a.r / s, 2 * a.r / c)), u
            }
            var e, n = Uo.layout.hierarchy().sort(li),
                r = 0,
                i = [1, 1];
            return t.size = function(e) {
                return arguments.length ? (i = e, t) : i
            }, t.radius = function(n) {
                return arguments.length ? (e = null == n || "function" == typeof n ? n : +n, t) : e
            }, t.padding = function(e) {
                return arguments.length ? (r = +e, t) : r
            }, Vr(t, n)
        }, Uo.layout.tree = function() {
            function t(t, i) {
                var l = u.call(this, t, i),
                    f = l[0],
                    h = e(f);
                if (Xr(h, n), h.parent.m = -h.z, Yr(h, r), c) Yr(f, o);
                else {
                    var p = f,
                        d = f,
                        g = f;
                    Yr(f, function(t) {
                        t.x < p.x && (p = t), t.x > d.x && (d = t), t.depth > g.depth && (g = t)
                    });
                    var v = a(p, d) / 2 - p.x,
                        y = s[0] / (d.x + a(d, p) / 2 + v),
                        m = s[1] / (g.depth || 1);
                    Yr(f, function(t) {
                        t.x = (t.x + v) * y, t.y = t.depth * m
                    })
                }
                return l
            }

            function e(t) {
                for (var e, n = {
                    A: null,
                    children: [t]
                }, r = [n]; null != (e = r.pop());)
                    for (var i, o = e.children, u = 0, a = o.length; u < a; ++u) r.push((o[u] = i = {
                        _: o[u],
                        parent: e,
                        children: (i = o[u].children) && i.slice() || [],
                        A: null,
                        a: null,
                        z: 0,
                        m: 0,
                        c: 0,
                        s: 0,
                        t: null,
                        i: u
                    }).a = i);
                return n.children[0]
            }

            function n(t) {
                var e = t.children,
                    n = t.parent.children,
                    r = t.i ? n[t.i - 1] : null;
                if (e.length) {
                    ki(t);
                    var o = (e[0].z + e[e.length - 1].z) / 2;
                    r ? (t.z = r.z + a(t._, r._), t.m = t.z - o) : t.z = o
                } else r && (t.z = r.z + a(t._, r._));
                t.parent.A = i(t, r, t.parent.A || n[0])
            }

            function r(t) {
                t._.x = t.z + t.parent.m, t.m += t.parent.m
            }

            function i(t, e, n) {
                if (e) {
                    for (var r, i = t, o = t, u = e, s = i.parent.children[0], c = i.m, l = o.m, f = u.m, h = s.m; u = wi(u), i = bi(i), u && i;) s = bi(s), (o = wi(o)).a = t, (r = u.z + f - i.z - c + a(u._, i._)) > 0 && (Mi(Ei(u, t, n), t, r), c += r, l += r), f += u.m, c += i.m, h += s.m, l += o.m;
                    u && !wi(o) && (o.t = u, o.m += f - l), i && !bi(s) && (s.t = i, s.m += c - h, n = t)
                }
                return n
            }

            function o(t) {
                t.x *= s[0], t.y = t.depth * s[1]
            }
            var u = Uo.layout.hierarchy().sort(null).value(null),
                a = xi,
                s = [1, 1],
                c = null;
            return t.separation = function(e) {
                return arguments.length ? (a = e, t) : a
            }, t.size = function(e) {
                return arguments.length ? (c = null == (s = e) ? o : null, t) : c ? null : s
            }, t.nodeSize = function(e) {
                return arguments.length ? (c = null == (s = e) ? null : o, t) : c ? s : null
            }, Vr(t, u)
        }, Uo.layout.cluster = function() {
            function t(t, o) {
                var u, a = e.call(this, t, o),
                    s = a[0],
                    c = 0;
                Xr(s, function(t) {
                    var e = t.children;
                    e && e.length ? (t.x = Ti(e), t.y = Ci(e)) : (t.x = u ? c += n(t, u) : 0, t.y = 0, u = t)
                });
                var l = Si(s),
                    f = Ni(s),
                    h = l.x - n(l, f) / 2,
                    p = f.x + n(f, l) / 2;
                return Xr(s, i ? function(t) {
                    t.x = (t.x - s.x) * r[0], t.y = (s.y - t.y) * r[1]
                } : function(t) {
                    t.x = (t.x - h) / (p - h) * r[0], t.y = (1 - (s.y ? t.y / s.y : 1)) * r[1]
                }), a
            }
            var e = Uo.layout.hierarchy().sort(null).value(null),
                n = xi,
                r = [1, 1],
                i = !1;
            return t.separation = function(e) {
                return arguments.length ? (n = e, t) : n
            }, t.size = function(e) {
                return arguments.length ? (i = null == (r = e), t) : i ? null : r
            }, t.nodeSize = function(e) {
                return arguments.length ? (i = null != (r = e), t) : i ? r : null
            }, Vr(t, e)
        }, Uo.layout.treemap = function() {
            function t(t, e) {
                for (var n, r, i = -1, o = t.length; ++i < o;) r = (n = t[i]).value * (e < 0 ? 0 : e), n.area = isNaN(r) || r <= 0 ? 0 : r
            }

            function e(n) {
                var o = n.children;
                if (o && o.length) {
                    var u, a, s, c = f(n),
                        l = [],
                        h = o.slice(),
                        d = 1 / 0,
                        g = "slice" === p ? c.dx : "dice" === p ? c.dy : "slice-dice" === p ? 1 & n.depth ? c.dy : c.dx : Math.min(c.dx, c.dy);
                    for (t(h, c.dx * c.dy / n.value), l.area = 0;
                         (s = h.length) > 0;) l.push(u = h[s - 1]), l.area += u.area, "squarify" !== p || (a = r(l, g)) <= d ? (h.pop(), d = a) : (l.area -= l.pop().area, i(l, g, c, !1), g = Math.min(c.dx, c.dy), l.length = l.area = 0, d = 1 / 0);
                    l.length && (i(l, g, c, !0), l.length = l.area = 0), o.forEach(e)
                }
            }

            function n(e) {
                var r = e.children;
                if (r && r.length) {
                    var o, u = f(e),
                        a = r.slice(),
                        s = [];
                    for (t(a, u.dx * u.dy / e.value), s.area = 0; o = a.pop();) s.push(o), s.area += o.area, null != o.z && (i(s, o.z ? u.dx : u.dy, u, !a.length), s.length = s.area = 0);
                    r.forEach(n)
                }
            }

            function r(t, e) {
                for (var n, r = t.area, i = 0, o = 1 / 0, u = -1, a = t.length; ++u < a;)(n = t[u].area) && (n < o && (o = n), n > i && (i = n));
                return r *= r, e *= e, r ? Math.max(e * i * d / r, r / (e * o * d)) : 1 / 0
            }

            function i(t, e, n, r) {
                var i, o = -1,
                    u = t.length,
                    a = n.x,
                    c = n.y,
                    l = e ? s(t.area / e) : 0;
                if (e == n.dx) {
                    for ((r || l > n.dy) && (l = n.dy); ++o < u;)(i = t[o]).x = a, i.y = c, i.dy = l, a += i.dx = Math.min(n.x + n.dx - a, l ? s(i.area / l) : 0);
                    i.z = !0, i.dx += n.x + n.dx - a, n.y += l, n.dy -= l
                } else {
                    for ((r || l > n.dx) && (l = n.dx); ++o < u;)(i = t[o]).x = a, i.y = c, i.dx = l, c += i.dy = Math.min(n.y + n.dy - c, l ? s(i.area / l) : 0);
                    i.z = !1, i.dy += n.y + n.dy - c, n.x += l, n.dx -= l
                }
            }

            function o(r) {
                var i = u || a(r),
                    o = i[0];
                return o.x = o.y = 0, o.value ? (o.dx = c[0], o.dy = c[1]) : o.dx = o.dy = 0, u && a.revalue(o), t([o], o.dx * o.dy / o.value), (u ? n : e)(o), h && (u = i), i
            }
            var u, a = Uo.layout.hierarchy(),
                s = Math.round,
                c = [1, 1],
                l = null,
                f = _i,
                h = !1,
                p = "squarify",
                d = .5 * (1 + Math.sqrt(5));
            return o.size = function(t) {
                return arguments.length ? (c = t, o) : c
            }, o.padding = function(t) {
                function e(e) {
                    return Ai(e, t)
                }
                if (!arguments.length) return l;
                var n;
                return f = null == (l = t) ? _i : "function" == (n = typeof t) ? function(e) {
                    var n = t.call(o, e, e.depth);
                    return null == n ? _i(e) : Ai(e, "number" == typeof n ? [n, n, n, n] : n)
                } : "number" === n ? (t = [t, t, t, t], e) : e, o
            }, o.round = function(t) {
                return arguments.length ? (s = t ? Math.round : Number, o) : s != Number
            }, o.sticky = function(t) {
                return arguments.length ? (h = t, u = null, o) : h
            }, o.ratio = function(t) {
                return arguments.length ? (d = t, o) : d
            }, o.mode = function(t) {
                return arguments.length ? (p = t + "", o) : p
            }, Vr(o, a)
        }, Uo.random = {
            normal: function(t, e) {
                var n = arguments.length;
                return n < 2 && (e = 1), n < 1 && (t = 0),
                    function() {
                        var n, r, i;
                        do {
                            i = (n = 2 * Math.random() - 1) * n + (r = 2 * Math.random() - 1) * r
                        } while (!i || i > 1);
                        return t + e * n * Math.sqrt(-2 * Math.log(i) / i)
                    }
            },
            logNormal: function() {
                var t = Uo.random.normal.apply(Uo, arguments);
                return function() {
                    return Math.exp(t())
                }
            },
            bates: function(t) {
                var e = Uo.random.irwinHall(t);
                return function() {
                    return e() / t
                }
            },
            irwinHall: function(t) {
                return function() {
                    for (var e = 0, n = 0; n < t; n++) e += Math.random();
                    return e
                }
            }
        }, Uo.scale = {};
        var ts = {
            floor: m,
            ceil: m
        };
        Uo.scale.linear = function() {
            return Ri([0, 1], [0, 1], pr, !1)
        };
        var es = {
            s: 1,
            g: 1,
            p: 1,
            r: 1,
            e: 1
        };
        Uo.scale.log = function() {
            return $i(Uo.scale.linear().domain([0, 1]), 10, !0, [1, 10])
        };
        var ns = Uo.format(".0e"),
            rs = {
                floor: function(t) {
                    return -Math.ceil(-t)
                },
                ceil: function(t) {
                    return -Math.floor(-t)
                }
            };
        Uo.scale.pow = function() {
            return Vi(Uo.scale.linear(), 1, [0, 1])
        }, Uo.scale.sqrt = function() {
            return Uo.scale.pow().exponent(.5)
        }, Uo.scale.ordinal = function() {
            return Xi([], {
                t: "range",
                a: [
                    []
                ]
            })
        }, Uo.scale.category10 = function() {
            return Uo.scale.ordinal().range(is)
        }, Uo.scale.category20 = function() {
            return Uo.scale.ordinal().range(os)
        }, Uo.scale.category20b = function() {
            return Uo.scale.ordinal().range(us)
        }, Uo.scale.category20c = function() {
            return Uo.scale.ordinal().range(as)
        };
        var is = [2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175].map(xt),
            os = [2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725].map(xt),
            us = [3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654].map(xt),
            as = [3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081].map(xt);
        Uo.scale.quantile = function() {
            return Zi([], [])
        }, Uo.scale.quantize = function() {
            return Gi(0, 1, [0, 1])
        }, Uo.scale.threshold = function() {
            return Ki([.5], [0, 1])
        }, Uo.scale.identity = function() {
            return Ji([0, 1])
        }, Uo.svg = {}, Uo.svg.arc = function() {
            function t() {
                var t = Math.max(0, +n.apply(this, arguments)),
                    c = Math.max(0, +r.apply(this, arguments)),
                    l = u.apply(this, arguments) - bu,
                    f = a.apply(this, arguments) - bu,
                    h = Math.abs(f - l),
                    p = l > f ? 0 : 1;
                if (c < t && (d = c, c = t, t = d), h >= xu) return e(c, p) + (t ? e(t, 1 - p) : "") + "Z";
                var d, g, v, y, m, x, b, w, M, k, E, C, T = 0,
                    S = 0,
                    N = [];
                if ((y = (+s.apply(this, arguments) || 0) / 2) && (v = o === ss ? Math.sqrt(t * t + c * c) : +o.apply(this, arguments), p || (S *= -1), c && (S = et(v / c * Math.sin(y))), t && (T = et(v / t * Math.sin(y)))), c) {
                    m = c * Math.cos(l + S), x = c * Math.sin(l + S), b = c * Math.cos(f - S), w = c * Math.sin(f - S);
                    var _ = Math.abs(f - l - 2 * S) <= yu ? 0 : 1;
                    if (S && oo(m, x, b, w) === p ^ _) {
                        var A = (l + f) / 2;
                        m = c * Math.cos(A), x = c * Math.sin(A), b = w = null
                    }
                } else m = x = 0;
                if (t) {
                    M = t * Math.cos(f - T), k = t * Math.sin(f - T), E = t * Math.cos(l + T), C = t * Math.sin(l + T);
                    var L = Math.abs(l - f + 2 * T) <= yu ? 0 : 1;
                    if (T && oo(M, k, E, C) === 1 - p ^ L) {
                        var D = (l + f) / 2;
                        M = t * Math.cos(D), k = t * Math.sin(D), E = C = null
                    }
                } else M = k = 0;
                if (h > gu && (d = Math.min(Math.abs(c - t) / 2, +i.apply(this, arguments))) > .001) {
                    g = t < c ^ p ? 0 : 1;
                    var q = d,
                        j = d;
                    if (h < yu) {
                        var P = null == E ? [M, k] : null == b ? [m, x] : _n([m, x], [E, C], [b, w], [M, k]),
                            O = m - P[0],
                            R = x - P[1],
                            H = b - P[0],
                            F = w - P[1],
                            z = 1 / Math.sin(Math.acos((O * H + R * F) / (Math.sqrt(O * O + R * R) * Math.sqrt(H * H + F * F))) / 2),
                            I = Math.sqrt(P[0] * P[0] + P[1] * P[1]);
                        j = Math.min(d, (t - I) / (z - 1)), q = Math.min(d, (c - I) / (z + 1))
                    }
                    if (null != b) {
                        var U = uo(null == E ? [M, k] : [E, C], [m, x], c, q, p),
                            W = uo([b, w], [M, k], c, q, p);
                        d === q ? N.push("M", U[0], "A", q, ",", q, " 0 0,", g, " ", U[1], "A", c, ",", c, " 0 ", 1 - p ^ oo(U[1][0], U[1][1], W[1][0], W[1][1]), ",", p, " ", W[1], "A", q, ",", q, " 0 0,", g, " ", W[0]) : N.push("M", U[0], "A", q, ",", q, " 0 1,", g, " ", W[0])
                    } else N.push("M", m, ",", x);
                    if (null != E) {
                        var B = uo([m, x], [E, C], t, -j, p),
                            $ = uo([M, k], null == b ? [m, x] : [b, w], t, -j, p);
                        d === j ? N.push("L", $[0], "A", j, ",", j, " 0 0,", g, " ", $[1], "A", t, ",", t, " 0 ", p ^ oo($[1][0], $[1][1], B[1][0], B[1][1]), ",", 1 - p, " ", B[1], "A", j, ",", j, " 0 0,", g, " ", B[0]) : N.push("L", $[0], "A", j, ",", j, " 0 0,", g, " ", B[0])
                    } else N.push("L", M, ",", k)
                } else N.push("M", m, ",", x), null != b && N.push("A", c, ",", c, " 0 ", _, ",", p, " ", b, ",", w), N.push("L", M, ",", k), null != E && N.push("A", t, ",", t, " 0 ", L, ",", 1 - p, " ", E, ",", C);
                return N.push("Z"), N.join("")
            }

            function e(t, e) {
                return "M0," + t + "A" + t + "," + t + " 0 1," + e + " 0," + -t + "A" + t + "," + t + " 0 1," + e + " 0," + t
            }
            var n = to,
                r = eo,
                i = Qi,
                o = ss,
                u = no,
                a = ro,
                s = io;
            return t.innerRadius = function(e) {
                return arguments.length ? (n = Tt(e), t) : n
            }, t.outerRadius = function(e) {
                return arguments.length ? (r = Tt(e), t) : r
            }, t.cornerRadius = function(e) {
                return arguments.length ? (i = Tt(e), t) : i
            }, t.padRadius = function(e) {
                return arguments.length ? (o = e == ss ? ss : Tt(e), t) : o
            }, t.startAngle = function(e) {
                return arguments.length ? (u = Tt(e), t) : u
            }, t.endAngle = function(e) {
                return arguments.length ? (a = Tt(e), t) : a
            }, t.padAngle = function(e) {
                return arguments.length ? (s = Tt(e), t) : s
            }, t.centroid = function() {
                var t = (+n.apply(this, arguments) + +r.apply(this, arguments)) / 2,
                    e = (+u.apply(this, arguments) + +a.apply(this, arguments)) / 2 - bu;
                return [Math.cos(e) * t, Math.sin(e) * t]
            }, t
        };
        var ss = "auto";
        Uo.svg.line = function() {
            return ao(m)
        };
        var cs = Uo.map({
            linear: so,
            "linear-closed": co,
            step: function(t) {
                for (var e = 0, n = t.length, r = t[0], i = [r[0], ",", r[1]]; ++e < n;) i.push("H", (r[0] + (r = t[e])[0]) / 2, "V", r[1]);
                return n > 1 && i.push("H", r[0]), i.join("")
            },
            "step-before": lo,
            "step-after": fo,
            basis: go,
            "basis-open": function(t) {
                if (t.length < 4) return so(t);
                for (var e, n = [], r = -1, i = t.length, o = [0], u = [0]; ++r < 3;) e = t[r], o.push(e[0]), u.push(e[1]);
                for (n.push(vo(hs, o) + "," + vo(hs, u)), --r; ++r < i;) e = t[r], o.shift(), o.push(e[0]), u.shift(), u.push(e[1]), yo(n, o, u);
                return n.join("")
            },
            "basis-closed": function(t) {
                for (var e, n, r = -1, i = t.length, o = i + 4, u = [], a = []; ++r < 4;) n = t[r % i], u.push(n[0]), a.push(n[1]);
                for (e = [vo(hs, u), ",", vo(hs, a)], --r; ++r < o;) n = t[r % i], u.shift(), u.push(n[0]), a.shift(), a.push(n[1]), yo(e, u, a);
                return e.join("")
            },
            bundle: function(t, e) {
                var n = t.length - 1;
                if (n)
                    for (var r, i, o = t[0][0], u = t[0][1], a = t[n][0] - o, s = t[n][1] - u, c = -1; ++c <= n;) i = c / n, (r = t[c])[0] = e * r[0] + (1 - e) * (o + i * a), r[1] = e * r[1] + (1 - e) * (u + i * s);
                return go(t)
            },
            cardinal: function(t, e) {
                return t.length < 3 ? so(t) : t[0] + ho(t, po(t, e))
            },
            "cardinal-open": function(t, e) {
                return t.length < 4 ? so(t) : t[1] + ho(t.slice(1, -1), po(t, e))
            },
            "cardinal-closed": function(t, e) {
                return t.length < 3 ? co(t) : t[0] + ho((t.push(t[0]), t), po([t[t.length - 2]].concat(t, [t[1]]), e))
            },
            monotone: function(t) {
                return t.length < 3 ? so(t) : t[0] + ho(t, bo(t))
            }
        });
        cs.forEach(function(t, e) {
            e.key = t, e.closed = /-closed$/.test(t)
        });
        var ls = [0, 2 / 3, 1 / 3, 0],
            fs = [0, 1 / 3, 2 / 3, 0],
            hs = [0, 1 / 6, 2 / 3, 1 / 6];
        Uo.svg.line.radial = function() {
            var t = ao(wo);
            return t.radius = t.x, delete t.x, t.angle = t.y, delete t.y, t
        }, lo.reverse = fo, fo.reverse = lo, Uo.svg.area = function() {
            return Mo(m)
        }, Uo.svg.area.radial = function() {
            var t = Mo(wo);
            return t.radius = t.x, delete t.x, t.innerRadius = t.x0, delete t.x0, t.outerRadius = t.x1, delete t.x1, t.angle = t.y, delete t.y, t.startAngle = t.y0, delete t.y0, t.endAngle = t.y1, delete t.y1, t
        }, Uo.svg.chord = function() {
            function t(t, a) {
                var s = e(this, o, t, a),
                    c = e(this, u, t, a);
                return "M" + s.p0 + r(s.r, s.p1, s.a1 - s.a0) + (n(s, c) ? i(s.r, s.p1, s.r, s.p0) : i(s.r, s.p1, c.r, c.p0) + r(c.r, c.p1, c.a1 - c.a0) + i(c.r, c.p1, s.r, s.p0)) + "Z"
            }

            function e(t, e, n, r) {
                var i = e.call(t, n, r),
                    o = a.call(t, i, r),
                    u = s.call(t, i, r) - bu,
                    l = c.call(t, i, r) - bu;
                return {
                    r: o,
                    a0: u,
                    a1: l,
                    p0: [o * Math.cos(u), o * Math.sin(u)],
                    p1: [o * Math.cos(l), o * Math.sin(l)]
                }
            }

            function n(t, e) {
                return t.a0 == e.a0 && t.a1 == e.a1
            }

            function r(t, e, n) {
                return "A" + t + "," + t + " 0 " + +(n > yu) + ",1 " + e
            }

            function i(t, e, n, r) {
                return "Q 0,0 " + r
            }
            var o = gn,
                u = vn,
                a = ko,
                s = no,
                c = ro;
            return t.radius = function(e) {
                return arguments.length ? (a = Tt(e), t) : a
            }, t.source = function(e) {
                return arguments.length ? (o = Tt(e), t) : o
            }, t.target = function(e) {
                return arguments.length ? (u = Tt(e), t) : u
            }, t.startAngle = function(e) {
                return arguments.length ? (s = Tt(e), t) : s
            }, t.endAngle = function(e) {
                return arguments.length ? (c = Tt(e), t) : c
            }, t
        }, Uo.svg.diagonal = function() {
            function t(t, i) {
                var o = e.call(this, t, i),
                    u = n.call(this, t, i),
                    a = (o.y + u.y) / 2,
                    s = [o, {
                        x: o.x,
                        y: a
                    }, {
                        x: u.x,
                        y: a
                    }, u];
                return "M" + (s = s.map(r))[0] + "C" + s[1] + " " + s[2] + " " + s[3]
            }
            var e = gn,
                n = vn,
                r = Eo;
            return t.source = function(n) {
                return arguments.length ? (e = Tt(n), t) : e
            }, t.target = function(e) {
                return arguments.length ? (n = Tt(e), t) : n
            }, t.projection = function(e) {
                return arguments.length ? (r = e, t) : r
            }, t
        }, Uo.svg.diagonal.radial = function() {
            var t = Uo.svg.diagonal(),
                e = Eo,
                n = t.projection;
            return t.projection = function(t) {
                return arguments.length ? n(Co(e = t)) : e
            }, t
        }, Uo.svg.symbol = function() {
            function t(t, r) {
                return (ps.get(e.call(this, t, r)) || No)(n.call(this, t, r))
            }
            var e = So,
                n = To;
            return t.type = function(n) {
                return arguments.length ? (e = Tt(n), t) : e
            }, t.size = function(e) {
                return arguments.length ? (n = Tt(e), t) : n
            }, t
        };
        var ps = Uo.map({
            circle: No,
            cross: function(t) {
                var e = Math.sqrt(t / 5) / 2;
                return "M" + -3 * e + "," + -e + "H" + -e + "V" + -3 * e + "H" + e + "V" + -e + "H" + 3 * e + "V" + e + "H" + e + "V" + 3 * e + "H" + -e + "V" + e + "H" + -3 * e + "Z"
            },
            diamond: function(t) {
                var e = Math.sqrt(t / (2 * gs)),
                    n = e * gs;
                return "M0," + -e + "L" + n + ",0 0," + e + " " + -n + ",0Z"
            },
            square: function(t) {
                var e = Math.sqrt(t) / 2;
                return "M" + -e + "," + -e + "L" + e + "," + -e + " " + e + "," + e + " " + -e + "," + e + "Z"
            },
            "triangle-down": function(t) {
                var e = Math.sqrt(t / ds),
                    n = e * ds / 2;
                return "M0," + n + "L" + e + "," + -n + " " + -e + "," + -n + "Z"
            },
            "triangle-up": function(t) {
                var e = Math.sqrt(t / ds),
                    n = e * ds / 2;
                return "M0," + -n + "L" + e + "," + n + " " + -e + "," + n + "Z"
            }
        });
        Uo.svg.symbolTypes = ps.keys();
        var ds = Math.sqrt(3),
            gs = Math.tan(30 * wu);
        au.transition = function(t) {
            for (var e, n, r = vs || ++bs, i = qo(t), o = [], u = ys || {
                time: Date.now(),
                ease: br,
                delay: 0,
                duration: 250
            }, a = -1, s = this.length; ++a < s;) {
                o.push(e = []);
                for (var c = this[a], l = -1, f = c.length; ++l < f;)(n = c[l]) && jo(n, l, i, r, u), e.push(n)
            }
            return Ao(o, i, r)
        }, au.interrupt = function(t) {
            return this.each(null == t ? ms : _o(qo(t)))
        };
        var vs, ys, ms = _o(qo()),
            xs = [],
            bs = 0;
        xs.call = au.call, xs.empty = au.empty, xs.node = au.node, xs.size = au.size, Uo.transition = function(t, e) {
            return t && t.transition ? vs ? t.transition(e) : t : Uo.selection().transition(t)
        }, Uo.transition.prototype = xs, xs.select = function(t) {
            var e, n, r, i = this.id,
                o = this.namespace,
                u = [];
            t = N(t);
            for (var a = -1, s = this.length; ++a < s;) {
                u.push(e = []);
                for (var c = this[a], l = -1, f = c.length; ++l < f;)(r = c[l]) && (n = t.call(r, r.__data__, l, a)) ? ("__data__" in r && (n.__data__ = r.__data__), jo(n, l, o, i, r[o][i]), e.push(n)) : e.push(null)
            }
            return Ao(u, o, i)
        }, xs.selectAll = function(t) {
            var e, n, r, i, o, u = this.id,
                a = this.namespace,
                s = [];
            t = _(t);
            for (var c = -1, l = this.length; ++c < l;)
                for (var f = this[c], h = -1, p = f.length; ++h < p;)
                    if (r = f[h]) {
                        o = r[a][u], n = t.call(r, r.__data__, h, c), s.push(e = []);
                        for (var d = -1, g = n.length; ++d < g;)(i = n[d]) && jo(i, d, a, u, o), e.push(i)
                    }
            return Ao(s, a, u)
        }, xs.filter = function(t) {
            var e, n, r, i = [];
            "function" != typeof t && (t = I(t));
            for (var o = 0, u = this.length; o < u; o++) {
                i.push(e = []);
                for (var a = 0, s = (n = this[o]).length; a < s; a++)(r = n[a]) && t.call(r, r.__data__, a, o) && e.push(r)
            }
            return Ao(i, this.namespace, this.id)
        }, xs.tween = function(t, e) {
            var n = this.id,
                r = this.namespace;
            return arguments.length < 2 ? this.node()[r][n].tween.get(t) : W(this, null == e ? function(e) {
                e[r][n].tween.remove(t)
            } : function(i) {
                i[r][n].tween.set(t, e)
            })
        }, xs.attr = function(t, e) {
            function n() {
                this.removeAttribute(o)
            }

            function r() {
                this.removeAttributeNS(o.space, o.local)
            }
            if (arguments.length < 2) {
                for (e in t) this.attr(e, t[e]);
                return this
            }
            var i = "transform" == t ? Pr : pr,
                o = Uo.ns.qualify(t);
            return Lo(this, "attr." + t, e, o.local ? function(t) {
                return null == t ? r : (t += "", function() {
                    var e, n = this.getAttributeNS(o.space, o.local);
                    return n !== t && (e = i(n, t), function(t) {
                        this.setAttributeNS(o.space, o.local, e(t))
                    })
                })
            } : function(t) {
                return null == t ? n : (t += "", function() {
                    var e, n = this.getAttribute(o);
                    return n !== t && (e = i(n, t), function(t) {
                        this.setAttribute(o, e(t))
                    })
                })
            })
        }, xs.attrTween = function(t, e) {
            var n = Uo.ns.qualify(t);
            return this.tween("attr." + t, n.local ? function(t, r) {
                var i = e.call(this, t, r, this.getAttributeNS(n.space, n.local));
                return i && function(t) {
                    this.setAttributeNS(n.space, n.local, i(t))
                }
            } : function(t, r) {
                var i = e.call(this, t, r, this.getAttribute(n));
                return i && function(t) {
                    this.setAttribute(n, i(t))
                }
            })
        }, xs.style = function(t, n, r) {
            function i() {
                this.style.removeProperty(t)
            }
            var o = arguments.length;
            if (o < 3) {
                if ("string" != typeof t) {
                    o < 2 && (n = "");
                    for (r in t) this.style(r, t[r], n);
                    return this
                }
                r = ""
            }
            return Lo(this, "style." + t, n, function(n) {
                return null == n ? i : (n += "", function() {
                    var i, o = e(this).getComputedStyle(this, null).getPropertyValue(t);
                    return o !== n && (i = pr(o, n), function(e) {
                        this.style.setProperty(t, i(e), r)
                    })
                })
            })
        }, xs.styleTween = function(t, n, r) {
            return arguments.length < 3 && (r = ""), this.tween("style." + t, function(i, o) {
                var u = n.call(this, i, o, e(this).getComputedStyle(this, null).getPropertyValue(t));
                return u && function(e) {
                    this.style.setProperty(t, u(e), r)
                }
            })
        }, xs.text = function(t) {
            return Lo(this, "text", t, Do)
        }, xs.remove = function() {
            var t = this.namespace;
            return this.each("end.transition", function() {
                var e;
                this[t].count < 2 && (e = this.parentNode) && e.removeChild(this)
            })
        }, xs.ease = function(t) {
            var e = this.id,
                n = this.namespace;
            return arguments.length < 1 ? this.node()[n][e].ease : ("function" != typeof t && (t = Uo.ease.apply(Uo, arguments)), W(this, function(r) {
                r[n][e].ease = t
            }))
        }, xs.delay = function(t) {
            var e = this.id,
                n = this.namespace;
            return arguments.length < 1 ? this.node()[n][e].delay : W(this, "function" == typeof t ? function(r, i, o) {
                r[n][e].delay = +t.call(r, r.__data__, i, o)
            } : (t = +t, function(r) {
                r[n][e].delay = t
            }))
        }, xs.duration = function(t) {
            var e = this.id,
                n = this.namespace;
            return arguments.length < 1 ? this.node()[n][e].duration : W(this, "function" == typeof t ? function(r, i, o) {
                r[n][e].duration = Math.max(1, t.call(r, r.__data__, i, o))
            } : (t = Math.max(1, t), function(r) {
                r[n][e].duration = t
            }))
        }, xs.each = function(t, e) {
            var n = this.id,
                r = this.namespace;
            if (arguments.length < 2) {
                var i = ys,
                    o = vs;
                try {
                    vs = n, W(this, function(e, i, o) {
                        ys = e[r][n], t.call(e, e.__data__, i, o)
                    })
                } finally {
                    ys = i, vs = o
                }
            } else W(this, function(i) {
                var o = i[r][n];
                (o.event || (o.event = Uo.dispatch("start", "end", "interrupt"))).on(t, e)
            });
            return this
        }, xs.transition = function() {
            for (var t, e, n, r, i = this.id, o = ++bs, u = this.namespace, a = [], s = 0, c = this.length; s < c; s++) {
                a.push(t = []);
                for (var l = 0, f = (e = this[s]).length; l < f; l++)(n = e[l]) && jo(n, l, u, o, {
                    time: (r = n[u][i]).time,
                    ease: r.ease,
                    delay: r.delay + r.duration,
                    duration: r.duration
                }), t.push(n)
            }
            return Ao(a, u, o)
        }, Uo.svg.axis = function() {
            function t(t) {
                t.each(function() {
                    var t, c = Uo.select(this),
                        l = this.__chart__ || n,
                        f = this.__chart__ = n.copy(),
                        h = null == s ? f.ticks ? f.ticks.apply(f, a) : f.domain() : s,
                        p = null == e ? f.tickFormat ? f.tickFormat.apply(f, a) : m : e,
                        d = c.selectAll(".tick").data(h, f),
                        g = d.enter().insert("g", ".domain").attr("class", "tick").style("opacity", gu),
                        v = Uo.transition(d.exit()).style("opacity", gu).remove(),
                        y = Uo.transition(d.order()).style("opacity", 1),
                        x = Math.max(i, 0) + u,
                        b = Di(f),
                        w = c.selectAll(".domain").data([0]),
                        M = (w.enter().append("path").attr("class", "domain"), Uo.transition(w));
                    g.append("line"), g.append("text");
                    var k, E, C, T, S = g.select("line"),
                        N = y.select("line"),
                        _ = d.select("text").text(p),
                        A = g.select("text"),
                        L = y.select("text"),
                        D = "top" === r || "left" === r ? -1 : 1;
                    if ("bottom" === r || "top" === r ? (t = Po, k = "x", C = "y", E = "x2", T = "y2", _.attr("dy", D < 0 ? "0em" : ".71em").style("text-anchor", "middle"), M.attr("d", "M" + b[0] + "," + D * o + "V0H" + b[1] + "V" + D * o)) : (t = Oo, k = "y", C = "x", E = "y2", T = "x2", _.attr("dy", ".32em").style("text-anchor", D < 0 ? "end" : "start"), M.attr("d", "M" + D * o + "," + b[0] + "H0V" + b[1] + "H" + D * o)), S.attr(T, D * i), A.attr(C, D * x), N.attr(E, 0).attr(T, D * i), L.attr(k, 0).attr(C, D * x), f.rangeBand) {
                        var q = f,
                            j = q.rangeBand() / 2;
                        l = f = function(t) {
                            return q(t) + j
                        }
                    } else l.rangeBand ? l = f : v.call(t, f, l);
                    g.call(t, l, f), y.call(t, f, f)
                })
            }
            var e, n = Uo.scale.linear(),
                r = ws,
                i = 6,
                o = 6,
                u = 3,
                a = [10],
                s = null;
            return t.scale = function(e) {
                return arguments.length ? (n = e, t) : n
            }, t.orient = function(e) {
                return arguments.length ? (r = e in Ms ? e + "" : ws, t) : r
            }, t.ticks = function() {
                return arguments.length ? (a = Bo(arguments), t) : a
            }, t.tickValues = function(e) {
                return arguments.length ? (s = e, t) : s
            }, t.tickFormat = function(n) {
                return arguments.length ? (e = n, t) : e
            }, t.tickSize = function(e) {
                var n = arguments.length;
                return n ? (i = +e, o = +arguments[n - 1], t) : i
            }, t.innerTickSize = function(e) {
                return arguments.length ? (i = +e, t) : i
            }, t.outerTickSize = function(e) {
                return arguments.length ? (o = +e, t) : o
            }, t.tickPadding = function(e) {
                return arguments.length ? (u = +e, t) : u
            }, t.tickSubdivide = function() {
                return arguments.length && t
            }, t
        };
        var ws = "bottom",
            Ms = {
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            };
        Uo.svg.brush = function() {
            function t(e) {
                e.each(function() {
                    var e = Uo.select(this).style("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush", o).on("touchstart.brush", o),
                        u = e.selectAll(".background").data([0]);
                    u.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair"), e.selectAll(".extent").data([0]).enter().append("rect").attr("class", "extent").style("cursor", "move");
                    var a = e.selectAll(".resize").data(g, m);
                    a.exit().remove(), a.enter().append("g").attr("class", function(t) {
                        return "resize " + t
                    }).style("cursor", function(t) {
                        return ks[t]
                    }).append("rect").attr("x", function(t) {
                        return /[ew]$/.test(t) ? -3 : null
                    }).attr("y", function(t) {
                        return /^[ns]/.test(t) ? -3 : null
                    }).attr("width", 6).attr("height", 6).style("visibility", "hidden"), a.style("display", t.empty() ? "none" : null);
                    var s, f = Uo.transition(e),
                        h = Uo.transition(u);
                    c && (s = Di(c), h.attr("x", s[0]).attr("width", s[1] - s[0]), r(f)), l && (s = Di(l), h.attr("y", s[0]).attr("height", s[1] - s[0]), i(f)), n(f)
                })
            }

            function n(t) {
                t.selectAll(".resize").attr("transform", function(t) {
                    return "translate(" + f[+/e$/.test(t)] + "," + h[+/^s/.test(t)] + ")"
                })
            }

            function r(t) {
                t.select(".extent").attr("x", f[0]), t.selectAll(".extent,.n>rect,.s>rect").attr("width", f[1] - f[0])
            }

            function i(t) {
                t.select(".extent").attr("y", h[0]), t.selectAll(".extent,.e>rect,.w>rect").attr("height", h[1] - h[0])
            }

            function o() {
                function o() {
                    var t = Uo.mouse(x),
                        e = !1;
                    m && (t[0] += m[0], t[1] += m[1]), S || (Uo.event.altKey ? (y || (y = [(f[0] + f[1]) / 2, (h[0] + h[1]) / 2]), _[0] = f[+(t[0] < y[0])], _[1] = h[+(t[1] < y[1])]) : y = null), C && g(t, c, 0) && (r(M), e = !0), T && g(t, l, 1) && (i(M), e = !0), e && (n(M), w({
                        type: "brush",
                        mode: S ? "move" : "resize"
                    }))
                }

                function g(t, e, n) {
                    var r, i, o = Di(e),
                        s = o[0],
                        c = o[1],
                        l = _[n],
                        g = n ? h : f,
                        v = g[1] - g[0];
                    if (S && (s -= l, c -= v + l), r = (n ? d : p) ? Math.max(s, Math.min(c, t[n])) : t[n], S ? i = (r += l) + v : (y && (l = Math.max(s, Math.min(c, 2 * y[n] - r))), l < r ? (i = r, r = l) : i = l), g[0] != r || g[1] != i) return n ? a = null : u = null, g[0] = r, g[1] = i, !0
                }

                function v() {
                    o(), M.style("pointer-events", "all").selectAll(".resize").style("display", t.empty() ? "none" : null), Uo.select("body").style("cursor", null), A.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null), N(), w({
                        type: "brushend"
                    })
                }
                var y, m, x = this,
                    b = Uo.select(Uo.event.target),
                    w = s.of(x, arguments),
                    M = Uo.select(x),
                    k = b.datum(),
                    C = !/^(n|s)$/.test(k) && c,
                    T = !/^(e|w)$/.test(k) && l,
                    S = b.classed("extent"),
                    N = Z(x),
                    _ = Uo.mouse(x),
                    A = Uo.select(e(x)).on("keydown.brush", function() {
                        32 == Uo.event.keyCode && (S || (y = null, _[0] -= f[1], _[1] -= h[1], S = 2), E())
                    }).on("keyup.brush", function() {
                        32 == Uo.event.keyCode && 2 == S && (_[0] += f[1], _[1] += h[1], S = 0, E())
                    });
                if (Uo.event.changedTouches ? A.on("touchmove.brush", o).on("touchend.brush", v) : A.on("mousemove.brush", o).on("mouseup.brush", v), M.interrupt().selectAll("*").interrupt(), S) _[0] = f[0] - _[0], _[1] = h[0] - _[1];
                else if (k) {
                    var L = +/w$/.test(k),
                        D = +/^n/.test(k);
                    m = [f[1 - L] - _[0], h[1 - D] - _[1]], _[0] = f[L], _[1] = h[D]
                } else Uo.event.altKey && (y = _.slice());
                M.style("pointer-events", "none").selectAll(".resize").style("display", null), Uo.select("body").style("cursor", b.style("cursor")), w({
                    type: "brushstart"
                }), o()
            }
            var u, a, s = T(t, "brushstart", "brush", "brushend"),
                c = null,
                l = null,
                f = [0, 0],
                h = [0, 0],
                p = !0,
                d = !0,
                g = Es[0];
            return t.event = function(t) {
                t.each(function() {
                    var t = s.of(this, arguments),
                        e = {
                            x: f,
                            y: h,
                            i: u,
                            j: a
                        },
                        n = this.__chart__ || e;
                    this.__chart__ = e, vs ? Uo.select(this).transition().each("start.brush", function() {
                        u = n.i, a = n.j, f = n.x, h = n.y, t({
                            type: "brushstart"
                        })
                    }).tween("brush:brush", function() {
                        var n = dr(f, e.x),
                            r = dr(h, e.y);
                        return u = a = null,
                            function(i) {
                                f = e.x = n(i), h = e.y = r(i), t({
                                    type: "brush",
                                    mode: "resize"
                                })
                            }
                    }).each("end.brush", function() {
                        u = e.i, a = e.j, t({
                            type: "brush",
                            mode: "resize"
                        }), t({
                            type: "brushend"
                        })
                    }) : (t({
                        type: "brushstart"
                    }), t({
                        type: "brush",
                        mode: "resize"
                    }), t({
                        type: "brushend"
                    }))
                })
            }, t.x = function(e) {
                return arguments.length ? (c = e, g = Es[!c << 1 | !l], t) : c
            }, t.y = function(e) {
                return arguments.length ? (l = e, g = Es[!c << 1 | !l], t) : l
            }, t.clamp = function(e) {
                return arguments.length ? (c && l ? (p = !!e[0], d = !!e[1]) : c ? p = !!e : l && (d = !!e), t) : c && l ? [p, d] : c ? p : l ? d : null
            }, t.extent = function(e) {
                var n, r, i, o, s;
                return arguments.length ? (c && (n = e[0], r = e[1], l && (n = n[0], r = r[0]), u = [n, r], c.invert && (n = c(n), r = c(r)), r < n && (s = n, n = r, r = s), n == f[0] && r == f[1] || (f = [n, r])), l && (i = e[0], o = e[1], c && (i = i[1], o = o[1]), a = [i, o], l.invert && (i = l(i), o = l(o)), o < i && (s = i, i = o, o = s), i == h[0] && o == h[1] || (h = [i, o])), t) : (c && (u ? (n = u[0], r = u[1]) : (n = f[0], r = f[1], c.invert && (n = c.invert(n), r = c.invert(r)), r < n && (s = n, n = r, r = s))), l && (a ? (i = a[0], o = a[1]) : (i = h[0], o = h[1], l.invert && (i = l.invert(i), o = l.invert(o)), o < i && (s = i, i = o, o = s))), c && l ? [
                    [n, i],
                    [r, o]
                ] : c ? [n, r] : l && [i, o])
            }, t.clear = function() {
                return t.empty() || (f = [0, 0], h = [0, 0], u = a = null), t
            }, t.empty = function() {
                return !!c && f[0] == f[1] || !!l && h[0] == h[1]
            }, Uo.rebind(t, s, "on")
        };
        var ks = {
                n: "ns-resize",
                e: "ew-resize",
                s: "ns-resize",
                w: "ew-resize",
                nw: "nwse-resize",
                ne: "nesw-resize",
                se: "nwse-resize",
                sw: "nesw-resize"
            },
            Es = [
                ["n", "e", "s", "w", "nw", "ne", "se", "sw"],
                ["e", "w"],
                ["n", "s"],
                []
            ],
            Cs = Bu.format = Gu.timeFormat,
            Ts = Cs.utc,
            Ss = Ts("%Y-%m-%dT%H:%M:%S.%LZ");
        Cs.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? Ro : Ss, Ro.parse = function(t) {
            var e = new Date(t);
            return isNaN(e) ? null : e
        }, Ro.toString = Ss.toString, Bu.second = Ft(function(t) {
            return new $u(1e3 * Math.floor(t / 1e3))
        }, function(t, e) {
            t.setTime(t.getTime() + 1e3 * Math.floor(e))
        }, function(t) {
            return t.getSeconds()
        }), Bu.seconds = Bu.second.range, Bu.seconds.utc = Bu.second.utc.range, Bu.minute = Ft(function(t) {
            return new $u(6e4 * Math.floor(t / 6e4))
        }, function(t, e) {
            t.setTime(t.getTime() + 6e4 * Math.floor(e))
        }, function(t) {
            return t.getMinutes()
        }), Bu.minutes = Bu.minute.range, Bu.minutes.utc = Bu.minute.utc.range, Bu.hour = Ft(function(t) {
            var e = t.getTimezoneOffset() / 60;
            return new $u(36e5 * (Math.floor(t / 36e5 - e) + e))
        }, function(t, e) {
            t.setTime(t.getTime() + 36e5 * Math.floor(e))
        }, function(t) {
            return t.getHours()
        }), Bu.hours = Bu.hour.range, Bu.hours.utc = Bu.hour.utc.range, Bu.month = Ft(function(t) {
            return (t = Bu.day(t)).setDate(1), t
        }, function(t, e) {
            t.setMonth(t.getMonth() + e)
        }, function(t) {
            return t.getMonth()
        }), Bu.months = Bu.month.range, Bu.months.utc = Bu.month.utc.range;
        var Ns = [1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6],
            _s = [
                [Bu.second, 1],
                [Bu.second, 5],
                [Bu.second, 15],
                [Bu.second, 30],
                [Bu.minute, 1],
                [Bu.minute, 5],
                [Bu.minute, 15],
                [Bu.minute, 30],
                [Bu.hour, 1],
                [Bu.hour, 3],
                [Bu.hour, 6],
                [Bu.hour, 12],
                [Bu.day, 1],
                [Bu.day, 2],
                [Bu.week, 1],
                [Bu.month, 1],
                [Bu.month, 3],
                [Bu.year, 1]
            ],
            As = Cs.multi([
                [".%L", function(t) {
                    return t.getMilliseconds()
                }],
                [":%S", function(t) {
                    return t.getSeconds()
                }],
                ["%I:%M", function(t) {
                    return t.getMinutes()
                }],
                ["%I %p", function(t) {
                    return t.getHours()
                }],
                ["%a %d", function(t) {
                    return t.getDay() && 1 != t.getDate()
                }],
                ["%b %d", function(t) {
                    return 1 != t.getDate()
                }],
                ["%B", function(t) {
                    return t.getMonth()
                }],
                ["%Y", Ne]
            ]),
            Ls = {
                range: function(t, e, n) {
                    return Uo.range(Math.ceil(t / n) * n, +e, n).map(Fo)
                },
                floor: m,
                ceil: m
            };
        _s.year = Bu.year, Bu.scale = function() {
            return Ho(Uo.scale.linear(), _s, As)
        };
        var Ds = _s.map(function(t) {
                return [t[0].utc, t[1]]
            }),
            qs = Ts.multi([
                [".%L", function(t) {
                    return t.getUTCMilliseconds()
                }],
                [":%S", function(t) {
                    return t.getUTCSeconds()
                }],
                ["%I:%M", function(t) {
                    return t.getUTCMinutes()
                }],
                ["%I %p", function(t) {
                    return t.getUTCHours()
                }],
                ["%a %d", function(t) {
                    return t.getUTCDay() && 1 != t.getUTCDate()
                }],
                ["%b %d", function(t) {
                    return 1 != t.getUTCDate()
                }],
                ["%B", function(t) {
                    return t.getUTCMonth()
                }],
                ["%Y", Ne]
            ]);
        Ds.year = Bu.year.utc, Bu.scale.utc = function() {
            return Ho(Uo.scale.linear(), Ds, qs)
        }, Uo.text = St(function(t) {
            return t.responseText
        }), Uo.json = function(t, e) {
            return Nt(t, "application/json", zo, e)
        }, Uo.html = function(t, e) {
            return Nt(t, "text/html", Io, e)
        }, Uo.xml = St(function(t) {
            return t.responseXML
        }), "function" == typeof define && define.amd ? (this.d3 = Uo, define(Uo)) : "object" == typeof module && module.exports ? module.exports = Uo : this.d3 = Uo
    }(),
    function(t) {
        var e = !1;
        if ("function" == typeof define && define.amd && (define(t), e = !0), "object" == typeof exports && (module.exports = t(), e = !0), !e) {
            var n = window.Cookies,
                r = window.Cookies = t();
            r.noConflict = function() {
                return window.Cookies = n, r
            }
        }
    }(function() {
        function t() {
            for (var t = 0, e = {}; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) e[r] = n[r]
            }
            return e
        }

        function e(n) {
            function r(e, i, o) {
                var u;
                if ("undefined" != typeof document) {
                    if (arguments.length > 1) {
                        if ("number" == typeof(o = t({
                                path: "/"
                            }, r.defaults, o)).expires) {
                            var a = new Date;
                            a.setMilliseconds(a.getMilliseconds() + 864e5 * o.expires), o.expires = a
                        }
                        o.expires = o.expires ? o.expires.toUTCString() : "";
                        try {
                            u = JSON.stringify(i), /^[\{\[]/.test(u) && (i = u)
                        } catch (t) {}
                        i = n.write ? n.write(i, e) : encodeURIComponent(String(i)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), e = (e = (e = encodeURIComponent(String(e))).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)).replace(/[\(\)]/g, escape);
                        var s = "";
                        for (var c in o) o[c] && (s += "; " + c, !0 !== o[c] && (s += "=" + o[c]));
                        return document.cookie = e + "=" + i + s
                    }
                    e || (u = {});
                    for (var l = document.cookie ? document.cookie.split("; ") : [], f = /(%[0-9A-Z]{2})+/g, h = 0; h < l.length; h++) {
                        var p = l[h].split("="),
                            d = p.slice(1).join("=");
                        '"' === d.charAt(0) && (d = d.slice(1, -1));
                        try {
                            var g = p[0].replace(f, decodeURIComponent);
                            if (d = n.read ? n.read(d, g) : n(d, g) || d.replace(f, decodeURIComponent), this.json) try {
                                d = JSON.parse(d)
                            } catch (t) {}
                            if (e === g) {
                                u = d;
                                break
                            }
                            e || (u[g] = d)
                        } catch (t) {}
                    }
                    return u
                }
            }
            return r.set = r, r.get = function(t) {
                return r.call(r, t)
            }, r.getJSON = function() {
                return r.apply({
                    json: !0
                }, [].slice.call(arguments))
            }, r.defaults = {}, r.remove = function(e, n) {
                r(e, "", t(n, {
                    expires: -1
                }))
            }, r.withConverter = e, r
        }
        return e(function() {})
    }),
    function(t) {
        function e(t, e) {
            for (var n = t.length; n--;)
                if (t[n] === e) return n;
            return -1
        }

        function n(t, e) {
            if (t.length != e.length) return !1;
            for (var n = 0; n < t.length; n++)
                if (t[n] !== e[n]) return !1;
            return !0
        }

        function r(t) {
            for (l in h) h[l] = t[m[l]]
        }

        function i(t) {
            var n, i, a, s, c, l;
            if (n = t.keyCode, -1 == e(y, n) && y.push(n), 93 != n && 224 != n || (n = 91), n in h) {
                h[n] = !0;
                for (a in d) d[a] == n && (o[a] = !0)
            } else if (r(t), o.filter.call(this, t) && n in f)
                for (l = u(), s = 0; s < f[n].length; s++)
                    if ((i = f[n][s]).scope == l || "all" == i.scope) {
                        c = i.mods.length > 0;
                        for (a in h)(!h[a] && e(i.mods, +a) > -1 || h[a] && -1 == e(i.mods, +a)) && (c = !1);
                        (0 != i.mods.length || h[16] || h[18] || h[17] || h[91]) && !c || !1 === i.method(t, i) && (t.preventDefault ? t.preventDefault() : t.returnValue = !1, t.stopPropagation && t.stopPropagation(), t.cancelBubble && (t.cancelBubble = !0))
                    }
        }

        function o(t, e, n) {
            var r, i;
            r = a(t), void 0 === n && (n = e, e = "all");
            for (var o = 0; o < r.length; o++) i = [], (t = r[o].split("+")).length > 1 && (i = s(t), t = [t[t.length - 1]]), t = t[0], (t = v(t)) in f || (f[t] = []), f[t].push({
                shortcut: r[o],
                scope: e,
                method: n,
                key: r[o],
                mods: i
            })
        }

        function u() {
            return p || "all"
        }

        function a(t) {
            var e;
            return t = t.replace(/\s/g, ""), "" == (e = t.split(","))[e.length - 1] && (e[e.length - 2] += ","), e
        }

        function s(t) {
            for (var e = t.slice(0, t.length - 1), n = 0; n < e.length; n++) e[n] = d[e[n]];
            return e
        }

        function c(t, e, n) {
            t.addEventListener ? t.addEventListener(e, n, !1) : t.attachEvent && t.attachEvent("on" + e, function() {
                n(window.event)
            })
        }
        var l, f = {},
            h = {
                16: !1,
                18: !1,
                17: !1,
                91: !1
            },
            p = "all",
            d = {
                "⇧": 16,
                shift: 16,
                "⌥": 18,
                alt: 18,
                option: 18,
                "⌃": 17,
                ctrl: 17,
                control: 17,
                "⌘": 91,
                command: 91
            },
            g = {
                backspace: 8,
                tab: 9,
                clear: 12,
                enter: 13,
                return: 13,
                esc: 27,
                escape: 27,
                space: 32,
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                del: 46,
                delete: 46,
                home: 36,
                end: 35,
                pageup: 33,
                pagedown: 34,
                ",": 188,
                ".": 190,
                "/": 191,
                "`": 192,
                "-": 189,
                "=": 187,
                ";": 186,
                "'": 222,
                "[": 219,
                "]": 221,
                "\\": 220
            },
            v = function(t) {
                return g[t] || t.toUpperCase().charCodeAt(0)
            },
            y = [];
        for (l = 1; l < 20; l++) g["f" + l] = 111 + l;
        var m = {
            16: "shiftKey",
            18: "altKey",
            17: "ctrlKey",
            91: "metaKey"
        };
        for (l in d) o[l] = !1;
        c(document, "keydown", function(t) {
            i(t)
        }), c(document, "keyup", function(t) {
            var n, r = t.keyCode,
                i = e(y, r);
            if (i >= 0 && y.splice(i, 1), 93 != r && 224 != r || (r = 91), r in h) {
                h[r] = !1;
                for (n in d) d[n] == r && (o[n] = !1)
            }
        }), c(window, "focus", function() {
            for (l in h) h[l] = !1;
            for (l in d) o[l] = !1
        });
        var x = t.key;
        t.key = o, t.key.setScope = function(t) {
            p = t || "all"
        }, t.key.getScope = u, t.key.deleteScope = function(t) {
            var e, n, r;
            for (e in f)
                for (n = f[e], r = 0; r < n.length;) n[r].scope === t ? n.splice(r, 1) : r++
        }, t.key.filter = function(t) {
            var e = (t.target || t.srcElement).tagName;
            return !("INPUT" == e || "SELECT" == e || "TEXTAREA" == e)
        }, t.key.isPressed = function(t) {
            return "string" == typeof t && (t = v(t)), -1 != e(y, t)
        }, t.key.getPressedKeyCodes = function() {
            return y.slice(0)
        }, t.key.noConflict = function() {
            var e = t.key;
            return t.key = x, e
        }, t.key.unbind = function(t, e) {
            var r, i, o, c, l, h = [];
            for (r = a(t), c = 0; c < r.length; c++) {
                if ((i = r[c].split("+")).length > 1 && (h = s(i)), t = i[i.length - 1], t = v(t), void 0 === e && (e = u()), !f[t]) return;
                for (o = 0; o < f[t].length; o++)(l = f[t][o]).scope === e && n(l.mods, h) && (f[t][o] = {})
            }
        }, "undefined" != typeof module && (module.exports = o)
    }(this);