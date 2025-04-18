r.WebSocket = function(e) {
        this._url = e, this._connectionAttempts = 0, this.on({
            "message:refresh": this._onRefresh
        }, this)
    }, _.extend(r.WebSocket.prototype, Backbone.Events, {
        _backoffTime: 2e3,
        _maximumRetries: 9,
        _retryJitterAmount: 3e3,
        start: function() {
            var e = "WebSocket" in window;
            e && this._connect()
        },
        _connect: function() {
            r.debug("websocket: connecting"), this.trigger("connecting"), this._connectionStart = Date.now(), this._socket = new WebSocket(this._url), this._socket.onopen = _.bind(this._onOpen, this), this._socket.onmessage = _.bind(this._onMessage, this), this._socket.onclose = _.bind(this._onClose, this), this._connectionAttempts += 1
        },
        _sendStats: function(e) {
            if (!r.config.stats_domain) return;
            $.ajax({
                type: "POST",
                url: r.config.stats_domain,
                data: JSON.stringify(e),
                contentType: "application/json; charset=utf-8"
            })
        },
        _onOpen: function(e) {
            r.debug("websocket: connected"), this.trigger("connected"), this._connectionAttempts = 0, this._sendStats({
                websocketPerformance: {
                    connectionTiming: Date.now() - this._connectionStart
                }
            })
        },
        _onMessage: function(e) {
            var t = JSON.parse(e.data);
            r.debug('websocket: received "' + t.type + '" message'), this.trigger("message message:" + t.type, t.payload)
        },
        _onRefresh: function() {
            var e = Math.random() * 300 * 1e3;
            setTimeout(function() {
                location.reload()
            }, e)
        },
        _onClose: function(e) {
            if (this._connectionAttempts < this._maximumRetries) {
                var t = this._backoffTime * Math.pow(2, this._connectionAttempts),
                    n = Math.random() * this._retryJitterAmount - this._retryJitterAmount / 2,
                    i = Math.round(t + n);
                r.debug("websocket: connection lost (" + e.code + "), reconnecting in " + i + "ms"), r.debug("(can't connect? Make sure you've allowed https access in your browser.)"), this.trigger("reconnecting", i), setTimeout(_.bind(this._connect, this), i)
            } else r.debug("websocket: maximum retries exceeded. bailing out"), this.trigger("disconnected");
            this._sendStats({
                websocketError: {
                    error: 1
                }
            })
        },
        _verifyLocalStorage: function(e) {
            var t = "__synced_local_storage_%(keyname)s__".format({
                keyname: e
            });
            try {
                store.safeSet(t, store.safeGet(t) || "")
            } catch (n) {
                return !1
            }
            return !0
        },
        startPerBrowser: function(e, t, n, r) {
            if (!this._verifyLocalStorage(e)) return !1;
            var i = new Date,
                s = store.safeGet(e) || "";
            if (!s || i - new Date(s) > 15e3) this.on(n), this.start(), store.safeSet(e + "-websocketUrl", t);
            this._keepTrackOfHeartbeat(e, n, t), window.addEventListener("storage", r)
        },
        _writeHeartbeat: function(e, t, n) {
            store.safeSet(e, new Date);
            var r = setInterval(function() {
                var i = new Date,
                    s = store.safeGet(e);
                store.safeGet(e + "-websocketUrl") !== n && !!s && i - new Date(s) < 5e3 && (this._maximumRetries = 0, this._socket.close(), clearInterval(r), this._watchHeartbeat(e, t, n)), store.safeSet(e, new Date)
            }.bind(this), 5e3)
        },
        _watchHeartbeat: function(e, t, n) {
            var r = setInterval(function() {
                var i = new Date,
                    s = store.safeGet(e) || "";
                if (!s || i - new Date(s) > 15e3) this.on(t), this.start(), store.safeSet(e + "-websocketUrl", n), clearInterval(r), this._writeHeartbeat(e, t, n)
            }.bind(this), 15e3)
        },
        _keepTrackOfHeartbeat: function(e, t, n) {
            store.safeGet(e + "-websocketUrl") === n ? this._writeHeartbeat(e, t, n) : this._watchHeartbeat(e, t, n)
        }
    }),
    function(e, t, n) {
        "use strict";

        function h(n) {
            if (n.origin !== location.origin && !u.test(n.origin) && n.origin !== "null") return;
            try {
                var r = JSON.parse(n.data),
                    i = r.type;
                if (!f.test(i)) return;
                var s = i.split(".", 2)[1];
                if (l[s]) {
                    var o = l[s];
                    for (var a = 0; a < o.targets.length; a++) e.frames.postMessage(o.targets[a], i, r.data, r.options)
                }
                var c = new CustomEvent(i, {
                    detail: r.data
                });
                c.source = n.source, c.options = r.options, t.dispatchEvent(c);
                var h = new CustomEvent("*." + s, {
                    detail: r.data
                });
                h.source = n.source, h.options = r.options, h.originalType = i, t.dispatchEvent(h)
            } catch (p) {}
        }

        function p(e, n, r) {
            "addEventListener" in t ? t.addEventListener(e, n, r) : "attachEvent" in t && t.attachEvent("on" + e, n)
        }

        function d(e, n, r) {
            "removeEventListener" in t ? t.removeEventListener(e, n) : "detachEvent" in t && t.attachEvent("on" + e, n)
        }

        function v(e) {
            return new RegExp("^http(s)?:\\/\\/" + e.join("|") + "$", "i")
        }

        function m(e) {
            return new RegExp("\\.(?:" + e.join("|") + ")$")
        }

        function g(e) {
            return /\*/.test(e)
        }
        var r = ".*",
            i = ".postMessage",
            s = {
                targetOrigin: "*"
            },
            o = [r],
            u = v(o),
            a = [i],
            f = m(a),
            l = {},
            c = !1,
            y = e.frames = {
                postMessage: function(e, t, n, r) {
                    /\..+$/.test(t) || (t += i), r = r || {};
                    for (var o in s) r.hasOwnProperty(o) || (r[o] = s[o]);
                    e.postMessage(JSON.stringify({
                        type: t,
                        data: n,
                        options: r
                    }), r.targetOrigin)
                },
                receiveMessage: function(e, t, n, r) {
                    typeof e == "string" && (r = n, n = t, t = e, e = null), r = r || this;
                    var i = function(t) {
                        if (e && e !== t.source && e.contentWindow !== t.source) return;
                        n.apply(r, arguments)
                    };
                    return p(t, i), {
                        off: function() {
                            d(t, i)
                        }
                    }
                },
                proxy: function(e, t) {
                    this.listen(e), Object.prototype.toString.call(t) !== "[object Array]" && (t = [t]);
                    var n = l[e];
                    n ? n.targets = [].concat(n.targets, target) : n = {
                        targets: t
                    }, l[e] = n
                },
                receiveMessageOnce: function(e, t, n, r) {
                    var i = y.receiveMessage(e, t, function() {
                        n && n.apply(this, arguments), i.off()
                    }, r);
                    return i
                },
                addPostMessageOrigin: function(e) {
                    g(e) ? o = [r] : o.indexOf(e) === -1 && (y.removePostMessageOrigin(r), o.push(e), u = v(o))
                },
                removePostMessageOrigin: function(e) {
                    var t = o.indexOf(e);
                    t !== -1 && (o.splice(t, 1), u = v(o))
                },
                listen: function(e) {
                    a.indexOf(e) === -1 && (a.push(e), f = m(a)), c || (p("message", h), c = !0)
                },
                stopListening: function(e) {
                    var t = a.indexOf(e);
                    t !== -1 && (a.splice(t, 1), a.length ? f = m(a) : (d("message", h), c = !1))
                }
            }
    }(this.r = this.r || {}, this), ! function(e, t, n) {
        function f(e) {
            a && a(e)
        }
        var i, s, o, u, a;
        r.chatWebsockets = r.chatWebsockets || {}, r.chatWebsockets.setup = function(e) {
            if (!r.config.user_websocket_url) return;
            var t = "{t2_" + r.config.user_id.toString(36) + "}";
            s = t + "-websocket", o = t + "-chat", u = r.config.user_websocket_url, a = e;
            var n = new r.WebSocket(u);
            n.startPerBrowser(s, u, l, c)
        };
        var l = {
                "chat:request": function(e) {
                    f(e)
                },
                "chat:message": function(e) {
                    f(e)
                }
            },
            c = function(e) {
                if (e.key !== o) return
            }
    }(r, this), ! function(e, t, n) {
        function a(t, n) {
            e.frames.postMessage(i.contentWindow, t, n, {
                targetOrigin: s
            })
        }

        function f(e, t) {
            var n = document.createElement("iframe");
            return n.src = e, t.id && n.setAttribute("id", t.id), t.cssClass && n.setAttribute("class", t.cssClass), n.classList.add(r), n
        }

        function l() {
            e.frames.stopListening("chat"), document.body.removeChild(i)
        }

        function c(e) {
            var t = 2,
                n = 1;
            i.classList.add("active"), i.style.width = e.width + t + "px", i.style.height = e.height + n + "px"
        }

        function h(e) {
            function i(t) {
                return ['<a target="chat-app" id="chat-count" data-message-type="expand.chat" class="message-count" href="' + e.config.chat_url + '">', t, "</a>"].join("")
            }
            var t = u,
                n = "#chat-count",
                r = "active";
            return {
                isSelf: function(e) {
                    return $(e.target).is(t + ", " + n)
                },
                onSetUnreadCount: function(e) {
                    var s = Number(e && e.count),
                        o = e && e.unread || s > 0,
                        u = Number(e && e.countV2) || 0,
                        a = e && e.unreadV2 || u > 0;
                    o = o || a, s += u, o ? $(t).addClass(r) : $(t).removeClass(r);
                    var f = $(n);
                    f.length ? s > 0 ? f.text(s) : f.remove() : s > 0 && $(i(s)).insertAfter(t)
                }
            }
        }
        var r = "pinned-to-bottom",
            i, s, o, u = e.config.bermuda_chat_badging_enabled ? "#chat-v2" : "#chat";
        e.chat = e.chat || {}, e.chat.setup = function() {
            o = new h(e);
            if (i) return;
            var t = e.config.chat_initial_url;
            i = f(t, {
                id: "chat-app"
            }), s = e.utils.getUrlOrigin(t), e.chatWebsockets && e.chatWebsockets.setup(function(e) {
                a("websocket.chat", e)
            }), e.frames.listen("chat"), e.frames.receiveMessage(i, "resize.chat", function(e) {
                c(e.detail.dimensions || e.detail)
            }), e.frames.receiveMessage(i, "unreadCount.chat", function(e) {
                o.onSetUnreadCount(e.detail)
            }), e.frames.receiveMessage(i, "close.chat", function(e) {
                l()
            }), document.body.appendChild(i), $(document.body).on("click", 'a[target="chat-app"]', function(t) {
                if (!e.utils.isSimpleClickEvent(t)) return;
                t.preventDefault();
                const n = $(t.currentTarget).data("message-type");
                switch (n) {
                    case "expand.chat":
                        a(n, {
                            telemetry: {
                                action: "click",
                                noun: "chat",
                                source: "nav"
                            }
                        });
                        break;
                    case "navigate.chat":
                        a("navigate.chat", {
                            href: t.currentTarget.href
                        })
                }
            })
        }
    }(r, this), ! function(e, t) {
        function c() {
            if (u) return;
            h(), p(), u = !0
        }

        function h() {
            a = document.createElement("iframe"), a.src = n, a.classList.add(r, "chat-app-window", "regular", "hidden"), document.body.appendChild(a), t.addEventListener("message", m)
        }

        function p() {
            f = document.createElement("section"), f.setAttribute("id", "chat-app-minimized"), f.classList.add(r, "chat-app-window", "minimized", "hidden"), f.onclick = function() {
                l.expand()
            };
            var e = document.createElement("button");
            e.onclick = function(e) {
                e.stopPropagation(), e.preventDefault(), l.close()
            }, e.classList.add("c-close");
            var t = document.createElement("span");
            t.classList.add("chat-title-container"), t.appendChild(document.createTextNode("Chat")), f.appendChild(t), f.appendChild(e), document.body.appendChild(f)
        }

        function d(e) {
            var t = i,
                r = "#chat-count",
                s = $(r);
            s.length > 0 ? e > 0 ? s.text(e) : s.remove() : e > 0 && $('<a target="chat-app" id="chat-count" data-message-type="expand.chat" class="message-count" href="' + n + '">' + e + "</a>").insertAfter(t)
        }

        function v(e) {
            var t = "#chat-app-minimized .chat-title-container",
                n = "#chat-app-minimized .message-count-badge",
                r = $(n);
            r.length > 0 ? e > 0 ? r.text(e) : r.remove() : e > 0 && $(t).append('<span class="message-count-badge">' + e + "</span>")
        }

        function m(e) {
            if (!e || !e.data) return;
            if (e.data === s.close) l.close();
            else if (e.data === s.minimize) l.minimize();
            else if (e.data === s.maximize) l.minimize();
            else if (e.data.indexOf && e.data.indexOf(s.notifications) === 0) {
                var t = e.data.split(":")[1];
                d(t), v(t)
            }
        }
        var n = e.config.matrix_chat_url,
            r = "pinned-to-bottom",
            i = e.config.bermuda_chat_badging_enabled ? "#chat-v2" : "#chat",
            s = {
                close: "matrix-chat.close",
                minimize: "matrix-chat.minimize",
                maximize: "matrix-chat.maximize",
                loaded: "matrix-chat.loaded",
                notifications: "matrix-chat.notifications"
            },
            o = {
                expand: "expand.chat",
                navigate: "navigate.chat"
            },
            u = !1,
            a, f, l = e.matrixChat = {};
        l.setup = function() {
            $(document.body).on("click", 'a[target="chat-app"]', function(t) {
                if (!e.utils.isSimpleClickEvent(t)) return;
                t.preventDefault();
                var n = $(t.currentTarget).data("message-type");
                n === o.expand && l.expand(), n === o.navigate && (l.expand(), a.src = $(t.currentTarget).attr("href"))
            })
        }, l.expand = function() {
            u || c(), a.classList.remove("hidden"), f.classList.add("hidden")
        }, l.minimize = function() {
            u || c(), a.classList.add("hidden"), f.classList.remove("hidden")
        }, l.close = function() {
            u || c(), a.classList.add("hidden"), f.classList.add("hidden")
        }
    }(r, this), $(function() {
        if (!r.config.logged || !r.config.chat_url) return;
        r.config.matrix_chat_enabled ? r.matrixChat.setup() : r.chat.setup()
    }), ! function(e, t) {
        function n(e) {
            if (e === 0) return;
            if (t("#notifications + .badge-count").length) t("#notifications + .badge-count").text(e);
            else {
                var n = t('<a class="badge-count" href="https://reddit.com/notifications"></a>');
                n.text(e), n.insertAfter("#notifications")
            }
        }

        function r(n) {
            if (n === 0) return;
            if (t("#chat-v2 + .badge-count").length) t("#chat-v2 + .badge-count").text(n);
            else {
                var r = t('<a target="chat-app" id="chat-count" data-message-type="expand.chat" class="badge-count" href="' + e.config.chat_url + '"></a>');
                r.text(n), r.insertAfter("#chat-v2")
            }
        }
        e.badgeIndicators = {
            init: function() {
                e.ajax({
                    type: "GET",
                    url: e.config.announcements_domain + "/api/badge_indicators/v1",
                    error: function() {
                        e.warn("Error fetching badge indicator data")
                    }
                }).then(function(t) {
                    if (!t.data) return;
                    e.config.bermuda_notification_badging_enabled && n(t.data.inbox), e.config.bermuda_chat_badging_enabled && r(t.data.chat)
                })
            }
        }
    }(r, jQuery), $(function() {
        (r.config.bermuda_notification_badging_enabled || r.config.bermuda_chat_badging_enabled) && r.badgeIndicators.init()
    });