try {
    (function(e, t) {
        typeof module == "object" && typeof module.exports == "object" ? module.exports = e.document ? t(e, !0) : function(e) {
            if (!e.document) throw new Error("jQuery requires a window with a document");
            return t(e)
        } : t(e)
    })(typeof window != "undefined" ? window : this, function(window, noGlobal) {
        function isArraylike(e) {
            var t = e.length,
                n = jQuery.type(e);
            return n === "function" || jQuery.isWindow(e) ? !1 : e.nodeType === 1 && t ? !0 : n === "array" || t === 0 || typeof t == "number" && t > 0 && t - 1 in e
        }

        function winnow(e, t, n) {
            if (jQuery.isFunction(t)) return jQuery.grep(e, function(e, r) {
                return !!t.call(e, r, e) !== n
            });
            if (t.nodeType) return jQuery.grep(e, function(e) {
                return e === t !== n
            });
            if (typeof t == "string") {
                if (risSimple.test(t)) return jQuery.filter(t, e, n);
                t = jQuery.filter(t, e)
            }
            return jQuery.grep(e, function(e) {
                return indexOf.call(t, e) >= 0 !== n
            })
        }

        function sibling(e, t) {
            while ((e = e[t]) && e.nodeType !== 1);
            return e
        }

        function createOptions(e) {
            var t = optionsCache[e] = {};
            return jQuery.each(e.match(rnotwhite) || [], function(e, n) {
                t[n] = !0
            }), t
        }

        function completed() {
            document.removeEventListener("DOMContentLoaded", completed, !1), window.removeEventListener("load", completed, !1), jQuery.ready()
        }

        function Data() {
            Object.defineProperty(this.cache = {}, 0, {
                get: function() {
                    return {}
                }
            }), this.expando = jQuery.expando + Math.random()
        }

        function dataAttr(e, t, n) {
            var r;
            if (n === undefined && e.nodeType === 1) {
                r = "data-" + t.replace(rmultiDash, "-$1").toLowerCase(), n = e.getAttribute(r);
                if (typeof n == "string") {
                    try {
                        n = n === "true" ? !0 : n === "false" ? !1 : n === "null" ? null : +n + "" === n ? +n : rbrace.test(n) ? jQuery.parseJSON(n) : n
                    } catch (i) {}
                    data_user.set(e, t, n)
                } else n = undefined
            }
            return n
        }

        function returnTrue() {
            return !0
        }

        function returnFalse() {
            return !1
        }

        function safeActiveElement() {
            try {
                return document.activeElement
            } catch (e) {}
        }

        function manipulationTarget(e, t) {
            return jQuery.nodeName(e, "table") && jQuery.nodeName(t.nodeType !== 11 ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
        }

        function disableScript(e) {
            return e.type = (e.getAttribute("type") !== null) + "/" + e.type, e
        }

        function restoreScript(e) {
            var t = rscriptTypeMasked.exec(e.type);
            return t ? e.type = t[1] : e.removeAttribute("type"), e
        }

        function setGlobalEval(e, t) {
            var n = 0,
                r = e.length;
            for (; n < r; n++) data_priv.set(e[n], "globalEval", !t || data_priv.get(t[n], "globalEval"))
        }

        function cloneCopyEvent(e, t) {
            var n, r, i, s, o, u, a, f;
            if (t.nodeType !== 1) return;
            if (data_priv.hasData(e)) {
                s = data_priv.access(e), o = data_priv.set(t, s), f = s.events;
                if (f) {
                    delete o.handle, o.events = {};
                    for (i in f)
                        for (n = 0, r = f[i].length; n < r; n++) jQuery.event.add(t, i, f[i][n])
                }
            }
            data_user.hasData(e) && (u = data_user.access(e), a = jQuery.extend({}, u), data_user.set(t, a))
        }

        function getAll(e, t) {
            var n = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
            return t === undefined || t && jQuery.nodeName(e, t) ? jQuery.merge([e], n) : n
        }

        function fixInput(e, t) {
            var n = t.nodeName.toLowerCase();
            if (n === "input" && rcheckableType.test(e.type)) t.checked = e.checked;
            else if (n === "input" || n === "textarea") t.defaultValue = e.defaultValue
        }

        function actualDisplay(e, t) {
            var n, r = jQuery(t.createElement(e)).appendTo(t.body),
                i = window.getDefaultComputedStyle && (n = window.getDefaultComputedStyle(r[0])) ? n.display : jQuery.css(r[0], "display");
            return r.detach(), i
        }

        function defaultDisplay(e) {
            var t = document,
                n = elemdisplay[e];
            if (!n) {
                n = actualDisplay(e, t);
                if (n === "none" || !n) iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = iframe[0].contentDocument, t.write(), t.close(), n = actualDisplay(e, t), iframe.detach();
                elemdisplay[e] = n
            }
            return n
        }

        function curCSS(e, t, n) {
            var r, i, s, o, u = e.style;
            return n = n || getStyles(e), n && (o = n.getPropertyValue(t) || n[t]), n && (o === "" && !jQuery.contains(e.ownerDocument, e) && (o = jQuery.style(e, t)), rnumnonpx.test(o) && rmargin.test(t) && (r = u.width, i = u.minWidth, s = u.maxWidth, u.minWidth = u.maxWidth = u.width = o, o = n.width, u.width = r, u.minWidth = i, u.maxWidth = s)), o !== undefined ? o + "" : o
        }

        function addGetHookIf(e, t) {
            return {
                get: function() {
                    if (e()) {
                        delete this.get;
                        return
                    }
                    return (this.get = t).apply(this, arguments)
                }
            }
        }

        function vendorPropName(e, t) {
            if (t in e) return t;
            var n = t[0].toUpperCase() + t.slice(1),
                r = t,
                i = cssPrefixes.length;
            while (i--) {
                t = cssPrefixes[i] + n;
                if (t in e) return t
            }
            return r
        }

        function setPositiveNumber(e, t, n) {
            var r = rnumsplit.exec(t);
            return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
        }

        function augmentWidthOrHeight(e, t, n, r, i) {
            var s = n === (r ? "border" : "content") ? 4 : t === "width" ? 1 : 0,
                o = 0;
            for (; s < 4; s += 2) n === "margin" && (o += jQuery.css(e, n + cssExpand[s], !0, i)), r ? (n === "content" && (o -= jQuery.css(e, "padding" + cssExpand[s], !0, i)), n !== "margin" && (o -= jQuery.css(e, "border" + cssExpand[s] + "Width", !0, i))) : (o += jQuery.css(e, "padding" + cssExpand[s], !0, i), n !== "padding" && (o += jQuery.css(e, "border" + cssExpand[s] + "Width", !0, i)));
            return o
        }

        function getWidthOrHeight(e, t, n) {
            var r = !0,
                i = t === "width" ? e.offsetWidth : e.offsetHeight,
                s = getStyles(e),
                o = jQuery.css(e, "boxSizing", !1, s) === "border-box";
            if (i <= 0 || i == null) {
                i = curCSS(e, t, s);
                if (i < 0 || i == null) i = e.style[t];
                if (rnumnonpx.test(i)) return i;
                r = o && (support.boxSizingReliable() || i === e.style[t]), i = parseFloat(i) || 0
            }
            return i + augmentWidthOrHeight(e, t, n || (o ? "border" : "content"), r, s) + "px"
        }

        function showHide(e, t) {
            var n, r, i, s = [],
                o = 0,
                u = e.length;
            for (; o < u; o++) {
                r = e[o];
                if (!r.style) continue;
                s[o] = data_priv.get(r, "olddisplay"), n = r.style.display, t ? (!s[o] && n === "none" && (r.style.display = ""), r.style.display === "" && isHidden(r) && (s[o] = data_priv.access(r, "olddisplay", defaultDisplay(r.nodeName)))) : (i = isHidden(r), (n !== "none" || !i) && data_priv.set(r, "olddisplay", i ? n : jQuery.css(r, "display")))
            }
            for (o = 0; o < u; o++) {
                r = e[o];
                if (!r.style) continue;
                if (!t || r.style.display === "none" || r.style.display === "") r.style.display = t ? s[o] || "" : "none"
            }
            return e
        }

        function Tween(e, t, n, r, i) {
            return new Tween.prototype.init(e, t, n, r, i)
        }

        function createFxNow() {
            return setTimeout(function() {
                fxNow = undefined
            }), fxNow = jQuery.now()
        }

        function genFx(e, t) {
            var n, r = 0,
                i = {
                    height: e
                };
            t = t ? 1 : 0;
            for (; r < 4; r += 2 - t) n = cssExpand[r], i["margin" + n] = i["padding" + n] = e;
            return t && (i.opacity = i.width = e), i
        }

        function createTween(e, t, n) {
            var r, i = (tweeners[t] || []).concat(tweeners["*"]),
                s = 0,
                o = i.length;
            for (; s < o; s++)
                if (r = i[s].call(n, t, e)) return r
        }

        function defaultPrefilter(e, t, n) {
            var r, i, s, o, u, a, f, l, c = this,
                h = {},
                p = e.style,
                d = e.nodeType && isHidden(e),
                v = data_priv.get(e, "fxshow");
            n.queue || (u = jQuery._queueHooks(e, "fx"), u.unqueued == null && (u.unqueued = 0, a = u.empty.fire, u.empty.fire = function() {
                u.unqueued || a()
            }), u.unqueued++, c.always(function() {
                c.always(function() {
                    u.unqueued--, jQuery.queue(e, "fx").length || u.empty.fire()
                })
            })), e.nodeType === 1 && ("height" in t || "width" in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], f = jQuery.css(e, "display"), l = f === "none" ? data_priv.get(e, "olddisplay") || defaultDisplay(e.nodeName) : f, l === "inline" && jQuery.css(e, "float") === "none" && (p.display = "inline-block")), n.overflow && (p.overflow = "hidden", c.always(function() {
                p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
            }));
            for (r in t) {
                i = t[r];
                if (rfxtypes.exec(i)) {
                    delete t[r], s = s || i === "toggle";
                    if (i === (d ? "hide" : "show")) {
                        if (i !== "show" || !v || v[r] === undefined) continue;
                        d = !0
                    }
                    h[r] = v && v[r] || jQuery.style(e, r)
                } else f = undefined
            }
            if (!jQuery.isEmptyObject(h)) {
                v ? "hidden" in v && (d = v.hidden) : v = data_priv.access(e, "fxshow", {}), s && (v.hidden = !d), d ? jQuery(e).show() : c.done(function() {
                    jQuery(e).hide()
                }), c.done(function() {
                    var t;
                    data_priv.remove(e, "fxshow");
                    for (t in h) jQuery.style(e, t, h[t])
                });
                for (r in h) o = createTween(d ? v[r] : 0, r, c), r in v || (v[r] = o.start, d && (o.end = o.start, o.start = r === "width" || r === "height" ? 1 : 0))
            } else(f === "none" ? defaultDisplay(e.nodeName) : f) === "inline" && (p.display = f)
        }

        function propFilter(e, t) {
            var n, r, i, s, o;
            for (n in e) {
                r = jQuery.camelCase(n), i = t[r], s = e[n], jQuery.isArray(s) && (i = s[1], s = e[n] = s[0]), n !== r && (e[r] = s, delete e[n]), o = jQuery.cssHooks[r];
                if (o && "expand" in o) {
                    s = o.expand(s), delete e[r];
                    for (n in s) n in e || (e[n] = s[n], t[n] = i)
                } else t[r] = i
            }
        }

        function Animation(e, t, n) {
            var r, i, s = 0,
                o = animationPrefilters.length,
                u = jQuery.Deferred().always(function() {
                    delete a.elem
                }),
                a = function() {
                    if (i) return !1;
                    var t = fxNow || createFxNow(),
                        n = Math.max(0, f.startTime + f.duration - t),
                        r = n / f.duration || 0,
                        s = 1 - r,
                        o = 0,
                        a = f.tweens.length;
                    for (; o < a; o++) f.tweens[o].run(s);
                    return u.notifyWith(e, [f, s, n]), s < 1 && a ? n : (u.resolveWith(e, [f]), !1)
                },
                f = u.promise({
                    elem: e,
                    props: jQuery.extend({}, t),
                    opts: jQuery.extend(!0, {
                        specialEasing: {}
                    }, n),
                    originalProperties: t,
                    originalOptions: n,
                    startTime: fxNow || createFxNow(),
                    duration: n.duration,
                    tweens: [],
                    createTween: function(t, n) {
                        var r = jQuery.Tween(e, f.opts, t, n, f.opts.specialEasing[t] || f.opts.easing);
                        return f.tweens.push(r), r
                    },
                    stop: function(t) {
                        var n = 0,
                            r = t ? f.tweens.length : 0;
                        if (i) return this;
                        i = !0;
                        for (; n < r; n++) f.tweens[n].run(1);
                        return t ? u.resolveWith(e, [f, t]) : u.rejectWith(e, [f, t]), this
                    }
                }),
                l = f.props;
            propFilter(l, f.opts.specialEasing);
            for (; s < o; s++) {
                r = animationPrefilters[s].call(f, e, l, f.opts);
                if (r) return r
            }
            return jQuery.map(l, createTween, f), jQuery.isFunction(f.opts.start) && f.opts.start.call(e, f), jQuery.fx.timer(jQuery.extend(a, {
                elem: e,
                anim: f,
                queue: f.opts.queue
            })), f.progress(f.opts.progress).done(f.opts.done, f.opts.complete).fail(f.opts.fail).always(f.opts.always)
        }

        function addToPrefiltersOrTransports(e) {
            return function(t, n) {
                typeof t != "string" && (n = t, t = "*");
                var r, i = 0,
                    s = t.toLowerCase().match(rnotwhite) || [];
                if (jQuery.isFunction(n))
                    while (r = s[i++]) r[0] === "+" ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
            }
        }

        function inspectPrefiltersOrTransports(e, t, n, r) {
            function o(u) {
                var a;
                return i[u] = !0, jQuery.each(e[u] || [], function(e, u) {
                    var f = u(t, n, r);
                    if (typeof f == "string" && !s && !i[f]) return t.dataTypes.unshift(f), o(f), !1;
                    if (s) return !(a = f)
                }), a
            }
            var i = {},
                s = e === transports;
            return o(t.dataTypes[0]) || !i["*"] && o("*")
        }

        function ajaxExtend(e, t) {
            var n, r, i = jQuery.ajaxSettings.flatOptions || {};
            for (n in t) t[n] !== undefined && ((i[n] ? e : r || (r = {}))[n] = t[n]);
            return r && jQuery.extend(!0, e, r), e
        }

        function ajaxHandleResponses(e, t, n) {
            var r, i, s, o, u = e.contents,
                a = e.dataTypes;
            while (a[0] === "*") a.shift(), r === undefined && (r = e.mimeType || t.getResponseHeader("Content-Type"));
            if (r)
                for (i in u)
                    if (u[i] && u[i].test(r)) {
                        a.unshift(i);
                        break
                    } if (a[0] in n) s = a[0];
            else {
                for (i in n) {
                    if (!a[0] || e.converters[i + " " + a[0]]) {
                        s = i;
                        break
                    }
                    o || (o = i)
                }
                s = s || o
            }
            if (s) return s !== a[0] && a.unshift(s), n[s]
        }

        function ajaxConvert(e, t, n, r) {
            var i, s, o, u, a, f = {},
                l = e.dataTypes.slice();
            if (l[1])
                for (o in e.converters) f[o.toLowerCase()] = e.converters[o];
            s = l.shift();
            while (s) {
                e.responseFields[s] && (n[e.responseFields[s]] = t), !a && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), a = s, s = l.shift();
                if (s)
                    if (s === "*") s = a;
                    else if (a !== "*" && a !== s) {
                    o = f[a + " " + s] || f["* " + s];
                    if (!o)
                        for (i in f) {
                            u = i.split(" ");
                            if (u[1] === s) {
                                o = f[a + " " + u[0]] || f["* " + u[0]];
                                if (o) {
                                    o === !0 ? o = f[i] : f[i] !== !0 && (s = u[0], l.unshift(u[1]));
                                    break
                                }
                            }
                        }
                    if (o !== !0)
                        if (o && e["throws"]) t = o(t);
                        else try {
                            t = o(t)
                        } catch (c) {
                            return {
                                state: "parsererror",
                                error: o ? c : "No conversion from " + a + " to " + s
                            }
                        }
                }
            }
            return {
                state: "success",
                data: t
            }
        }

        function buildParams(e, t, n, r) {
            var i;
            if (jQuery.isArray(t)) jQuery.each(t, function(t, i) {
                n || rbracket.test(e) ? r(e, i) : buildParams(e + "[" + (typeof i == "object" ? t : "") + "]", i, n, r)
            });
            else if (!n && jQuery.type(t) === "object")
                for (i in t) buildParams(e + "[" + i + "]", t[i], n, r);
            else r(e, t)
        }

        function getWindow(e) {
            return jQuery.isWindow(e) ? e : e.nodeType === 9 && e.defaultView
        }
        var arr = [],
            slice = arr.slice,
            concat = arr.concat,
            push = arr.push,
            indexOf = arr.indexOf,
            class2type = {},
            toString = class2type.toString,
            hasOwn = class2type.hasOwnProperty,
            support = {},
            document = window.document,
            version = "2.1.1",
            jQuery = function(e, t) {
                return new jQuery.fn.init(e, t)
            },
            rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            rmsPrefix = /^-ms-/,
            rdashAlpha = /-([\da-z])/gi,
            fcamelCase = function(e, t) {
                return t.toUpperCase()
            };
        jQuery.fn = jQuery.prototype = {
            jquery: version,
            constructor: jQuery,
            selector: "",
            length: 0,
            toArray: function() {
                return slice.call(this)
            },
            get: function(e) {
                return e != null ? e < 0 ? this[e + this.length] : this[e] : slice.call(this)
            },
            pushStack: function(e) {
                var t = jQuery.merge(this.constructor(), e);
                return t.prevObject = this, t.context = this.context, t
            },
            each: function(e, t) {
                return jQuery.each(this, e, t)
            },
            map: function(e) {
                return this.pushStack(jQuery.map(this, function(t, n) {
                    return e.call(t, n, t)
                }))
            },
            slice: function() {
                return this.pushStack(slice.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(e) {
                var t = this.length,
                    n = +e + (e < 0 ? t : 0);
                return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
            },
            end: function() {
                return this.prevObject || this.constructor(null)
            },
            push: push,
            sort: arr.sort,
            splice: arr.splice
        }, jQuery.extend = jQuery.fn.extend = function() {
            var e, t, n, r, i, s, o = arguments[0] || {},
                u = 1,
                a = arguments.length,
                f = !1;
            typeof o == "boolean" && (f = o, o = arguments[u] || {}, u++), typeof o != "object" && !jQuery.isFunction(o) && (o = {}), u === a && (o = this, u--);
            for (; u < a; u++)
                if ((e = arguments[u]) != null)
                    for (t in e) {
                        n = o[t], r = e[t];
                        if (o === r) continue;
                        f && r && (jQuery.isPlainObject(r) || (i = jQuery.isArray(r))) ? (i ? (i = !1, s = n && jQuery.isArray(n) ? n : []) : s = n && jQuery.isPlainObject(n) ? n : {}, o[t] = jQuery.extend(f, s, r)) : r !== undefined && (o[t] = r)
                    }
            return o
        }, jQuery.extend({
            expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(e) {
                throw new Error(e)
            },
            noop: function() {},
            isFunction: function(e) {
                return jQuery.type(e) === "function"
            },
            isArray: Array.isArray,
            isWindow: function(e) {
                return e != null && e === e.window
            },
            isNumeric: function(e) {
                return !jQuery.isArray(e) && e - parseFloat(e) >= 0
            },
            isPlainObject: function(e) {
                return jQuery.type(e) !== "object" || e.nodeType || jQuery.isWindow(e) ? !1 : e.constructor && !hasOwn.call(e.constructor.prototype, "isPrototypeOf") ? !1 : !0
            },
            isEmptyObject: function(e) {
                var t;
                for (t in e) return !1;
                return !0
            },
            type: function(e) {
                return e == null ? e + "" : typeof e == "object" || typeof e == "function" ? class2type[toString.call(e)] || "object" : typeof e
            },
            globalEval: function(code) {
                var script, indirect = eval;
                code = jQuery.trim(code), code && (code.indexOf("use strict") === 1 ? (script = document.createElement("script"), script.text = code, document.head.appendChild(script).parentNode.removeChild(script)) : indirect(code))
            },
            camelCase: function(e) {
                return e.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase)
            },
            nodeName: function(e, t) {
                return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
            },
            each: function(e, t, n) {
                var r, i = 0,
                    s = e.length,
                    o = isArraylike(e);
                if (n)
                    if (o)
                        for (; i < s; i++) {
                            r = t.apply(e[i], n);
                            if (r === !1) break
                        } else
                            for (i in e) {
                                r = t.apply(e[i], n);
                                if (r === !1) break
                            } else if (o)
                                for (; i < s; i++) {
                                    r = t.call(e[i], i, e[i]);
                                    if (r === !1) break
                                } else
                                    for (i in e) {
                                        r = t.call(e[i], i, e[i]);
                                        if (r === !1) break
                                    }
                return e
            },
            trim: function(e) {
                return e == null ? "" : (e + "").replace(rtrim, "")
            },
            makeArray: function(e, t) {
                var n = t || [];
                return e != null && (isArraylike(Object(e)) ? jQuery.merge(n, typeof e == "string" ? [e] : e) : push.call(n, e)), n
            },
            inArray: function(e, t, n) {
                return t == null ? -1 : indexOf.call(t, e, n)
            },
            merge: function(e, t) {
                var n = +t.length,
                    r = 0,
                    i = e.length;
                for (; r < n; r++) e[i++] = t[r];
                return e.length = i, e
            },
            grep: function(e, t, n) {
                var r, i = [],
                    s = 0,
                    o = e.length,
                    u = !n;
                for (; s < o; s++) r = !t(e[s], s), r !== u && i.push(e[s]);
                return i
            },
            map: function(e, t, n) {
                var r, i = 0,
                    s = e.length,
                    o = isArraylike(e),
                    u = [];
                if (o)
                    for (; i < s; i++) r = t(e[i], i, n), r != null && u.push(r);
                else
                    for (i in e) r = t(e[i], i, n), r != null && u.push(r);
                return concat.apply([], u)
            },
            guid: 1,
            proxy: function(e, t) {
                var n, r, i;
                return typeof t == "string" && (n = e[t], t = e, e = n), jQuery.isFunction(e) ? (r = slice.call(arguments, 2), i = function() {
                    return e.apply(t || this, r.concat(slice.call(arguments)))
                }, i.guid = e.guid = e.guid || jQuery.guid++, i) : undefined
            },
            now: Date.now,
            support: support
        }), jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
            class2type["[object " + t + "]"] = t.toLowerCase()
        });
        var Sizzle = function(e) {
            function st(e, t, r, i) {
                var s, u, f, l, c, d, g, y, S, x;
                (t ? t.ownerDocument || t : E) !== p && h(t), t = t || p, r = r || [];
                if (!e || typeof e != "string") return r;
                if ((l = t.nodeType) !== 1 && l !== 9) return [];
                if (v && !i) {
                    if (s = Z.exec(e))
                        if (f = s[1]) {
                            if (l === 9) {
                                u = t.getElementById(f);
                                if (!u || !u.parentNode) return r;
                                if (u.id === f) return r.push(u), r
                            } else if (t.ownerDocument && (u = t.ownerDocument.getElementById(f)) && b(t, u) && u.id === f) return r.push(u), r
                        } else {
                            if (s[2]) return P.apply(r, t.getElementsByTagName(e)), r;
                            if ((f = s[3]) && n.getElementsByClassName && t.getElementsByClassName) return P.apply(r, t.getElementsByClassName(f)), r
                        } if (n.qsa && (!m || !m.test(e))) {
                        y = g = w, S = t, x = l === 9 && e;
                        if (l === 1 && t.nodeName.toLowerCase() !== "object") {
                            d = o(e), (g = t.getAttribute("id")) ? y = g.replace(tt, "\\$&") : t.setAttribute("id", y), y = "[id='" + y + "'] ", c = d.length;
                            while (c--) d[c] = y + mt(d[c]);
                            S = et.test(e) && dt(t.parentNode) || t, x = d.join(",")
                        }
                        if (x) try {
                            return P.apply(r, S.querySelectorAll(x)), r
                        } catch (T) {} finally {
                            g || t.removeAttribute("id")
                        }
                    }
                }
                return a(e.replace(z, "$1"), t, r, i)
            }

            function ot() {
                function t(n, i) {
                    return e.push(n + " ") > r.cacheLength && delete t[e.shift()], t[n + " "] = i
                }
                var e = [];
                return t
            }

            function ut(e) {
                return e[w] = !0, e
            }

            function at(e) {
                var t = p.createElement("div");
                try {
                    return !!e(t)
                } catch (n) {
                    return !1
                } finally {
                    t.parentNode && t.parentNode.removeChild(t), t = null
                }
            }

            function ft(e, t) {
                var n = e.split("|"),
                    i = e.length;
                while (i--) r.attrHandle[n[i]] = t
            }

            function lt(e, t) {
                var n = t && e,
                    r = n && e.nodeType === 1 && t.nodeType === 1 && (~t.sourceIndex || A) - (~e.sourceIndex || A);
                if (r) return r;
                if (n)
                    while (n = n.nextSibling)
                        if (n === t) return -1;
                return e ? 1 : -1
            }

            function ct(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return n === "input" && t.type === e
                }
            }

            function ht(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return (n === "input" || n === "button") && t.type === e
                }
            }

            function pt(e) {
                return ut(function(t) {
                    return t = +t, ut(function(n, r) {
                        var i, s = e([], n.length, t),
                            o = s.length;
                        while (o--) n[i = s[o]] && (n[i] = !(r[i] = n[i]))
                    })
                })
            }

            function dt(e) {
                return e && typeof e.getElementsByTagName !== L && e
            }

            function vt() {}

            function mt(e) {
                var t = 0,
                    n = e.length,
                    r = "";
                for (; t < n; t++) r += e[t].value;
                return r
            }

            function gt(e, t, n) {
                var r = t.dir,
                    i = n && r === "parentNode",
                    s = x++;
                return t.first ? function(t, n, s) {
                    while (t = t[r])
                        if (t.nodeType === 1 || i) return e(t, n, s)
                } : function(t, n, o) {
                    var u, a, f = [S, s];
                    if (o) {
                        while (t = t[r])
                            if (t.nodeType === 1 || i)
                                if (e(t, n, o)) return !0
                    } else
                        while (t = t[r])
                            if (t.nodeType === 1 || i) {
                                a = t[w] || (t[w] = {});
                                if ((u = a[r]) && u[0] === S && u[1] === s) return f[2] = u[2];
                                a[r] = f;
                                if (f[2] = e(t, n, o)) return !0
                            }
                }
            }

            function yt(e) {
                return e.length > 1 ? function(t, n, r) {
                    var i = e.length;
                    while (i--)
                        if (!e[i](t, n, r)) return !1;
                    return !0
                } : e[0]
            }

            function bt(e, t, n) {
                var r = 0,
                    i = t.length;
                for (; r < i; r++) st(e, t[r], n);
                return n
            }

            function wt(e, t, n, r, i) {
                var s, o = [],
                    u = 0,
                    a = e.length,
                    f = t != null;
                for (; u < a; u++)
                    if (s = e[u])
                        if (!n || n(s, r, i)) o.push(s), f && t.push(u);
                return o
            }

            function Et(e, t, n, r, i, s) {
                return r && !r[w] && (r = Et(r)), i && !i[w] && (i = Et(i, s)), ut(function(s, o, u, a) {
                    var f, l, c, h = [],
                        p = [],
                        d = o.length,
                        v = s || bt(t || "*", u.nodeType ? [u] : u, []),
                        m = e && (s || !t) ? wt(v, h, e, u, a) : v,
                        g = n ? i || (s ? e : d || r) ? [] : o : m;
                    n && n(m, g, u, a);
                    if (r) {
                        f = wt(g, p), r(f, [], u, a), l = f.length;
                        while (l--)
                            if (c = f[l]) g[p[l]] = !(m[p[l]] = c)
                    }
                    if (s) {
                        if (i || e) {
                            if (i) {
                                f = [], l = g.length;
                                while (l--)(c = g[l]) && f.push(m[l] = c);
                                i(null, g = [], f, a)
                            }
                            l = g.length;
                            while (l--)(c = g[l]) && (f = i ? B.call(s, c) : h[l]) > -1 && (s[f] = !(o[f] = c))
                        }
                    } else g = wt(g === o ? g.splice(d, g.length) : g), i ? i(null, o, g, a) : P.apply(o, g)
                })
            }

            function St(e) {
                var t, n, i, s = e.length,
                    o = r.relative[e[0].type],
                    u = o || r.relative[" "],
                    a = o ? 1 : 0,
                    l = gt(function(e) {
                        return e === t
                    }, u, !0),
                    c = gt(function(e) {
                        return B.call(t, e) > -1
                    }, u, !0),
                    h = [function(e, n, r) {
                        return !o && (r || n !== f) || ((t = n).nodeType ? l(e, n, r) : c(e, n, r))
                    }];
                for (; a < s; a++)
                    if (n = r.relative[e[a].type]) h = [gt(yt(h), n)];
                    else {
                        n = r.filter[e[a].type].apply(null, e[a].matches);
                        if (n[w]) {
                            i = ++a;
                            for (; i < s; i++)
                                if (r.relative[e[i].type]) break;
                            return Et(a > 1 && yt(h), a > 1 && mt(e.slice(0, a - 1).concat({
                                value: e[a - 2].type === " " ? "*" : ""
                            })).replace(z, "$1"), n, a < i && St(e.slice(a, i)), i < s && St(e = e.slice(i)), i < s && mt(e))
                        }
                        h.push(n)
                    } return yt(h)
            }

            function xt(e, t) {
                var n = t.length > 0,
                    i = e.length > 0,
                    s = function(s, o, u, a, l) {
                        var c, h, d, v = 0,
                            m = "0",
                            g = s && [],
                            y = [],
                            b = f,
                            w = s || i && r.find.TAG("*", l),
                            E = S += b == null ? 1 : Math.random() || .1,
                            x = w.length;
                        l && (f = o !== p && o);
                        for (; m !== x && (c = w[m]) != null; m++) {
                            if (i && c) {
                                h = 0;
                                while (d = e[h++])
                                    if (d(c, o, u)) {
                                        a.push(c);
                                        break
                                    } l && (S = E)
                            }
                            n && ((c = !d && c) && v--, s && g.push(c))
                        }
                        v += m;
                        if (n && m !== v) {
                            h = 0;
                            while (d = t[h++]) d(g, y, o, u);
                            if (s) {
                                if (v > 0)
                                    while (m--) !g[m] && !y[m] && (y[m] = _.call(a));
                                y = wt(y)
                            }
                            P.apply(a, y), l && !s && y.length > 0 && v + t.length > 1 && st.uniqueSort(a)
                        }
                        return l && (S = E, f = b), g
                    };
                return n ? ut(s) : s
            }
            var t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w = "sizzle" + -(new Date),
                E = e.document,
                S = 0,
                x = 0,
                T = ot(),
                N = ot(),
                C = ot(),
                k = function(e, t) {
                    return e === t && (c = !0), 0
                },
                L = typeof undefined,
                A = 1 << 31,
                O = {}.hasOwnProperty,
                M = [],
                _ = M.pop,
                D = M.push,
                P = M.push,
                H = M.slice,
                B = M.indexOf || function(e) {
                    var t = 0,
                        n = this.length;
                    for (; t < n; t++)
                        if (this[t] === e) return t;
                    return -1
                },
                j = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                F = "[\\x20\\t\\r\\n\\f]",
                I = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                q = I.replace("w", "w#"),
                R = "\\[" + F + "*(" + I + ")(?:" + F + "*([*^$|!~]?=)" + F + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + q + "))|)" + F + "*\\]",
                U = ":(" + I + ")(?:\\((" + "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + "((?:\\\\.|[^\\\\()[\\]]|" + R + ")*)|" + ".*" + ")\\)|)",
                z = new RegExp("^" + F + "+|((?:^|[^\\\\])(?:\\\\.)*)" + F + "+$", "g"),
                W = new RegExp("^" + F + "*," + F + "*"),
                X = new RegExp("^" + F + "*([>+~]|" + F + ")" + F + "*"),
                V = new RegExp("=" + F + "*([^\\]'\"]*?)" + F + "*\\]", "g"),
                $ = new RegExp(U),
                J = new RegExp("^" + q + "$"),
                K = {
                    ID: new RegExp("^#(" + I + ")"),
                    CLASS: new RegExp("^\\.(" + I + ")"),
                    TAG: new RegExp("^(" + I.replace("w", "w*") + ")"),
                    ATTR: new RegExp("^" + R),
                    PSEUDO: new RegExp("^" + U),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + F + "*(even|odd|(([+-]|)(\\d*)n|)" + F + "*(?:([+-]|)" + F + "*(\\d+)|))" + F + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + j + ")$", "i"),
                    needsContext: new RegExp("^" + F + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + F + "*((?:-\\d)?\\d*)" + F + "*\\)|)(?=[^-]|$)", "i")
                },
                Q = /^(?:input|select|textarea|button)$/i,
                G = /^h\d$/i,
                Y = /^[^{]+\{\s*\[native \w/,
                Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                et = /[+~]/,
                tt = /'|\\/g,
                nt = new RegExp("\\\\([\\da-f]{1,6}" + F + "?|(" + F + ")|.)", "ig"),
                rt = function(e, t, n) {
                    var r = "0x" + t - 65536;
                    return r !== r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, r & 1023 | 56320)
                };
            try {
                P.apply(M = H.call(E.childNodes), E.childNodes), M[E.childNodes.length].nodeType
            } catch (it) {
                P = {
                    apply: M.length ? function(e, t) {
                        D.apply(e, H.call(t))
                    } : function(e, t) {
                        var n = e.length,
                            r = 0;
                        while (e[n++] = t[r++]);
                        e.length = n - 1
                    }
                }
            }
            n = st.support = {}, s = st.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return t ? t.nodeName !== "HTML" : !1
            }, h = st.setDocument = function(e) {
                var t, i = e ? e.ownerDocument || e : E,
                    o = i.defaultView;
                if (i === p || i.nodeType !== 9 || !i.documentElement) return p;
                p = i, d = i.documentElement, v = !s(i), o && o !== o.top && (o.addEventListener ? o.addEventListener("unload", function() {
                    h()
                }, !1) : o.attachEvent && o.attachEvent("onunload", function() {
                    h()
                })), n.attributes = at(function(e) {
                    return e.className = "i", !e.getAttribute("className")
                }), n.getElementsByTagName = at(function(e) {
                    return e.appendChild(i.createComment("")), !e.getElementsByTagName("*").length
                }), n.getElementsByClassName = Y.test(i.getElementsByClassName) && at(function(e) {
                    return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", e.getElementsByClassName("i").length === 2
                }), n.getById = at(function(e) {
                    return d.appendChild(e).id = w, !i.getElementsByName || !i.getElementsByName(w).length
                }), n.getById ? (r.find.ID = function(e, t) {
                    if (typeof t.getElementById !== L && v) {
                        var n = t.getElementById(e);
                        return n && n.parentNode ? [n] : []
                    }
                }, r.filter.ID = function(e) {
                    var t = e.replace(nt, rt);
                    return function(e) {
                        return e.getAttribute("id") === t
                    }
                }) : (delete r.find.ID, r.filter.ID = function(e) {
                    var t = e.replace(nt, rt);
                    return function(e) {
                        var n = typeof e.getAttributeNode !== L && e.getAttributeNode("id");
                        return n && n.value === t
                    }
                }), r.find.TAG = n.getElementsByTagName ? function(e, t) {
                    if (typeof t.getElementsByTagName !== L) return t.getElementsByTagName(e)
                } : function(e, t) {
                    var n, r = [],
                        i = 0,
                        s = t.getElementsByTagName(e);
                    if (e === "*") {
                        while (n = s[i++]) n.nodeType === 1 && r.push(n);
                        return r
                    }
                    return s
                }, r.find.CLASS = n.getElementsByClassName && function(e, t) {
                    if (typeof t.getElementsByClassName !== L && v) return t.getElementsByClassName(e)
                }, g = [], m = [];
                if (n.qsa = Y.test(i.querySelectorAll)) at(function(e) {
                    e.innerHTML = "<select msallowclip=''><option selected=''></option></select>", e.querySelectorAll("[msallowclip^='']").length && m.push("[*^$]=" + F + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || m.push("\\[" + F + "*(?:value|" + j + ")"), e.querySelectorAll(":checked").length || m.push(":checked")
                }), at(function(e) {
                    var t = i.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && m.push("name" + F + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || m.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), m.push(",.*:")
                });
                return (n.matchesSelector = Y.test(y = d.matches || d.webkitMatchesSelector || d.mozMatchesSelector || d.oMatchesSelector || d.msMatchesSelector)) && at(function(e) {
                    n.disconnectedMatch = y.call(e, "div"), y.call(e, "[s!='']:x"), g.push("!=", U)
                }), m = m.length && new RegExp(m.join("|")), g = g.length && new RegExp(g.join("|")), t = Y.test(d.compareDocumentPosition), b = t || Y.test(d.contains) ? function(e, t) {
                    var n = e.nodeType === 9 ? e.documentElement : e,
                        r = t && t.parentNode;
                    return e === r || !!r && r.nodeType === 1 && !!(n.contains ? n.contains(r) : e.compareDocumentPosition && e.compareDocumentPosition(r) & 16)
                } : function(e, t) {
                    if (t)
                        while (t = t.parentNode)
                            if (t === e) return !0;
                    return !1
                }, k = t ? function(e, t) {
                    if (e === t) return c = !0, 0;
                    var r = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return r ? r : (r = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, r & 1 || !n.sortDetached && t.compareDocumentPosition(e) === r ? e === i || e.ownerDocument === E && b(E, e) ? -1 : t === i || t.ownerDocument === E && b(E, t) ? 1 : l ? B.call(l, e) - B.call(l, t) : 0 : r & 4 ? -1 : 1)
                } : function(e, t) {
                    if (e === t) return c = !0, 0;
                    var n, r = 0,
                        s = e.parentNode,
                        o = t.parentNode,
                        u = [e],
                        a = [t];
                    if (!s || !o) return e === i ? -1 : t === i ? 1 : s ? -1 : o ? 1 : l ? B.call(l, e) - B.call(l, t) : 0;
                    if (s === o) return lt(e, t);
                    n = e;
                    while (n = n.parentNode) u.unshift(n);
                    n = t;
                    while (n = n.parentNode) a.unshift(n);
                    while (u[r] === a[r]) r++;
                    return r ? lt(u[r], a[r]) : u[r] === E ? -1 : a[r] === E ? 1 : 0
                }, i
            }, st.matches = function(e, t) {
                return st(e, null, null, t)
            }, st.matchesSelector = function(e, t) {
                (e.ownerDocument || e) !== p && h(e), t = t.replace(V, "='$1']");
                if (n.matchesSelector && v && (!g || !g.test(t)) && (!m || !m.test(t))) try {
                    var r = y.call(e, t);
                    if (r || n.disconnectedMatch || e.document && e.document.nodeType !== 11) return r
                } catch (i) {}
                return st(t, p, null, [e]).length > 0
            }, st.contains = function(e, t) {
                return (e.ownerDocument || e) !== p && h(e), b(e, t)
            }, st.attr = function(e, t) {
                (e.ownerDocument || e) !== p && h(e);
                var i = r.attrHandle[t.toLowerCase()],
                    s = i && O.call(r.attrHandle, t.toLowerCase()) ? i(e, t, !v) : undefined;
                return s !== undefined ? s : n.attributes || !v ? e.getAttribute(t) : (s = e.getAttributeNode(t)) && s.specified ? s.value : null
            }, st.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, st.uniqueSort = function(e) {
                var t, r = [],
                    i = 0,
                    s = 0;
                c = !n.detectDuplicates, l = !n.sortStable && e.slice(0), e.sort(k);
                if (c) {
                    while (t = e[s++]) t === e[s] && (i = r.push(s));
                    while (i--) e.splice(r[i], 1)
                }
                return l = null, e
            }, i = st.getText = function(e) {
                var t, n = "",
                    r = 0,
                    s = e.nodeType;
                if (!s)
                    while (t = e[r++]) n += i(t);
                else if (s === 1 || s === 9 || s === 11) {
                    if (typeof e.textContent == "string") return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling) n += i(e)
                } else if (s === 3 || s === 4) return e.nodeValue;
                return n
            }, r = st.selectors = {
                cacheLength: 50,
                createPseudo: ut,
                match: K,
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
                    ATTR: function(e) {
                        return e[1] = e[1].replace(nt, rt), e[3] = (e[3] || e[4] || e[5] || "").replace(nt, rt), e[2] === "~=" && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), e[1].slice(0, 3) === "nth" ? (e[3] || st.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * (e[3] === "even" || e[3] === "odd")), e[5] = +(e[7] + e[8] || e[3] === "odd")) : e[3] && st.error(e[0]), e
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[6] && e[2];
                        return K.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && $.test(n) && (t = o(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(nt, rt).toLowerCase();
                        return e === "*" ? function() {
                            return !0
                        } : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function(e) {
                        var t = T[e + " "];
                        return t || (t = new RegExp("(^|" + F + ")" + e + "(" + F + "|$)")) && T(e, function(e) {
                            return t.test(typeof e.className == "string" && e.className || typeof e.getAttribute !== L && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(e, t, n) {
                        return function(r) {
                            var i = st.attr(r, e);
                            return i == null ? t === "!=" : t ? (i += "", t === "=" ? i === n : t === "!=" ? i !== n : t === "^=" ? n && i.indexOf(n) === 0 : t === "*=" ? n && i.indexOf(n) > -1 : t === "$=" ? n && i.slice(-n.length) === n : t === "~=" ? (" " + i + " ").indexOf(n) > -1 : t === "|=" ? i === n || i.slice(0, n.length + 1) === n + "-" : !1) : !0
                        }
                    },
                    CHILD: function(e, t, n, r, i) {
                        var s = e.slice(0, 3) !== "nth",
                            o = e.slice(-4) !== "last",
                            u = t === "of-type";
                        return r === 1 && i === 0 ? function(e) {
                            return !!e.parentNode
                        } : function(t, n, a) {
                            var f, l, c, h, p, d, v = s !== o ? "nextSibling" : "previousSibling",
                                m = t.parentNode,
                                g = u && t.nodeName.toLowerCase(),
                                y = !a && !u;
                            if (m) {
                                if (s) {
                                    while (v) {
                                        c = t;
                                        while (c = c[v])
                                            if (u ? c.nodeName.toLowerCase() === g : c.nodeType === 1) return !1;
                                        d = v = e === "only" && !d && "nextSibling"
                                    }
                                    return !0
                                }
                                d = [o ? m.firstChild : m.lastChild];
                                if (o && y) {
                                    l = m[w] || (m[w] = {}), f = l[e] || [], p = f[0] === S && f[1], h = f[0] === S && f[2], c = p && m.childNodes[p];
                                    while (c = ++p && c && c[v] || (h = p = 0) || d.pop())
                                        if (c.nodeType === 1 && ++h && c === t) {
                                            l[e] = [S, p, h];
                                            break
                                        }
                                } else if (y && (f = (t[w] || (t[w] = {}))[e]) && f[0] === S) h = f[1];
                                else
                                    while (c = ++p && c && c[v] || (h = p = 0) || d.pop())
                                        if ((u ? c.nodeName.toLowerCase() === g : c.nodeType === 1) && ++h) {
                                            y && ((c[w] || (c[w] = {}))[e] = [S, h]);
                                            if (c === t) break
                                        } return h -= i, h === r || h % r === 0 && h / r >= 0
                            }
                        }
                    },
                    PSEUDO: function(e, t) {
                        var n, i = r.pseudos[e] || r.setFilters[e.toLowerCase()] || st.error("unsupported pseudo: " + e);
                        return i[w] ? i(t) : i.length > 1 ? (n = [e, e, "", t], r.setFilters.hasOwnProperty(e.toLowerCase()) ? ut(function(e, n) {
                            var r, s = i(e, t),
                                o = s.length;
                            while (o--) r = B.call(e, s[o]), e[r] = !(n[r] = s[o])
                        }) : function(e) {
                            return i(e, 0, n)
                        }) : i
                    }
                },
                pseudos: {
                    not: ut(function(e) {
                        var t = [],
                            n = [],
                            r = u(e.replace(z, "$1"));
                        return r[w] ? ut(function(e, t, n, i) {
                            var s, o = r(e, null, i, []),
                                u = e.length;
                            while (u--)
                                if (s = o[u]) e[u] = !(t[u] = s)
                        }) : function(e, i, s) {
                            return t[0] = e, r(t, null, s, n), !n.pop()
                        }
                    }),
                    has: ut(function(e) {
                        return function(t) {
                            return st(e, t).length > 0
                        }
                    }),
                    contains: ut(function(e) {
                        return function(t) {
                            return (t.textContent || t.innerText || i(t)).indexOf(e) > -1
                        }
                    }),
                    lang: ut(function(e) {
                        return J.test(e || "") || st.error("unsupported lang: " + e), e = e.replace(nt, rt).toLowerCase(),
                            function(t) {
                                var n;
                                do
                                    if (n = v ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || n.indexOf(e + "-") === 0; while ((t = t.parentNode) && t.nodeType === 1);
                                return !1
                            }
                    }),
                    target: function(t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id
                    },
                    root: function(e) {
                        return e === d
                    },
                    focus: function(e) {
                        return e === p.activeElement && (!p.hasFocus || p.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: function(e) {
                        return e.disabled === !1
                    },
                    disabled: function(e) {
                        return e.disabled === !0
                    },
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return t === "input" && !!e.checked || t === "option" && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !r.pseudos.empty(e)
                    },
                    header: function(e) {
                        return G.test(e.nodeName)
                    },
                    input: function(e) {
                        return Q.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return t === "input" && e.type === "button" || t === "button"
                    },
                    text: function(e) {
                        var t;
                        return e.nodeName.toLowerCase() === "input" && e.type === "text" && ((t = e.getAttribute("type")) == null || t.toLowerCase() === "text")
                    },
                    first: pt(function() {
                        return [0]
                    }),
                    last: pt(function(e, t) {
                        return [t - 1]
                    }),
                    eq: pt(function(e, t, n) {
                        return [n < 0 ? n + t : n]
                    }),
                    even: pt(function(e, t) {
                        var n = 0;
                        for (; n < t; n += 2) e.push(n);
                        return e
                    }),
                    odd: pt(function(e, t) {
                        var n = 1;
                        for (; n < t; n += 2) e.push(n);
                        return e
                    }),
                    lt: pt(function(e, t, n) {
                        var r = n < 0 ? n + t : n;
                        for (; --r >= 0;) e.push(r);
                        return e
                    }),
                    gt: pt(function(e, t, n) {
                        var r = n < 0 ? n + t : n;
                        for (; ++r < t;) e.push(r);
                        return e
                    })
                }
            }, r.pseudos.nth = r.pseudos.eq;
            for (t in {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) r.pseudos[t] = ct(t);
            for (t in {
                    submit: !0,
                    reset: !0
                }) r.pseudos[t] = ht(t);
            return vt.prototype = r.filters = r.pseudos, r.setFilters = new vt, o = st.tokenize = function(e, t) {
                    var n, i, s, o, u, a, f, l = N[e + " "];
                    if (l) return t ? 0 : l.slice(0);
                    u = e, a = [], f = r.preFilter;
                    while (u) {
                        if (!n || (i = W.exec(u))) i && (u = u.slice(i[0].length) || u), a.push(s = []);
                        n = !1;
                        if (i = X.exec(u)) n = i.shift(), s.push({
                            value: n,
                            type: i[0].replace(z, " ")
                        }), u = u.slice(n.length);
                        for (o in r.filter)(i = K[o].exec(u)) && (!f[o] || (i = f[o](i))) && (n = i.shift(), s.push({
                            value: n,
                            type: o,
                            matches: i
                        }), u = u.slice(n.length));
                        if (!n) break
                    }
                    return t ? u.length : u ? st.error(e) : N(e, a).slice(0)
                }, u = st.compile = function(e, t) {
                    var n, r = [],
                        i = [],
                        s = C[e + " "];
                    if (!s) {
                        t || (t = o(e)), n = t.length;
                        while (n--) s = St(t[n]), s[w] ? r.push(s) : i.push(s);
                        s = C(e, xt(i, r)), s.selector = e
                    }
                    return s
                }, a = st.select = function(e, t, i, s) {
                    var a, f, l, c, h, p = typeof e == "function" && e,
                        d = !s && o(e = p.selector || e);
                    i = i || [];
                    if (d.length === 1) {
                        f = d[0] = d[0].slice(0);
                        if (f.length > 2 && (l = f[0]).type === "ID" && n.getById && t.nodeType === 9 && v && r.relative[f[1].type]) {
                            t = (r.find.ID(l.matches[0].replace(nt, rt), t) || [])[0];
                            if (!t) return i;
                            p && (t = t.parentNode), e = e.slice(f.shift().value.length)
                        }
                        a = K.needsContext.test(e) ? 0 : f.length;
                        while (a--) {
                            l = f[a];
                            if (r.relative[c = l.type]) break;
                            if (h = r.find[c])
                                if (s = h(l.matches[0].replace(nt, rt), et.test(f[0].type) && dt(t.parentNode) || t)) {
                                    f.splice(a, 1), e = s.length && mt(f);
                                    if (!e) return P.apply(i, s), i;
                                    break
                                }
                        }
                    }
                    return (p || u(e, d))(s, t, !v, i, et.test(e) && dt(t.parentNode) || t), i
                }, n.sortStable =
                w.split("").sort(k).join("") === w, n.detectDuplicates = !!c, h(), n.sortDetached = at(function(e) {
                    return e.compareDocumentPosition(p.createElement("div")) & 1
                }), at(function(e) {
                    return e.innerHTML = "<a href='#'></a>", e.firstChild.getAttribute("href") === "#"
                }) || ft("type|href|height|width", function(e, t, n) {
                    if (!n) return e.getAttribute(t, t.toLowerCase() === "type" ? 1 : 2)
                }), (!n.attributes || !at(function(e) {
                    return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), e.firstChild.getAttribute("value") === ""
                })) && ft("value", function(e, t, n) {
                    if (!n && e.nodeName.toLowerCase() === "input") return e.defaultValue
                }), at(function(e) {
                    return e.getAttribute("disabled") == null
                }) || ft(j, function(e, t, n) {
                    var r;
                    if (!n) return e[t] === !0 ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
                }), st
        }(window);
        jQuery.find = Sizzle, jQuery.expr = Sizzle.selectors, jQuery.expr[":"] = jQuery.expr.pseudos, jQuery.unique = Sizzle.uniqueSort, jQuery.text = Sizzle.getText, jQuery.isXMLDoc = Sizzle.isXML, jQuery.contains = Sizzle.contains;
        var rneedsContext = jQuery.expr.match.needsContext,
            rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            risSimple = /^.[^:#\[\.,]*$/;
        jQuery.filter = function(e, t, n) {
            var r = t[0];
            return n && (e = ":not(" + e + ")"), t.length === 1 && r.nodeType === 1 ? jQuery.find.matchesSelector(r, e) ? [r] : [] : jQuery.find.matches(e, jQuery.grep(t, function(e) {
                return e.nodeType === 1
            }))
        }, jQuery.fn.extend({
            find: function(e) {
                var t, n = this.length,
                    r = [],
                    i = this;
                if (typeof e != "string") return this.pushStack(jQuery(e).filter(function() {
                    for (t = 0; t < n; t++)
                        if (jQuery.contains(i[t], this)) return !0
                }));
                for (t = 0; t < n; t++) jQuery.find(e, i[t], r);
                return r = this.pushStack(n > 1 ? jQuery.unique(r) : r), r.selector = this.selector ? this.selector + " " + e : e, r
            },
            filter: function(e) {
                return this.pushStack(winnow(this, e || [], !1))
            },
            not: function(e) {
                return this.pushStack(winnow(this, e || [], !0))
            },
            is: function(e) {
                return !!winnow(this, typeof e == "string" && rneedsContext.test(e) ? jQuery(e) : e || [], !1).length
            }
        });
        var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
            init = jQuery.fn.init = function(e, t) {
                var n, r;
                if (!e) return this;
                if (typeof e == "string") {
                    e[0] === "<" && e[e.length - 1] === ">" && e.length >= 3 ? n = [null, e, null] : n = rquickExpr.exec(e);
                    if (n && (n[1] || !t)) {
                        if (n[1]) {
                            t = t instanceof jQuery ? t[0] : t, jQuery.merge(this, jQuery.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : document, !0));
                            if (rsingleTag.test(n[1]) && jQuery.isPlainObject(t))
                                for (n in t) jQuery.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                            return this
                        }
                        return r = document.getElementById(n[2]), r && r.parentNode && (this.length = 1, this[0] = r), this.context = document, this.selector = e, this
                    }
                    return !t || t.jquery ? (t || rootjQuery).find(e) : this.constructor(t).find(e)
                }
                return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : jQuery.isFunction(e) ? typeof rootjQuery.ready != "undefined" ? rootjQuery.ready(e) : e(jQuery) : (e.selector !== undefined && (this.selector = e.selector, this.context = e.context), jQuery.makeArray(e, this))
            };
        init.prototype = jQuery.fn, rootjQuery = jQuery(document);
        var rparentsprev = /^(?:parents|prev(?:Until|All))/,
            guaranteedUnique = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        jQuery.extend({
            dir: function(e, t, n) {
                var r = [],
                    i = n !== undefined;
                while ((e = e[t]) && e.nodeType !== 9)
                    if (e.nodeType === 1) {
                        if (i && jQuery(e).is(n)) break;
                        r.push(e)
                    } return r
            },
            sibling: function(e, t) {
                var n = [];
                for (; e; e = e.nextSibling) e.nodeType === 1 && e !== t && n.push(e);
                return n
            }
        }), jQuery.fn.extend({
            has: function(e) {
                var t = jQuery(e, this),
                    n = t.length;
                return this.filter(function() {
                    var e = 0;
                    for (; e < n; e++)
                        if (jQuery.contains(this, t[e])) return !0
                })
            },
            closest: function(e, t) {
                var n, r = 0,
                    i = this.length,
                    s = [],
                    o = rneedsContext.test(e) || typeof e != "string" ? jQuery(e, t || this.context) : 0;
                for (; r < i; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (o ? o.index(n) > -1 : n.nodeType === 1 && jQuery.find.matchesSelector(n, e))) {
                            s.push(n);
                            break
                        } return this.pushStack(s.length > 1 ? jQuery.unique(s) : s)
            },
            index: function(e) {
                return e ? typeof e == "string" ? indexOf.call(jQuery(e), this[0]) : indexOf.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(e, t) {
                return this.pushStack(jQuery.unique(jQuery.merge(this.get(), jQuery(e, t))))
            },
            addBack: function(e) {
                return this.add(e == null ? this.prevObject : this.prevObject.filter(e))
            }
        }), jQuery.each({
            parent: function(e) {
                var t = e.parentNode;
                return t && t.nodeType !== 11 ? t : null
            },
            parents: function(e) {
                return jQuery.dir(e, "parentNode")
            },
            parentsUntil: function(e, t, n) {
                return jQuery.dir(e, "parentNode", n)
            },
            next: function(e) {
                return sibling(e, "nextSibling")
            },
            prev: function(e) {
                return sibling(e, "previousSibling")
            },
            nextAll: function(e) {
                return jQuery.dir(e, "nextSibling")
            },
            prevAll: function(e) {
                return jQuery.dir(e, "previousSibling")
            },
            nextUntil: function(e, t, n) {
                return jQuery.dir(e, "nextSibling", n)
            },
            prevUntil: function(e, t, n) {
                return jQuery.dir(e, "previousSibling", n)
            },
            siblings: function(e) {
                return jQuery.sibling((e.parentNode || {}).firstChild, e)
            },
            children: function(e) {
                return jQuery.sibling(e.firstChild)
            },
            contents: function(e) {
                return e.contentDocument || jQuery.merge([], e.childNodes)
            }
        }, function(e, t) {
            jQuery.fn[e] = function(n, r) {
                var i = jQuery.map(this, t, n);
                return e.slice(-5) !== "Until" && (r = n), r && typeof r == "string" && (i = jQuery.filter(r, i)), this.length > 1 && (guaranteedUnique[e] || jQuery.unique(i), rparentsprev.test(e) && i.reverse()), this.pushStack(i)
            }
        });
        var rnotwhite = /\S+/g,
            optionsCache = {};
        jQuery.Callbacks = function(e) {
            e = typeof e == "string" ? optionsCache[e] || createOptions(e) : jQuery.extend({}, e);
            var t, n, r, i, s, o, u = [],
                a = !e.once && [],
                f = function(c) {
                    t = e.memory && c, n = !0, o = i || 0, i = 0, s = u.length, r = !0;
                    for (; u && o < s; o++)
                        if (u[o].apply(c[0], c[1]) === !1 && e.stopOnFalse) {
                            t = !1;
                            break
                        } r = !1, u && (a ? a.length && f(a.shift()) : t ? u = [] : l.disable())
                },
                l = {
                    add: function() {
                        if (u) {
                            var n = u.length;
                            (function o(t) {
                                jQuery.each(t, function(t, n) {
                                    var r = jQuery.type(n);
                                    r === "function" ? (!e.unique || !l.has(n)) && u.push(n) : n && n.length && r !== "string" && o(n)
                                })
                            })(arguments), r ? s = u.length : t && (i = n, f(t))
                        }
                        return this
                    },
                    remove: function() {
                        return u && jQuery.each(arguments, function(e, t) {
                            var n;
                            while ((n = jQuery.inArray(t, u, n)) > -1) u.splice(n, 1), r && (n <= s && s--, n <= o && o--)
                        }), this
                    },
                    has: function(e) {
                        return e ? jQuery.inArray(e, u) > -1 : !!u && !!u.length
                    },
                    empty: function() {
                        return u = [], s = 0, this
                    },
                    disable: function() {
                        return u = a = t = undefined, this
                    },
                    disabled: function() {
                        return !u
                    },
                    lock: function() {
                        return a = undefined, t || l.disable(), this
                    },
                    locked: function() {
                        return !a
                    },
                    fireWith: function(e, t) {
                        return u && (!n || a) && (t = t || [], t = [e, t.slice ? t.slice() : t], r ? a.push(t) : f(t)), this
                    },
                    fire: function() {
                        return l.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!n
                    }
                };
            return l
        }, jQuery.extend({
            Deferred: function(e) {
                var t = [
                        ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", jQuery.Callbacks("memory")]
                    ],
                    n = "pending",
                    r = {
                        state: function() {
                            return n
                        },
                        always: function() {
                            return i.done(arguments).fail(arguments), this
                        },
                        then: function() {
                            var e = arguments;
                            return jQuery.Deferred(function(n) {
                                jQuery.each(t, function(t, s) {
                                    var o = jQuery.isFunction(e[t]) && e[t];
                                    i[s[1]](function() {
                                        var e = o && o.apply(this, arguments);
                                        e && jQuery.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[s[0] + "With"](this === r ? n.promise() : this, o ? [e] : arguments)
                                    })
                                }), e = null
                            }).promise()
                        },
                        promise: function(e) {
                            return e != null ? jQuery.extend(e, r) : r
                        }
                    },
                    i = {};
                return r.pipe = r.then, jQuery.each(t, function(e, s) {
                    var o = s[2],
                        u = s[3];
                    r[s[1]] = o.add, u && o.add(function() {
                        n = u
                    }, t[e ^ 1][2].disable, t[2][2].lock), i[s[0]] = function() {
                        return i[s[0] + "With"](this === i ? r : this, arguments), this
                    }, i[s[0] + "With"] = o.fireWith
                }), r.promise(i), e && e.call(i, i), i
            },
            when: function(e) {
                var t = 0,
                    n = slice.call(arguments),
                    r = n.length,
                    i = r !== 1 || e && jQuery.isFunction(e.promise) ? r : 0,
                    s = i === 1 ? e : jQuery.Deferred(),
                    o = function(e, t, n) {
                        return function(r) {
                            t[e] = this, n[e] = arguments.length > 1 ? slice.call(arguments) : r, n === u ? s.notifyWith(t, n) : --i || s.resolveWith(t, n)
                        }
                    },
                    u, a, f;
                if (r > 1) {
                    u = new Array(r), a = new Array(r), f = new Array(r);
                    for (; t < r; t++) n[t] && jQuery.isFunction(n[t].promise) ? n[t].promise().done(o(t, f, n)).fail(s.reject).progress(o(t, a, u)) : --i
                }
                return i || s.resolveWith(f, n), s.promise()
            }
        });
        var readyList;
        jQuery.fn.ready = function(e) {
            return jQuery.ready.promise().done(e), this
        }, jQuery.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function(e) {
                e ? jQuery.readyWait++ : jQuery.ready(!0)
            },
            ready: function(e) {
                if (e === !0 ? --jQuery.readyWait : jQuery.isReady) return;
                jQuery.isReady = !0;
                if (e !== !0 && --jQuery.readyWait > 0) return;
                readyList.resolveWith(document, [jQuery]), jQuery.fn.triggerHandler && (jQuery(document).triggerHandler("ready"), jQuery(document).off("ready"))
            }
        }), jQuery.ready.promise = function(e) {
            return readyList || (readyList = jQuery.Deferred(), document.readyState === "complete" ? setTimeout(jQuery.ready) : (document.addEventListener("DOMContentLoaded", completed, !1), window.addEventListener("load", completed, !1))), readyList.promise(e)
        }, jQuery.ready.promise();
        var access = jQuery.access = function(e, t, n, r, i, s, o) {
            var u = 0,
                a = e.length,
                f = n == null;
            if (jQuery.type(n) === "object") {
                i = !0;
                for (u in n) jQuery.access(e, t, u, n[u], !0, s, o)
            } else if (r !== undefined) {
                i = !0, jQuery.isFunction(r) || (o = !0), f && (o ? (t.call(e, r), t = null) : (f = t, t = function(e, t, n) {
                    return f.call(jQuery(e), n)
                }));
                if (t)
                    for (; u < a; u++) t(e[u], n, o ? r : r.call(e[u], u, t(e[u], n)))
            }
            return i ? e : f ? t.call(e) : a ? t(e[0], n) : s
        };
        jQuery.acceptData = function(e) {
            return e.nodeType === 1 || e.nodeType === 9 || !+e.nodeType
        }, Data.uid = 1, Data.accepts = jQuery.acceptData, Data.prototype = {
            key: function(e) {
                if (!Data.accepts(e)) return 0;
                var t = {},
                    n = e[this.expando];
                if (!n) {
                    n = Data.uid++;
                    try {
                        t[this.expando] = {
                            value: n
                        }, Object.defineProperties(e, t)
                    } catch (r) {
                        t[this.expando] = n, jQuery.extend(e, t)
                    }
                }
                return this.cache[n] || (this.cache[n] = {}), n
            },
            set: function(e, t, n) {
                var r, i = this.key(e),
                    s = this.cache[i];
                if (typeof t == "string") s[t] = n;
                else if (jQuery.isEmptyObject(s)) jQuery.extend(this.cache[i], t);
                else
                    for (r in t) s[r] = t[r];
                return s
            },
            get: function(e, t) {
                var n = this.cache[this.key(e)];
                return t === undefined ? n : n[t]
            },
            access: function(e, t, n) {
                var r;
                return t === undefined || t && typeof t == "string" && n === undefined ? (r = this.get(e, t), r !== undefined ? r : this.get(e, jQuery.camelCase(t))) : (this.set(e, t, n), n !== undefined ? n : t)
            },
            remove: function(e, t) {
                var n, r, i, s = this.key(e),
                    o = this.cache[s];
                if (t === undefined) this.cache[s] = {};
                else {
                    jQuery.isArray(t) ? r = t.concat(t.map(jQuery.camelCase)) : (i = jQuery.camelCase(t), t in o ? r = [t, i] : (r = i, r = r in o ? [r] : r.match(rnotwhite) || [])), n = r.length;
                    while (n--) delete o[r[n]]
                }
            },
            hasData: function(e) {
                return !jQuery.isEmptyObject(this.cache[e[this.expando]] || {})
            },
            discard: function(e) {
                e[this.expando] && delete this.cache[e[this.expando]]
            }
        };
        var data_priv = new Data,
            data_user = new Data,
            rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            rmultiDash = /([A-Z])/g;
        jQuery.extend({
            hasData: function(e) {
                return data_user.hasData(e) || data_priv.hasData(e)
            },
            data: function(e, t, n) {
                return data_user.access(e, t, n)
            },
            removeData: function(e, t) {
                data_user.remove(e, t)
            },
            _data: function(e, t, n) {
                return data_priv.access(e, t, n)
            },
            _removeData: function(e, t) {
                data_priv.remove(e, t)
            }
        }), jQuery.fn.extend({
            data: function(e, t) {
                var n, r, i, s = this[0],
                    o = s && s.attributes;
                if (e === undefined) {
                    if (this.length) {
                        i = data_user.get(s);
                        if (s.nodeType === 1 && !data_priv.get(s, "hasDataAttrs")) {
                            n = o.length;
                            while (n--) o[n] && (r = o[n].name, r.indexOf("data-") === 0 && (r = jQuery.camelCase(r.slice(5)), dataAttr(s, r, i[r])));
                            data_priv.set(s, "hasDataAttrs", !0)
                        }
                    }
                    return i
                }
                return typeof e == "object" ? this.each(function() {
                    data_user.set(this, e)
                }) : access(this, function(t) {
                    var n, r = jQuery.camelCase(e);
                    if (s && t === undefined) {
                        n = data_user.get(s, e);
                        if (n !== undefined) return n;
                        n = data_user.get(s, r);
                        if (n !== undefined) return n;
                        n = dataAttr(s, r, undefined);
                        if (n !== undefined) return n;
                        return
                    }
                    this.each(function() {
                        var n = data_user.get(this, r);
                        data_user.set(this, r, t), e.indexOf("-") !== -1 && n !== undefined && data_user.set(this, e, t)
                    })
                }, null, t, arguments.length > 1, null, !0)
            },
            removeData: function(e) {
                return this.each(function() {
                    data_user.remove(this, e)
                })
            }
        }), jQuery.extend({
            queue: function(e, t, n) {
                var r;
                if (e) return t = (t || "fx") + "queue", r = data_priv.get(e, t), n && (!r || jQuery.isArray(n) ? r = data_priv.access(e, t, jQuery.makeArray(n)) : r.push(n)), r || []
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var n = jQuery.queue(e, t),
                    r = n.length,
                    i = n.shift(),
                    s = jQuery._queueHooks(e, t),
                    o = function() {
                        jQuery.dequeue(e, t)
                    };
                i === "inprogress" && (i = n.shift(), r--), i && (t === "fx" && n.unshift("inprogress"), delete s.stop, i.call(e, o, s)), !r && s && s.empty.fire()
            },
            _queueHooks: function(e, t) {
                var n = t + "queueHooks";
                return data_priv.get(e, n) || data_priv.access(e, n, {
                    empty: jQuery.Callbacks("once memory").add(function() {
                        data_priv.remove(e, [t + "queue", n])
                    })
                })
            }
        }), jQuery.fn.extend({
            queue: function(e, t) {
                var n = 2;
                return typeof e != "string" && (t = e, e = "fx", n--), arguments.length < n ? jQuery.queue(this[0], e) : t === undefined ? this : this.each(function() {
                    var n = jQuery.queue(this, e, t);
                    jQuery._queueHooks(this, e), e === "fx" && n[0] !== "inprogress" && jQuery.dequeue(this, e)
                })
            },
            dequeue: function(e) {
                return this.each(function() {
                    jQuery.dequeue(this, e)
                })
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", [])
            },
            promise: function(e, t) {
                var n, r = 1,
                    i = jQuery.Deferred(),
                    s = this,
                    o = this.length,
                    u = function() {
                        --r || i.resolveWith(s, [s])
                    };
                typeof e != "string" && (t = e, e = undefined), e = e || "fx";
                while (o--) n = data_priv.get(s[o], e + "queueHooks"), n && n.empty && (r++, n.empty.add(u));
                return u(), i.promise(t)
            }
        });
        var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            cssExpand = ["Top", "Right", "Bottom", "Left"],
            isHidden = function(e, t) {
                return e = t || e, jQuery.css(e, "display") === "none" || !jQuery.contains(e.ownerDocument, e)
            },
            rcheckableType = /^(?:checkbox|radio)$/i;
        (function() {
            var e = document.createDocumentFragment(),
                t = e.appendChild(document.createElement("div")),
                n = document.createElement("input");
            n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), t.appendChild(n), support.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, t.innerHTML = "<textarea>x</textarea>", support.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue
        })();
        var strundefined = typeof undefined;
        support.focusinBubbles = "onfocusin" in window;
        var rkeyEvent = /^key/,
            rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
            rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
            rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
        jQuery.event = {
            global: {},
            add: function(e, t, n, r, i) {
                var s, o, u, a, f, l, c, h, p, d, v, m = data_priv.get(e);
                if (!m) return;
                n.handler && (s = n, n = s.handler, i = s.selector), n.guid || (n.guid = jQuery.guid++), (a = m.events) || (a = m.events = {}), (o = m.handle) || (o = m.handle = function(t) {
                    return typeof jQuery !== strundefined && jQuery.event.triggered !== t.type ? jQuery.event.dispatch.apply(e, arguments) : undefined
                }), t = (t || "").match(rnotwhite) || [""], f = t.length;
                while (f--) {
                    u = rtypenamespace.exec(t[f]) || [], p = v = u[1], d = (u[2] || "").split(".").sort();
                    if (!p) continue;
                    c = jQuery.event.special[p] || {}, p = (i ? c.delegateType : c.bindType) || p, c = jQuery.event.special[p] || {}, l = jQuery.extend({
                        type: p,
                        origType: v,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: i,
                        needsContext: i && jQuery.expr.match.needsContext.test(i),
                        namespace: d.join(".")
                    }, s), (h = a[p]) || (h = a[p] = [], h.delegateCount = 0, (!c.setup || c.setup.call(e, r, d, o) === !1) && e.addEventListener && e.addEventListener(p, o, !1)), c.add && (c.add.call(e, l), l.handler.guid || (l.handler.guid = n.guid)), i ? h.splice(h.delegateCount++, 0, l) : h.push(l), jQuery.event.global[p] = !0
                }
            },
            remove: function(e, t, n, r, i) {
                var s, o, u, a, f, l, c, h, p, d, v, m = data_priv.hasData(e) && data_priv.get(e);
                if (!m || !(a = m.events)) return;
                t = (t || "").match(rnotwhite) || [""], f = t.length;
                while (f--) {
                    u = rtypenamespace.exec(t[f]) || [], p = v = u[1], d = (u[2] || "").split(".").sort();
                    if (!p) {
                        for (p in a) jQuery.event.remove(e, p + t[f], n, r, !0);
                        continue
                    }
                    c = jQuery.event.special[p] || {}, p = (r ? c.delegateType : c.bindType) || p, h = a[p] || [], u = u[2] && new RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)"), o = s = h.length;
                    while (s--) l = h[s], (i || v === l.origType) && (!n || n.guid === l.guid) && (!u || u.test(l.namespace)) && (!r || r === l.selector || r === "**" && l.selector) && (h.splice(s, 1), l.selector && h.delegateCount--, c.remove && c.remove.call(e, l));
                    o && !h.length && ((!c.teardown || c.teardown.call(e, d, m.handle) === !1) && jQuery.removeEvent(e, p, m.handle), delete a[p])
                }
                jQuery.isEmptyObject(a) && (delete m.handle, data_priv.remove(e, "events"))
            },
            trigger: function(e, t, n, r) {
                var i, s, o, u, a, f, l, c = [n || document],
                    h = hasOwn.call(e, "type") ? e.type : e,
                    p = hasOwn.call(e, "namespace") ? e.namespace.split(".") : [];
                s = o = n = n || document;
                if (n.nodeType === 3 || n.nodeType === 8) return;
                if (rfocusMorph.test(h + jQuery.event.triggered)) return;
                h.indexOf(".") >= 0 && (p = h.split("."), h = p.shift(), p.sort()), a = h.indexOf(":") < 0 && "on" + h, e = e[jQuery.expando] ? e : new jQuery.Event(h, typeof e == "object" && e), e.isTrigger = r ? 2 : 3, e.namespace = p.join("."), e.namespace_re = e.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = undefined, e.target || (e.target = n), t = t == null ? [e] : jQuery.makeArray(t, [e]), l = jQuery.event.special[h] || {};
                if (!r && l.trigger && l.trigger.apply(n, t) === !1) return;
                if (!r && !l.noBubble && !jQuery.isWindow(n)) {
                    u = l.delegateType || h, rfocusMorph.test(u + h) || (s = s.parentNode);
                    for (; s; s = s.parentNode) c.push(s), o = s;
                    o === (n.ownerDocument || document) && c.push(o.defaultView || o.parentWindow || window)
                }
                i = 0;
                while ((s = c[i++]) && !e.isPropagationStopped()) e.type = i > 1 ? u : l.bindType || h, f = (data_priv.get(s, "events") || {})[e.type] && data_priv.get(s, "handle"), f && f.apply(s, t), f = a && s[a], f && f.apply && jQuery.acceptData(s) && (e.result = f.apply(s, t), e.result === !1 && e.preventDefault());
                return e.type = h, !r && !e.isDefaultPrevented() && (!l._default || l._default.apply(c.pop(), t) === !1) && jQuery.acceptData(n) && a && jQuery.isFunction(n[h]) && !jQuery.isWindow(n) && (o = n[a], o && (n[a] = null), jQuery.event.triggered = h, n[h](), jQuery.event.triggered = undefined, o && (n[a] = o)), e.result
            },
            dispatch: function(e) {
                e = jQuery.event.fix(e);
                var t, n, r, i, s, o = [],
                    u = slice.call(arguments),
                    a = (data_priv.get(this, "events") || {})[e.type] || [],
                    f = jQuery.event.special[e.type] || {};
                u[0] = e, e.delegateTarget = this;
                if (f.preDispatch && f.preDispatch.call(this, e) === !1) return;
                o = jQuery.event.handlers.call(this, e, a), t = 0;
                while ((i = o[t++]) && !e.isPropagationStopped()) {
                    e.currentTarget = i.elem, n = 0;
                    while ((s = i.handlers[n++]) && !e.isImmediatePropagationStopped())
                        if (!e.namespace_re || e.namespace_re.test(s.namespace)) e.handleObj = s, e.data = s.data, r = ((jQuery.event.special[s.origType] || {}).handle || s.handler).apply(i.elem, u), r !== undefined && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation())
                }
                return f.postDispatch && f.postDispatch.call(this, e), e.result
            },
            handlers: function(e, t) {
                var n, r, i, s, o = [],
                    u = t.delegateCount,
                    a = e.target;
                if (u && a.nodeType && (!e.button || e.type !== "click"))
                    for (; a !== this; a = a.parentNode || this)
                        if (a.disabled !== !0 || e.type !== "click") {
                            r = [];
                            for (n = 0; n < u; n++) s = t[n], i = s.selector + " ", r[i] === undefined && (r[i] = s.needsContext ? jQuery(i, this).index(a) >= 0 : jQuery.find(i, this, null, [a]).length), r[i] && r.push(s);
                            r.length && o.push({
                                elem: a,
                                handlers: r
                            })
                        } return u < t.length && o.push({
                    elem: this,
                    handlers: t.slice(u)
                }), o
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(e, t) {
                    return e.which == null && (e.which = t.charCode != null ? t.charCode : t.keyCode), e
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(e, t) {
                    var n, r, i, s = t.button;
                    return e.pageX == null && t.clientX != null && (n = e.target.ownerDocument || document, r = n.documentElement, i = n.body, e.pageX = t.clientX + (r && r.scrollLeft || i && i.scrollLeft || 0) - (r && r.clientLeft || i && i.clientLeft || 0), e.pageY = t.clientY + (r && r.scrollTop || i && i.scrollTop || 0) - (r && r.clientTop || i && i.clientTop || 0)), !e.which && s !== undefined && (e.which = s & 1 ? 1 : s & 2 ? 3 : s & 4 ? 2 : 0), e
                }
            },
            fix: function(e) {
                if (e[jQuery.expando]) return e;
                var t, n, r, i = e.type,
                    s = e,
                    o = this.fixHooks[i];
                o || (this.fixHooks[i] = o = rmouseEvent.test(i) ? this.mouseHooks : rkeyEvent.test(i) ? this.keyHooks : {}), r = o.props ? this.props.concat(o.props) : this.props, e = new jQuery.Event(s), t = r.length;
                while (t--) n = r[t], e[n] = s[n];
                return e.target || (e.target = document), e.target.nodeType === 3 && (e.target = e.target.parentNode), o.filter ? o.filter(e, s) : e
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== safeActiveElement() && this.focus) return this.focus(), !1
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        if (this === safeActiveElement() && this.blur) return this.blur(), !1
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) return this.click(), !1
                    },
                    _default: function(e) {
                        return jQuery.nodeName(e.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(e) {
                        e.result !== undefined && e.originalEvent && (e.originalEvent.returnValue = e.result)
                    }
                }
            },
            simulate: function(e, t, n, r) {
                var i = jQuery.extend(new jQuery.Event, n, {
                    type: e,
                    isSimulated: !0,
                    originalEvent: {}
                });
                r ? jQuery.event.trigger(i, null, t) : jQuery.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
            }
        }, jQuery.removeEvent = function(e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n, !1)
        }, jQuery.Event = function(e, t) {
            if (!(this instanceof jQuery.Event)) return new jQuery.Event(e, t);
            e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.defaultPrevented === undefined && e.returnValue === !1 ? returnTrue : returnFalse) : this.type = e, t && jQuery.extend(this, t), this.timeStamp = e && e.timeStamp || jQuery.now(), this[jQuery.expando] = !0
        }, jQuery.Event.prototype = {
            isDefaultPrevented: returnFalse,
            isPropagationStopped: returnFalse,
            isImmediatePropagationStopped: returnFalse,
            preventDefault: function() {
                var e = this.originalEvent;
                this.isDefaultPrevented = returnTrue, e && e.preventDefault && e.preventDefault()
            },
            stopPropagation: function() {
                var e = this.originalEvent;
                this.isPropagationStopped = returnTrue, e && e.stopPropagation && e.stopPropagation()
            },
            stopImmediatePropagation: function() {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = returnTrue, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
            }
        }, jQuery.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(e, t) {
            jQuery.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function(e) {
                    var n, r = this,
                        i = e.relatedTarget,
                        s = e.handleObj;
                    if (!i || i !== r && !jQuery.contains(r, i)) e.type = s.origType, n = s.handler.apply(this, arguments), e.type = t;
                    return n
                }
            }
        }), support.focusinBubbles || jQuery.each({
            focus: "focusin",
            blur: "focusout"
        }, function(e, t) {
            var n = function(e) {
                jQuery.event.simulate(t, e.target, jQuery.event.fix(e), !0)
            };
            jQuery.event.special[t] = {
                setup: function() {
                    var r = this.ownerDocument || this,
                        i = data_priv.access(r, t);
                    i || r.addEventListener(e, n, !0), data_priv.access(r, t, (i || 0) + 1)
                },
                teardown: function() {
                    var r = this.ownerDocument || this,
                        i = data_priv.access(r, t) - 1;
                    i ? data_priv.access(r, t, i) : (r.removeEventListener(e, n, !0), data_priv.remove(r, t))
                }
            }
        }), jQuery.fn.extend({
            on: function(e, t, n, r, i) {
                var s, o;
                if (typeof e == "object") {
                    typeof t != "string" && (n = n || t, t = undefined);
                    for (o in e) this.on(o, t, n, e[o], i);
                    return this
                }
                n == null && r == null ? (r = t, n = t = undefined) : r == null && (typeof t == "string" ? (r = n, n = undefined) : (r = n, n = t, t = undefined));
                if (r === !1) r = returnFalse;
                else if (!r) return this;
                return i === 1 && (s = r, r = function(e) {
                    return jQuery().off(e), s.apply(this, arguments)
                }, r.guid = s.guid || (s.guid = jQuery.guid++)), this.each(function() {
                    jQuery.event.add(this, e, r, n, t)
                })
            },
            one: function(e, t, n, r) {
                return this.on(e, t, n, r, 1)
            },
            off: function(e, t, n) {
                var r, i;
                if (e && e.preventDefault && e.handleObj) return r = e.handleObj, jQuery(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
                if (typeof e == "object") {
                    for (i in e) this.off(i, t, e[i]);
                    return this
                }
                if (t === !1 || typeof t == "function") n = t, t = undefined;
                return n === !1 && (n = returnFalse), this.each(function() {
                    jQuery.event.remove(this, e, n, t)
                })
            },
            trigger: function(e, t) {
                return this.each(function() {
                    jQuery.event.trigger(e, t, this)
                })
            },
            triggerHandler: function(e, t) {
                var n = this[0];
                if (n) return jQuery.event.trigger(e, t, n, !0)
            }
        });
        var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            rtagName = /<([\w:]+)/,
            rhtml = /<|&#?\w+;/,
            rnoInnerhtml = /<(?:script|style|link)/i,
            rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
            rscriptType = /^$|\/(?:java|ecma)script/i,
            rscriptTypeMasked = /^true\/(.*)/,
            rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
            wrapMap = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                thead: [1, "<table>", "</table>"],
                col: [2, "<table><colgroup>", "</colgroup></table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: [0, "", ""]
            };
        wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, wrapMap.th = wrapMap.td, jQuery.extend({
            clone: function(e, t, n) {
                var r, i, s, o, u = e.cloneNode(!0),
                    a = jQuery.contains(e.ownerDocument, e);
                if (!support.noCloneChecked && (e.nodeType === 1 || e.nodeType === 11) && !jQuery.isXMLDoc(e)) {
                    o = getAll(u), s = getAll(e);
                    for (r = 0, i = s.length; r < i; r++) fixInput(s[r], o[r])
                }
                if (t)
                    if (n) {
                        s = s || getAll(e), o = o || getAll(u);
                        for (r = 0, i = s.length; r < i; r++) cloneCopyEvent(s[r], o[r])
                    } else cloneCopyEvent(e, u);
                return o = getAll(u, "script"), o.length > 0 && setGlobalEval(o, !a && getAll(e, "script")), u
            },
            buildFragment: function(e, t, n, r) {
                var i, s, o, u, a, f, l = t.createDocumentFragment(),
                    c = [],
                    h = 0,
                    p = e.length;
                for (; h < p; h++) {
                    i = e[h];
                    if (i || i === 0)
                        if (jQuery.type(i) === "object") jQuery.merge(c, i.nodeType ? [i] : i);
                        else if (!rhtml.test(i)) c.push(t.createTextNode(i));
                    else {
                        s = s || l.appendChild(t.createElement("div")), o = (rtagName.exec(i) || ["", ""])[1].toLowerCase(), u = wrapMap[o] || wrapMap._default, s.innerHTML = u[1] + i.replace(rxhtmlTag, "<$1></$2>") + u[2], f = u[0];
                        while (f--) s = s.lastChild;
                        jQuery.merge(c, s.childNodes), s = l.firstChild, s.textContent = ""
                    }
                }
                l.textContent = "", h = 0;
                while (i = c[h++]) {
                    if (r && jQuery.inArray(i, r) !== -1) continue;
                    a = jQuery.contains(i.ownerDocument, i), s = getAll(l.appendChild(i), "script"), a && setGlobalEval(s);
                    if (n) {
                        f = 0;
                        while (i = s[f++]) rscriptType.test(i.type || "") && n.push(i)
                    }
                }
                return l
            },
            cleanData: function(e) {
                var t, n, r, i, s = jQuery.event.special,
                    o = 0;
                for (;
                    (n = e[o]) !== undefined; o++) {
                    if (jQuery.acceptData(n)) {
                        i = n[data_priv.expando];
                        if (i && (t = data_priv.cache[i])) {
                            if (t.events)
                                for (r in t.events) s[r] ? jQuery.event.remove(n, r) : jQuery.removeEvent(n, r, t.handle);
                            data_priv.cache[i] && delete data_priv.cache[i]
                        }
                    }
                    delete data_user.cache[n[data_user.expando]]
                }
            }
        }), jQuery.fn.extend({
            text: function(e) {
                return access(this, function(e) {
                    return e === undefined ? jQuery.text(this) : this.empty().each(function() {
                        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) this.textContent = e
                    })
                }, null, e, arguments.length)
            },
            append: function() {
                return this.domManip(arguments, function(e) {
                    if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                        var t = manipulationTarget(this, e);
                        t.appendChild(e)
                    }
                })
            },
            prepend: function() {
                return this.domManip(arguments, function(e) {
                    if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                        var t = manipulationTarget(this, e);
                        t.insertBefore(e, t.firstChild)
                    }
                })
            },
            before: function() {
                return this.domManip(arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this)
                })
            },
            after: function() {
                return this.domManip(arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                })
            },
            remove: function(e, t) {
                var n, r = e ? jQuery.filter(e, this) : this,
                    i = 0;
                for (;
                    (n = r[i]) != null; i++) !t && n.nodeType === 1 && jQuery.cleanData(getAll(n)), n.parentNode && (t && jQuery.contains(n.ownerDocument, n) && setGlobalEval(getAll(n, "script")), n.parentNode.removeChild(n));
                return this
            },
            empty: function() {
                var e, t = 0;
                for (;
                    (e = this[t]) != null; t++) e.nodeType === 1 && (jQuery.cleanData(getAll(e, !1)), e.textContent = "");
                return this
            },
            clone: function(e, t) {
                return e = e == null ? !1 : e, t = t == null ? e : t, this.map(function() {
                    return jQuery.clone(this, e, t)
                })
            },
            html: function(e) {
                return access(this, function(e) {
                    var t = this[0] || {},
                        n = 0,
                        r = this.length;
                    if (e === undefined && t.nodeType === 1) return t.innerHTML;
                    if (typeof e == "string" && !rnoInnerhtml.test(e) && !wrapMap[(rtagName.exec(e) || ["", ""])[1].toLowerCase()]) {
                        e = e.replace(rxhtmlTag, "<$1></$2>");
                        try {
                            for (; n < r; n++) t = this[n] || {}, t.nodeType === 1 && (jQuery.cleanData(getAll(t, !1)), t.innerHTML = e);
                            t = 0
                        } catch (i) {}
                    }
                    t && this.empty().append(e)
                }, null, e, arguments.length)
            },
            replaceWith: function() {
                var e = arguments[0];
                return this.domManip(arguments, function(t) {
                    e = this.parentNode, jQuery.cleanData(getAll(this)), e && e.replaceChild(t, this)
                }), e && (e.length || e.nodeType) ? this : this.remove()
            },
            detach: function(e) {
                return this.remove(e, !0)
            },
            domManip: function(e, t) {
                e = concat.apply([], e);
                var n, r, i, s, o, u, a = 0,
                    f = this.length,
                    l = this,
                    c = f - 1,
                    h = e[0],
                    p = jQuery.isFunction(h);
                if (p || f > 1 && typeof h == "string" && !support.checkClone && rchecked.test(h)) return this.each(function(n) {
                    var r = l.eq(n);
                    p && (e[0] = h.call(this, n, r.html())), r.domManip(e, t)
                });
                if (f) {
                    n = jQuery.buildFragment(e, this[0].ownerDocument, !1, this), r = n.firstChild, n.childNodes.length === 1 && (n = r);
                    if (r) {
                        i = jQuery.map(getAll(n, "script"), disableScript), s = i.length;
                        for (; a < f; a++) o = n, a !== c && (o = jQuery.clone(o, !0, !0), s && jQuery.merge(i, getAll(o, "script"))), t.call(this[a], o, a);
                        if (s) {
                            u = i[i.length - 1].ownerDocument, jQuery.map(i, restoreScript);
                            for (a = 0; a < s; a++) o = i[a], rscriptType.test(o.type || "") && !data_priv.access(o, "globalEval") && jQuery.contains(u, o) && (o.src ? jQuery._evalUrl && jQuery._evalUrl(o.src) : jQuery.globalEval(o.textContent.replace(rcleanScript, "")))
                        }
                    }
                }
                return this
            }
        }), jQuery.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(e, t) {
            jQuery.fn[e] = function(e) {
                var n, r = [],
                    i = jQuery(e),
                    s = i.length - 1,
                    o = 0;
                for (; o <= s; o++) n = o === s ? this : this.clone(!0), jQuery(i[o])[t](n), push.apply(r, n.get());
                return this.pushStack(r)
            }
        });
        var iframe, elemdisplay = {},
            rmargin = /^margin/,
            rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i"),
            getStyles = function(e) {
                return e.ownerDocument.defaultView.getComputedStyle(e, null)
            };
        (function() {
            function s() {
                i.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", i.innerHTML = "", n.appendChild(r);
                var s = window.getComputedStyle(i, null);
                e = s.top !== "1%", t = s.width === "4px", n.removeChild(r)
            }
            var e, t, n = document.documentElement,
                r = document.createElement("div"),
                i = document.createElement("div");
            if (!i.style) return;
            i.style.backgroundClip = "content-box", i.cloneNode(!0).style.backgroundClip = "", support.clearCloneStyle = i.style.backgroundClip === "content-box", r.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", r.appendChild(i), window.getComputedStyle && jQuery.extend(support, {
                pixelPosition: function() {
                    return s(), e
                },
                boxSizingReliable: function() {
                    return t == null && s(), t
                },
                reliableMarginRight: function() {
                    var e, t = i.appendChild(document.createElement("div"));
                    return t.style.cssText = i.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", t.style.marginRight = t.style.width = "0", i.style.width = "1px", n.appendChild(r), e = !parseFloat(window.getComputedStyle(t, null).marginRight), n.removeChild(r), e
                }
            })
        })(), jQuery.swap = function(e, t, n, r) {
            var i, s, o = {};
            for (s in t) o[s] = e.style[s], e.style[s] = t[s];
            i = n.apply(e, r || []);
            for (s in t) e.style[s] = o[s];
            return i
        };
        var rdisplayswap = /^(none|table(?!-c[ea]).+)/,
            rnumsplit = new RegExp("^(" + pnum + ")(.*)$", "i"),
            rrelNum = new RegExp("^([+-])=(" + pnum + ")", "i"),
            cssShow = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            cssNormalTransform = {
                letterSpacing: "0",
                fontWeight: "400"
            },
            cssPrefixes = ["Webkit", "O", "Moz", "ms"];
        jQuery.extend({
            cssHooks: {
                opacity: {
                    get: function(e, t) {
                        if (t) {
                            var n = curCSS(e, "opacity");
                            return n === "" ? "1" : n
                        }
                    }
                }
            },
            cssNumber: {
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
                "float": "cssFloat"
            },
            style: function(e, t, n, r) {
                if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) return;
                var i, s, o, u = jQuery.camelCase(t),
                    a = e.style;
                t = jQuery.cssProps[u] || (jQuery.cssProps[u] = vendorPropName(a, u)), o = jQuery.cssHooks[t] || jQuery.cssHooks[u];
                if (n === undefined) return o && "get" in o && (i = o.get(e, !1, r)) !== undefined ? i : a[t];
                s = typeof n, s === "string" && (i = rrelNum.exec(n)) && (n = (i[1] + 1) * i[2] + parseFloat(jQuery.css(e, t)), s = "number");
                if (n == null || n !== n) return;
                s === "number" && !jQuery.cssNumber[u] && (n += "px"), !support.clearCloneStyle && n === "" && t.indexOf("background") === 0 && (a[t] = "inherit");
                if (!o || !("set" in o) || (n = o.set(e, n, r)) !== undefined) a[t] = n
            },
            css: function(e, t, n, r) {
                var i, s, o, u = jQuery.camelCase(t);
                return t = jQuery.cssProps[u] || (jQuery.cssProps[u] = vendorPropName(e.style, u)), o = jQuery.cssHooks[t] || jQuery.cssHooks[u], o && "get" in o && (i = o.get(e, !0, n)), i === undefined && (i = curCSS(e, t, r)), i === "normal" && t in cssNormalTransform && (i = cssNormalTransform[t]), n === "" || n ? (s = parseFloat(i), n === !0 || jQuery.isNumeric(s) ? s || 0 : i) : i
            }
        }), jQuery.each(["height", "width"], function(e, t) {
            jQuery.cssHooks[t] = {
                get: function(e, n, r) {
                    if (n) return rdisplayswap.test(jQuery.css(e, "display")) && e.offsetWidth === 0 ? jQuery.swap(e, cssShow, function() {
                        return getWidthOrHeight(e, t, r)
                    }) : getWidthOrHeight(e, t, r)
                },
                set: function(e, n, r) {
                    var i = r && getStyles(e);
                    return setPositiveNumber(e, n, r ? augmentWidthOrHeight(e, t, r, jQuery.css(e, "boxSizing", !1, i) === "border-box", i) : 0)
                }
            }
        }), jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function(e, t) {
            if (t) return jQuery.swap(e, {
                display: "inline-block"
            }, curCSS, [e, "marginRight"])
        }), jQuery.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(e, t) {
            jQuery.cssHooks[e + t] = {
                expand: function(n) {
                    var r = 0,
                        i = {},
                        s = typeof n == "string" ? n.split(" ") : [n];
                    for (; r < 4; r++) i[e + cssExpand[r] + t] = s[r] || s[r - 2] || s[0];
                    return i
                }
            }, rmargin.test(e) || (jQuery.cssHooks[e + t].set = setPositiveNumber)
        }), jQuery.fn.extend({
            css: function(e, t) {
                return access(this, function(e, t, n) {
                    var r, i, s = {},
                        o = 0;
                    if (jQuery.isArray(t)) {
                        r = getStyles(e), i = t.length;
                        for (; o < i; o++) s[t[o]] = jQuery.css(e, t[o], !1, r);
                        return s
                    }
                    return n !== undefined ? jQuery.style(e, t, n) : jQuery.css(e, t)
                }, e, t, arguments.length > 1)
            },
            show: function() {
                return showHide(this, !0)
            },
            hide: function() {
                return showHide(this)
            },
            toggle: function(e) {
                return typeof e == "boolean" ? e ? this.show() : this.hide() : this.each(function() {
                    isHidden(this) ? jQuery(this).show() : jQuery(this).hide()
                })
            }
        }), jQuery.Tween = Tween, Tween.prototype = {
            constructor: Tween,
            init: function(e, t, n, r, i, s) {
                this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = s || (jQuery.cssNumber[n] ? "" : "px")
            },
            cur: function() {
                var e = Tween.propHooks[this.prop];
                return e && e.get ? e.get(this) : Tween.propHooks._default.get(this)
            },
            run: function(e) {
                var t, n = Tween.propHooks[this.prop];
                return this.options.duration ? this.pos = t = jQuery.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : Tween.propHooks._default.set(this), this
            }
        }, Tween.prototype.init.prototype = Tween.prototype, Tween.propHooks = {
            _default: {
                get: function(e) {
                    var t;
                    return e.elem[e.prop] == null || !!e.elem.style && e.elem.style[e.prop] != null ? (t = jQuery.css(e.elem, e.prop, ""), !t || t === "auto" ? 0 : t) : e.elem[e.prop]
                },
                set: function(e) {
                    jQuery.fx.step[e.prop] ? jQuery.fx.step[e.prop](e) : e.elem.style && (e.elem.style[jQuery.cssProps[e.prop]] != null || jQuery.cssHooks[e.prop]) ? jQuery.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
                }
            }
        }, Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
            set: function(e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
            }
        }, jQuery.easing = {
            linear: function(e) {
                return e
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2
            }
        }, jQuery.fx = Tween.prototype.init, jQuery.fx.step = {};
        var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/,
            rfxnum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"),
            rrun = /queueHooks$/,
            animationPrefilters = [defaultPrefilter],
            tweeners = {
                "*": [function(e, t) {
                    var n = this.createTween(e, t),
                        r = n.cur(),
                        i = rfxnum.exec(t),
                        s = i && i[3] || (jQuery.cssNumber[e] ? "" : "px"),
                        o = (jQuery.cssNumber[e] || s !== "px" && +r) && rfxnum.exec(jQuery.css(n.elem, e)),
                        u = 1,
                        a = 20;
                    if (o && o[3] !== s) {
                        s = s || o[3], i = i || [], o = +r || 1;
                        do u = u || ".5", o /= u, jQuery.style(n.elem, e, o + s); while (u !== (u = n.cur() / r) && u !== 1 && --a)
                    }
                    return i && (o = n.start = +o || +r || 0, n.unit = s, n.end = i[1] ? o + (i[1] + 1) * i[2] : +i[2]), n
                }]
            };
        jQuery.Animation = jQuery.extend(Animation, {
                tweener: function(e, t) {
                    jQuery.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
                    var n, r = 0,
                        i = e.length;
                    for (; r < i; r++) n = e[r], tweeners[n] = tweeners[n] || [], tweeners[n].unshift(t)
                },
                prefilter: function(e, t) {
                    t ? animationPrefilters.unshift(e) : animationPrefilters.push(e)
                }
            }), jQuery.speed = function(e, t, n) {
                var r = e && typeof e == "object" ? jQuery.extend({}, e) : {
                    complete: n || !n && t || jQuery.isFunction(e) && e,
                    duration: e,
                    easing: n && t || t && !jQuery.isFunction(t) && t
                };
                r.duration = jQuery.fx.off ? 0 : typeof r.duration == "number" ? r.duration : r.duration in jQuery.fx.speeds ? jQuery.fx.speeds[r.duration] : jQuery.fx.speeds._default;
                if (r.queue == null || r.queue === !0) r.queue = "fx";
                return r.old = r.complete, r.complete = function() {
                    jQuery.isFunction(r.old) && r.old.call(this), r.queue && jQuery.dequeue(this, r.queue)
                }, r
            }, jQuery.fn.extend({
                fadeTo: function(e, t, n, r) {
                    return this.filter(isHidden).css("opacity", 0).show().end().animate({
                        opacity: t
                    }, e, n, r)
                },
                animate: function(e, t, n, r) {
                    var i = jQuery.isEmptyObject(e),
                        s = jQuery.speed(t, n, r),
                        o = function() {
                            var t = Animation(this, jQuery.extend({}, e), s);
                            (i || data_priv.get(this, "finish")) && t.stop(!0)
                        };
                    return o.finish = o, i || s.queue === !1 ? this.each(o) : this.queue(s.queue, o)
                },
                stop: function(e, t, n) {
                    var r = function(e) {
                        var t = e.stop;
                        delete e.stop, t(n)
                    };
                    return typeof e != "string" && (n = t, t = e, e = undefined), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                        var t = !0,
                            i = e != null && e + "queueHooks",
                            s = jQuery.timers,
                            o = data_priv.get(this);
                        if (i) o[i] && o[i].stop && r(o[i]);
                        else
                            for (i in o) o[i] && o[i].stop && rrun.test(i) && r(o[i]);
                        for (i = s.length; i--;) s[i].elem === this && (e == null || s[i].queue === e) && (s[i].anim.stop(n), t = !1, s.splice(i, 1));
                        (t || !n) && jQuery.dequeue(this, e)
                    })
                },
                finish: function(e) {
                    return e !== !1 && (e = e || "fx"), this.each(function() {
                        var t, n = data_priv.get(this),
                            r = n[e + "queue"],
                            i = n[e + "queueHooks"],
                            s = jQuery.timers,
                            o = r ? r.length : 0;
                        n.finish = !0, jQuery.queue(this, e, []), i && i.stop && i.stop.call(this, !0);
                        for (t = s.length; t--;) s[t].elem === this && s[t].queue === e && (s[t].anim.stop(!0), s.splice(t, 1));
                        for (t = 0; t < o; t++) r[t] && r[t].finish && r[t].finish.call(this);
                        delete n.finish
                    })
                }
            }), jQuery.each(["toggle", "show", "hide"], function(e, t) {
                var n = jQuery.fn[t];
                jQuery.fn[t] = function(e, r, i) {
                    return e == null || typeof e == "boolean" ? n.apply(this, arguments) : this.animate(genFx(t, !0), e, r, i)
                }
            }), jQuery.each({
                slideDown: genFx("show"),
                slideUp: genFx("hide"),
                slideToggle: genFx("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(e, t) {
                jQuery.fn[e] = function(e, n, r) {
                    return this.animate(t, e, n, r)
                }
            }), jQuery.timers = [], jQuery.fx.tick = function() {
                var e, t = 0,
                    n = jQuery.timers;
                fxNow = jQuery.now();
                for (; t < n.length; t++) e = n[t], !e() && n[t] === e && n.splice(t--, 1);
                n.length || jQuery.fx.stop(), fxNow = undefined
            }, jQuery.fx.timer = function(e) {
                jQuery.timers.push(e), e() ? jQuery.fx.start() : jQuery.timers.pop()
            }, jQuery.fx.interval = 13, jQuery.fx.start = function() {
                timerId || (timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval))
            }, jQuery.fx.stop = function() {
                clearInterval(timerId), timerId = null
            }, jQuery.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            }, jQuery.fn.delay = function(e, t) {
                return e = jQuery.fx ? jQuery.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
                    var r = setTimeout(t, e);
                    n.stop = function() {
                        clearTimeout(r)
                    }
                })
            },
            function() {
                var e = document.createElement("input"),
                    t = document.createElement("select"),
                    n = t.appendChild(document.createElement("option"));
                e.type = "checkbox", support.checkOn = e.value !== "", support.optSelected = n.selected, t.disabled = !0, support.optDisabled = !n.disabled, e = document.createElement("input"), e.value = "t", e.type = "radio", support.radioValue = e.value === "t"
            }();
        var nodeHook, boolHook, attrHandle = jQuery.expr.attrHandle;
        jQuery.fn.extend({
            attr: function(e, t) {
                return access(this, jQuery.attr, e, t, arguments.length > 1)
            },
            removeAttr: function(e) {
                return this.each(function() {
                    jQuery.removeAttr(this, e)
                })
            }
        }), jQuery.extend({
            attr: function(e, t, n) {
                var r, i, s = e.nodeType;
                if (!e || s === 3 || s === 8 || s === 2) return;
                if (typeof e.getAttribute === strundefined) return jQuery.prop(e, t, n);
                if (s !== 1 || !jQuery.isXMLDoc(e)) t = t.toLowerCase(), r = jQuery.attrHooks[t] || (jQuery.expr.match.bool.test(t) ? boolHook : nodeHook);
                if (n === undefined) return r && "get" in r && (i = r.get(e, t)) !== null ? i : (i = jQuery.find.attr(e, t), i == null ? undefined : i);
                if (n !== null) return r && "set" in r && (i = r.set(e, n, t)) !== undefined ? i : (e.setAttribute(t, n + ""), n);
                jQuery.removeAttr(e, t)
            },
            removeAttr: function(e, t) {
                var n, r, i = 0,
                    s = t && t.match(rnotwhite);
                if (s && e.nodeType === 1)
                    while (n = s[i++]) r = jQuery.propFix[n] || n, jQuery.expr.match.bool.test(n) && (e[r] = !1), e.removeAttribute(n)
            },
            attrHooks: {
                type: {
                    set: function(e, t) {
                        if (!support.radioValue && t === "radio" && jQuery.nodeName(e, "input")) {
                            var n = e.value;
                            return e.setAttribute("type", t), n && (e.value = n), t
                        }
                    }
                }
            }
        }), boolHook = {
            set: function(e, t, n) {
                return t === !1 ? jQuery.removeAttr(e, n) : e.setAttribute(n, n), n
            }
        }, jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(e, t) {
            var n = attrHandle[t] || jQuery.find.attr;
            attrHandle[t] = function(e, t, r) {
                var i, s;
                return r || (s = attrHandle[t], attrHandle[t] = i, i = n(e, t, r) != null ? t.toLowerCase() : null, attrHandle[t] = s), i
            }
        });
        var rfocusable = /^(?:input|select|textarea|button)$/i;
        jQuery.fn.extend({
            prop: function(e, t) {
                return access(this, jQuery.prop, e, t, arguments.length > 1)
            },
            removeProp: function(e) {
                return this.each(function() {
                    delete this[jQuery.propFix[e] || e]
                })
            }
        }), jQuery.extend({
            propFix: {
                "for": "htmlFor",
                "class": "className"
            },
            prop: function(e, t, n) {
                var r, i, s, o = e.nodeType;
                if (!e || o === 3 || o === 8 || o === 2) return;
                return s = o !== 1 || !jQuery.isXMLDoc(e), s && (t = jQuery.propFix[t] || t, i = jQuery.propHooks[t]), n !== undefined ? i && "set" in i && (r = i.set(e, n, t)) !== undefined ? r : e[t] = n : i && "get" in i && (r = i.get(e, t)) !== null ? r : e[t]
            },
            propHooks: {
                tabIndex: {
                    get: function(e) {
                        return e.hasAttribute("tabindex") || rfocusable.test(e.nodeName) || e.href ? e.tabIndex : -1
                    }
                }
            }
        }), support.optSelected || (jQuery.propHooks.selected = {
            get: function(e) {
                var t = e.parentNode;
                return t && t.parentNode && t.parentNode.selectedIndex, null
            }
        }), jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            jQuery.propFix[this.toLowerCase()] = this
        });
        var rclass = /[\t\r\n\f]/g;
        jQuery.fn.extend({
            addClass: function(e) {
                var t, n, r, i, s, o, u = typeof e == "string" && e,
                    a = 0,
                    f = this.length;
                if (jQuery.isFunction(e)) return this.each(function(t) {
                    jQuery(this).addClass(e.call(this, t, this.className))
                });
                if (u) {
                    t = (e || "").match(rnotwhite) || [];
                    for (; a < f; a++) {
                        n = this[a], r = n.nodeType === 1 && (n.className ? (" " + n.className + " ").replace(rclass, " ") : " ");
                        if (r) {
                            s = 0;
                            while (i = t[s++]) r.indexOf(" " + i + " ") < 0 && (r += i + " ");
                            o = jQuery.trim(r), n.className !== o && (n.className = o)
                        }
                    }
                }
                return this
            },
            removeClass: function(e) {
                var t, n, r, i, s, o, u = arguments.length === 0 || typeof e == "string" && e,
                    a = 0,
                    f = this.length;
                if (jQuery.isFunction(e)) return this.each(function(t) {
                    jQuery(this).removeClass(e.call(this, t, this.className))
                });
                if (u) {
                    t = (e || "").match(rnotwhite) || [];
                    for (; a < f; a++) {
                        n = this[a], r = n.nodeType === 1 && (n.className ? (" " + n.className + " ").replace(rclass, " ") : "");
                        if (r) {
                            s = 0;
                            while (i = t[s++])
                                while (r.indexOf(" " + i + " ") >= 0) r = r.replace(" " + i + " ", " ");
                            o = e ? jQuery.trim(r) : "", n.className !== o && (n.className = o)
                        }
                    }
                }
                return this
            },
            toggleClass: function(e, t) {
                var n = typeof e;
                return typeof t == "boolean" && n === "string" ? t ? this.addClass(e) : this.removeClass(e) : jQuery.isFunction(e) ? this.each(function(n) {
                    jQuery(this).toggleClass(e.call(this, n, this.className, t), t)
                }) : this.each(function() {
                    if (n === "string") {
                        var t, r = 0,
                            i = jQuery(this),
                            s = e.match(rnotwhite) || [];
                        while (t = s[r++]) i.hasClass(t) ? i.removeClass(t) : i.addClass(t)
                    } else if (n === strundefined || n === "boolean") this.className && data_priv.set(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : data_priv.get(this, "__className__") || ""
                })
            },
            hasClass: function(e) {
                var t = " " + e + " ",
                    n = 0,
                    r = this.length;
                for (; n < r; n++)
                    if (this[n].nodeType === 1 && (" " + this[n].className + " ").replace(rclass, " ").indexOf(t) >= 0) return !0;
                return !1
            }
        });
        var rreturn = /\r/g;
        jQuery.fn.extend({
            val: function(e) {
                var t, n, r, i = this[0];
                if (!arguments.length) {
                    if (i) return t = jQuery.valHooks[i.type] || jQuery.valHooks[i.nodeName.toLowerCase()], t && "get" in t && (n = t.get(i, "value")) !== undefined ? n : (n = i.value, typeof n == "string" ? n.replace(rreturn, "") : n == null ? "" : n);
                    return
                }
                return r = jQuery.isFunction(e), this.each(function(n) {
                    var i;
                    if (this.nodeType !== 1) return;
                    r ? i = e.call(this, n, jQuery(this).val()) : i = e, i == null ? i = "" : typeof i == "number" ? i += "" : jQuery.isArray(i) && (i = jQuery.map(i, function(e) {
                        return e == null ? "" : e + ""
                    })), t = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
                    if (!t || !("set" in t) || t.set(this, i, "value") === undefined) this.value = i
                })
            }
        }), jQuery.extend({
            valHooks: {
                option: {
                    get: function(e) {
                        var t = jQuery.find.attr(e, "value");
                        return t != null ? t : jQuery.trim(jQuery.text(e))
                    }
                },
                select: {
                    get: function(e) {
                        var t, n, r = e.options,
                            i = e.selectedIndex,
                            s = e.type === "select-one" || i < 0,
                            o = s ? null : [],
                            u = s ? i + 1 : r.length,
                            a = i < 0 ? u : s ? i : 0;
                        for (; a < u; a++) {
                            n = r[a];
                            if ((n.selected || a === i) && (support.optDisabled ? !n.disabled : n.getAttribute("disabled") === null) && (!n.parentNode.disabled || !jQuery.nodeName(n.parentNode, "optgroup"))) {
                                t = jQuery(n).val();
                                if (s) return t;
                                o.push(t)
                            }
                        }
                        return o
                    },
                    set: function(e, t) {
                        var n, r, i = e.options,
                            s = jQuery.makeArray(t),
                            o = i.length;
                        while (o--) {
                            r = i[o];
                            if (r.selected = jQuery.inArray(r.value, s) >= 0) n = !0
                        }
                        return n || (e.selectedIndex = -1), s
                    }
                }
            }
        }), jQuery.each(["radio", "checkbox"], function() {
            jQuery.valHooks[this] = {
                set: function(e, t) {
                    if (jQuery.isArray(t)) return e.checked = jQuery.inArray(jQuery(e).val(), t) >= 0
                }
            }, support.checkOn || (jQuery.valHooks[this].get = function(e) {
                return e.getAttribute("value") === null ? "on" : e.value
            })
        }), jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
            jQuery.fn[t] = function(e, n) {
                return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
            }
        }), jQuery.fn.extend({
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            },
            bind: function(e, t, n) {
                return this.on(e, null, t, n)
            },
            unbind: function(e, t) {
                return this.off(e, null, t)
            },
            delegate: function(e, t, n, r) {
                return this.on(t, e, n, r)
            },
            undelegate: function(e, t, n) {
                return arguments.length === 1 ? this.off(e, "**") : this.off(t, e || "**", n)
            }
        });
        var nonce = jQuery.now(),
            rquery = /\?/;
        jQuery.parseJSON = function(e) {
            return JSON.parse(e + "")
        }, jQuery.parseXML = function(e) {
            var t, n;
            if (!e || typeof e != "string") return null;
            try {
                n = new DOMParser, t = n.parseFromString(e, "text/xml")
            } catch (r) {
                t = undefined
            }
            return (!t || t.getElementsByTagName("parsererror").length) && jQuery.error("Invalid XML: " + e), t
        };
        var ajaxLocParts, ajaxLocation, rhash = /#.*$/,
            rts = /([?&])_=[^&]*/,
            rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
            rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            rnoContent = /^(?:GET|HEAD)$/,
            rprotocol = /^\/\//,
            rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
            prefilters = {},
            transports = {},
            allTypes = "*/".concat("*");
        try {
            ajaxLocation = location.href
        } catch (e) {
            ajaxLocation = document.createElement("a"), ajaxLocation.href = "", ajaxLocation = ajaxLocation.href
        }
        ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [], jQuery.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: ajaxLocation,
                type: "GET",
                isLocal: rlocalProtocol.test(ajaxLocParts[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": allTypes,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": jQuery.parseJSON,
                    "text xml": jQuery.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(e, t) {
                return t ? ajaxExtend(ajaxExtend(e, jQuery.ajaxSettings), t) : ajaxExtend(jQuery.ajaxSettings, e)
            },
            ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
            ajaxTransport: addToPrefiltersOrTransports(transports),
            ajax: function(e, t) {
                function S(e, t, s, u) {
                    var f, m, g, b, E, S = t;
                    if (y === 2) return;
                    y = 2, o && clearTimeout(o), n = undefined, i = u || "", w.readyState = e > 0 ? 4 : 0, f = e >= 200 && e < 300 || e === 304, s && (b = ajaxHandleResponses(l, w, s)), b = ajaxConvert(l, b, w, f);
                    if (f) l.ifModified && (E = w.getResponseHeader("Last-Modified"), E && (jQuery.lastModified[r] = E), E = w.getResponseHeader("etag"), E && (jQuery.etag[r] = E)), e === 204 || l.type === "HEAD" ? S = "nocontent" : e === 304 ? S = "notmodified" : (S = b.state, m = b.data, g = b.error, f = !g);
                    else {
                        g = S;
                        if (e || !S) S = "error", e < 0 && (e = 0)
                    }
                    w.status = e, w.statusText = (t || S) + "", f ? p.resolveWith(c, [m, S, w]) : p.rejectWith(c, [w, S, g]), w.statusCode(v), v = undefined, a && h.trigger(f ? "ajaxSuccess" : "ajaxError", [w, l, f ? m : g]), d.fireWith(c, [w, S]), a && (h.trigger("ajaxComplete", [w, l]), --jQuery.active || jQuery.event.trigger("ajaxStop"))
                }
                typeof e == "object" && (t = e, e = undefined), t = t || {};
                var n, r, i, s, o, u, a, f, l = jQuery.ajaxSetup({}, t),
                    c = l.context || l,
                    h = l.context && (c.nodeType || c.jquery) ? jQuery(c) : jQuery.event,
                    p = jQuery.Deferred(),
                    d = jQuery.Callbacks("once memory"),
                    v = l.statusCode || {},
                    m = {},
                    g = {},
                    y = 0,
                    b = "canceled",
                    w = {
                        readyState: 0,
                        getResponseHeader: function(e) {
                            var t;
                            if (y === 2) {
                                if (!s) {
                                    s = {};
                                    while (t = rheaders.exec(i)) s[t[1].toLowerCase()] = t[2]
                                }
                                t = s[e.toLowerCase()]
                            }
                            return t == null ? null : t
                        },
                        getAllResponseHeaders: function() {
                            return y === 2 ? i : null
                        },
                        setRequestHeader: function(e, t) {
                            var n = e.toLowerCase();
                            return y || (e = g[n] = g[n] || e, m[e] = t), this
                        },
                        overrideMimeType: function(e) {
                            return y || (l.mimeType = e), this
                        },
                        statusCode: function(e) {
                            var t;
                            if (e)
                                if (y < 2)
                                    for (t in e) v[t] = [v[t], e[t]];
                                else w.always(e[w.status]);
                            return this
                        },
                        abort: function(e) {
                            var t = e || b;
                            return n && n.abort(t), S(0, t), this
                        }
                    };
                p.promise(w).complete = d.add, w.success = w.done, w.error = w.fail, l.url = ((e || l.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//"), l.type = t.method || t.type || l.method || l.type, l.dataTypes = jQuery.trim(l.dataType || "*").toLowerCase().match(rnotwhite) || [""], l.crossDomain == null && (u = rurl.exec(l.url.toLowerCase()), l.crossDomain = !(!u || u[1] === ajaxLocParts[1] && u[2] === ajaxLocParts[2] && (u[3] || (u[1] === "http:" ? "80" : "443")) === (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? "80" : "443")))), l.data && l.processData && typeof l.data != "string" && (l.data = jQuery.param(l.data, l.traditional)), inspectPrefiltersOrTransports(prefilters, l, t, w);
                if (y === 2) return w;
                a = l.global, a && jQuery.active++ === 0 && jQuery.event.trigger("ajaxStart"), l.type = l.type.toUpperCase(), l.hasContent = !rnoContent.test(l.type), r = l.url, l.hasContent || (l.data && (r = l.url += (rquery.test(r) ? "&" : "?") + l.data, delete l.data), l.cache === !1 && (l.url = rts.test(r) ? r.replace(rts, "$1_=" + nonce++) : r + (rquery.test(r) ? "&" : "?") + "_=" + nonce++)), l.ifModified && (jQuery.lastModified[r] && w.setRequestHeader("If-Modified-Since", jQuery.lastModified[r]), jQuery.etag[r] && w.setRequestHeader("If-None-Match", jQuery.etag[r])), (l.data && l.hasContent && l.contentType !== !1 || t.contentType) && w.setRequestHeader("Content-Type", l.contentType), w.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + (l.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : l.accepts["*"]);
                for (f in l.headers) w.setRequestHeader(f, l.headers[f]);
                if (!l.beforeSend || l.beforeSend.call(c, w, l) !== !1 && y !== 2) {
                    b = "abort";
                    for (f in {
                            success: 1,
                            error: 1,
                            complete: 1
                        }) w[f](l[f]);
                    n = inspectPrefiltersOrTransports(transports, l, t, w);
                    if (!n) S(-1, "No Transport");
                    else {
                        w.readyState = 1, a && h.trigger("ajaxSend", [w, l]), l.async && l.timeout > 0 && (o = setTimeout(function() {
                            w.abort("timeout")
                        }, l.timeout));
                        try {
                            y = 1, n.send(m, S)
                        } catch (E) {
                            if (!(y < 2)) throw E;
                            S(-1, E)
                        }
                    }
                    return w
                }
                return w.abort()
            },
            getJSON: function(e, t, n) {
                return jQuery.get(e, t, n, "json")
            },
            getScript: function(e, t) {
                return jQuery.get(e, undefined, t, "script")
            }
        }), jQuery.each(["get", "post"], function(e, t) {
            jQuery[t] = function(e, n, r, i) {
                return jQuery.isFunction(n) && (i = i || r, r = n, n = undefined), jQuery.ajax({
                    url: e,
                    type: t,
                    dataType: i,
                    data: n,
                    success: r
                })
            }
        }), jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
            jQuery.fn[t] = function(e) {
                return this.on(t, e)
            }
        }), jQuery._evalUrl = function(e) {
            return jQuery.ajax({
                url: e,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                "throws": !0
            })
        }, jQuery.fn.extend({
            wrapAll: function(e) {
                var t;
                return jQuery.isFunction(e) ? this.each(function(t) {
                    jQuery(this).wrapAll(e.call(this, t))
                }) : (this[0] && (t = jQuery(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                    var e = this;
                    while (e.firstElementChild) e = e.firstElementChild;
                    return e
                }).append(this)), this)
            },
            wrapInner: function(e) {
                return jQuery.isFunction(e) ? this.each(function(t) {
                    jQuery(this).wrapInner(e.call(this, t))
                }) : this.each(function() {
                    var t = jQuery(this),
                        n = t.contents();
                    n.length ? n.wrapAll(e) : t.append(e)
                })
            },
            wrap: function(e) {
                var t = jQuery.isFunction(e);
                return this.each(function(n) {
                    jQuery(this).wrapAll(t ? e.call(this, n) : e)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    jQuery.nodeName(this, "body") || jQuery(this).replaceWith(this.childNodes)
                }).end()
            }
        }), jQuery.expr.filters.hidden = function(e) {
            return e.offsetWidth <= 0 && e.offsetHeight <= 0
        }, jQuery.expr.filters.visible = function(e) {
            return !jQuery.expr.filters.hidden(e)
        };
        var r20 = /%20/g,
            rbracket = /\[\]$/,
            rCRLF = /\r?\n/g,
            rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
            rsubmittable = /^(?:input|select|textarea|keygen)/i;
        jQuery.param = function(e, t) {
            var n, r = [],
                i = function(e, t) {
                    t = jQuery.isFunction(t) ? t() : t == null ? "" : t, r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
                };
            t === undefined && (t = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional);
            if (jQuery.isArray(e) || e.jquery && !jQuery.isPlainObject(e)) jQuery.each(e, function() {
                i(this.name, this.value)
            });
            else
                for (n in e) buildParams(n, e[n], t, i);
            return r.join("&").replace(r20, "+")
        }, jQuery.fn.extend({
            serialize: function() {
                return jQuery.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var e = jQuery.prop(this, "elements");
                    return e ? jQuery.makeArray(e) : this
                }).filter(function() {
                    var e = this.type;
                    return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(e) && (this.checked || !rcheckableType.test(e))
                }).map(function(e, t) {
                    var n = jQuery(this).val();
                    return n == null ? null : jQuery.isArray(n) ? jQuery.map(n, function(e) {
                        return {
                            name: t.name,
                            value: e.replace(rCRLF, "\r\n")
                        }
                    }) : {
                        name: t.name,
                        value: n.replace(rCRLF, "\r\n")
                    }
                }).get()
            }
        }), jQuery.ajaxSettings.xhr = function() {
            try {
                return new XMLHttpRequest
            } catch (e) {}
        };
        var xhrId = 0,
            xhrCallbacks = {},
            xhrSuccessStatus = {
                0: 200,
                1223: 204
            },
            xhrSupported = jQuery.ajaxSettings.xhr();
        window.ActiveXObject && jQuery(window).on("unload", function() {
            for (var e in xhrCallbacks) xhrCallbacks[e]()
        }), support.cors = !!xhrSupported && "withCredentials" in xhrSupported, support.ajax = xhrSupported = !!xhrSupported, jQuery.ajaxTransport(function(e) {
            var t;
            if (support.cors || xhrSupported && !e.crossDomain) return {
                send: function(n, r) {
                    var i, s = e.xhr(),
                        o = ++xhrId;
                    s.open(e.type, e.url, e.async, e.username, e.password);
                    if (e.xhrFields)
                        for (i in e.xhrFields) s[i] = e.xhrFields[i];
                    e.mimeType && s.overrideMimeType && s.overrideMimeType(e.mimeType), !e.crossDomain && !n["X-Requested-With"] && (n["X-Requested-With"] = "XMLHttpRequest");
                    for (i in n) s.setRequestHeader(i, n[i]);
                    t = function(e) {
                        return function() {
                            t && (delete xhrCallbacks[o], t = s.onload = s.onerror = null, e === "abort" ? s.abort() : e === "error" ? r(s.status, s.statusText) : r(xhrSuccessStatus[s.status] || s.status, s.statusText, typeof s.responseText == "string" ? {
                                text: s.responseText
                            } : undefined, s.getAllResponseHeaders()))
                        }
                    }, s.onload = t(), s.onerror = t("error"), t = xhrCallbacks[o] = t("abort");
                    try {
                        s.send(e.hasContent && e.data || null)
                    } catch (u) {
                        if (t) throw u
                    }
                },
                abort: function() {
                    t && t()
                }
            }
        }), jQuery.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /(?:java|ecma)script/
            },
            converters: {
                "text script": function(e) {
                    return jQuery.globalEval(e), e
                }
            }
        }), jQuery.ajaxPrefilter("script", function(e) {
            e.cache === undefined && (e.cache = !1), e.crossDomain && (e.type = "GET")
        }), jQuery.ajaxTransport("script", function(e) {
            if (e.crossDomain) {
                var t, n;
                return {
                    send: function(r, i) {
                        t = jQuery("<script>").prop({
                            async: !0,
                            charset: e.scriptCharset,
                            src: e.url
                        }).on("load error", n = function(e) {
                            t.remove(), n = null, e && i(e.type === "error" ? 404 : 200, e.type)
                        }), document.head.appendChild(t[0])
                    },
                    abort: function() {
                        n && n()
                    }
                }
            }
        });
        var oldCallbacks = [],
            rjsonp = /(=)\?(?=&|$)|\?\?/;
        jQuery.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var e = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
                return this[e] = !0, e
            }
        }), jQuery.ajaxPrefilter("json jsonp", function(e, t, n) {
            var r, i, s, o = e.jsonp !== !1 && (rjsonp.test(e.url) ? "url" : typeof e.data == "string" && !(e.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(e.data) && "data");
            if (o || e.dataTypes[0] === "jsonp") return r = e.jsonpCallback = jQuery.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, o ? e[o] = e[o].replace(rjsonp, "$1" + r) : e.jsonp !== !1 && (e.url += (rquery.test(e.url) ? "&" : "?") + e.jsonp + "=" + r), e.converters["script json"] = function() {
                return s || jQuery.error(r + " was not called"), s[0]
            }, e.dataTypes[0] = "json", i = window[r], window[r] = function() {
                s = arguments
            }, n.always(function() {
                window[r] = i, e[r] && (e.jsonpCallback = t.jsonpCallback, oldCallbacks.push(r)), s && jQuery.isFunction(i) && i(s[0]), s = i = undefined
            }), "script"
        }), jQuery.parseHTML = function(e, t, n) {
            if (!e || typeof e != "string") return null;
            typeof t == "boolean" && (n = t, t = !1), t = t || document;
            var r = rsingleTag.exec(e),
                i = !n && [];
            return r ? [t.createElement(r[1])] : (r = jQuery.buildFragment([e], t, i), i && i.length && jQuery(i).remove(), jQuery.merge([], r.childNodes))
        };
        var _load = jQuery.fn.load;
        jQuery.fn.load = function(e, t, n) {
            if (typeof e != "string" && _load) return _load.apply(this, arguments);
            var r, i, s, o = this,
                u = e.indexOf(" ");
            return u >= 0 && (r = jQuery.trim(e.slice(u)), e = e.slice(0, u)), jQuery.isFunction(t) ? (n = t, t = undefined) : t && typeof t == "object" && (i = "POST"), o.length > 0 && jQuery.ajax({
                url: e,
                type: i,
                dataType: "html",
                data: t
            }).done(function(e) {
                s = arguments, o.html(r ? jQuery("<div>").append(jQuery.parseHTML(e)).find(r) : e)
            }).complete(n && function(e, t) {
                o.each(n, s || [e.responseText, t, e])
            }), this
        }, jQuery.expr.filters.animated = function(e) {
            return jQuery.grep(jQuery.timers, function(t) {
                return e === t.elem
            }).length
        };
        var docElem = window.document.documentElement;
        jQuery.offset = {
            setOffset: function(e, t, n) {
                var r, i, s, o, u, a, f, l = jQuery.css(e, "position"),
                    c = jQuery(e),
                    h = {};
                l === "static" && (e.style.position = "relative"), u = c.offset(), s = jQuery.css(e, "top"), a = jQuery.css(e, "left"), f = (l === "absolute" || l === "fixed") && (s + a).indexOf("auto") > -1, f ? (r = c.position(), o = r.top, i = r.left) : (o = parseFloat(s) || 0, i = parseFloat(a) || 0), jQuery.isFunction(t) && (t = t.call(e, n, u)), t.top != null && (h.top = t.top - u.top + o), t.left != null && (h.left = t.left - u.left + i), "using" in t ? t.using.call(e, h) : c.css(h)
            }
        }, jQuery.fn.extend({
            offset: function(e) {
                if (arguments.length) return e === undefined ? this : this.each(function(t) {
                    jQuery.offset.setOffset(this, e, t)
                });
                var t, n, r = this[0],
                    i = {
                        top: 0,
                        left: 0
                    },
                    s = r && r.ownerDocument;
                if (!s) return;
                return t = s.documentElement, jQuery.contains(t, r) ? (typeof r.getBoundingClientRect !== strundefined && (i = r.getBoundingClientRect()), n = getWindow(s), {
                    top: i.top + n.pageYOffset - t.clientTop,
                    left: i.left + n.pageXOffset - t.clientLeft
                }) : i
            },
            position: function() {
                if (!this[0]) return;
                var e, t, n = this[0],
                    r = {
                        top: 0,
                        left: 0
                    };
                return jQuery.css(n, "position") === "fixed" ? t = n.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), jQuery.nodeName(e[0], "html") || (r = e.offset()), r.top += jQuery.css(e[0], "borderTopWidth", !0), r.left += jQuery.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - r.top - jQuery.css(n, "marginTop", !0),
                    left: t.left - r.left - jQuery.css(n, "marginLeft", !0)
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    var e = this.offsetParent || docElem;
                    while (e && !jQuery.nodeName(e, "html") && jQuery.css(e, "position") === "static") e = e.offsetParent;
                    return e || docElem
                })
            }
        }), jQuery.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(e, t) {
            var n = "pageYOffset" === t;
            jQuery.fn[e] = function(r) {
                return access(this, function(e, r, i) {
                    var s = getWindow(e);
                    if (i === undefined) return s ? s[t] : e[r];
                    s ? s.scrollTo(n ? window.pageXOffset : i, n ? i : window.pageYOffset) : e[r] = i
                }, e, r, arguments.length, null)
            }
        }), jQuery.each(["top", "left"], function(e, t) {
            jQuery.cssHooks[t] = addGetHookIf(support.pixelPosition, function(e, n) {
                if (n) return n = curCSS(e, t), rnumnonpx.test(n) ? jQuery(e).position()[t] + "px" : n
            })
        }), jQuery.each({
            Height: "height",
            Width: "width"
        }, function(e, t) {
            jQuery.each({
                padding: "inner" + e,
                content: t,
                "": "outer" + e
            }, function(n, r) {
                jQuery.fn[r] = function(r, i) {
                    var s = arguments.length && (n || typeof r != "boolean"),
                        o = n || (r === !0 || i === !0 ? "margin" : "border");
                    return access(this, function(t, n, r) {
                        var i;
                        return jQuery.isWindow(t) ? t.document.documentElement["client" + e] : t.nodeType === 9 ? (i = t.documentElement, Math.max(t.body["scroll" + e], i["scroll" + e], t.body["offset" + e], i["offset" + e], i["client" + e])) : r === undefined ? jQuery.css(t, n, o) : jQuery.style(t, n, r, o)
                    }, t, s ? r : undefined, s, null)
                }
            })
        }), jQuery.fn.size = function() {
            return this.length
        }, jQuery.fn.andSelf = jQuery.fn.addBack, typeof define == "function" && define.amd && define("jquery", [], function() {
            return jQuery
        });
        var _jQuery = window.jQuery,
            _$ = window.$;
        return jQuery.noConflict = function(e) {
            return window.$ === jQuery && (window.$ = _$), e && window.jQuery === jQuery && (window.jQuery = _jQuery), jQuery
        }, typeof noGlobal === strundefined && (window.jQuery = window.$ = jQuery), jQuery
    }),
    function(e, t) {
        typeof define == "function" && define.amd ? define(t) : typeof exports == "object" ? module.exports = t() : e.returnExports = t()
    }(this, function() {
        function h() {}

        function J(e) {
            return e = +e, e !== e ? e = 0 : e !== 0 && e !== 1 / 0 && e !== -1 / 0 && (e = (e > 0 || -1) * Math.floor(Math.abs(e))), e
        }

        function K(e) {
            var t = typeof e;
            return e === null || t === "undefined" || t === "boolean" || t === "number" || t === "string"
        }

        function Q(e) {
            var t, n, r;
            if (K(e)) return e;
            n = e.valueOf;
            if (a(n)) {
                t = n.call(e);
                if (K(t)) return t
            }
            r = e.toString;
            if (a(r)) {
                t = r.call(e);
                if (K(t)) return t
            }
            throw new TypeError
        }
        var e = Function.prototype.call,
            t = Array.prototype,
            n = Object.prototype,
            r = t.slice,
            i = Array.prototype.splice,
            s = Array.prototype.push,
            o = Array.prototype.unshift,
            u = n.toString,
            a = function(e) {
                return n.toString.call(e) === "[object Function]"
            },
            f = function(e) {
                return n.toString.call(e) === "[object RegExp]"
            },
            l = function(t) {
                return u.call(t) === "[object Array]"
            },
            c = function(t) {
                var n = u.call(t),
                    r = n === "[object Arguments]";
                return r || (r = !l(n) && t !== null && typeof t == "object" && typeof t.length == "number" && t.length >= 0 && a(t.callee)), r
            };
        Function.prototype.bind || (Function.prototype.bind = function(t) {
            var n = this;
            if (!a(n)) throw new TypeError("Function.prototype.bind called on incompatible " + n);
            var i = r.call(arguments, 1),
                s = function() {
                    if (this instanceof l) {
                        var e = n.apply(this, i.concat(r.call(arguments)));
                        return Object(e) === e ? e : this
                    }
                    return n.apply(t, i.concat(r.call(arguments)))
                },
                o = Math.max(0, n.length - i.length),
                u = [];
            for (var f = 0; f < o; f++) u.push("$" + f);
            var l = Function("binder", "return function (" + u.join(",") + "){return binder.apply(this,arguments)}")(s);
            return n.prototype && (h.prototype = n.prototype, l.prototype = new h, h.prototype = null), l
        });
        var p = e.bind(n.hasOwnProperty),
            d, v, m, g, y;
        if (y = p(n, "__defineGetter__")) d = e.bind(n.__defineGetter__), v = e.bind(n.__defineSetter__), m = e.bind(n.__lookupGetter__), g = e.bind(n.__lookupSetter__);
        var b = function() {
                var e = {};
                return Array.prototype.splice.call(e, 0, 0, 1), e.length === 1
            }(),
            w = [1].splice(0).length === 0,
            E = function() {
                var e = [1, 2],
                    t = e.splice();
                return e.length === 2 && l(t) && t.length === 0
            }();
        E && (Array.prototype.splice = function(t, n) {
            return arguments.length === 0 ? [] : i.apply(this, arguments)
        });
        if (!w || !b) Array.prototype.splice = function(t, n) {
            if (arguments.length === 0) return [];
            var s = arguments;
            return this.length = Math.max(J(this.length), 0), arguments.length > 0 && typeof n != "number" && (s = r.call(arguments), s.length < 2 ? s.push(J(n)) : s[1] = J(n)), i.apply(this, s)
        };
        [].unshift(0) !== 1 && (Array.prototype.unshift = function() {
            return o.apply(this, arguments), this.length
        }), Array.isArray || (Array.isArray = l);
        var S = Object("a"),
            x = S[0] !== "a" || !(0 in S),
            T = function(t) {
                var n = !0,
                    r = !0;
                return t && (t.call("foo", function(e, t, r) {
                    typeof r != "object" && (n = !1)
                }), t.call([1], function() {
                    "use strict";
                    r = typeof this == "string"
                }, "x")), !!t && n && r
            };
        if (!Array.prototype.forEach || !T(Array.prototype.forEach)) Array.prototype.forEach = function(t) {
            var n = G(this),
                r = x && u.call(this) === "[object String]" ? this.split("") : n,
                i = arguments[1],
                s = -1,
                o = r.length >>> 0;
            if (!a(t)) throw new TypeError;
            while (++s < o) s in r && t.call(i, r[s], s, n)
        };
        if (!Array.prototype.map || !T(Array.prototype.map)) Array.prototype.map = function(t) {
            var n = G(this),
                r = x && u.call(this) === "[object String]" ? this.split("") : n,
                i = r.length >>> 0,
                s = Array(i),
                o = arguments[1];
            if (!a(t)) throw new TypeError(t + " is not a function");
            for (var f = 0; f < i; f++) f in r && (s[f] = t.call(o, r[f], f, n));
            return s
        };
        if (!Array.prototype.filter || !T(Array.prototype.filter)) Array.prototype.filter = function(t) {
            var n = G(this),
                r = x && u.call(this) === "[object String]" ? this.split("") : n,
                i = r.length >>> 0,
                s = [],
                o, f = arguments[1];
            if (!a(t)) throw new TypeError(t + " is not a function");
            for (var l = 0; l < i; l++) l in r && (o = r[l], t.call(f, o, l, n) && s.push(o));
            return s
        };
        if (!Array.prototype.every || !T(Array.prototype.every)) Array.prototype.every = function(t) {
            var n = G(this),
                r = x && u.call(this) === "[object String]" ? this.split("") : n,
                i = r.length >>> 0,
                s = arguments[1];
            if (!a(t)) throw new TypeError(t + " is not a function");
            for (var o = 0; o < i; o++)
                if (o in r && !t.call(s, r[o], o, n)) return !1;
            return !0
        };
        if (!Array.prototype.some || !T(Array.prototype.some)) Array.prototype.some = function(t) {
            var n = G(this),
                r = x && u.call(this) === "[object String]" ? this.split("") : n,
                i = r.length >>> 0,
                s = arguments[1];
            if (!a(t)) throw new TypeError(t + " is not a function");
            for (var o = 0; o < i; o++)
                if (o in r && t.call(s, r[o], o, n)) return !0;
            return !1
        };
        var N = !1;
        Array.prototype.reduce && (N = typeof Array.prototype.reduce.call("es5", function(e, t, n, r) {
            return r
        }) == "object");
        if (!Array.prototype.reduce || !N) Array.prototype.reduce = function(t) {
            var n = G(this),
                r = x && u.call(this) === "[object String]" ? this.split("") : n,
                i = r.length >>> 0;
            if (!a(t)) throw new TypeError(t + " is not a function");
            if (!i && arguments.length === 1) throw new TypeError("reduce of empty array with no initial value");
            var s = 0,
                o;
            if (arguments.length >= 2) o = arguments[1];
            else
                do {
                    if (s in r) {
                        o = r[s++];
                        break
                    }
                    if (++s >= i) throw new TypeError("reduce of empty array with no initial value")
                } while (!0);
            for (; s < i; s++) s in r && (o = t.call(void 0, o, r[s], s, n));
            return o
        };
        var C = !1;
        Array.prototype.reduceRight && (C = typeof Array.prototype.reduceRight.call("es5", function(e, t, n, r) {
            return r
        }) == "object");
        if (!Array.prototype.reduceRight || !C) Array.prototype.reduceRight = function(t) {
            var n = G(this),
                r = x && u.call(this) === "[object String]" ? this.split("") : n,
                i = r.length >>> 0;
            if (!a(t)) throw new TypeError(t + " is not a function");
            if (!i && arguments.length === 1) throw new TypeError("reduceRight of empty array with no initial value");
            var s, o = i - 1;
            if (arguments.length >= 2) s = arguments[1];
            else
                do {
                    if (o in r) {
                        s = r[o--];
                        break
                    }
                    if (--o < 0) throw new TypeError("reduceRight of empty array with no initial value")
                } while (!0);
            if (o < 0) return s;
            do o in r && (s = t.call(void 0, s, r[o], o, n)); while (o--);
            return s
        };
        if (!Array.prototype.indexOf || [0, 1].indexOf(1, 2) !== -1) Array.prototype.indexOf = function(t) {
            var n = x && u.call(this) === "[object String]" ? this.split("") : G(this),
                r = n.length >>> 0;
            if (!r) return -1;
            var i = 0;
            arguments.length > 1 && (i = J(arguments[1])), i = i >= 0 ? i : Math.max(0, r + i);
            for (; i < r; i++)
                if (i in n && n[i] === t) return i;
            return -1
        };
        if (!Array.prototype.lastIndexOf || [0, 1].lastIndexOf(0, -3) !== -1) Array.prototype.lastIndexOf = function(t) {
            var n = x && u.call(this) === "[object String]" ? this.split("") : G(this),
                r = n.length >>> 0;
            if (!r) return -1;
            var i = r - 1;
            arguments.length > 1 && (i = Math.min(i, J(arguments[1]))), i = i >= 0 ? i : r - Math.abs(i);
            for (; i >= 0; i--)
                if (i in n && t === n[i]) return i;
            return -1
        };
        var k = Object.keys && function() {
            return Object.keys(arguments).length === 2
        }(1, 2);
        if (!Object.keys) {
            var L = !{
                    toString: null
                }.propertyIsEnumerable("toString"),
                A = function() {}.propertyIsEnumerable("prototype"),
                O = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
                M = O.length;
            Object.keys = function(t) {
                var n = a(t),
                    r = c(t),
                    i = t !== null && typeof t == "object",
                    s = i && u.call(t) === "[object String]";
                if (!i && !n && !r) throw new TypeError("Object.keys called on a non-object");
                var o = [],
                    f = A && n;
                if (s || r)
                    for (var l = 0; l < t.length; ++l) o.push(String(l));
                else
                    for (var h in t)(!f || h !== "prototype") && p(t, h) && o.push(String(h));
                if (L) {
                    var d = t.constructor,
                        v = d && d.prototype === t;
                    for (var m = 0; m < M; m++) {
                        var g = O[m];
                        (!v || g !== "constructor") && p(t, g) && o.push(g)
                    }
                }
                return o
            }
        } else if (!k) {
            var _ = Object.keys;
            Object.keys = function(t) {
                return c(t) ? _(Array.prototype.slice.call(t)) : _(t)
            }
        }
        var D = -621987552e5,
            P = "-000001";
        if (!Date.prototype.toISOString || (new Date(D)).toISOString().indexOf(P) === -1) Date.prototype.toISOString = function() {
            var t, n, r, i, s;
            if (!isFinite(this)) throw new RangeError("Date.prototype.toISOString called on non-finite value.");
            i = this.getUTCFullYear(), s = this.getUTCMonth(), i += Math.floor(s / 12), s = (s % 12 + 12) % 12, t = [s + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()], i = (i < 0 ? "-" : i > 9999 ? "+" : "") + ("00000" + Math.abs(i)).slice(0 <= i && i <= 9999 ? -4 : -6), n = t.length;
            while (n--) r = t[n], r < 10 && (t[n] = "0" + r);
            return i + "-" + t.slice(0, 2).join("-") + "T" + t.slice(2).join(":") + "." + ("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
        };
        var H = !1;
        try {
            H = Date.prototype.toJSON && (new Date(NaN)).toJSON() === null && (new Date(D)).toJSON().indexOf(P) !== -1 && Date.prototype.toJSON.call({
                toISOString: function() {
                    return !0
                }
            })
        } catch (B) {}
        H || (Date.prototype.toJSON = function(t) {
            var n = Object(this),
                r = Q(n),
                i;
            if (typeof r == "number" && !isFinite(r)) return null;
            i = n.toISOString;
            if (typeof i != "function") throw new TypeError("toISOString property is not callable");
            return i.call(n)
        });
        var j = Date.parse("+033658-09-27T01:46:40.000Z") === 1e15,
            F = !isNaN(Date.parse("2012-04-04T24:00:00.500Z")) || !isNaN(Date.parse("2012-11-31T23:59:59.000Z")),
            I = isNaN(Date.parse("2000-01-01T00:00:00.000Z"));
        if (!Date.parse || I || F || !j) Date = function(e) {
            function t(n, r, i, s, o, u, a) {
                var f = arguments.length;
                if (this instanceof e) {
                    var l = f === 1 && String(n) === n ? new e(t.parse(n)) : f >= 7 ? new e(n, r, i, s, o, u, a) : f >= 6 ? new e(n, r, i, s, o, u) : f >= 5 ? new e(n, r, i, s, o) : f >= 4 ? new e(n, r, i, s) : f >= 3 ? new e(n, r, i) : f >= 2 ? new e(n, r) : f >= 1 ? new e(n) : new e;
                    return l.constructor = t, l
                }
                return e.apply(this, arguments)
            }

            function i(e, t) {
                var n = t > 1 ? 1 : 0;
                return r[t] + Math.floor((e - 1969 + n) / 4) - Math.floor((e - 1901 + n) / 100) + Math.floor((e - 1601 + n) / 400) + 365 * (e - 1970)
            }

            function s(t) {
                return Number(new e(1970, 0, 1, 0, 0, 0, t))
            }
            var n = new RegExp("^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:(\\.\\d{1,}))?)?(Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$"),
                r = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
            for (var o in e) t[o] = e[o];
            return t.now = e.now, t.UTC = e.UTC, t.prototype = e.prototype, t.prototype.constructor = t, t.parse = function(r) {
                var o = n.exec(r);
                if (o) {
                    var u = Number(o[1]),
                        a = Number(o[2] || 1) - 1,
                        f = Number(o[3] || 1) - 1,
                        l = Number(o[4] || 0),
                        c = Number(o[5] || 0),
                        h = Number(o[6] || 0),
                        p = Math.floor(Number(o[7] || 0) * 1e3),
                        d = Boolean(o[4] && !o[8]),
                        v = o[9] === "-" ? 1 : -1,
                        m = Number(o[10] || 0),
                        g = Number(o[11] || 0),
                        y;
                    if (l < (c > 0 || h > 0 || p > 0 ? 24 : 25) && c < 60 && h < 60 && p < 1e3 && a > -1 && a < 12 && m < 24 && g < 60 && f > -1 && f < i(u, a + 1) - i(u, a)) {
                        y = ((i(u, a) + f) * 24 + l + m * v) * 60, y = ((y + c + g * v) * 60 + h) * 1e3 + p, d && (y = s(y));
                        if (-864e13 <= y && y <= 864e13) return y
                    }
                    return NaN
                }
                return e.parse.apply(this, arguments)
            }, t
        }(Date);
        Date.now || (Date.now = function() {
            return (new Date).getTime()
        }), (!Number.prototype.toFixed || 8e-5.toFixed(3) !== "0.000" || .9.toFixed(0) === "0" || 1.255.toFixed(2) !== "1.25" || 0xde0b6b3a7640080.toFixed(0) !== "1000000000000000128") && function() {
            function i(r, i) {
                var s = -1;
                while (++s < t) i += r * n[s], n[s] = i % e, i = Math.floor(i / e)
            }

            function s(r) {
                var i = t,
                    s = 0;
                while (--i >= 0) s += n[i], n[i] = Math.floor(s / r), s = s % r * e
            }

            function o() {
                var e = t,
                    r = "";
                while (--e >= 0)
                    if (r !== "" || e === 0 || n[e] !== 0) {
                        var i = String(n[e]);
                        r === "" ? r = i : r += "0000000".slice(0, 7 - i.length) + i
                    } return r
            }

            function u(e, t, n) {
                return t === 0 ? n : t % 2 === 1 ? u(e, t - 1, n * e) : u(e * e, t / 2, n)
            }

            function a(e) {
                var t = 0;
                while (e >= 4096) t += 12, e /= 4096;
                while (e >= 2) t += 1, e /= 2;
                return t
            }
            var e, t, n, r;
            e = 1e7, t = 6, n = [0, 0, 0, 0, 0, 0], Number.prototype.toFixed = function(t) {
                var n, r, f, l, c, h, p, d;
                n = Number(t), n = n !== n ? 0 : Math.floor(n);
                if (n < 0 || n > 20) throw new RangeError("Number.toFixed called with invalid number of decimals");
                r = Number(this);
                if (r !== r) return "NaN";
                if (r <= -1e21 || r >= 1e21) return String(r);
                f = "", r < 0 && (f = "-", r = -r), l = "0";
                if (r > 1e-21) {
                    c = a(r * u(2, 69, 1)) - 69, h = c < 0 ? r * u(2, -c, 1) : r / u(2, c, 1), h *= 4503599627370496, c = 52 - c;
                    if (c > 0) {
                        i(0, h), p = n;
                        while (p >= 7) i(1e7, 0), p -= 7;
                        i(u(10, p, 1), 0), p = c - 1;
                        while (p >= 23) s(1 << 23), p -= 23;
                        s(1 << p), i(1, 1), s(2), l = o()
                    } else i(0, h), i(1 << -c, 0), l = o() + "0.00000000000000000000".slice(2, 2 + n)
                }
                return n > 0 ? (d = l.length, d <= n ? l = f + "0.0000000000000000000".slice(0, n - d + 2) + l : l = f + l.slice(0, d - n) + "." + l.slice(d - n)) : l = f + l, l
            }
        }();
        var q = String.prototype.split;
        "ab".split(/(?:ab)*/).length !== 2 || ".".split(/(.?)(.?)/).length !== 4 || "tesst".split(/(s)*/)[1] === "t" || "test".split(/(?:)/, -1).length !== 4 || "".split(/.?/).length || ".".split(/()()/).length > 1 ? function() {
            var e = /()??/.exec("")[1] === void 0;
            String.prototype.split = function(t, n) {
                var r = this;
                if (t === void 0 && n === 0) return [];
                if (u.call(t) !== "[object RegExp]") return q.call(this, t, n);
                var i = [],
                    s = (t.ignoreCase ? "i" : "") + (t.multiline ? "m" : "") + (t.extended ? "x" : "") + (t.sticky ? "y" : ""),
                    o = 0,
                    a, f, l, c;
                t = new RegExp(t.source, s + "g"), r += "", e || (a = new RegExp("^" + t.source + "$(?!\\s)", s)), n = n === void 0 ? -1 >>> 0 : Y(n);
                while (f = t.exec(r)) {
                    l = f.index + f[0].length;
                    if (l > o) {
                        i.push(r.slice(o, f.index)), !e && f.length > 1 && f[0].replace(a, function() {
                            for (var e = 1; e < arguments.length - 2; e++) arguments[e] === void 0 && (f[e] = void 0)
                        }), f.length > 1 && f.index < r.length && Array.prototype.push.apply(i, f.slice(1)), c = f[0].length, o = l;
                        if (i.length >= n) break
                    }
                    t.lastIndex === f.index && t.lastIndex++
                }
                return o === r.length ? (c || !t.test("")) && i.push("") : i.push(r.slice(o)), i.length > n ? i.slice(0, n) : i
            }
        }() : "0".split(void 0, 0).length && (String.prototype.split = function(t, n) {
            return t === void 0 && n === 0 ? [] : q.call(this, t, n)
        });
        var R = String.prototype.replace,
            U = function() {
                var e = [];
                return "x".replace(/x(.)?/g, function(t, n) {
                    e.push(n)
                }), e.length === 1 && typeof e[0] == "undefined"
            }();
        U || (String.prototype.replace = function(t, n) {
            var r = a(n),
                i = f(t) && /\)[*?]/.test(t.source);
            if (!r || !i) return R.call(this, t, n);
            var s = function(e) {
                var r = arguments.length,
                    i = t.lastIndex;
                t.lastIndex = 0;
                var s = t.exec(e);
                return t.lastIndex = i, s.push(arguments[r - 2], arguments[r - 1]), n.apply(this, s)
            };
            return R.call(this, t, s)
        });
        if ("".substr && "0b".substr(-1) !== "b") {
            var z = String.prototype.substr;
            String.prototype.substr = function(t, n) {
                return z.call(this, t < 0 ? (t = this.length + t) < 0 ? 0 : t : t, n)
            }
        }
        var W = "   \n\f\r Â áš€á Žâ€€â€â€‚â€ƒâ€„â€…â€†â€‡â€ˆâ€‰â€Šâ€¯âŸã€€\u2028\u2029ï»¿",
            X = "â€‹";
        if (!String.prototype.trim || W.trim() || !X.trim()) {
            W = "[" + W + "]";
            var V = new RegExp("^" + W + W + "*"),
                $ = new RegExp(W + W + "*$");
            String.prototype.trim = function() {
                if (this === void 0 || this === null) throw new TypeError("can't convert " + this + " to object");
                return String(this).replace(V, "").replace($, "")
            }
        }
        if (parseInt(W + "08") !== 8 || parseInt(W + "0x16") !== 22) parseInt = function(e) {
            var t = /^0[xX]/;
            return function(r, i) {
                return r = String(r).trim(), Number(i) || (i = t.test(r) ? 16 : 10), e(r, i)
            }
        }(parseInt);
        var G = function(e) {
                if (e == null) throw new TypeError("can't convert " + e + " to object");
                return Object(e)
            },
            Y = function(t) {
                return t >>> 0
            }
    }), window.Modernizr = function(e, t, n) {
        function x(e) {
            f.cssText = e
        }

        function T(e, t) {
            return x(prefixes.join(e + ";") + (t || ""))
        }

        function N(e, t) {
            return typeof e === t
        }

        function C(e, t) {
            return !!~("" + e).indexOf(t)
        }

        function k(e, t) {
            for (var r in e) {
                var i = e[r];
                if (!C(i, "-") && f[i] !== n) return t == "pfx" ? i : !0
            }
            return !1
        }

        function L(e, t, r) {
            for (var i in e) {
                var s = t[e[i]];
                if (s !== n) return r === !1 ? e[i] : N(s, "function") ? s.bind(r || t) : s
            }
            return !1
        }

        function A(e, t, n) {
            var r = e.charAt(0).toUpperCase() + e.slice(1),
                i = (e + " " + p.join(r + " ") + r).split(" ");
            return N(t, "string") || N(t, "undefined") ? k(i, t) : (i = (e + " " + d.join(r + " ") + r).split(" "), L(i, t, n))
        }
        var r = "2.8.3",
            i = {},
            s = !0,
            o = t.documentElement,
            u = "modernizr",
            a = t.createElement(u),
            f = a.style,
            l, c = {}.toString,
            h = "Webkit Moz O ms",
            p = h.split(" "),
            d = h.toLowerCase().split(" "),
            v = {},
            m = {},
            g = {},
            y = [],
            b = y.slice,
            w, E = {}.hasOwnProperty,
            S;
        !N(E, "undefined") && !N(E.call, "undefined") ? S = function(e, t) {
            return E.call(e, t)
        } : S = function(e, t) {
            return t in e && N(e.constructor.prototype[t], "undefined")
        }, Function.prototype.bind || (Function.prototype.bind = function(t) {
            var n = this;
            if (typeof n != "function") throw new TypeError;
            var r = b.call(arguments, 1),
                i = function() {
                    if (this instanceof i) {
                        var e = function() {};
                        e.prototype = n.prototype;
                        var s = new e,
                            o = n.apply(s, r.concat(b.call(arguments)));
                        return Object(o) === o ? o : s
                    }
                    return n.apply(t, r.concat(b.call(arguments)))
                };
            return i
        }), v.cssanimations = function() {
            return A("animationName")
        }, v.csstransforms = function() {
            return !!A("transform")
        };
        for (var O in v) S(v, O) && (w = O.toLowerCase(), i[w] = v[O](), y.push((i[w] ? "" : "no-") + w));
        return i.addTest = function(e, t) {
            if (typeof e == "object")
                for (var r in e) S(e, r) && i.addTest(r, e[r]);
            else {
                e = e.toLowerCase();
                if (i[e] !== n) return i;
                t = typeof t == "function" ? t() : t, typeof s != "undefined" && s && (o.className += " " + (t ? "" : "no-") + e), i[e] = t
            }
            return i
        }, x(""), a = l = null, i._version = r, i._domPrefixes = d, i._cssomPrefixes = p, i.testProp = function(e) {
            return k([e])
        }, i.testAllProps = A, o.className = o.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (s ? " js " + y.join(" ") : ""), i
    }(this, this.document);
    var JSON;
    JSON || (JSON = {}),
        function() {
            "use strict";

            function f(e) {
                return e < 10 ? "0" + e : e
            }

            function quote(e) {
                return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function(e) {
                    var t = meta[e];
                    return typeof t == "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + e + '"'
            }

            function str(e, t) {
                var n, r, i, s, o = gap,
                    u, a = t[e];
                a && typeof a == "object" && typeof a.toJSON == "function" && (a = a.toJSON(e)), typeof rep == "function" && (a = rep.call(t, e, a));
                switch (typeof a) {
                    case "string":
                        return quote(a);
                    case "number":
                        return isFinite(a) ? String(a) : "null";
                    case "boolean":
                    case "null":
                        return String(a);
                    case "object":
                        if (!a) return "null";
                        gap += indent, u = [];
                        if (Object.prototype.toString.apply(a) === "[object Array]") {
                            s = a.length;
                            for (n = 0; n < s; n += 1) u[n] = str(n, a) || "null";
                            return i = u.length === 0 ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + o + "]" : "[" + u.join(",") + "]", gap = o, i
                        }
                        if (rep && typeof rep == "object") {
                            s = rep.length;
                            for (n = 0; n < s; n += 1) typeof rep[n] == "string" && (r = rep[n], i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i))
                        } else
                            for (r in a) Object.prototype.hasOwnProperty.call(a, r) && (i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i));
                        return i = u.length === 0 ? "{}" : gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + o + "}" : "{" + u.join(",") + "}", gap = o, i
                }
            }
            typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function(e) {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
            }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(e) {
                return this.valueOf()
            });
            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                gap, indent, meta = {
                    "\b": "\\b",
                    "   ": "\\t",
                    "\n": "\\n",
                    "\f": "\\f",
                    "\r": "\\r",
                    '"': '\\"',
                    "\\": "\\\\"
                },
                rep;
            typeof JSON.stringify != "function" && (JSON.stringify = function(e, t, n) {
                var r;
                gap = "", indent = "";
                if (typeof n == "number")
                    for (r = 0; r < n; r += 1) indent += " ";
                else typeof n == "string" && (indent = n);
                rep = t;
                if (!t || typeof t == "function" || typeof t == "object" && typeof t.length == "number") return str("", {
                    "": e
                });
                throw new Error("JSON.stringify")
            }), typeof JSON.parse != "function" && (JSON.parse = function(text, reviver) {
                function walk(e, t) {
                    var n, r, i = e[t];
                    if (i && typeof i == "object")
                        for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (r = walk(i, n), r !== undefined ? i[n] = r : delete i[n]);
                    return reviver.call(e, t, i)
                }
                var j;
                text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
                    return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                }));
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({
                    "": j
                }, "") : j;
                throw new SyntaxError("JSON.parse")
            })
        }(),
        function() {
            var e = this,
                t = e._,
                n = {},
                r = Array.prototype,
                i = Object.prototype,
                s = Function.prototype,
                o = r.push,
                u = r.slice,
                a = r.concat,
                f = i.toString,
                l = i.hasOwnProperty,
                c = r.forEach,
                h = r.map,
                p = r.reduce,
                d = r.reduceRight,
                v = r.filter,
                m = r.every,
                g = r.some,
                y = r.indexOf,
                b = r.lastIndexOf,
                w = Array.isArray,
                E = Object.keys,
                S = s.bind,
                x = function(e) {
                    if (e instanceof x) return e;
                    if (!(this instanceof x)) return new x(e);
                    this._wrapped = e
                };
            typeof exports != "undefined" ? (typeof module != "undefined" && module.exports && (exports = module.exports = x), exports._ = x) : e._ = x, x.VERSION = "1.4.4";
            var T = x.each = x.forEach = function(e, t, r) {
                if (e == null) return;
                if (c && e.forEach === c) e.forEach(t, r);
                else if (e.length === +e.length) {
                    for (var i = 0, s = e.length; i < s; i++)
                        if (t.call(r, e[i], i, e) === n) return
                } else
                    for (var o in e)
                        if (x.has(e, o) && t.call(r, e[o], o, e) === n) return
            };
            x.map = x.collect = function(e, t, n) {
                var r = [];
                return e == null ? r : h && e.map === h ? e.map(t, n) : (T(e, function(e, i, s) {
                    r[r.length] = t.call(n, e, i, s)
                }), r)
            };
            var N = "Reduce of empty array with no initial value";
            x.reduce = x.foldl = x.inject = function(e, t, n, r) {
                var i = arguments.length > 2;
                e == null && (e = []);
                if (p && e.reduce === p) return r && (t = x.bind(t, r)), i ? e.reduce(t, n) : e.reduce(t);
                T(e, function(e, s, o) {
                    i ? n = t.call(r, n, e, s, o) : (n = e, i = !0)
                });
                if (!i) throw new TypeError(N);
                return n
            }, x.reduceRight = x.foldr = function(e, t, n, r) {
                var i = arguments.length > 2;
                e == null && (e = []);
                if (d && e.reduceRight === d) return r && (t = x.bind(t, r)), i ? e.reduceRight(t, n) : e.reduceRight(t);
                var s = e.length;
                if (s !== +s) {
                    var o = x.keys(e);
                    s = o.length
                }
                T(e, function(u, a, f) {
                    a = o ? o[--s] : --s, i ? n = t.call(r, n, e[a], a, f) : (n = e[a], i = !0)
                });
                if (!i) throw new TypeError(N);
                return n
            }, x.find = x.detect = function(e, t, n) {
                var r;
                return C(e, function(e, i, s) {
                    if (t.call(n, e, i, s)) return r = e, !0
                }), r
            }, x.filter = x.select = function(e, t, n) {
                var r = [];
                return e == null ? r : v && e.filter === v ? e.filter(t, n) : (T(e, function(e, i, s) {
                    t.call(n, e, i, s) && (r[r.length] = e)
                }), r)
            }, x.reject = function(e, t, n) {
                return x.filter(e, function(e, r, i) {
                    return !t.call(n, e, r, i)
                }, n)
            }, x.every = x.all = function(e, t, r) {
                t || (t = x.identity);
                var i = !0;
                return e == null ? i : m && e.every === m ? e.every(t, r) : (T(e, function(e, s, o) {
                    if (!(i = i && t.call(r, e, s, o))) return n
                }), !!i)
            };
            var C = x.some = x.any = function(e, t, r) {
                t || (t = x.identity);
                var i = !1;
                return e == null ? i : g && e.some === g ? e.some(t, r) : (T(e, function(e, s, o) {
                    if (i || (i = t.call(r, e, s, o))) return n
                }), !!i)
            };
            x.contains = x.include = function(e, t) {
                return e == null ? !1 : y && e.indexOf === y ? e.indexOf(t) != -1 : C(e, function(e) {
                    return e === t
                })
            }, x.invoke = function(e, t) {
                var n = u.call(arguments, 2),
                    r = x.isFunction(t);
                return x.map(e, function(e) {
                    return (r ? t : e[t]).apply(e, n)
                })
            }, x.pluck = function(e, t) {
                return x.map(e, function(e) {
                    return e[t]
                })
            }, x.where = function(e, t, n) {
                return x.isEmpty(t) ? n ? null : [] : x[n ? "find" : "filter"](e, function(e) {
                    for (var n in t)
                        if (t[n] !== e[n]) return !1;
                    return !0
                })
            }, x.findWhere = function(e, t) {
                return x.where(e, t, !0)
            }, x.max = function(e, t, n) {
                if (!t && x.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.max.apply(Math, e);
                if (!t && x.isEmpty(e)) return -Infinity;
                var r = {
                    computed: -Infinity,
                    value: -Infinity
                };
                return T(e, function(e, i, s) {
                    var o = t ? t.call(n, e, i, s) : e;
                    o >= r.computed && (r = {
                        value: e,
                        computed: o
                    })
                }), r.value
            }, x.min = function(e, t, n) {
                if (!t && x.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.min.apply(Math, e);
                if (!t && x.isEmpty(e)) return Infinity;
                var r = {
                    computed: Infinity,
                    value: Infinity
                };
                return T(e, function(e, i, s) {
                    var o = t ? t.call(n, e, i, s) : e;
                    o < r.computed && (r = {
                        value: e,
                        computed: o
                    })
                }), r.value
            }, x.shuffle = function(e) {
                var t, n = 0,
                    r = [];
                return T(e, function(e) {
                    t = x.random(n++), r[n - 1] = r[t], r[t] = e
                }), r
            };
            var k = function(e) {
                return x.isFunction(e) ? e : function(t) {
                    return t[e]
                }
            };
            x.sortBy = function(e, t, n) {
                var r = k(t);
                return x.pluck(x.map(e, function(e, t, i) {
                    return {
                        value: e,
                        index: t,
                        criteria: r.call(n, e, t, i)
                    }
                }).sort(function(e, t) {
                    var n = e.criteria,
                        r = t.criteria;
                    if (n !== r) {
                        if (n > r || n === void 0) return 1;
                        if (n < r || r === void 0) return -1
                    }
                    return e.index < t.index ? -1 : 1
                }), "value")
            };
            var L = function(e, t, n, r) {
                var i = {},
                    s = k(t || x.identity);
                return T(e, function(t, o) {
                    var u = s.call(n, t, o, e);
                    r(i, u, t)
                }), i
            };
            x.groupBy = function(e, t, n) {
                return L(e, t, n, function(e, t, n) {
                    (x.has(e, t) ? e[t] : e[t] = []).push(n)
                })
            }, x.countBy = function(e, t, n) {
                return L(e, t, n, function(e, t) {
                    x.has(e, t) || (e[t] = 0), e[t]++
                })
            }, x.sortedIndex = function(e, t, n, r) {
                n = n == null ? x.identity : k(n);
                var i = n.call(r, t),
                    s = 0,
                    o = e.length;
                while (s < o) {
                    var u = s + o >>> 1;
                    n.call(r, e[u]) < i ? s = u + 1 : o = u
                }
                return s
            }, x.toArray = function(e) {
                return e ? x.isArray(e) ? u.call(e) : e.length === +e.length ? x.map(e, x.identity) : x.values(e) : []
            }, x.size = function(e) {
                return e == null ? 0 : e.length === +e.length ? e.length : x.keys(e).length
            }, x.first = x.head = x.take = function(e, t, n) {
                return e == null ? void 0 : t != null && !n ? u.call(e, 0, t) : e[0]
            }, x.initial = function(e, t, n) {
                return u.call(e, 0, e.length - (t == null || n ? 1 : t))
            }, x.last = function(e, t, n) {
                return e == null ? void 0 : t != null && !n ? u.call(e, Math.max(e.length - t, 0)) : e[e.length - 1]
            }, x.rest = x.tail = x.drop = function(e, t, n) {
                return u.call(e, t == null || n ? 1 : t)
            }, x.compact = function(e) {
                return x.filter(e, x.identity)
            };
            var A = function(e, t, n) {
                return T(e, function(e) {
                    x.isArray(e) ? t ? o.apply(n, e) : A(e, t, n) : n.push(e)
                }), n
            };
            x.flatten = function(e, t) {
                return A(e, t, [])
            }, x.without = function(e) {
                return x.difference(e, u.call(arguments, 1))
            }, x.uniq = x.unique = function(e, t, n, r) {
                x.isFunction(t) && (r = n, n = t, t = !1);
                var i = n ? x.map(e, n, r) : e,
                    s = [],
                    o = [];
                return T(i, function(n, r) {
                    if (t ? !r || o[o.length - 1] !== n : !x.contains(o, n)) o.push(n), s.push(e[r])
                }), s
            }, x.union = function() {
                return x.uniq(a.apply(r, arguments))
            }, x.intersection = function(e) {
                var t = u.call(arguments, 1);
                return x.filter(x.uniq(e), function(e) {
                    return x.every(t, function(t) {
                        return x.indexOf(t, e) >= 0
                    })
                })
            }, x.difference = function(e) {
                var t = a.apply(r, u.call(arguments, 1));
                return x.filter(e, function(e) {
                    return !x.contains(t, e)
                })
            }, x.zip = function() {
                var e = u.call(arguments),
                    t = x.max(x.pluck(e, "length")),
                    n = new Array(t);
                for (var r = 0; r < t; r++) n[r] = x.pluck(e, "" + r);
                return n
            }, x.object = function(e, t) {
                if (e == null) return {};
                var n = {};
                for (var r = 0, i = e.length; r < i; r++) t ? n[e[r]] = t[r] : n[e[r][0]] = e[r][1];
                return n
            }, x.indexOf = function(e, t, n) {
                if (e == null) return -1;
                var r = 0,
                    i = e.length;
                if (n) {
                    if (typeof n != "number") return r = x.sortedIndex(e, t), e[r] === t ? r : -1;
                    r = n < 0 ? Math.max(0, i + n) : n
                }
                if (y && e.indexOf === y) return e.indexOf(t, n);
                for (; r < i; r++)
                    if (e[r] === t) return r;
                return -1
            }, x.lastIndexOf = function(e, t, n) {
                if (e == null) return -1;
                var r = n != null;
                if (b && e.lastIndexOf === b) return r ? e.lastIndexOf(t, n) : e.lastIndexOf(t);
                var i = r ? n : e.length;
                while (i--)
                    if (e[i] === t) return i;
                return -1
            }, x.range = function(e, t, n) {
                arguments.length <= 1 && (t = e || 0, e = 0), n = arguments[2] || 1;
                var r = Math.max(Math.ceil((t - e) / n), 0),
                    i = 0,
                    s = new Array(r);
                while (i < r) s[i++] = e, e += n;
                return s
            }, x.bind = function(e, t) {
                if (e.bind === S && S) return S.apply(e, u.call(arguments, 1));
                var n = u.call(arguments, 2);
                return function() {
                    return e.apply(t, n.concat(u.call(arguments)))
                }
            }, x.partial = function(e) {
                var t = u.call(arguments, 1);
                return function() {
                    return e.apply(this, t.concat(u.call(arguments)))
                }
            }, x.bindAll = function(e) {
                var t = u.call(arguments, 1);
                return t.length === 0 && (t = x.functions(e)), T(t, function(t) {
                    e[t] = x.bind(e[t], e)
                }), e
            }, x.memoize = function(e, t) {
                var n = {};
                return t || (t = x.identity),
                    function() {
                        var r = t.apply(this, arguments);
                        return x.has(n, r) ? n[r] : n[r] = e.apply(this, arguments)
                    }
            }, x.delay = function(e, t) {
                var n = u.call(arguments, 2);
                return setTimeout(function() {
                    return e.apply(null, n)
                }, t)
            }, x.defer = function(e) {
                return x.delay.apply(x, [e, 1].concat(u.call(arguments, 1)))
            }, x.throttle = function(e, t) {
                var n, r, i, s, o = 0,
                    u = function() {
                        o = new Date, i = null, s = e.apply(n, r)
                    };
                return function() {
                    var a = new Date,
                        f = t - (a - o);
                    return n = this, r = arguments, f <= 0 ? (clearTimeout(i), i = null, o = a, s = e.apply(n, r)) : i || (i = setTimeout(u, f)), s
                }
            }, x.debounce = function(e, t, n) {
                var r, i;
                return function() {
                    var s = this,
                        o = arguments,
                        u = function() {
                            r = null, n || (i = e.apply(s, o))
                        },
                        a = n && !r;
                    return clearTimeout(r), r = setTimeout(u, t), a && (i = e.apply(s, o)), i
                }
            }, x.once = function(e) {
                var t = !1,
                    n;
                return function() {
                    return t ? n : (t = !0, n = e.apply(this, arguments), e = null, n)
                }
            }, x.wrap = function(e, t) {
                return function() {
                    var n = [e];
                    return o.apply(n, arguments), t.apply(this, n)
                }
            }, x.compose = function() {
                var e = arguments;
                return function() {
                    var t = arguments;
                    for (var n = e.length - 1; n >= 0; n--) t = [e[n].apply(this, t)];
                    return t[0]
                }
            }, x.after = function(e, t) {
                return e <= 0 ? t() : function() {
                    if (--e < 1) return t.apply(this, arguments)
                }
            }, x.keys = E || function(e) {
                if (e !== Object(e)) throw new TypeError("Invalid object");
                var t = [];
                for (var n in e) x.has(e, n) && (t[t.length] = n);
                return t
            }, x.values = function(e) {
                var t = [];
                for (var n in e) x.has(e, n) && t.push(e[n]);
                return t
            }, x.pairs = function(e) {
                var t = [];
                for (var n in e) x.has(e, n) && t.push([n, e[n]]);
                return t
            }, x.invert = function(e) {
                var t = {};
                for (var n in e) x.has(e, n) && (t[e[n]] = n);
                return t
            }, x.functions = x.methods = function(e) {
                var t = [];
                for (var n in e) x.isFunction(e[n]) && t.push(n);
                return t.sort()
            }, x.extend = function(e) {
                return T(u.call(arguments, 1), function(t) {
                    if (t)
                        for (var n in t) e[n] = t[n]
                }), e
            }, x.pick = function(e) {
                var t = {},
                    n = a.apply(r, u.call(arguments, 1));
                return T(n, function(n) {
                    n in e && (t[n] = e[n])
                }), t
            }, x.omit = function(e) {
                var t = {},
                    n = a.apply(r, u.call(arguments, 1));
                for (var i in e) x.contains(n, i) || (t[i] = e[i]);
                return t
            }, x.defaults = function(e) {
                return T(u.call(arguments, 1), function(t) {
                    if (t)
                        for (var n in t) e[n] == null && (e[n] = t[n])
                }), e
            }, x.clone = function(e) {
                return x.isObject(e) ? x.isArray(e) ? e.slice() : x.extend({}, e) : e
            }, x.tap = function(e, t) {
                return t(e), e
            };
            var O = function(e, t, n, r) {
                if (e === t) return e !== 0 || 1 / e == 1 / t;
                if (e == null || t == null) return e === t;
                e instanceof x && (e = e._wrapped), t instanceof x && (t = t._wrapped);
                var i = f.call(e);
                if (i != f.call(t)) return !1;
                switch (i) {
                    case "[object String]":
                        return e == String(t);
                    case "[object Number]":
                        return e != +e ? t != +t : e == 0 ? 1 / e == 1 / t : e == +t;
                    case "[object Date]":
                    case "[object Boolean]":
                        return +e == +t;
                    case "[object RegExp]":
                        return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase
                }
                if (typeof e != "object" || typeof t != "object") return !1;
                var s = n.length;
                while (s--)
                    if (n[s] == e) return r[s] == t;
                n.push(e), r.push(t);
                var o = 0,
                    u = !0;
                if (i == "[object Array]") {
                    o = e.length, u = o == t.length;
                    if (u)
                        while (o--)
                            if (!(u = O(e[o], t[o], n, r))) break
                } else {
                    var a = e.constructor,
                        l = t.constructor;
                    if (a !== l && !(x.isFunction(a) && a instanceof a && x.isFunction(l) && l instanceof l)) return !1;
                    for (var c in e)
                        if (x.has(e, c)) {
                            o++;
                            if (!(u = x.has(t, c) && O(e[c], t[c], n, r))) break
                        } if (u) {
                        for (c in t)
                            if (x.has(t, c) && !(o--)) break;
                        u = !o
                    }
                }
                return n.pop(), r.pop(), u
            };
            x.isEqual = function(e, t) {
                return O(e, t, [], [])
            }, x.isEmpty = function(e) {
                if (e == null) return !0;
                if (x.isArray(e) || x.isString(e)) return e.length === 0;
                for (var t in e)
                    if (x.has(e, t)) return !1;
                return !0
            }, x.isElement = function(e) {
                return !!e && e.nodeType === 1
            }, x.isArray = w || function(e) {
                return f.call(e) == "[object Array]"
            }, x.isObject = function(e) {
                return e === Object(e)
            }, T(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(e) {
                x["is" + e] = function(t) {
                    return f.call(t) == "[object " + e + "]"
                }
            }), x.isArguments(arguments) || (x.isArguments = function(e) {
                return !!e && !!x.has(e, "callee")
            }), typeof /./ != "function" && (x.isFunction = function(e) {
                return typeof e == "function"
            }), x.isFinite = function(e) {
                return isFinite(e) && !isNaN(parseFloat(e))
            }, x.isNaN = function(e) {
                return x.isNumber(e) && e != +e
            }, x.isBoolean = function(e) {
                return e === !0 || e === !1 || f.call(e) == "[object Boolean]"
            }, x.isNull = function(e) {
                return e === null
            }, x.isUndefined = function(e) {
                return e === void 0
            }, x.has = function(e, t) {
                return l.call(e, t)
            }, x.noConflict = function() {
                return e._ = t, this
            }, x.identity = function(e) {
                return e
            }, x.times = function(e, t, n) {
                var r = Array(e);
                for (var i = 0; i < e; i++) r[i] = t.call(n, i);
                return r
            }, x.random = function(e, t) {
                return t == null && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1))
            };
            var M = {
                escape: {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#x27;"
                }
            };
            M.unescape = x.invert(M.escape);
            var _ = {
                escape: new RegExp("[" + x.keys(M.escape).join("") + "]", "g"),
                unescape: new RegExp("(" + x.keys(M.unescape).join("|") + ")", "g")
            };
            x.each(["escape", "unescape"], function(e) {
                x[e] = function(t) {
                    return t == null ? "" : ("" + t).replace(_[e], function(t) {
                        return M[e][t]
                    })
                }
            }), x.result = function(e, t) {
                if (e == null) return null;
                var n = e[t];
                return x.isFunction(n) ? n.call(e) : n
            }, x.mixin = function(e) {
                T(x.functions(e), function(t) {
                    var n = x[t] = e[t];
                    x.prototype[t] = function() {
                        var e = [this._wrapped];
                        return o.apply(e, arguments), j.call(this, n.apply(x, e))
                    }
                })
            };
            var D = 0;
            x.uniqueId = function(e) {
                var t = ++D + "";
                return e ? e + t : t
            }, x.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var P = /(.)^/,
                H = {
                    "'": "'",
                    "\\": "\\",
                    "\r": "r",
                    "\n": "n",
                    "   ": "t",
                    "\u2028": "u2028",
                    "\u2029": "u2029"
                },
                B = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            x.template = function(e, t, n) {
                var r;
                n = x.defaults({}, n, x.templateSettings);
                var i = new RegExp([(n.escape || P).source, (n.interpolate || P).source, (n.evaluate || P).source].join("|") + "|$", "g"),
                    s = 0,
                    o = "__p+='";
                e.replace(i, function(t, n, r, i, u) {
                    return o += e.slice(s, u).replace(B, function(e) {
                        return "\\" + H[e]
                    }), n && (o += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'"), r && (o += "'+\n((__t=(" + r + "))==null?'':__t)+\n'"), i && (o += "';\n" + i + "\n__p+='"), s = u + t.length, t
                }), o += "';\n", n.variable || (o = "with(obj||{}){\n" + o + "}\n"), o = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + o + "return __p;\n";
                try {
                    r = new Function(n.variable || "obj", "_", o)
                } catch (u) {
                    throw u.source = o, u
                }
                if (t) return r(t, x);
                var a = function(e) {
                    return r.call(this, e, x)
                };
                return a.source = "function(" + (n.variable || "obj") + "){\n" + o + "}", a
            }, x.chain = function(e) {
                return x(e).chain()
            };
            var j = function(e) {
                return this._chain ? x(e).chain() : e
            };
            x.mixin(x), T(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(e) {
                var t = r[e];
                x.prototype[e] = function() {
                    var n = this._wrapped;
                    return t.apply(n, arguments), (e == "shift" || e == "splice") && n.length === 0 && delete n[0], j.call(this, n)
                }
            }), T(["concat", "join", "slice"], function(e) {
                var t = r[e];
                x.prototype[e] = function() {
                    return j.call(this, t.apply(this._wrapped, arguments))
                }
            }), x.extend(x.prototype, {
                chain: function() {
                    return this._chain = !0, this
                },
                value: function() {
                    return this._wrapped
                }
            })
        }.call(this),
        function() {
            function u() {
                try {
                    return r in t && t[r]
                } catch (e) {
                    return !1
                }
            }

            function a() {
                try {
                    return i in t && t[i] && t[i][t.location.hostname]
                } catch (e) {
                    return !1
                }
            }
            var e = {},
                t = window,
                n = t.document,
                r = "localStorage",
                i = "globalStorage",
                s = "__storejs__",
                o;
            e.disabled = !1, e.set = function(e, t) {}, e.get = function(e) {}, e.remove = function(e) {}, e.clear = function() {}, e.transact = function(t, n, r) {
                var i = e.get(t);
                r == null && (r = n, n = null), typeof i == "undefined" && (i = n || {}), r(i), e.set(t, i)
            }, e.getAll = function() {}, e.serialize = function(e) {
                return JSON.stringify(e)
            }, e.deserialize = function(e) {
                return typeof e != "string" ? undefined : JSON.parse(e)
            };
            if (u()) o = t[r], e.set = function(t, n) {
                if (n === undefined) return e.remove(t);
                o.setItem(t, e.serialize(n))
            }, e.get = function(t) {
                return e.deserialize(o.getItem(t))
            }, e.remove = function(e) {
                o.removeItem(e)
            }, e.clear = function() {
                o.clear()
            }, e.getAll = function() {
                var t = {};
                for (var n = 0; n < o.length; ++n) {
                    var r = o.key(n);
                    t[r] = e.get(r)
                }
                return t
            };
            else if (a()) o = t[i][t.location.hostname], e.set = function(t, n) {
                if (n === undefined) return e.remove(t);
                o[t] = e.serialize(n)
            }, e.get = function(t) {
                return e.deserialize(o[t] && o[t].value)
            }, e.remove = function(e) {
                delete o[e]
            }, e.clear = function() {
                for (var e in o) delete o[e]
            }, e.getAll = function() {
                var t = {};
                for (var n = 0; n < o.length; ++n) {
                    var r = o.key(n);
                    t[r] = e.get(r)
                }
                return t
            };
            else if (n.documentElement.addBehavior) {
                var f, l;
                try {
                    l = new ActiveXObject("htmlfile"), l.open(), l.write('<script>document.w=window</script><iframe src="/favicon.ico"></iframe>'), l.close(), f = l.w.frames[0].document, o = f.createElement("div")
                } catch (c) {
                    o = n.createElement("div"), f = n.body
                }

                function h(t) {
                    return function() {
                        var n = Array.prototype.slice.call(arguments, 0);
                        n.unshift(o), f.appendChild(o), o.addBehavior("#default#userData"), o.load(r);
                        var i = t.apply(e, n);
                        return f.removeChild(o), i
                    }
                }

                function p(e) {
                    return "_" + e
                }
                e.set = h(function(t, n, i) {
                    n = p(n);
                    if (i === undefined) return e.remove(n);
                    t.setAttribute(n, e.serialize(i)), t.save(r)
                }), e.get = h(function(t, n) {
                    return n = p(n), e.deserialize(t.getAttribute(n))
                }), e.remove = h(function(e, t) {
                    t = p(t), e.removeAttribute(t), e.save(r)
                }), e.clear = h(function(e) {
                    var t = e.XMLDocument.documentElement.attributes;
                    e.load(r);
                    for (var n = 0, i; i = t[n]; n++) e.removeAttribute(i.name);
                    e.save(r)
                }), e.getAll = h(function(t) {
                    var n = t.XMLDocument.documentElement.attributes;
                    t.load(r);
                    var i = {};
                    for (var s = 0, o; o = n[s]; ++s) i[o] = e.get(o);
                    return i
                })
            }
            try {
                e.set(s, s), e.get(s) != s && (e.disabled = !0), e.remove(s)
            } catch (c) {
                e.disabled = !0
            }
            typeof module != "undefined" && typeof module != "function" ? module.exports = e : typeof define == "function" && define.amd ? define(e) : this.store = e
        }(),
        function(e, t) {
            var n = function(e) {
                this.defaults = {
                    locale_data: {
                        messages: {
                            "": {
                                domain: "messages",
                                lang: "en",
                                plural_forms: "(n != 1);"
                            }
                        }
                    },
                    domain: "messages"
                }, this.options = _.extend({}, this.defaults, e), this.textdomain(this.options.domain);
                if (e.domain && !this.options.locale_data[this.options.domain]) throw new Error("Text domain set to non-existent domain: `" + e.domain + "`")
            };
            n.context_delimiter = String.fromCharCode(4);
            var r = _.memoize(function(e) {
                function t(e, t) {
                    var n = e(t);
                    return n === !0 ? 1 : n ? n : 0
                }
                var e = e || "(n != 1)";
                return _.partial(t, new Function("n", "return " + e))
            });
            _.extend(n.prototype, {
                textdomain: function(e) {
                    if (!e) return this._textdomain;
                    this._textdomain = e
                },
                gettext: function(e) {
                    return this.dcnpgettext.call(this, t, t, e)
                },
                dgettext: function(e, n) {
                    return this.dcnpgettext.call(this, e, t, n)
                },
                dcgettext: function(e, n) {
                    return this.dcnpgettext.call(this, e, t, n)
                },
                ngettext: function(e, n, r) {
                    return this.dcnpgettext.call(this, t, t, e, n, r)
                },
                dngettext: function(e, n, r, i) {
                    return this.dcnpgettext.call(this, e, t, n, r, i)
                },
                dcngettext: function(e, n, r, i) {
                    return this.dcnpgettext.call(this, e, t, n, r, i)
                },
                pgettext: function(e, n) {
                    return this.dcnpgettext.call(this, t, e, n)
                },
                dpgettext: function(e, t, n) {
                    return this.dcnpgettext.call(this, e, t, n)
                },
                dcpgettext: function(e, t, n) {
                    return this.dcnpgettext.call(this, e, t, n)
                },
                npgettext: function(e, n, r, i) {
                    return this.dcnpgettext.call(this, t, e, n, r, i)
                },
                dnpgettext: function(e, t, n, r, i) {
                    return this.dcnpgettext.call(this, e, t, n, r, i)
                },
                dcnpgettext: function(e, t, i, s, o) {
                    s = s || i, e = e || this._textdomain, o = typeof o == "undefined" ? 1 : o;
                    var u;
                    if (!this.options) return u = new n, u.dcnpgettext.call(u, undefined, undefined, i, s, o);
                    if (!this.options.locale_data) throw new Error("No locale data provided.");
                    if (!this.options.locale_data[e]) throw new Error("Domain `" + e + "` was not found.");
                    if (!this.options.locale_data[e][""]) throw new Error("No locale meta information provided.");
                    if (!i) throw new Error("No translation key found.");
                    if (typeof o != "number") {
                        o = parseInt(o, 10);
                        if (isNaN(o)) throw new Error("The number that was passed in is not a number.")
                    }
                    var a = t ? t + n.context_delimiter + i : i,
                        f = this.options.locale_data,
                        l = f[e],
                        c = l[""].plural_forms,
                        h = r(c)(o) + 1,
                        p, d;
                    if (!l) throw new Error("No domain named `" + e + "` could be found.");
                    return p = l[a], !p || h >= p.length ? (this.options.missing_key_callback && this.options.missing_key_callback(a), d = [null, i, s], d[r()(o) + 1]) : (d = p[h], d ? d : (d = [null, i, s], d[r()(o) + 1]))
                }
            }), e.Jed = n
        }(this), + function(e) {
            "use strict";

            function n(n, r) {
                return this.each(function() {
                    var i = e(this),
                        s = i.data("bs.modal"),
                        o = e.extend({}, t.DEFAULTS, i.data(), typeof n == "object" && n);
                    s || i.data("bs.modal", s = new t(this, o)), typeof n == "string" ? s[n](r) : o.show && s.show(r)
                })
            }
            var t = function(t, n) {
                this.options = n, this.$body = e(document.body), this.$element = e(t), this.$backdrop = this.isShown = null, this.scrollbarWidth = 0, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, e.proxy(function() {
                    this.$element.trigger("loaded.bs.modal")
                }, this))
            };
            t.VERSION = "3.2.0", t.DEFAULTS = {
                backdrop: !0,
                keyboard: !0,
                show: !0
            }, t.prototype.toggle = function(e) {
                return this.isShown ? this.hide() : this.show(e)
            }, t.prototype.show = function(t) {
                var n = this,
                    r = e.Event("show.bs.modal", {
                        relatedTarget: t
                    });
                this.$element.trigger(r);
                if (this.isShown || r.isDefaultPrevented()) return;
                this.isShown = !0, this.checkScrollbar(), this.$body.addClass("modal-open"), this.setScrollbar(), this.escape(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', e.proxy(this.hide, this)), this.backdrop(function() {
                    var r = e.support.transition && n.$element.hasClass("fade");
                    n.$element.parent().length || n.$element.appendTo(n.$body), n.$element.show().scrollTop(0), r && n.$element[0].offsetWidth, n.$element.addClass("in").attr("aria-hidden", !1), n.enforceFocus();
                    var i = e.Event("shown.bs.modal", {
                        relatedTarget: t
                    });
                    r ? n.$element.find(".modal-dialog").one("bsTransitionEnd", function() {
                        n.$element.trigger("focus").trigger(i)
                    }).emulateTransitionEnd(300) : n.$element.trigger("focus").trigger(i)
                })
            }, t.prototype.hide = function(t) {
                t && t.preventDefault();
                var n = t ? t.target : null;
                t = e.Event("hide.bs.modal"), this.$element.trigger(t, [n]);
                if (!this.isShown || t.isDefaultPrevented()) return;
                this.isShown = !1, this.$body.removeClass("modal-open"), this.resetScrollbar(), this.escape(), e(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), e.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", e.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal()
            }, t.prototype.enforceFocus = function() {
                e(document).off("focusin.bs.modal").on("focusin.bs.modal", e.proxy(function(e) {
                    this.$element[0] !== e.target && !this.$element.has(e.target).length && this.$element.trigger("focus")
                }, this))
            }, t.prototype.escape = function() {
                this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.bs.modal", e.proxy(function(e) {
                    e.which == 27 && this.hide()
                }, this)) : this.isShown || this.$element.off("keyup.dismiss.bs.modal")
            }, t.prototype.hideModal = function() {
                var e = this;
                this.$element.hide(), this.backdrop(function() {
                    e.$element.trigger("hidden.bs.modal")
                })
            }, t.prototype.removeBackdrop = function() {
                this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
            }, t.prototype.backdrop = function(t) {
                var n = this,
                    r = this.$element.hasClass("fade") ? "fade" : "";
                if (this.isShown && this.options.backdrop) {
                    var i = e.support.transition && r;
                    this.$backdrop = e('<div class="modal-backdrop ' + r + '" />').appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", e.proxy(function(e) {
                        if (e.target !== e.currentTarget) return;
                        this.options.backdrop == "static" ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this)
                    }, this)), i && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in");
                    if (!t) return;
                    i ? this.$backdrop.one("bsTransitionEnd", t).emulateTransitionEnd(150) : t()
                } else if (!this.isShown && this.$backdrop) {
                    this.$backdrop.removeClass("in");
                    var s = function() {
                        n.removeBackdrop(), t && t()
                    };
                    e.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", s).emulateTransitionEnd(150) : s()
                } else t && t()
            }, t.prototype.checkScrollbar = function() {
                if (document.body.clientWidth >= window.innerWidth) return;
                this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
            }, t.prototype.setScrollbar = function() {
                var e = parseInt(this.$body.css("padding-right") || 0, 10);
                this.scrollbarWidth && this.$body.css("padding-right", e + this.scrollbarWidth)
            }, t.prototype.resetScrollbar = function() {
                this.$body.css("padding-right", "")
            }, t.prototype.measureScrollbar = function() {
                var e = document.createElement("div");
                e.className = "modal-scrollbar-measure", this.$body.append(e);
                var t = e.offsetWidth - e.clientWidth;
                return this.$body[0].removeChild(e), t
            };
            var r = e.fn.modal;
            e.fn.modal = n, e.fn.modal.Constructor = t, e.fn.modal.noConflict = function() {
                return e.fn.modal = r, this
            }, e(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(t) {
                var r = e(this),
                    i = r.attr("href"),
                    s = e(r.attr("data-target") || i && i.replace(/.*(?=#[^\s]+$)/, "")),
                    o = s.data("bs.modal") ? "toggle" : e.extend({
                        remote: !/#/.test(i) && i
                    }, s.data(), r.data());
                r.is("a") && t.preventDefault(), s.one("show.bs.modal", function(e) {
                    if (e.isDefaultPrevented()) return;
                    s.one("hidden.bs.modal", function() {
                        r.is(":visible") && r.trigger("focus")
                    })
                }), n.call(s, o, this)
            })
        }(jQuery), + function(e) {
            "use strict";

            function t() {
                var e = document.createElement("bootstrap"),
                    t = {
                        WebkitTransition: "webkitTransitionEnd",
                        MozTransition: "transitionend",
                        OTransition: "oTransitionEnd otransitionend",
                        transition: "transitionend"
                    };
                for (var n in t)
                    if (e.style[n] !== undefined) return {
                        end: t[n]
                    };
                return !1
            }
            e.fn.emulateTransitionEnd = function(t) {
                var n = !1,
                    r = this;
                e(this).one("bsTransitionEnd", function() {
                    n = !0
                });
                var i = function() {
                    n || e(r).trigger(e.support.transition.end)
                };
                return setTimeout(i, t), this
            }, e(function() {
                e.support.transition = t();
                if (!e.support.transition) return;
                e.event.special.bsTransitionEnd = {
                    bindType: e.support.transition.end,
                    delegateType: e.support.transition.end,
                    handle: function(t) {
                        if (e(t.target).is(this)) return t.handleObj.handler.apply(this, arguments)
                    }
                }
            })
        }(jQuery), + function(e) {
            "use strict";

            function n(n) {
                return this.each(function() {
                    var r = e(this),
                        i = r.data("bs.tooltip"),
                        s = typeof n == "object" && n;
                    if (!i && n == "destroy") return;
                    i || r.data("bs.tooltip", i = new t(this, s)), typeof n == "string" && i[n]()
                })
            }
            var t = function(e, t) {
                this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null, this.init("tooltip", e, t)
            };
            t.VERSION = "3.2.0", t.TRANSITION_DURATION = 150, t.DEFAULTS = {
                animation: !0,
                placement: "top",
                selector: !1,
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: "hover focus",
                title: "",
                delay: 0,
                html: !1,
                container: !1,
                viewport: {
                    selector: "body",
                    padding: 0
                }
            }, t.prototype.init = function(t, n, r) {
                this.enabled = !0, this.type = t, this.$element = e(n), this.options = this.getOptions(r), this.$viewport = this.options.viewport && e(this.options.viewport.selector || this.options.viewport);
                var i = this.options.trigger.split(" ");
                for (var s = i.length; s--;) {
                    var o = i[s];
                    if (o == "click") this.$element.on("click." + this.type, this.options.selector, e.proxy(this.toggle, this));
                    else if (o != "manual") {
                        var u = o == "hover" ? "mouseenter" : "focusin",
                            a = o == "hover" ? "mouseleave" : "focusout";
                        this.$element.on(u + "." + this.type, this.options.selector, e.proxy(this.enter, this)), this.$element.on(a + "." + this.type, this.options.selector, e.proxy(this.leave, this))
                    }
                }
                this.options.selector ? this._options = e.extend({}, this.options, {
                    trigger: "manual",
                    selector: ""
                }) : this.fixTitle()
            }, t.prototype.getDefaults = function() {
                return t.DEFAULTS
            }, t.prototype.getOptions = function(t) {
                return t = e.extend({}, this.getDefaults(), this.$element.data(), t), t.delay && typeof t.delay == "number" && (t.delay = {
                    show: t.delay,
                    hide: t.delay
                }), t
            }, t.prototype.getDelegateOptions = function() {
                var t = {},
                    n = this.getDefaults();
                return this._options && e.each(this._options, function(e, r) {
                    n[e] != r && (t[e] = r)
                }), t
            }, t.prototype.enter = function(t) {
                var n = t instanceof this.constructor ? t : e(t.currentTarget).data("bs." + this.type);
                if (n && n.$tip && n.$tip.is(":visible")) {
                    n.hoverState = "in";
                    return
                }
                n || (n = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget).data("bs." + this.type, n)), clearTimeout(n.timeout), n.hoverState = "in";
                if (!n.options.delay || !n.options.delay.show) return n.show();
                n.timeout = setTimeout(function() {
                    n.hoverState == "in" && n.show()
                }, n.options.delay.show)
            }, t.prototype.leave = function(t) {
                var n = t instanceof this.constructor ? t : e(t.currentTarget).data("bs." + this.type);
                n || (n = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget).data("bs." + this.type, n)), clearTimeout(n.timeout), n.hoverState = "out";
                if (!n.options.delay || !n.options.delay.hide) return n.hide();
                n.timeout = setTimeout(function() {
                    n.hoverState == "out" && n.hide()
                }, n.options.delay.hide)
            }, t.prototype.show = function() {
                var n = e.Event("show.bs." + this.type);
                if (this.hasContent() && this.enabled) {
                    this.$element.trigger(n);
                    var r = e.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
                    if (n.isDefaultPrevented() || !r) return;
                    var i = this,
                        s = this.tip(),
                        o = this.getUID(this.type);
                    this.setContent(), s.attr("id", o), this.$element.attr("aria-describedby", o), this.options.animation && s.addClass("fade");
                    var u = typeof this.options.placement == "function" ? this.options.placement.call(this, s[0], this.$element[0]) : this.options.placement,
                        a = /\s?auto?\s?/i,
                        f = a.test(u);
                    f && (u = u.replace(a, "") || "top"), s.detach().css({
                        top: 0,
                        left: 0,
                        display: "block"
                    }).addClass(u).data("bs." + this.type, this), this.options.container ? s.appendTo(this.options.container) : s.insertAfter(this.$element);
                    var l = this.getPosition(),
                        c = s[0].offsetWidth,
                        h = s[0].offsetHeight;
                    if (f) {
                        var p = u,
                            d = this.options.container ? e(this.options.container) : this.$element.parent(),
                            v = this.getPosition(d);
                        u = u == "bottom" && l.top + l.height + h - v.scroll > v.height ? "top" : u == "top" && l.top - v.scroll - h < v.top ? "bottom" : u == "right" && l.right + c > v.width ? "left" : u == "left" && l.left - c < v.left ? "right" : u, s.removeClass(p).addClass(u)
                    }
                    var m = this.getCalculatedOffset(u, l, c, h);
                    this.applyPlacement(m, u);
                    var g = function() {
                        i.$element.trigger("shown.bs." + i.type), i.hoverState = null
                    };
                    e.support.transition && this.$tip.hasClass("fade") ? s.one("bsTransitionEnd", g).emulateTransitionEnd(t.TRANSITION_DURATION) : g()
                }
            }, t.prototype.applyPlacement = function(t, n) {
                var r = this.tip(),
                    i = r[0].offsetWidth,
                    s = r[0].offsetHeight,
                    o = parseInt(r.css("margin-top"), 10),
                    u = parseInt(r.css("margin-left"), 10);
                isNaN(o) && (o = 0), isNaN(u) && (u = 0), t.top = t.top + o, t.left = t.left + u, e.offset.setOffset(r[0], e.extend({
                    using: function(e) {
                        r.css({
                            top: Math.round(e.top),
                            left: Math.round(e.left)
                        })
                    }
                }, t), 0), r.addClass("in");
                var a = r[0].offsetWidth,
                    f = r[0].offsetHeight;
                n == "top" && f != s && (t.top = t.top + s - f);
                var l = this.getViewportAdjustedDelta(n, t, a, f);
                l.left ? t.left += l.left : t.top += l.top;
                var c = /top|bottom/.test(n),
                    h = c ? l.left * 2 - i + a : l.top * 2 - s + f,
                    p = c ? "offsetWidth" : "offsetHeight";
                r.offset(t), this.replaceArrow(h, r[0][p], c)
            }, t.prototype.replaceArrow = function(e, t, n) {
                this.arrow().css(n ? "left" : "top", 50 * (1 - e / t) + "%").css(n ? "top" : "left", "")
            }, t.prototype.setContent = function() {
                var e = this.tip(),
                    t = this.getTitle();
                e.find(".tooltip-inner")[this.options.html ? "html" : "text"](t), e.removeClass("fade in top bottom left right")
            }, t.prototype.hide = function(n) {
                function o() {
                    r.hoverState != "in" && i.detach(), r.$element.removeAttr("aria-describedby").trigger("hidden.bs." + r.type), n && n()
                }
                var r = this,
                    i = this.tip(),
                    s = e.Event("hide.bs." + this.type);
                this.$element.trigger(s);
                if (s.isDefaultPrevented()) return;
                return i.removeClass("in"), e.support.transition && this.$tip.hasClass("fade") ? i.one("bsTransitionEnd", o).emulateTransitionEnd(t.TRANSITION_DURATION) : o(), this.hoverState = null, this
            }, t.prototype.fixTitle = function() {
                var e = this.$element;
                (e.attr("title") || typeof e.attr("data-original-title") != "string") && e.attr("data-original-title", e.attr("title") || "").attr("title", "")
            }, t.prototype.hasContent = function() {
                return this.getTitle()
            }, t.prototype.getPosition = function(t) {
                t = t || this.$element;
                var n = t[0],
                    r = n.tagName == "BODY",
                    i = n.getBoundingClientRect();
                i.width == null && (i = e.extend({}, i, {
                    width: i.right - i.left,
                    height: i.bottom - i.top
                }));
                var s = r ? {
                        top: 0,
                        left: 0
                    } : t.offset(),
                    o = {
                        scroll: r ? document.documentElement.scrollTop || document.body.scrollTop : t.scrollTop()
                    },
                    u = r ? {
                        width: e(window).width(),
                        height: e(window).height()
                    } : null;
                return e.extend({}, i, o, u, s)
            }, t.prototype.getCalculatedOffset = function(e, t, n, r) {
                return e == "bottom" ? {
                    top: t.top + t.height,
                    left: t.left + t.width / 2 - n / 2
                } : e == "top" ? {
                    top: t.top - r,
                    left: t.left + t.width / 2 - n / 2
                } : e == "left" ? {
                    top: t.top + t.height / 2 - r / 2,
                    left: t.left - n
                } : {
                    top: t.top + t.height / 2 - r / 2,
                    left: t.left + t.width
                }
            }, t.prototype.getViewportAdjustedDelta = function(e, t, n, r) {
                var i = {
                    top: 0,
                    left: 0
                };
                if (!this.$viewport) return i;
                var s = this.options.viewport && this.options.viewport.padding || 0,
                    o = this.getPosition(this.$viewport);
                if (/right|left/.test(e)) {
                    var u = t.top - s - o.scroll,
                        a = t.top + s - o.scroll + r;
                    u < o.top ? i.top = o.top - u : a > o.top + o.height && (i.top = o.top + o.height - a)
                } else {
                    var f = t.left - s,
                        l = t.left + s + n;
                    f < o.left ? i.left = o.left - f : l > o.width && (i.left = o.left + o.width - l)
                }
                return i
            }, t.prototype.getTitle = function() {
                var e, t = this.$element,
                    n = this.options;
                return e = t.attr("data-original-title") || (typeof n.title == "function" ? n.title.call(t[0]) : n.title), e
            }, t.prototype.getUID = function(e) {
                do e += ~~(Math.random() * 1e6); while (document.getElementById(e));
                return e
            }, t.prototype.tip = function() {
                return this.$tip = this.$tip || e(this.options.template)
            }, t.prototype.arrow = function() {
                return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
            }, t.prototype.enable = function() {
                this.enabled = !0
            }, t.prototype.disable = function() {
                this.enabled = !1
            }, t.prototype.toggleEnabled = function() {
                this.enabled = !this.enabled
            }, t.prototype.toggle = function(t) {
                var n = this;
                t && (n = e(t.currentTarget).data("bs." + this.type), n || (n = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget).data("bs." + this.type, n))), n.tip().hasClass("in") ? n.leave(n) : n.enter(n)
            }, t.prototype.destroy = function() {
                var e = this;
                clearTimeout(this.timeout), this.hide(function() {
                    e.$element.off("." + e.type).removeData("bs." + e.type)
                })
            };
            var r = e.fn.tooltip;
            e.fn.tooltip = n, e.fn.tooltip.Constructor = t, e.fn.tooltip.noConflict = function() {
                return e.fn.tooltip = r, this
            }
        }(jQuery), ! function(e) {
            "use strict";

            function n() {
                return e.performance && typeof e.performance.now == "function" ? e.performance.now() : typeof Date.now == "function" ? Date.now() : (new Date).getTime()
            }

            function r() {
                var e = n(),
                    t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
                        var n = (e + Math.random() * 16) % 16 | 0;
                        return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16)
                    });
                return t
            }

            function i(e, t, n, r, i, s, o, u) {
                u = u || {};
                if (!e) throw "Missing key; pass in event client key as the first argument.";
                this.clientKey = e;
                if (!t) throw "Missing secret; pass in event client secret as the second argument.";
                this.clientSecret = t;
                if (!n) throw "Missing post function; pass in ajax post function as the third argument.";
                this.postData = n;
                if (!r) throw "Missing url to post to; pass in url as the fourth argument.";
                this.eventsUrl = r;
                if (!i) throw "Missing appName; pass in appName as the fifth argument.";
                this.appName = i;
                if (!o) throw "Missing calculateHash; pass in calculateHash as the sixth argument.";
                this.calculateHash = o, typeof window != "undefined" && (this.appendClientContext = typeof u.appendClientContext == "undefined" ? !0 : u.appendClientContext), this.signatureHeader = s, this.bufferTimeout = u.bufferTimeout || 100, this.bufferLength = u.bufferLength || 40, this.buffer = []
            }
            var t = /[^A-Za-z0-9]/;
            i.prototype.track = function(t, n, r) {
                var i = this._buildData(t, n, r || {});
                this._buffer(i)
            }, i.prototype.send = function(t) {
                if (this.buffer.length) {
                    var n = JSON.stringify(this.buffer),
                        r = this.calculateHash(this.clientSecret, n),
                        i = this.signatureHeader,
                        s = "key=" + this.clientKey + ", mac=" + r,
                        o = {
                            "Content-Type": "text/plain"
                        };
                    o[i] = s, this.postData({
                        url: this.eventsUrl,
                        data: n,
                        headers: o,
                        query: {},
                        done: t || function() {}
                    }), this.buffer = []
                }
            }, i.prototype._validateClientName = function(n) {
                if (t.test(n)) throw "Invalid client name, please use only letters or numbers", n
            }, i.prototype._buildData = function(t, n, i) {
                var s = new Date,
                    o = {
                        event_topic: t,
                        event_type: n,
                        event_ts: s.getTime(),
                        uuid: i.uuid || r(),
                        payload: i
                    };
                o.payload.app_name = this.appName, o.payload.utc_offset = s.getTimezoneOffset() / -60;
                if (this.appendClientContext) {
                    var u = this._buildClientContext();
                    for (var a in u) o.payload[a] = u[a]
                }
                return o
            }, i.prototype._buffer = function(t) {
                this.buffer.push(t), this.buffer.length >= this.bufferLength || !this.bufferTimeout ? this.send() : this.bufferTimeout && !this.timer && this._resetTimer()
            }, i.prototype._resetTimer = function() {
                this.timer && (clearTimeout(this.timer), this.timer = undefined);
                var t = this;
                this.timer = setTimeout(function() {
                    t.send(), t.timer = undefined
                }, this.bufferTimeout)
            }, i.prototype._buildClientContext = function() {
                return {
                    user_agent: navigator.userAgent,
                    domain: document.location.host,
                    base_url: document.location.pathname + document.location.search + document.location.hash
                }
            }, typeof module != "undefined" ? module.exports = i : e.EventTracker = i
        }(typeof global != "undefined" ? global : this);
    var CryptoJS = CryptoJS || function(e, t) {
        var n = {},
            r = n.lib = {},
            i = function() {},
            s = r.Base = {
                extend: function(e) {
                    i.prototype = this;
                    var t = new i;
                    return e && t.mixIn(e), t.hasOwnProperty("init") || (t.init = function() {
                        t.$super.init.apply(this, arguments)
                    }), t.init.prototype = t, t.$super = this, t
                },
                create: function() {
                    var e = this.extend();
                    return e.init.apply(e, arguments), e
                },
                init: function() {},
                mixIn: function(e) {
                    for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
                    e.hasOwnProperty("toString") && (this.toString = e.toString)
                },
                clone: function() {
                    return this.init.prototype.extend(this)
                }
            },
            o = r.WordArray = s.extend({
                init: function(e, n) {
                    e = this.words = e || [], this.sigBytes = n != t ? n : 4 * e.length
                },
                toString: function(e) {
                    return (e || a).stringify(this)
                },
                concat: function(e) {
                    var t = this.words,
                        n = e.words,
                        r = this.sigBytes;
                    e = e.sigBytes, this.clamp();
                    if (r % 4)
                        for (var i = 0; i < e; i++) t[r + i >>> 2] |= (n[i >>> 2] >>> 24 - 8 * (i % 4) & 255) << 24 - 8 * ((r + i) % 4);
                    else if (65535 < n.length)
                        for (i = 0; i < e; i += 4) t[r + i >>> 2] = n[i >>> 2];
                    else t.push.apply(t, n);
                    return this.sigBytes += e, this
                },
                clamp: function() {
                    var t = this.words,
                        n = this.sigBytes;
                    t[n >>> 2] &= 4294967295 << 32 - 8 * (n % 4), t.length = e.ceil(n / 4)
                },
                clone: function() {
                    var e = s.clone.call(this);
                    return e.words = this.words.slice(0), e
                },
                random: function(t) {
                    for (var n = [], r = 0; r < t; r += 4) n.push(4294967296 * e.random() | 0);
                    return new o.init(n, t)
                }
            }),
            u = n.enc = {},
            a = u.Hex = {
                stringify: function(e) {
                    var t = e.words;
                    e = e.sigBytes;
                    for (var n = [], r = 0; r < e; r++) {
                        var i = t[r >>> 2] >>> 24 - 8 * (r % 4) & 255;
                        n.push((i >>> 4).toString(16)), n.push((i & 15).toString(16))
                    }
                    return n.join("")
                },
                parse: function(e) {
                    for (var t = e.length, n = [], r = 0; r < t; r += 2) n[r >>> 3] |= parseInt(e.substr(r, 2), 16) << 24 - 4 * (r % 8);
                    return new o.init(n, t / 2)
                }
            },
            f = u.Latin1 = {
                stringify: function(e) {
                    var t = e.words;
                    e = e.sigBytes;
                    for (var n = [], r = 0; r < e; r++) n.push(String.fromCharCode(t[r >>> 2] >>> 24 - 8 * (r % 4) & 255));
                    return n.join("")
                },
                parse: function(e) {
                    for (var t = e.length, n = [], r = 0; r < t; r++) n[r >>> 2] |= (e.charCodeAt(r) & 255) << 24 - 8 * (r % 4);
                    return new o.init(n, t)
                }
            },
            l = u.Utf8 = {
                stringify: function(e) {
                    try {
                        return decodeURIComponent(escape(f.stringify(e)))
                    } catch (t) {
                        throw Error("Malformed UTF-8 data")
                    }
                },
                parse: function(e) {
                    return f.parse(unescape(encodeURIComponent(e)))
                }
            },
            c = r.BufferedBlockAlgorithm = s.extend({
                reset: function() {
                    this._data = new o.init, this._nDataBytes = 0
                },
                _append: function(e) {
                    "string" == typeof e && (e = l.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes
                },
                _process: function(t) {
                    var n = this._data,
                        r = n.words,
                        i = n.sigBytes,
                        s = this.blockSize,
                        u = i / (4 * s),
                        u = t ? e.ceil(u) : e.max((u | 0) - this._minBufferSize, 0);
                    t = u * s, i = e.min(4 * t, i);
                    if (t) {
                        for (var a = 0; a < t; a += s) this._doProcessBlock(r, a);
                        a = r.splice(0, t), n.sigBytes -= i
                    }
                    return new o.init(a, i)
                },
                clone: function() {
                    var e = s.clone.call(this);
                    return e._data = this._data.clone(), e
                },
                _minBufferSize: 0
            });
        r.Hasher = c.extend({
            cfg: s.extend(),
            init: function(e) {
                this.cfg = this.cfg.extend(e), this.reset()
            },
            reset: function() {
                c.reset.call(this), this._doReset()
            },
            update: function(e) {
                return this._append(e), this._process(), this
            },
            finalize: function(e) {
                return e && this._append(e), this._doFinalize()
            },
            blockSize: 16,
            _createHelper: function(e) {
                return function(t, n) {
                    return (new e.init(n)).finalize(t)
                }
            },
            _createHmacHelper: function(e) {
                return function(t, n) {
                    return (new h.HMAC.init(e, n)).finalize(t)
                }
            }
        });
        var h = n.algo = {};
        return n
    }(Math);
    (function(e) {
        for (var t = CryptoJS, n = t.lib, r = n.WordArray, i = n.Hasher, n = t.algo, s = [], o = [], u = function(e) {
                return 4294967296 * (e - (e | 0)) | 0
            }, a = 2, f = 0; 64 > f;) {
            var l;
            e: {
                l = a;
                for (var c = e.sqrt(l), h = 2; h <= c; h++)
                    if (!(l % h)) {
                        l = !1;
                        break e
                    } l = !0
            }
            l && (8 > f && (s[f] = u(e.pow(a, .5))), o[f] = u(e.pow(a, 1 / 3)), f++), a++
        }
        var p = [],
            n = n.SHA256 = i.extend({
                _doReset: function() {
                    this._hash = new r.init(s.slice(0))
                },
                _doProcessBlock: function(e, t) {
                    for (var n = this._hash.words, r = n[0], i = n[1], s = n[2], u = n[3], a = n[4], f = n[5], l = n[6], c = n[7], h = 0; 64 > h; h++) {
                        if (16 > h) p[h] = e[t + h] | 0;
                        else {
                            var d = p[h - 15],
                                v = p[h - 2];
                            p[h] = ((d << 25 | d >>> 7) ^ (d << 14 | d >>> 18) ^ d >>> 3) + p[h - 7] + ((v << 15 | v >>> 17) ^ (v << 13 | v >>> 19) ^ v >>> 10) + p[h - 16]
                        }
                        d = c + ((a << 26 | a >>> 6) ^ (a << 21 | a >>> 11) ^ (a << 7 | a >>> 25)) + (a & f ^ ~a & l) + o[h] + p[h], v = ((r << 30 | r >>> 2) ^ (r << 19 | r >>> 13) ^ (r << 10 | r >>> 22)) + (r & i ^ r & s ^ i & s), c = l, l = f, f = a, a = u + d | 0, u = s, s = i, i = r, r = d + v | 0
                    }
                    n[0] = n[0] + r | 0, n[1] = n[1] + i | 0, n[2] = n[2] + s | 0, n[3] = n[3] + u | 0, n[4] = n[4] + a | 0, n[5] = n[5] + f | 0, n[6] = n[6] + l | 0, n[7] = n[7] + c | 0
                },
                _doFinalize: function() {
                    var t = this._data,
                        n = t.words,
                        r = 8 * this._nDataBytes,
                        i = 8 * t.sigBytes;
                    return n[i >>> 5] |= 128 << 24 - i % 32, n[(i + 64 >>> 9 << 4) + 14] = e.floor(r / 4294967296), n[(i + 64 >>> 9 << 4) + 15] = r, t.sigBytes = 4 * n.length, this._process(), this._hash
                },
                clone: function() {
                    var e = i.clone.call(this);
                    return e._hash = this._hash.clone(), e
                }
            });
        t.SHA256 = i._createHelper(n), t.HmacSHA256 = i._createHmacHelper(n)
    })(Math),
    function() {
        var e = CryptoJS,
            t = e.enc.Utf8;
        e.algo.HMAC = e.lib.Base.extend({
            init: function(e, n) {
                e = this._hasher = new e.init, "string" == typeof n && (n = t.parse(n));
                var r = e.blockSize,
                    i = 4 * r;
                n.sigBytes > i && (n = e.finalize(n)), n.clamp();
                for (var o = this._oKey = n.clone(), u = this._iKey = n.clone(), a = o.words, f = u.words, l = 0; l < r; l++) a[l] ^= 1549556828, f[l] ^= 909522486;
                o.sigBytes = u.sigBytes = i, this.reset()
            },
            reset: function() {
                var e = this._hasher;
                e.reset(), e.update(this._iKey)
            },
            update: function(e) {
                return this._hasher.update(e), this
            },
            finalize: function(e) {
                var t = this._hasher;
                return e = t.finalize(e), t.reset(), t.finalize(this._oKey.clone().concat(e))
            }
        })
    }(), ! function() {
        var e = [];
        try {
            e = Object.keys(localStorage)
        } catch (t) {
            return
        }
        var n = e.filter(function(e) {
            var t = localStorage[e].length * 2 / 1024;
            if (t >= 750) return !0
        });
        try {
            for (var r = 0, i = n.length; r < i; r++) localStorage.removeItem(n[r])
        } catch (t) {
            return
        }
    }(),
    function(e, t) {
        "use strict";

        function r(e) {
            this.time = e.time, this.target = e.target, this.rootBounds = e.rootBounds, this.boundingClientRect = e.boundingClientRect, this.intersectionRect = e.intersectionRect || c(), this.isIntersecting = !!e.intersectionRect;
            var t = this.boundingClientRect,
                n = t.width * t.height,
                r = this.intersectionRect,
                i = r.width * r.height;
            n ? this.intersectionRatio = i / n : this.intersectionRatio = this.isIntersecting ? 1 : 0
        }

        function i(e, t) {
            var n = t || {};
            if (typeof e != "function") throw new Error("callback must be a function");
            if (n.root && n.root.nodeType != 1) throw new Error("root must be an Element");
            this._checkForIntersections = o(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT), this._callback = e, this._observationTargets = [], this._queuedEntries = [], this._rootMarginValues = this._parseRootMargin(n.rootMargin), this.thresholds = this._initThresholds(n.threshold), this.root = n.root || null, this.rootMargin = this._rootMarginValues.map(function(e) {
                return e.value + e.unit
            }).join(" ")
        }

        function s() {
            return e.performance && performance.now && performance.now()
        }

        function o(e, t) {
            var n = null;
            return function() {
                n || (n = setTimeout(function() {
                    e(), n = null
                }, t))
            }
        }

        function u(e, t, n, r) {
            typeof e.addEventListener == "function" ? e.addEventListener(t, n, r || !1) : typeof e.attachEvent == "function" && e.attachEvent("on" + t, n)
        }

        function a(e, t, n, r) {
            typeof e.removeEventListener == "function" ? e.removeEventListener(t, n, r || !1) : typeof e.detatchEvent == "function" && e.detatchEvent("on" + t, n)
        }

        function f(e, t) {
            var n = Math.max(e.top, t.top),
                r = Math.min(e.bottom, t.bottom),
                i = Math.max(e.left, t.left),
                s = Math.min(e.right, t.right),
                o = s - i,
                u = r - n;
            return o >= 0 && u >= 0 && {
                top: n,
                bottom: r,
                left: i,
                right: s,
                width: o,
                height: u
            }
        }

        function l(e) {
            var t;
            try {
                t = e.getBoundingClientRect()
            } catch (n) {}
            if (!t) return c();
            if (!t.width || !t.height) t = {
                top: t.top,
                right: t.right,
                bottom: t.bottom,
                left: t.left,
                width: t.right - t.left,
                height: t.bottom - t.top
            };
            return t
        }

        function c() {
            return {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: 0,
                height: 0
            }
        }

        function h(e, t) {
            var n = t;
            while (n) {
                if (n == e) return !0;
                n = p(n)
            }
            return !1
        }

        function p(e) {
            var t = e.parentNode;
            return t && t.nodeType == 11 && t.host ? t.host : t
        }
        if ("IntersectionObserver" in e && "IntersectionObserverEntry" in e && "intersectionRatio" in e.IntersectionObserverEntry.prototype) {
            "isIntersecting" in e.IntersectionObserverEntry.prototype || Object.defineProperty(e.IntersectionObserverEntry.prototype, "isIntersecting", {
                get: function() {
                    return this.intersectionRatio > 0
                }
            });
            return
        }
        var n = [];
        i.prototype.THROTTLE_TIMEOUT = 100, i.prototype.POLL_INTERVAL = null, i.prototype.USE_MUTATION_OBSERVER = !0, i.prototype.observe = function(e) {
            var t = this._observationTargets.some(function(t) {
                return t.element == e
            });
            if (t) return;
            if (!e || e.nodeType != 1) throw new Error("target must be an Element");
            this._registerInstance(), this._observationTargets.push({
                element: e,
                entry: null
            }), this._monitorIntersections(), this._checkForIntersections()
        }, i.prototype.unobserve = function(e) {
            this._observationTargets = this._observationTargets.filter(function(t) {
                return t.element != e
            }), this._observationTargets.length || (this._unmonitorIntersections(), this._unregisterInstance())
        }, i.prototype.disconnect = function() {
            this._observationTargets = [], this._unmonitorIntersections(), this._unregisterInstance()
        }, i.prototype.takeRecords = function() {
            var e = this._queuedEntries.slice();
            return this._queuedEntries = [], e
        }, i.prototype._initThresholds = function(e) {
            var t = e || [0];
            return Array.isArray(t) || (t = [t]), t.sort().filter(function(e, t, n) {
                if (typeof e != "number" || isNaN(e) || e < 0 || e > 1) throw new Error("threshold must be a number between 0 and 1 inclusively");
                return e !== n[t - 1]
            })
        }, i.prototype._parseRootMargin = function(e) {
            var t = e || "0px",
                n = t.split(/\s+/).map(function(e) {
                    var t = /^(-?\d*\.?\d+)(px|%)$/.exec(e);
                    if (!t) throw new Error("rootMargin must be specified in pixels or percent");
                    return {
                        value: parseFloat(t[1]),
                        unit: t[2]
                    }
                });
            return n[1] = n[1] || n[0], n[2] = n[2] || n[0], n[3] = n[3] || n[1], n
        }, i.prototype._monitorIntersections = function() {
            this._monitoringIntersections || (this._monitoringIntersections = !0, this.POLL_INTERVAL ? this._monitoringInterval = setInterval(this._checkForIntersections, this.POLL_INTERVAL) : (u(e, "resize", this._checkForIntersections, !0), u(t, "scroll", this._checkForIntersections, !0), this.USE_MUTATION_OBSERVER && "MutationObserver" in e && (this._domObserver = new MutationObserver(this._checkForIntersections), this._domObserver.observe(t, {
                attributes: !0,
                childList: !0,
                characterData: !0,
                subtree: !0
            }))))
        }, i.prototype._unmonitorIntersections = function() {
            this._monitoringIntersections && (this._monitoringIntersections = !1, clearInterval(this._monitoringInterval), this._monitoringInterval = null, a(e, "resize", this._checkForIntersections, !0), a(t, "scroll", this._checkForIntersections, !0), this._domObserver && (this._domObserver.disconnect(), this._domObserver = null))
        }, i.prototype._checkForIntersections = function() {
            var e = this._rootIsInDom(),
                t = e ? this._getRootRect() : c();
            this._observationTargets.forEach(function(n) {
                var i = n.element,
                    o = l(i),
                    u = this._rootContainsTarget(i),
                    a = n.entry,
                    f = e && u && this._computeTargetAndRootIntersection(i, t),
                    c = n.entry = new r({
                        time: s(),
                        target: i,
                        boundingClientRect: o,
                        rootBounds: t,
                        intersectionRect: f
                    });
                a ? e && u ? this._hasCrossedThreshold(a, c) && this._queuedEntries.push(c) : a && a.isIntersecting && this._queuedEntries.push(c) : this._queuedEntries.push(c)
            }, this), this._queuedEntries.length && this._callback(this.takeRecords(), this)
        }, i.prototype._computeTargetAndRootIntersection = function(n, r) {
            if (e.getComputedStyle(n).display == "none") return;
            var i = l(n),
                s = i,
                o = p(n),
                u = !1;
            while (!u) {
                var a = null,
                    c = o.nodeType == 1 ? e.getComputedStyle(o) : {};
                if (c.display == "none") return;
                o == this.root || o == t ? (u = !0, a = r) : o != t.body && o != t.documentElement && c.overflow != "visible" && (a = l(o));
                if (a) {
                    s = f(a, s);
                    if (!s) break
                }
                o = p(o)
            }
            return s
        }, i.prototype._getRootRect = function() {
            var e;
            if (this.root) e = l(this.root);
            else {
                var n = t.documentElement,
                    r = t.body;
                e = {
                    top: 0,
                    left: 0,
                    right: n.clientWidth || r.clientWidth,
                    width: n.clientWidth || r.clientWidth,
                    bottom: n.clientHeight || r.clientHeight,
                    height: n.clientHeight || r.clientHeight
                }
            }
            return this._expandRectByRootMargin(e)
        }, i.prototype._expandRectByRootMargin = function(e) {
            var t = this._rootMarginValues.map(function(t, n) {
                    return t.unit == "px" ? t.value : t.value * (n % 2 ? e.width : e.height) / 100
                }),
                n = {
                    top: e.top - t[0],
                    right: e.right + t[1],
                    bottom: e.bottom + t[2],
                    left: e.left - t[3]
                };
            return n.width = n.right - n.left, n.height = n.bottom - n.top, n
        }, i.prototype._hasCrossedThreshold = function(e, t) {
            var n = e && e.isIntersecting ? e.intersectionRatio || 0 : -1,
                r = t.isIntersecting ? t.intersectionRatio || 0 : -1;
            if (n === r) return;
            for (var i = 0; i < this.thresholds.length; i++) {
                var s = this.thresholds[i];
                if (s == n || s == r || s < n != s < r) return !0
            }
        }, i.prototype._rootIsInDom = function() {
            return !this.root || h(t, this.root)
        }, i.prototype._rootContainsTarget = function(e) {
            return h(this.root || t, e)
        }, i.prototype._registerInstance = function() {
            n.indexOf(this) < 0 && n.push(this)
        }, i.prototype._unregisterInstance = function() {
            var e = n.indexOf(this);
            e != -1 && n.splice(e, 1)
        }, e.IntersectionObserver = i, e.IntersectionObserverEntry = r
    }(window, document), ! function(e, t) {
        var n = /(?:\b(?:MS)?IE\s+|\bTrident\/7\.0;.*\s+rv:)(\d+(?:\.?\d+)?)/i,
            r = navigator.userAgent.match(n),
            i = r && r[1] && parseFloat(r[1]),
            s = navigator.doNotTrack || e.doNotTrack || navigator.msDoNotTrack;
        e.DO_NOT_TRACK = /^(yes|1)$/i.test(s) && i !== 10
    }(this),
    function(e) {
        var t = e.fn.tooltip.Constructor.prototype,
            n = t.getCalculatedOffset;
        t.getCalculatedOffset = function(e, t, r, i) {
            var s;
            return e !== "top-right" ? n.apply(this, arguments) : (s = {
                top: t.top - i - 10,
                left: t.left + t.width - r
            }, this.$element.outerWidth() <= 18 && (s.left += 4), s)
        }, t.replaceArrow = function(e, t, n) {
            var r = 1 - e / t;
            r !== 1 && this.arrow().css(n ? "left" : "top", 50 * r + "%"), this.arrow().css(n ? "top" : "left", "")
        }
    }(window.jQuery), r = window.r || {}, ! function(e) {
        e.uuid = function() {
            var e = (new Date).getTime();
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
                var n = (e + Math.random() * 16) % 16 | 0;
                return e = Math.floor(e / 16), (t == "x" ? n : n & 3 | 8).toString(16)
            })
        }
    }(r), ! function(e) {
        function n(e) {
            this.name = e, this.called = !1, this._callbacks = []
        }
        var t = {};
        n.prototype.register = function(e) {
            this.called ? e.call(window) : this._callbacks.push(e)
        }, n.prototype.call = function() {
            if (this.called) throw "Hook " + this.name + " already called.";
            var e = this._callbacks;
            this.called = !0, this._callbacks = null;
            for (var t = 0; t < e.length; t++) e[t].call(window)
        }, e.hooks = {
            get: function(e) {
                if (e in t) return t[e];
                var r = new n(e);
                return t[e] = r, r
            },
            call: function(t) {
                return e.hooks.get(t).call()
            }
        }
    }(window.r = window.r || {}), r.setup = function(e) {
        r.config = e, r.config.currentOrigin = location.protocol + "//" + location.host, r.cookies.init(), r.hooks.get("setup").call()
    }, jQuery.cookie = function(e, t, n) {
        if (arguments.length > 1 && String(t) !== "[object Object]") {
            n = jQuery.extend({}, n);
            if (t === null || t === undefined) n.expires = -1;
            if (typeof n.expires == "number") {
                var r = n.expires,
                    i = n.expires = new Date;
                i.setDate(i.getDate() + r)
            }
            return t = String(t), document.cookie = [encodeURIComponent(e), "=", n.raw ? t : encodeURIComponent(t), n.expires ? "; expires=" + n.expires.toUTCString() : "", n.path ? "; path=" + n.path : "", n.domain ? "; domain=" + n.domain : "", n.secure ? "; secure" : ""].join("")
        }
        n = t || {};
        var s, o = n.raw ? function(e) {
            return e
        } : decodeURIComponent;
        return (s = (new RegExp("(?:^|; )" + encodeURIComponent(e) + "=([^;]*)")).exec(document.cookie)) ? o(s[1]) : null
    }, ! function(e, t) {
        function s(t) {
            e.sendError(t, {
                tag: "reddit-cookies-error"
            })
        }

        function o() {
            i.domain = e.config.cur_domain.split(":")[0], i.secure = !0, h(e.config.logged), r = !0
        }

        function u(e, o, u) {
            function a() {
                n(e, o, u)
            }
            r || s("Set cookie %(key)s before cookies init".format({
                key: e
            })), u = t.extend({}, i, u);
            if (typeof Promise == "undefined" || o === null) {
                a();
                return
            }(self.__rCookieDenylist || Promise.resolve([])).then(function(t) {
                t.indexOf(e) < 0 && a()
            }).catch(function() {
                a()
            })
        }

        function a(e, t) {
            u(e, null, t)
        }

        function f(e, o) {
            return r || s("Get cookie %(key)s before cookies init".format({
                key: e
            })), o = t.extend({}, i, o), n(e, o)
        }

        function l(e, n, r) {
            return s("Using deprecated $.cookie to set %(key)s. Use r.cookies instead.".format({
                key: e
            })), arguments.length > 1 && !t.isPlainObject(n) ? u(e, n, r) : f(e, n)
        }

        function h(e) {
            e && (c = e + "_")
        }

        function p(e) {
            if (!e || !e.name) {
                s("Tried to set bad prefixed cookie.");
                return
            }
            var n = t.extend({}, e),
                r = c + e.name,
                i = e.data;
            if (i === null || i == "") i = null;
            else if (typeof i != "string") try {
                i = JSON.stringify(i)
            } catch (o) {
                s("Tried to set bad cookie value for %(key)s".format({
                    key: r
                })), i = null
            }
            u(r, i, n)
        }

        function d(e, t) {
            var n = (t || c) + e,
                r = f(n);
            try {
                r = JSON.parse(r)
            } catch (i) {}
            return {
                name: e,
                data: r
            }
        }
        var n = t.cookie;
        t.cookie = l;
        var r = !1,
            i = {
                domain: undefined,
                secure: undefined,
                path: "/"
            };
        e.cookies = {
            init: o,
            get: f,
            set: u,
            expire: a,
            setUserCookie: p,
            getUserCookie: d
        };
        var c = "_"
    }(r, jQuery), ! function(e) {
        var t = "loid",
            n = "loidcreated",
            r = "session_tracker",
            i = /(^[a-zA-Z0-9]+)\.(\d+)\.(\d+)\..+$/;
        e.tracker = {
            getTrackingData: function() {
                var t = {},
                    n = e.cookies.get(r),
                    i = n && this.parseTrackingCookie(n);
                i && (t.session_id = i.id, t.session_id_version = i.version, t.session_id_created = i.created);
                if (e.config.logged) return t;
                var s = this.getLoIdData();
                return s.id && (t.loid = s.id, t.loid_version = s.version, t.loid_created = s.created), t
            },
            getLoIdData: function() {
                var r = e.cookies.get(t),
                    i = this.parseTrackingCookie(r) || {};
                return i.cookie = r, i.created_cookie = e.cookies.get(n), e.config.loid && (i.id = e.config.loid, i.created = e.config.loid_created, i.version = e.config.loid_version), i
            },
            parseTrackingCookie: function(e) {
                var t = e.match(i);
                return t ? {
                    id: t[1],
                    version: parseInt(t[2]),
                    created: parseInt(t[3])
                } : null
            }
        }, window.redditlib = window.redditlib || {}, window.redditlib.Tracker = function() {
            return e.tracker
        }
    }(window.r), ! function(e, t) {
        e.hooks.get("setup").register(function() {
            try {
                window.reddit = {};

                function t(t) {
                    e.sendError(t, {
                        tag: "reddit-config-migrate-error"
                    })
                }
                var n = Object.keys(e.config);
                n.forEach(function(n) {
                    Object.defineProperty(window.reddit, n, {
                        configurable: !1,
                        enumerable: !0,
                        get: function() {
                            var i = "config property %(key)s accessed through global reddit object.";
                            return t(i.format({
                                key: n
                            })), e.config[n]
                        },
                        set: function(i) {
                            var s = "config property %(key)s set through global reddit object.";
                            return t(s.format({
                                key: n
                            })), e.config[n] = i
                        }
                    })
                })
            } catch (i) {
                window.reddit = e.config
            }
        })
    }(r), ! function(e, t) {
        e.ajax = function(t) {
            var n = t.url;
            if (t.type == "GET" && _.isEmpty(t.data)) {
                var i = e.preload.read(n);
                if (i != null) {
                    t.dataFilter && (i = t.dataFilter(i, "json")), t.success(i);
                    var s = new jQuery.Deferred;
                    return s.resolve(i), s
                }
            }
            var o = n && (n[0] == "/" || n.lastIndexOf(e.config.currentOrigin, 0) == 0);
            return o && (t.headers || (t.headers = {}), t.headers["X-Modhash"] = e.config.modhash), $.ajax(t)
        }
    }(r), ! function(e, t, n) {
        t.safeGet = function(n, i) {
            if (t.disabled) return i;
            try {
                return t.get(n)
            } catch (s) {
                return e.sendError('Unable to read storage key "%(key)s" (%(err)s)'.format({
                    key: n,
                    err: s
                })), i
            }
        }, t.safeSet = function(n, i) {
            if (t.disabled) return !1;
            try {
                return t.set(n, i), !0
            } catch (s) {
                return e.warn('Unable to set storage key "%(key)s" (%(err)s)'.format({
                    key: n,
                    err: s
                })), !1
            }
        }
    }(r, store), r.preload = {
        timestamp: new Date,
        maxAge: 3e5,
        data: {},
        isExpired: function() {
            return new Date - this.timestamp > this.maxAge
        },
        set: function(e) {
            _.extend(this
                .data, e)
        },
        read: function(e) {
            var t = this.data[e];
            if (e[0] == "#") return t;
            if (this.isExpired()) return;
            return t
        }
    }, r.logging = {}, r.logging.pageAgeLimit = 300, r.logging.sendThrottle = 8, r.logging.exceptionMessageTemplate = _.template('Client Error: "<%= errorType %>" thrown at L<%= line %>:<%= character %> in <%= file %> Message: "<%= message %>"'), r.logging.defaultExceptionValues = {
        message: "UNKNOWN MESSAGE",
        file: "UNKNOWN FILE",
        line: "?",
        character: "?",
        errorType: "UNKNOWN ERROR TYPE"
    }, r.logging.sendException = function(e) {
        if (!e) throw "No exception object was passed in.";
        _.defaults(e, r.logging.defaultExceptionValues);
        var t = r.logging.exceptionMessageTemplate(e);
        r.logging.sendError(t, {
            tag: "unknown"
        })
    }, r.logging.init = function() {
        _.each(["debug", "log", "warn", "error"], function(e) {
            r[e] = (e != "debug" || r.config.debug) && window.console && console[e] ? _.bind(console[e], console) : function() {}
        }), r.sendError = r.logging.sendError
    }, r.logging.serverLogger = {
        logCount: 0,
        _queuedLogs: [],
        queueLog: function(e) {
            if (!r.config) return;
            r.warn || (r.warn = function() {});
            if (this.logCount >= 3) {
                r.warn("Not sending debug log; already sent", this.logCount);
                return
            }
            var t = new Date / 1e3 - r.config.server_time;
            if (Math.abs(t) > r.logging.pageAgeLimit) {
                r.warn("Not sending debug log; page too old:", t);
                return
            }
            if (!r.config.send_logs) {
                r.warn("Server-side debug logging disabled");
                return
            }
            e.url = window.location.toString(), this._queuedLogs.push(e), this.logCount++, _.defer(_.bind(function() {
                this._sendLogs()
            }, this))
        },
        _sendLogs: _.throttle(function() {
            var e = this._queuedLogs.length;
            r.ajax({
                type: "POST",
                url: "/web/log/error.json",
                data: {
                    logs: JSON.stringify(this._queuedLogs)
                },
                headers: {
                    "X-Loggit": !0
                },
                success: function() {
                    r.log("Sent", e, "debug logs to server")
                },
                error: function(e, t, n) {
                    r.warn("Error sending debug logs to server:", t, ";", n)
                }
            }), this._queuedLogs = []
        }, r.logging.sendThrottle * 1e3)
    }, r.logging.sendError = function() {
        var e = _.toArray(arguments),
            t = _.last(e),
            n = {};
        _.isObject(t) && (n = t, e.pop());
        var i = _.defaults({
            msg: e.join(" ")
        }, n);
        r.error && r.error.apply(r, arguments), r.logging.serverLogger.queueLog(i)
    }, r.hooks.get("setup").register(function() {
        r.logging.init(), r.hooks.get("logging").call()
    }), ! function(e, t, n, r) {
        "use strict";
        var i = e.onerror;
        e.onerror = function(t, r, s, o, u) {
            var a = /^(chrome:\/\/|file:\/\/)/i,
                f = /((^Script error\.$)|(atomicFindClose))/i;
            if (a.test(r) || f.test(t)) return;
            var l = {
                message: t,
                file: r,
                line: s,
                character: o,
                errorType: u
            };
            n.logging.sendException(l), i && i.apply(e, arguments)
        }
    }(this, jQuery, r, _), ! function() {
        var e = /\{(t2_\w+)\}/,
            t = [/^\d+-(websocket|orangered|orangered-ts|inboxcount)$/, /^\d+-websocket-websocketUrl$/, /^__synced_local_storage_\d+-websocket__$/];
        r.hooks.get("setup").register(function() {
            var n = r.tracker && r.tracker.getTrackingData().loid,
                i = n ? parseInt(n, 36) : r.config.user_id,
                s = "t2_" + i.toString(36),
                o = [];
            try {
                o = Object.keys(localStorage)
            } catch (u) {
                return
            }
            var a = o.filter(function(n) {
                var r = e.exec(n);
                if (r && (!s || r[1] !== s)) return !0;
                for (var i = 0; i < t.length; i++)
                    if (t[i].test(n)) return !0
            });
            try {
                for (var f = 0, l = a.length; f < l; f++) localStorage.removeItem(a[f])
            } catch (u) {
                return
            }
        })
    }(), ! function(e) {
        var t = "up",
            n = "down",
            r, i = window.MouseEvent,
            s = document.createEvent;
        s && (s = s.bind(document));
        try {
            i && (r = new i("click", {
                bubbles: !0
            }))
        } catch (o) {}
        try {
            !r && s && (r = s("MouseEvent"))
        } catch (o) {}
        r || (r = {}), window.MouseEvent = function(e, t) {
            return r
        }, document.createEvent = function(e) {
            return e === "MouseEvent" || e === "MouseEvents" ? r : s(e)
        }, $(function() {
            $(document.body).on("click", ".arrow", function(o) {
                var u = $(this);
                if (!e.config.logged || e.access.isLinkRestricted(this)) return;
                if (u.hasClass("archived")) return;
                var a = u.thing(),
                    f = a.thing_id(),
                    l = a.data("subreddit"),
                    c = u.hasClass(t) ? 1 : u.hasClass(n) ? -1 : 0,
                    h, p = $.param({
                        dir: c,
                        id: f,
                        sr: l || ""
                    });
                !o || !o.originalEvent ? h = !1 : i instanceof Function && "isTrusted" in i.prototype ? h = o.originalEvent.isTrusted : i instanceof Function ? h = o.originalEvent instanceof i && o.originalEvent !== r : h = o.originalEvent !== r;
                var d = {
                    id: f,
                    dir: c,
                    vh: e.config.vote_hash,
                    isTrusted: h
                };
                e.config.event_target && (d.vote_event_data = JSON.stringify({
                    page_type: e.config.event_target.target_type,
                    sort: e.config.event_target.target_sort,
                    sort_filter_time: e.config.event_target.target_filter_time
                }));
                var v = a.data("rank");
                v && (d.rank = parseInt(v)), $.request("vote?" + p, d), a.updateThing({
                    voted: c
                })
            })
        })
    }(r), r.ui = {}, r.ui.Base = function(e) {
        this.$el = $(e)
    }, r.ui.collapsibleSideBox = function(e) {
        var t = $("#" + e);
        return new r.ui.Collapse(t.find(".title"), t.find(".content"), e)
    }, r.ui.Collapse = function(e, t, n) {
        r.ui.Base.call(this, e), this.target = t, this.key = "ui.collapse." + n, this.isCollapsed = store.safeGet(this.key) == 1, this.$el.click($.proxy(this, "toggle", null, !1)), this.toggle(this.isCollapsed, !0)
    }, r.ui.Collapse.prototype = {
        animDuration: 200,
        toggle: function(e, t) {
            e == null && (e = !this.isCollapsed);
            var n = t ? 0 : this.animDuration;
            e ? $(this.target).slideUp(n) : $(this.target).slideDown(n), this.isCollapsed = e, store.safeSet(this.key, e), this.update()
        },
        update: function() {
            this.$el.find(".collapse-button").text(this.isCollapsed ? "+" : "-")
        }
    }, r.ui.Summarize = function(e, t) {
        r.ui.Base.call(this, e), this.maxCount = t, this._updateItems(), this.$hiddenItems.length > 0 && (this.$toggleButton = $('<button class="expand-summary">').click($.proxy(this, "_toggle")), this.$el.after(this.$toggleButton), this._summarize())
    }, r.ui.Summarize.prototype = {
        refresh: function() {
            this._updateItems(), this.$el.hasClass("summarized") ? this._summarize() : this._expand()
        },
        _updateItems: function() {
            var e = this.$el.children(".important"),
                t = this.$el.children(":not(.important)"),
                n = this.maxCount ? Math.max(0, this.maxCount - e.length) : 0,
                r = t.slice(0, Math.max(n - 1, 0));
            this.$summaryItems = e.add(r), this.$hiddenItems = t.slice(n)
        },
        _summarize: function() {
            this.$el.addClass("summarized"), this.$hiddenItems.hide(), this.$summaryItems.length ? this.$toggleButton.text(r._("â€¦ and %(count)s more â‡’").format({
                count: this.$hiddenItems.length
            })) : this.$toggleButton.text(r._("show %(count)s â‡’").format({
                count: this.$hiddenItems.length
            }))
        },
        _expand: function() {
            this.$el.removeClass("summarized"), this.$hiddenItems.show(), this.$toggleButton.text(r._("â‡ less"))
        },
        _toggle: function(e) {
            this.$el.hasClass("summarized") ? this._expand() : this._summarize(), e.preventDefault()
        }
    }, r.i18n = {
        jed: new Jed({
            locale_data: {
                messages: {
                    "": {
                        domain: "messages",
                        lang: "en"
                    }
                }
            }
        }),
        setPluralForms: function(e) {
            this.jed.options.locale_data.messages[""].plural_forms = e
        },
        addMessages: function(e) {
            _.extend(this.jed.options.locale_data.messages, e)
        }
    }, r._ = _.bind(r.i18n.jed.gettext, r.i18n.jed), r.P_ = _.bind(r.i18n.jed.ngettext, r.i18n.jed), r.N_ = _.identity, r.NP_ = function(e, t) {
        return [e, t]
    }, r.utils = {
        isHidden: function(e) {
            if (!e || e.hidden) return !0;
            if (window.getComputedStyle) {
                var t = window.getComputedStyle(e);
                if (t.display === "none" || t.visibility === "hidden") return !0
            }
            return $(e).is(":hidden") ? !0 : e.parentElement ? this.isHidden(e.parentElement) : !1
        },
        isFullscreen: function() {
            var e = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
            return e != null
        },
        getFingerprint: function() {
            var e = store.safeGet("fp"),
                t = store.safeGet("fp_timestamp");
            if (!e) {
                try {
                    e = (new Fingerprint2).getSync().fprint
                } catch (n) {
                    e = null
                }
                e && (t = Date.now(), store.safeSet("fp", e), store.safeSet("fp_timestamp", t))
            }
            return {
                fp: e,
                timestamp: t
            }
        },
        replaceUrlParams: function(e, t) {
            var n = r.utils.parseQueryStringFromUrl(e);
            Object.keys(t).forEach(function(e) {
                n[e] = t[e]
            });
            var i = document.createElement("a");
            return i.href = e, i.search = $.param(n), i.href
        },
        parseQueryStringFromUrl: function(e) {
            var t = document.createElement("a");
            return t.href = e, r.utils.parseQueryString(t.search)
        },
        parseQueryString: function(e) {
            e[0] === "?" && (e = e.substr(1));
            if (e === "") return {};
            var t = e.split("&");
            return t.reduce(function(e, t) {
                var n = t.split("="),
                    r = n[0],
                    i = n[1] && decodeURIComponent(n[1].replace(/\+/g, " "));
                return r in e ? e[r] = [].concat(e[r], i) : e[r] = i, e
            }, {})
        },
        getUrlOrigin: function(e) {
            var t = document.createElement("a");
            return t.href = e, t.origin || window.location.origin
        },
        formatFileSize: function(e) {
            var t = ["bytes", "KiB", "MiB", "GiB", "TiB", "EiB", "ZiB"],
                n = e ? parseInt(Math.log2(e) / 10, 10) : 0;
            return (e / (1 << n * 10)).toFixed(3).replace(/\.?0+$/, "") + " " + t[n]
        },
        fullnameToId: function(e) {
            var t = e.split("_"),
                n = t && t[1];
            return n && parseInt(n, 36)
        },
        idToFullname: function(e, t) {
            return t + "_" + parseInt(e, 10).toString(36)
        },
        escapeSelector: function(e) {
            return e.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g, "\\$1")
        },
        clamp: function(e, t, n) {
            return Math.max(t, Math.min(n, e))
        },
        staticURL: function(e) {
            return r.config.static_root + "/" + e
        },
        s3HTTPS: function(e) {
            return location.protocol == "https:" ? e.replace("http://", "https://s3.amazonaws.com/") : e
        },
        parseTimestamp: function(e) {
            var t = e.data("timestamp"),
                n;
            return t || (n = e.attr("datetime"), t = Date.parse(n), e.data("timestamp", t)), t
        },
        joinURLs: function() {
            return _.map(arguments, function(e, t) {
                return t > 0 && e && e[0] != "/" && (e = "/" + e), e
            }).join("")
        },
        _scOn: "<!-- SC_ON -->",
        _scOff: "<!-- SC_OFF -->",
        _scBetweenTags1: />\s+/g,
        _scBetweenTags2: /\s+</g,
        _scSpaces: /\s+/g,
        _scDirectives: /(<!-- SC_ON -->|<!-- SC_OFF -->)/,
        spaceCompress: function(e) {
            var t = "",
                n = !0,
                r = e.split(this._scDirectives);
            for (var i = 0; i < r.length; ++i) {
                var s = r[i];
                s === this._scOn ? n = !0 : s === this._scOff ? n = !1 : n ? (s = s.replace(this._scSpaces, " "), s = s.replace(this._scBetweenTags1, ">"), s = s.replace(this._scBetweenTags2, "<"), t += s) : t += s
            }
            return t
        },
        tup: function(e) {
            return _.isArray(e) || (e = [e]), e
        },
        structuredMap: function(e, t) {
            if (_.isArray(e)) return _.map(e, function(e) {
                return r.utils.structuredMap(e, t)
            });
            if (_.isObject(e)) {
                var n = {};
                return _.each(e, function(e, i) {
                    n[t(i, "key")] = r.utils.structuredMap(e, t)
                }), n
            }
            return t(e, "value")
        },
        unescapeJson: function(e) {
            return r.utils.structuredMap(e, function(e) {
                return _.isString(e) ? _.unescape(e) : e
            })
        },
        querySelectorFromEl: function(e, t) {
            return $(e).parents().addBack().filter(t || "*").map(function(e, t) {
                var n = [],
                    r = $(t),
                    i = r.data("fullname"),
                    s = r.attr("id"),
                    o = r.attr("class");
                return n.push(t.nodeName.toLowerCase()), i ? n.push('[data-fullname="' + i + '"]') : s ? n.push("#" + s) : o && n.push("." + _.compact(o.split(/\s+/)).join(".")), n.join("")
            }).toArray().join(" ")
        },
        _emailRe: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.)+[^<>()\.,;:\s@\"]{2,63})$/,
        isEmail: function(e) {
            return this._emailRe.test(e)
        },
        serializeForm: function(e) {
            var t = {};
            return $.each(e.serializeArray(), function(e, n) {
                t[n.name] = n.value
            }), t
        },
        _pyStrFormatRe: /%\((\w+)\)s/g,
        pyStrFormat: function(e, t) {
            return e.replace(this._pyStrFormatRe, function(e, n) {
                if (n in t) return t[n];
                throw "missing format parameter"
            })
        },
        _mdLinkRe: /\[(.*?)\]\((.*?)\)/g,
        formatMarkdownLinks: function(e) {
            return _.escape(e).replace(this._mdLinkRe, function(e, t, n) {
                return '<a href="' + n + '">' + t + "</a>"
            })
        },
        clearMarkdown: function(e) {
            var t = e || "";
            return t.replace(/\n={2,}/g, "\n").replace(/~~/g, "").replace(/`{3}.*\n/g, "").replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, "$1").replace(/<[^>]*>/g, "").replace(/^[=\-]{2,}\s*$/g, "").replace(/\[\^.+?\](\: .*?$)?/g, "").replace(/\s{0,2}\[.*?\]: .*?$/g, "").replace(/\!\[.*?\][\[\(].*?[\]\)]/g, "").replace(/\[(.*?)\][\[\(].*?[\]\)]/g, "$1").replace(/^\s{0,3}>\s?/g, "").replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, "").replace(/^(\n)?\s{0,}#{1,6}\s*| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm, "$1$2$3").replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, "$2").replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, "$2").replace(/(`{3,})(.*?)\1/gm, "$2").replace(/`(.+?)`/g, "$1").replace(/\n{2,}/g, "\n\n")
        },
        prettyNumber: function(e) {
            var t = parseInt(e);
            return t ? t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : e
        },
        safePrettyNumber: function(e) {
            return e >= 1e6 ? (e / 1e6).toFixed(1) + "M" : e >= 1e3 ? (e / 1e3).toFixed(1) + "k" : String(e)
        },
        prettyRoundNumber: function(e) {
            return e >= 1e6 ? (e / 1e6).toFixed(1).replace(/\.0$/, "") + "M" : e >= 1e3 ? (e / 1e3).toFixed(1).replace(/\.0$/, "") + "k" : this.prettyNumber(e)
        },
        LRUCache: function(e) {
            var t = e > 0 ? e : 16,
                n = [],
                r = {},
                i = function(e) {
                    s(e), n.push(e), n.length > t && delete r[n.shift()]
                },
                s = function(e) {
                    var t = _.indexOf(n, e);
                    t >= 0 && n.splice(t, 1)
                };
            this.remove = function(e) {
                s(e), delete r[e]
            }, this.set = function(e, t) {
                _.isUndefined(t) ? this.remove(e) : (r[e] = t, i(e))
            }, this.get = function(e) {
                var t = r[e];
                return _.isUndefined(t) || i(e), t
            }, this.ajax = function(e, t) {
                var n = this.get(e);
                return _.isUndefined(n) ? $.ajax(t).done(_.bind(this.set, this, e)) : (new $.Deferred).resolve(n)
            }
        },
        parseError: function(e) {
            var t = e[0],
                n = e[1],
                r = e[2];
            return {
                name: t,
                message: n,
                field: r
            }
        },
        onTrident: function() {
            return "ActiveXObject" in window
        },
        navigateTo: function(e, t, n) {
            t || (n = t, t = "GET");
            var i = e.href || e;
            n = _.extend(n || {}, r.utils.parseQueryStringFromUrl(i));
            var s = document.createElement("form");
            s.action = i, s.method = t, e.target && (s.target = e.target), n && _.map(n, function(e, t) {
                var n = document.createElement("input");
                return n.type = "hidden", n.name = t, n.value = e, n
            }).forEach(function(e) {
                s.appendChild(e)
            }), s.style.display = "none", document.body.appendChild(s), s.submit()
        },
        getWindowForTarget: function(e) {
            if (!e) {
                var t = document.querySelector("base");
                e = t.target
            }
            if (typeof e == "string") switch (e) {
                case "_self":
                    return window;
                case "_parent":
                    return window.parent;
                case "_top":
                    return window.top;
                case "_blank":
                    return window.open();
                default:
                    e = document.querySelector('iframe[name="' + e + '"]')
            }
            return e instanceof Window ? e : e || window
        },
        getDomain: function(e) {
            var t = e && e.match(/\/\/([^\/]+)/);
            return t && t.length > 1 ? t[1] : e
        },
        isUrlScraped: function(e) {
            var t = this.getDomain(e);
            for (var n = 0; n < r.config.scraped_domains.length; ++n)
                if (this.isSubdomain(t, r.config.scraped_domains[n])) return !0;
            var i = new RegExp("\\.(" + r.config.scraped_image_extensions.join("|") + ")$");
            return i.test(e) ? !0 : !1
        },
        isSimpleClickEvent: function(e) {
            if (e && $(e.target).closest("a").length) {
                if (e.which > 1) return !1;
                if (e.ctrlKey) return !1;
                if (e.altKey) return !1;
                if (e.metaKey) return !1;
                if (e.shiftKey) return !1
            }
            return !0
        },
        formatAsStringLower: function(e) {
            if (!e) return null;
            var t = e.replace(/ /g, "_").toLowerCase();
            if (/^[-_a-z0-9]+$/.test(t)) return t;
            throw new Error("String does not follow the StringLower format.")
        },
        isMobile: function() {
            return /Mobi/i.test(navigator.userAgent)
        },
        isIOS: function() {
            return /iP(hone|ad|od)/i.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1
        },
        isSubdomain: function(e, t) {
            return e ? e === t || e.endsWith("." + t) : !1
        },
        _isVisibilityHandlerInitialized: !1,
        _visibilityCallbacks: [],
        _VISIBILITY_KEYS: {
            hidden: "visibilitychange",
            webkitHidden: "webkitvisibilitychange",
            mozHidden: "mozvisibilitychange",
            msHidden: "msvisibilitychange"
        },
        _getVisibilityEventKey: function() {
            for (key in this._VISIBILITY_KEYS)
                if (typeof document[key] != "undefined") return key;
            return null
        },
        isInFocus: function() {
            var e = this._getVisibilityEventKey();
            return e ? !document[e] : !0
        },
        addVisibilityCallback: function(e) {
            this._visibilityCallbacks.push(e);
            var t = this._getVisibilityEventKey();
            t && !this._isVisibilityHandlerInitialized && (this._isVisibilityHandlerInitialized = !0, document.addEventListener(this._VISIBILITY_KEYS[t], function() {
                var e = !document[t];
                for (indx in this._visibilityCallbacks) this._visibilityCallbacks[indx](e)
            }.bind(this), !1))
        }
    }, String.prototype.format = function(e) {
        return r.utils.pyStrFormat(this, e)
    }, r.analytics = {
        init: function() {
            function e(e) {
                this.adBlockIsEnabled = e.isAdblockEnabled
            }
            e.bind(this), r.detection.getAdblockStatus().then(e), this.impressionsFired = {}, this.handleViewabilityChange = this.handleViewabilityChange.bind(this), this.observer = new IntersectionObserver(function(e) {
                e.forEach(this.handleViewabilityChange)
            }.bind(this), {
                threshold: [.01, .3, .5, .8, .999, 1]
            }), this.videoPlayerToPost = {}, this.fireUnloadPixel = this.fireUnloadPixel.bind(this), $(window).on("beforeunload", function() {
                this._postUnloadQueue.forEach(this.fireUnloadPixel), this._postUnloadQueue.length = 0
            }.bind(this)), $(document).delegate(".promotedlink", "onshow", _.bind(function(e) {
                r.analytics.bindAdEventPixels()
            }, this)), $(".promotedlink:visible").trigger("onshow"), this.isInFocus = r.utils.isInFocus(), this.handleVisibilityChange = this.handleVisibilityChange.bind(this), r.utils.addVisibilityCallback(this.handleVisibilityChange), r.analytics.addEventPredicate("ads", function() {
                return !r.config.is_sponsor
            }), r.config.ads_virtual_page && r.analytics.fireFunnelEvent("ads", r.config.ads_virtual_page), r.analytics.stripAnalyticsParams(), typeof window.screen == "object" && (r.utils.isMobile() || r.utils.isIOS()) && (this.devicePixelRatio = window.screen.width / window.innerWidth)
        },
        devicePixelRatio: 1,
        _eventPredicates: {},
        addEventPredicate: function(e, t) {
            var n = this._eventPredicates[e] || [];
            n.push(t), this._eventPredicates[e] = n
        },
        shouldFireEvent: function(e) {
            var t = _.rest(arguments);
            return !this._eventPredicates[e] || this._eventPredicates[e].every(function(e) {
                return e.apply(this, t)
            })
        },
        _isGALoaded: !1,
        isGALoaded: function() {
            if (this._isGALoaded) return !0;
            if (_.isArray(_gaq)) return undefined;
            var e = !1;
            return _gaq.push(function() {
                e = !0
            }), this._isGALoaded = e, e
        },
        _wrapCallback: function(e) {
            var t = e;
            return t.called = !1, e = function() {
                t.called || (t(), t.called = !0)
            }, setTimeout(e, 500), e
        },
        fireFunnelEvent: function(e, t, n, r) {
            n = n || {}, r = r || window.Function.prototype;
            var i = "/" + _.compact([e, t, n.label]).join("-");
            if (n.tracker && "_ga" in window && window._ga.getByName && window._ga.getByName(n.tracker)) {
                window._ga(n.tracker + ".send", "pageview", {
                    page: i,
                    hitCallback: r
                }), n.value && window._ga(n.tracker + ".send", "event", e, t, n.label, n.value);
                return
            }
            if (!window._gaq || !this.shouldFireEvent.apply(this, arguments)) {
                r();
                return
            }
            var s = this.isGALoaded();
            s || (r = this._wrapCallback(r)), _gaq.push(["_trackPageview", i]), n.value && _gaq.push(["_trackEvent", e, t, n.label, n.value]), _gaq.push(r)
        },
        fireGAEvent: function(e, t, n, r, i, s) {
            n = n || "", r = r || 0, i = !!i, s = s || function() {};
            if (!window._gaq || !this.shouldFireEvent.apply(this, arguments)) {
                s();
                return
            }
            var o = this.isGALoaded();
            o || (s = this._wrapCallback(s)), _gaq.push(["_trackEvent", e, t, n, r, i]), _gaq.push(s)
        },
        setEventPixel: function(e, t, n) {
            var r = "ads." + e,
                i = store.safeGet(r) || {},
                s = store.safeGet("ads.recent") || [],
                o = {},
                u = _.unique(s).slice(0, 3);
            for (var a = 0; a < u.length; a++) {
                var f = u[a],
                    l = i[f];
                l && (o[f] = i[l])
            }
            o[t] = n, u.push(t), store.safeSet(r, o), store.safeSet("ads.recent", u)
        },
        getEventPixel: function(e, t) {
            var n = "ads." + e;
            return (store.safeGet(n) || {})[t]
        },
        getPostFromVideoPlayer: function(e) {
            var t = Object.keys(this.videoPlayerToPost);
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                if (this.videoPlayerToPost[r] === e) return r
            }
            return null
        },
        observeAdVideoPlayer: function(e, t) {
            if (!this.impressionsFired || e.length == 0 || t.length == 0) return;
            var n = e[0],
                r = t[0],
                i = n.id,
                s = this.impressionsFired[i];
            if (!s) return;
            s.video.isPlayerShowing = !0;
            var o = r.id;
            this.videoPlayerToPost[o] = i, this.observer.observe(r), $(n).one("onhide", function() {
                s.video.isPlayerShowing = !1;
                var e = {
                    muted: !0,
                    volume: 0,
                    duration: s.video.duration
                };
                this.handleVideoAdEvent("seekJump", null, e, $(n))
            }.bind(this))
        },
        bindAdEventPixels: function() {
            var e = $(".promotedlink");
            if (!e.length) return;
            e.each(function(e, t) {
                var n = $(t),
                    r = n[0],
                    i = n.thing_id(),
                    s, o, u, a, f, l, c, h;
                this.impressionsFired[t.id] || (this.impressionsFired[t.id] = this.getNewImpressionCache());
                var p = this.impressionsFired[t.id],
                    d = n.data("kind");
                p.video.isVideo = d === "video", this._isOnCommentsPageForCurrentAd(t) ? (s = this.getEventPixel("adserverUpvotePixel", i), o = this.getEventPixel("adserverDownvotePixel", i), u = this.getEventPixel("adserverViewCommentsPixel", i), l = this.getEventPixel("adserverCommentSubmittedPixel", i), a = this.getEventPixel("adserverCommentUpvotePixel", i), f = this.getEventPixel("adserverCommentDownvotePixel", i), h = this.getEventPixel("adserverClickUrl", i), h && n.find("a[data-event-action=thumbnail],a[data-event-action=title]").attr("href", h), a && $(".comment").one("click", ".arrow.up", function(e) {
                    this.firePixelUrl("adserverCommentUpvotePixel", r, a)
                }.bind(this)), f && $(".comment").one("click", ".arrow.down", function() {
                    this.firePixelUrl("adserverCommentDownvotePixel", r, f)
                }.bind(this)), l && $(".commentarea").on("submit", "form.usertext.cloneable", function() {
                    this.firePixelUrl("adserverCommentSubmittedPixel", r, l)
                }.bind(this)), this.firePixelUrl("adserverViewCommentsPixel", r, u)) : (s = n.data("adserverUpvotePixel"), o = n.data("adserverDownvotePixel"), u = n.data("adserverViewCommentsPixel"), l = n.data("adserverCommentSubmittedPixel"), a = n.data("adserverCommentUpvotePixel"), f = n.data("adserverCommentDownvotePixel"), c = n.data("adserverClickPixel"), h = n.data("adserverClickUrl"), this.setEventPixel("adserverUpvotePixel", i, s), this.setEventPixel("adserverDownvotePixel", i, o), this.setEventPixel("adserverViewCommentsPixel", i, u), this.setEventPixel("adserverCommentSubmittedPixel", i, l), this.setEventPixel("adserverCommentUpvotePixel", i, a), this.setEventPixel("adserverCommentDownvotePixel", i, f), this.setEventPixel("adserverClickUrl", i, h)), this.observer.observe(t), s && n.one("click", ".arrow.up", function() {
                    this.firePixelUrl("adserverUpvotePixel", r, s)
                }.bind(this)), o && n.one("click", ".arrow.down", function() {
                    this.firePixelUrl("adserverDownvotePixel", r, o)
                }.bind(this)), c && n.one("click", "a[data-event-action=thumbnail],a[data-event-action=title]", function() {
                    this.firePixelUrl("adserverClickPixel", r, c)
                }.bind(this));
                var v = n.data("isGallery");
                h && n.on("mousedown", "a[data-event-action=thumbnail],a[data-event-action=title]", function(e) {
                    var t = v ? $(e.currentTarget).attr("href") : h,
                        r = this.getPixelMetadata(n[0], t, p, "adserverClickUrl"),
                        i = this.getPixelUrl(t, r);
                    $(e.currentTarget).attr("href", i)
                }.bind(this))
            }.bind(this))
        },
        _isOnCommentsPageForCurrentAd: function(e) {
            var t = document.body.classList.contains("comments-page"),
                n = e.classList.contains("promotedlink"),
                r = e.dataset.context === "comments";
            return t && n && r
        },
        _VIDEO_FULLY_VIEWABLE_RATIO_THRESHOLD: .999,
        _viewabilityThresholds: {
            1: {
                threshold: .01
            },
            30: {
                threshold: .3
            },
            50: {
                threshold: .5
            },
            100: {
                threshold: 1
            }
        },
        _videoViewabilityThresholds: {
            TOTAL_MRC_VIEWABLE: {
                threshold: .5,
                playing: !0
            },
            HALF_DURATION_80_IN_VIEW_AUDIBLE: {
                threshold: .8,
                playing: !0,
                audible: !0
            },
            FULL_IN_VIEW_AUDIBLE: {
                threshold: .999,
                playing: !0,
                audible: !0
            },
            FULL_IN_VIEW: {
                threshold: .999,
                playing: !0
            },
            AUDIBLE: {
                threshold: 0,
                playing: !0,
                audible: !0
            }
        },
        getFormattedThreshold: function(e) {
            return Math.floor(e * 100)
        },
        getNewThresholdData: function(e) {
            return e.reduce(function(e, t) {
                return e[t] = {
                    maxContinuousTime: 0,
                    totalTime: 0,
                    timeEntered: null
                }, e
            }, {})
        },
        getNewImpressionCache: function() {
            return {
                madeImpression: !1,
                pixelsFired: {},
                thresholdData: this.getNewThresholdData(Object.keys(this._viewabilityThresholds)),
                video: {
                    isVideo: !1,
                    isVisible: !1,
                    isPlaying: !1,
                    isPlayerShowing: !1,
                    isPlayingWithSound: !1,
                    hasSeeked: !1,
                    currentTime: 0,
                    totalPlayTime: 0,
                    durationMs: 0,
                    volume: 0,
                    isFullScreen: !1,
                    wasFullScreen: !1,
                    lastViewabilityEvent: null,
                    thresholdData: this.getNewThresholdData(Object.keys(this._videoViewabilityThresholds))
                },
                viewable: {
                    fired: !1,
                    timer: null,
                    timeRemaining: 1e3
                },
                vendorFullyInView: {
                    fired: !1,
                    timer: null,
                    timeRemaining: 100
                },
                vendorFullyInViewFiveSecs: {
                    fired: !1,
                    timer: null,
                    timerLastInitialized: null,
                    timeRemaining: 5e3
                },
                vendorFullyInViewFifteenSecs: {
                    fired: !1,
                    timer: null,
                    timerLastInitialized: null,
                    timeRemaining: 15e3
                },
                videoViewable: {
                    fired: !1,
                    timer: null,
                    timerLastInitialized: null,
                    timeRemaining: 2e3
                },
                videoFullyViewable: {
                    fired: !1,
                    timer: null,
                    timerLastInitialized: null,
                    timeRemaining: 3e3
                },
                groupMViewable: {
                    fired: !1,
                    timer: null,
                    timeRemaining: 1e3
                },
                videoGroupMViewable: {
                    fired: !1,
                    timer: null,
                    timerLastInitialized: null,
                    timeRemaining: null
                },
                videoVendorFullyViewableFifty: {
                    fired: !1,
                    timer: null,
                    timerLastInitialized: null,
                    timeRemaining: null
                }
            }
        },
        handleVisibilityChange: function(e) {
            this.isInFocus = e;
            var t = Object.keys(this.impressionsFired);
            for (var n = 0; n < t.length; n++) {
                var r = this.impressionsFired[t[n]];
                r.lastViewabilityEvent && this.handleViewabilityChange(r.lastViewabilityEvent), r.video.lastViewabilityEvent && this.handleViewabilityChange(r.video.lastViewabilityEvent)
            }
        },
        isInView: function(e, t, n) {
            return t === 0 ? !0 : this.isInFocus ? n.video.isFullScreen || e.intersectionRatio >= t : !1
        },
        fireVideoTimePixels: function(e, t, n) {
            var r = .001,
                i = Object.keys(e);
            for (var s = 0; s < i.length; s++) {
                var o = i[s],
                    u = e[o];
                u - t <= r && this.firePixel(o, n)
            }
        },
        handleVideoTimeUpdate: function(e, t, n, r) {
            if (r.length == 0) return;
            var i = r[0],
                s = this.impressionsFired[i.id];
            if (!s) return;
            this.updateVideoTimeTrackers(s, t, e);
            var o = {
                    adserverVideoWatchedTwentyFivePixel: .25 * n,
                    adserverVideoWatchedFiftyPixel: .5 * n,
                    adserverVideoWatchedSeventyFivePixel: .75 * n,
                    adserverVideoWatchedNinetyFivePixel: .95 * n,
                    adserverVideoWatchedHundredPixel: 1 * n
                },
                u = {
                    adserverVideoWatchedThreeSecsPixel: 3,
                    adserverVideoWatchedFiveSecsPixel: 5,
                    adserverVideoWatchedTenSecsPixel: 10
                };
            this.fireVideoTimePixels(o, e, i);
            var a = s.video.totalPlayTime >= .95 * n ? 10 : s.video.totalPlayTime;
            this.fireVideoTimePixels(u, a, i)
        },
        _GROUP_M_LARGE_AD_AREA_THRESHOLD: 242500,
        updateVideoTimeTrackers: function(e, t, n) {
            e.video.totalPlayTime += t, e.video.currentTime = n
        },
        handleVideoAdEvent: function(e, t, n, r) {
            if (r.length == 0) return;
            var i = r[0],
                s = this.impressionsFired[r.prop("id")];
            if (!s) return;
            s.video.durationMs = n.duration * 1e3;
            var o = n.muted ? 0 : n.volume;
            s.video.volume != o && (s.video.volume = o), e === "playing" && (s.video.isPlaying = !0, this.firePixel("adserverVideoStartedPixel", i));
            if (e === "playing" || e === "unmute") {
                var u = e === "playing" && !n.muted && n.volume > 0,
                    a = e === "unmute" && s.video.isPlaying,
                    f = u || a;
                s.video.isPlayingWithSound = f, f && (this.firePixel("adserverVideoPlayedSoundPixel", i), this.firePixel("adserverVideoViewablePixel", i), this.firePixel("adserverVideoFullyViewablePixel", i))
            } else e === "seekJump" || e === "setCurrentTime" || e === "replay" ? (s.video.isPlaying = !1, s.video.isPlayingWithSound = !1, s.video.hasSeeked = !0, this.clearTimer(s, "videoViewable"), this.clearTimer(s, "videoFullyViewable"), this.pauseTimer(s, "videoGroupMViewable"), this.pauseTimer(s, "videoVendorFullyViewableFifty")) : e === "buffering" || e === "pause" ? (s.video.isPlaying = !1, s.video.isPlayingWithSound = !1, this.pauseTimer(s, "videoViewable"), this.pauseTimer(s, "videoFullyViewable"), this.pauseTimer(s, "videoGroupMViewable"), this.pauseTimer(s, "videoVendorFullyViewableFifty")) : e === "mute" ? (s.video.isPlayingWithSound = !1, this.pauseTimer(s, "videoGroupMViewable")) : e === "fullscreenRequest" ? (s.video.wasFullScreen = !0, s.video.isFullScreen = !0, this.firePixel("adserverVideoPlayedExpandedPixel", i), this.firePixel("adserverVideoViewablePixel", i), this.firePixel("adserverVideoFullyViewablePixel", i)) : e === "fullscreenCancel" && (s.video.isFullScreen = !1);
            s.video.lastViewabilityEvent && this.handleViewabilityChange(s.video.lastViewabilityEvent)
        },
        updateViewabilityThresholds: function(e, t, n, r) {
            var i = Date.now(),
                s = r ? t.video : t;
            Object.keys(n).forEach(function(r) {
                var o = n[r],
                    u = o.threshold,
                    a = s.thresholdData[r];
                if (this.isInView(e, u, t) && this.stateMeetsRequirements(o, s)) a.timeEntered || (a.timeEntered = i);
                else if (a.timeEntered) {
                    var f = i - a.timeEntered;
                    a.totalTime += f, a.maxContinuousTime = Math.max(a.maxContinuousTime, f), a.timeEntered = null
                }
            }.bind(this))
        },
        stateMeetsRequirements: function(e, t) {
            return e.playing && !t.isPlaying ? !1 : e.audible && !t.volume ? !1 : !0
        },
        handleViewabilityChange: function(e) {
            var t = e.target.id,
                n = this.impressionsFired[t];
            n && this.handleAdPostViewabilityChange(e);
            var r = this.videoPlayerToPost[t];
            r && this.handleVideoViewabilityChange(e)
        },
        handleAdPostViewabilityChange: function(e) {
            var t = this.impressionsFired[e.target.id];
            t.lastViewabilityEvent = e, this.updateViewabilityThresholds(e, t, this._viewabilityThresholds, !1), !t.madeImpression && this.isInView(e, .01, t) && (this.fireImpressionPixel(e.target), this.queueForUnload(e.target), t.madeImpression = !0), this.isInView(e, .5, t) ? this.initViewabilityTimers(e.target, e.intersectionRatio) : (this.clearViewableTimers(t), this.pauseTimer(t, "vendorFullyInViewFiveSecs"), this.pauseTimer(t, "vendorFullyInViewFifteenSecs"))
        },
        handleVideoViewabilityChange: function(e) {
            var t = e.target,
                n = this.videoPlayerToPost[e.target.id],
                r = document.getElementById(n),
                i = this.impressionsFired[n];
            i.video.isVisible = this.isInView(e, .01, i), i.video.lastViewabilityEvent = e, this.updateViewabilityThresholds(e, i, this._videoViewabilityThresholds, !0), this.isInView(e, .5, i) ? this.initVideoViewabilityTimers(t, r, e.intersectionRatio) : (this.clearVideoViewableTimers(i), this.pauseVideoViewableTimers(i)), !i.video.isPlayerShowing && e.intersectionRatio === 0 && (i.video.lastViewabilityEvent = null, this.observer.unobserve(t))
        },
        getArea: function(e) {
            var t = e.getBoundingClientRect(),
                n = t.height,
                r = t.width;
            return this.toLogicalPixels(r * n)
        },
        initVideoViewabilityTimers: function(e, t, n) {
            var r = 3e5,
                i = 15e3,
                s = n >= this._VIDEO_FULLY_VIEWABLE_RATIO_THRESHOLD,
                o = this.impressionsFired[t.id],
                u = o.videoViewable,
                a = o.videoFullyViewable,
                f = o.videoGroupMViewable,
                l = o.videoVendorFullyViewableFifty,
                c = this.getArea(e);
            o.video.isPlaying && (this.initCumulativeTimer(u, "adserverVideoViewablePixel", t), s ? (this.initCumulativeTimer(a, "adserverVideoFullyViewablePixel", t), l.timeRemaining === null && o.video.durationMs && (l.timeRemaining = Math.min(.5 * o.video.durationMs, i)), this.initCumulativeTimer(l, "adserverVideoVendorFullyViewableFiftyPixel", t)) : (this.clearTimer(o, "videoFullyViewable"), this.pauseTimer(o, "videoVendorFullyViewableFifty")));
            var h = n >= .8,
                p = c >= r,
                d = s || p && h;
            o.video.isPlayingWithSound && d ? (f.timeRemaining === null && o.video.durationMs && (f.timeRemaining = .5 * o.video.durationMs), this.initCumulativeTimer(f, "adserverVideoGroupMViewablePixel", t)) : this.pauseTimer(o, "videoGroupMViewable")
        },
        initViewabilityTimers: function(e, t) {
            var n = t === 1,
                r = this.impressionsFired[e.id],
                i = r.viewable,
                s = r.vendorFullyInView,
                o = r.vendorFullyInViewFiveSecs,
                u = r.vendorFullyInViewFifteenSecs,
                a = r.groupMViewable,
                f = this.getArea(e);
            this.initContinuousTimer(i, "adserverViewablePixel", e), n ? (this.initContinuousTimer(s, "adserverVendorFullyInViewPixel", e), this.initCumulativeTimer(o, "adserverVendorFullyInViewFiveSecsPixel", e), this.initCumulativeTimer(u, "adserverVendorFullyInViewFifteenSecsPixel", e)) : (this.clearTimer(r, "vendorFullyInView"), this.pauseTimer(r, "vendorFullyInViewFiveSecs"), this.pauseTimer(r, "vendorFullyInViewFifteenSecs"));
            var l = f >= this._GROUP_M_LARGE_AD_AREA_THRESHOLD;
            n || l ? this.initContinuousTimer(a, "adserverGroupMViewablePixel", e) : this.clearTimer(r, "groupMViewable")
        },
        initContinuousTimer: function(e, t, n) {
            !e.fired && !e.timer && (e.timer = setTimeout(function() {
                this.firePixel(t, n), e.fired = !0
            }.bind(this), e.timeRemaining))
        },
        initCumulativeTimer: function(e, t, n) {
            !e.fired && !e.timer && e.timeRemaining !== null && (e.timerLastInitialized = Date.now(), e.timer = setTimeout(function() {
                this.firePixel(t, n), e.fired = !0
            }.bind(this), e.timeRemaining))
        },
        pauseTimer: function(e, t) {
            var n = e[t];
            !n.fired && n.timer && (clearTimeout(n.timer), n.timeRemaining -= Date.now() - n.timerLastInitialized, n.timer = null, n.timerLastInitialized = null, n.timeRemaining < 0 && (n.timeRemaining = 0))
        },
        clearTimer: function(e, t) {
            var n = e[t];
            n.fired || (n.timer && clearTimeout(n.timer), e[t] = this.getNewImpressionCache()[t])
        },
        clearTimers: function(e, t) {
            var n = this;
            t.forEach(function(t) {
                n.clearTimer(e, t)
            })
        },
        clearViewableTimers: function(e) {
            var t = ["viewable", "vendorFullyInView", "groupMViewable"];
            this.clearTimers(e, t)
        },
        clearVideoViewableTimers: function(e) {
            var t = ["videoViewable", "videoFullyViewable"];
            this.clearTimers(e, t)
        },
        pauseVideoViewableTimers: function(e) {
            var t = this,
                n = ["videoVendorFullyViewableFifty", "videoGroupMViewable"];
            n.forEach(function(n) {
                t.pauseTimer(e, n)
            })
        },
        _postUnloadQueue: [],
        fireUnloadPixel: function(e) {
            window.clearTimeout(e.timer), this.firePixel("adserverUnloadPixel", document.getElementById(e.id))
        },
        queueForUnload: function(e) {
            var t = this.impressionsFired[e.id],
                n = 6e5,
                r = {
                    id: e.id,
                    timer: window.setTimeout(function() {
                        var e = this._postUnloadQueue.indexOf(r);
                        this._postUnloadQueue.splice(e, 1), this.fireUnloadPixel(r)
                    }.bind(this), n)
                };
            this._postUnloadQueue.push(r);
            if (this._postUnloadQueue.length >= 5) {
                var i = this._postUnloadQueue.shift();
                this.fireUnloadPixel(i)
            }
        },
        fireImpressionPixel: function(e) {
            if (this._isOnCommentsPageForCurrentAd(e)) return;
            var t = $(e);
            if (!this.adBlockIsEnabled) {
                var n = [],
                    i = t.data("fullname"),
                    s = t.data("cid"),
                    o = t.data("thirdPartyTrackingUrl"),
                    u = t.data("thirdPartyTrackingTwoUrl"),
                    a = t.data("thirdPartyTrackerUrls");
                o && n.push(o), u && n.push(u), $.isArray(a) && (n = n.concat(a)), n.length && (n.forEach(function(e) {
                    r.analytics.thirdPartyPixelAttemptEvent({
                        pixel_url: e,
                        link_fullname: i,
                        campaign_fullname: s
                    })
                }), r.gtm.trigger("fire-pixels", {
                    pixels: n,
                    link_fullname: i,
                    campaign_fullname: s
                }))
            }
            this.firePixel("adserverImpPixel", e)
        },
        firePixel: function(e, t) {
            if (this._isOnCommentsPageForCurrentAd(t)) return;
            var n = $(t),
                r = n.data(e);
            this.firePixelUrl(e, t, r)
        },
        firePixelUrl: function(e, t, n) {
            var r = $(t),
                i = this.impressionsFired[r.prop("id")],
                s = {};
            if (i && i.pixelsFired) {
                if (i.pixelsFired[e]) return;
                s = this.getPixelMetadata(t, n, i, e), i.pixelsFired[e] = s
            }
            if (n && !this.adBlockIsEnabled) {
                var o = new Image;
                o.src = this.getPixelUrl(n, s)
            }
        },
        getPixelUrl: function(e, t) {
            var n = e.indexOf("?") >= 0 ? "&" : "?";
            return e + n + $.param(t)
        },
        toLogicalPixels: function(e) {
            return Math.floor(e * this.devicePixelRatio)
        },
        getPixelMetadata: function(e, t, n, r) {
            if (/^(http|https):\/\/([a-z]+\.)?reddit.com/.test(t)) {
                var i = e.getBoundingClientRect(),
                    s = n.thresholdData,
                    o = n.pixelsFired,
                    u = Object.keys(o).length,
                    a = Date.now(),
                    f = this.getTimeDiff(a, this._viewabilityThresholds, s),
                    l = Math.max(s[100].maxContinuousTime, f[100]),
                    c = Math.max(s[50].maxContinuousTime, f[50]),
                    h = Math.max(s[30].maxContinuousTime, f[30]),
                    p = this.toLogicalPixels(i.height * i.width) >= this._GROUP_M_LARGE_AD_AREA_THRESHOLD,
                    d = p ? h : l,
                    v = {
                        a: s[1].totalTime + f[1],
                        b: s[50].totalTime + f[50],
                        c: s[100].totalTime + f[100],
                        d: Math.max(s[1].maxContinuousTime, f[1]),
                        e: Math.max(s[50].maxContinuousTime, f[50]),
                        f: l,
                        h: this.toLogicalPixels(i.height),
                        w: this.toLogicalPixels(i.width),
                        sh: this.toLogicalPixels(window.innerHeight),
                        sw: this.toLogicalPixels(window.innerWidth),
                        r: u,
                        t: a,
                        g: o.adserverGroupMViewablePixel || r === "adserverGroupMViewablePixel" || l >= 1e3 ? 1 : 0,
                        i: o.adserverImpPixel ?
                            o.adserverImpPixel.t : r === "adserverImpPixel" ? a : 0,
                        q: d >= 1e3 ? 1 : 0,
                        o: o.adserverViewablePixel || r === "adserverViewablePixel" || c >= 1e3 ? 1 : 0
                    };
                if (n.video.isVideo) {
                    var m = n.video.thresholdData,
                        g = this.getTimeDiff(a, this._videoViewabilityThresholds, m),
                        y = n.video.isVisible,
                        b = n.video.volume,
                        w = Math.floor(n.video.durationMs);
                    v.va = 1, v.vc = w, v.vd = Math.floor(n.video.currentTime * 1e3), v.ve = Math.floor(b * 100), v.vg = y ? 1 : 0, v.vi = m.AUDIBLE.totalTime + g.AUDIBLE, v.vb = m.TOTAL_MRC_VIEWABLE.totalTime + g.TOTAL_MRC_VIEWABLE, v.vq = n.video.wasFullScreen ? 1 : 0, v.vs = this.getVideoQuartileState("adserverVideoStartedPixel", r, o, y, b), v.vt = this.getVideoQuartileState("adserverVideoWatchedTwentyFivePixel", r, o, y, b), v.vu = this.getVideoQuartileState("adserverVideoWatchedFiftyPixel", r, o, y, b), v.vv = this.getVideoQuartileState("adserverVideoWatchedSeventyFivePixel", r, o, y, b), v.vx = this.getVideoQuartileState("adserverVideoWatchedHundredPixel", r, o, y, b), v.vy = m.FULL_IN_VIEW_AUDIBLE.totalTime + g.FULL_IN_VIEW_AUDIBLE, v.vz = m.FULL_IN_VIEW.totalTime + g.FULL_IN_VIEW, v.xa = Math.max(m.FULL_IN_VIEW.maxContinuousTime, g.FULL_IN_VIEW) > 1e3 ? 1 : 0, v.xb = Math.max(m.TOTAL_MRC_VIEWABLE.maxContinuousTime, g.TOTAL_MRC_VIEWABLE), v.xc = n.video.hasSeeked ? 1 : 0;
                    var E = m.HALF_DURATION_80_IN_VIEW_AUDIBLE.totalTime + g.HALF_DURATION_80_IN_VIEW_AUDIBLE,
                        S = w > 0 ? E >= Math.min(15e3, w * .5) : E >= 15e3;
                    v.vr = S ? 1 : 0;
                    var x = this.getPostFromVideoPlayer(e.id),
                        T = document.getElementById(x);
                    if (x && T) {
                        var N = T.getBoundingClientRect();
                        v.vh = this.toLogicalPixels(N.height), v.vw = this.toLogicalPixels(N.width)
                    } else v.vh = 0, v.vw = 0
                }
                return v
            }
            return {}
        },
        getTimeDiff: function(e, t, n) {
            return Object.keys(t).reduce(function(t, r) {
                return t[r] = e - (n[r].timeEntered || e), t
            }, {})
        },
        getVideoQuartileState: function(e, t, n, r, i) {
            var s = 0,
                o = 1,
                u = 2,
                a = 3,
                f = 4,
                l = e === t,
                c = n[e];
            return !c && !l ? s : (r = l ? r : c.vg, i = l ? i : c.ve, !r && !i ? o : r && i ? f : r ? u : a)
        },
        stripAnalyticsParams: function() {
            var e = !!window.history && !!window.history.replaceState,
                t = r.utils.parseQueryString(window.location.search),
                n = r.events.getAnalyticsParams(),
                i = _.keys(n),
                s = _.omit(t, i);
            "st" in n || "sh" in n ? _.extend(s, _.pick(n, "st", "sh")) : r.config.share_tracking_hmac && _.extend(s, r.analytics.getShareParams());
            if (e && !_.isEqual(t, s)) {
                var o = document.createElement("a");
                o.href = window.location.href, o.search = $.param(s), o.search || (o.href = o.href.replace(/\?(#.+)?$/, o.hash)), window.history.replaceState({}, document.title, o.href)
            }
        },
        getShareParams: function() {
            var e = {};
            return e.st = r.config.share_tracking_ts.toString(36), e.sh = r.config.share_tracking_hmac.substring(0, 8), e
        },
        adServingEvent: function(e, t) {
            var n = "ad_serving_events",
                e = "cs." + e;
            r.events.track(n, e, t, {
                contextProperties: ["referrer_domain", "referrer_url", "session_referrer_domain", "adblock", "acceptable_ads", "dnt", "sr_name", "sr_id", "listing_name", "page_type"]
            })
        },
        _thirdPartyPixelEvent: function(e, t) {
            t = t || {};
            if (t.pixel_url) {
                var n = t.pixel_url,
                    r = document.createElement("a");
                r.href = n, t.pixel_domain = r.host, t.interana_excluded = {
                    pixel_url: n
                }, delete t.pixel_url
            }
            return this.adServingEvent(e, t)
        },
        thirdPartyPixelAttemptEvent: function(e) {
            return this._thirdPartyPixelEvent("third_party_impression_pixel_attempt", e)
        },
        thirdPartyPixelFailureEvent: function(e) {
            return this._thirdPartyPixelEvent("third_party_impression_pixel_failure", e)
        },
        thirdPartyPixelSuccessEvent: function(e) {
            return this._thirdPartyPixelEvent("third_party_impression_pixel_success", e)
        },
        adblockEvent: function(e, t) {
            var t = t || {};
            return t.placement_type = e, this.adServingEvent("adblock", t)
        },
        loginRequiredEvent: function(e, t, n, i) {
            var s = "login_events",
                o = "cs.loggedout_" + e,
                u = {};
            u.process_notes = "LOGIN_REQUIRED", t && (u.details_text = t), n && (u.target_type = n), i && (u.target_fullname = i, u.target_id = r.utils.fullnameToId(i)), r.events.track(s, o, u, {
                contextProperties: ["sr_name", "sr_id", "listing_name", "referrer_domain", "referrer_url", "session_referrer_domain"]
            }).send()
        },
        videoUploadEvent: function(e, t, n) {
            e = typeof e == "object" ? e : {}, t = typeof t == "boolean" ? t : !0, n = typeof n == "boolean" ? n : !1;
            var i = "videoupload_events",
                s = "videoupload",
                o = "upload",
                u = "video",
                a = s + "__" + o + "_" + u,
                f = {
                    source: s,
                    verb: o,
                    noun: u,
                    video_duration: e.duration || 0,
                    video_height: e.height || 0,
                    video_width: e.width || 0,
                    video_size: e.size || 0,
                    video_mimetype: e.mimetype || null,
                    video_source: e.source || "file selector",
                    video_to_gif: e.isGif || !1,
                    video_url: e.url || null,
                    file_name: e.fileName || null,
                    upload_duration: e.uploadDuration || 0,
                    original_duration: e.originalDuration || 0,
                    successful: t,
                    is_retry: n
                };
            r.events.track(i, a, f, {
                contextProperties: ["referrer_domain", "referrer_url", "sr_fullname", "sr_id", "sr_name", "user_id", "user_name", "session_id"]
            }).send()
        },
        videoPlayerEvent: function(e, t, n, i, s) {
            var o = "videoplayer_events",
                u = e + "__" + t + "_" + n,
                a = ["videoplayer__click_play", "videoplayer__click_pause", "videoplayer__click_seek", "videoplayer__click_volume", "videoplayer__click_mute", "videoplayer__click_unmute", "videoplayer__click_settings", "videoplayer__click_fullscreen", "videoplayer__click_snoo", "videoplayer__click_replay", "videoplayer__click_1080", "videoplayer__click_720", "videoplayer__click_480", "videoplayer__click_360", "videoplayer__click_240", "videoplayer__click_auto", "videoplayer__scroll_pause", "videoplayer__scroll_autoplay", "pinnedvideoplayer__scroll_activated", "pinnedvideoplayer__click_audio", "pinnedvideoplayer__click_close", "videoplayer__served_video", "videoplayer__change_pagetype"];
            if (a.indexOf(u) === -1) return;
            i = typeof i == "object" ? i : {}, s = typeof s == "object" ? s : {};
            var f = "";
            r.utils.isFullscreen() ? f = "fullsceen" : r && r.events && r.events.contextData && (f = r.events.contextData.page_type);
            var l = {
                source: e,
                verb: t,
                noun: n,
                target_author_id: i.authorFullname ? r.utils.fullnameToId(i.authorFullname) : null,
                target_author_name: i.author || null,
                target_type: i.kind,
                target_created_ts: i.timestamp || null,
                target_fullname: i.fullname || null,
                target_id: i.fullname ? r.utils.fullnameToId(i.fullname) : null,
                target_url_domain: i.domain || null,
                target_url: i.url || null,
                media_id: i.url ? i.url.split(/[\\/]/).pop() : null,
                nsfw: s.isNsfw || !1,
                pinned_player: s.isPinned || !1,
                spoiler: s.isSpoiler || !1,
                vertical: s.isVertical || !1,
                video_duration: s.duration || 0,
                video_time: s.time || 0,
                page_type: f
            };
            if (u === "videoplayer__served_video" || u === "videoplayer__change_pagetype") l.percent_served = s.percentServed || 0, l.max_timestamp_served = s.maxTimestampServed || null, l.video_first_frame = s.firstFrameTime ? s.firstFrameTime : null, l.load_time = s.firstFrameTime ? s.firstFrameTime : performance.now() - s.loadStartTime;
            r.events.track(o, u, l, {
                contextProperties: ["listing_name", "referrer_domain", "referrer_url", "sr_fullname", "sr_id", "sr_name", "user_id", "user_name", "session_id"]
            }).send()
        },
        sendEvent: function(e, t, n, r, i) {
            this.queueEvent(e, t, n, r).send(i)
        },
        queueEvent: function(e, t, n, i) {
            var s = "cs." + t;
            return r.events.track(e, s, i, {
                contextProperties: n
            })
        }
    }, r.analytics.breadcrumbs = {
        selector: ".thing, .side, .sr-list, .srdrop, .tagline, .md, .gadget, a, button, input",
        maxLength: 3,
        sendLength: 2,
        init: function() {
            this.hasSessionStorage = this._checkSessionStorage(), this.data = this._load();
            var e = this.data[0] && this.data[0].url == window.location;
            e || this._storeBreadcrumb(), $(document).delegate("a, button", "click", $.proxy(function(e) {
                this.storeLastClick($(e.target))
            }, this))
        },
        _checkSessionStorage: function() {
            try {
                return sessionStorage.setItem("__test__", "test"), sessionStorage.removeItem("__test__"), !0
            } catch (e) {
                return !1
            }
        },
        _load: function() {
            if (!this.hasSessionStorage) return [{
                stored: !1
            }];
            var e;
            try {
                e = JSON.parse(sessionStorage.breadcrumbs)
            } catch (t) {
                e = []
            }
            return _.isArray(e) || (e = []), e
        },
        store: function() {
            this.hasSessionStorage && (sessionStorage.breadcrumbs = JSON.stringify(this.data))
        },
        _storeBreadcrumb: function() {
            var e = {
                url: location.toString()
            };
            if ("referrer" in document) {
                var t = !document.referrer.match("^" + r.config.currentOrigin),
                    n = this.data[0] && document.referrer != this.data[0].url;
                if (t || n) e.ref = document.referrer
            }
            this.data.unshift(e), this.data = this.data.slice(0, this.maxLength), this.store()
        },
        storeLastClick: function(e) {
            try {
                this.data[0].click = r.utils.querySelectorFromEl(e, this.selector), this.store()
            } catch (t) {}
        },
        lastClickFullname: function() {
            var e = _.find(this.data, function(e) {
                return e.click
            });
            if (e) {
                var t = e.click.match(/.*data-fullname="(\w+)"/);
                return t && t[1]
            }
        },
        toParams: function() {
            params = [];
            for (var e = 0; e < this.sendLength; e++) _.each(this.data[e], function(t, n) {
                params["c" + e + "_" + n] = t
            });
            return params
        }
    }, r.hooks.get("setup").register(function() {
        r.analytics.breadcrumbs.init()
    }), ! function(e) {
        "use strict";

        function t(e) {
            $.ajax({
                method: "POST",
                url: e.url,
                data: e.data,
                contentType: "text/plain",
                complete: e.done,
                headers: e.headers || {}
            })
        }

        function n(e, t) {
            var n = CryptoJS.HmacSHA256(t, e);
            return n.toString(CryptoJS.enc.Hex)
        }

        function r() {
            var t = u.map(function(t) {
                return e.events.track.apply(e.events, t.track), t.done || function() {}
            }.bind(e.analytics));
            e.events.send(function() {
                _.invoke(t, "call")
            }), u = []
        }
        var i = {
                redirect: "timing_redirect",
                start: "timing_start",
                dns: "timing_dns",
                tcp: "timing_tcp",
                https: "timing_https",
                request: "timing_request",
                response: "timing_response",
                domLoading: "timing_dom_loading",
                domInteractive: "timing_dom_interactive",
                domContentLoaded: "timing_dom_content_loaded"
            },
            s = {
                interana_excluded: ["sh", "st"]
            },
            o, u = [];
        e.events = {
            init: function() {
                var i = e.config,
                    s = i.events_collector_url;
                i.events_collector_key && i.events_collector_secret && i.events_collector_url && (o = new EventTracker(i.events_collector_key, i.events_collector_secret, t, s, "reddit.com", i.signature_header, n), this.sampling = {
                    ad_serving_events: Math.random() > i.ad_serving_events_sample_rate
                });
                var u = this.getAnalyticsParams(),
                    a = _.reduce(u, function(e, t, n) {
                        return n === "st" || n === "sh" ? e[n] = t : e["url_parsed_" + n] = t, e
                    }, {});
                this.contextData = this._getContextData(i, a), this.defaultFields = this._getDefaultFields(this.contextData), this.initialized = !0, document.readyState !== "complete" ? window.addEventListener("load", function(t) {
                    e.events._addTimingsContextData()
                }) : e.events._addTimingsContextData(), r()
            },
            _addTimingsContextData: function() {
                if (e.NavigationTimings) {
                    var t = this.contextData,
                        n = new e.NavigationTimings;
                    n.fetch(), n.forEach(function(e) {
                        var n = e.get("key"),
                            r = i[n];
                        if (!r) return;
                        t[r] = e.duration()
                    })
                }
                e.hooks.get("events:timings").call()
            },
            _getContextData: function(t, n) {
                var r = {
                        dnt: window.DO_NOT_TRACK,
                        fingerprint: e.utils.getFingerprint().fp,
                        fingerprint_created_timestamp: e.utils.getFingerprint().timestamp,
                        language: document.getElementsByTagName("html")[0].getAttribute("lang"),
                        link_id: t.cur_link ? e.utils.fullnameToId(t.cur_link) : null,
                        loid: null,
                        loid_created: null,
                        session_id: null,
                        referrer_url: document.referrer || "",
                        referrer_domain: null,
                        session_referrer_domain: null,
                        sr_id: t.cur_site ? e.utils.fullnameToId(t.cur_site) : null,
                        sr_name: t.post_site || null,
                        sr_fullname: t.cur_site || null,
                        user_id: null,
                        user_name: null,
                        user_age: null,
                        user_in_beta: t.pref_beta,
                        enabled_experiments: t.enabled_experiments,
                        whitelist_status: t.whitelist_status,
                        base_url: location.pathname,
                        domain: location.hostname,
                        user_agent: navigator.userAgent,
                        reddaid: e.cookies.get("reddaid") || null
                    },
                    i = e.tracker.getTrackingData();
                return t.user_id ? (r.user_id = t.user_id, r.user_name = t.logged, r.user_age = t.user_age, r.user_subscription_size = t.user_subscription_size) : i && i.loid && (r.loid = i.loid, i.loid_created && (r.loid_created = decodeURIComponent(decodeURIComponent(i.loid_created)))), i && i.session_id && (r.session_id = i.session_id), r.referrer_domain = e.utils.getDomain(document.referrer), r.session_referrer_domain = e.utils.getDomain(e.cookies.get("initref") || ""), $("body").hasClass("comments-page") ? r.page_type = "comments" : $("body").hasClass("listing-page") && (r.page_type = "listing", t.cur_listing && (r.listing_name = t.cur_listing)), t.cur_screen_name && (r.screen_name = t.cur_screen_name), t.expando_preference && (r.expando_preference = t.expando_preference), t.pref_no_profanity && (r.media_preference_hide_nsfw = t.pref_no_profanity), _.extend(r, n), r
            },
            _getDefaultFields: function(e) {
                var t = ["url_parsed_utm_source", "url_parsed_utm_medium", "url_parsed_utm_name", "url_parsed_utm_term", "url_parsed_utm_content", "sh", "st", "session_id", "base_url", "domain", "user_agent", "fingerprint", "fingerprint_created_timestamp", "reddaid"];
                return this.contextData.user_id ? (t.push("user_id"), t.push("user_name")) : (t.push("loid"), t.push("loid_created")), this.contextData.enabled_experiments && t.push("enabled_experiments"), t
            },
            getAnalyticsParams: function() {
                var e = /^(sh|st|ref|ref_.+|utm_.+)$/,
                    t = $.url().param(),
                    n = _.keys(t).filter(function(t) {
                        return e.test(t)
                    }),
                    r = _.pick(t, n);
                return r
            },
            addContextData: function(e, t) {
                e = e || [], t = t || {};
                var n = function(e) {
                    this.contextData[e] != null && (t[e] = this.contextData[e])
                }.bind(this);
                return this.defaultFields.forEach(n), e.forEach(n), t
            },
            structurePayload: function(e) {
                var t = {},
                    n = {};
                return _.keys(s).forEach(function(n) {
                    s[n].forEach(function(r) {
                        e[r] && (t[r] = n)
                    })
                }), _.keys(e).forEach(function(r) {
                    if (r in t) {
                        var i = t[r];
                        n[i] || (n[i] = {}), n[i][r] = e[r]
                    } else n[r] = e[r]
                }), n
            },
            track: function(t, n, r, i) {
                i = i || {};
                var s = {};
                if (!this.initialized) {
                    var a = {};
                    a.track = _.toArray(arguments), u.push(a), s.send = function(e) {
                        return a.done = e, this
                    }.bind(this)
                } else {
                    var f = this.addContextData(i.contextProperties, r),
                        l = this.structurePayload(f);
                    e.commentsPreview && e.commentsPreview.visible && (f.comments_preview_enabled = !0), o && !this.sampling[t] && o.track(t, n, l)
                }
                return $.extend({}, this, s)
            },
            send: function(e) {
                return o ? o.send(e) : typeof e == "function" && e(), this
            }
        }
    }(r), ! function(e) {
        function s(e) {
            this._bootstrapped = !1, this._synced_storage_keys = {};
            if (!this.isSupported) return this;
            var i = sessionStorage.getItem(n);
            i ? (this._bootstrapped = !0, this._synced_storage_keys = JSON.parse(i)) : r && this._sync({
                type: "init"
            }), $(window).on("storage", function(e) {
                if (e.originalEvent.key === t && e.originalEvent.newValue) {
                    var n = JSON.parse(e.originalEvent.newValue);
                    this._handleSync(n)
                }
            }.bind(this))
        }
        var t = "__synced_session_storage__",
            n = "__synced_session_storage_keys__",
            r = !0;
        try {
            sessionStorage.setItem(n, sessionStorage.getItem(n) || "")
        } catch (i) {
            r = !1
        }
        s.prototype = {
            constructor: s,
            isSupported: r,
            getItem: function(e) {
                return e in this._synced_storage_keys ? sessionStorage.getItem(e) : null
            },
            setItem: function(e, t) {
                this._setItem(e, t), this._sync({
                    type: "set",
                    key: e,
                    value: t.toString()
                })
            },
            removeItem: function(e) {
                e in this._synced_storage_keys && (this._removeItem(e), this._sync({
                    type: "remove",
                    key: e
                }))
            },
            _sync: function(e) {
                localStorage.setItem(t, JSON.stringify(e)), localStorage.removeItem(t)
            },
            _handleSync: function(e) {
                e.type === "set" ? this._setItem(e.key, e.value) : e.type === "remove" ? this._removeItem(e.key) : e.type === "init" ? this._sendBootstrapEvent() : e.type === "bootstrap" && this._handleBootstrapEvent(e.payload)
            },
            _sendBootstrapEvent: function() {
                this._bootstrapped || (this._bootstrapped = !0);
                var e = {};
                for (var t in this._synced_storage_keys) e[t] = sessionStorage.getItem(t);
                this._sync({
                    type: "bootstrap",
                    payload: e
                })
            },
            _handleBootstrapEvent: function(e) {
                if (this._bootstrapped) return;
                for (var t in e) this._synced_storage_keys[t] = 1, sessionStorage.setItem(t, e[t]);
                this._bootstrapped = !0
            },
            _removeItem: function(e) {
                sessionStorage.removeItem(e), delete this._synced_storage_keys[e], sessionStorage.setItem(n, JSON.stringify(this._synced_storage_keys))
            },
            _setItem: function(e, t) {
                sessionStorage.setItem(e, t), this._synced_storage_keys[e] = 1, sessionStorage.setItem(n, JSON.stringify(this._synced_storage_keys))
            }
        }, e.syncedSessionStorage = new s
    }(r), ! function(e, t) {
        function u() {
            var e = localStorage.getItem(r),
                t = localStorage.getItem(n);
            e ? e === i ? t ? (localStorage.setItem(r, s), localStorage.removeItem(n)) : localStorage.setItem(r, o) : e === o ? t && (localStorage.setItem(r, s), localStorage.removeItem(n)) : t ? (localStorage.removeItem(n), localStorage.setItem(r, s)) : localStorage.setItem(r, o) : t ? (localStorage.setItem(r, i), localStorage.removeItem(n)) : localStorage.setItem(r, o)
        }
        var n = "RES.localStorageTest",
            r = "plugin.RES.state",
            i = "MAYBE",
            s = "ACTIVE",
            o = "INACTIVE";
        $(function() {
            try {
                u()
            } catch (e) {}
        });
        var a = $.Deferred();
        e.res = {
            init: function() {
                if (this.isEnabled()) a.resolve();
                else if (typeof MutationObserver != "undefined" && Array.prototype.some) {
                    var e = new MutationObserver(function(t) {
                        var n = t.some(function(e) {
                            return e.attributeName === "class"
                        });
                        n && this.isEnabled() && (a.resolve(), e.disconnect()), a.reject()
                    }.bind(this));
                    e.observe(document.documentElement, {
                        attributes: !0
                    }), $(function() {
                        setTimeout(function() {
                            e.disconnect()
                        }, 5e3)
                    })
                }
            },
            isEnabled: function() {
                return this.isV5Enabled() || this.isV4Enabled()
            },
            isV5Enabled: function() {
                if (document.documentElement.classList && document.documentElement.classList.contains("res")) return !0
            },
            isV4Enabled: function() {
                try {
                    var e = localStorage.getItem(r);
                    if (e === s) return !0;
                    if (e === o) return !1
                } catch (t) {}
            },
            awaitIsEnabled: function() {
                return a.promise()
            },
            isNightmodeEnabled: function() {
                return this.isEnabled() && (document.documentElement.classList && document.documentElement.classList.contains("res-nightmode") || !!store.safeGet("RES_nightMode"))
            },
            getVersion: function() {
                var e = $("#RESConsoleVersion").text();
                return e ? (e = e.match(/(\d+)/g), e ? _.map(e, function(e) {
                    return parseInt(e)
                }) : !1) : !1
            }
        }
    }(r), ! function(e, t) {
        var n = "plugin.RES.event";
        e.resEvent = {
            init: function() {
                e.res.awaitIsEnabled().done(this.sendEventOncePerSession.bind(this))
            },
            sendEventOncePerSession: function() {
                if (!e.syncedSessionStorage.isSupported) return;
                try {
                    if (e.syncedSessionStorage.getItem(n)) return;
                    e.resEvent.sendEvent(), e.syncedSessionStorage.setItem(n, !0)
                } catch (t) {
                    e.sendError("Error in res-event.js:", t.toString())
                }
            },
            sendEvent: function() {
                var t = e.res.getVersion() || [],
                    n = {
                        res: new Thrift.RES({
                            night_mode: e.res.isNightmodeEnabled(),
                            version: t.join(".")
                        })
                    };
                e.analyticsV2.sendEvent("res", "create", "session", [], n)
            }
        }
    }(r), ! function(e, t, n) {
        "use strict";
        "function" == typeof define && define.amd ? define(n) : "undefined" != typeof module && module.exports ? module.exports = n() : t.exports ? t.exports = n() : t[e] = n()
    }("Fingerprint2", this, function() {
        "use strict";
        var e = function(t) {
            if (!(this instanceof e)) return new e(t);
            var n = {
                swfContainerId: "fingerprintjs2",
                swfPath: "flash/compiled/FontList.swf",
                detectScreenOrientation: !0,
                sortPluginsFor: [/palemoon/i],
                userDefinedFonts: []
            };
            this.options = this.extend(t, n), this.nativeForEach = Array.prototype.forEach, this.nativeMap = Array.prototype.map
        };
        return e.prototype = {
            extend: function(e, t) {
                if (null == e) return t;
                for (var n in e) null != e[n] && t[n] !== e[n] && (t[n] = e[n]);
                return t
            },
            getSync: function() {
                var e = [];
                e = this.userAgentKey(e), e = this.languageKey(e), e = this.colorDepthKey(e), e = this.pixelRatioKey(e), e = this.hardwareConcurrencyKey(e), e = this.screenResolutionKey(e), e = this.availableScreenResolutionKey(e), e = this.timezoneOffsetKey(e), e = this.sessionStorageKey(e), e = this.localStorageKey(e), e = this.indexedDbKey(e), e = this.addBehaviorKey(e), e = this.openDatabaseKey(e), e = this.cpuClassKey(e), e = this.platformKey(e), e = this.doNotTrackKey(e), e = this.pluginsKey(e), e = this.canvasKey(e), e = this.webglKey(e), e = this.adBlockKey(e), e = this.hasLiedLanguagesKey(e), e = this.hasLiedResolutionKey(e), e = this.hasLiedOsKey(e), e = this.hasLiedBrowserKey(e), e = this.touchSupportKey(e), e = this.customEntropyFunction(e);
                var t = this,
                    n = this.fontsKey(e),
                    r = [];
                t.each(n, function(e) {
                    var t = e.value;
                    "undefined" != typeof e.value.join && (t = e.value.join(";")), r.push(t)
                });
                var i = t.x64hash128(r.join("~~~"), 31);
                return {
                    fprint: i,
                    newKeys: n
                }
            },
            customEntropyFunction: function(e) {
                return "function" == typeof this.options.customFunction && e.push({
                    key: "custom",
                    value: this.options.customFunction()
                }), e
            },
            userAgentKey: function(e) {
                return this.options.excludeUserAgent || e.push({
                    key: "user_agent",
                    value: this.getUserAgent()
                }), e
            },
            getUserAgent: function() {
                return navigator.userAgent
            },
            languageKey: function(e) {
                return this.options.excludeLanguage || e.push({
                    key: "language",
                    value: navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || ""
                }), e
            },
            colorDepthKey: function(e) {
                return this.options.excludeColorDepth || e.push({
                    key: "color_depth",
                    value: screen.colorDepth || -1
                }), e
            },
            pixelRatioKey: function(e) {
                return this.options.excludePixelRatio || e.push({
                    key: "pixel_ratio",
                    value: this.getPixelRatio()
                }), e
            },
            getPixelRatio: function() {
                return window.devicePixelRatio || ""
            },
            screenResolutionKey: function(e) {
                return this.options.excludeScreenResolution ? e : this.getScreenResolution(e)
            },
            getScreenResolution: function(e) {
                var t;
                return t = this.options.detectScreenOrientation && screen.height > screen.width ? [screen.height, screen.width] : [screen.width, screen.height], "undefined" != typeof t && e.push({
                    key: "resolution",
                    value: t
                }), e
            },
            availableScreenResolutionKey: function(e) {
                return this.options.excludeAvailableScreenResolution ? e : this.getAvailableScreenResolution(e)
            },
            getAvailableScreenResolution: function(e) {
                var t;
                return screen.availWidth && screen.availHeight && (t = this.options.detectScreenOrientation ? screen.availHeight > screen.availWidth ? [screen.availHeight, screen.availWidth] : [screen.availWidth, screen.availHeight] : [screen.availHeight, screen.availWidth]), "undefined" != typeof t && e.push({
                    key: "available_resolution",
                    value: t
                }), e
            },
            timezoneOffsetKey: function(e) {
                return this.options.excludeTimezoneOffset || e.push({
                    key: "timezone_offset",
                    value: (new Date).getTimezoneOffset()
                }), e
            },
            sessionStorageKey: function(e) {
                return !this.options.excludeSessionStorage && this.hasSessionStorage() && e.push({
                    key: "session_storage",
                    value: 1
                }), e
            },
            localStorageKey: function(e) {
                return !this.options.excludeSessionStorage && this.hasLocalStorage() && e.push({
                    key: "local_storage",
                    value: 1
                }), e
            },
            indexedDbKey: function(e) {
                return !this.options.excludeIndexedDB && this.hasIndexedDB() && e.push({
                    key: "indexed_db",
                    value: 1
                }), e
            },
            addBehaviorKey: function(e) {
                return document.body && !this.options.excludeAddBehavior && document.body.addBehavior && e.push({
                    key: "add_behavior",
                    value: 1
                }), e
            },
            openDatabaseKey: function(e) {
                return !this.options.excludeOpenDatabase && window.openDatabase && e.push({
                    key: "open_database",
                    value: 1
                }), e
            },
            cpuClassKey: function(e) {
                return this.options.excludeCpuClass || e.push({
                    key: "cpu_class",
                    value: this.getNavigatorCpuClass()
                }), e
            },
            platformKey: function(e) {
                return this.options.excludePlatform || e.push({
                    key: "navigator_platform",
                    value: this.getNavigatorPlatform()
                }), e
            },
            doNotTrackKey: function(e) {
                return this.options.excludeDoNotTrack || e.push({
                    key: "do_not_track",
                    value: this.getDoNotTrack()
                }), e
            },
            canvasKey: function(e) {
                return !this.options.excludeCanvas && this.isCanvasSupported() && e.push({
                    key: "canvas",
                    value: this.getCanvasFp()
                }), e
            },
            webglKey: function(e) {
                return this.options.excludeWebGL ? e : this.isWebGlSupported() ? (e.push({
                    key: "webgl",
                    value: this.getWebglFp()
                }), e) : e
            },
            adBlockKey: function(e) {
                return this.options.excludeAdBlock || e.push({
                    key: "adblock",
                    value: this.getAdBlock()
                }), e
            },
            hasLiedLanguagesKey: function(e) {
                return this.options.excludeHasLiedLanguages || e.push({
                    key: "has_lied_languages",
                    value: this.getHasLiedLanguages()
                }), e
            },
            hasLiedResolutionKey: function(e) {
                return this.options.excludeHasLiedResolution || e.push({
                    key: "has_lied_resolution",
                    value: this.getHasLiedResolution()
                }), e
            },
            hasLiedOsKey: function(e) {
                return this.options.excludeHasLiedOs || e.push({
                    key: "has_lied_os",
                    value: this.getHasLiedOs()
                }), e
            },
            hasLiedBrowserKey: function(e) {
                return this.options.excludeHasLiedBrowser || e.push({
                    key: "has_lied_browser",
                    value: this.getHasLiedBrowser()
                }), e
            },
            fontsKey: function(e) {
                var t = this,
                    n = ["monospace", "sans-serif", "serif"],
                    r = ["Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS", "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style", "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New", "Garamond", "Geneva", "Georgia", "Helvetica", "Helvetica Neue", "Impact", "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO", "Palatino", "Palatino Linotype", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS", "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"],
                    i = ["Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter", "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER", "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville", "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD", "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed", "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara", "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer", "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold", "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark", "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC", "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte", "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER", "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT", "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD", "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV", "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT", "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN", "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island", "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic", "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti", "MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli", "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN", "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB", "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla", "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood", "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket", "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC", "Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold", "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin", "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"];
                t.options.extendedJsFonts && (r = r.concat(i)), r = r.concat(t.options.userDefinedFonts);
                var s = "mmmmmmmmmmlli",
                    o = "72px",
                    u = document.getElementsByTagName("body")[0],
                    a = document.createElement("div"),
                    f = document.createElement("div"),
                    l = {},
                    c = {},
                    h = function() {
                        var e = document.createElement("span");
                        return e.style.position = "absolute", e.style.left = "-9999px", e.style.fontSize = o, e.style.lineHeight = "normal", e.innerHTML = s, e
                    },
                    p = function(e, t) {
                        var n = h();
                        return n.style.fontFamily = "'" + e + "'," + t, n
                    },
                    d = function() {
                        for (var e = [], t = 0, r = n.length; t < r; t++) {
                            var i = h();
                            i.style.fontFamily = n[t], a.appendChild(i), e.push(i)
                        }
                        return e
                    },
                    v = function() {
                        for (var e = {}, t = 0, i = r.length; t < i; t++) {
                            for (var s = [], o = 0, u = n.length; o < u; o++) {
                                var a = p(r[t], n[o]);
                                f.appendChild(a), s.push(a)
                            }
                            e[r[t]] = s
                        }
                        return e
                    },
                    m = function(e) {
                        for (var t = !1, r = 0; r < n.length; r++)
                            if (t = e[r].offsetWidth !== l[n[r]] || e[r].offsetHeight !== c[n[r]]) return t;
                        return t
                    },
                    g = d();
                u.appendChild(a);
                for (var y = 0, b = n.length; y < b; y++) l[n[y]] = g[y].offsetWidth, c[n[y]] = g[y].offsetHeight;
                var w = v();
                u.appendChild(f);
                for (var E = [], S = 0, x = r.length; S < x; S++) m(w[r[S]]) && E.push(r[S]);
                return u.removeChild(f), u.removeChild(a), e.push({
                    key: "js_fonts",
                    value: E
                }), e
            },
            pluginsKey: function(e) {
                return this.options.excludePlugins || (this.isIE() ? this.options.excludeIEPlugins || e.push({
                    key: "ie_plugins",
                    value: this.getIEPlugins()
                }) : e.push({
                    key: "regular_plugins",
                    value: this.getRegularPlugins()
                })), e
            },
            getRegularPlugins: function() {
                for (var e = [], t = 0, n = navigator.plugins.length; t < n; t++) e.push(navigator.plugins[t]);
                return this.pluginsShouldBeSorted() && (e = e.sort(function(e, t) {
                    return e.name > t.name ? 1 : e.name < t.name ? -1 : 0
                })), this.map(e, function(e) {
                    var t = this.map(e, function(e) {
                        return [e.type, e.suffixes].join("~")
                    }).join(",");
                    return [e.name, e.description, t].join("::")
                }, this)
            },
            getIEPlugins: function() {
                var e = [];
                if (Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, "ActiveXObject") || "ActiveXObject" in window) {
                    var t = ["AcroPDF.PDF", "Adodb.Stream", "AgControl.AgControl", "DevalVRXCtrl.DevalVRXCtrl.1", "MacromediaFlashPaper.MacromediaFlashPaper", "Msxml2.DOMDocument", "Msxml2.XMLHTTP", "PDF.PdfCtrl", "QuickTime.QuickTime", "QuickTimeCheckObject.QuickTimeCheck.1", "RealPlayer", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "Scripting.Dictionary", "SWCtl.SWCtl", "Shell.UIHelper", "ShockwaveFlash.ShockwaveFlash", "Skype.Detection", "TDCCtl.TDCCtl", "WMPlayer.OCX", "rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1"];
                    e = this.map(t, function(e) {
                        try {
                            return new ActiveXObject(e), e
                        } catch (t) {
                            return null
                        }
                    })
                }
                return navigator.plugins && (e = e.concat(this.getRegularPlugins())), e
            },
            pluginsShouldBeSorted: function() {
                for (var e = !1, t = 0, n = this.options.sortPluginsFor.length; t < n; t++) {
                    var r = this.options.sortPluginsFor[t];
                    if (navigator.userAgent.match(r)) {
                        e = !0;
                        break
                    }
                }
                return e
            },
            touchSupportKey: function(e) {
                return this.options.excludeTouchSupport || e.push({
                    key: "touch_support",
                    value: this.getTouchSupport()
                }), e
            },
            hardwareConcurrencyKey: function(e) {
                return this.options.excludeHardwareConcurrency || e.push({
                    key: "hardware_concurrency",
                    value: this.getHardwareConcurrency()
                }), e
            },
            hasSessionStorage: function() {
                try {
                    return !!window.sessionStorage
                } catch (e) {
                    return !0
                }
            },
            hasLocalStorage: function() {
                try {
                    return !!window.localStorage
                } catch (e) {
                    return !0
                }
            },
            hasIndexedDB: function() {
                try {
                    return !!window.indexedDB
                } catch (e) {
                    return !0
                }
            },
            getHardwareConcurrency: function() {
                return navigator.hardwareConcurrency ? navigator.hardwareConcurrency : "unknown"
            },
            getNavigatorCpuClass: function() {
                return navigator.cpuClass ? navigator.cpuClass : "unknown"
            },
            getNavigatorPlatform: function() {
                return navigator.platform ? navigator.platform : "unknown"
            },
            getDoNotTrack: function() {
                return navigator.doNotTrack ? navigator.doNotTrack : navigator.msDoNotTrack ? navigator.msDoNotTrack : window.doNotTrack ? window.doNotTrack : "unknown"
            },
            getTouchSupport: function() {
                var e = 0,
                    t = !1;
                "undefined" != typeof navigator.maxTouchPoints ? e = navigator.maxTouchPoints : "undefined" != typeof navigator.msMaxTouchPoints && (e = navigator.msMaxTouchPoints);
                try {
                    document.createEvent("TouchEvent"), t = !0
                } catch (n) {}
                var r = "ontouchstart" in window;
                return [e, t, r]
            },
            getCanvasFp: function() {
                var e = [],
                    t = document.createElement("canvas");
                t.width = 2e3, t.height = 200, t.style.display = "inline";
                var n = t.getContext("2d");
                return n.rect(0, 0, 10, 10), n.rect(2, 2, 6, 6), e.push("canvas winding:" + (n.isPointInPath(5, 5, "evenodd") === !1 ? "yes" : "no")), n.textBaseline = "alphabetic", n.fillStyle = "#f60", n.fillRect(125, 1, 62, 20), n.fillStyle = "#069", this.options.dontUseFakeFontInCanvas ? n.font = "11pt Arial" : n.font = "11pt no-real-font-123", n.fillText("Cwm fjordbank glyphs vext quiz, ðŸ˜ƒ", 2, 15), n.fillStyle = "rgba(102, 204, 0, 0.2)", n.font = "18pt Arial", n.fillText("Cwm fjordbank glyphs vext quiz, ðŸ˜ƒ", 4, 45), n.globalCompositeOperation = "multiply", n.fillStyle = "rgb(255,0,255)", n.beginPath(), n.arc(50, 50, 50, 0, 2 * Math.PI, !0), n.closePath(), n.fill(), n.fillStyle = "rgb(0,255,255)", n.beginPath(), n.arc(100, 50, 50, 0, 2 * Math.PI, !0), n.closePath(), n.fill(), n.fillStyle = "rgb(255,255,0)", n.beginPath(), n.arc(75, 100, 50, 0, 2 * Math.PI, !0), n.closePath(), n.fill(), n.fillStyle = "rgb(255,0,255)", n.arc(75, 75, 75, 0, 2 * Math.PI, !0), n.arc(75, 75, 25, 0, 2 * Math.PI, !0), n.fill("evenodd"), e.push("canvas fp:" + t.toDataURL()), e.join("~")
            },
            getWebglFp: function() {
                var e, t = function(t) {
                        return e.clearColor(0, 0, 0, 1), e.enable(e.DEPTH_TEST), e.depthFunc(e.LEQUAL), e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT), "[" + t[0] + ", " + t[1] + "]"
                    },
                    n = function(e) {
                        var t, n = e.getExtension("EXT_texture_filter_anisotropic") || e.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || e.getExtension("MOZ_EXT_texture_filter_anisotropic");
                        return n ? (t = e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === t && (t = 2), t) : null
                    };
                if (e = this.getWebglCanvas(), !e) return null;
                var r = [],
                    i = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}",
                    s = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}",
                    o = e.createBuffer();
                e.bindBuffer(e.ARRAY_BUFFER, o);
                var u = new Float32Array([-0.2, -0.9, 0, .4, -0.26, 0, 0, .732134444, 0]);
                e.bufferData(e.ARRAY_BUFFER, u, e.STATIC_DRAW), o.itemSize = 3, o.numItems = 3;
                var a = e.createProgram(),
                    f = e.createShader(e.VERTEX_SHADER);
                e.shaderSource(f, i), e.compileShader(f);
                var l = e.createShader(e.FRAGMENT_SHADER);
                e.shaderSource(l, s), e.compileShader(l), e.attachShader(a, f), e.attachShader(a, l), e.linkProgram(a), e.useProgram(a), a.vertexPosAttrib = e.getAttribLocation(a, "attrVertex"), a.offsetUniform = e.getUniformLocation(a, "uniformOffset"), e.enableVertexAttribArray(a.vertexPosArray), e.vertexAttribPointer(a.vertexPosAttrib, o.itemSize, e.FLOAT, !1, 0, 0), e.uniform2f(a.offsetUniform, 1, 1), e.drawArrays(e.TRIANGLE_STRIP, 0, o.numItems), null != e.canvas && r.push(e.canvas.toDataURL()), r.push("extensions:" + e.getSupportedExtensions().join(";")), r.push("webgl aliased line width range:" + t(e.getParameter(e.ALIASED_LINE_WIDTH_RANGE))), r.push("webgl aliased point size range:" + t(e.getParameter(e.ALIASED_POINT_SIZE_RANGE))), r.push("webgl alpha bits:" + e.getParameter(e.ALPHA_BITS)), r.push("webgl antialiasing:" + (e.getContextAttributes().antialias ? "yes" : "no")), r.push("webgl blue bits:" + e.getParameter(e.BLUE_BITS)), r.push("webgl depth bits:" + e.getParameter(e.DEPTH_BITS)), r.push("webgl green bits:" + e.getParameter(e.GREEN_BITS)), r.push("webgl max anisotropy:" + n(e)), r.push("webgl max combined texture image units:" + e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS)), r.push("webgl max cube map texture size:" + e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE)), r.push("webgl max fragment uniform vectors:" + e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS)), r.push("webgl max render buffer size:" + e.getParameter(e.MAX_RENDERBUFFER_SIZE)), r.push("webgl max texture image units:" + e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS)), r.push("webgl max texture size:" + e.getParameter(e.MAX_TEXTURE_SIZE)), r.push("webgl max varying vectors:" + e.getParameter(e.MAX_VARYING_VECTORS)), r.push("webgl max vertex attribs:" + e.getParameter(e.MAX_VERTEX_ATTRIBS)), r.push("webgl max vertex texture image units:" + e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)), r.push("webgl max vertex uniform vectors:" + e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS)), r.push("webgl max viewport dims:" + t(e.getParameter(e.MAX_VIEWPORT_DIMS))), r.push("webgl red bits:" + e.getParameter(e.RED_BITS)), r.push("webgl renderer:" + e.getParameter(e.RENDERER)), r.push("webgl shading language version:" + e.getParameter(e.SHADING_LANGUAGE_VERSION)), r.push("webgl stencil bits:" + e.getParameter(e.STENCIL_BITS)), r.push("webgl vendor:" + e.getParameter(e.VENDOR)), r.push("webgl version:" + e.getParameter(e.VERSION));
                try {
                    var c = e.getExtension("WEBGL_debug_renderer_info");
                    c && (r.push("webgl unmasked vendor:" + e.getParameter(c.UNMASKED_VENDOR_WEBGL)), r.push("webgl unmasked renderer:" + e.getParameter(c.UNMASKED_RENDERER_WEBGL)))
                } catch (h) {}
                return e.getShaderPrecisionFormat ? (r.push("webgl vertex shader high float precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).precision), r.push("webgl vertex shader high float precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).rangeMin), r.push("webgl vertex shader high float precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).rangeMax), r.push("webgl vertex shader medium float precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).precision), r.push("webgl vertex shader medium float precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).rangeMin), r.push("webgl vertex shader medium float precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).rangeMax), r.push("webgl vertex shader low float precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_FLOAT).precision), r.push("webgl vertex shader low float precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_FLOAT).rangeMin), r.push("webgl vertex shader low float precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_FLOAT).rangeMax), r.push("webgl fragment shader high float precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).precision), r.push("webgl fragment shader high float precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).rangeMin), r.push("webgl fragment shader high float precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).rangeMax), r.push("webgl fragment shader medium float precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).precision), r.push("webgl fragment shader medium float precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).rangeMin), r.push("webgl fragment shader medium float precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).rangeMax), r.push("webgl fragment shader low float precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_FLOAT).precision), r.push("webgl fragment shader low float precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_FLOAT).rangeMin), r.push("webgl fragment shader low float precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_FLOAT).rangeMax), r.push("webgl vertex shader high int precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_INT).precision), r.push("webgl vertex shader high int precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_INT).rangeMin), r.push("webgl vertex shader high int precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_INT).rangeMax), r.push("webgl vertex shader medium int precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_INT).precision), r.push("webgl vertex shader medium int precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_INT).rangeMin), r.push("webgl vertex shader medium int precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_INT).rangeMax), r.push("webgl vertex shader low int precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_INT).precision), r.push("webgl vertex shader low int precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_INT).rangeMin), r.push("webgl vertex shader low int precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_INT).rangeMax), r.push("webgl fragment shader high int precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_INT).precision), r.push("webgl fragment shader high int precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_INT).rangeMin), r.push("webgl fragment shader high int precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_INT).rangeMax), r.push("webgl fragment shader medium int precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_INT).precision), r.push("webgl fragment shader medium int precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_INT).rangeMin), r.push("webgl fragment shader medium int precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_INT).rangeMax), r.push("webgl fragment shader low int precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_INT).precision), r.push("webgl fragment shader low int precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_INT).rangeMin), r.push("webgl fragment shader low int precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_INT).rangeMax), r.join("~")) : r.join("~")
            },
            getAdBlock: function() {
                var e = document.createElement("div");
                e.innerHTML = "&nbsp;", e.className = "adsbox";
                var t = !1;
                try {
                    document.body.appendChild(e), t = 0 === document.getElementsByClassName("adsbox")[0].offsetHeight, document.body.removeChild(e)
                } catch (n) {
                    t = !1
                }
                return t
            },
            getHasLiedLanguages: function() {
                if ("undefined" != typeof navigator.languages) try {
                    var e = navigator.languages[0].substr(0, 2);
                    if (e !== navigator.language.substr(0, 2)) return !0
                } catch (t) {
                    return !0
                }
                return !1
            },
            getHasLiedResolution: function() {
                return screen.width < screen.availWidth || screen.height < screen.availHeight
            },
            getHasLiedOs: function() {
                var e, t = navigator.userAgent.toLowerCase(),
                    n = navigator.oscpu,
                    r = navigator.platform.toLowerCase();
                e = t.indexOf("windows phone") >= 0 ? "Windows Phone" : t.indexOf("win") >= 0 ? "Windows" : t.indexOf("android") >= 0 ? "Android" : t.indexOf("linux") >= 0 ? "Linux" : t.indexOf("iphone") >= 0 || t.indexOf("ipad") >= 0 ? "iOS" : t.indexOf("mac") >= 0 ? "Mac" : "Other";
                var i;
                if (i = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0, i && "Windows Phone" !== e && "Android" !== e && "iOS" !== e && "Other" !== e) return !0;
                if ("undefined" != typeof n) {
                    if (n = n.toLowerCase(), n.indexOf("win") >= 0 && "Windows" !== e && "Windows Phone" !== e) return !0;
                    if (n.indexOf("linux") >= 0 && "Linux" !== e && "Android" !== e) return !0;
                    if (n.indexOf("mac") >= 0 && "Mac" !== e && "iOS" !== e) return !0;
                    if (0 === n.indexOf("win") && 0 === n.indexOf("linux") && n.indexOf("mac") >= 0 && "other" !== e) return !0
                }
                return r.indexOf("win") >= 0 && "Windows" !== e && "Windows Phone" !== e || (r.indexOf("linux") >= 0 || r.indexOf("android") >= 0 || r.indexOf("pike") >= 0) && "Linux" !== e && "Android" !== e || (r.indexOf("mac") >= 0 || r.indexOf("ipad") >= 0 || r.indexOf("ipod") >= 0 || r.indexOf("iphone") >= 0) && "Mac" !== e && "iOS" !== e || 0 === r.indexOf("win") && 0 === r.indexOf("linux") && r.indexOf("mac") >= 0 && "other" !== e || "undefined" == typeof navigator.plugins && "Windows" !== e && "Windows Phone" !== e
            },
            getHasLiedBrowser: function() {
                var e, t = navigator.userAgent.toLowerCase(),
                    i = navigator.productSub;
                if (e = t.indexOf("firefox") >= 0 ? "Firefox" : t.indexOf("opera") >= 0 || t.indexOf("opr") >= 0 ? "Opera" : t.indexOf("chrome") >= 0 ? "Chrome" : t.indexOf("safari") >= 0 ? "Safari" : t.indexOf("trident") >= 0 ? "Internet Explorer" : "Other", "Chrome" !== e && "Safari" !== e && "Opera" !== e || "20030107" === i) {
                    var a = eval.toString().length;
                    if (37 === a && "Safari" !== e && "Firefox" !== e && "Other" !== e) return !0;
                    if (39 === a && "Internet Explorer" !== e && "Other" !== e) return !0;
                    if (33 === a && "Chrome" !== e && "Opera" !== e && "Other" !== e) return !0;
                    var r;
                    try {
                        throw "a"
                    } catch (n) {
                        try {
                            n.toSource(), r = !0
                        } catch (o) {
                            r = !1
                        }
                    }
                    return !!r && "Firefox" !== e && "Other" !== e
                }
                return !0
            },
            isCanvasSupported: function() {
                var e = document.createElement("canvas");
                return !!e.getContext && !!e.getContext("2d")
            },
            isWebGlSupported: function() {
                if (!this.isCanvasSupported()) return !1;
                var e, t = document.createElement("canvas");
                try {
                    e = t.getContext && (t.getContext("webgl") || t.getContext("experimental-webgl"))
                } catch (n) {
                    e = !1
                }
                return !!window.WebGLRenderingContext && !!e
            },
            isIE: function() {
                return "Microsoft Internet Explorer" === navigator.appName || "Netscape" === navigator.appName && !!/Trident/.test(navigator.userAgent)
            },
            hasSwfObjectLoaded: function() {
                return "undefined" != typeof window.swfobject
            },
            hasMinFlashInstalled: function() {
                return swfobject.hasFlashPlayerVersion("9.0.0")
            },
            addFlashDivNode: function() {
                var e = document.createElement("div");
                e.setAttribute("id", this.options.swfContainerId), document.body.appendChild(e)
            },
            getWebglCanvas: function() {
                var e = document.createElement("canvas"),
                    t = null;
                try {
                    t = e.getContext("webgl") || e.getContext("experimental-webgl")
                } catch (n) {}
                return t || (t = null), t
            },
            each: function(e, t, n) {
                if (null !== e)
                    if (this.nativeForEach && e.forEach === this.nativeForEach) e.forEach(t, n);
                    else if (e.length === +e.length) {
                    for (var r = 0, i = e.length; r < i; r++)
                        if (t.call(n, e[r], r, e) === {}) return
                } else
                    for (var s in e)
                        if (e.hasOwnProperty(s) && t.call(n, e[s], s, e) === {}) return
            },
            map: function(e, t, n) {
                var r = [];
                return null == e ? r : this.nativeMap && e.map === this.nativeMap ? e.map(t, n) : (this.each(e, function(e, s, o) {
                    r[r.length] = t.call(n, e, s, o)
                }), r)
            },
            x64Add: function(e, t) {
                e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]], t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];
                var n = [0, 0, 0, 0];
                return n[3] += e[3] + t[3], n[2] += n[3] >>> 16, n[3] &= 65535, n[2] += e[2] + t[2], n[1] += n[2] >>> 16, n[2] &= 65535, n[1] += e[1] + t[1], n[0] += n[1] >>> 16, n[1] &= 65535, n[0] += e[0] + t[0], n[0] &= 65535, [n[0] << 16 | n[1], n[2] << 16 | n[3]]
            },
            x64Multiply: function(e, t) {
                e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]], t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];
                var n = [0, 0, 0, 0];
                return n[3] += e[3] * t[3], n[2] += n[3] >>> 16, n[3] &= 65535, n[2] += e[2] * t[3], n[1] += n[2] >>> 16, n[2] &= 65535, n[2] += e[3] * t[2], n[1] += n[2] >>> 16, n[2] &= 65535, n[1] += e[1] * t[3], n[0] += n[1] >>> 16, n[1] &= 65535, n[1] += e[2] * t[2], n[0] += n[1] >>> 16, n[1] &= 65535, n[1] += e[3] * t[1], n[0] += n[1] >>> 16, n[1] &= 65535, n[0] += e[0] * t[3] + e[1] * t[2] + e[2] * t[1] + e[3] * t[0], n[0] &= 65535, [n[0] << 16 | n[1], n[2] << 16 | n[3]]
            },
            x64Rotl: function(e, t) {
                return t %= 64, 32 === t ? [e[1], e[0]] : t < 32 ? [e[0] << t | e[1] >>> 32 - t, e[1] << t | e[0] >>> 32 - t] : (t -= 32, [e[1] << t | e[0] >>> 32 - t, e[0] << t | e[1] >>> 32 - t])
            },
            x64LeftShift: function(e, t) {
                return t %= 64, 0 === t ? e : t < 32 ? [e[0] << t | e[1] >>> 32 - t, e[1] << t] : [e[1] << t - 32, 0]
            },
            x64Xor: function(e, t) {
                return [e[0] ^ t[0], e[1] ^ t[1]]
            },
            x64Fmix: function(e) {
                return e = this.x64Xor(e, [0, e[0] >>> 1]), e = this.x64Multiply(e, [4283543511, 3981806797]), e = this.x64Xor(e, [0, e[0] >>> 1]), e = this.x64Multiply(e, [3301882366, 444984403]), e = this.x64Xor(e, [0, e[0] >>> 1])
            },
            x64hash128: function(e, t) {
                e = e || "", t = t || 0;
                for (var n = e.length % 16, r = e.length - n, i = [0, t], s = [0, t], o = [0, 0], u = [0, 0], a = [2277735313, 289559509], f = [1291169091, 658871167], l = 0; l < r; l += 16) o = [255 & e.charCodeAt(l + 4) | (255 & e.charCodeAt(l + 5)) << 8 | (255 & e.charCodeAt(l + 6)) << 16 | (255 & e.charCodeAt(l + 7)) << 24, 255 & e.charCodeAt(l) | (255 & e.charCodeAt(l + 1)) << 8 | (255 & e.charCodeAt(l + 2)) << 16 | (255 & e.charCodeAt(l + 3)) << 24], u = [255 & e.charCodeAt(l + 12) | (255 & e.charCodeAt(l + 13)) << 8 | (255 & e.charCodeAt(l + 14)) << 16 | (255 & e.charCodeAt(l + 15)) << 24, 255 & e.charCodeAt(l + 8) | (255 & e.charCodeAt(l + 9)) << 8 | (255 & e.charCodeAt(l + 10)) << 16 | (255 & e.charCodeAt(l + 11)) << 24], o = this.x64Multiply(o, a), o = this.x64Rotl(o, 31), o = this.x64Multiply(o, f), i = this.x64Xor(i, o), i = this.x64Rotl(i, 27), i = this.x64Add(i, s), i = this.x64Add(this.x64Multiply(i, [0, 5]), [0, 1390208809]), u = this.x64Multiply(u, f), u = this.x64Rotl(u, 33), u = this.x64Multiply(u, a), s = this.x64Xor(s, u), s = this.x64Rotl(s, 31), s = this.x64Add(s, i), s = this.x64Add(this.x64Multiply(s, [0, 5]), [0, 944331445]);
                switch (o = [0, 0], u = [0, 0], n) {
                    case 15:
                        u = this.x64Xor(u, this.x64LeftShift([0, e.charCodeAt(l + 14)], 48));
                    case 14:
                        u = this.x64Xor(u, this.x64LeftShift([0, e.charCodeAt(l + 13)], 40));
                    case 13:
                        u = this.x64Xor(u, this.x64LeftShift([0, e.charCodeAt(l + 12)], 32));
                    case 12:
                        u = this.x64Xor(u, this.x64LeftShift([0, e.charCodeAt(l + 11)], 24));
                    case 11:
                        u = this.x64Xor(u, this.x64LeftShift([0, e.charCodeAt(l + 10)], 16));
                    case 10:
                        u = this.x64Xor(u, this.x64LeftShift([0, e.charCodeAt(l + 9)], 8));
                    case 9:
                        u = this.x64Xor(u, [0, e.charCodeAt(l + 8)]), u = this.x64Multiply(u, f), u = this.x64Rotl(u, 33), u = this.x64Multiply(u, a), s = this.x64Xor(s, u);
                    case 8:
                        o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(l + 7)], 56));
                    case 7:
                        o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(l + 6)], 48));
                    case 6:
                        o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(l + 5)], 40));
                    case 5:
                        o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(l + 4)], 32));
                    case 4:
                        o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(l + 3)], 24));
                    case 3:
                        o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(l + 2)], 16));
                    case 2:
                        o = this.x64Xor(o, this.x64LeftShift([0, e.charCodeAt(l + 1)], 8));
                    case 1:
                        o = this.x64Xor(o, [0, e.charCodeAt(l)]), o = this.x64Multiply(o, a), o = this.x64Rotl(o, 31), o = this.x64Multiply(o, f), i = this.x64Xor(i, o)
                }
                return i = this.x64Xor(i, [0, e.length]), s = this.x64Xor(s, [0, e.length]), i = this.x64Add(i, s), s = this.x64Add(s, i), i = this.x64Fmix(i), s = this.x64Fmix(s), i = this.x64Add(i, s), s = this.x64Add(s, i), ("00000000" + (i[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (i[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (s[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (s[1] >>> 0).toString(16)).slice(-8)
            }
        }, e.VERSION = "1.5.1", e
    }), ! function(e, t, n) {
        var i = "screenview";
        r.screenviewEvent = {
            EVENT_TYPE: i,
            init: function() {
                r.screenviewEvent.sendEventV2(), r.actions.on("events:" + i, function(e) {
                    r.screenviewEvent.sendEventV2()
                })
            },
            sendEventV2: function() {
                if (r.analyticsV2) {
                    var e = {},
                        n = r.config.pageInfo.type,
                        i = n === "mod_mail",
                        s = (new URL(t.location.href)).searchParams.get("embedded");
                    s && i && (e.app = r.analyticsV2.createStruct.app("web2x"));
                    const o = ["action_info", "comment", "post", "subreddit", "user"];
                    r.analyticsV2.sendEvent("global", "view", "screen", o, e)
                }
            }
        }
    }(r.screenviewEvent = {}, this);
    var runtime = function(e) {
        "use strict";

        function f(e, t, n) {
            return Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }), e[t]
        }

        function l(e, t, n, r) {
            var s = t && t.prototype instanceof g ? t : g,
                o = Object.create(s.prototype),
                u = new O(r || []);
            return i(o, "_invoke", {
                value: C(e, n, u)
            }), o
        }

        function c(e, t, n) {
            try {
                return {
                    type: "normal",
                    arg: e.call(t, n)
                }
            } catch (e) {
                return {
                    type: "throw",
                    arg: e
                }
            }
        }

        function g() {}

        function y() {}

        function b() {}

        function T(e) {
            ["next", "throw", "return"].forEach(function(t) {
                f(e, t, function(e) {
                    return this._invoke(t, e)
                })
            })
        }

        function N(e, t) {
            function n(i, s, o, u) {
                var a = c(e[i], e, s);
                if ("throw" !== a.type) {
                    var f = a.arg,
                        l = f.value;
                    return l && "object" == typeof l && r.call(l, "__await") ? t.resolve(l.__await).then(function(e) {
                        n("next", e, o, u)
                    }, function(e) {
                        n("throw", e, o, u)
                    }) : t.resolve(l).then(function(e) {
                        f.value = e, o(f)
                    }, function(e) {
                        return n("throw", e, o, u)
                    })
                }
                u(a.arg)
            }
            var s;
            i(this, "_invoke", {
                value: function(e, r) {
                    function i() {
                        return new t(function(t, i) {
                            n(e, r, t, i)
                        })
                    }
                    return s = s ? s.then(i, i) : i()
                }
            })
        }

        function C(e, n, r) {
            var i = h;
            return function(s, o) {
                if (i === d) throw new Error("Generator is already running");
                if (i === v) {
                    if ("throw" === s) throw o;
                    return {
                        value: t,
                        done: !0
                    }
                }
                for (r.method = s, r.arg = o;;) {
                    var u = r.delegate;
                    if (u) {
                        var a = k(u, r);
                        if (a) {
                            if (a === m) continue;
                            return a
                        }
                    }
                    if ("next" === r.method) r.sent = r._sent = r.arg;
                    else if ("throw" === r.method) {
                        if (i === h) throw i = v, r.arg;
                        r.dispatchException(r.arg)
                    } else "return" === r.method && r.abrupt("return", r.arg);
                    i = d;
                    var f = c(e, n, r);
                    if ("normal" === f.type) {
                        if (i = r.done ? v : p, f.arg === m) continue;
                        return {
                            value: f.arg,
                            done: r.done
                        }
                    }
                    "throw" === f.type && (i = v, r.method = "throw", r.arg = f.arg)
                }
            }
        }

        function k(e, n) {
            var r = n.method,
                i = e.iterator[r];
            if (i === t) return n.delegate = null, "throw" === r && e.iterator.return && (n.method = "return", n.arg = t, k(e, n), "throw" === n.method) || "return" !== r && (n.method = "throw", n.arg = new TypeError("The iterator does not provide a '" + r + "' method")), m;
            var s = c(i, e.iterator, n.arg);
            if ("throw" === s.type) return n.method = "throw", n.arg = s.arg, n.delegate = null, m;
            var o = s.arg;
            return o ? o.done ? (n[e.resultName] = o.value, n.next = e.nextLoc, "return" !== n.method && (n.method = "next", n.arg = t), n.delegate = null, m) : o : (n.method = "throw", n.arg = new TypeError("iterator result is not an object"), n.delegate = null, m)
        }

        function L(e) {
            var t = {
                tryLoc: e[0]
            };
            1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
        }

        function A(e) {
            var t = e.completion || {};
            t.type = "normal", delete t.arg, e.completion = t
        }

        function O(e) {
            this.tryEntries = [{
                tryLoc: "root"
            }], e.forEach(L, this), this.reset(!0)
        }

        function M(e) {
            if (e || "" === e) {
                var n = e[o];
                if (n) return n.call(e);
                if ("function" == typeof e.next) return e;
                if (!isNaN(e.length)) {
                    var i = -1,
                        s = function u() {
                            for (; ++i < e.length;)
                                if (r.call(e, i)) return u.value = e[i], u.done = !1, u;
                            return u.value = t, u.done = !0, u
                        };
                    return s.next = s
                }
            }
            throw new TypeError(typeof e + " is not iterable")
        }
        var t, n = Object.prototype,
            r = n.hasOwnProperty,
            i = Object.defineProperty || function(e, t, n) {
                e[t] = n.value
            },
            s = "function" == typeof Symbol ? Symbol : {},
            o = s.iterator || "@@iterator",
            u = s.asyncIterator || "@@asyncIterator",
            a = s.toStringTag || "@@toStringTag";
        try {
            f({}, "")
        } catch (e) {
            f = function(e, t, n) {
                return e[t] = n
            }
        }
        e.wrap = l;
        var h = "suspendedStart",
            p = "suspendedYield",
            d = "executing",
            v = "completed",
            m = {},
            w = {};
        f(w, o, function() {
            return this
        });
        var E = Object.getPrototypeOf,
            S = E && E(E(M([])));
        S && S !== n && r.call(S, o) && (w = S);
        var x = b.prototype = g.prototype = Object.create(w);
        return y.prototype = b, i(x, "constructor", {
            value: b,
            configurable: !0
        }), i(b, "constructor", {
            value: y,
            configurable: !0
        }), y.displayName = f(b, a, "GeneratorFunction"), e.isGeneratorFunction = function(e) {
            var t = "function" == typeof e && e.constructor;
            return !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
        }, e.mark = function(e) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(e, b) : (e.__proto__ = b, f(e, a, "GeneratorFunction")), e.prototype = Object.create(x), e
        }, e.awrap = function(e) {
            return {
                __await: e
            }
        }, T(N.prototype), f(N.prototype, u, function() {
            return this
        }), e.AsyncIterator = N, e.async = function(t, n, r, i, s) {
            void 0 === s && (s = Promise);
            var o = new N(l(t, n, r, i), s);
            return e.isGeneratorFunction(n) ? o : o.next().then(function(e) {
                return e.done ? e.value : o.next()
            })
        }, T(x), f(x, a, "Generator"), f(x, o, function() {
            return this
        }), f(x, "toString", function() {
            return "[object Generator]"
        }), e.keys = function(e) {
            var t = Object(e),
                n = [];
            for (var r in t) n.push(r);
            return n.reverse(),
                function i() {
                    for (; n.length;) {
                        var e = n.pop();
                        if (e in t) return i.value = e, i.done = !1, i
                    }
                    return i.done = !0, i
                }
        }, e.values = M, O.prototype = {
            constructor: O,
            reset: function(e) {
                if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(A), !e)
                    for (var n in this) "t" === n.charAt(0) && r.call(this, n) && !isNaN(+n.slice(1)) && (this[n] = t)
            },
            stop: function() {
                this.done = !0;
                var e = this.tryEntries[0].completion;
                if ("throw" === e.type) throw e.arg;
                return this.rval
            },
            dispatchException: function(e) {
                function i(r, i) {
                    return u.type = "throw", u.arg = e, n.next = r, i && (n.method = "next", n.arg = t), !!i
                }
                if (this.done) throw e;
                var n = this;
                for (var s = this.tryEntries.length - 1; s >= 0; --s) {
                    var o = this.tryEntries[s],
                        u = o.completion;
                    if ("root" === o.tryLoc) return i("end");
                    if (o.tryLoc <= this.prev) {
                        var a = r.call(o, "catchLoc"),
                            f = r.call(o, "finallyLoc");
                        if (a && f) {
                            if (this.prev < o.catchLoc) return i(o.catchLoc, !0);
                            if (this.prev < o.finallyLoc) return i(o.finallyLoc)
                        } else if (a) {
                            if (this.prev < o.catchLoc) return i(o.catchLoc, !0)
                        } else {
                            if (!f) throw new Error("try statement without catch or finally");
                            if (this.prev < o.finallyLoc) return i(o.finallyLoc)
                        }
                    }
                }
            },
            abrupt: function(e, t) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var i = this.tryEntries[n];
                    if (i.tryLoc <= this.prev && r.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
                        var s = i;
                        break
                    }
                }
                s && ("break" === e || "continue" === e) && s.tryLoc <= t && t <= s.finallyLoc && (s = null);
                var o = s ? s.completion : {};
                return o.type = e, o.arg = t, s ? (this.method = "next", this.next = s.finallyLoc, m) : this.complete(o)
            },
            complete: function(e, t) {
                if ("throw" === e.type) throw e.arg;
                return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), m
            },
            finish: function(e) {
                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                    var n = this.tryEntries[t];
                    if (n.finallyLoc === e) return this.complete(n.completion, n.afterLoc), A(n), m
                }
            },
            "catch": function(e) {
                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                    var n = this.tryEntries[t];
                    if (n.tryLoc === e) {
                        var r = n.completion;
                        if ("throw" === r.type) {
                            var i = r.arg;
                            A(n)
                        }
                        return i
                    }
                }
                throw new Error("illegal catch attempt")
            },
            delegateYield: function(e, n, r) {
                return this.delegate = {
                    iterator: M(e),
                    resultName: n,
                    nextLoc: r
                }, "next" === this.method && (this.arg = t), m
            }
        }, e
    }("object" == typeof module ? module.exports : {});
    try {
        regeneratorRuntime = runtime
    } catch (t) {
        "object" == typeof globalThis ? globalThis.regeneratorRuntime = runtime : Function("r", "regeneratorRuntime = r")(runtime)
    }

    function _asyncToGenerator(e) {
        return function() {
            var t = e.apply(this, arguments);
            return new Promise(function(e, n) {
                function r(i, s) {
                    try {
                        var o = t[i](s),
                            u = o.value
                    } catch (a) {
                        n(a);
                        return
                    }
                    if (!o.done) return Promise.resolve(u).then(function(e) {
                        r("next", e)
                    }, function(e) {
                        r("throw", e)
                    });
                    e(u)
                }
                return r("next")
            })
        }
    }
    r.pageVisitAdblock = {
            init: function() {
                if (!r.config.feature_adblock_v2_events_enabled) return;
                this.sendEventV2(), r.actions.on("events:screenview", function() {
                    this.sendEventV2()
                })
            },
            sendEventV2: function() {
                if (!r.analyticsV2) return;
                const e = {},
                    t = r.config.pageInfo.type,
                    n = t === "mod_mail",
                    i = (new URL(window.location.href)).searchParams.get("embedded");
                i && n && (e.app = r.analyticsV2.createStruct.app("web2x")), r.detection.getAdblockStatus().then(function(t) {
                    e.adblock = new Thrift.Adblock({
                        enabled: t.isAdblockEnabled,
                        acceptable_ads: t.isAcceptableAdsEnabled
                    }), r.analyticsV2.sendEvent("page", "visit", "adblock", ["geo", "action_info"], e)
                })
            }
        }, "use strict", r.detection = function() {
            function v(e) {
                function n(e) {
                    if (["BODY", "HTML"].includes(e.tagName)) return !1;
                    if (e.hidden || !document.body.contains(e)) return !0;
                    var t = window.getComputedStyle(e);
                    return t.display === "none" || t.visibility === "hidden" ? !0 : e.parentElement ? n(e.parentElement) : !1
                }
                if (!document.body.contains(e)) {
                    document.body.prepend(e);
                    var t = n(e);
                    return e.remove(), t
                }
                return n(e)
            }

            function m(e) {
                var t = new URLSearchParams(window.location.search);
                if (t.get(c) !== "enabled") return;
                console.debug("[adblock-detection] ", e)
            }

            function g() {
                var e = new URLSearchParams(window.location.search),
                    t = e.get(o);
                if (t) {
                    var n = new URL(t);
                    return n.pathname = u, n.toString()
                }
                return "" + s + u
            }

            function y() {
                var e = document.createElement("div");
                return e.style.width = "1px", e.style.position = "absolute", e.style.top = "0", e.style.left = "-1000px", e.style.display = "block", e
            }

            function S() {
                var e = y();
                return e.className = f, e
            }

            function x() {
                var e = y();
                return e.id = d, e.classList.add(l), e
            }

            function T() {
                var e = y();
                return e.id = p, e.classList.add("promoted"), e.dataset.beforeContent = "advertisement", e
            }
            var e = function() {
                    var e = _asyncToGenerator(regeneratorRuntime.mark(function t(e) {
                        return regeneratorRuntime.wrap(function(n) {
                            for (;;) switch (n.prev = n.next) {
                                case 0:
                                    return n.abrupt("return", new Promise(function(t) {
                                        var n = new Image;
                                        n.onerror = function() {
                                            t(!0)
                                        }, n.onload = function() {
                                            t(!1)
                                        }, n.src = e
                                    }));
                                case 1:
                                case "end":
                                    return n.stop()
                            }
                        }, t, this)
                    }));
                    return function(n) {
                        return e.apply(this, arguments)
                    }
                }(),
                t = function() {
                    var e = _asyncToGenerator(regeneratorRuntime.mark(function t() {
                        return regeneratorRuntime.wrap(function(t) {
                            for (;;) switch (t.prev = t.next) {
                                case 0:
                                    return t.next = 2, r();
                                case 2:
                                    return t.abrupt("return", b);
                                case 3:
                                case "end":
                                    return t.stop()
                            }
                        }, t, this)
                    }));
                    return function() {
                        return e.apply(this, arguments)
                    }
                }(),
                n = function() {
                    var e = _asyncToGenerator(regeneratorRuntime.mark(function t() {
                        return regeneratorRuntime.wrap(function(t) {
                            for (;;) switch (t.prev = t.next) {
                                case 0:
                                    if (!!w || !E) {
                                        t.next = 3;
                                        break
                                    }
                                    return t.next = 3, new Promise(function(e) {
                                        window.addEventListener(h, e, {
                                            once: !0
                                        })
                                    });
                                case 3:
                                case "end":
                                    return t.stop()
                            }
                        }, t, this)
                    }));
                    return function() {
                        return e.apply(this, arguments)
                    }
                }(),
                r = function() {
                    var e = _asyncToGenerator(regeneratorRuntime.mark(function t() {
                        return regeneratorRuntime.wrap(function(t) {
                            for (;;) switch (t.prev = t.next) {
                                case 0:
                                    if (!w) {
                                        t.next = 2;
                                        break
                                    }
                                    return t.abrupt("return");
                                case 2:
                                    if (!E) {
                                        t.next = 6;
                                        break
                                    }
                                    return t.next = 5, n();
                                case 5:
                                    return t.abrupt("return");
                                case 6:
                                    return E = !0, t.next = 9, i();
                                case 9:
                                    b = t.sent, E = !1, w = !0, window.dispatchEvent(new Event(h));
                                case 13:
                                case "end":
                                    return t.stop()
                            }
                        }, t, this)
                    }));
                    return function() {
                        return e.apply(this, arguments)
                    }
                }(),
                i = function() {
                    var t = _asyncToGenerator(regeneratorRuntime.mark(function n() {
                        var t = this,
                            r, i, s, o, u, f, l, c, h, p, d, y;
                        return regeneratorRuntime.wrap(function(b) {
                            for (;;) switch (b.prev = b.next) {
                                case 0:
                                    r = performance.now(), i = function() {
                                        var t = performance.now();
                                        m("The detection logic ran in " + (t - r).toFixed(3) + "ms")
                                    }, s = x(), o = v(s), m(o ? "âŒ Eyeo bait element was blocked" : "âœ… Eyeo bait element was not blocked"), u = function() {
                                        var n = _asyncToGenerator(regeneratorRuntime.mark(function r() {
                                            var n;
                                            return regeneratorRuntime.wrap(function(r) {
                                                for (;;) switch (r.prev = r.next) {
                                                    case 0:
                                                        return r.next = 2, e(a);
                                                    case 2:
                                                        return n = r.sent, m(n ? "âŒ Eyeo bait asset was blocked" : "âœ… Eyeo bait asset was not blocked"), r.abrupt("return", n);
                                                    case 5:
                                                    case "end":
                                                        return r.stop()
                                                }
                                            }, r, t)
                                        }));
                                        return function() {
                                            return n.apply(this, arguments)
                                        }
                                    }(), b.t0 = o;
                                    if (b.t0) {
                                        b.next = 11;
                                        break
                                    }
                                    return b.next = 10, u();
                                case 10:
                                    b.t0 = b.sent;
                                case 11:
                                    f = b.t0;
                                    if (!f) {
                                        b.next = 19;
                                        break
                                    }
                                    return l = v(S()), m(l ? "âŒ Eyeo acceptable ads element was blocked" : "âœ… Eyeo acceptable ads element was not blocked"), i(), c = {
                                        isAdblockEnabled: !0,
                                        isAcceptableAdsEnabled: !l
                                    }, m("â„¹ï¸ Final result: " + JSON.stringify(c)), b.abrupt("return", c);
                                case 19:
                                    h = v(T()), m(h ? "âŒ Easylist bait element was blocked" : "âœ… Easylist bait element was not blocked"), p = function() {
                                        var n = _asyncToGenerator(regeneratorRuntime.mark(function r() {
                                            var n;
                                            return regeneratorRuntime.wrap(function(r) {
                                                for (;;) switch (r.prev = r.next) {
                                                    case 0:
                                                        return r.next = 2, e(g());
                                                    case 2:
                                                        return n = r.sent, m(n ? "âŒ Easylist bait asset was blocked" : "âœ… Easylist bait asset was not blocked"), r.abrupt("return", n);
                                                    case 5:
                                                    case "end":
                                                        return r.stop()
                                                }
                                            }, r, t)
                                        }));
                                        return function() {
                                            return n.apply(this, arguments)
                                        }
                                    }(), b.t1 = h;
                                    if (b.t1) {
                                        b.next = 27;
                                        break
                                    }
                                    return b.next = 26, p();
                                case 26:
                                    b.t1 = b.sent;
                                case 27:
                                    return d = b.t1, i(), y = {
                                        isAdblockEnabled: d,
                                        isAcceptableAdsEnabled: d ? !1 : undefined
                                    }, m("â„¹ï¸ Final result: " + JSON.stringify(y)), b.abrupt("return", y);
                                case 32:
                                case "end":
                                    return b.stop()
                            }
                        }, n, this)
                    }));
                    return function() {
                        return t.apply(this, arguments)
                    }
                }(),
                s = "https://www.redditstatic.com/shreddit",
                o = "adblock_bait_asset_domain",
                u = "/assets/pix/ads/1.png",
                a = "https://ad-delivery.net/px.gif?ch=2",
                f = "promotedlink",
                l = "jag8CityBio212023",
                c = "adblock_detection_debug_mode",
                h = "adblock_detection_complete",
                p = "adblock-element",
                d = "adblock-eyeo-element",
                b = void 0,
                w = !1,
                E = !1;
            return window.addEventListener("DOMContentLoaded", function() {
                r()
            }), {
                getAdblockStatus: t
            }
        }(),
        function() {
            r.aboutThisAd = {
                targetingCriteriaLabels: {
                    RUN_OF_SITE: "RUN_OF_SITE",
                    BEHAVIORAL_KEYWORD: "BEHAVIORAL_KEYWORD",
                    CONTEXTUAL_KEYWORD: "CONTEXTUAL_KEYWORD",
                    TAKEOVER: "TAKEOVER",
                    LOOKALIKE_AUDIENCE: "LOOKALIKE_AUDIENCE",
                    THIRD_PARTY_AUDIENCE: "THIRD_PARTY_AUDIENCE",
                    CUSTOM_AUDIENCE: "CUSTOM_AUDIENCE",
                    PIXEL_RETARGETING: "PIXEL_RETARGETING",
                    ENGAGEMENT_RETARGETING: "ENGAGEMENT_RETARGETING",
                    DEVICE: "DEVICE",
                    MOBILE_CARRIER: "MOBILE_CARRIER",
                    CONTEXTUAL_DYNAMIC_PRODUCT: "CONTEXTUAL_DYNAMIC_PRODUCT",
                    BEHAVIORAL_DYNAMIC_PRODUCT: "BEHAVIORAL_DYNAMIC_PRODUCT",
                    DYNAMIC_PRODUCT_RETARGETING: "DYNAMIC_PRODUCT_RETARGETING"
                },
                targetingStrings: {
                    communityOrInterests: "People interested in topics you may have engaged with on Reddit, including:",
                    behavioralKeyword: "People who have interacted with content related to the advertiser's business or industry.",
                    locationTargeting: "People based on their location, including:",
                    lookalikeAudience: "People similar to those who have interacted with their brand.",
                    thirdPartyAudience: "A specific audience based on data provided by our partners.",
                    pixelRetargeting: "People who have interacted with their website.",
                    engagementRetargeting: "People who have interacted with their brand on Reddit.",
                    deviceTargeting: "People who use devices similar to yours.",
                    dynamicProductAds: "People with interests like those inferred from your activity.",
                    runOfSite: "All Reddit users.",
                    keywordContextual: "Near content on Reddit related to their business or industry.",
                    takeovers: "In a specific ad placement on Reddit.",
                    customAudience: "You may be part of an audience provided by "
                },
                accountGenderCategory: {
                    FEMALE: 0,
                    MALE: 1
                },
                init: function() {
                    this.popup = new r.ui.Popup({
                        size: "xlarge",
                        content: $("#about-this-ad-popup").html(),
                        className: "about-this-ad-modal"
                    })
                },
                bindClick: function() {
                    $(document).delegate(".about-this-ad-button", "click", this.handleClick.bind(this)), $(document).delegate(".promoted-comments-btn", "click", this.commentsClick.bind(this))
                },
                getRootAdNodeFromEvent: function(e) {
                    const t = e.target.closest(".promotedlink");
                    if (t) return t;
                    const n = e.target.closest(".sb-unit"),
                        r = n && n.querySelector(".promotedlink");
                    return r ? r : null
                },
                commentsClick: function(e) {
                    const t = this.getRootAdNodeFromEvent(e);
                    if (!t) return;
                    const n = t.dataset.adserverImpressionId,
                        r = t.dataset.adUserTargeting,
                        i = t.dataset.adBusiness,
                        s = "dsa_" + n,
                        o = JSON.stringify({
                            targeting: r,
                            business: i
                        });
                    localStorage.setItem(s, o)
                },
                handleClick: function(e) {
                    this.init(), $(".about-this-ad-modal").remove();
                    const t = this.getRootAdNodeFromEvent(e.originalEvent),
                        n = this.getModalData(t),
                        i = n.targetingData,
                        s = n.businessName;
                    this.createPopup(i, s), this.popup.show();
                    if (!s) {
                        const o = function(e) {
                                t.dataset.adBusiness = e, this.createPopup(i, e)
                            }.bind(this),
                            u = t.dataset.fullname;
                        r.ajax({
                            type: "GET",
                            url: "/api/post-profile-name?id=" + u
                        }).then(function(e) {
                            o(e)
                        })
                    }
                },
                findEl: function(e) {
                    return this.popup.$.find(e)
                },
                getDataFromStorage: function() {
                    const e = {
                            targeting: null,
                            business: null
                        },
                        t = new URLSearchParams(window.location.search),
                        n = t.get("impressionId");
                    if (n === null) return e;
                    const r = "dsa_" + n,
                        i = localStorage.getItem(r);
                    if (!i) return e;
                    const s = JSON.parse(localStorage.getItem(r));
                    return localStorage.removeItem(r), {
                        targetingData: s.targeting,
                        businessName: s.business
                    }
                },
                getModalData: function(e) {
                    var t = null,
                        n = null;
                    e.dataset.adUserTargeting && (t = e.dataset.adUserTargeting), e.dataset.adBusiness && (n = e.dataset.adBusiness);
                    const r = this.getDataFromStorage();
                    return !t && r.targetingData && (t = r.targetingData), !n && r.businessName && (n = r.businessName), !e.dataset.adUserTargeting && t && (e.dataset.adUserTargeting = t), !e.dataset.adBusiness && n && (e.dataset.adBusiness = n), {
                        targetingData: t ? JSON.parse(t) : null,
                        businessName: n
                    }
                },
                createPopup: function(e, t) {
                    const n = this.createTemplate(t, e),
                        r = this.findEl(".about-this-ad-body");
                    r.html(n)
                },
                getFormattedInterests: function(e) {
                    var t = "";
                    return e.forEach(function(n, r) {
                        t += n, r !== e.length - 1 && (t += ", ")
                    }), t
                },
                getGenderString: function(e) {
                    return e == this.accountGenderCategory.FEMALE ? "Women." : e == this.accountGenderCategory.MALE ? "Men." : ""
                },
                createTemplate: function(e, t) {
                    var n = "";
                    e && (n += _.template("<div class=\"spacer-bottom\"><div class='modal-h1'><b>Advertiser Business Name</b></div><div><%= businessName %></div></div>")({
                        businessName: e
                    }));
                    if (t && Object.keys(t).length > 0) {
                        n += '<div class="spacer-bottom">', e && (n += _.template("<div class='modal-h1'><%= businessWantsToReach %></div>")({
                            businessWantsToReach: e + " wants to reach"
                        }));
                        const r = function(e) {
                                return e != "" ? "<li>" + e + "</li>" : e
                            },
                            i = t.interests && t.interests.length > 0,
                            s = function(e) {
                                return e && t.targeting_criteria && t.targeting_criteria.indexOf(e) > -1
                            },
                            o = {
                                communityOrInterests: i ? this.targetingStrings.communityOrInterests : "",
                                interests: i ? this.getFormattedInterests(t.interests) : "",
                                behavioralKeyword: s(this.targetingCriteriaLabels.BEHAVIORAL_KEYWORD) ? this.targetingStrings.behavioralKeyword : "",
                                gender: this.getGenderString(t.gender),
                                locationTargeting: t.locations ? this.targetingStrings.locationTargeting : "",
                                location: t.locations ? t.locations : "",
                                lookalikeAudience: s(this.targetingCriteriaLabels.LOOKALIKE_AUDIENCE) ? this.targetingStrings.lookalikeAudience : "",
                                thirdPartyAudience: s(this.targetingCriteriaLabels.THIRD_PARTY_AUDIENCE) ? this.targetingStrings.thirdPartyAudience : "",
                                pixelRetargeting: s(this.targetingCriteriaLabels.PIXEL_RETARGETING) ? this.targetingStrings.pixelRetargeting : "",
                                engagementRetargeting: s(this.targetingCriteriaLabels.ENGAGEMENT_RETARGETING) ? this.targetingStrings.engagementRetargeting : "",
                                deviceTargeting: s(this.targetingCriteriaLabels.DEVICE) || s(this.targetingCriteriaLabels.MOBILE_CARRIER) ? this.targetingStrings.deviceTargeting : "",
                                dynamicProductAds: s(this.targetingCriteriaLabels.DYNAMIC_PRODUCT_RETARGETING) ? this.targetingStrings.dynamicProductAds : "",
                                runOfSite: s(this.targetingCriteriaLabels.RUN_OF_SITE) ? this.targetingStrings.runOfSite : "",
                                customAudience: s(this.targetingCriteriaLabels.CUSTOM_AUDIENCE) ? this.targetingStrings.customAudience : ""
                            };
                        Object.keys(o).forEach(function(e) {
                            o[e] = r(o[e])
                        });
                        const u = _.template("<ul><%= communityOrInterests %><li style='list-style:none'><ul><%= interests %></ul></li><%= behavioralKeyword %><%= gender %><%= locationTargeting %><li style='list-style:none'><ul><%= location %></ul></li><%= lookalikeAudience %><%= thirdPartyAudience %><%= pixelRetargeting %><%= engagementRetargeting %><%= deviceTargeting %><%= dynamicProductAds %><%= runOfSite %></ul>")(o);
                        n += u, n += "</div>";
                        const a = {
                                keywordContextual: s(this.targetingCriteriaLabels.CONTEXTUAL_DYNAMIC_PRODUCT) || s(this.targetingCriteriaLabels.CONTEXTUAL_KEYWORD) ? this.targetingStrings.keywordContextual : "",
                                takeovers: s(this.targetingCriteriaLabels.TAKEOVER) ? this.targetingStrings.takeovers : ""
                            },
                            f = a.keywordContextual != "" || a.takeovers != "";
                        if (f) {
                            n += '<div class="spacer-bottom">', e && (businessPlacementHTML = _.template("<div class='modal-h1'><%= businessWantsToPlace%></div>")({
                                businessWantsToPlace: e + " wants to place their ad:"
                            }), n += businessPlacementHTML), Object.keys(a).forEach(function(e) {
                                a[e] = r(a[e])
                            });
                            var l = _.template("<ul><%= keywordContextual %><%= takeovers %></ul>")(a);
                            n += l
                        }
                        customAudienceString = s(this.targetingCriteriaLabels.CUSTOM_AUDIENCE) ? this.targetingStrings.customAudience + e + "." : "", n += customAudienceString, n += "</div>"
                    }
                    return n
                }
            }, $(function() {
                r.config && r.aboutThisAd.bindClick()
            })
        }(), ! function(e) {
            e.access = {};
            var t = !1,
                n = [];
            _.extend(e.access, {
                init: function() {
                    t = !0, n.forEach(function(e) {
                        e()
                    }), n.length = 0
                },
                isLinkRestricted: function(e) {
                    return !1
                },
                initHook: function(e) {
                    t ? e() : n.push(e)
                }
            })
        }(r), ! function(e) {
            e.hooks.get("reddit-init").register(function() {
                try {
                    e.events.init(), e.analytics.init(), e.hooks.get("events:timings").register(function() {
                        e.screenviewEvent.init(), e.pageVisitAdblock.init()
                    }), e.idEvent && e.idEvent.init(), e.res && (e.res.init(), e.resEvent && e.resEvent.init()), e.access.init(), e.initCookieMonitor && e.initCookieMonitor()
                } catch (t) {
                    e.sendError("Error during reddit-init.js init", t.toString())
                }
            }), $(function() {
                e.hooks.get("reddit-init").call()
            })
        }(r),
        function(e) {
            function n(e) {
                return t[e] ? !1 : (t[e] = !0, !0)
            }

            function i(e) {
                delete t[e]
            }

            function s(t) {
                return function(t) {
                    if (t.jquery) {
                        var n = {};
                        n[0] = jQuery, e.map(t.jquery, function(t) {
                            var r = t[0],
                                i = t[1],
                                s = t[2],
                                o = t[3];
                            if (typeof o == "string") o = e.unsafe(o);
                            else
                                for (var u = 0; o.length && u < o.length; u++) o[u] = e.unsafe(o[u]);
                            s == "call" ? n[i] = n[r].apply(n[r]._obj, o) : s == "attr" ? (o == "redirect" && e(window).off("beforeunload"), n[i] = n[r][o], n[i] ? n[i]._obj = n[r] : e.debug("unrecognized")) : s == "refresh" ? e.refresh() : e.debug("unrecognized")
                        })
                    }
                }
            }
            e.ajaxSetup({
                    beforeSend: function(e, t) {
                        if (window.r && r.config && r.config.embedded) {
                            var n = t.url.indexOf("://") === -1 || t.url.indexOf(r.config.currentOrigin) === 0;
                            n && (t.url = r.utils.replaceUrlParams(t.url, {
                                embedded: r.config.embedded
                            }))
                        }
                    }
                }), e.log = function(e) {
                    window.console ? window.console.debug ? window.console.debug(e) : window.console.log && window.console.log(e) : alert(e)
                }, e.debug = function(t) {
                    if (e.with_default(r.config.debug, !1)) return e.log(t)
                }, e.fn.debug = function() {
                    return e.debug(e(this)), e(this)
                }, e.redirect = function(e) {
                    if (r) return r.utils.navigateTo(e);
                    window.location = e
                }, e.fn.redirect = function(t) {
                    e(this).filter("form").find(".status").show().html("redirecting...");
                    var n = e(this).attr("target");
                    if (n == "_top") {
                        var r = window;
                        while (r != r.parent) r = r.parent;
                        r.location = t
                    } else e.redirect(t);
                    return e(this)
                }, e.refresh = function() {
                    window.location.reload(!0)
                }, e.defined = function(e) {
                    return typeof e != "undefined"
                }, e.with_default = function(t, n) {
                    return e.defined(t) ? t : n
                }, e.websafe = function(e) {
                    return typeof e == "string" && (e = e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/>/g, "&gt;").replace(/</g, "&lt;")), e || ""
                }, e.unsafe = function(e) {
                    return typeof e == "string" && (e = e.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&")), e || ""
                }, e.uniq = function(e, t) {
                    var n = [],
                        r = {},
                        i = t ? t : e.length;
                    for (var s = 0; s < e.length && n.length < i; s++) r[e[s]] || (r[e[s]] = !0, n.push(e[s]));
                    return n
                },
                function(t, n) {
                    e.fn.show = function(n, r) {
                        return e(this).trigger("onshow"), t.call(this, n, r)
                    }, e.fn.hide = function(t, r) {
                        return e(this).trigger("onhide"), n.call(this, t, r)
                    }
                }(e.fn.show, e.fn.hide);
            var t = {};
            e.handleResponse = s;
            var o = "/api/";
            e.request = function(t, u, a, f, l, c, h) {
                var p = t,
                    d = a;
                if (rate_limit(t)) {
                    h && h("ratelimit");
                    return
                }
                if (window != window.top && !r.config.external_frame) return;
                var v = !e.with_default(f, !1) || n(p);
                u = e.with_default(u, {}), a = e.with_default(a, s(p)), l = e.with_default(l, "json");
                var m = e("form.warn-on-unload");
                typeof a != "function" && (a = s(p));
                var d = function(t) {
                    return i(p), e(m).length && t.success && e(window).off("beforeunload"), a(t)
                };
                errorhandler_in = e.with_default(h, function() {}), h = function(e) {
                    return i(p), errorhandler_in(e)
                }, c = e.with_default(c, !1), r.config.post_site && u.r === undefined && (u.r = r.config.post_site), r.config.logged && (u.uh = r.config.modhash), u.renderstyle = r.config.renderstyle, v && (t = o + t, r.commentsPreview && r.commentsPreview.visible && r.utils && (t = r.utils.replaceUrlParams(t, {
                    comments_preview_enabled: !0
                })), e.ajax({
                    type: c ? "GET" : "POST",
                    url: t,
                    data: u,
                    success: d,
                    error: h,
                    dataType: l
                }))
            };
            var u = "up",
                a = "upmod",
                f = "down",
                l = "downmod";
            rate_limit = function() {
                var e = 333,
                    t = {
                        vote: 333,
                        comment: 333,
                        ignore: 0,
                        ban: 0,
                        unban: 0,
                        assignad: 0
                    },
                    n = {},
                    r = Date;
                return function(s) {
                    var o = new r,
                        u = s in t ? t[s] : e,
                        a = n[s],
                        f = a && o - a < u;
                    return n[s] = o, f
                }
            }(), e.fn.removeLinkFlairClass = function() {
                e(this).removeClass("linkflair").attr("class", function(e, t) {
                    return t.replace(/(^|\s)linkflair\S+/g, "")
                })
            }, e.fn.updateThing = function(t) {
                var n = e(this),
                    i = n.children(".entry");
                if ("enemy" in t) {
                    n.remove();
                    return
                }
                if ("friend" in t) {
                    var s = '<a class="friend" title="friend" href="/prefs/friends">F</a>';
                    i.find(".author").addClass("friend").next(".userattrs").each(function() {
                        var t = e(this);
                        t.html() ? t.find(".friend").length || t.find("a:first").before(s + ",") : t.html(" [" + s + "]")
                    })
                }
                if ("voted" in t) {
                    var o = n.children(".midcol"),
                        c = o.find(".arrow." + u + ", .arrow." + a),
                        h = o.find(".arrow." + f + ", .arrow." + l),
                        p = e(o).add(i);
                    switch (t.voted) {
                        case 1:
                            p.addClass("likes").removeClass("dislikes unvoted"), c.removeClass(u).addClass(a), h.removeClass(l).addClass(f);
                            break;
                        case -1:
                            p.addClass("dislikes").removeClass("likes unvoted"), c.removeClass(a).addClass(u), h.removeClass(f).addClass(l);
                            break;
                        default:
                            p.addClass("unvoted").removeClass("likes dislikes"), c.removeClass(a).addClass(u), h.removeClass(l).addClass(f)
                    }
                }
                "saved" in t && (n.addClass("saved"), i.find(".save-button a").text(r._("unsave")))
            }, e.fn.resetInput = function() {
                var t = e(this);
                return t.wrap("<form>").closest("form").get(0).reset(), t.unwrap(), this
            }, e.fn.show_unvotable_message = function() {}, e.fn.thing = function() {
                return this.parents(".thing:first")
            }, e.fn.all_things_by_id = function() {
                return this.thing().add(e.things(this.thing_id()))
            }, e.fn.thing_id = function() {
                var t = this.hasClass("thing") ? this : this.thing();
                if (!t.length) return "";
                var n = t.data("fullname");
                return n ? n : (n = e.grep(t.get(0).className.match(/\S+/g), function(e) {
                    return e.match(/^id-/)
                }), n.length ? n[0].slice(3, n[0].length) : "")
            }, e.things = function() {
                var t = e.map(arguments, function(e) {
                    return ".thing.id-" + e
                }).join(", ");
                return e(t)
            }, e.fn.things = function() {
                var t = e.map(arguments, function(e) {
                    return ".thing.id-" + e
                }).join(", ");
                return this.find(t)
            }, e.listing = function(t) {
                t = t || "";
                var n = "siteTable";
                if (t.slice(0, 1) == "#" || t.slice(0, 1) == ".") t = t.slice(1, t.length);
                var r = t;
                t.slice(0, n.length) != n ? r = n + (t ? "_" + t : "") : t = t.slice(n.length + 1, t.length);
                var i = e("#" + r).filter(":first");
                return i.length == 0 && (i = e.things(t).find(".child").append(document.createElement("div")).children(":last").addClass("sitetable").attr("id", r)), i
            };
            var c = function() {};
            e.fn.set_thing_init = function(t) {
                c = t, e(this).find(".thing:not(.stub)").each(function() {
                    t(this)
                })
            }, e.fn.new_thing_child = function(t, n) {
                var r = this.thing_id(),
                    i = n ? e.listing(r) : this.thing().find(".child:first"),
                    s;
                return typeof t == "string" ? s = i.prepend(t).children(":first") : s = t.hide().prependTo(i).show().find('input[name="parent"]').val(r).end(), s.randomize_ids()
            }, e.fn.randomize_ids = function() {
                var t = (Math.random() + "").split(".")[1];
                return e(this).find("*[id]").each(function() {
                    e(this).attr("id", e(this).attr("id") + t)
                }).end().find("label").each(function() {
                    e(this).attr("for", e(this).attr("for") + t)
                }), e(this)
            }, e.fn.replace_things = function(t, n, r, i) {
                var s = this,
                    o = e.map(t, function(t) {
                        var o = t.data,
                            u = e(s).things(o.id);
                        i && (u = u.filter(".stub"));
                        if (u.length == 0) {
                            var a = e.things(o.parent);
                            a.length && (u = e("<div></div>"), a.find(".child:first").append(u))
                        }
                        u.after(e.unsafe(o.content));
                        var f = u.next();
                        return n && (f.show().children(".midcol, .entry").hide().end().children(".child:first").html(u.children(".child:first").remove().html()).end(), r && (u.hide(), f.children(".midcol, .entry").show()), f.find(".rank:first").html(u.find(".rank:first").html())), r ? (u.hide(), n ? f.children(".midcol, .entry").show() : f.show(), u.remove()) : (f.hide(), u.remove()), c(f), e(document).trigger("new_thing", f), f
                    });
                return e(document).trigger("new_things_inserted"), o
            }, e.insert_things = function(t, n, r, i) {
                var s = e.map(t, function(t) {
                    var s = t.data;
                    if (!s.parent && i) var o = i;
                    else {
                        var o = e.listing(s.parent);
                        if (!o.length)
                            if (i) o = i;
                            else if (!!s.link) var o = e.listing(s.link)
                    }
                    if (n) var u = o.append(e.unsafe(s.content));
                    else {
                        var a = o.children(".thing:first");
                        if (a.hasClass("stickied")) {
                            var u = e(e.unsafe(s.content));
                            a.after(u)
                        } else var u = o.prepend(e.unsafe(s.content)).children(".thing:first")
                    }
                    return r ? c(u.hide()) : c(u.hide().show()), e(document).trigger("new_thing", u), u
                });
                return e(document).trigger("new_things_inserted"), s
            }, e.fn.delete_table_row = function(t) {
                var n = this.parents("tr:first").get(0),
                    r = this.parents("table").get(0);
                n ? e(n).fadeOut(function() {
                    r.deleteRow(n.rowIndex), t && t()
                }) : t && t()
            }, e.fn.insert_table_rows = function(t, n) {
                var r = this.is("table") ? this.filter("table") : this.parents("table:first");
                return e.map(r.get(), function(r) {
                    e.map(t, function(t) {
                        var i = n;
                        i < 0 && (i = Math.max(r.rows.length + i + 1, 0)), i = Math.min(i, r.rows.length);
                        var s = e(r.insertRow(i)),
                            o = e(e.parseHTML(e.unsafe(t)));
                        o.hide(), s.replaceWith(o), o.trigger("insert-row"), o.css("display", "table-row"), o.fadeIn()
                    })
                }), this
            }, e.fn.insertAtCursor = function(t) {
                return e(this).filter("textarea").each(function() {
                    var n = e(this).get(0),
                        r = n.scrollTop;
                    if (document.selection) {
                        n.focus();
                        var i = document.selection.createRange();
                        i.text = t
                    } else if (n.selectionStart) {
                        var s = n.selectionStart;
                        n.value = n.value.substring(0, n.selectionStart) + t + n.value.substring(n.selectionEnd, n.value.length), s += t.length, n.setSelectionRange(s, s)
                    } else n.value += t;
                    n.scrollHeight && (n.scrollTop = r), e(this).focus()
                }).end()
            }, e.fn.select_line = function(t) {
                return e(this).filter("textarea").each(function() {
                    var n = "\n",
                        r = 1,
                        i = 0,
                        s = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
                    s && (n = "\r", r = 0, i = 1);
                    var o = e(this).val().split(n);
                    for (var u = 0; u < t - 1; u++) i += o[u].length + r;
                    var a = i;
                    t <= o.length && (a += o[t - 1].length + r), e(this).focus();
                    if (this.createTextRange) {
                        var f = this.createTextRange();
                        f.move("character", i);
                        var l = this.createTextRange();
                        l.move("character", a), f.setEndPoint("StartToEnd", l), f.select()
                    } else this.selectionStart && this.setSelectionRange(i, a);
                    if (this.scrollHeight) {
                        var c = this.scrollHeight / o.length;
                        this.scrollTop = (t - 2) * c
                    }
                })
            }, e.apply_stylesheet = function(t) {
                var n = e("head").children("link[title], style[title]").filter(":first").attr("title") || "preferred stylesheet";
                if (document.styleSheets[0].cssText) {
                    var r = document.styleSheets;
                    for (var i = 0; i < r.length; i++)
                        if (r[i].title == n) {
                            r[i].cssText = t;
                            break
                        }
                } else {
                    e("head").children('*[title="' + n + '"]').remove(), document.body.offsetHeight;
                    var s = e('<style type="text/css" media="screen"></style>').attr("title", n).text(t).appendTo("head")
                }
            }, e.apply_stylesheet_url = function(t, n) {
                var r = "applied_subreddit_stylesheet",
                    i = e('link[ref="' + r + '"]');
                i.length == 0 && (i = e('link[title="' + r + '"]')), i.attr("href", t), e("#sr_style_enabled").prop("checked", n), e("#sr_style_throbber").html("").css("display", "none")
            }, e.apply_header_image = function(t, n, r) {
                var i = e("#header-img");
                i.is("a") && (i.attr("id", "header-img-a").text("").append('<img id="header-img"/>'), i = e("#header-img")), i.removeClass("default-header"), i.attr("src", t), i.attr("title", r), n ? (i.attr("width", n[0]), i.attr("height", n[1])) : (i.removeAttr("width"), i.removeAttr("height"))
            }, e.remove_header_image = function() {
                var t = e("#header-img-a");
                t && (t.addClass("default-header").attr("id", "header-img").empty(), e("#header-img").empty(), t.attr("id", "header-img"))
            }, e.fn.highlight = function(t) {
                if (!t) return this;
                var n = e.websafe(t.trim()).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                    r = new RegExp("\\b" + n + "\\b", "gi");
                return this.each(function() {
                    if (this.children.length) return;
                    this.innerHTML = this.innerHTML.replace(r, function(e) {
                        return "<mark>" + e + "</mark>"
                    })
                })
            }, e.fn.recaptcha = function() {
                var t = e(this),
                    n = function() {
                        window.grecaptcha && t.find(".g-recaptcha:empty").each(function(e, t) {
                            window.grecaptcha.render(t, {
                                sitekey: t.getAttribute("data-sitekey")
                            })
                        })
                    };
                if (!window.grecaptcha) {
                    var r = "callback_" + (Math.random() + "").split(".")[1];
                    window[r] = function() {
                        n(), delete window[r]
                    }, e.getScript("https://www.google.com/recaptcha/api.js?render=explicit&onload=" + r)
                } else n();
                return t
            }, e.getLinkURL = function(e) {
                var t = e.data("url");
                t || (t = this.$el.children(".entry").find("a.title").attr("href"));
                if (!t) return null;
                if (/^\//.test(t)) {
                    var n = window.location.protocol,
                        r = window.location.hostname;
                    t = n + "//" + r + t
                }
                return t
            }, e.getThingType = function(e) {
                var t = e.data("type");
                return t === "link" && e.hasClass("self") ? "self" : t
            }, e.fn.getThingType = function() {
                return e.getThingType(e(this))
            }
        }(jQuery),
        function(e) {
            "use strict";

            function l(e) {
                var t = e.offset();
                return e.outerWidth() + (t ? t.left : 0)
            }

            function c() {
                var e = a;
                return arguments.length && (e = _.pick(e, _.toArray(arguments))), _.values(e).concat(u).join(" ")
            }

            function h(e) {
                return !!e.data("bs.tooltip")
            }
            var t = '<div class="c-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                n = "c-form-group",
                r = "c-form-control",
                i = "." + r,
                s = "c-form-control-feedback-",
                o = "." + s,
                u = "c-has-feedback",
                a = {
                    loading: "c-has-throbber",
                    success: "c-has-success",
                    error: "c-has-error"
                },
                f = {
                    loading: "throbber",
                    success: "success",
                    error: "error"
                },
                p = function(e, t) {
                    this.initialize(e, t)
                };
            _.extend(p.prototype, {
                _currentState: null,
                _getFeedbackSelector: function() {
                    var e = this.getCurrentState();
                    return o + f[e]
                },
                initialize: function(t, r) {
                    return this.$el = e(t).closest("." + n), this
                },
                getCurrentState: function() {
                    return this._currentState
                },
                set: function(e) {
                    return this._currentState !== e && (this.clear(), this._currentState = e, this.$el.addClass(c(e))), arguments.length > 1 && this.showMessage.apply(this, _.toArray(arguments).slice(1)), this
                },
                showMessage: function(n) {
                    if (!n) return;
                    var r = this._getFeedbackSelector(),
                        s = this.$el.find(i),
                        o = this.$el.find(r);
                    if (n === o.attr("data-original-title")) return;
                    o.attr("title", n);
                    if (h(o)) {
                        o.tooltip("fixTitle"), s.is(":focus") && o.tooltip("show");
                        return
                    }
                    o.tooltip({
                        template: t,
                        placement: "right",
                        trigger: "manual"
                    });
                    if (s.is(":focus") || s.parents("form").find('[type="submit"]:focus').length) {
                        o.tooltip("show");
                        var u = e("body"),
                            a = o.data("bs.tooltip"),
                            f = a.$tip;
                        u.length && l(u) < l(f) && (a.options.placement = "top-right", o.tooltip("show"))
                    }
                    s.on("focus.c.stateify", function() {
                        s.parents("form").find(r).not(o).each(function() {
                            var t = e(this);
                            t.data("bs.tooltip") && t.tooltip("hide")
                        });
                        var t = o.data("bs.tooltip");
                        t && t.tip().off("bsTransitionEnd"), o.tooltip("show")
                    }).on("blur.c.stateify", function() {
                        o.tooltip("hide")
                    }), o.on("mouseenter.c.stateify", function() {
                        s.is(":focus") || o.tooltip("show")
                    }).on("mouseleave.c.stateify", function() {
                        s.is(":focus") || o.tooltip("hide")
                    })
                },
                getMessage: function() {
                    var e = this._getFeedbackSelector(),
                        t = this.$el.find(e);
                    return t.attr("data-original-title")
                },
                clear: function() {
                    var e = this.$el.find(this._getFeedbackSelector()),
                        t = this.$el.find(i);
                    return e.tooltip("destroy").removeAttr("data-original-title").off("mouseenter.c.stateify mouseleave.c.stateify"), t.off("focus.c.stateify blur.c.stateify"), this.$el.removeClass(c()), this._currentState = null, this
                }
            }), e.fn.stateify = function(t) {
                var n = _.toArray(arguments).slice(1);
                if (t && /^get/.test(t)) {
                    var r = this.data("c.stateify");
                    return r && r[t].apply(r, n)
                }
                return this.each(function() {
                    var r = e(this),
                        i = r.data("c.stateify"),
                        s = typeof t == "object" && t;
                    i || (i = new p(this, s), r.data("c.stateify", i)), typeof t == "string" && i[t].apply(i, n)
                })
            }
        }(window.jQuery),
        function(e) {
            "use strict";

            function n(n) {
                var r = Array.prototype.slice.call(arguments, 1);
                return this.each(function() {
                    var i = e(this),
                        s = i.data("c.validator"),
                        o = typeof n == "object" && n;
                    s || (s = new t(this, o), i.data("c.validator", s)), typeof n == "string" && s[n].apply(s, r)
                })
            }
            var t = function(e, t) {
                this.initialize(e, t)
            };
            t.DEFAULTS = {
                delay: 600,
                loadingTimeout: 250,
                https: !1
            }, _.extend(t.prototype, {
                _loadingTimeout: !1,
                initialize: function(n, r) {
                    var i = this.$el = e(n),
                        s = i.data("validate-on") || "keyup change blur";
                    return this.options = e.extend({}, t.DEFAULTS, r), i.on(s, _.debounce(e.proxy(this._validate, this), this.options.delay)), i.trigger("initialize.validator"), this
                },
                _validate: function(t) {
                    if (t.keyCode === 9 || t.keyCode === 13) return;
                    if (t.type === "blur" && t.relatedTarget && e(t.relatedTarget).is("[type=submit]")) return;
                    var n = this,
                        r = this.$el,
                        i = r.data("validate-min"),
                        s = r.val();
                    if (t.type === "keyup" && s.length < i) {
                        delete this._keyupValue, r.trigger("cleared.validator");
                        return
                    }
                    if (/change|blur/.test(t.type) && this._keyupValue === s) return;
                    if (/^\s*$/.test(s) && !r.data("validate-noclear")) {
                        r.trigger("cleared.validator");
                        return
                    }
                    var o = r.parents("form"),
                        u = r.data("validate-url"),
                        a = (r.data("validate-with") || "").split(/,s*/),
                        f = {};
                    if (this.options.https) {
                        var l = document.createElement("a");
                        l.href = u, l.protocol = "https:", u = l.href
                    }
                    f[r.attr("name")] = s, t.type === "keyup" && (this._keyupValue = s), _.each(a, function(e) {
                        f[e] = o.find('[name="' + e + '"]').val()
                    }), this._loadingTimeout = setTimeout(function() {
                        r.trigger("loading.validator")
                    }, this.options.loadingTimeout), this.xhr && this.xhr.readyState !== 4 && this.xhr.abort(), this.xhr = e.ajax({
                        type: "POST",
                        url: u,
                        data: f,
                        dataType: "json",
                        success: function(e, t, n) {
                            var i = e && e.json;
                            i && i.errors && i.errors.length ? (r.trigger("invalid.validator", i), _.each(a, function(e) {
                                o.find('[name="' + e + '"]').trigger("invalid.validator", i)
                            })) : r.trigger("valid.validator")
                        },
                        error: function(e) {
                            if (e.status === 0) return;
                            if (e.status === 409) {
                                r.trigger("cleared.validator");
                                return
                            }
                            r.trigger("valid.validator")
                        },
                        complete: function() {
                            clearTimeout(n._loadingTimeout), r.trigger("loaded.validator")
                        }
                    })
                }
            }), e.fn.validator = n, e.fn.validator.Constructor = t
        }(window.jQuery),
        function(e) {
            "use strict";

            function a(e, t) {
                return _.any(t, function(t) {
                    return t && e.indexOf(t) !== -1
                }) || _.any(n, function(t) {
                    return t.test(e)
                })
            }

            function f(e) {
                return function(t) {
                    var n = new RegExp(e + "+", "g"),
                        r = t.match(n) || [];
                    return _.reduce(r, function(e, t) {
                        return e += t.length
                    }, 0)
                }
            }

            function l(e) {
                var t = _.toArray(e),
                    n = _.unique(t).length,
                    r = 0;
                for (var i = 0, s = t.length; i < s; i++)
                    for (var o = 0; o < s; o++) t[i] === t[o] && i !== o && (r += Math.abs(s / (o - i)));
                return Math.ceil(n === 0 ? r : r / n)
            }

            function c(e) {
                return function(t) {
                    var n = t.toLowerCase(),
                        r = 0;
                    for (var i = 0, s = e.length - 3; i < s; i++) {
                        var o = e.substring(i, i + 3),
                            u = _.toArray(o).reverse().join("");
                        (n.indexOf(o) != -1 || n.indexOf(u) != -1) && r++
                    }
                    return r
                }
            }

            function p(e, t) {
                var n = 0;
                if (t.test instanceof Function) n = t.test(e);
                else {
                    var r = e.match(t.test);
                    n = r ? r.length : 0
                }
                return t.weight instanceof Function ? t.weight(e, n) : t.weight * n
            }

            function d(e, t) {
                return e = e || "", a(e, t) ? 0 : _.reduce(h, function(t, n) {
                    return t += p(e, n)
                }, 0)
            }

            function v(n) {
                var r = Array.prototype.slice.call(arguments, 1);
                return this.each(function() {
                    var i = e(this),
                        s = i.data("c.strengthMeter"),
                        o = typeof n == "object" && n;
                    s || (s = new t(this, o), i.data("c.strengthMeter", s)), typeof n == "string" && s[n].apply(s, r)
                })
            }
            var t = function(e, t) {
                this.initialize(e, t)
            };
            t.DEFAULTS = {
                template: '<div class="strength-meter"><div class="strength-meter-fill"></div></div>',
                delay: 100,
                minimumDisplay: 5,
                trigger: "keyup change blur"
            };
            var n = [/^password(\d+)?$/i, /^letmein(\d+)?$/i, /^welcome(\d+)?$/i, /^secret(\d+)?$/i, /^reddit(\d+)?$/i, /^(reddit)\1+/i, /^(test)\1+$/i, /^abcd?e?f?1234?5?6?$/i, /^iloveyou$/i, /^admin$/i, /^trustno1$/i, /^.werty$/i, /^sunshine$/i, /^monkey$/i, /^shadow$/i, /^princess$/i, /^dragon$/i],
                r = "abcdefghijklmnopqrstuvwxyz",
                i = "qwertyuiopasdfghjklzxcvbnm",
                s = "qazwsxedcrfvtgbyhnujmikolp",
                o = "01234567890",
                u = "!@#$%^&*()",
                h = [{
                    test: /./g,
                    weight: 4
                }, {
                    test: /[A-Z]/g,
                    weight: function(e, t) {
                        return !t || e.length === t ? 0 : (e.length - t) * 2
                    }
                }, {
                    test: /[a-z]/g,
                    weight: function(e, t) {
                        return !t || e.length === t ? 0 : (e.length - t) * 2
                    }
                }, {
                    test: /\d/g,
                    weight: function(e, t) {
                        return !t || e.length === t ? 0 : t * 4
                    }
                }, {
                    test: /\W|_/g,
                    weight: 6
                }, {
                    test: /^[a-z]+$/i,
                    weight: -1
                }, {
                    test: /^\d+$/i,
                    weight: -1
                }, {
                    test: c(r),
                    weight: -3
                }, {
                    test: c(i),
                    weight: -3
                }, {
                    test: c(s),
                    weight: -3
                }, {
                    test: c(o),
                    weight: -3
                }, {
                    test: c(u),
                    weight: -3
                }, {
                    test: f("[a-z]"),
                    weight: -2
                }, {
                    test: f("[A-Z]"),
                    weight: -2
                }, {
                    test: f("\\d"),
                    weight: -2
                }, {
                    test: l,
                    weight: -1
                }];
            _.extend(t.prototype, {
                _cancelScore: !1,
                initialize: function(n, r) {
                    this.options = e.extend({}, t.DEFAULTS, r);
                    var i = this.$el = e(n),
                        s = this.$meter = e(this.options.template),
                        o = this.options.trigger;
                    o !== "manual" && i.on(this.options.trigger, _.debounce(this.score.bind(this), this.options.delay)), s.insertAfter(i);
                    var u = s.outerWidth(),
                        a = u + 5 + "px";
                    return i.css({
                        "padding-right": a
                    }), i.trigger("initialize.strengthMeter"), this
                },
                score: function() {
                    var t = this.$el.val(),
                        n = _.map(this.options.related, function(t) {
                            return e(t).val() || ""
                        }),
                        r = d(t, n),
                        i = Math.min(100, Math.max(this.options.minimumDisplay, r));
                    this.$el.trigger("score.strengthMeter", i), this._cancelScore || this.$meter.find(".strength-meter-fill").css({
                        width: i + "%"
                    }), this._cancelScore = !1
                },
                cancelScore: function() {
                    this._cancelScore = !0
                }
            }), e.fn.strengthMeter = v, e.fn.strengthMeter.Constructor = t
        }(window.jQuery), ! function(e) {
            "use strict";

            function n(n) {
                var r = Array.prototype.slice.call(arguments, 1);
                return this.each(function() {
                    var i = e(this),
                        s = i.data("c.toggle"),
                        o = typeof n == "object" && n;
                    s || (s = new t(this, o), i.data("c.toggle", s)), typeof n == "string" && s[n].apply(s, r)
                })
            }
            var t = function(e, t) {
                this.initialize(e, t)
            };
            _.extend(t.prototype, {
                initialize: function(t, n) {
                    var r = this.$el = e(t);
                    return r.on("click", function(t) {
                        var n = e(t.target),
                            r = n.data("toggle");
                        n.toggleClass("c-toggle-toggled"), e(r).toggleClass("c-toggle-content-toggled")
                    }), this
                }
            }), e.fn.togglable = n, e.fn.togglable.Constructor = t
        }(window.jQuery), ! function(e) {
            e.actions = {
                trigger: function(e, t) {
                    t = t || {}, t.action = e;
                    var n = "action:" + e,
                        r = $.Event(n, t);
                    $(document.body).trigger(r), r.isDefaultPrevented() ? $(document.body).trigger($.Event(n + ":failure", t)) : $(document.body).trigger($.Event(n + ":success", t)), $(document.body).trigger($.Event(n + ":complete", t))
                },
                on: function(e, t) {
                    $(document.body).on("action:" + e, t)
                },
                off: function(e, t) {
                    $(document.body).off("action:" + e, t)
                }
            }
        }(r);

    function open_menu(e) {
        $(e).siblings(".drop-choices").not(".inuse").css("top", e.offsetHeight + "px").each(function() {
            $(this).css("left", $(e).position().left + "px").css("top", $(e).height() + $(e).position().top + "px")
        }).addClass("active inuse")
    }

    function close_menu(e) {
        $(e).closest(".drop-choices").removeClass("active inuse")
    }

    function close_menus(e) {
        $(".drop-choices.inuse").not(".active").removeClass("inuse"), $(".drop-choices.active").removeClass("active").trigger("close_menu"), $(".flairselector").empty(), $(e.target).closest("#search").length == 0 && ($("#moresearchinfo").slideUp(), $("#searchexpando").length == 1 ? $("#searchexpando").slideUp(function() {
            $("#search_showmore").parent().show()
        }) : $("#search_showmore").parent().show())
    }

    function select_tab_menu(e, t) {
        var n = "tabbedpane-" + t,
            r = $(e).parent().parent().parent();
        r.find(".tabmenu li").removeClass("selected"), $(e).parent().addClass("selected"), r.find(".tabbedpane").each(function() {
            this.style.display = this.id == n ? "block" : "none"
        })
    }

    function post_user(e, t) {
        var n = $(e).find('input[name="user"]').val();
        return n == null ? post_form(e, t) : post_form(e, t + "/" + n)
    }

    function post_form(e, t, n, i, s) {
        try {
            return e.disabled ? !1 : (n == null && (n = function(e) {
                return r.config.status_msg.submitting
            }), $(e).find(".error").not(".status").hide(), $(e).find(".status").html(n(e)).show(), simple_post_form(e, t, {}, s))
        } catch (o) {
            return !1
        }
    }

    function get_form_fields(e, t, n) {
        return t = t || {}, n || (n = function(e) {
            return !0
        }), $(e).find("select, input, textarea").not(".gray, :disabled").each(function() {
            var e = $(this),
                r = e.attr("type");
            if (!n(this)) return;
            if (e.data("send-checked")) t[e.attr("name")] = e.is(":checked");
            else if (r != "radio" && r != "checkbox" || e.is(":checked")) t[e.attr("name")] = e.val()
        }), r.config.embedded && (t.embedded = "web2x"), t.id == null && (t.id = $(e).attr("id") ? "#" + $(e).attr("id") : ""), t
    }

    function form_error(e) {
        return function(t) {
            var n;
            t == "ratelimit" ? n = r._("please wait a few seconds and try again.") : n = r._("an error occurred (status: %(status)s)").format({
                status: t.status
            }), $(e).find(".status").text(n)
        }
    }

    function simple_post_form(e, t, n, r, i) {
        return $.request(t, get_form_fields(e, n), i, r, "json", !1, form_error(e)), !1
    }

    function post_pseudo_form(e, t, n, i) {
        var s = function(t) {
            var n = $(t).parents("form:first");
            return n.length == 0 || n.get(0) == $(e).get(0)
        };
        return $(e).find(".error").not(".status").hide(), $(e).find(".status").html(r.config.status_msg.submitting).show(), $.request(t, get_form_fields(e, {}, s), i, n, "json", !1, form_error(e)), !1
    }

    function post_multipart_form(e, t) {
        return $(e).find(".error").not(".status").hide(), $(e).find(".status").html(r.config.status_msg.submitting).show(), !0
    }

    function showlang() {
        var e = $("#lang-popup").prop("innerHTML"),
            t = new r.ui.Popup({
                className: "lang-modal",
                content: e
            });
        return t.show(), !1
    }

    function deleteRow(e) {
        $(e).delete_table_row()
    }

    function change_state(e, t, n, i, s) {
        var o = $(e).parents("form").first(),
            u = $(e).data("event-action");
        u || (u = o.find("[data-event-action]").data("event-action")), r.actions.trigger("legacy:change-state", {
            target: e,
            eventAction: u,
            op: t,
            callback: n,
            keep: i,
            post_callback: s,
            $form: o
        })
    }
    $(function() {
        r.actions.on("legacy:change-state:success", function(e) {
            var t = e.target,
                n = e.op,
                r = e.callback,
                i = e.keep,
                s = e.post_callback,
                o = e.$form,
                u = o.find('input[name="id"]');
            return u.length ? u = u.val() : u = $(t).thing_id(), simple_post_form(o, n, {
                id: u
            }, undefined, s), r && r(o.length ? o : t, n), $.defined(i) || o.html(o.find('[name="executed"]').val()), !1
        })
    });

    function remove_show_comment_thing(e) {
        $(e).hide()
    }

    function unread_thing(e) {
        var t = $(e);
        t.hasClass("thing") || (t = t.thing()), $(t).addClass("new unread")
    }

    function read_thing(e) {
        var t = $(e);
        t.hasClass("thing") || (t = t.thing()), $(t).hasClass("new") ? $(t).removeClass("new") : $(t).removeClass("unread"), $.request("read_message", {
            id: $(t).thing_id()
        })
    }

    function click_thing(e) {
        var t = $(e);
        t.hasClass("thing") || (t = t.thing()), t.hasClass("message") && t.hasClass("recipient") && (t.hasClass("unread") ? t.removeClass("unread") : t.hasClass("new") && read_thing(e))
    }

    function render_hidden_post_card_placeholder(e) {
        var t = $('<a href="javascript:void(0)">' + r._("undo") + "</a>"),
            n = '<div class="text">' + r._("Post hidden") + "</div>",
            i = $('<div class="hidden-post-placeholder"></div>');
        i.append(n, t);
        var s = function() {
            i.fadeOut(function() {
                e.fadeIn(), i.detach()
            }), $.request("unhide", {
                id: e.thing_id()
            })
        };
        return t.on("click", s), i
    }

    function hide_thing(e) {
        if ($("body").hasClass("comments-page")) return;
        var t = $(e).thing();
        if (t.is(".comment") && t.has(".child:not(:empty)").length) {
            var n = "[" + _.escape(r._("deleted")) + "]",
                i = t.addClass("deleted").find(".entry:first");
            i.find(".usertext").addClass("grayed").find(".md").html("<p>" + n + "</p>"), i.find(".author").replaceWith("<em>" + n + "</em>"), i.find(".userattrs, .score, .buttons").remove()
        } else t.fadeOut(function() {
            $(this).toggleClass("hidden");
            var n = $(this).thing_id();
            $(document).trigger("hide_thing_" + n), r.config.hidden_post_card_enabled === !0 && $(e).is(".hide-button") && t.data("context") === "listing" && render_hidden_post_card_placeholder(t).fadeIn().insertAfter(t)
        })
    }

    function toggle(e, t, n) {
        if (r.access.isLinkRestricted(e)) return !1;
        r.analytics.breadcrumbs.storeLastClick(e);
        var i = $(e).parent().addBack().filter(".option"),
            s = i.removeClass("active").siblings().addClass("active").get(0);
        return n && !s.onclick && (s.onclick = function() {
            return toggle(s, n, t)
        }), t && t(e), !1
    }

    function cancelToggleForm(e, t, n, r) {
        if (n && $(e).filter("button").length) {
            var i = $(e).thing().find(n).children(":visible").filter(":first");
            toggle(i)
        }
        return $(e).thing().find(t).each(function() {
            r && r($(this)), $(this).hide().remove()
        }), !1
    }

    function linkstatus(e) {
        return r.config.status_msg.submitting
    }

    function subscribe(e) {
        return function() {
            r.config.logged && (r.config.cur_site == e && $("body").addClass("subscriber"), $.things(e).find(".entry").addClass("likes"), $.request("subscribe", {
                sr: e,
                action: "sub"
            }))
        }
    }

    function unsubscribe(e) {
        return function() {
            r.config.logged && (r.config.cur_site == e && $("body").removeClass("subscriber"), $.things(e).find(".entry").removeClass("likes"), $.request("subscribe", {
                sr: e,
                action: "unsub"
            }))
        }
    }

    function quarantine_optout(e) {
        return function() {
            r.config.logged && ($.request("quarantine_optout", {
                sr: e
            }), $.redirect("/"))
        }
    }

    function friend(e, t, n) {
        return function() {
            r.config.logged && (encoded = encodeURIComponent(document.referrer), $.request("friend?note=" + encoded, {
                name: e,
                container: t,
                type: n
            }))
        }
    }

    function unfriend(e, t, n) {
        return function() {
            $.request("unfriend", {
                name: e,
                container: t,
                type: n
            })
        }
    }

    function add_whitelisted(e) {
        return function() {
            r.config.logged && $.request("add_whitelisted", {
                name: e
            })
        }
    }

    function remove_whitelisted(e) {
        return function() {
            r.config.logged && $.request("remove_whitelisted", {
                id: e
            })
        }
    }

    function reject_promo(e) {
        $(e).thing().find(".rejection-form").show().find("textare").focus()
    }

    function cancel_reject_promo(e) {
        $(e).thing().find(".rejection-form").hide()
    }

    function complete_reject_promo(e) {
        var t = $(e);
        t.thing().removeClass("accepted").addClass("rejected").find(".reject_promo").remove(), t.data("hide-after-seen") && hide_thing(e)
    }

    function helpon(e) {
        $(e).parents(".usertext-edit:first").children(".markhelp:first").show()
    }

    function helpoff(e) {
        $(e).parents(".usertext-edit:first").children(".markhelp:first").hide()
    }

    function show_all_messages(e) {
        var t = $(e).parents(".message"),
            n = t.find(".message"),
            r = t.add(n),
            i = [];
        return _.each(r, function(e) {
            var t = $(e),
                n = t.find(".expand:first"),
                r = t.hasClass("collapsed");
            r && (t.toggleClass("collapsed noncollapsed"), n.text("[-]"), i.push(t.thing_id()))
        }), i.length && $.request("uncollapse_message", {
            id: i.join(",")
        }), !1
    }

    function hide_all_messages(e) {
        var t = $(e).parents(".message"),
            n = t.find(".message"),
            r = t.add(n),
            i = [];
        return _.each(r, function(e) {
            var t = $(e),
                n = t.find(".expand:first"),
                r = t.hasClass("collapsed");
            r || (t.toggleClass("collapsed noncollapsed"), n.text("[+]"), i.push(t.thing_id()))
        }), i.length && $.request("collapse_message", {
            id: i.join(",")
        }), !1
    }

    function togglecomment(e) {
        var t = $(e).thing(),
            n = t.find(".expand:first"),
            r = t.hasClass("collapsed");
        t.toggleClass("collapsed noncollapsed"), r ? n.text("[â€“]") : n.text("[+]")
    }

    function togglemessage(e) {
        var t = $(e).thing(),
            n = t.find(".expand:first"),
            r = t.hasClass("collapsed");
        t.toggleClass("collapsed noncollapsed"), r ? (n.text("[â€“]"), $.request("uncollapse_message", {
            id: $(t).thing_id()
        })) : (n.text("[+]"), $.request("collapse_message", {
            id: $(t).thing_id()
        }))
    }

    function morechildren(e, t, n, i, s) {
        $(e).html(r.config.status_msg.loading).css("color", "red").focus();
        var o = $(e).parents(".thing.morechildren:first").thing_id(),
            u = {
                link_id: t,
                sort: n,
                children: i,
                id: o,
                limit_children: s
            };
        return $.request("morechildren", u, undefined, undefined, undefined, !1), !1
    }

    function moremessages(e) {
        return $(e).html(r.config.status_msg.loading).css("color", "red"), $.request("moremessages", {
            parent_id: $(e).thing_id()
        }), !1
    }

    function add_thing_to_cookie(e, t) {
        var n = $(e).thing_id();
        if (n && n.length) return add_thing_id_to_cookie(n, t)
    }

    function add_thing_id_to_cookie(e, t) {
        var n = r.cookies.getUserCookie(t);
        n.data || (n.data = "");
        if (n.data.substring(0, e.length) == e) return;
        n.data = e + "," + n.data;
        var i = n.data.split(",");
        i.length > 5 && (i = $.uniq(i, 5), n.data = i.join(",")), r.cookies.setUserCookie(n)
    }

    function clicked_items() {
        var e = r.cookies.getUserCookie("recentclicks2");
        if (e && e.data) {
            var t = e.data.split(",");
            for (var n = t.length - 1; n >= 0; n--)(!t[n] || !t[n].length) && t.splice(n, 1);
            return t
        }
        return []
    }

    function clear_clicked_items() {
        r.cookies.setUserCookie({
            name: "recentclicks2",
            value: null
        }), $(".gadget").remove()
    }

    function updateEventHandlers(e) {
        e = $(e);
        var t = e.parent();
        $(e).filter(".link").find("a.title, a.comments").mousedown(function() {
            r.config.allow_nonessential_cookies && add_thing_to_cookie(this, "recentclicks2")
        })
    }

    function last_click() {
        var e = r.analytics && r.analytics.breadcrumbs.lastClickFullname();
        e && $("body").hasClass("listing-page") && ($(".last-clicked").removeClass("last-clicked"), $(".id-" + e).last().addClass("last-clicked"))
    }

    function login(e) {
        return post_user(this, "login")
    }

    function register(e) {
        return post_user(this, "register")
    }

    function fetch_title() {
        var e = $("#url-field"),
            t = e.find(".NO_URL"),
            n = e.find(".title-status"),
            i = $("#url").val();
        if (i) {
            if ($('form#newlink textarea[name="title"]').val() && !confirm("This will replace your existing title, proceed?")) return;
            n.show().text(r.config.status_msg.loading), t.hide(), $.request("fetch_title", {
                url: i
            })
        } else n.hide(), t.show().text("a url is required")
    }

    function select_form_tab(e, t, n) {
        var r = $(e).parent();
        r.addClass("selected").siblings().removeClass("selected");
        var i = r.parent("ul").next(".formtabs-content");
        i.find(t).show().find(":input").removeAttr("disabled").end(), i.find(n).hide().find(":input").attr("disabled", !0)
    }

    function show_edit_usertext(e) {
        var t = e.find(".usertext-edit"),
            n = e.find(".usertext-body"),
            r = t.find("div > textarea"),
            i = Math.max(n.children(".md").width(), 500),
            s = Math.max(n.children(".md").height(), 100);
        n.hide(), t.show(), r.css("width", ""), r.css("height", "");
        if (r.get(0).scrollHeight > r.height()) {
            var o = Math.max(i - 5, r.width());
            r.width(o), t.width(o);
            var u = Math.max(s, r.height());
            r.height(u)
        }
        e.find(".cancel, .save").show().end().find(".help-toggle").show().end(), r.focus()
    }

    function hide_edit_usertext(e) {
        e.find(".usertext-edit").hide().end().find(".usertext-body").show().end().find(".cancel, .save").hide().end().find(".help-toggle").hide().end().find(".markhelp").hide().end()
    }

    function comment_reply_for_elem(e) {
        e = $(e);
        var t = e.thing(),
            n = e.thing_id(),
            r = t.find(".child .usertext:first");
        if (!r.length || r.parent().thing_id() != t.thing_id()) r = $(".usertext.cloneable:first").clone(!0), e.new_thing_child(r), r.prop("thing_id").value = n, r.attr("id", "commentreply_" + n), r.find(".error").hide();
        return r
    }

    function edit_usertext(e) {
        r.actions.trigger("edit", {
            target: e
        })
    }
    $(function() {
        r.actions.on("edit:success", function(e) {
            var t = $(e.target).thing();
            t.find(".edit-usertext:first").parent("li").addBack().hide(), show_edit_usertext(t.find(".usertext:first"))
        })
    });

    function cancel_usertext(e) {
        $(window).off("beforeunload");
        var t = $(e);
        t.thing().find(".edit-usertext:first").parent("li").addBack().show(), hide_edit_usertext(t.closest(".usertext"))
    }

    function reply(e) {
        return r.actions.trigger("reply", {
            target: e,
            eventAction: $(e).data("event-action")
        }), !1
    }
    $(function() {
        if (!r.config.logged) return;
        r.actions.on("reply", function(e) {
            r.access.isLinkRestricted(e.target) && e.preventDefault()
        }), r.actions.on("reply:success", function(e) {
            var t = comment_reply_for_elem(e.target),
                n = t.find("textarea");
            if (window.getSelection && n.val().length == 0) {
                var r = window.getSelection(),
                    i = $(r.focusNode).parents(".md").first(),
                    s = $(r.anchorNode).parents(".md").first();
                if (i.length && i.is(s)) {
                    var o = r.toString();
                    o.length > 0 && (o = o.replace(/^/gm, "> "), n.val(o + "\n\n"), n.scrollTop(n.scrollHeight))
                }
            }
            show_edit_usertext(t), t.show(), t.find(".cancel").get(0).onclick = function() {
                $(window).off("beforeunload"), t.hide()
            }, $(e.target).thing().find(".showreplies:visible").click()
        })
    });

    function toggle_distinguish_span(e) {
        var t = $(e).parents("form")[0];
        $(t).children().toggle()
    }

    function set_distinguish(e, t) {
        t === "yes_sticky" && ($(e).parents("form").first().find('input[name="sticky"]').val("true"), t = "yes"), t === "admin_sticky" && ($(e).parents("form").first().find('input[name="sticky"]').val("true"), t = "admin"), change_state(e, "distinguish/" + t), $(e).children().toggle()
    }

    function toggle_clear_suggested_sort(e) {
        var t = $(e).parents("form")[0];
        $(t).children().toggle()
    }

    function subreddit_whitelist_status(e) {
        $.request("set_subreddit_whitelist_status", {
            subreddit_fullname: $(e).data("subreddit"),
            status: e.value
        })
    }

    function set_suggested_sort(e, t) {
        $(e).parents("form").first().find('input[name="sort"]').val(t), change_state(e, "set_suggested_sort"), $(e).children().toggle()
    }

    function disable_subreddit_crossposting(e) {
        $.request("disable_subreddit_crossposting", {
            direction: e.value,
            value: e.checked
        })
    }

    function toggle_use_quotas(e) {
        $.request("admin/toggle_use_quotas", {
            value: e.checked
        })
    }

    function fetch_parent(e, t, n) {
        if (window.r && r.utils && r.utils.isSimpleClickEvent && !r.utils.isSimpleClickEvent(e)) return;
        var i = e.target,
            s = $(i).thing(),
            o = "";
        return $(i).css("color", "red").html(r.config.status_msg.loading), $.getJSON(t + ".json", function(e) {
            $.each(e, function() {
                this && this.data.children && $.each(this.data.children, function() {
                    this.data.name == n && (o = this.data.body_html)
                })
            }), o && s.find(".md").first().before('<div class="parent rounded">' + $.unsafe(o) + "</div>" + $.unsafe('<a class="parent-link" href="' + t + '?context=3">' + r._("view parent comment") + "</a>")), $(i).parent("li").addBack().remove()
        }), !1
    }

    function big_mod_action(e, t) {
        if (!e.hasClass("pressed")) {
            var n = e.thing_id(),
                i, s, o;
            t === -1 ? (s = "remove", i = "remove", o = ".removed") : t === -2 ? (s = "spam", i = "remove", o = ".spammed") : t === 1 && (s = "approve", i = "approve", o = ".approved"), r.actions.trigger("legacy:big-mod-action", {
                target: e[0],
                thingID: n,
                apiAction: i,
                eventAction: s,
                showSiblingSelector: o
            })
        }
        return e.siblings(".pretty-button").removeClass("pressed"), !1
    }

    function big_mod_toggle(e, t, n) {
        var i = !e.hasClass("pressed");
        return r.actions.trigger("legacy:big-mod-toggle", {
            target: e[0],
            eventAction: i ? t : n,
            isActionPress: i,
            thingID: e.thing_id()
        }), !1
    }

    function reload_page() {
        window.location.reload()
    }

    function thumbnail_hash(e) {
        r.ajax({
            type: "GET",
            url: "/api/admin/thumbnail_hash.json",
            data: {
                thing: e
            },
            success: function(e) {
                prompt("Thumbnail hash is " + e.hash + ". Use Ctrl-C to copy to clipboard", e.hash)
            },
            error: function(e, t, n) {
                alert("Failed to get the thumbnail hash")
            }
        })
    }
    $(function() {
        function n() {
            return toggle(this)
        }
        r.actions.on("legacy:big-mod-action:success", function(e) {
            var t = $(e.target),
                n = {
                    id: e.thingID
                };
            e.eventAction === "remove" && (n.spam = !1), t.addClass("pressed"), t.siblings(".status-msg").hide(), $.request(e.apiAction, n, null, !0), t.siblings(e.showSiblingSelector).show(), t.siblings(".pretty-button").removeClass("pressed")
        }), r.actions.on("legacy:big-mod-toggle:success", function(e) {
            e.isActionPress ? $(e.target).addClass("pressed") : $(e.target).removeClass("pressed"), $.request(e.eventAction, {
                id: e.thingID
            }, null, !0)
        }), $("body").click(close_menus), $("body").set_thing_init(updateEventHandlers), "placeholder" in document.createElement("input") || $("textarea[placeholder], input[placeholder]").addClass("gray").each(function() {
            var e = $(this),
                t = e.attr("placeholder");
            e.val() == "" && e.val(t)
        }), $("textarea.gray, input.gray").focus(function() {
            $(this).attr("rows", 7).filter(".gray").removeClass("gray").val("")
        }), last_click(), $(window).on("pageshow", function() {
            last_click()
        }), $('#search input[name="q"]').focus(function() {
            $("#searchexpando").slideDown()
        }), $('#search input[name="restrict_sr"]').change(function() {
            store.safeSet("search.restrict_sr.checked", this.checked)
        }), $('#searchexpando input[name="restrict_sr"]').prop("checked", !!store.safeGet("search.restrict_sr.checked")), $("#search_showmore").click(function(e) {
            $("#search_showmore").parent().hide(), $("#moresearchinfo").slideDown(), e.preventDefault()
        }), $("#moresearchinfo").prepend('<a href="#" id="search_hidemore">[-]</a>'), $("#search_hidemore").click(function(e) {
            $("#search_showmore").parent().show(), $("#moresearchinfo").slideUp(), e.preventDefault()
        });
        var t = $('#search input[name="q"]').val();
        $(".search-result-listing").find(".search-title, .search-link, .search-subreddit-link, .search-result-body").highlight(t), $(".search-result-link").find("a.search-title, a.thumbnail").mousedown(function() {
            var e = $(this).closest("[data-fullname]").data("fullname");
            e && add_thing_id_to_cookie(e, "recentclicks2")
        }), $("#shortlink-text").click(function() {
            $(this).select()
        }), $(".sr_style_toggle").change(function() {
            return $("#sr_style_throbber").html('<img src="' + r.utils.staticURL("throbber.gif") + '" />').css("display", "inline-block"), post_form($(this), "set_sr_style_enabled")
        }), $(".reddit-themes .theme").click(function() {
            $("div.theme.selected").removeClass("selected"), $("input[name='enable_default_themes']").prop("checked", !0), $(this).hasClass("select-custom-theme") ? $("#other_theme_selector").prop("checked", !0) : $("input[name='theme_selector'][value='" + $(this).attr("id") + "']").prop("checked", !0), $(this).addClass("selected"), r.goldEvents && r.goldEvents.interactWithPreferencesPage(e, "change", "theme")
        }), $(".seo-comments-close").click(function() {
            r.cookies.set("initref", !1, {
                expires: 30
            });
            var e = $(".seo-comments, .seo-comments-recommendations, #bottom-comments");
            e.slideUp("fast", function() {
                e.remove()
            })
        }), $("body").delegate(".ajax-yn-button", "submit", function() {
            var e = $(this).find('input[name="_op"]').val();
            return post_form(this, e), !1
        }).delegate(".ajax-yn-button .togglebutton", "click", n).delegate(".ajax-yn-button .no", "click", n).delegate(".ajax-yn-button .yes", "click", function() {
            $(this).closest("form").submit()
        })
    }), ! function(e, t, n) {
        e.srAutocomplete = {
            NUM_SEED: 10,
            KEYS: {
                BACKSPACE: 8,
                TAB: 9,
                ENTER: 13,
                ESCAPE: 27,
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40
            },
            SR_NAMES_DELIM: ",",
            selectedSr: {},
            origSr: "",
            MAX_SUBREDDITS: 100,
            MAX_DESCRIPTION_LENGTH: 200,
            hoverCardTemplate: t.template('<div class="hovercard"> <h5> <%- title %> </h5><small> Description: <%- description %>\n</small><small> Subscribers: <%- subscribers %>\n</small></div>'),
            _initialized: !1,
            setup: function(e, t) {
                this.srSearchCache = {}, this.srHovercardCache = {}, this.isMultiple = e, this.includeUnadvertisable = t, this.suggestedSr = {}, this.defaultSuggestedSr = {}, this.oldSrName = "";
                var r = n("#suggested-reddits").find(".sr-suggestion").map(function(e, t) {
                    return t.innerText
                });
                for (var i = 0; i < r.length; i++) {
                    var s = r[i].toLowerCase();
                    this.defaultSuggestedSr[s] = !0, this.suggestedSr[s] = !0
                }
                this._bindEvents(), this._initialized = !0
            },
            _bindEvents: function() {
                n("#sr-autocomplete-area").on("click", function() {
                    n("#sr-autocomplete").focus()
                }.bind(this)), n("#sr-autocomplete").on("keydown", this.srNameDown.bind(this)).on("blur", this.hideSrNameList.bind(this)), n("#sr-autocomplete").on("keyup", this.srNameUp.bind(this)), n(".sr-name-row").on("mouseover", this.highlightDropdown.bind(this)).on("mousedown", this.srDropdownMdown.bind(this)).on("mouseup", this.srDropdownMup.bind(this)), n("#suggested-reddits").find(".sr-suggestion").each(function(e, t) {
                    var r = n(t);
                    r.on("click", this.setSrName.bind(this)), this.isMultiple && this._bindHovercard(r)
                }.bind(this)), n("#add-all-suggestions-btn").on("click", this.srAddAllSuggestions.bind(this)), n("#sr-autocomplete").on("sr-changed blur", function(t, n) {
                    n = n || {}, e.sponsored && e.sponsored.render();
                    if (t.type !== "sr-changed") return;
                    this.dynamicSuggestions && Object.keys(this.selectedSr).length === 0 && this.srSuggestionsReset()
                }.bind(this))
            },
            _bindHovercard: function(e) {
                return e.on("mouseenter", this.srGetHovercard.bind(this)).on("mouseleave", this.srRemoveHovercard.bind(this))
            },
            getSelectedSubreddits: function() {
                return Object.keys(this.selectedSr)
            },
            srDropdownRow: function(e) {
                return n("<li />").addClass("sr-name-row").on("mouseover", this.highlightDropdown.bind(this)).on("mousedown", this.srDropdownMdown.bind(this)).on("mouseup", this.srDropdownMup.bind(this)).text(e)
            },
            srToken: function(e) {
                var t = n('<img src="/static/kill.png"/>').on("click", this.srRemoveSr.bind(this));
                return n("<span />").attr({
                    "class": "sr-span"
                }).html(e).append(t)
            },
            srSuggestion: function(e) {
                var t = n("<a />").attr({
                    href: "#",
                    "class": "sr-suggestion",
                    tabindex: "100"
                }).on("click", this.setSrName.bind(this)).text(e);
                return this.isMultiple && this._bindHovercard(t), n("<li />").append(t)
            },
            srHovercard: function(e) {
                var t = e.public_description || "none";
                t.length > this.MAX_DESCRIPTION_LENGTH && (t = t.substring(0, this.MAX_DESCRIPTION_LENGTH) + "...");
                var n = e.subscribers || "unknown",
                    r = e.display_name;
                return this.hoverCardTemplate({
                    title: r,
                    description: t,
                    subscribers: n
                })
            },
            srSearch: function(t) {
                t = t.toLowerCase();
                var i = this.srSearchCache;
                i[t] ? this.srUpdateDropdown(i[t]) : n.request("search_reddit_names.json", {
                    query: t,
                    include_over_18: e.config.over_18,
                    include_unadvertisable: this.includeUnadvertisable
                }, function(n) {
                    i[t] = n.names, e.srAutocomplete.srUpdateDropdown(n.names)
                })
            },
            srIsValidSubreddit: function(t, i, s) {
                n(".SUBREDDIT_NOEXIST").text("loading...").show(), i = i.bind(this);
                if (!t) return this.srShowNoSubredditExistsErrorMsg(t);
                t = t.toLowerCase(), n.request("search_reddit_names.json", {
                    query: t,
                    include_over_18: e.config.over_18,
                    exact: !0,
                    include_unadvertisable: this.includeUnadvertisable
                }, function(e) {
                    n(".field-sr").hide(), e.names.length == 1 ? (this.srHideErrorMsg(), i(t)) : this.srShowNoSubredditExistsErrorMsg(t)
                }.bind(this), !1, "json", !1, function(n) {
                    if (n === "ratelimit") {
                        typeof s == "undefined" && (s = 0);
                        if (s > 3) return this.srShowRequestFailedMsg();
                        window.setTimeout(e.srAutocomplete.srIsValidSubreddit.bind(this, t, i, s + 1), 2e3)
                    } else this.srShowRequestFailedMsg()
                }.bind(this))
            },
            srNameUp: function(e) {
                var t = n("#sr-autocomplete").val(),
                    r = this.oldSrName || "";
                this.oldSrName = t, t === "" ? this.hideSrNameList() : e.keyCode != this.KEYS.UP && e.keyCode != this.KEYS.DOWN && e.keyCode != this.KEYS.TAB && (e.keyCode == this.KEYS.ESCAPE && this.origSr ? (n("#sr-autocomplete").val(this.origSr), this.hideSrNameList()) : t != r && (this.origSr = t, this.srSearch(n("#sr-autocomplete").val())))
            },
            srNameDown: function(e) {
                var t = n("#sr-autocomplete");
                if (e.keyCode == this.KEYS.UP || e.keyCode == this.KEYS.DOWN || e.keyCode == this.KEYS.TAB) {
                    var r = e.keyCode == this.KEYS.UP && "up" || "down",
                        i = n("#sr-drop-down .sr-selected:first"),
                        s = n("#sr-drop-down .sr-name-row:first"),
                        o = n("#sr-drop-down .sr-name-row:last"),
                        u = null;
                    return r == "down" || e.keyCode == this.KEYS.TAB ? i.length ? i.get(0) == o.get(0) ? u = null : u = i.next(":first") : u = s : i.length ? i.get(0) == s.get(0) ? u = null : u = i.prev(":first") : u = o, this.highlightDropdownRow(u), u ? t.val(n.trim(u.text())) : t.val(this.origSr), !1
                }
                if (e.keyCode == this.KEYS.ENTER) return this.srIsValidSubreddit(e.target.value, this.srAddSr(undefined, {
                    subreddit: e.target.value
                })), this.isMultiple && (e.target.value = ""), this.hideSrNameList(), !1;
                if (e.keyCode == this.KEYS.BACKSPACE && !e.target.value && Object.keys(this.selectedSr).length !== 0) {
                    e.preventDefault();
                    var a = n("#sr-autocomplete-area > span").last();
                    if (a) {
                        var f = a.text();
                        delete this.selectedSr[f], a.remove(), this.srUpdateSelectedSrInput()
                    }
                    n("#sr-autocomplete").trigger("sr-changed", {
                        deleteSubreddit: !0
                    })
                }
            },
            hideSrNameList: function() {
                n("#sr-drop-down").hide()
            },
            highlightDropdown: function(t) {
                var n = t.target;
                e.srAutocomplete.highlightDropdownRow(n)
            },
            highlightDropdownRow: function(e) {
                n("#sr-drop-down").children(".sr-selected").removeClass("sr-selected"), e && n(e).addClass("sr-selected")
            },
            srDropdownMdown: function(t) {
                return e.srAutocomplete.srMouseRow = t.target, !1
            },
            srDropdownMup: function(e) {
                var t = e.target;
                if (this.srMouseRow == t) {
                    var r = n(t).text();
                    this.srIsValidSubreddit(r, this.srAddSr(undefined, {
                        isAutocomplete: !0,
                        subreddit: r
                    })), this.isMultiple && n("#sr-autocomplete").val(""), n("#sr-drop-down").hide()
                }
            },
            setSrName: function(e) {
                e.preventDefault();
                var t = e.target,
                    r = n(t).text();
                return n("#sr-autocomplete").trigger("focus"), this.srIsValidSubreddit(r, this.srAddSr(undefined, {
                    isSuggestion: !0,
                    subreddit: r
                })), !1
            },
            srAddSr: function(t, i) {
                var s = Object.keys(this.selectedSr).length >= this.MAX_SUBREDDITS,
                    o = this.isMultiple && t && !(t.toLowerCase() in this.selectedSr) && !s;
                if (o) {
                    var u = this.srToken(t);
                    n("#sr-autocomplete").before(u), this.selectedSr[t] = !0, this.srUpdateSelectedSrInput()
                } else if (t && !this.isMultiple) n("#sr-autocomplete").val(t);
                else {
                    if (!n.defined(t)) return function(t) {
                        e.srAutocomplete.srAddSr(t, i)
                    }.bind(this);
                    if (s) {
                        this.srShowTooManySubredditsMsg();
                        return
                    }
                }
                e.srAutocomplete.srHideErrorMsg(), n.defined(i) ? n("#sr-autocomplete").trigger("sr-changed", i) : n("#sr-autocomplete").trigger("sr-changed")
            },
            srReset: function() {
                this.selectedSr = {};
                var e = n("#sr-autocomplete-area > span").last();
                while (e.length !== 0) e.remove(), e = n("#sr-autocomplete-area > span").last();
                this.srUpdateSelectedSrInput(), n("#sr-autocomplete").trigger("sr-changed", {
                    deleteSubreddit: !0
                })
            },
            srShowNoSubredditExistsErrorMsg: function(t) {
                var n = "subreddit does not exist";
                t && (n = "subreddit /r/" + t + " does not exist"), e.srAutocomplete.srShowErrorMsg(n)
            },
            srShowTooManySubredditsMsg: function() {
                e.srAutocomplete.srShowErrorMsg(e._("the maximum number of subreddits you can target is %(num)s").format({
                    num: this.MAX_SUBREDDITS
                }))
            },
            srShowRequestFailedMsg: function() {
                var t = e._("something went wrong. please try again");
                return e.srAutocomplete.srShowErrorMsg(t)
            },
            srShowErrorMsg: function(e) {
                n(".SUBREDDIT_NOEXIST").text(e).show()
            },
            srHideErrorMsg: function() {
                n(".SUBREDDIT_NOEXIST").hide()
            },
            srRemoveSr: function(e) {
                n(e.target).parent().remove(), delete this.selectedSr[e.target.previousSibling.nodeValue], this.srUpdateSelectedSrInput(), n("#sr-autocomplete").trigger("sr-changed", {
                    deleteSubreddit: !0
                })
            },
            srUpdateSelectedSrInput: function() {
                var e = Object.keys(this.selectedSr).join(this.SR_NAMES_DELIM);
                n("#selected_sr_names").val(e)
            },
            srUpdateDropdown: function(e) {
                var t = n("#sr-drop-down");
                if (!e.length) {
                    t.hide();
                    return
                }
                var r = t.children(":first");
                r.removeClass("sr-selected"), t.children().remove();
                var i = 0;
                n.each(e, function(n) {
                    if (e[n].toLowerCase() in this.selectedSr) return;
                    if (i > 10) return;
                    i++;
                    var r = e[n],
                        s = this.srDropdownRow(r);
                    t.append(s)
                }.bind(this));
                var s = n("#sr-autocomplete-area").outerHeight();
                t.css("top", s), t.show()
            },
            srSuggestionsClear: function() {
                n("#suggested-reddits").find("ul").empty(), this.suggestedSr = {}
            },
            srSuggestionsReset: function() {
                this.srSuggestionsClear();
                for (var e in this.defaultSuggestedSr) this.srAddSuggestion(e)
            },
            srAddSuggestion: function(e) {
                if (!this.suggestedSr[e]) {
                    var t = this.srSuggestion(e);
                    n("#suggested-reddits").find("ul").append(t), this.suggestedSr[e] = !0
                }
            },
            srAddAllSuggestions: function() {
                for (var e in this.suggestedSr) this.srAddSr(e, {
                    noNewSuggestions: !0,
                    subreddit: e
                });
                return n("#sr-autocomplete").trigger("sr-changed"), !1
            },
            srGetHovercard: function(e) {
                var t = n(e.target),
                    r = t.text();
                n.when(this.srFetchSubredditInfo(r)).then(function(e) {
                    this.srRemoveHovercard();
                    var r = n(this.srHovercard(e));
                    t.before(r);
                    var i = 10 - r.height();
                    r.css("top", i)
                }.bind(this))
            },
            srRemoveHovercard: function() {
                n("#suggested-reddits").find(".hovercard").remove()
            },
            srFetchSubredditInfo: function(t) {
                return this.srHovercardCache[t] ? this.srHovercardCache[t] : n.ajax("/r/" + t + "/about.json", {
                    type: "GET",
                    dataType: "json"
                }).then(function(n) {
                    return e.srAutocomplete.srHovercardCache[t] = n.data, n.data
                })
            }
        }
    }(r, _, jQuery);

    function sr_name_up(e) {}

    function sr_name_down(e) {}

    function hide_sr_name_list(e) {}

    function highlight_dropdown_row(e) {}

    function sr_dropdown_mdown(e) {}

    function sr_dropdown_mup(e) {}

    function set_sr_name(e) {}

    function sr_add_all_suggestions() {}! function(e, t, n) {
        var r = function(e) {
                n.ajax({
                    method: "GET",
                    url: location.pathname,
                    data: {
                        count: e,
                        after: n(".thing.link").last().data("fullname")
                    },
                    success: function(t) {
                        i(t, e)
                    }
                })
            },
            i = function(e, t) {
                var r = n.parseHTML(e),
                    i = n(r).find(".thing.link");
                n.each(i, function(e, r) {
                    n(adjustRankWidth(r, t)).insertAfter("#siteTable .thing:last")
                })
            },
            s = function() {
                if (e.res.isEnabled()) return;
                n(document.body).on("click", ".prev-button, .next-button", function(e) {
                    if (n(this).hasClass("prev-button")) {
                        var t = n("#siteTable .thing.link").first(),
                            r = t.data("fullname"),
                            i = t.data("rank");
                        n(".prev-button a").attr("href", location.pathname + "?count=" + i + "&before=" + r + "&limit=100")
                    } else if (n(this).hasClass("next-button")) {
                        var s = n("#siteTable .thing.link").last(),
                            o = s.data("fullname"),
                            u = s.data("rank");
                        n(".next-button a").attr("href", location.pathname + "?count=" + u + "&after=" + o)
                    }
                })
            },
            o = function() {
                if (e.res.isEnabled()) return;
                var t = parseInt(n.url().param("count"), 10) || 0,
                    r = 3,
                    i = {
                        urlCount: t,
                        linkCount: t + 25,
                        prevLinkCount: 0,
                        loadPoint: r,
                        fromPrevButton: !!n.url().param("before"),
                        middleOfPage: getMiddleOfPage(r)
                    };
                n(window).on("scroll", null, i, doLoad)
            };
        doLoad = function(e) {
            var t = e.data,
                i = n(window).scrollTop();
            t.middleOfPage && i > t.middleOfPage && t.prevLinkCount !== t.linkCount && !t.fromPrevButton && (r(t.linkCount), t.prevLinkCount = t.linkCount, t.linkCount += 25, t.loadPoint += 20, t.middleOfPage = getMiddleOfPage(t.loadPoint)), t.linkCount >= t.urlCount + 100 && n(window).off("scroll", doLoad)
        }, getMiddleOfPage = function(e) {
            var t = n("#siteTable .thing:nth-child(" + e + ")").first().offset();
            return t ? t.top : null
        }, adjustRankWidth = function(e, t) {
            var r = n(e).find(".rank");
            return t < 900 ? n(r).width(27) : t < 9900 ? n(r).width(37) : n(r).width(47), e
        }
    }(r, _, jQuery), ! function(e) {
        e.popup = {}, e.popup.init = function() {
            $(".popup-overlay").slideToggle({
                direction: "up"
            }, 300), $(document.body).on("click", ".popup-dismiss-btn", function(e) {
                $(".popup-overlay").slideToggle({
                    direction: "down"
                }, 300);
                var t = {
                    survey_name: $(this.closest(".survey-overlay")).data(name)
                }
            })
        }, $(function() {
            e.hooks.get("reddit").register(e.popup.init)
        })
    }(window.r)
} catch (err) {
    r.sendError("Error running module", "reddit-init.js", ":", err.toString())
};
r.i18n.setPluralForms('(n != 1)');
r.i18n.addMessages({
    "\u2026 and %(count)s more \u21d2": [null, "\u2026 and %(count)s more \u21d2"],
    "please wait a few seconds and try again.": [null, "please wait a few seconds and try again."],
    "deleted": [null, "deleted"],
    "\u21d0 less": [null, "\u21d0 less"],
    "an error occurred (status: %(status)s)": [null, "an error occurred (status: %(status)s)"],
    "unsave": [null, "unsave"]
});