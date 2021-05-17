if (window.location.href == "https://cardgames.io/chess/"){   
! function a(o, s, l) {
    function c(t, e) {
        if (!s[t]) {
            if (!o[t]) {
                var i = "function" == typeof require && require;
                if (!e && i) return i(t, !0);
                if (h) return h(t, !0);
                var r = new Error("Cannot find module '" + t + "'");
                throw r.code = "MODULE_NOT_FOUND", r
            }
            var n = s[t] = {
                exports: {}
            };
            o[t][0].call(n.exports, function(e) {
                return c(o[t][1][e] || e)
            }, n, n.exports, a, o, s, l)
        }
        return s[t].exports
    }
    for (var h = "function" == typeof require && require, e = 0; e < l.length; e++) c(l[e]);
    return c
}({
    1: [function(e, t, i) {
        "use strict";
        var ae = e("../shared/helper-functions").captainsLog,
            oe = e("./chess-stringchess");
        t.exports = function(z) {
            function $(e) {
                if (ne) {
                    var t = oe.sc_hash(e);
                    if (t[0] in ie && t[1] in ie[t[0]]) return ie[t[0]][t[1]]
                }
                return null
            }

            function S(e, t, i, r) {
                if (ne) {
                    var n = oe.sc_hash(e);
                    n[0] in ie || (ie[n[0]] = {});
                    var a = {
                        depth: t,
                        lower: i,
                        upper: r
                    };
                    ie[n[0]][n[1]] = a
                }
            }
            var V = e("./chess.js"),
                Q = e("./chess-enums.js"),
                Y = 2e3,
                J = 3,
                X = 0,
                Z = 0,
                ee = 0,
                te = 0,
                ie = {},
                re = 0,
                ne = !1;
            z.processMessage = function(e) {
                var t = new V.Table(e.data.table),
                    i = t.nextTurnColor;
                Y = e.data.timeout, J = e.data.iterations, ne = !!e.data.transpos && e.data.transpos, ie = {}, e.data.debug && (ae.level = "debug");
                var r, n = oe.sc_getTableString(t),
                    a = Date.now(),
                    o = 1,
                    s = {},
                    l = null,
                    c = {},
                    h = {},
                    u = [];
                r = i == Q.Colors.White ? (u = t.allLegalMoves(Q.Colors.White), oe.sc_nextMoves(n, Q.Colors.White)) : (u = t.allLegalMoves(Q.Colors.Black), oe.sc_nextMoves(n, Q.Colors.Black));
                var f = function() {
                        if (m) {
                            if (g >= d.length) return "break";
                            p = d[g++]
                        } else {
                            if ((g = d.next()).done) return "break";
                            p = g.value
                        }
                        var e = p;
                        0 < e.promotion && e.piece.name === Q.Pieces.Pawn && (e.table.getPiece(e.toFile, e.toRank).name = e.promotion);
                        var t = oe.sc_getTableString(e.table),
                            i = r.find(function(e) {
                                return e === t
                            });
                        i && (c[i] = e.toString(), h[e.toString()] = 0)
                    },
                    d = u,
                    m = Array.isArray(d),
                    g = 0;
                for (d = m ? d : d[Symbol.iterator]();;) {
                    var p;
                    if ("break" === f()) break
                }
                var v = r,
                    y = Array.isArray(v),
                    b = 0;
                for (v = y ? v : v[Symbol.iterator]();;) {
                    var k;
                    if (y) {
                        if (b >= v.length) break;
                        k = v[b++]
                    } else {
                        if ((b = v.next()).done) break;
                        k = b.value
                    }
                    var w = k,
                        $ = i === Q.Colors.White ? Q.Colors.Black : Q.Colors.White;
                    if (oe.sc_check(w, $) && 0 === oe.sc_nextMoves(w, $).length) {
                        var S = {};
                        return S[c[w]] = 0, void z.postMessage({
                            "moves": {
                                1: c[w]
                            },
                            ranking: S
                        })
                    }
                }
                var C = i === Q.Colors.White ? 1 : -1;
                r.sort(function(e, t) {
                    var i = (t.match(/-/g) || []).length - (e.match(/-/g) || []).length;
                    return 0 == i ? C * (oe.sc_evaluateTable(t) - oe.sc_evaluateTable(e)) : i
                });
                for (var M = !1; !M && o <= J;) {
                    ae.debug("Starting on depth " + o);
                    var x = Date.now(),
                        P = {};
                    if (i == Q.Colors.White) {
                        var A = -999999,
                            T = r,
                            E = Array.isArray(T),
                            I = 0;
                        for (T = E ? T : T[Symbol.iterator]();;) {
                            var O;
                            if (E) {
                                if (I >= T.length) break;
                                O = T[I++]
                            } else {
                                if ((I = T.next()).done) break;
                                O = I.value
                            }
                            var D = O;
                            if (Date.now() >= a + Y) {
                                M = !(l = null);
                                break
                            }
                            var G = z.getMin(o, D, -99999, 99999, a);
                            A < (P[D] = G) && (A = G, l = D)
                        }
                    } else {
                        var R = 999999,
                            N = r,
                            L = Array.isArray(N),
                            F = 0;
                        for (N = L ? N : N[Symbol.iterator]();;) {
                            var _;
                            if (L) {
                                if (F >= N.length) break;
                                _ = N[F++]
                            } else {
                                if ((F = N.next()).done) break;
                                _ = F.value
                            }
                            var W = _;
                            if (Date.now() >= a + Y) {
                                M = !(l = null);
                                break
                            }
                            var q = z.getMax(o, W, -99999, 99999, a);
                            P[W] = -q, q < R && (R = q, l = W)
                        }
                    }
                    if (l) {
                        s[o] = c[l];
                        var B = r,
                            U = Array.isArray(B),
                            j = 0;
                        for (B = U ? B : B[Symbol.iterator]();;) {
                            var K;
                            if (U) {
                                if (j >= B.length) break;
                                K = B[j++]
                            } else {
                                if ((j = B.next()).done) break;
                                K = j.value
                            }
                            var H = K;
                            h[c[H]] = P[H]
                        }
                    }
                    o++, ae.debug("Iteration finished in " + (Date.now() - x) + "ms")
                }
                ae.debug("=========AI WORKER RESULT========="), ae.debug("Evaluated " + X + " board positions"), ae.debug("Reached depth " + (o - 1)), ae.debug("AlphaBetapruning cut off search  " + (Z + ee) + " times(" + Z + " alpha, " + ee + "beta)"), ae.debug("Transposition hash table cut off search  " + te + " times"), ae.debug("Transposition hash returned something " + re + " times"), ae.debug("=================="), ae.debug("Returning moves"), z.postMessage({
                    "moves": s,
                    "ranking": h
                }), z.close()
            }, z.addEventListener("message", z.processMessage), z.getMin = function(e, t, i, r, n) {
                X++;
                var a = $(t);
                if (a && (re++, a.depth >= e)) {
                    if (a.lower && a.lower >= r) return te++, a.lower;
                    if (a.upper && a.upper <= i) return te++, a.upper;
                    i = Math.max(i, a.upper), r = Math.min(r, a.lower)
                }
                if (n + Y <= Date.now()) return -99999;
                if (0 == e) return oe.sc_evaluateTable(t);
                var o = oe.sc_nextMoves(t, 1);
                if (0 == o.length) return oe.sc_check(t, 1) ? 99999 : oe.sc_check(t, 0) ? -99999 : 0;
                if (ne) {
                    var s = [],
                        l = o,
                        c = Array.isArray(l),
                        h = 0;
                    for (l = c ? l : l[Symbol.iterator]();;) {
                        var u;
                        if (c) {
                            if (h >= l.length) break;
                            u = l[h++]
                        } else {
                            if ((h = l.next()).done) break;
                            u = h.value
                        }
                        var f = u,
                            d = $(f);
                        d && d.depth === e && s.push(f)
                    }
                    o.sort(function(e, t) {
                        return s.indexOf(t) - s.indexOf(e)
                    })
                }
                var m, g, p = 99999,
                    v = o,
                    y = Array.isArray(v),
                    b = 0;
                for (v = y ? v : v[Symbol.iterator]();;) {
                    var k;
                    if (y) {
                        if (b >= v.length) break;
                        k = v[b++]
                    } else {
                        if ((b = v.next()).done) break;
                        k = b.value
                    }
                    var w = k;
                    if (p = Math.min(p, z.getMax(e - 1, w, i, r)), (r = Math.min(r, p)) <= i) {
                        ee++;
                        break
                    }
                }
                return g = m = null, p <= i && (m = p), i < p && p < r && (g = m = p), r <= p && (g = p), S(t, e, g, m), p
            }, z.getMax = function(e, t, i, r, n) {
                var a = $(t);
                if (a && (re++, a.depth >= e)) {
                    if (a.lower && a.lower >= r) return te++, a.lower;
                    if (a.upper && a.upper <= i) return te++, a.upper;
                    i = Math.max(i, a.upper), r = Math.min(r, a.lower)
                }
                if (X++, n + Y <= Date.now()) return 99999;
                if (0 == e) return oe.sc_evaluateTable(t);
                var o = oe.sc_nextMoves(t, 0);
                if (0 == o.length) return oe.sc_check(t, 1) ? 99999 : oe.sc_check(t, 0) ? -99999 : 0;
                if (ne) {
                    var s = [],
                        l = o,
                        c = Array.isArray(l),
                        h = 0;
                    for (l = c ? l : l[Symbol.iterator]();;) {
                        var u;
                        if (c) {
                            if (h >= l.length) break;
                            u = l[h++]
                        } else {
                            if ((h = l.next()).done) break;
                            u = h.value
                        }
                        var f = u,
                            d = $(f);
                        d && d.depth === e && s.push(f)
                    }
                    o.sort(function(e, t) {
                        return s.indexOf(t) - s.indexOf(e)
                    })
                }
                var m, g, p = -99999,
                    v = o,
                    y = Array.isArray(v),
                    b = 0;
                for (v = y ? v : v[Symbol.iterator]();;) {
                    var k;
                    if (y) {
                        if (b >= v.length) break;
                        k = v[b++]
                    } else {
                        if ((b = v.next()).done) break;
                        k = b.value
                    }
                    var w = k;
                    if (p = Math.max(p, z.getMin(e - 1, w, i, r)), r <= (i = Math.max(i, p))) {
                        Z++;
                        break
                    }
                }
                return g = m = null, p <= i && (m = p), i < p && p < r && (g = m = p), r <= p && (g = p), S(t, e, g, m), p
            }
        }
    }, {
        "../shared/helper-functions": 19,
        "./chess-enums.js": 4,
        "./chess-stringchess": 9,
        "./chess.js": 11
    }],
    2: [function(e, t, i) {
        "use strict";
        var r = e("./chess-web");
        $(document).ready(function() {
            window.app = new r
        })
    }, {
        "./chess-web": 10
    }],
    3: [function(n, e, t) {
        "use strict";

        function a(e, t) {
            e.prototype = Object.create(t.prototype), (e.prototype.constructor = e).__proto__ = t
        }
        var i = n("./player"),
            I = n("./chess-enums"),
            o = n("./workify"),
            O = (n("./chess-stringchess").sc_getTableString, I.PieceValues, I.Pieces),
            s = I.Colors,
            D = n("../shared/helper-functions").captainsLog,
            r = function(i) {
                function e(e, t) {
                    return i.call(this, e, t) || this
                }
                a(e, i);
                var t = e.prototype;
                return t.setBook = function() {}, t.makeMove = function(e) {
                    this.isMoving = !0;
                    var t = e[Math.floor(Math.random() * e.length)];
                    this.game.makeMove(this, t)
                }, e
            }(i),
            l = function(i) {
                function e(e, t) {
                    return i.call(this, e, t) || this
                }
                a(e, i);
                var t = e.prototype;
                return t.setBook = function() {}, t.makeMove = function(e) {
                    this.isMoving = !0, e.some(function(e) {
                        return !e.table
                    }) && D.debug("NOT ALL MOVES HAVE NEXT TABLE");
                    var t = e.find(function(e) {
                        return e.mate
                    }) || e.find(function(e) {
                        return e.check
                    }) || e.find(function(e) {
                        return e.kills
                    }) || e[Math.floor(Math.random() * e.length)];
                    this.game.makeMove(this, t)
                }, e
            }(i),
            c = function(r) {
                function e(e, t) {
                    var i;
                    return (i = r.call(this, e, t) || this).garboWorker = o(n("./garbochess")), i.garboWorker.addEventListener("message", function(e) {
                        return i.receiveMessage(e)
                    }), i.isMoving = !1, i.timeout = 800, i.delay = !0, i
                }
                a(e, r);
                var t = e.prototype;
                return t.setBook = function() {}, t.makeMove = function(e) {
                    this.turnStart = Date.now(), this.legalMoves = e;
                    var t = this.game.table.toFen();
                    this.garboWorker.postMessage("position " + t), this.garboWorker.postMessage("search " + this.timeout)
                }, t.handleError = function(e) {
                    D.error(e), setTimeout(function() {
                        throw new Error("GARBOERROR " + e)
                    })
                }, t.receiveMessage = function(e) {
                    var t = e.data;
                    if (t.match(/^ERROR/)) this.handleError(t);
                    else if (this.legalMoves) {
                        if (D.debug("GARBO MESSAGE: " + t), !t.match(/^pv /)) {
                            D.debug("GARBO CHOSEN MOVE: " + t);
                            var i = this.legalMoves,
                                r = Array.isArray(i),
                                n = 0;
                            for (i = r ? i : i[Symbol.iterator]();;) {
                                var a;
                                if (r) {
                                    if (n >= i.length) break;
                                    a = i[n++]
                                } else {
                                    if ((n = i.next()).done) break;
                                    a = n.value
                                }
                                var o = a;
                                if (t === o.toString().toLowerCase().substr(1)) return delete this.legalMoves, void this.moveReady(o)
                            }
                            var s = "",
                                l = this.legalMoves,
                                c = Array.isArray(l),
                                h = 0;
                            for (l = c ? l : l[Symbol.iterator]();;) {
                                var u;
                                if (c) {
                                    if (h >= l.length) break;
                                    u = l[h++]
                                } else {
                                    if ((h = l.next()).done) break;
                                    u = h.value
                                }
                                var f = u.toString().toLowerCase().substr(1);
                                s += '\n$ "' + t + '"==="' + f + '" : ' + (t === f) + '. "' + t + '"=="' + f + '" : ' + (t == f) + ". LengthMsg: " + t.length + ", LengthMstr: " + f.length + ", typeMsg: " + typeof t + ", typeMstr: " + f
                            }
                            this.handleError("NO MOVE FOUND: " + t + ", available: " + this.legalMoves.map(function(e) {
                                return e.toString()
                            }) + ", FEN=" + this.game.table.toFen() + s);
                            var d = this.legalMoves[Math.floor(Math.random() * this.legalMoves.length)];
                            delete this.legalMoves, this.moveReady(d)
                        }
                    } else this.handleError("GOT MESSAGE WHEN ITS NOT MY TURN " + t)
                }, t.moveReady = function(e) {
                    var t = this,
                        i = Date.now() - this.turnStart;
                    i < 1e3 && this.delay ? (D.debug("DONE TOO FAST, DELAYING BY " + (1e3 - i)), setTimeout(function() {
                        return t.game.makeMove(t, e)
                    }, 1e3 - i)) : (D.debug("FINISHED IN " + i + "ms"), this.game.makeMove(this, e))
                }, e
            }(i),
            h = function(r) {
                function e(e, t) {
                    var i;
                    i = r.call(this, e, t) || this;
                    try {
                        i.currentPage = n("./assets/openingBook.json"), D.debug("Loaded book")
                    } catch (e) {
                        D.debug("Failed to load book, running in browser...")
                    }
                    return i.using_book = !0, i.delay = !0, i.difficulty = "medium", i.aiWorker = n("./chess-ai-worker.js"), i.endGame = !1, i.history = {}, i
                }
                a(e, r);
                var t = e.prototype;
                return t.setBook = function(e) {
                    D.debug("Got my book!"), this.currentPage = e
                }, t.getDestMove = function(e) {
                    return e.match(/[a,b,c,d,e,f,g,h][0-9]/g)
                }, t.moveReady = function(e) {
                    var t = this,
                        i = this.game.table.toFen(!0);
                    i in this.history || (this.history[i] = {}), this.game.table.toFen(!0) && (this.history[i][e.toString()] = this.history[i][e.toString()] + 1 | 1);
                    var r = Date.now() - this.turnStart;
                    r < 1e3 && this.delay ? (D.debug("DONE TOO FAST, DELAYING BY " + (1e3 - r)), setTimeout(function() {
                        return t.game.makeMove(t, e)
                    }, 1e3 - r)) : (D.debug("FINISHED IN " + r + "ms"), this.game.makeMove(this, e))
                }, t.logError = function(e) {
                    D.debug(e)
                }, t.makeMove = function(e) {
                    if (1 != e.length) {
                        var t = this.game.table.toFen(!0);
                        if (t in this.history || (this.history[t] = {}), this.endGame) this.makeEndgameMove(e);
                        else {
                            var i = this.game.table.allPieces.filter(function(e) {
                                    return e.color === s.White && e.name === O.Pawn && e.rank
                                }).length,
                                r = this.game.table.allPieces.filter(function(e) {
                                    return e.color === s.Black && e.name !== O.Pawn && e.rank
                                }).length - 1,
                                n = this.game.table.allPieces.filter(function(e) {
                                    return e.color === s.Black && e.name === O.Pawn && e.rank
                                }).length,
                                a = this.game.table.allPieces.filter(function(e) {
                                    return e.color === s.White && e.name !== O.Pawn && e.rank
                                }).length - 1;
                            i + n <= 5 || r + a <= 5 || i <= 3 && a <= 3 || a <= 2 || n <= 3 && r <= 3 || r <= 2 ? (this.endGame = !0, this.makeEndgameMove(e)) : this.makeNormalMove(e)
                        }
                    } else this.moveReady(e[0])
                }, t.makeNormalMove = function(e) {
                    var t = this,
                        i = {
                            easy: {
                                timeout: 2e3,
                                iterations: 1,
                                examineCutoff: 0
                            },
                            medium: {
                                timeout: 2e3,
                                iterations: 2,
                                examineCutoff: 0
                            },
                            hard: {
                                timeout: 4e3,
                                iterations: 4,
                                examineCutoff: 0
                            }
                        };
                    if (!this.currentPage) {
                        this.bookWait || (this.bookWait = Date.now());
                        var r = Date.now() - this.bookWait;
                        if (!(3e3 < r)) return D.debug("Waiting for book for max " + (3e3 - r) + " more milliseconds"), void setTimeout(function() {
                            return t.makeMove(e)
                        }, 200);
                        D.debug("Abort waiting for book, we can't wait all day...!"), this.using_book = !1
                    }
                    if (this.turnStart = Date.now(), this.using_book && "easy" !== this.difficulty) {
                        var n = this.game.getLastMove();
                        if (n) {
                            var a = n.shortString();
                            if (a in this.currentPage) this.currentPage = this.currentPage[a][1];
                            else {
                                D.debug("My opponent played off script. Improvising.");
                                var o = {};
                                for (var s in this.currentPage) {
                                    var l = void 0;
                                    if ("O-O" === s || "O-O-O" === s || "0-0" === s || "0-0-0" === s) o[s] = 0;
                                    else {
                                        try {
                                            l = this.getDestMove(s)[0]
                                        } catch (e) {
                                            ! function() {
                                                var e = s;
                                                setTimeout(function() {
                                                    throw new Error("Got null back for this move:" + e)
                                                }, 200)
                                            }()
                                        }
                                        if (!l) return this.using_book = !1, void this.makeMinMax(e, i);
                                        var c = I.FileLetter.indexOf(l[0]),
                                            h = l[1],
                                            u = void(o[s] = 0);
                                        u = s[0] == s[0].toUpperCase() ? s[0] : "P", (u = I.PieceLetterLookup[u]) == n.piece.name && (o[s] += 10), u == O.Pawn && n.fromFile == n.toFile && (o[s] += 20);
                                        var f = -Math.abs(n.fromFile - c),
                                            d = -Math.abs(n.fromRank - h);
                                        u != O.Bishop && u != O.Queen || f == d && 0 < f && (o[s] += 20), u == O.Knight && (1 != f && 1 != d || (o[s] += 20)), u != O.Rook && u != O.Queen || (n.fromFile == c && n.fromRank != h || n.fromFile != c && n.fromRank == h) && (o[s] += 20), o[s] += Math.abs(n.toFile - c) / 2, o[s] += Math.abs(n.toRank - h) / 2
                                    }
                                    D.debug(s + " = " + o[s])
                                }
                                var m = -1,
                                    g = null;
                                for (var p in o) o[p] > m && (m = o[p], g = p);
                                if (D.debug("Most similar move was " + g), !g) return this.using_book = !1, void this.makeMinMax(e, i);
                                this.currentPage = this.currentPage[g][1], this.using_book = !1
                            }
                        }
                        var v = 0;
                        for (var y in this.currentPage) v += this.currentPage[y][0];
                        if (0 == v) return D.debug("I've run out of opening moves"), this.using_book = !1, void this.makeMinMax(e, i);
                        D.debug("Selecting move from book"), D.debug("Total = " + v);
                        var b = Math.random() * v;
                        for (var k in D.debug("Diecast = " + b), this.currentPage)
                            if ((b -= this.currentPage[k][0]) <= 0) {
                                var w = e,
                                    $ = Array.isArray(w),
                                    S = 0;
                                for (w = $ ? w : w[Symbol.iterator]();;) {
                                    var C;
                                    if ($) {
                                        if (S >= w.length) break;
                                        C = w[S++]
                                    } else {
                                        if ((S = w.next()).done) break;
                                        C = S.value
                                    }
                                    var M = C;
                                    if (M.shortString() === k) return this.currentPage = this.currentPage[k][1], void this.moveReady(M)
                                }
                                D.debug("err, there is a typo in my book. :(");
                                var x = e,
                                    P = Array.isArray(x),
                                    A = 0;
                                for (x = P ? x : x[Symbol.iterator]();;) {
                                    var T;
                                    if (P) {
                                        if (A >= x.length) break;
                                        T = x[A++]
                                    } else {
                                        if ((A = x.next()).done) break;
                                        T = A.value
                                    }
                                    var E = T;
                                    D.debug(E.shortString())
                                }
                                return D.debug("type = " + k), this.using_book = !1, void this.makeMinMax(e, i)
                            }
                    } else this.makeMinMax(e, i)
                }, t.makeEndgameMove = function(e) {
                    this.makeMinMax(e, {
                        easy: {
                            timeout: 3e3,
                            iterations: 3,
                            examineCutoff: 10
                        },
                        medium: {
                            timeout: 3500,
                            iterations: 4,
                            examineCutoff: 10
                        },
                        hard: {
                            timeout: 4e3,
                            iterations: 4,
                            examineCutoff: 10
                        }
                    })
                }, t.makeMinMax = function(C, e) {
                    var M = this;
                    this.isMoving = !0;
                    var x = this.game.table.toFen(!0),
                        P = o(this.aiWorker);
                    P.isFakeWebWorker ? D.debug("Using Fake Web Worker") : D.debug("Using Real Web Worker"), P.addEventListener("message", function(e) {
                        D.debug("Got ranking! "), D.debug(e.data.ranking);
                        var t = e.data.ranking;
                        for (var i in t) {
                            var r = 0 | M.history[x][i];
                            t[i] *= Math.pow(.9, 1 + r)
                        }
                        var n = [];
                        for (var a in t) {
                            var o = t[a];
                            n.push({
                                key: a,
                                score: o
                            })
                        }
                        n.sort(function(e, t) {
                            return t.score - e.score
                        });
                        var s = [],
                            l = C,
                            c = Array.isArray(l),
                            h = 0;
                        for (l = c ? l : l[Symbol.iterator]();;) {
                            var u;
                            if (c) {
                                if (h >= l.length) break;
                                u = l[h++]
                            } else {
                                if ((h = l.next()).done) break;
                                u = h.value
                            }
                            var f = u;
                            s.push(f.toString())
                        }
                        for (var d = 0; d < n.length; d++)
                            if (-1 !== s.indexOf(n[d].key)) {
                                var m = M.game.table.parseMove(n[d].key);
                                return M.moveReady(m), void P.terminate()
                            } M.logError("None of the moves fit, legal moves were: " + s + ", Board State: " + M.game.table.toUrl());
                        var g = M.game.currentPlayer == I.Colors.White ? 1 : -1,
                            p = null,
                            v = null,
                            y = C,
                            b = Array.isArray(y),
                            k = 0;
                        for (y = b ? y : y[Symbol.iterator]();;) {
                            var w;
                            if (b) {
                                if (k >= y.length) break;
                                w = y[k++]
                            } else {
                                if ((k = y.next()).done) break;
                                w = k.value
                            }
                            var $ = w,
                                S = $.table.evalTable();
                            p ? v < S * g && (p = $, v = S * g) : (p = $, v = S * g)
                        }
                        M.moveReady(p), P.terminate()
                    });
                    var t = e[this.difficulty],
                        i = t.timeout,
                        r = t.iterations,
                        n = t.examineCutoff;
                    P.postMessage({
                        table: this.game.table.toFen(),
                        debug: this.debug,
                        timeout: i,
                        iterations: r,
                        transpos: !0,
                        examineCutoff: n
                    })
                }, e
            }(i),
            u = function(i) {
                function e(e, t) {
                    return i.call(this, e, t) || this
                }
                return a(e, i), e
            }(h);
        e.exports = {
            RandomPlayer: r,
            BookPlayer: h,
            JohnWick: l,
            GarboChessPlayer: c,
            CandidatePlayer: u
        }
    }, {
        "../shared/helper-functions": 19,
        "./chess-ai-worker.js": 1,
        "./chess-enums": 4,
        "./chess-stringchess": 9,
        "./garbochess": 12,
        "./player": 13,
        "./workify": 14
    }],
    4: [function(e, t, i) {
        "use strict";
        var r, n = Object.freeze({
                White: 0,
                Black: 1
            }),
            a = Object.freeze({
                Pawn: 0,
                Rook: 1,
                Knight: 2,
                Bishop: 3,
                Queen: 4,
                King: 5
            }),
            o = Object.freeze([null, "a", "b", "c", "d", "e", "f", "g", "h"]),
            s = Object.freeze({
                P: 0,
                R: 1,
                N: 2,
                B: 3,
                Q: 4,
                K: 5
            }),
            l = Object.freeze(((r = {})[a.Pawn] = "p", r[a.Rook] = "r", r[a.Knight] = "n", r[a.Bishop] = "b", r[a.Queen] = "q", r[a.King] = "k", r)),
            c = {};
        for (var h in l) {
            c[l[h]] = parseInt(h)
        }
        var u = {};
        for (var f in a) u[a[f]] = f;
        u = Object.freeze(u);
        var d = Object.freeze({
                0: 1,
                1: 5,
                2: 3,
                3: 3,
                4: 9,
                5: 0
            }),
            m = Object.freeze({
                0: 1,
                1: 5,
                2: 3.25,
                3: 3.5,
                4: 9,
                5: 105
            }),
            g = {},
            p = {};
        g[a.Pawn] = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [.75, .75, .75, .75, .75, .75, .75, .75],
            [.2, .2, .3, .5, .5, .3, .2, 0, 2],
            [.05, .05, .1, .3, .3, .1, .05, .05],
            [0, 0, 0, .2, .2, 0, 0, 0],
            [0, -.1, -.15, 0, 0, -.2, -.1, 0],
            [.05, .1, .1, -.25, -.25, .1, .1, .05],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ], p[a.Pawn] = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [.1, .1, .1, .1, .1, .1, .1, .1],
            [.075, .075, .075, .075, .075, .075, .075, .075],
            [.05, .05, .05, .05, .05, .05, .05, .05],
            [-.05, -.05, -.05, -.05, -.05, -.05, -.05, -.05],
            [-.1, -.1, -.1, -.1, -.1, -.1, -.1, -.1],
            [-.25, -.25, -.25, -.25, -.25, -.25, -.25, -.25],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ], g[a.Knight] = [
            [-.5, -.3, -.2, -.2, -.2, -.2, -.3, -.5],
            [-.3, -.2, 0, .1, .1, 0, -.2, -.3],
            [-.2, 0, .15, .2, .2, .15, 0, -.2],
            [-.2, .1, .2, .3, .3, .2, .1, -.2],
            [-.2, .1, .2, .3, .3, .2, .1, -.2],
            [-.2, 0, .15, .2, .2, .15, 0, -.2],
            [-.3, -.2, 0, .1, .1, 0, -.2, -.3],
            [-.5, -.2, -.2, -.2, -.2, -.2, -.3, -.5]
        ], p[a.Knight] = [
            [-.5, -.3, -.2, -.2, -.2, -.2, -.3, -.5],
            [-.3, -.2, 0, .1, .1, 0, -.2, -.3],
            [-.2, 0, .15, .2, .2, .15, 0, -.2],
            [-.2, .1, .2, .3, .3, .2, .1, -.2],
            [-.2, .1, .2, .3, .3, .2, .1, -.2],
            [-.2, 0, .15, .2, .2, .15, 0, -.2],
            [-.3, -.2, 0, .1, .1, 0, -.2, -.3],
            [-.5, -.2, -.2, -.2, -.2, -.2, -.3, -.5]
        ], g[a.Bishop] = [
            [-.2, -.1, -.1, -.1, -.1, -.1, -.1, -.2],
            [-.1, 0, 0, 0, 0, 0, 0, -.1],
            [-.1, 0, .05, .1, .1, .05, 0, -.1],
            [-.1, .1, .15, .2, .2, .15, .1, -.1],
            [-.1, .1, .15, .2, .2, .15, .1, -.1],
            [-.1, .05, .1, .1, .1, .1, .05, -.1],
            [-.1, .1, .15, .1, .1, .15, .1, -.1],
            [-.2, -.1, -.1, -.1, -.1, -.1, -.1, -.2]
        ], p[a.Bishop] = [
            [-.3, -.2, -.2, -.2, -.2, -.2, -.2, -.3],
            [-.2, 0, 0, 0, 0, 0, 0, -.1],
            [-.2, 0, .05, .1, .1, .05, 0, -.2],
            [-.2, 0, .15, .2, .2, .15, .1, -.2],
            [-.2, 0, .15, .2, .2, .15, .1, -.2],
            [-.2, 0, .1, .1, .1, .1, 0, -.2],
            [-.2, 0, 0, 0, 0, 0, 0, -.2],
            [-.3, -.2, -.2, -.2, -.2, -.2, -.2, -.3]
        ], g[a.Rook] = [
            [.1, .1, .1, .1, .1, .1, .1, .1],
            [-.1, .1, .1, .1, .1, .1, .1, -.1],
            [-.1, .55, .2, .2, .2, .2, .15, -.1],
            [-.1, .2, .2, .25, .25, .2, .2, -.1],
            [-.1, .55, .2, .25, .25, .2, .2, -.1],
            [-.1, .15, .2, .2, .2, .2, .15, -.1],
            [-.1, .1, .1, .1, .1, .1, .1, -.1],
            [.1, 0, .2, .21, .21, .2, 0, .1]
        ], p[a.Rook] = [
            [-.2, -.1, -.1, -.1, -.1, -.1, -.1, -.2],
            [-.1, .2, .2, .2, .2, .2, .2, -.1],
            [-.1, .3, .3, .3, .3, .3, .3, -.1],
            [-.1, .3, .3, .3, .3, .3, .3, -.1],
            [-.1, .3, .3, .3, .3, .3, .3, -.1],
            [-.1, .3, .3, .3, .3, .3, .3, -.1],
            [-.1, .2, .2, .2, .2, .2, .2, -.1],
            [-.2, -.1, -.1, -.1, -.1, -.1, -.1, -.2]
        ], g[a.Queen] = [
            [-.2, -.1, -.1, -.1, -.1, -.1, -.1, -.2],
            [-.1, .1, .1, .1, .1, .1, .1, -.1],
            [-.1, 0, .05, .1, .1, .05, 0, -.1],
            [-.1, .1, .1, .2, .2, .1, .1, -.1],
            [-.1, .1, .1, .2, .2, .1, .1, -.1],
            [-.1, .05, .1, .1, .1, .1, .05, -.1],
            [-.1, .1, .1, .1, .1, .1, .1, -.1],
            [-.2, -.1, -.1, -.1, -.1, -.1, -.1, -.2]
        ], p[a.Queen] = [
            [-.2, -.2, -.2, -.2, -.2, -.2, -.2, -.2],
            [-.2, .1, .1, .1, .1, .1, .1, -.2],
            [-.2, 0, .05, .1, .1, .05, 0, -.2],
            [-.2, .1, .1, .2, .2, .1, .1, -.2],
            [-.2, .1, .1, .2, .2, .1, .1, -.2],
            [-.2, .05, .1, .1, .1, .1, .05, -.2],
            [-.2, .1, .1, .1, .1, .1, .1, -.2],
            [-.2, -.2, -.2, -.2, -.2, -.2, -.2, -.2]
        ], g[a.King] = [
            [-.2, -.25, -.3, -.4, -.4, -.3, -.25, -.2],
            [-.15, -.2, -.25, -.3, -.3, -.25, -.2, -.15],
            [-.1, -.15, -.2, -.25, -.25, -.2, -.15, -.1],
            [-.1, -.15, -.2, -.25, -.25, -.2, -.15, -.1],
            [-.1, -.15, -.2, -.25, -.25, -.2, -.15, -.1],
            [-.1, -.15, -.2, -.25, -.25, -.2, -.15, -.1],
            [.1, .05, 0, 0, 0, 0, .05, .1],
            [.2, .3, -.1, 0, 0, -.1, .3, .2]
        ], p[a.King] = [
            [-.4, -.15, -.15, -.15, -.15, -.15, -.15, -.4],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, .05, .05, .05, .05, 0, 0],
            [0, 0, .1, .2, .2, .1, 0, 0],
            [0, 0, .1, .2, .2, .1, 0, 0],
            [0, 0, .05, .1, .1, .05, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [-.4, -.1, -.1, -.1, -.1, -.1, -.1, -.4]
        ];
        for (var v = [], y = 0; y < 64; y++) {
            v[y] = {};
            for (var b = 0, k = ["p", "q", "r", "n", "k", "b", "B", "P", "Q", "R", "N", "K"]; b < k.length; b++) {
                var w = k[b],
                    $ = Math.floor(Math.random() * Math.pow(2, 32)),
                    S = Math.floor(Math.random() * Math.pow(2, 32));
                v[y][w] = [$, S]
            }
        }
        t.exports = {
            Colors: n,
            Pieces: a,
            FileLetter: o,
            PieceNameLookup: u,
            SymbolsToNames: c,
            PieceSymbols: l,
            PieceLetterLookup: s,
            PieceValues: d,
            pst_start: g,
            pst_end: p,
            CentiPieceValues: m,
            minizobrist: v
        }
    }, {}],
    5: [function(e, t, i) {
        "use strict";
        var r = e("./player"),
            a = e("./chess-sounds"),
            o = e("../shared/multiplayer/multiplayer-util").AutoPlayTimer,
            n = function(n) {
                function e(e, t, i) {
                    var r;
                    return (r = n.call(this, e, t) || this).isHuman = !0, r.renderer = i, r.timer = new o(function(e) {
                        return r.game.renderer.message(e)
                    }), r
                }! function(e, t) {
                    e.prototype = Object.create(t.prototype), (e.prototype.constructor = e).__proto__ = t
                }(e, n);
                var t = e.prototype;
                return t.makeMove = function(e) {
                    var t = this;
                    this.multiplayer && this.timer.start(120, function() {
                        t.game.forceQuit(t, "timeout")
                    }, "Hurry up, you'll forfeit the game in $REMAINING$ seconds..."), this.legalMoves = e, this.isMoving = !0, this.renderer.setClickTargets(this.legalMoves[0].piece.color, [])
                }, t.clickSquare = function(i) {
                    var r = this;
                    if (this.isMoving && !this.game.finished && this.selectedPiece) {
                        var e = i.charAt(0),
                            t = parseInt(i.charAt(1)),
                            n = this.selectedPiece,
                            a = this.legalMoves.find(function(e) {
                                return e.piece === n && e.toSquareString() === i
                            });
                        if (a) {
                            if (this.game.isPromotion(n, t)) {
                                var o = this.game.getTable().Pieces[i],
                                    s = [
                                        [n, n.positionString(), e + t]
                                    ];
                                return o && s.push([o, o.positionString(), "grave"]), void this.renderer.movePieces({
                                    moved: {
                                        pieces: s
                                    },
                                    callback: function() {
                                        r.renderer.renderPromotion({
                                            color: n.color,
                                            callback: function(t) {
                                                var e = r.legalMoves.find(function(e) {
                                                    return e.piece === n && e.toSquareString() === i && e.promotion === t
                                                });
                                                if (!e) throw new Error("Found no legal move for " + n + " to " + i + " with promotion " + t);
                                                r.timer.stop(), r.game.makeMove(r, e)
                                            }
                                        })
                                    }
                                })
                            }
                            this.timer.stop(), this.game.makeMove(this, a), this.selectedPiece = null
                        }
                    }
                }, t.clickPiece = function(t) {
                    if (this.game.finished || !this.isMoving) return !1;
                    var i = t.positionString();
                    if (this.selectedPiece && this.legalMoves.some(function(e) {
                            return e.toSquareString() === i
                        })) return this.clickSquare(i, !0), !1;
                    if (t.color !== this.legalMoves[0].piece.color) return this.renderer.highlightMoves({
                        moves: [],
                        callback: function() {
                            return null
                        }
                    }), this.game.message("That's not your piece!"), !1;
                    this.selectedPiece = t, this.renderer.highlightMoves({
                        moves: [],
                        callback: function() {
                            return null
                        }
                    }), this.renderer.selectPiece(t);
                    var e = this.legalMoves.filter(function(e) {
                        return e.piece === t
                    });
                    if (0 < e.length) this.renderer.highlightMoves({
                        moves: e,
                        callback: function() {
                            return null
                        }
                    }), this.renderer.setClickTargets(e[0].piece.color, e), a.move(), this.game.message("Now select the square you want to move to.");
                    else {
                        a.noMove();
                        var r = t.nameString().toLowerCase();
                        r = r.match(/king|queen/) ? "the " + r : "this " + r, this.game.message("There are currently no possible moves for " + r + ".")
                    }
                    return !0
                }, t.endGame = function() {
                    this.isMoving = !1
                }, e
            }(r);
        t.exports = n
    }, {
        "../shared/multiplayer/multiplayer-util": 22,
        "./chess-sounds": 8,
        "./player": 13
    }],
    6: [function(e, t, i) {
        "use strict";
        var r = e("./player"),
            n = e("../shared/helper-functions").captainsLog,
            o = e("../shared/util"),
            s = window.setTimeout,
            a = function(a) {
                function e(e, t, i, r) {
                    var n;
                    return (n = a.call(this, e, i) || this).face = t, n.id = i, n.game = r, n.multiplayerMoves = [], n
                }! function(e, t) {
                    e.prototype = Object.create(t.prototype), (e.prototype.constructor = e).__proto__ = t
                }(e, a);
                var t = e.prototype;
                return t.checkForLocalTimeout = function() {
                    return !this._noTimer && (this.waitStart ? 15e4 < (new Date).getTime() - this.waitStart : (this.waitStart = (new Date).getTime(), !1))
                }, t.clearLocalTimeout = function() {
                    delete this.waitStart
                }, t.makeMove = function(e) {
                    var t = this;
                    if (this.isMoving = !0, this.legalMoves = e, this.moves = e, this.shouldMakeSubstituteMove()) this.game.forceQuit(this, "abandon");
                    else if (this.checkForLocalTimeout()) this.game.forceQuit(this, "localtimeout");
                    else {
                        var i = this.multiplayerMoves.shift();
                        i ? (n.debug(this.name + ": Got move: " + JSON.stringify(i)), this.clearLocalTimeout(), this.findAndMakeMove(i)) : s(function() {
                            return t.makeMove(e)
                        }, 500)
                    }
                }, t.findAndMakeMove = function(t) {
                    var e = this.legalMoves.find(function(e) {
                        return e.toString() === t.move
                    });
                    e ? this.game.makeMove(this, e) : (o.trackEvent("IllegalMove", "Got move " + JSON.stringify(t) + " which was not in legal moves", 0, "", "", 1), this.game.forceQuit(this, "illegalmove"))
                }, t.endGame = function() {
                    this.isMoving = !1, this.clearLocalTimeout()
                }, e
            }(r);
        t.exports = a
    }, {
        "../shared/helper-functions": 19,
        "../shared/util": 28,
        "./player": 13
    }],
    7: [function(e, t, i) {
        "use strict";
        var b = e("./chess-enums.js"),
            r = e("../shared/util"),
            k = e("./chess-sounds"),
            c = b.Colors,
            n = b.Pieces,
            w = window.setTimeout,
            a = function() {
                function e() {
                    this.reversed = !1
                }
                var t = e.prototype;
                return t.getInverseSquare = function(e) {
                    if (this.reversed) {
                        if ("grave" == e) return e;
                        var t = e[0],
                            i = e[1],
                            r = ["a", "b", "c", "d", "e", "f", "g", "h"],
                            n = r.indexOf(t);
                        return r[r.length - 1 - n] + (9 - i)
                    }
                    return e
                }, t.resize = function(e) {
                    for (var t in e) {
                        var i = e[t];
                        t = this.getInverseSquare(t);
                        var r = this.getPixelPos(t);
                        i && $(i.getGuiPiece()).css(r)
                    }
                }, t.getPixelPos = function(e) {
                    var t = $("[data-square]").width();
                    return {
                        left: "abcdefgh".indexOf(e.charAt(0)) * t,
                        top: (8 - parseInt(e.charAt(1))) * t
                    }
                }, t.hideOldChecks = function() {
                    for (var e = 0, t = ["top-player", "bottom-player"]; e < t.length; e++) {
                        var i = t[e];
                        $("#" + i + "-bubble p span").text().match(/CHECK(MATE)?/) && $("#" + i + "-bubble").hide()
                    }
                }, t.selectPiece = function(e) {
                    $(".selected-piece").removeClass("selected-piece"), $('[data-square="' + e.positionString() + '"]').addClass("selected-piece")
                }, t.check = function(e) {
                    this.addRedHighlight(e.check.pieces), this.addRedHighlight([e.check.king]);
                    var t = e.mate ? "CHECKMATE!" : "CHECK!";
                    e.game.message(t);
                    var i = "bottom-player" === e.player.id ? "bottom-player" : "top-player";
                    $("#" + i + "-bubble p span").html('<span class="checktext">' + t + "</span>"), $("#" + i + "-bubble").fadeIn()
                }, t.movePieces = function(c) {
                    var h = this,
                        u = {
                            verySlow: 800,
                            slow: 650,
                            normal: 400,
                            fast: 300,
                            veryFast: 200
                        } [r.settings.speed];
                    $(".piece.moving").removeClass("moving"), $(".highlight").removeClass("highlight"), $(".selected-piece").removeClass("selected-piece"), $(".red-highlight").removeClass("red-highlight"), this.isRendering = !0;
                    var f, e = c.moved.pieces,
                        d = $("[data-square]").width(),
                        t = e.find(function(e) {
                            return "grave" === e[2]
                        });
                    t && (f = t[0].getGuiPiece());

                    function i() {
                        if (p) {
                            if (v >= g.length) return "break";
                            y = g[v++]
                        } else {
                            if ((v = g.next()).done) return "break";
                            y = v.value
                        }
                        var e = y,
                            t = e[0].getGuiPiece(),
                            i = h.getInverseSquare(e[1]),
                            r = h.getInverseSquare(e[2]);
                        if ("grave" === r) return "continue";
                        $(t).addClass("moving"), $(t).removeClass(i).addClass(r);
                        var n = parseInt($(t).css("top")),
                            a = parseInt($(t).css("left")),
                            o = h.getPixelPos(r),
                            s = Math.sqrt(Math.pow(a / d - o.left / d, 2) + Math.pow(n / d - o.top / d, 2)),
                            l = (1 + s / 5) * u;
                        0 == s ? l = 20 : s < 1 && (l = 100), $(t).animate(o, l, "linear", function() {
                            h.hideOldChecks(), f && (k.kill(), $(f).fadeOut(function() {
                                return $(f).remove()
                            })), c.check && !c.promotion && h.check(c), w(function() {
                                return $(t).removeClass("moving")
                            }, 500), c.promotion ? $(t).fadeOut(function() {
                                $(t).removeClass("pawn").addClass(b.PieceNameLookup[c.promotion.promoteTo].toLowerCase()).fadeIn(function() {
                                    c.check && h.check(c), h.isRendering = !1, c.callback()
                                })
                            }) : m || (m = !0, h.isRendering = !1, !c || game in c ? c.gameId === c.game.startTime && c.callback() : c.callback())
                        })
                    }
                    var m = !1;
                    var g = e,
                        p = Array.isArray(g),
                        v = 0;
                    e: for (g = p ? g : g[Symbol.iterator]();;) {
                        var y;
                        switch (i()) {
                            case "break":
                                break e;
                            case "continue":
                                continue
                        }
                    }
                    c.promotion || k.move()
                }, t.addRedHighlight = function(e) {
                    var t = e,
                        i = Array.isArray(t),
                        r = 0;
                    for (t = i ? t : t[Symbol.iterator]();;) {
                        var n;
                        if (i) {
                            if (r >= t.length) break;
                            n = t[r++]
                        } else {
                            if ((r = t.next()).done) break;
                            n = r.value
                        }
                        var a = n.positionString();
                        $("div[data-square='" + a + "']").addClass("red-highlight")
                    }
                }, t.highlightMoves = function(e) {
                    $(".highlight").removeClass("highlight");
                    var t = e.moves,
                        i = Array.isArray(t),
                        r = 0;
                    for (t = i ? t : t[Symbol.iterator]();;) {
                        var n;
                        if (i) {
                            if (r >= t.length) break;
                            n = t[r++]
                        } else {
                            if ((r = t.next()).done) break;
                            n = r.value
                        }
                        $('[data-square="' + n.toSquareString() + '"]').addClass("highlight")
                    }
                }, t.setClickTargets = function(e, t) {
                    var i = e === c.White ? "white" : "black";
                    $(".piece").removeClass("click-target"), $(".piece." + i).addClass("click-target");
                    var r = t,
                        n = Array.isArray(r),
                        a = 0;
                    for (r = n ? r : r[Symbol.iterator]();;) {
                        var o;
                        if (n) {
                            if (a >= r.length) break;
                            o = r[a++]
                        } else {
                            if ((a = r.next()).done) break;
                            o = a.value
                        }
                        var s = o,
                            l = this.getInverseSquare(s.toSquareString());
                        $("." + l).addClass("click-target")
                    }
                }, t.renderPromotion = function(i) {
                    $("#promotion-div .buttons div").removeClass("black white"), $("#promotion-div .buttons div").addClass(i.color === c.White ? "white" : "black"), $("#promotion-div").show(), $("#promotion-div .buttons div").on("click", function(e) {
                        $("#promotion-div .buttons div").off(), $("#promotion-div").hide();
                        var t = n[$(e.target).data("piece")];
                        i.callback(t)
                    })
                }, t.finishGame = function(e) {
                    $("#win-description").text(""), $(".sad").removeClass("sad"), $(".winner-img").hide(), $("#cover, #concede").hide(), $(".trophy").show();
                    var t = e.multiplayer ? "MultiPlayer" : "SinglePlayer";
                    if (e.winner) "bottom-player" === e.winner.id ? ($("#top-player .face-small").addClass("sad"), $("#bottom-player-win").css("display", "inline-block"), $("#result-box h3").text("You win the game!"), $("#win-description").text(""), "checkmate" === e.type ? r.trackEvent("FinishGame", "Checkmate", e.game.moves, t) : "timeout" === e.type || "localtimeout" === e.type ? ($("#win-description").text(e.loser + " timed out."), r.trackEvent("FinishGame", "Timeout", e.game.moves, t)) : "concede" === e.type ? ($("#win-description").text(e.loser + " surrendered."), r.trackEvent("FinishGame", "Surrender", e.game.moves, t)) : "abandon" === e.type ? ($("#win-description").text(e.loser + " disconnected from the game."), r.trackEvent("FinishGame", "Abandon", e.game.moves, t)) : "illegalmove" === e.type ? ($("#win-description").text(e.loser + " disconnected."), r.trackEvent("FinishGame", "IllegalMove", e.game.moves, t)) : ($("#result-box h3").text("This is awkward."), $("#win-description").text("Something went wrong, and we do not know what it was."), r.trackEvent("BadFinishGame", "type=" + e.type + ", winner=" + e.winner, e.game.moves, t))) : ($("#" + e.winner.id + "-win").css("display", "inline-block"), $("#bottom-player .face-small").addClass("sad"), $("#result-box h3").text(e.winner.name + " wins the game!"), "checkmate" === e.type ? r.trackEvent("FinishGame", "Checkmate", e.game.moves, t) : "timeout" === e.type ? ($("#win-description").text("You timed out!"), r.trackEvent("FinishGame", "Timeout", e.game.moves, t)) : "concede" === e.type ? ($("#win-description").text("You surrendered!"), r.trackEvent("FinishGame", "Surrender", e.game.moves, t)) : ($("#result-box h3").text("This is awkward."), $("#win-description").text("Something went wrong, and we do not know what it was."), r.trackEvent("BadFinishGame", "type=" + e.type + ", winner=" + e.winner, e.game.moves, t)));
                    else {
                        $("#bottom-player .face-small").addClass("sad"), $("#top-player .face-small").addClass("sad"), $("#bottom-player-win").css("display", "inline-block").addClass("sad");
                        var i = e.game.players.find(function(e) {
                            return "bottom-player" !== e.id
                        });
                        $("#" + i.id + "-win").css("display", "inline-block").addClass("sad"), "stalemate" === e.type ? ($("#result-box h3").text("Stalemate"), $("#win-description").text("There are no possible moves, it's a draw."), r.trackEvent("FinishGame", "Stalemate", e.game.moves, t)) : "nocapture" === e.type ? ($("#result-box h3").text("It's a draw."), $("#win-description").text("There has not been a capture or pawn move in 50 turns."), r.trackEvent("FinishGame", "NoCapture", e.game.moves, t)) : "fivefoldrepetition" === e.type ? ($("#result-box h3").text("It's a draw."), $("#win-description").text("Threefold repetition, the current game state has appeared 3 times."), r.trackEvent("FinishGame", "FiveFoldRepetition", e.game.moves, t)) : "insufficiantmaterial" === e.type ? ($("#result-box h3").text("It's a draw."), $("#win-description").text("Insufficient material. Neither player can force a mate with these pieces"), r.trackEvent("FinishGame", "InsufficientMaterial", e.game.moves, t)) : ($("#result-box h3").text("This is awkward."), $("#win-description").text("Something went wrong, and we do not know what it was."), r.trackEvent("BadFinishGame", "type=" + e.type + ", winner=" + e.winner, e.game.moves, t))
                    }
                    e.game.message($("#result-box h3").text()), w(function() {
                        return $("#board").addClass("show-results")
                    }, "checkmate" === e.type ? 1500 : 100)
                }, t.reverseTable = function() {
                    var e = ["a", "b", "c", "d", "e", "f", "g", "h"],
                        t = [1, 2, 3, 4, 5, 6, 7, 8];
                    this.reversed = !this.reversed;
                    for (var i = 0; i < e.length; i++) {
                        var r = e[i].toUpperCase(),
                            n = t[i],
                            a = e[e.length - 1 - i].toUpperCase(),
                            o = t[t.length - 1 - i];
                        this.reversed ? ($(".bottom-label." + r).text(a), $(".side-label._" + n).text(o)) : ($(".bottom-label." + r).text(r), $(".side-label._" + n).text(n))
                    }
                    for (var s = 0; s < e.length; s++)
                        for (var l = 0; l < t.length; l++) {
                            var c = e[s],
                                h = t[l],
                                u = e[e.length - 1 - s],
                                f = t[t.length - 1 - l];
                            $("div[data-square='" + (c + h) + "']").data("square", "_" + (u + f)), $("div[data-square='" + (c + h) + "']").attr("data-square", "_" + (u + f)), $(".piece." + (c + h)).removeClass(c + h).addClass("_" + (u + f))
                        }
                    for (var d = 0; d < e.length; d++)
                        for (var m = 0; m < t.length; m++) {
                            var g = e[d],
                                p = t[m];
                            $("div[data-square='_" + (g + p) + "']").data("square", g + p), $("div[data-square='_" + (g + p) + "']").attr("data-square", g + p), $(".piece._" + (g + p)).removeClass("_" + (g + p)).addClass(g + p)
                        }
                }, t.rotateTable = function(e) {
                    e == this.reversed && this.reverseTable()
                }, t.restoreTable = function(e) {
                    var t = e,
                        i = Array.isArray(t),
                        r = 0;
                    for (t = i ? t : t[Symbol.iterator]();;) {
                        var n;
                        if (i) {
                            if (r >= t.length) break;
                            n = t[r++]
                        } else {
                            if ((r = t.next()).done) break;
                            n = r.value
                        }
                        var a = n,
                            o = a.getGuiPiece();
                        if (o) {
                            if ($(o).removeClass().addClass("piece"), a.color == c.White ? $(o).addClass("white") : $(o).addClass("black"), null == a.rank) $(o).addClass("grave"), a.color == c.White ? $(o).detach().appendTo("#whiteGrave") : $(o).detach().appendTo("#blackGrave");
                            else {
                                var s = this.getInverseSquare(a.positionString());
                                $(o).addClass(s).css(this.getPixelPos(s))
                            }
                            var l = b.PieceNameLookup[a.name].toLowerCase();
                            $(o).addClass(l)
                        }
                    }
                }, e
            }();
        t.exports = a
    }, {
        "../shared/util": 28,
        "./chess-enums.js": 4,
        "./chess-sounds": 8
    }],
    8: [function(e, t, i) {
        "use strict";
        var r = e("../shared/audio-player"),
            n = e("../shared/util"),
            a = new r({
                move: "/chess/sounds/move.mp3",
                kill: "/chess/sounds/kill.mp3",
                noMove: "/chess/sounds/nomove.mp3"
            }, function() {
                return n.settings.sounds
            }, n.qs.debug);
        t.exports = a
    }, {
        "../shared/audio-player": 16,
        "../shared/util": 28
    }],
    9: [function(e, t, i) {
        "use strict";
        var ot = e("./chess-enums.js");

        function st(e, t, i) {
            return t > e.length - 1 ? e : e.substr(0, t) + i + e.substr(t + 1)
        }

        function k(e, t) {
            for (var i = [], r = t == ot.Colors.White, n = 0; n < e.length; n++) {
                var a = e[n],
                    o = Math.floor(n / 8),
                    s = n % 8,
                    l = a.toUpperCase() == a;
                if (r == l) switch (a.toUpperCase()) {
                    case "-":
                        continue;
                    case "Q":
                        for (var c = 0, h = [
                                [-1, -1],
                                [-1, 1],
                                [1, 1],
                                [1, -1]
                            ]; c < h.length; c++)
                            for (var u = h[c], f = 1; f < 8; f++) {
                                var d = o + f * u[0],
                                    m = s + f * u[1];
                                if (0 <= d && d < 8 && 0 <= m && m < 8) {
                                    var g = 8 * d + m,
                                        p = e[g];
                                    if ("-" != p) {
                                        if (l == (p.toUpperCase() == p)) break;
                                        var v = e.slice();
                                        v = st(v, n, "-"), v = st(v, g, a), i.push(v);
                                        break
                                    }
                                    var y = e.slice();
                                    y = st(y, n, "-"), y = st(y, g, a), i.push(y)
                                }
                            }
                        for (var b = 0, k = [
                                [-1, 0],
                                [1, 0],
                                [0, 1],
                                [0, -1]
                            ]; b < k.length; b++)
                            for (var w = k[b], $ = 1; $ < 8; $++) {
                                var S = o + $ * w[0],
                                    C = s + $ * w[1];
                                if (0 <= S && S < 8 && 0 <= C && C < 8) {
                                    var M = 8 * S + C,
                                        x = e[M];
                                    if ("-" != x) {
                                        if (l == (x.toUpperCase() == x)) break;
                                        var P = e.slice();
                                        P = st(P, n, "-"), P = st(P, M, a), i.push(P);
                                        break
                                    }
                                    var A = e.slice();
                                    A = st(A, n, "-"), A = st(A, M, a), i.push(A)
                                }
                            }
                        break;
                    case "R":
                        for (var T = 1; T < 8; T++) {
                            var E = s + T;
                            if (0 <= o && o < 8 && 0 <= E && E < 8) {
                                var I = 8 * o + E,
                                    O = e[I];
                                if ("-" != O) {
                                    if (l == (O.toUpperCase() == O)) break;
                                    var D = e.slice();
                                    D = st(D, n, "-"), D = st(D, I, a), i.push(D);
                                    break
                                }
                                var G = e.slice();
                                G = st(G, n, "-"), G = st(G, I, a), i.push(G)
                            }
                        }
                        for (var R = 1; R < 8; R++) {
                            var N = s - R;
                            if (0 <= o && o < 8 && 0 <= N && N < 8) {
                                var L = 8 * o + N,
                                    F = e[L];
                                if ("-" != F) {
                                    if (l == (F.toUpperCase() == F)) break;
                                    var _ = e.slice();
                                    _ = st(_, n, "-"), _ = st(_, L, a), i.push(_);
                                    break
                                }
                                var W = e.slice();
                                W = st(W, n, "-"), W = st(W, L, a), i.push(W)
                            }
                        }
                        for (var q = 1; q < 8; q++) {
                            var B = o + q;
                            if (0 <= B && B < 8 && 0 <= s && s < 8) {
                                var U = 8 * B + s,
                                    j = e[U];
                                if ("-" != j) {
                                    if (l == (j.toUpperCase() == j)) break;
                                    var K = e.slice();
                                    K = st(K, n, "-"), K = st(K, U, a), i.push(K);
                                    break
                                }
                                var H = e.slice();
                                H = st(H, n, "-"), H = st(H, U, a), i.push(H)
                            }
                        }
                        for (var z = 1; z < 8; z++) {
                            var V = o - z;
                            if (0 <= V && V < 8 && 0 <= s && s < 8) {
                                var Q = 8 * V + s,
                                    Y = e[Q];
                                if ("-" != Y) {
                                    if (l == (Y.toUpperCase() == Y)) break;
                                    var J = e.slice();
                                    J = st(J, n, "-"), J = st(J, Q, a), i.push(J);
                                    break
                                }
                                var X = e.slice();
                                X = st(X, n, "-"), X = st(X, Q, a), i.push(X)
                            }
                        }
                        break;
                    case "P":
                        var Z = l ? 1 : -1,
                            ee = l ? 1 : 6,
                            te = l ? 7 : 0,
                            ie = o + Z;
                        if (0 <= ie && ie < 8) {
                            var re = 8 * ie + s;
                            if ("-" === e[re]) {
                                var ne = e.slice();
                                if (ne = st(ne, n, "-"), ne = st(ne, re, ie === te ? l ? "Q" : "q" : a), i.push(ne), ee == o) {
                                    var ae = 8 * (ie + Z) + s;
                                    if ("-" === e[ae]) {
                                        var oe = e.slice();
                                        oe = st(oe, n, "-"), oe = st(oe, ae, a), i.push(oe)
                                    }
                                }
                            }
                            for (var se = -1; se <= 1; se += 2) {
                                var le = s + se;
                                if (0 <= le && le < 8) {
                                    var ce = 8 * ie + le,
                                        he = e[ce];
                                    if ("-" != he)
                                        if (l != (he.toUpperCase() == he)) {
                                            var ue = e.slice();
                                            ue = st(ue, n, "-"), ue = st(ue, ce, ie === te ? l ? "Q" : "q" : a), i.push(ue)
                                        }
                                }
                            }
                        }
                        break;
                    case "N":
                        for (var fe = 0, de = [
                                [-1, -2],
                                [-1, 2],
                                [1, -2],
                                [1, 2],
                                [-2, 1],
                                [-2, -1],
                                [2, 1],
                                [2, -1]
                            ]; fe < de.length; fe++) {
                            var me = de[fe],
                                ge = o + me[0],
                                pe = s + me[1];
                            if (0 <= ge && ge < 8 && 0 <= pe && pe < 8) {
                                var ve = 8 * ge + pe,
                                    ye = e[ve];
                                if ("-" != ye)
                                    if (l == (ye.toUpperCase() == ye)) continue;
                                var be = e.slice();
                                be = st(be, n, "-"), be = st(be, ve, a), i.push(be)
                            }
                        }
                        break;
                    case "B":
                        for (var ke = 1; ke < 8; ke++) {
                            var we = o + ke,
                                $e = s + ke;
                            if (0 <= we && we < 8 && 0 <= $e && $e < 8) {
                                var Se = 8 * we + $e,
                                    Ce = e[Se];
                                if ("-" != Ce) {
                                    if (l == (Ce.toUpperCase() == Ce)) break;
                                    var Me = e.slice();
                                    Me = st(Me, n, "-"), Me = st(Me, Se, a), i.push(Me);
                                    break
                                }
                                var xe = e.slice();
                                xe = st(xe, n, "-"), xe = st(xe, Se, a), i.push(xe)
                            }
                        }
                        for (var Pe = 1; Pe < 8; Pe++) {
                            var Ae = o + Pe,
                                Te = s - Pe;
                            if (0 <= Ae && Ae < 8 && 0 <= Te && Te < 8) {
                                var Ee = 8 * Ae + Te,
                                    Ie = e[Ee];
                                if ("-" != Ie) {
                                    if (l == (Ie.toUpperCase() == Ie)) break;
                                    var Oe = e.slice();
                                    Oe = st(Oe, n, "-"), Oe = st(Oe, Ee, a), i.push(Oe);
                                    break
                                }
                                var De = e.slice();
                                De = st(De, n, "-"), De = st(De, Ee, a), i.push(De)
                            }
                        }
                        for (var Ge = 1; Ge < 8; Ge++) {
                            var Re = o - Ge,
                                Ne = s + Ge;
                            if (0 <= Re && Re < 8 && 0 <= Ne && Ne < 8) {
                                var Le = 8 * Re + Ne,
                                    Fe = e[Le];
                                if ("-" != Fe) {
                                    if (l == (Fe.toUpperCase() == Fe)) break;
                                    var _e = e.slice();
                                    _e = st(_e, n, "-"), _e = st(_e, Le, a), i.push(_e);
                                    break
                                }
                                var We = e.slice();
                                We = st(We, n, "-"), We = st(We, Le, a), i.push(We)
                            }
                        }
                        for (var qe = 1; qe < 8; qe++) {
                            var Be = o - qe,
                                Ue = s - qe;
                            if (0 <= Be && Be < 8 && 0 <= Ue && Ue < 8) {
                                var je = 8 * Be + Ue,
                                    Ke = e[je];
                                if ("-" != Ke) {
                                    if (l == (Ke.toUpperCase() == Ke)) break;
                                    var He = e.slice();
                                    He = st(He, n, "-"), He = st(He, je, a), i.push(He);
                                    break
                                }
                                var ze = e.slice();
                                ze = st(ze, n, "-"), ze = st(ze, je, a), i.push(ze)
                            }
                        }
                        break;
                    case "K":
                        for (var Ve = 0, Qe = [
                                [-1, -1],
                                [-1, 0],
                                [-1, 1],
                                [0, -1],
                                [0, 1],
                                [1, -1],
                                [1, 0],
                                [1, 1]
                            ]; Ve < Qe.length; Ve++) {
                            var Ye = Qe[Ve],
                                Je = o + Ye[0],
                                Xe = s + Ye[1];
                            if (0 <= Je && Je < 8 && 0 <= Xe && Xe < 8) {
                                var Ze = 8 * Je + Xe,
                                    et = e[Ze];
                                if ("-" != et)
                                    if (l == (et.toUpperCase() == et)) continue;
                                var tt = e.slice();
                                tt = st(tt, n, "-"), tt = st(tt, Ze, a), i.push(tt)
                            }
                        }
                }
            }
            for (var it = [], rt = 0, nt = i; rt < nt.length; rt++) {
                var at = nt[rt];
                lt(at, t) || it.push(at)
            }
            return it
        }
        var lt = function(e, t) {
            t == ot.Colors.White ? ot.Colors.Black : ot.Colors.White;
            for (var i = t == ot.Colors.White ? "K" : "k", r = t == ot.Colors.White, n = e.indexOf(i), a = Math.floor(n / 8), o = n % 8, s = [
                    [-1, -1],
                    [-1, 1],
                    [1, -1],
                    [1, 1]
                ], l = 0, c = s; l < c.length; l++)
                for (var h = c[l], u = 1; u < 8; u++) {
                    var f = a + h[0] * u,
                        d = o + h[1] * u;
                    if (0 <= f && f < 8 && 0 <= d && d < 8) {
                        var m = e[8 * f + d];
                        if ("-" != m) {
                            var g = m.toUpperCase() == m;
                            if (m = m.toUpperCase(), r == g) break;
                            if ("B" == m || "Q" == m) return !0;
                            break
                        }
                    }
                }
            for (var p = 0, v = s = [
                    [-1, 0],
                    [1, 0],
                    [0, -1],
                    [0, 1]
                ]; p < v.length; p++)
                for (var y = v[p], b = 1; b < 8; b++) {
                    var k = a + y[0] * b,
                        w = o + y[1] * b;
                    if (0 <= k && k < 8 && 0 <= w && w < 8) {
                        var $ = e[8 * k + w];
                        if ("-" != $) {
                            var S = $.toUpperCase() == $;
                            if ($ = $.toUpperCase(), r == S) break;
                            if ("R" == $ || "Q" == $) return !0;
                            break
                        }
                    }
                }
            for (var C = 0, M = s = [
                    [-2, -1],
                    [-2, 1],
                    [2, -1],
                    [2, 1],
                    [1, 2],
                    [-1, 2],
                    [-1, -2],
                    [1, -2]
                ]; C < M.length; C++) {
                var x = M[C],
                    P = a + x[0],
                    A = o + x[1];
                if (0 <= P && P < 8 && 0 <= A && A < 8) {
                    var T = e[8 * P + A];
                    if ("-" != T) {
                        var E = T.toUpperCase() == T;
                        if (T = T.toUpperCase(), r == E) break;
                        if ("N" == T) return !0;
                        break
                    }
                }
            }
            for (var I = -1; I <= 1; I++)
                for (var O = -1; O <= 1; O++)
                    if (0 != I || 0 != O) {
                        var D = a + I,
                            G = o + O;
                        if (0 <= D && D < 8 && 0 <= G && G < 8) {
                            var R = e[8 * D + G];
                            if ("-" != R) {
                                var N = R.toUpperCase() == R;
                                if (R = R.toUpperCase(), r == N) break;
                                if ("K" == R) return !0;
                                if ("P" == R) {
                                    if (r && 1 === I && 0 !== O) return !0;
                                    if (!r && -1 === I && 0 !== O) return !0
                                }
                            }
                        }
                    } return !1
        };
        t.exports = {
            sc_getTableString: function(e) {
                if (!e) throw "NO TABLES HERE!";
                for (var t = ["a", "b", "c", "d", "e", "f", "g", "h"], i = "", r = 1; r <= 8; r++)
                    for (var n = 0; n < 8; n++) {
                        var a = t[n] + r,
                            o = e.Pieces[a];
                        if (o) {
                            var s = void 0;
                            o.color == ot.Colors.White ? (s = ot.PieceNameLookup[o.name][0].toUpperCase(), o.name == ot.Pieces.Knight && (s = "N")) : (s = ot.PieceNameLookup[o.name][0].toLowerCase(), o.name == ot.Pieces.Knight && (s = "n")), i += s
                        } else i += "-"
                    }
                return i
            },
            sc_nextMoves: k,
            sc_check: lt,
            sc_evaluateTable: function(e) {
                var t, i, r, n = ot.pst_start,
                    a = ot.pst_end,
                    o = 0,
                    s = k(e, 0),
                    l = k(e, 1);
                o += .002 * (s.length - l.length);
                for (var c = i = t = 0; c < e.length; c++) {
                    var h = e[c];
                    if ("-" !== h) {
                        var u = h.toUpperCase() == h ? 1 : -1;
                        h = h.toUpperCase();
                        var f = ot.PieceLetterLookup[h];
                        o += u * ot.CentiPieceValues[f], f === ot.Pieces.Pawn ? i++ : t++
                    }
                }
                r = i <= 4 || t <= 7 ? a : n;
                for (var d = 0; d < e.length; d++) {
                    var m = e[d];
                    if ("-" !== m) {
                        var g = m.toUpperCase() == m,
                            p = g ? 1 : -1;
                        m = m.toUpperCase();
                        var v = Math.floor(d / 8),
                            y = d % 8,
                            b = g ? 7 - v : v;
                        o += p * r[ot.PieceLetterLookup[m]][b][y]
                    }
                }
                return Math.floor(1e3 * o) / 1e3
            },
            sc_hash: function(e) {
                for (var t = [0, 0], i = 0; i < e.length; i++) {
                    var r = e[i];
                    "-" !== r && (t[0] ^= ot.minizobrist[i][r][0], t[1] ^= ot.minizobrist[i][r][1])
                }
                return t
            }
        }, "undefined" != typeof window && null !== window && (window.sc = t.exports)
    }, {
        "./chess-enums.js": 4
    }],
    10: [function(e, t, i) {
        "use strict";
        var r = e("./chess").Chess,
            n = e("./chess-renderer"),
            a = e("./chess-computer-player"),
            l = (a.RandomPlayer, a.JohnWick, a.BookPlayer),
            c = a.GarboChessPlayer,
            o = l,
            s = e("./chess-human-player"),
            h = e("./chess-remote-player"),
            u = e("../shared/temp-storage"),
            f = (e("../shared/game"), e("../shared/statistics")),
            v = e("../shared/util"),
            d = e("../shared/multiplayer/multiplayer-game-client"),
            m = e("../shared/multiplayer/multiplayer-challenge-client"),
            y = e("../shared/gamecontrol"),
            g = e("../shared/helper-functions").captainsLog;
        window.sc = e("./chess-stringchess");
        new m(slug);
        var p = v.qs,
            b = function() {
                function e() {
                    var i = this;
                    this.game = new r(this), this.renderer = new n, this.tempStorage = new u("chess"), window.game = this.game, this.setupListeners(), this.setupRendering(), window.addEventListener("resize", function() {
                        return i.resize()
                    }), f.checkAbandonedMultiplayerGame(), this.preloadImages(), this.setupTitleBlink(), this.setupOpponentPicker(), $.get("/chess/assets/openingBook.json", function(e) {
                        i.book = e;
                        var t = i.game.players.find(function(e) {
                            return "bottom-player" !== e.id
                        });
                        t && t.setBook && t.setBook(e)
                    }, "json")
                }
                var t = e.prototype;
                return t.preloadImages = function() {
                    v.preloadBackgroundImageClass("selected-piece darkwood"), v.preloadBackgroundImageClass("selected-piece lightwood"), v.preloadBackgroundImageClass("red-highlight lightwood"), v.preloadBackgroundImageClass("red-highlight darkwood")
                }, t.setupTitleBlink = function() {
                    var e, t = document.title;

                    function i() {
                        $("#challenge-received").is(":visible") && (document.title === t ? document.title = "NEW CHALLENGE!" : document.title = t)
                    }
                    window.addEventListener("visibilitychange", function() {
                        document.hidden ? e = setInterval(i, 1e3) : e && (document.title = t, clearInterval(e), e = null)
                    })
                }, t.setupOpponentPicker = function() {
                    var s = this;
                    $(".opponent-faces div").on("touchstart click", function(e) {
                        e.preventDefault();
                        var t = e.target.id.replace(/opponent-/, "");
                        $("#top-player .face-small").removeClass("face-top-player face-left-player face-right-player hair-p").addClass("face-" + t + "-player"), $("#top-player .top-player-name").text(players[t].name), $("#choose-opponent").hide();
                        var i, r = s.game.players.find(function(e) {
                                return "bottom-player" !== e.id
                            }),
                            n = s.game.players.indexOf(r),
                            a = players[t].name,
                            o = {
                                left: "easy",
                                top: "medium",
                                right: "hard"
                            } [t];
                        "hard" === o ? i = new c(a, "right-player") : "medium" === o ? i = new l(a, "top-player") : "easy" === o && (i = new l(a, "left-player")), i.difficulty = o, i.setBook(s.book), i.stats = {}, i.game = s.game, i.color = r.color, i.debug = p.debug || location.href.match(/dev\.cardgames/), s.game.players[n] = i, $("#top-player").fadeIn(), s.game.start()
                    })
                }, t.movePieces = function(e) {
                    this.client && "bottom-player" === e.player.id && this.client.sendMove({
                        "playerId": e.player.multiplayerId,
                        "move": e.moveString
                    }), this.client || this.statsStarted || "bottom-player" !== e.player.id || (this.statsStarted = !0, f.startGame(this.game.players), y.startGame(), v.siteSettings.hideMultiplayerButton && $("#multiplayer-button").is(":visible") && $("#multiplayer-button").fadeOut()), 2 === this.game.moves && v.trackEvent("StartGame", "", 0, this.client ? "MultiPlayer" : "SinglePlayer"), $("#open-player-picker").is(":visible") && $("#open-player-picker").fadeOut(), this.renderer.movePieces(e)
                }, t.finishGame = function(e) {
                    var t = this.game.players,
                        i = Array.isArray(t),
                        r = 0;
                    for (t = i ? t : t[Symbol.iterator]();;) {
                        var n;
                        if (i) {
                            if (r >= t.length) break;
                            n = t[r++]
                        } else {
                            if ((r = t.next()).done) break;
                            n = r.value
                        }
                        var a = n;
                        a.stats.promoteCount = a.promoteCount || 0, a.stats.killCount = a.killCount || 0, e.winner ? a === e.winner ? (a.stats.result = "win", a.stats.minimumMovesToWin = Math.ceil(this.game.moves / 2), a.stats.movesToWin = Math.ceil(this.game.moves / 2)) : a.stats.result = "lose" : a.stats.result = "draw"
                    }
                    if (this.client) {
                        f.finishMultiplayerChallengeGame(this.game.players);
                        var o = {
                            finished: !0,
                            winners: e.winner ? [e.winner.multiplayerId] : this.game.players.map(function(e) {
                                return e.multiplayerId
                            }),
                            endReason: e.type
                        };
                        e.winner && "top-player" === e.winner.id && "timeout" === e.type && this.client.sendMove({
                            type: "forcequit",
                            reason: "timeout",
                            playerId: e.loser.multiplayerId
                        }), this.client.sendResult(o)
                    } else {
                        f.finishGame(this.game.players);
                        var s = this.game.players.find(function(e) {
                            return "bottom-player" !== e.id
                        });
                        e.winner ? v.trackEvent("Win", e.winner.id, 0, s.difficulty) : v.trackEvent("Win", e.type, 0, s.difficulty)
                    }
                    y.finishGame(), e.multiplayer = !!this.client, this.renderer.finishGame(e)
                }, t.setupListeners = function() {
                    function e() {
                        v.settings.highlightMoves ? $("body").addClass("highlight-moves") : $("body").removeClass("highlight-moves")
                    }
                    $("#final-board").on("click touchstart", function(e) {
                        e.preventDefault(), $("#board").removeClass("show-results")
                    }), v.settings.addListener("highlightMoves", e), e(), "Notification" in window || $("#notifications-option").hide(), v.settings.addListener("notifications", function(e) {
                        if (e.value) {
                            if ("granted" === Notification.permission) return;
                            "denied" === Notification.permission ? (alert("You have previously denied permission for notifications from cardgames.io. You will have to go into your browser settings to enable notifications and then turn this option on again."), setTimeout(function() {
                                return v.settings.set("notifications", !1)
                            }, 0)) : Notification.requestPermission(function(e) {
                                "denied" === e && (alert("You denied the permission, notifications will remain turned off."), setTimeout(function() {
                                    return v.settings.set("notifications", !1)
                                }, 0))
                            })
                        }
                    })
                }, t.resize = function() {
                    this.renderer.resize(this.game.getTable().Pieces)
                }, t.setUpOnlineGame = function() {
                    var t = this;
                    $("#top-player").show(), $("#choose-opponent").hide(), $("#top-player .face-small").removeClass("face-right-player face-left-player").addClass("face-top-player");
                    var e = new s(players.bottom.name, "bottom-player", this.renderer),
                        i = new h(players.top.name, players.top.code, "top-player", this.game),
                        r = this.tempStorage.get(v.qs.gid);
                    this.tempStorage.remove(v.qs.gid), this.tempStorage.set("gameStarted", !0), e.multiplayer = !0, e.multiplayerId = r.players[0].id, i.multiplayer = !0, i.multiplayerId = r.players[1].id;
                    var n = r.initialDealerId === e.multiplayerId;
                    this.client = new d(slug, r, [e, i], function() {});
                    var a = this.client;
                    $(".face-top-player").addClass("offline p-" + i.multiplayerId), $(".face-bottom-player").addClass("p-" + e.multiplayerId), a.on("players-ready", function() {
                        t.game.message("Both players are ready, starting the game..."), f.startMultiplayerChallengeGame(i), y.startGame(), n ? (t.renderer.rotateTable(!0), t.setupGame(e, i)) : (t.renderer.rotateTable(!1), t.setupGame(i, e))
                    }), a.on("forcequit", function(e) {
                        t.game.forceQuit(e.data.player, e.data.reason)
                    }), a.connect(), $("#concede").fadeIn().css("display", "inline-block")
                }, t.setupGame = function(e, t) {
                    $(".piece").remove(), $(".bubble").hide(), $("#history-div div ol li").remove(), e && this.game.reset(), this.game.players = [], this.game.addPlayer(e), this.game.addPlayer(t), this.game.startTime = Date.now();
                    var i = this.game.getTable();
                    $(".sad").removeClass("sad");
                    var r = {},
                        n = !1;
                    for (var a in v.qs) a.match(/^[abcdefgh][12345678]$/) && (r[a] = v.qs[a], n = !0);
                    n && i.loadState(r, v.qs.kill);
                    var o = v.qs.fen;
                    for (var s in o && (o = o.replace(/_|%20/g, " "), i.loadFen(o), this.game.currentPlayer = i.nextTurnColor), i.Pieces) {
                        var l = i.Pieces[s];
                        if (l) {
                            var c = l.colorString().toLowerCase(),
                                h = l.nameString().toLowerCase(),
                                u = this.renderer.getInverseSquare(s),
                                f = $("<div></div>");
                            $(f).addClass("piece"), $(f).addClass(c), $(f).addClass(h), $(f).addClass(u), $(f).css(this.renderer.getPixelPos(u)), $("#chess-board-inner").append(f), l.associate(f[0])
                        }
                    }
                    var d = this.game.players,
                        m = Array.isArray(d),
                        g = 0;
                    for (d = m ? d : d[Symbol.iterator]();;) {
                        var p;
                        if (m) {
                            if (g >= d.length) break;
                            p = d[g++]
                        } else {
                            if ((g = d.next()).done) break;
                            p = g.value
                        }
                        p.stats = {}
                    }
                    this.setupHandlers(), v.qs.gid ? (this.game.start(), y.startGame()) : window.isFirstTimeOnSite ? (this.game.start(), window.isFirstTimeOnSite = !1) : ($("#top-player").hide(), $("#choose-opponent").show(), this.game.message("Choose your opponent."))
                }, t.setupRendering = function() {
                    this.game.message = function(e) {
                        $("#message-box").html("<span>" + e + "</span>")
                    }, v.qs.gid ? this.setUpOnlineGame() : this.setupOfflineGame()
                }, t.setupOfflineGame = function() {
                    if (v.qs.gid) location.href = "/chess/";
                    else {
                        var e;
                        $(".highlight, .red-highlight, .selected-piece").removeClass("highlight red-highlight selected-piece");
                        var t = v.qs.fen && "b" === v.qs.fen.split(/%20| |_/)[1];
                        e = "white" !== this.tempStorage.get("lastcolor") && !t && ("black" === this.tempStorage.get("lastcolor") || Math.random() < .5), this.tempStorage.set("lastcolor", e ? "white" : "black"), this.statsStarted = !1;
                        var i = new s("You", "bottom-player", this.renderer),
                            r = new o(players.top.name, "top-player");
                        r.setBook && this.book && r.setBook(this.book), r.logError = function(e) {
                            v.trackEvent("IllegalComputerMove", e), g.debug(e)
                        }, r.debug = p.debug || location.href.match(/dev\.cardgames/), v.qs.autoplay && (i = new o(players.bottom.name, "bottom-player"), r.delay = !1, i.delay = !1, i.setBook && this.book && i.setBook(this.book));
                        var n = e ? i : r,
                            a = e ? r : i;
                        this.renderer.rotateTable(e), this.setupGame(n, a), $("#concede").hide()
                    }
                }, t.surrender = function() {
                    this.client && this.client.sendSurrender(), this.game.surrender(this.game.players.find(function(e) {
                        return "bottom-player" === e.id
                    }))
                }, t.setupHandlers = function() {
                    var E, g = this;

                    function I(e, t, i, r) {
                        return e >= i.left && e < i.left + r && t >= i.top && t < i.top + r
                    }

                    function O(e) {
                        if (void 0 !== e.pageX) return {
                            x: e.pageX,
                            y: e.pageY
                        };
                        if (e.originalEvent && e.originalEvent.touches && 0 < e.originalEvent.touches.length) {
                            var t = e.originalEvent.touches[0];
                            return {
                                x: t.pageX,
                                y: t.pageY
                            }
                        }
                    }
                    $("[data-square]").off().on("click touchstart", function(e) {
                        e.preventDefault();
                        var t = g.game.players.find(function(e) {
                            return e.isHuman
                        });
                        if (t) {
                            var i = $(e.target).data("square");
                            i ? t.clickSquare(i) : v.trackEvent("Error", "Square error in [data-square], e.target is " + e.target + ", with class " + e.target.className + ", with id " + e.target.id + ", browser " + navigator.userAgent.replace("Mozilla/5.0", ""))
                        }
                    }), $(".piece, [data-square]").bind("contextmenu", function(e) {
                        return e.preventDefault(), !1
                    }), $(".piece").on("touchstart mousedown", function(e) {
                        e.preventDefault();
                        var t = g.game.getAssignedPiece(e.target),
                            i = g.game.players.find(function(e) {
                                return e.isHuman
                            });
                        if (i) {
                            if ($(e.target).hasClass("moving")) {
                                var r = parseInt($(e.target).css("left")),
                                    n = parseInt($(e.target).css("top")),
                                    a = g.renderer.getPixelPos(g.renderer.getInverseSquare(t.positionString())),
                                    o = r - a.left,
                                    s = n - a.top;
                                if (3 < Math.sqrt(Math.pow(o, 2) + Math.pow(s, 2))) return
                            }
                            if (i.clickPiece(t)) {
                                var l = {},
                                    c = i.legalMoves.filter(function(e) {
                                        return e.piece === t
                                    }),
                                    h = Array.isArray(c),
                                    u = 0;
                                for (c = h ? c : c[Symbol.iterator]();;) {
                                    var f;
                                    if (h) {
                                        if (u >= c.length) break;
                                        f = c[u++]
                                    } else {
                                        if ((u = c.next()).done) break;
                                        f = u.value
                                    }
                                    var d = f.toSquareString();
                                    l[d] = g.renderer.getPixelPos(g.renderer.getInverseSquare(d))
                                }
                                var m = O(e);
                                E = {
                                    piece: t,
                                    element: e.target,
                                    targets: l,
                                    offset: $("#chess-board-inner").offset(),
                                    x: m.x,
                                    y: m.y,
                                    px: parseInt($(e.target).css("left")),
                                    py: parseInt($(e.target).css("top")),
                                    width: $(".piece").width()
                                }, $(E.element).addClass("moving")
                            }
                        }
                    }), $("body").on("touchmove mousemove", function(e) {
                        if (E) {
                            var t, i, r, n, a, o, s, l, c, h, u, f, d, m = O(e),
                                g = m.x - E.x,
                                p = m.y - E.y,
                                v = Math.sqrt(Math.pow(g, 2) + Math.pow(p, 2)),
                                y = $(E.element).width(),
                                b = m.y - E.offset.top,
                                k = m.x - E.offset.left,
                                w = Math.floor(b - y / 1.5),
                                S = Math.floor(k - y / 2 - 3);
                            if ((E.snapped || 3 < v) && (E.snapped = !0, $(E.element).css({
                                    top: w,
                                    left: S
                                })), E.hoverTarget) {
                                if (I(k, b, E.hoverTarget, E.width)) return;
                                $(E.hoverTarget.element).removeClass("hover-target"), E.hoverTarget = null
                            }
                            for (var C in E.targets) {
                                var M = E.targets[C];
                                if (I(k, b, M, E.width)) {
                                    var x = $('[data-square="' + C + '"]').get(0);
                                    E.hoverTarget = {
                                        left: M.left,
                                        top: M.top,
                                        element: x
                                    }, $(x).addClass("hover-target");
                                    break
                                }
                            }
                            if (!E.hoverTarget && E.snapped) {
                                for (var P in E.targets) {
                                    var A = E.targets[P];
                                    if (.5 < (t = w, i = S, r = A.top, n = A.left, a = E.width, void 0, s = (o = i) + a, c = (l = t) + a, u = (h = n) + a, d = (f = r) + a, Math.max(0, Math.min(s, u) - Math.max(o, h)) * Math.max(0, Math.min(c, d) - Math.max(l, f)) / (a * a))) {
                                        if (E.hoverTarget) {
                                            E.hoverTarget = null;
                                            break
                                        }
                                        var T = $('[data-square="' + P + '"]').get(0);
                                        E.hoverTarget = {
                                            left: A.left,
                                            top: A.top,
                                            element: T
                                        }
                                    }
                                }
                                E.hoverTarget && $(E.hoverTarget.element).addClass("hover-target")
                            }
                        }
                    }), $("body").on("touchend mouseup", function(e) {
                        if (E) {
                            $(".hover-target").removeClass("hover-target");
                            var t = g.game.players.find(function(e) {
                                return e.isHuman
                            });
                            if (t && E.hoverTarget) {
                                var i = E.hoverTarget.element,
                                    r = $(i).data("square");
                                r ? t.clickSquare(r) : v.trackEvent("Error", "Square error in endDrop, drag.hoverEl is is " + i + ", with class " + i.className + ", with id " + i.id + ", browser " + navigator.userAgent.replace("Mozilla/5.0", ""))
                            } else {
                                var n = E.element;
                                $(n).animate({
                                    top: E.py,
                                    left: E.px
                                }, 200, function() {
                                    return $(n).removeClass("moving")
                                })
                            }
                            E = null
                        }
                    }), $("#start-new-game").on("click touchstart", function(e) {
                        e.preventDefault(), $("#board").removeClass("show-results"), y.restart()
                    }), y.addRestartHandler(function() {
                        v.ads.trigger(function() {
                            v.isMobileLookActive() ? (y.resetGameStatus(), g.setupOfflineGame()) : location.href = "/chess/"
                        })
                    })
                }, t.message = function(e) {
                    this.game.message(e)
                }, e
            }();
        t.exports = b
    }, {
        "../shared/game": 17,
        "../shared/gamecontrol": 18,
        "../shared/helper-functions": 19,
        "../shared/multiplayer/multiplayer-challenge-client": 20,
        "../shared/multiplayer/multiplayer-game-client": 21,
        "../shared/statistics": 26,
        "../shared/temp-storage": 27,
        "../shared/util": 28,
        "./chess": 11,
        "./chess-computer-player": 3,
        "./chess-human-player": 5,
        "./chess-remote-player": 6,
        "./chess-renderer": 7,
        "./chess-stringchess": 9
    }],
    11: [function(e, t, i) {
        "use strict";
        var C = e("./chess-enums.js"),
            j = C.Colors,
            v = C.FileLetter,
            l = C.PieceSymbols,
            M = e("../shared/helper-functions").captainsLog,
            K = C.Pieces,
            u = C.PieceLetterLookup,
            c = e("./chess-stringchess").sc_getTableString;

        function k(e) {
            return e === j.White ? j.Black : j.White
        }

        function s() {}
        var y = function() {
                function i(e, t, i, r) {
                    switch (this.color = e, this.name = t, this.rank = i, this.file = r, this.guiPiece = null, this.textName = this.colorString()[0] + "-" + this.nameString(), this.id = (t << 7) + (this.file << 4) + (this.rank << 1) + this.color, this.name) {
                        case K.Pawn:
                            this.moves = this._pawnMovement;
                            break;
                        case K.Rook:
                            this.moves = this._rookMovement;
                            break;
                        case K.Knight:
                            this.moves = this._knightMovement;
                            break;
                        case K.Bishop:
                            this.moves = this._bishopMovement;
                            break;
                        case K.Queen:
                            this.moves = this._queenMovement;
                            break;
                        case K.King:
                            this.moves = this._kingMovement
                    }
                }
                var e = i.prototype;
                return e.clone = function(e) {
                    void 0 === e && (e = !1);
                    var t = new i(this.color, this.name, this.rank, this.file);
                    return t.id = this.id, this.guiPiece && e && t.associate(this.guiPiece), t
                }, e.associate = function(e) {
                    this.guiPiece = e
                }, e.getGuiPiece = function() {
                    return this.guiPiece
                }, e.toString = function() {
                    return this.colorString() + " " + this.nameString() + " - " + v[this.file] + this.rank
                }, e.positionString = function() {
                    return null == this.file || null == this.rank ? "grave" : v[this.file] + this.rank
                }, e.colorString = function() {
                    return 0 == this.color ? "White" : "Black"
                }, e.nameString = function() {
                    return ["Pawn", "Rook", "Knight", "Bishop", "Queen", "King"][this.name]
                }, e.getCheckers = function(e) {
                    var t = [];
                    if (this.name != K.King) throw "Only kings can use getCheckers (for now)";
                    for (var i = this.file, r = this.rank, n = this.color == j.White ? 1 : -1, a = 0, o = [
                            [-1, -2],
                            [-1, 2],
                            [1, -2],
                            [1, 2],
                            [2, -1],
                            [2, 1],
                            [-2, -1],
                            [-2, 1]
                        ]; a < o.length; a++) {
                        var s = o[a],
                            l = e.getPiece(i + s[0], r + s[1]);
                        l && l.color != this.color && l.name == K.Knight && t.push(l)
                    }
                    for (var c = 0, h = [-1, 0, 1]; c < h.length; c++)
                        for (var u = h[c], f = 0, d = [-1, 0, 1]; f < d.length; f++) {
                            var m = d[f],
                                g = e.getPiece(i + u, r + m);
                            g && g.color != this.color && g.name == K.King && t.push(g)
                        }
                    for (var p = 0, v = [-1, 1]; p < v.length; p++) {
                        var y = v[p],
                            b = e.getPiece(i + y, r + n);
                        b && b.color != this.color && b.name == K.Pawn && t.push(b)
                    }
                    for (var k = r + 1; k <= 8; k++) {
                        var w = e.getPiece(i, k);
                        if (w) {
                            if (w.color == this.color) break;
                            w.name != K.Queen && w.name != K.Rook || t.push(w);
                            break
                        }
                    }
                    for (var $ = i + 1; $ <= 8; $++) {
                        var S = e.getPiece($, r);
                        if (S) {
                            if (S.color == this.color) break;
                            S.name != K.Queen && S.name != K.Rook || t.push(S);
                            break
                        }
                    }
                    for (var C = r - 1; 1 <= C; C--) {
                        var M = e.getPiece(i, C);
                        if (M) {
                            if (M.color == this.color) break;
                            M.name != K.Queen && M.name != K.Rook || t.push(M);
                            break
                        }
                    }
                    for (var x = i - 1; 1 <= x; x--) {
                        var P = e.getPiece(x, r);
                        if (P) {
                            if (P.color == this.color) break;
                            P.name != K.Queen && P.name != K.Rook || t.push(P);
                            break
                        }
                    }
                    for (var A = 1; A < 8; A++) {
                        var T, E;
                        if (T = r + A, E = i + A, 8 < Math.max(T, E)) break;
                        var I = e.getPiece(E, T);
                        if (I) {
                            I.color != this.color && (I.name != K.Bishop && I.name != K.Queen || t.push(I));
                            break
                        }
                    }
                    for (var O = 1; O < 8; O++) {
                        var D, G;
                        if (D = r - O, G = i - O, 8 < Math.max(D, G)) break;
                        var R = e.getPiece(G, D);
                        if (R) {
                            R.color != this.color && (R.name != K.Bishop && R.name != K.Queen || t.push(R));
                            break
                        }
                    }
                    for (var N = 1; N < 8; N++) {
                        var L, F;
                        if (L = r + N, F = i - N, 8 < Math.max(L, F)) break;
                        var _ = e.getPiece(F, L);
                        if (_) {
                            _.color != this.color && (_.name != K.Bishop && _.name != K.Queen || t.push(_));
                            break
                        }
                    }
                    for (var W = 1; W < 8; W++) {
                        var q, B;
                        if (q = r - W, B = i + W, 8 < Math.max(q, B)) break;
                        var U = e.getPiece(B, q);
                        if (U) {
                            U.color != this.color && (U.name != K.Bishop && U.name != K.Queen || t.push(U));
                            break
                        }
                    }
                    return t
                }, e._rookMovement = function(e) {
                    for (var t = this.rank, i = this.file, r = [], n = t + 1; n <= 8; n++) {
                        var a = e.getPiece(i, n);
                        if (a) {
                            if (a.color == this.color) break;
                            r.push(new w(this, i, t, i, n, !0));
                            break
                        }
                        r.push(new w(this, i, t, i, n, !1))
                    }
                    for (var o = i + 1; o <= 8; o++) {
                        var s = e.getPiece(o, t);
                        if (s) {
                            if (s.color == this.color) break;
                            r.push(new w(this, i, t, o, t, !0));
                            break
                        }
                        r.push(new w(this, i, t, o, t, !1))
                    }
                    for (var l = t - 1; 1 <= l; l--) {
                        var c = e.getPiece(i, l);
                        if (c) {
                            if (c.color == this.color) break;
                            r.push(new w(this, i, t, i, l, !0));
                            break
                        }
                        r.push(new w(this, i, t, i, l, !1))
                    }
                    for (var h = i - 1; 1 <= h; h--) {
                        var u = e.getPiece(h, t);
                        if (u) {
                            if (u.color == this.color) break;
                            r.push(new w(this, i, t, h, t, !0));
                            break
                        }
                        r.push(new w(this, i, t, h, t, !1))
                    }
                    return r
                }, e._bishopMovement = function(e) {
                    for (var t = this.rank, i = this.file, r = [], n = 1; n < 8; n++) {
                        var a, o;
                        if (a = t + n, o = i + n, 8 < Math.max(a, o)) break;
                        var s = e.getPiece(o, a);
                        if (s) {
                            if (s.color == this.color) break;
                            r.push(new w(this, i, t, o, a, !0));
                            break
                        }
                        r.push(new w(this, i, t, o, a, !1))
                    }
                    for (var l = 1; l < 8; l++) {
                        var c, h;
                        if (c = t - l, h = i - l, Math.min(c, h) < 1) break;
                        var u = e.getPiece(h, c);
                        if (u) {
                            if (u.color == this.color) break;
                            r.push(new w(this, i, t, h, c, !0));
                            break
                        }
                        r.push(new w(this, i, t, h, c, !1))
                    }
                    for (var f = 1; f < 8; f++) {
                        var d, m;
                        if (m = i - f, 8 < (d = t + f) || m < 1) break;
                        var g = e.getPiece(m, d);
                        if (g) {
                            if (g.color == this.color) break;
                            r.push(new w(this, i, t, m, d, !0));
                            break
                        }
                        r.push(new w(this, i, t, m, d, !1))
                    }
                    for (var p = 1; p < 8; p++) {
                        var v, y;
                        if (y = i + p, (v = t - p) < 1 || 8 < y) break;
                        var b = e.getPiece(y, v);
                        if (b) {
                            if (b.color == this.color) break;
                            r.push(new w(this, i, t, y, v, !0));
                            break
                        }
                        r.push(new w(this, i, t, y, v, !1))
                    }
                    return r
                }, e._queenMovement = function(e) {
                    var t = [];
                    return t = (t = t.concat(this._rookMovement(e))).concat(this._bishopMovement(e))
                }, e._kingMovement = function(t) {
                    for (var e = this.rank, i = this.file, r = [], n = -1; n < 2; n++)
                        for (var a = -1; a < 2; a++)
                            if (0 != n || 0 != a) {
                                var o = i + n,
                                    s = e + a;
                                if (!(o < 1 || 8 < o || s < 1 || 8 < s)) {
                                    var l = t.getPiece(o, s);
                                    null != l ? l.color != this.color && r.push(new w(this, i, e, o, s, !0)) : r.push(new w(this, i, e, o, s, !1))
                                }
                            } for (var c = 0, h = [{
                            symbol: "K",
                            empty: ["f1", "g1"],
                            color: j.White
                        }, {
                            symbol: "Q",
                            empty: ["b1", "c1", "d1"],
                            color: j.White
                        }, {
                            symbol: "k",
                            empty: ["f8", "g8"],
                            color: j.Black
                        }, {
                            symbol: "q",
                            empty: ["b8", "c8", "d8"],
                            color: j.Black
                        }]; c < h.length; c++) {
                        var u = h[c];
                        if (u.color === this.color && t.castlings.match(u.symbol) && u.empty.every(function(e) {
                                return t.isEmpty(e)
                            })) {
                            var f = new w(this, i, e, "k" === u.symbol.toLowerCase() ? i + 2 : i - 2, e, !1);
                            f.castling = !0, r.push(f)
                        }
                    }
                    return r
                }, e._pawnMovement = function(e) {
                    for (var t = this.color == j.White ? 2 == this.rank ? 2 : 1 : 7 == this.rank ? -2 : -1, i = 0 < t ? 1 : -1, r = this.file, n = this.rank, a = [], o = -1; o < 2; o += 2) {
                        var s = e.getPiece(r + o, n + i);
                        if (s) {
                            if (s.color != this.color)
                                if (this.color == j.White && n + i == 8 || this.color == j.Black && n + i == 1)
                                    for (var l in K) {
                                        var c = K[l];
                                        if (c != K.Pawn && c != K.King) {
                                            var h = new w(this, r, n, r + o, n + i, !0);
                                            h.promotion = c, a.push(h)
                                        }
                                    } else {
                                        var u = new w(this, r, n, r + o, n + i, !0);
                                        a.push(u)
                                    }
                        } else if ((this.color == j.Black && 4 == n || 5 == n && this.color == j.White) && e.enPassant == r + o && (s = e.getPiece(r + o, n)) && s.name == K.Pawn && s.color != this.color) {
                            var f = new w(this, r, n, r + o, n + i, !0);
                            f.enPassant = !0, a.push(f)
                        }
                    }
                    for (var d = 1; d <= Math.abs(t); d++) {
                        var m = n + d * i,
                            g = e.getPiece(r, m);
                        if (!(m < 1 || 8 < m)) {
                            if (g) break;
                            if (this.color == j.White && n + i == 8 || this.color == j.Black && n + i == 1)
                                for (var p in K) {
                                    var v = K[p];
                                    if (v != K.Pawn && v != K.King) {
                                        var y = new w(this, r, n, r, m, !1);
                                        y.promotion = v, a.push(y)
                                    }
                                } else {
                                    var b = new w(this, r, n, r, m, !1);
                                    a.push(b)
                                }
                        }
                    }
                    return a
                }, e._knightMovement = function(e) {
                    for (var t = this.file, i = this.rank, r = [], n = -2; n < 3; n++)
                        if (0 != n)
                            for (var a = -2; a < 3; a++)
                                if (0 != a && Math.abs(n) != Math.abs(a)) {
                                    var o = t + n,
                                        s = i + a;
                                    if (!(o < 1 || s < 1 || 8 < o || 8 < s)) {
                                        var l = e.getPiece(o, s);
                                        l && l.color == this.color || r.push(new w(this, t, i, o, s, null != l))
                                    }
                                } return r
                }, i
            }(),
            w = function() {
                function e(e, t, i, r, n, a) {
                    void 0 === a && (a = !1), this.piece = e, this.fromFile = t, this.fromRank = i, this.toFile = r, this.toRank = n, this.kills = a, this.castling = !1, this.promotion = null, this.check = !1, this.mate = !1, this.enPassant = !1
                }
                var t = e.prototype;
                return t.toSquareString = function() {
                    return v[this.toFile] + this.toRank
                }, t.toString = function() {
                    var e = this.piece.nameString()[0].toUpperCase();
                    this.piece.name == K.Knight && (e = "N");
                    var t = "";
                    return this.promotion && (e = "P", t = C.PieceNameLookup[this.promotion][0], this.promotion == K.Knight && (t = "N")), e + v[this.fromFile] + this.fromRank + v[this.toFile] + this.toRank + t
                }, t.shortString = function() {
                    if (this.castling) return 7 == this.toFile ? "O-O" : "O-O-O";
                    var e = this.piece.nameString()[0].toUpperCase();
                    this.piece.name == K.Knight && (e = "N"), this.piece.name == K.Pawn && (e = "");
                    var t = this.kills ? "x" : "",
                        i = "";
                    return "Kg1" != (i = "x" == t && this.piece.name == K.Pawn ? v[this.fromFile] + t + v[this.toFile] + this.toRank : e + t + v[this.toFile] + this.toRank) && "Kg8" != i || "e" != this.FileLetter[this.fromFile] ? "Kc1" != i && "Kc8" != i || "e" != this.FileLetter[this.fromFile] ? i : "O-O-O" : "O-O"
                }, e
            }(),
            r = function() {
                function e(e) {
                    var t, i;
                    if (void 0 === e && (e = null), this.illegalMoveCache = [null, null], this.allPieces = [], this.kings = {}, this.Pieces = {}, this.grave = [], "string" == typeof e ? i = e : e && (t = e), t) {
                        for (var r in this.enPassant = t.enPassant, this.fullMove = t.fullMove, this.halfMove = t.halfMove, this.castlings = t.castlings, this.nextTurnColor = t.nextTurnColor, t.Pieces) {
                            var n = t.Pieces[r];
                            if (n) {
                                var a = n.clone(!0);
                                (this.Pieces[n.positionString()] = a).name === K.King && (this.kings[a.color] = a), this.allPieces.push(a)
                            }
                        }
                        var o = t.grave,
                            s = Array.isArray(o),
                            l = 0;
                        for (o = s ? o : o[Symbol.iterator]();;) {
                            var c;
                            if (s) {
                                if (l >= o.length) break;
                                c = o[l++]
                            } else {
                                if ((l = o.next()).done) break;
                                c = l.value
                            }
                            var h = c;
                            this.grave.push(h.clone(!0)), this.allPieces.push(h)
                        }
                    } else i ? this.loadFen(i) : this.loadFen("rnbqkbnr/qqqqqqqq/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
                    this.allPieces.sort(function(e, t) {
                        return e.id - t.id
                    })
                }
                var t = e.prototype;
                return t.loadFen = function(t) {
                    try {
                        var e = t.split(" "),
                            i = e[0],
                            r = e[1],
                            n = e[2],
                            a = e[3],
                            o = e[4],
                            s = e[5],
                            l = i.split("/");
                        l.reverse(), l.unshift(null), this.allPieces = [], this.Pieces = {};
                        for (var c = 1; c <= 8; c++)
                            for (var h = l[c], u = 1, f = 0; f < h.length; f++) {
                                var d = h.charAt(f);
                                if (d.match(/\d/)) u += parseInt(d);
                                else {
                                    var m = d.toUpperCase() === d ? j.White : j.Black,
                                        g = C.SymbolsToNames[d.toLowerCase()],
                                        p = new y(m, g, c, u);
                                    this.Pieces[p.positionString()] = p, this.allPieces.push(p), p.name === K.King && (this.kings[p.color] = p), u++
                                }
                            }
                        this.nextTurnColor = "w" === r ? j.White : j.Black, this.castlings = n.replace(/-/, ""), this.enPassant = "-" === a ? -1 : v.indexOf(a.charAt(0)), this.halfMove = parseInt(o), this.fullMove = parseInt(s)
                    } catch (e) {
                        throw new Error("Invalid fen: " + t + ", error: " + e)
                    }
                }, t.boardState = function() {
                    return this.toFen().split(" ")[0]
                }, t.toFen = function(e) {
                    void 0 === e && (e = !1);
                    for (var t = "", i = 8; 1 <= i; i--) {
                        var r = 0;
                        8 !== i && (t += "/");
                        for (var n = 1; n <= 8; n++) {
                            var a = v[n] + i,
                                o = this.Pieces[a];
                            if (o) {
                                0 < r && (t += r, r = 0);
                                var s = l[o.name];
                                o.color === j.White && (s = s.toUpperCase()), t += s
                            } else r++
                        }
                        0 < r && (t += r)
                    }
                    return t += " ", t += this.nextTurnColor === j.White ? "w " : "b ", t += this.castlings || "-", t += " ", -1 == this.enPassant ? t += "-" : t += v[this.enPassant] + (this.nextTurnColor === j.White ? 6 : 3), e || (t += " " + this.halfMove, t += " " + this.fullMove), t
                }, t.toUrl = function() {
                    var e, t = "https://cardgames.io/chess/?",
                        i = ((e = {})[j.White] = "w", e[j.Black] = "b", e),
                        r = Object.keys(this.Pieces);
                    r.sort();
                    for (var n = 0, a = r; n < a.length; n++) {
                        var o = a[n],
                            s = this.Pieces[o];
                        if (s) {
                            var l = i[s.color];
                            for (var c in C.PieceLetterLookup) {
                                if (C.PieceLetterLookup[c] == s.name) {
                                    l += c.toLowerCase();
                                    break
                                }
                            }
                            t += o + "=" + l + "&"
                        }
                    }
                    return t += "kill"
                }, t.loadState = function(o, e) {
                    function t(e) {
                        var t = o[e],
                            i = "w" === t.charAt(0) ? j.White : j.Black,
                            r = u[t.charAt(1).toUpperCase()],
                            n = s.allPieces.find(function(e) {
                                return e.color === i && e.name === r && !e._used
                            });
                        if (n) {
                            var a = s.Pieces[n.positionString()];
                            a && !a._used && delete s.Pieces[n.positionString()], n._used = !0, (s.Pieces[e] = n).file = " abcdefgh".indexOf(e.charAt(0)), n.rank = parseInt(e.charAt(1))
                        } else M.debug("Could not find " + r + " with color " + i + " at " + e)
                    }
                    var s = this;
                    for (var i in o) t(i);
                    if (e) {
                        var r = this.allPieces,
                            n = Array.isArray(r),
                            a = 0;
                        for (r = n ? r : r[Symbol.iterator]();;) {
                            var l;
                            if (n) {
                                if (a >= r.length) break;
                                l = r[a++]
                            } else {
                                if ((a = r.next()).done) break;
                                l = a.value
                            }
                            var c = l;
                            if (!c._used) {
                                var h = c.positionString();
                                c.rank = null, c.file = null, this.Pieces[h] === c && delete this.Pieces[h]
                            }
                        }
                    }
                    this.allPieces.forEach(function(e) {
                        return delete e._used
                    })
                }, t.getPiece = function(e, t) {
                    var i = v[e] + t;
                    return this.Pieces[i] ? this.Pieces[i] : null
                }, t.isEmpty = function(e) {
                    return !this.Pieces[e]
                }, t.getGraveyard = function(e) {
                    if (0 <= e && e < this.grave.length) return this.grave[e];
                    throw "OUT OF LIST RANGE"
                }, t.getUnvalidatedMoves = function(e) {
                    if (null != this.illegalMoveCache[e]) return this.illegalMoveCache[e];
                    var t = [];
                    for (var i in this.Pieces) {
                        var r = this.Pieces[i];
                        r && r.color == e && (t = t.concat(r.moves(this)))
                    }
                    return t
                }, t.getCheckPieces = function(e) {
                    var t, i;
                    try {
                        t = this.kings[e]
                    } catch (e) {
                        return M.debug(e), M.debug("var king = this.getKing(color);"), {
                            pieces: [],
                            king: t
                        }
                    }
                    try {
                        i = t.getCheckers(this)
                    } catch (e) {
                        return {
                            pieces: [],
                            king: t
                        }
                    }
                    return {
                        pieces: i,
                        king: t
                    }
                }, t.check = function(e) {
                    return 0 < this.getCheckPieces(e).pieces.length
                }, t.checkMate = function(e) {
                    var t = 0 < this.getCheckPieces(e).pieces.length,
                        i = 0 == this.fasterAllLegalMoves(e).length;
                    return t && i
                }, t.insufficientMaterial = function() {
                    var e, t, i, r = c(this);
                    t = e = !1;
                    for (var n, a = i = 0; a < r.length; a++) {
                        var o = (n = a, (Math.floor(n / 8) % 2 + n % 2) % 2),
                            s = r[a].toUpperCase();
                        if ("-" !== s) switch (s) {
                            case "N":
                                if (e || t || 2 === i) return !1;
                                i++;
                                break;
                            case "B":
                                if (0 == o) {
                                    if (t || 0 < i) return !1;
                                    e = !0
                                } else {
                                    if (e || 0 < i) return !1;
                                    t = !0
                                }
                                break;
                            case "K":
                                break;
                            default:
                                return !1
                        }
                    }
                    return !0
                }, t.getAllPieces = function() {
                    var e = [],
                        t = [];
                    for (var i in this.Pieces) {
                        var r = this.Pieces[i];
                        r && (r.color == j.White ? e.push(r) : t.push(r))
                    }
                    return {
                        white: e,
                        black: t
                    }
                }, t.fasterAllLegalMoves = function(e) {
                    var t = [];
                    for (var i in this.Pieces) {
                        var r = this.Pieces[i];
                        if (r && r.color === e) {
                            var n = this.fasterLegalMoves(r);
                            t = t.concat(n)
                        }
                    }
                    return t
                }, t.allLegalMoves = function(e) {
                    var t = [];
                    for (var i in this.Pieces) {
                        var r = this.Pieces[i];
                        if (r && r.color === e) {
                            var n = this.legalMoves(r);
                            t = t.concat(n)
                        }
                    }
                    return t
                }, t.fasterLegalMoves = function(e) {
                    var t = [],
                        i = e.moves(this),
                        r = e.color,
                        n = i,
                        a = Array.isArray(n),
                        o = 0;
                    for (n = a ? n : n[Symbol.iterator]();;) {
                        var s;
                        if (a) {
                            if (o >= n.length) break;
                            s = n[o++]
                        } else {
                            if ((o = n.next()).done) break;
                            s = o.value
                        }
                        var l = s,
                            c = this.getNextTable(l),
                            h = this.check(r) && l.castling;
                        c.check(r) || h || (l.table = c, t.push(l))
                    }
                    return t
                }, t.legalMoves = function(e) {
                    var t = [],
                        i = e.moves(this),
                        r = e.color,
                        n = k(e.color),
                        a = i,
                        o = Array.isArray(a),
                        s = 0;
                    for (a = o ? a : a[Symbol.iterator]();;) {
                        var l;
                        if (o) {
                            if (s >= a.length) break;
                            l = a[s++]
                        } else {
                            if ((s = a.next()).done) break;
                            l = s.value
                        }
                        var c = l;
                        if (c.castling) {
                            for (var h = !0, u = 0, f = 5 < c.toFile ? [5, 6, 7] : [3, 4, 5]; u < f.length; u++) {
                                var d = f[u],
                                    m = new w(c.piece, c.fromFile, c.fromRank, d, c.toRank, !1);
                                if (c.fromFile == d && c.fromRank == c.toRank) {
                                    if (this.check(r)) {
                                        this.getCheckPieces(r);
                                        h = !1
                                    }
                                } else {
                                    var g = this.getNextTable(m);
                                    g.check(e.color) && (h = !1), c.table = g
                                }
                            }
                            h && t.push(c)
                        } else {
                            var p = this.getNextTable(c);
                            p.check(r) || (c.table = p, t.push(c))
                        }
                    }
                    for (var v = 0, y = t; v < y.length; v++) {
                        var b = y[v];
                        b.check = b.table.check(n), b.check && (b.mate = b.table.checkMate(n))
                    }
                    return t
                }, t.getAssignedPiece = function(e) {
                    for (var t in this.Pieces) {
                        var i = this.Pieces[t];
                        if (i && i.guiPiece == e) return i
                    }
                    return null
                }, t.movePiece = function(e, t, i) {
                    if (!e) return []; - 1 != v.indexOf(t) && (t = v.indexOf(t));
                    var r, n = e.positionString(),
                        a = [];
                    if (e.name == K.King && 2 == Math.abs(e.file - t)) {
                        var o = 5 < t ? 6 : 4,
                            s = 5 < t ? 8 : 1,
                            l = this.getPiece(s, e.rank);
                        a.push([e, e.positionString(), v[t] + i]), a.push([l, l.positionString(), v[o] + i]), delete this.Pieces[e.positionString()], e.file = t, this.Pieces[e.positionString()] = e, delete this.Pieces[l.positionString()], l.file = o, this.Pieces[l.positionString()] = l
                    } else {
                        if (i = parseInt(i), r = this.getPiece(t, i), a.push([e, e.positionString(), v[t] + i]), r) {
                            if (r.color == e.color) throw "PIECE TRYING TO KILL A FRIEND (" + e.positionString() + " -> " + r.positionString() + ")";
                            a.push([r, r.positionString(), "grave"]), r.rank = null, r.file = null
                        } else e.name == K.Pawn && this.enPassant == t && (r = this.getPiece(t, e.rank)) && r.color != e.color && r.name == K.Pawn && (a.push([r, r.positionString(), "grave"]), delete this.Pieces[r.positionString()], r.rank = null, r.file = null);
                        delete this.Pieces[e.positionString()], e.name == K.Pawn && 2 == Math.abs(i - e.rank) ? this.enPassant = t : this.enPassant = -1, e.rank = i, e.file = t, this.Pieces[e.positionString()] = e
                    }
                    e.color === j.Black && this.fullMove++, r || e.name == K.Pawn ? this.halfMove = 0 : this.halfMove++;
                    var c = e.positionString();
                    return "e1" === n ? this.removeCastling("KQ") : "a1" === n || "a1" === c ? this.removeCastling("Q") : "h1" !== n && "h1" !== c || this.removeCastling("K"), "e8" === n ? this.removeCastling("kq") : "a8" === n || "a8" === c ? this.removeCastling("q") : "h8" !== n && "h8" !== c || this.removeCastling("k"), this.nextTurnColor = e.color === j.White ? j.Black : j.White, a
                }, t.removeCastling = function(e) {
                    for (var t = 0; t < e.length; t++) {
                        var i = e.charAt(t);
                        this.castlings = this.castlings.replace(i, "")
                    }
                }, t.clone = function() {
                    return new e(this)
                }, t.getNextTable = function(e) {
                    var t = this.clone(),
                        i = t.getPiece(e.fromFile, e.fromRank);
                    return t.movePiece(i, e.toFile, e.toRank), t
                }, t.getAllNextTables = function(e) {
                    var t = [],
                        i = this.allLegalMoves(e),
                        r = Array.isArray(i),
                        n = 0;
                    for (i = r ? i : i[Symbol.iterator]();;) {
                        var a;
                        if (r) {
                            if (n >= i.length) break;
                            a = i[n++]
                        } else {
                            if ((n = i.next()).done) break;
                            a = n.value
                        }
                        var o = a,
                            s = this.getNextTable(o);
                        s.move = o.toString(), t.push(s)
                    }
                    return t
                }, t.parseMove = function(e) {
                    var t = new w,
                        i = (e[0], v.indexOf(e[1])),
                        r = e[2],
                        n = v.indexOf(e[3]),
                        a = e[4],
                        o = null;
                    6 == e.length && (o = e[5]);
                    K.Pawn, K.Knight, K.Rook, K.Bishop, K.Queen, K.King;
                    return "Ke1g1" != e && "Ke8g8" != e || (t.castling = !0), "Ke1c1" != e && "Ke8c8" != e || (t.castling = !0), t.piece = this.getPiece(i, r), t.fromFile = i, t.fromRank = r, t.toFile = n, t.toRank = a, o && (t.promotion = u[o]), t
                }, t.evalTable = function() {
                    var e = this.getAllPieces(),
                        t = e.black,
                        i = e.white,
                        r = (t.length + i.length) / 32,
                        n = 1 - r,
                        a = C.pst_start,
                        o = C.pst_end,
                        s = 0,
                        l = 0,
                        c = 0,
                        h = i,
                        u = Array.isArray(h),
                        f = 0;
                    for (h = u ? h : h[Symbol.iterator]();;) {
                        var d;
                        if (u) {
                            if (f >= h.length) break;
                            d = h[f++]
                        } else {
                            if ((f = h.next()).done) break;
                            d = f.value
                        }
                        var m = d;
                        if (m.rank && m.file) {
                            s += C.CentiPieceValues[m.name];
                            var g = 8 - m.rank,
                                p = m.file - 1;
                            try {
                                s += .5 * (r * a[m.name][g][p] + n * o[m.name][g][p])
                            } catch (e) {
                                M.debug(m), M.debug(m.rank + " , " + m.file), M.debug(m.name + " white errs on " + g + " , " + p)
                            }
                            m.name == K.Bishop && (l += 1)
                        }
                    }
                    var v = t,
                        y = Array.isArray(v),
                        b = 0;
                    for (v = y ? v : v[Symbol.iterator]();;) {
                        var k;
                        if (y) {
                            if (b >= v.length) break;
                            k = v[b++]
                        } else {
                            if ((b = v.next()).done) break;
                            k = b.value
                        }
                        var w = k;
                        if (w.rank && w.file) {
                            s -= C.CentiPieceValues[w.name];
                            var $ = w.rank - 1,
                                S = w.file - 1;
                            try {
                                s -= .5 * (r * a[w.name][$][S] + n * o[w.name][$][S])
                            } catch (e) {
                                M.debug(o[w.name]), M.debug(a[w.name]), M.debug(w.name + " black errs on " + $ + " , " + S)
                            }
                            w.name == K.Bishop && (c += 1)
                        }
                    }
                    return 2 == l && (s += .5), 2 == c && (s -= .5), s
                }, e
            }(),
            n = function() {
                function e(e) {
                    this.renderer = e, this.players = [], this.register = "", this.reset()
                }
                var t = e.prototype;
                return t.addPlayer = function(e) {
                    (e.game = this).players.push(e), e.color = e === this.players[j.White] ? j.White : j.Black
                }, t.message = function() {}, t.start = function() {
                    var e = this.table.allLegalMoves(this.currentPlayer);
                    this.turnMessage(), this.players[this.currentPlayer].makeMove(e)
                }, t.reset = function() {
                    this.table = new r, this.currentPlayer = j.White, this.moves = 0, this.history = [], this.stateCounter = {}, this.finished = !1
                }, t.getTable = function() {
                    return this.table
                }, t.getCurrentPlayerColor = function() {
                    return this.currentPlayer
                }, t.getAssignedPiece = function(e) {
                    return this.table.getAssignedPiece(e)
                }, t.getMoves = function(e) {
                    return this.table.legalMoves(e)
                }, t.canMove = function(e) {
                    return e.color == this.currentPlayer
                }, t.humanTurn = function() {
                    return this.players[this.currentPlayer].isHuman
                }, t.getLastMove = function() {
                    return 0 == this.history.length ? null : this.history[this.history.length - 1][1]
                }, t.movePiece = function(e) {
                    var t = this;
                    if (e.piece.color != this.currentPlayer) throw new Error("CANNOT MOVE ENEMY PIECES");
                    var i = k(this.currentPlayer),
                        r = this.table.movePiece(e.piece, e.toFile, e.toRank);
                    if (0 == r.length) throw "A piece failed to move.";
                    var n = this.players[this.currentPlayer],
                        a = {
                            pieces: r
                        };
                    e.table = this.table.getNextTable(e), e.table.check(i) && (e.check = e.table.getCheckPieces(i), e.table.checkMate(i) && (e.mate = !0));
                    var o = {
                        gameId: this.startTime,
                        moved: a,
                        game: this,
                        check: e.check,
                        player: n,
                        mate: e.mate,
                        moveString: e.toString(),
                        callback: function() {
                            return t.afterMove()
                        }
                    };
                    e.promotion && (o.promotion = {
                        piece: e.piece,
                        promoteTo: e.promotion
                    }), this.renderer.movePieces(o)
                }, t.isPromotion = function(e, t) {
                    return e.name === K.Pawn && (8 === t && e.color === j.White || 1 === t && e.color === j.Black)
                }, t.surrender = function(e) {
                    this.forceQuit(e, "concede")
                }, t.timeout = function(e) {
                    this.forceQuit(e, "timeout")
                }, t.forceQuit = function(e, t) {
                    if (!this.finished) {
                        this.finished = !0;
                        var i = this.players,
                            r = i[0],
                            n = i[1];
                        r.endGame(), n.endGame();
                        var a = e === r ? n : r;
                        this.finishGame(t, a + " has won.", a)
                    }
                }, t.makeMove = function(e, t) {
                    if ((e === this.players[0] || e === this.players[1]) && !this.finished && (e.isMoving || 2 == this.players.length)) {
                        var i = this.table.allLegalMoves(this.currentPlayer).map(function(e) {
                            return e.toString()
                        });
                        if (-1 != v.indexOf(t.toFile) && (t.toFile = v.indexOf(t.toFile)), -1 == i.indexOf(t.toString())) throw M.debug(i), M.debug(t.toString()), "ILLEGAL MOVE";
                        var r = this.table.toFen();
                        this.moves += 1, t.kills && (e.killCount = 1 + e.killCount || 1);
                        var n = t.piece,
                            a = (t.toFile, t.toRank);
                        n.name == K.Pawn && (n.color == j.White ? 8 == a && (e.promoteCount = 1 + e.promoteCount || 1, this.promotePiece(n, t.promotion)) : 1 == a && (e.promoteCount = 1 + e.promoteCount || 1, this.promotePiece(n, t.promotion))), e.isMoving = !1, this.history.push([e, t, r]);
                        var o = this.table.boardState();
                        this.evalTable();
                        this.stateCounter[o] = this.stateCounter[o] + 1 || 1, this.movePiece(t)
                    }
                }, t.promotePiece = function(e, t) {
                    switch (t) {
                        case K.Rook:
                            e.name = t, e.moves = e._rookMovement;
                            break;
                        case K.Bishop:
                            e.name = t, e.moves = e._bishopMovement;
                            break;
                        case K.Knight:
                            e.name = t, e.moves = e._knightMovement;
                            break;
                        case K.Queen:
                            e.name = t, e.moves = e._queenMovement;
                            break;
                        default:
                            new Error;
                            throw "PAWN BEING PROMOTED INTO ILLEGAL PIECE!"
                    }
                }, t.getOtherPlayer = function(e) {
                    return e === j.White ? j.Black : j.White
                }, t.afterMove = function() {
                    if (!this.finished) {
                        var e = this.currentPlayer;
                        this.currentPlayer = this.getOtherPlayer(this.currentPlayer);
                        var t = this.table.allLegalMoves(this.currentPlayer);
                        this.table.checkMate(this.currentPlayer) ? this.finishGame("checkmate", "", this.players[e]) : 100 < this.table.halfMove ? this.finishGame("nocapture", "There has not been a capture or pawn move in 50 turns") : 0 === t.length ? this.finishGame("stalemate", "No move is legal, it's a stalemate.") : 3 == this.stateCounter[this.table.boardState()] ? this.finishGame("fivefoldrepetition", "Threefold repetition, the current game state has appeared 3 times.") : this.insufficientMaterial() ? this.finishGame("insufficiantmaterial", "Insufficient material, neither player can force a checkmate.") : (this.turnMessage(), this.getCurrentPlayer().makeMove(t))
                    }
                }, t.insufficientMaterial = function() {
                    return this.table.insufficientMaterial()
                }, t.turnMessage = function() {
                    var e = this.players[this.currentPlayer];
                    "bottom-player" === e.id ? this.message("Your turn. Click any valid piece to move.") : this.message(e.name + "'s turn.")
                }, t.finishGame = function(e, t, i) {
                    void 0 === i && (i = null);
                    var r = this.players,
                        n = r[0],
                        a = r[1],
                        o = {
                            type: e,
                            description: t,
                            callback: s,
                            winner: i,
                            game: this
                        };
                    i && (o.loser = i === n ? a : n), this.finished = !0, this.renderer.finishGame(o)
                }, t.getCurrentPlayer = function() {
                    return this.players[this.currentPlayer]
                }, t.parseMove = function(e) {
                    return this.table.parseMove(e)
                }, t.evalTable = function() {
                    var e = this.table.getAllNextTables(this.currentPlayer);
                    if (0 == e.length) return M.debug("error"), 0;
                    var t = -1e8,
                        i = e[0],
                        r = 1 - 2 * this.currentPlayer,
                        n = e,
                        a = Array.isArray(n),
                        o = 0;
                    for (n = a ? n : n[Symbol.iterator]();;) {
                        var s;
                        if (a) {
                            if (o >= n.length) break;
                            s = n[o++]
                        } else {
                            if ((o = n.next()).done) break;
                            s = o.value
                        }
                        var l = s,
                            c = l.evalTable() * r;
                        t < c && (t = c, i = l)
                    }
                    var h = i.getAllNextTables(1 - this.currentPlayer);
                    if (0 == h.length) return M.debug("error"), 0;
                    t = -1e8, i = h[0], r = -r;
                    var u = h,
                        f = Array.isArray(u),
                        d = 0;
                    for (u = f ? u : u[Symbol.iterator]();;) {
                        var m;
                        if (f) {
                            if (d >= u.length) break;
                            m = u[d++]
                        } else {
                            if ((d = u.next()).done) break;
                            m = d.value
                        }
                        var g = m,
                            p = g.evalTable() * r;
                        t < p && (t = p, i = g)
                    }
                    return i.evalTable()
                }, e
            }();
        t.exports = {
            Piece: y,
            Move: w,
            Table: r,
            Chess: n
        }
    }, {
        "../shared/helper-functions": 19,
        "./chess-enums.js": 4,
        "./chess-stringchess": 9
    }],
    12: [function(e, t, i) {
        "use strict";
        t.exports = function(n) {
            var w, $, g, S, C = 40;

            function f(e) {
                return ["a", "b", "c", "d", "e", "f", "g", "h"][(15 & e) - 4] + (9 - (e >> 4) + 1)
            }

            function a(e) {
                var t = f(255 & e) + f(e >> 8 & 255);
                return e & ie && (t += e & ae ? "b" : e & re ? "n" : e & ne ? "q" : "r"), t
            }

            function i(e) {
                for (var t = Ue(), i = 0; i < t.length; i++)
                    if (a(t[i]) == e) return t[i];
                n.postMessage("ERROR: " + e + " fen:" + function() {
                    for (var e = "", t = 0; t < 8; t++) {
                        0 != t && (e += "/");
                        for (var i = 0, r = 0; r < 8; r++) {
                            var n = we[(t + 2 << 4) + r + 4];
                            if (0 == n) i++;
                            else {
                                0 != i && (e += i);
                                var a = [" ", "p", "n", "b", "r", "q", "k", " "][7 & n];
                                e += (i = 0) != (n & _) ? a.toUpperCase() : a
                            }
                        }
                        0 != i && (e += i)
                    }
                    return e += se == _ ? " w" : " b", e += " ", 0 == le ? e += "-" : (0 != (1 & le) && (e += "K"), 0 != (2 & le) && (e += "Q"), 0 != (4 & le) && (e += "k"), 0 != (8 & le) && (e += "q")), e += " ", e += -1 == ce ? "-" : f(ce)
                }())
            }

            function o(e, t) {
                if (0 == t) return "";
                if (0 == e) return de ? "checkmate" : "stalemate";
                var i = " " + function(e, t) {
                    var i = 255 & e,
                        r = e >> 8 & 255;
                    if (e & ee) return "O-O";
                    if (e & te) return "O-O-O";
                    var n = 7 & we[i],
                        a = ["", "", "N", "B", "R", "Q", "K", ""][n],
                        o = !1,
                        s = !0,
                        l = !0;
                    null == t && (t = Ue());
                    for (var c = 0; c < t.length; c++) {
                        var h = 255 & t[c],
                            u = t[c] >> 8 & 255;
                        h != i && u == r && (7 & we[h]) == n && (o = !0, (240 & h) == (240 & i) && (s = !1), (15 & h) == (15 & i) && (l = !1))
                    }
                    return o ? a += l ? f(i).charAt(0) : s ? f(i).charAt(1) : f(i) : n == q && (0 != we[r] || e & Z) && (a += f(i).charAt(0)), (0 != we[r] || e & Z) && (a += "x"), a += f(r), e & ie && (a += e & ae ? "=B" : e & re ? "=N" : e & ne ? "=Q" : "=R"), Le(e), de && (a += 0 == Ue().length ? "#" : "+"), Fe(e), a
                }(e);
                Le(e);
                var r = me[ue & xe];
                return null != r && r.lock == fe && null != r.bestMove && (i += o(r.bestMove, t - 1)), Fe(e), i
            }

            function r(e, t, i) {
                var r = M,
                    n = x;
                0, S = !(g = $ = 0);
                var a, o, s = 0;
                for (w = (new Date).getTime(), o = 1; o <= t && S; o++) {
                    var l = L(o, 0, r, n);
                    if (!S) break;
                    r < (a = l) && a < n ? ((r = a - 500) < M && (r = M), x < (n = a + 500) && (n = x)) : r != M && (r = M, n = x, o--), null != me[ue & xe] && (s = me[ue & xe].bestMove), null != i && i(s, a, (new Date).getTime() - w, o)
                }
                null != e && e(s, a, (new Date).getTime() - w, o - 1)
            }
            var M = -2e6,
                x = 2e6,
                P = M + 2e3,
                A = x - 2e3,
                k = [0, 800, 3350, 3450, 5e3, 9750, 6e5],
                u = [0, 0, 0, 0, 0, 0, 0, 0, -25, 105, 135, 270, 270, 135, 105, -25, -80, 0, 30, 176, 176, 30, 0, -80, -85, -5, 25, 175, 175, 25, -5, -85, -90, -10, 20, 125, 125, 20, -10, -90, -95, -15, 15, 75, 75, 15, -15, -95, -100, -20, 10, 70, 70, 10, -20, -100, 0, 0, 0, 0, 0, 0, 0, 0],
                d = [-200, -100, -50, -50, -50, -50, -100, -200, -100, 0, 0, 0, 0, 0, 0, -100, -50, 0, 60, 60, 60, 60, 0, -50, -50, 0, 30, 60, 60, 30, 0, -50, -50, 0, 30, 60, 60, 30, 0, -50, -50, 0, 30, 30, 30, 30, 0, -50, -100, 0, 0, 0, 0, 0, 0, -100, -200, -50, -25, -25, -25, -25, -50, -200],
                m = [-50, -50, -25, -10, -10, -25, -50, -50, -50, -25, -10, 0, 0, -10, -25, -50, -25, -10, 0, 25, 25, 0, -10, -25, -10, 0, 25, 40, 40, 25, 0, -10, -10, 0, 25, 40, 40, 25, 0, -10, -25, -10, 0, 25, 25, 0, -10, -25, -50, -25, -10, 0, 0, -10, -25, -50, -50, -50, -25, -10, -10, -25, -50, -50],
                p = [-60, -30, -10, 20, 20, -10, -30, -60, 40, 70, 90, 120, 120, 90, 70, 40, -60, -30, -10, 20, 20, -10, -30, -60, -60, -30, -10, 20, 20, -10, -30, -60, -60, -30, -10, 20, 20, -10, -30, -60, -60, -30, -10, 20, 20, -10, -30, -60, -60, -30, -10, 20, 20, -10, -30, -60, -60, -30, -10, 20, 20, -10, -30, -60],
                v = [50, 150, -25, -125, -125, -25, 150, 50, 50, 150, -25, -125, -125, -25, 150, 50, 50, 150, -25, -125, -125, -25, 150, 50, 50, 150, -25, -125, -125, -25, 150, 50, 50, 150, -25, -125, -125, -25, 150, 50, 50, 150, -25, -125, -125, -25, 150, 50, 50, 150, -25, -125, -125, -25, 150, 50, 150, 250, 75, -25, -25, 75, 250, 150],
                y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                T = new Array(8),
                E = new Array(256);

            function b(e) {
                var t, i, r, n, a = 0,
                    o = 8 == e ? 16 : 8,
                    s = 8 == e ? ke[0] : ke[1];
                for (r = -3, n = (2 | e) << 4, t = Re[n++]; 0 != t;) r += s[we[t + 31]], r += s[we[t + 33]], r += s[we[t + 14]], r += s[we[t - 14]], r += s[we[t - 31]], r += s[we[t - 33]], r += s[we[t + 18]], r += s[we[t - 18]], t = Re[n++];
                for (a += 65 * r, r = -4, n = (3 | e) << 4, t = Re[n++]; 0 != t;) {
                    for (i = t - 15; 0 == we[i];) i -= 15, r++;
                    if (we[i] & o && (r++, !(we[i] & q))) {
                        for (i -= 15; 0 == we[i];) i -= 15;
                        r += s[we[i]] << 2
                    }
                    for (i = t - 17; 0 == we[i];) i -= 17, r++;
                    if (we[i] & o && (r++, !(we[i] & q))) {
                        for (i -= 17; 0 == we[i];) i -= 17;
                        r += s[we[i]] << 2
                    }
                    for (i = t + 15; 0 == we[i];) i += 15, r++;
                    if (we[i] & o && (r++, !(we[i] & q))) {
                        for (i += 15; 0 == we[i];) i += 15;
                        r += s[we[i]] << 2
                    }
                    for (i = t + 17; 0 == we[i];) i += 17, r++;
                    if (we[i] & o && (r++, !(we[i] & q))) {
                        for (i += 17; 0 == we[i];) i += 17;
                        r += s[we[i]] << 2
                    }
                    t = Re[n++]
                }
                for (a += 44 * r, r = -4, n = (4 | e) << 4, t = Re[n++]; 0 != t;) {
                    for (i = t - 1; 0 == we[i];) i--, r++;
                    for (we[i] & o && r++, i = t + 1; 0 == we[i];) i++, r++;
                    for (we[i] & o && r++, i = t + 16; 0 == we[i];) i += 16, r++;
                    for (we[i] & o && r++, i = t - 16; 0 == we[i];) i -= 16, r++;
                    we[i] & o && r++, t = Re[n++]
                }
                for (a += 25 * r, r = -2, n = (5 | e) << 4, t = Re[n++]; 0 != t;) {
                    for (i = t - 15; 0 == we[i];) i -= 15, r++;
                    for (we[i] & o && r++, i = t - 17; 0 == we[i];) i -= 17, r++;
                    for (we[i] & o && r++, i = t + 15; 0 == we[i];) i += 15, r++;
                    for (we[i] & o && r++, i = t + 17; 0 == we[i];) i += 17, r++;
                    for (we[i] & o && r++, i = t - 1; 0 == we[i];) i--, r++;
                    for (we[i] & o && r++, i = t + 1; 0 == we[i];) i++, r++;
                    for (we[i] & o && r++, i = t + 16; 0 == we[i];) i += 16, r++;
                    for (we[i] & o && r++, i = t - 16; 0 == we[i];) i -= 16, r++;
                    we[i] & o && r++, t = Re[n++]
                }
                return a += 22 * r
            }

            function I(e) {
                var t, i = e >> 8 & 255,
                    r = 7 & we[i],
                    n = we[255 & e];
                0 != r ? t = (r << 5) - (7 & n) : t = Pe[15 & n][i];
                return t
            }

            function O(e, t, i) {
                g++;
                var r = de ? M + 1 : function() {
                    var e = he,
                        t = 0;
                    0 == Re[K << 4] && (t -= T[H][Re[(_ | H) << 4]]), 0 == Re[(_ | K) << 4] && (t += T[H][E[Re[H << 4]]]), 2 <= Ne[U] && (t -= 500), 2 <= Ne[U | _] && (t += 500);
                    var i = b(8) - b(0);
                    return 0 == se ? (e -= i, e -= t) : (e += i, e += t), e
                }();
                if (t <= r) return r;
                e < r && (e = r);
                var n = new Array,
                    a = new Array,
                    o = de;
                if (o) {
                    Ke(n, null), je(n);
                    for (var s = 0; s < n.length; s++) a[s] = I(n[s])
                } else {
                    Ke(n, null);
                    for (s = 0; s < n.length; s++) {
                        var l = 7 & we[n[s] >> 8 & 255],
                            c = 7 & we[255 & n[s]];
                        a[s] = (l << 5) - c
                    }
                }
                for (s = 0; s < n.length; s++) {
                    for (var h = s, u = n.length - 1; s < u; u--) a[u] > a[h] && (h = u);
                    var f = n[s];
                    n[s] = n[h], n[h] = f;
                    var d = a[s];
                    if (a[s] = a[h], a[h] = d, (o || Ye(n[s])) && Le(n[s])) {
                        var m = -O(-t, -e, i - 1);
                        if (Fe(n[s]), r < m) {
                            if (t <= m) return m;
                            e < m && (e = m), r = m
                        }
                    }
                }
                return r
            }

            function D(e, t, i, r, n) {
                A <= e ? e += n : e <= P && (e -= n), me[ue & xe] = new s(fe, e, t, i, r)
            }

            function c(e) {
                var t = 255 & e,
                    i = e >> 8 & 255,
                    r = we[t],
                    n = 7 & r;
                if (n < q || H < n) return !1;
                if (se != (8 & r)) return !1;
                if (0 != we[i] && se == (8 & we[i])) return !1;
                if (n != q) return !(e >> 16) && We(i, t);
                if (e & Z) return !1;
                var a = i - t;
                if (se == _ != a < 0) return !1;
                var o = 240 & i;
                if ((144 == o && !se || 32 == o && se) != (e & ie)) return !1;
                if (-16 == a || 16 == a) return 0 == we[i];
                if (-15 == a || -17 == a || 15 == a || 17 == a) return 0 != we[i];
                if (-32 == a) {
                    if (96 != o) return !1;
                    if (0 != we[i]) return !1;
                    if (0 != we[t - 16]) return !1
                } else {
                    if (32 != a) return !1;
                    if (80 != o) return !1;
                    if (0 != we[i]) return !1;
                    if (0 != we[16 + t]) return !1
                }
                return !0
            }

            function G() {
                var e = $e - 1 - Ce;
                e = e < 0 ? 0 : e;
                for (var t = $e - 5; e <= t; t -= 2)
                    if (Me[t] == ue) return !0;
                return !1
            }

            function R(l, e, t, i) {
                this.hashMove = l, this.depth = e, this.killer1 = t, this.killer2 = i, this.moves = new Array, this.losingCaptures = null, this.moveCount = 0, this.atMove = -1, this.moveScores = null, this.stage = 0, this.nextMove = function() {
                    if (++this.atMove == this.moveCount) {
                        if (this.stage++, 1 == this.stage && (null != this.hashMove && c(l) && (this.moves[0] = l, this.moveCount = 1), 1 != this.moveCount && (this.hashMove = null, this.stage++)), 2 == this.stage) {
                            Ke(this.moves, null), this.moveCount = this.moves.length, this.moveScores = new Array(this.moveCount);
                            for (var e = this.atMove; e < this.moveCount; e++) {
                                var t = 7 & we[this.moves[e] >> 8 & 255],
                                    i = 7 & we[255 & this.moves[e]];
                                this.moveScores[e] = (t << 5) - i
                            }
                            this.atMove == this.moveCount && this.stage++
                        }
                        if (3 == this.stage && (c(this.killer1) && this.killer1 != this.hashMove ? (this.moves[this.moves.length] = this.killer1, this.moveCount = this.moves.length) : (this.killer1 = 0, this.stage++)), 4 == this.stage && (c(this.killer2) && this.killer2 != this.hashMove ? (this.moves[this.moves.length] = this.killer2, this.moveCount = this.moves.length) : (this.killer2 = 0, this.stage++)), 5 == this.stage) {
                            je(this.moves), this.moveCount = this.moves.length;
                            for (e = this.atMove; e < this.moveCount; e++) this.moveScores[e] = I(this.moves[e]);
                            this.atMove == this.moveCount && this.stage++
                        }
                        if (6 == this.stage) {
                            if (null != this.losingCaptures) {
                                for (e = 0; e < this.losingCaptures.length; e++) this.moves[this.moves.length] = this.losingCaptures[e];
                                for (e = this.atMove; e < this.moveCount; e++) this.moveScores[e] = I(this.moves[e]);
                                this.moveCount = this.moves.length
                            }
                            this.atMove == this.moveCount && this.stage++
                        }
                        if (7 == this.stage) return 0
                    }
                    for (var r = this.atMove, n = this.atMove + 1; n < this.moveCount; n++) this.moveScores[n] > this.moveScores[r] && (r = n);
                    if (r != this.atMove) {
                        var a = this.moves[this.atMove];
                        this.moves[this.atMove] = this.moves[r], this.moves[r] = a;
                        var o = this.moveScores[this.atMove];
                        this.moveScores[this.atMove] = this.moveScores[r], this.moveScores[r] = o
                    }
                    var s = this.moves[this.atMove];
                    return 1 < this.stage && s == this.hashMove || 3 < this.stage && s == this.killer1 || 4 < this.stage && s == this.killer2 ? this.nextMove() : 2 != this.stage || Ye(s) ? this.moves[this.atMove] : (null == this.losingCaptures && (this.losingCaptures = new Array), this.losingCaptures[this.losingCaptures.length] = s, this.nextMove())
                }
            }

            function N(e, t, i, r) {
                if (e <= 0) return O(i - 1, i, 0);
                if (127 == (127 & $) && (new Date).getTime() - w > C) return S = !1, i - 1;
                if ($++, G()) return 0;
                if (i <= M + t) return i;
                if (x - (t + 1) < i) return i - 1;
                var n = null,
                    a = me[ue & xe];
                if (null != a && a.lock == fe && (n = a.bestMove, a.hashDepth >= e)) {
                    var o = a.value;
                    if (A <= o ? o -= t : o <= P && (o += t), a.flags == Ee) return o;
                    if (a.flags == Ae && o < i) return o;
                    if (a.flags == Te && i <= o) return o
                }
                if (!de && r && P < i && i < A) {
                    if (null == n && e < 4) {
                        var s = 2500 + 200 * e;
                        if (he < i - s) {
                            var l = i - s,
                                c = O(l - 1, l, 0);
                            if (c < l) return c
                        }
                    }
                    if (1 < e && i - (4 <= e ? 2500 : 0) <= he && (0 != Ne[U | se] || 0 != Ne[B | se] || 0 != Ne[j | se] || 0 != Ne[K | se])) {
                        var h = 3 + (5 <= e ? 1 : e / 4);
                        1500 < he - i && h++, se = 8 - se, he = -he, ue ^= ye, fe ^= be;
                        var u = -N(e - h, t + 1, -(i - 1), !1);
                        if (ue ^= ye, fe ^= be, se = 8 - se, he = -he, i <= u) return i
                    }
                }
                for (var f = !1, d = M - 1, m = new R(n, t, ge[t][0], ge[t][1]);;) {
                    var g = m.nextMove();
                    if (0 == g) break;
                    var p = e - 1;
                    if (Le(g)) {
                        var v = !0;
                        if (de) p++;
                        else {
                            var y = p - (14 < m.atMove ? 2 : 1);
                            5 == m.stage && 5 < m.atMove && 3 <= e && (v = i <= (u = -N(y, t + 1, -(i - 1), !0)))
                        }
                        if (v && (u = -N(p, t + 1, -(i - 1), !0)), f = !0, Fe(g), !S) return i - 1;
                        if (d < u) {
                            if (i <= u) {
                                var b = g >> 8 & 255;
                                if (0 == we[b]) {
                                    var k = 15 & we[255 & g];
                                    Pe[k][b] += e * e, 32767 < Pe[k][b] && (Pe[k][b] >>= 1), ge[t][0] != g && (ge[t][1] = ge[t][0], ge[t][0] = g)
                                }
                                return D(u, Te, e, g, t), u
                            }
                            d = u, n = g
                        }
                    }
                }
                return f ? (D(d, Ae, e, n, t), d) : de ? M + t : 0
            }

            function L(e, t, i, r) {
                if (e <= 0) return O(i, r, 0);
                if ($++, 0 < t && G()) return 0;
                var n = i;
                if ((r = x - (t + 1) < r ? r : x - (t + 1)) <= (i = i < M + t ? i : M + t)) return i;
                var a = null,
                    o = Ae,
                    s = me[ue & xe];
                null != s && s.lock == fe && (a = s.bestMove);
                for (var l = de, c = !1, h = M, u = new R(a, t, ge[t][0], ge[t][1]);;) {
                    var f = u.nextMove();
                    if (0 == f) break;
                    var d = e - 1;
                    if (Le(f)) {
                        var m;
                        if (de && d++, c ? i < (m = -N(d, t + 1, -i, !0)) && (m = -L(d, t + 1, -r, -i)) : m = -L(d, t + 1, -r, -i), c = !0, Fe(f), !S) return i;
                        if (h < m) {
                            if (r <= m) {
                                var g = f >> 8 & 255;
                                if (0 == we[g]) {
                                    var p = 15 & we[255 & f];
                                    Pe[p][g] += e * e, 32767 < Pe[p][g] && (Pe[p][g] >>= 1), ge[t][0] != f && (ge[t][1] = ge[t][0], ge[t][0] = f)
                                }
                                return D(m, Te, e, f, t), m
                            }
                            n < m && (o = Ee, i = m), h = m, a = f
                        }
                    }
                }
                return c ? (D(h, o, e, a, t), h) : l ? M + t : 0
            }
            var F = 16,
                _ = 8,
                W = 0,
                q = 1,
                B = 2,
                U = 3,
                j = 4,
                K = 5,
                H = 6,
                z = new Array(256),
                V = [-15, -17, 15, 17],
                Q = [31, 33, 14, -14, -31, -33, 18, -18],
                Y = [-1, 1, -16, 16],
                J = [-1, 1, -15, 15, -17, 17, -16, 16],
                X = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 15, 15, 15, 3, 15, 15, 11, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 13, 15, 15, 15, 12, 15, 15, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                Z = 2 << 16,
                ee = 4 << 16,
                te = 8 << 16,
                ie = 16 << 16,
                re = 32 << 16,
                ne = 64 << 16,
                ae = 8388608;

            function oe() {
                var s = 624,
                    n = [0, 2567483615];
                this.mt = new Array(s), this.mti = 625, this.setSeed = function() {
                    var e = arguments;
                    switch (e.length) {
                        case 1:
                            if (e[0].constructor === Number) {
                                this.mt[0] = e[0];
                                for (var t = 1; t < s; ++t) {
                                    var i = this.mt[t - 1] ^ this.mt[t - 1] >>> 30;
                                    this.mt[t] = (1812433253 * ((4294901760 & i) >>> 16) << 16) + 1812433253 * (65535 & i) + t
                                }
                                return void(this.mti = s)
                            }
                            this.setSeed(19650218);
                            for (var r = e[0].length, n = (t = 1, 0), a = r < s ? s : r; 0 != a; --a) {
                                i = this.mt[t - 1] ^ this.mt[t - 1] >>> 30;
                                this.mt[t] = (this.mt[t] ^ (1664525 * ((4294901760 & i) >>> 16) << 16) + 1664525 * (65535 & i)) + e[0][n] + n, ++t >= s && (this.mt[0] = this.mt[623], t = 1), ++n >= r && (n = 0)
                            }
                            for (a = 623; 0 != a; --a) {
                                i = this.mt[t - 1] ^ this.mt[t - 1] >>> 30;
                                this.mt[t] = (this.mt[t] ^ (1566083941 * ((4294901760 & i) >>> 16) << 16) + 1566083941 * (65535 & i)) - t, ++t >= s && (this.mt[0] = this.mt[623], t = 1)
                            }
                            return void(this.mt[0] = 2147483648);
                        default:
                            var o = new Array;
                            for (t = 0; t < e.length; ++t) o.push(e[t]);
                            return void this.setSeed(o)
                    }
                }, this.setSeed(464384013), this.next = function(e) {
                    if (this.mti >= s) {
                        for (var t = 0, i = 0; i < 227; ++i) t = 2147483648 & this.mt[i] | 2147483647 & this.mt[i + 1], this.mt[i] = this.mt[i + 397] ^ t >>> 1 ^ n[1 & t];
                        for (i = 227; i < 623; ++i) t = 2147483648 & this.mt[i] | 2147483647 & this.mt[i + 1], this.mt[i] = this.mt[i + -227] ^ t >>> 1 ^ n[1 & t];
                        t = 2147483648 & this.mt[623] | 2147483647 & this.mt[0], this.mt[623] = this.mt[396] ^ t >>> 1 ^ n[1 & t], this.mti = 0
                    }
                    var r = this.mt[this.mti++];
                    return r ^= r >>> 11, r ^= r << 7 & 2636928640, r ^= r << 15 & 4022730752, (r ^= r >>> 18) >>> 32 - e & 4294967295
                }
            }
            var se, le, ce, he, ue, fe, de, me, ge, pe, ve, ye, be, ke, we = new Array(256),
                $e = 0,
                Se = new Array,
                Ce = 0,
                Me = new Array,
                xe = 4194303,
                Pe = new Array(32),
                Ae = 1,
                Te = 2,
                Ee = 3;

            function s(e, t, i, r, n, a) {
                this.lock = e, this.value = t, this.flags = i, this.hashDepth = r, this.bestMove = n
            }

            function Ie(e, t) {
                return e + 2 << 4 | t + 4
            }

            function Oe(e) {
                for (var t = new Array(256), i = 0; i < 256; i++) t[i] = 0;
                for (var r = 0; r < 8; r++)
                    for (var n = 0; n < 8; n++) t[Ie(r, n)] = e[8 * r + n];
                return t
            }

            function l() {
                ge = new Array(128);
                for (var e = 0; e < 128; e++) ge[e] = [0, 0];
                me = new Array(1 << 22);
                for (e = 0; e < 32; e++) {
                    Pe[e] = new Array(256);
                    for (var t = 0; t < 256; t++) Pe[e][t] = 0
                }
                var i = new oe(464384013);
                pe = new Array(256), ve = new Array(256);
                for (e = 0; e < 256; e++) {
                    pe[e] = new Array(16), ve[e] = new Array(16);
                    for (t = 0; t < 16; t++) pe[e][t] = i.next(32), ve[e][t] = i.next(32)
                }
                ye = i.next(32), be = i.next(32);
                for (var r = 0; r < 8; r++)
                    for (var n = 0; n < 8; n++) {
                        var a = Ie(r, n);
                        E[a] = Ie(7 - r, n)
                    }
                T[q] = Oe(u), T[B] = Oe(d), T[U] = Oe(m), T[j] = Oe(p), T[K] = Oe(y), T[H] = Oe(v);
                var o = [
                    [],
                    [], Q, V, Y, J, J
                ];
                for (e = 0; e < 256; e++) z[e] = new Object, z[e].delta = 0, z[e].pieceMask = new Array(2), z[e].pieceMask[0] = 0, z[e].pieceMask[1] = 0;
                for (r = 0; r < 128; r += 16)
                    for (n = 0; n < 8; n++) {
                        var s = (a = r | n) - (a - 17) + 128;
                        z[s].pieceMask[_ >> 3] |= 1 << q, z[s = a - (a - 15) + 128].pieceMask[_ >> 3] |= 1 << q, z[s = a - (a + 17) + 128].pieceMask[0] |= 1 << q, z[s = a - (a + 15) + 128].pieceMask[0] |= 1 << q;
                        for (e = B; e <= H; e++)
                            for (var l = 0; l < o[e].length; l++)
                                for (var c = a + o[e][l]; !(136 & c);) {
                                    z[s = a - c + 128].pieceMask[_ >> 3] |= 1 << e, z[s].pieceMask[0] |= 1 << e;
                                    var h = -1;
                                    if (a < c && (h = 1), (240 & a) == (240 & c) ? z[s].delta = 1 * h : (15 & a) == (15 & c) ? z[s].delta = 16 * h : a % 15 == c % 15 ? z[s].delta = 15 * h : a % 17 == c % 17 && (z[s].delta = 17 * h), e == B) {
                                        z[s].delta = o[e][l];
                                        break
                                    }
                                    if (e == H) break;
                                    c += o[e][l]
                                }
                    }! function() {
                        ke = new Array(2);
                        for (var e = 0; e < 2; e++) {
                            ke[e] = new Array;
                            var t = 0 == e ? 16 : 8,
                                i = 0 == e ? 8 : 16;
                            ke[e][0] = 1, ke[e][128] = 0, ke[e][t | q] = 1, ke[e][t | U] = 2, ke[e][t | B] = 2, ke[e][t | j] = 4, ke[e][t | K] = 6, ke[e][t | H] = 6, ke[e][i | q] = 0, ke[e][i | U] = 0, ke[e][i | B] = 0, ke[e][i | j] = 0, ke[e][i | K] = 0, ke[e][i | H] = 0
                        }
                    }(), De("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
            }

            function De(e) {
                for (var t = e.split(" "), i = 0; i < 256; i++) we[i] = 128;
                var r = 0,
                    n = 0,
                    a = t[0];
                for (i = 0; i < a.length; i++) {
                    var o = a.charAt(i);
                    if ("/" == o) r++, n = 0;
                    else if ("0" <= o && o <= "9")
                        for (var s = 0; s < parseInt(o); s++) we[Ie(r, n)] = 0, n++;
                    else {
                        var l = "a" <= o && o <= "z",
                            c = l ? F : _;
                        switch (l || (o = a.toLowerCase().charAt(i)), o) {
                            case "p":
                                c |= q;
                                break;
                            case "b":
                                c |= U;
                                break;
                            case "n":
                                c |= B;
                                break;
                            case "r":
                                c |= j;
                                break;
                            case "q":
                                c |= K;
                                break;
                            case "k":
                                c |= H
                        }
                        we[Ie(r, n)] = c, n++
                    }
                }! function() {
                    for (var e = 0; e < 16; e++)
                        for (var t = Ne[e] = 0; t < 16; t++) Re[e << 4 | t] = 0;
                    for (e = 0; e < 256; e++)
                        if (Ge[e] = 0, we[e] & (_ | F)) {
                            var i = 15 & we[e];
                            Re[i << 4 | Ne[i]] = e, Ge[e] = Ne[i], Ne[i]++
                        }
                }();
                var h = 8 - (se = "w" == t[1].charAt(0) ? _ : 0);
                if (le = 0, -1 != t[2].indexOf("K")) {
                    if (we[152] != (H | _) || we[155] != (j | _)) return "Invalid FEN: White kingside castling not allowed";
                    le |= 1
                }
                if (-1 != t[2].indexOf("Q")) {
                    if (we[152] != (H | _) || we[148] != (j | _)) return "Invalid FEN: White queenside castling not allowed";
                    le |= 2
                }
                if (-1 != t[2].indexOf("k")) {
                    if (we[40] != (H | F) || we[43] != (j | F)) return "Invalid FEN: Black kingside castling not allowed";
                    le |= 4
                }
                if (-1 != t[2].indexOf("q")) {
                    if (we[40] != (H | F) || we[36] != (j | F)) return "Invalid FEN: Black queenside castling not allowed";
                    le |= 8
                }
                if ((ce = -1) == t[3].indexOf("-")) {
                    n = t[3].charAt(0).charCodeAt() - "a".charCodeAt(), r = 8 - (t[3].charAt(1).charCodeAt() - "0".charCodeAt());
                    ce = Ie(r, n)
                }
                var u = function() {
                    var e = new Object;
                    e.hashKeyLow = 0;
                    for (var t = e.hashKeyHigh = 0; t < 256; t++) {
                        var i = we[t];
                        24 & i && (e.hashKeyLow ^= pe[t][15 & i], e.hashKeyHigh ^= ve[t][15 & i])
                    }
                    return se || (e.hashKeyLow ^= ye, e.hashKeyHigh ^= be), e
                }();
                ue = u.hashKeyLow, fe = u.hashKeyHigh;
                for (i = he = 0; i < 256; i++) we[i] & _ ? (he += T[7 & we[i]][i], he += k[7 & we[i]]) : we[i] & F && (he -= T[7 & we[i]][E[i]], he -= k[7 & we[i]]);
                return se || (he = -he), Ce = 0, de = qe(Re[(se | H) << 4], h), qe(Re[(h | H) << 4], se) ? "Invalid FEN: Can capture king" : 0 == Ue().length ? de ? "Checkmate" : "Stalemate" : ""
            }
            var Ge = new Array(256),
                Re = new Array(256),
                Ne = new Array(16);

            function Le(e) {
                var t = se >> 3,
                    i = 8 - se,
                    r = 16711680 & e,
                    n = e >> 8 & 255,
                    a = 255 & e,
                    o = we[n],
                    s = we[a],
                    l = n;
                if (r & Z && (o = we[l = t ? 16 + n : n - 16], we[l] = W), Se[$e] = new Ve(ce, le, de, he, ue, fe, Ce, o), $e++, ce = -1, r)
                    if (r & ee) {
                        if (qe(1 + a, i) || qe(2 + a, i)) return $e--, !1;
                        var c = we[1 + n];
                        ue ^= pe[1 + n][15 & c], fe ^= ve[1 + n][15 & c], ue ^= pe[n - 1][15 & c], fe ^= ve[n - 1][15 & c], we[n - 1] = c, we[1 + n] = W, he -= T[7 & c][0 == t ? E[1 + n] : 1 + n], he += T[7 & c][0 == t ? E[n - 1] : n - 1];
                        var h = Ge[1 + n];
                        Ge[n - 1] = h, Re[(15 & c) << 4 | h] = n - 1
                    } else if (r & te) {
                    if (qe(a - 1, i) || qe(a - 2, i)) return $e--, !1;
                    c = we[n - 2];
                    ue ^= pe[n - 2][15 & c], fe ^= ve[n - 2][15 & c], ue ^= pe[1 + n][15 & c], fe ^= ve[1 + n][15 & c], we[1 + n] = c, we[n - 2] = W, he -= T[7 & c][0 == t ? E[n - 2] : n - 2], he += T[7 & c][0 == t ? E[1 + n] : 1 + n];
                    h = Ge[n - 2];
                    Ge[1 + n] = h, Re[(15 & c) << 4 | h] = 1 + n
                }
                if (o) {
                    var u = 15 & o;
                    Ne[u]--;
                    var f = Re[u << 4 | Ne[u]];
                    Ge[f] = Ge[l], Re[u << 4 | Ge[f]] = f, Re[u << 4 | Ne[u]] = 0, he += k[7 & o], he += T[7 & o][t ? E[l] : l], ue ^= pe[l][u], fe ^= ve[l][u], Ce = 0
                } else if ((7 & s) == q) {
                    var d = n - a;
                    d < 0 && (d = -d), 16 < d && (ce = t ? 16 + n : n - 16), Ce = 0
                }
                if (ue ^= pe[a][15 & s], fe ^= ve[a][15 & s], ue ^= pe[n][15 & s], fe ^= ve[n][15 & s], ue ^= ye, fe ^= be, le &= X[a] & X[n], he -= T[7 & s][0 == t ? E[a] : a], Ge[n] = Ge[a], Re[(15 & s) << 4 | Ge[n]] = n, r & ie) {
                    var m = -8 & s;
                    m |= r & re ? B : r & ne ? K : r & ae ? U : j, ue ^= pe[n][15 & s], fe ^= ve[n][15 & s], we[n] = m, ue ^= pe[n][15 & m], fe ^= ve[n][15 & m], he += T[7 & m][0 == t ? E[n] : n], he -= k[q], he += k[7 & m];
                    var g = 15 & s,
                        p = 15 & m;
                    Ne[g]--;
                    var v = Re[g << 4 | Ne[g]];
                    Ge[v] = Ge[n], Re[g << 4 | Ge[v]] = v, Re[g << 4 | Ne[g]] = 0, Ge[n] = Ne[p], Re[p << 4 | Ge[n]] = n, Ne[p]++
                } else we[n] = we[a], he += T[7 & s][0 == t ? E[n] : n];
                if (we[a] = W, se = i, he = -he, (7 & s) == H || de) {
                    if (qe(Re[(H | 8 - se) << 4], i)) return Fe(e), !1
                } else {
                    var y = Re[(H | 8 - se) << 4];
                    if (_e(a, y)) return Fe(e), !1;
                    if (l != n && _e(l, y)) return Fe(e), !1
                }
                if (de = !1, r <= Z) {
                    var b = Re[(H | se) << 4];
                    (de = (de = We(b, n)) || _e(a, b)) || l != n && (de = _e(l, b))
                } else de = qe(Re[(H | se) << 4], 8 - se);
                return Me[$e - 1] = ue, Ce++, !0
            }

            function Fe(e) {
                se = 8 - se, he = -he, ce = Se[--$e].ep, le = Se[$e].castleRights, de = Se[$e].inCheck, he = Se[$e].baseEval, ue = Se[$e].hashKeyLow, fe = Se[$e].hashKeyHigh, Ce = Se[$e].move50;
                var t = 16711680 & e,
                    i = Se[$e].captured,
                    r = e >> 8 & 255,
                    n = 255 & e,
                    a = we[r];
                if (t)
                    if (t & ee) {
                        var o = we[r - 1];
                        we[1 + r] = o, we[r - 1] = W;
                        var s = Ge[r - 1];
                        Ge[1 + r] = s, Re[(15 & o) << 4 | s] = 1 + r
                    } else if (t & te) {
                    o = we[1 + r];
                    we[r - 2] = o, we[1 + r] = W;
                    s = Ge[1 + r];
                    Ge[r - 2] = s, Re[(15 & o) << 4 | s] = r - 2
                }
                if (t & ie) {
                    a = -8 & we[r] | q, we[n] = a;
                    var l = 15 & we[n],
                        c = 15 & we[r];
                    Ne[c]--;
                    var h = Re[c << 4 | Ne[c]];
                    Ge[h] = Ge[r], Re[c << 4 | Ge[h]] = h, Re[c << 4 | Ne[c]] = 0, Ge[r] = Ne[l], Re[l << 4 | Ge[r]] = r, Ne[l]++
                } else we[n] = we[r];
                var u = r;
                if (t & Z && (u = se == _ ? 16 + r : r - 16, we[r] = W), we[u] = i, Ge[n] = Ge[r], Re[(15 & a) << 4 | Ge[n]] = n, i) {
                    var f = 15 & i;
                    Ge[u] = Ne[f], Re[f << 4 | Ne[f]] = u, Ne[f]++
                }
            }

            function _e(e, t) {
                var i = t - e + 128;
                if (0 == (z[i].pieceMask[0] & 1 << K)) return !1;
                for (var r = z[i].delta, n = t + r; 0 == we[n];) n += r;
                var a = we[n];
                return 0 != (a & (24 ^ we[t]) & 24) && 0 != (z[n - t + 128].pieceMask[a >> 3 & 1] & 1 << (7 & a))
            }

            function h(e, t) {
                var i = t - e + 128,
                    r = we[t];
                return !!(z[i].pieceMask[r >> 3 & 1] & 1 << (7 & r))
            }

            function We(e, t) {
                var i = t - e + 128,
                    r = we[t];
                if (z[i].pieceMask[r >> 3 & 1] & 1 << (7 & r)) {
                    var n = z[i].delta;
                    do {
                        if ((t += n) == e) return !0
                    } while (0 == we[t])
                }
                return !1
            }

            function qe(e, t) {
                var i = t ? -16 : 16,
                    r = 1 | (t ? _ : F);
                if (we[e - (i - 1)] == r) return !0;
                if (we[e - (1 + i)] == r) return !0;
                for (var n = 2; n <= 6; n++)
                    for (var a = (t | n) << 4, o = Re[a]; 0 != o;) {
                        if (We(e, o)) return !0;
                        o = Re[++a]
                    }
                return !1
            }

            function Be(e, t) {
                return e | t << 8
            }

            function Be(e, t, i) {
                return e | t << 8 | i
            }

            function Ue() {
                var e = new Array,
                    t = new Array;
                Ke(t, null), je(t);
                for (var i = t.length - 1; 0 <= i; i--) Le(t[i]) && (e[e.length] = t[i], Fe(t[i]));
                return e
            }

            function je(e) {
                var t, i, r;
                for (r = (1 | se) << 4, t = Re[r++]; 0 != t;) ze(e, t), t = Re[r++];
                for (r = (2 | se) << 4, t = Re[r++]; 0 != t;) 0 == we[i = t + 31] && (e[e.length] = Be(t, i)), 0 == we[i = t + 33] && (e[e.length] = Be(t, i)), 0 == we[i = t + 14] && (e[e.length] = Be(t, i)), 0 == we[i = t - 14] && (e[e.length] = Be(t, i)), 0 == we[i = t - 31] && (e[e.length] = Be(t, i)), 0 == we[i = t - 33] && (e[e.length] = Be(t, i)), 0 == we[i = t + 18] && (e[e.length] = Be(t, i)), 0 == we[i = t - 18] && (e[e.length] = Be(t, i)), t = Re[r++];
                for (r = (3 | se) << 4, t = Re[r++]; 0 != t;) {
                    for (i = t - 15; 0 == we[i];) e[e.length] = Be(t, i), i -= 15;
                    for (i = t - 17; 0 == we[i];) e[e.length] = Be(t, i), i -= 17;
                    for (i = t + 15; 0 == we[i];) e[e.length] = Be(t, i), i += 15;
                    for (i = t + 17; 0 == we[i];) e[e.length] = Be(t, i), i += 17;
                    t = Re[r++]
                }
                for (r = (4 | se) << 4, t = Re[r++]; 0 != t;) {
                    for (i = t - 1; 0 == we[i];) e[e.length] = Be(t, i), i--;
                    for (i = t + 1; 0 == we[i];) e[e.length] = Be(t, i), i++;
                    for (i = t + 16; 0 == we[i];) e[e.length] = Be(t, i), i += 16;
                    for (i = t - 16; 0 == we[i];) e[e.length] = Be(t, i), i -= 16;
                    t = Re[r++]
                }
                for (r = (5 | se) << 4, t = Re[r++]; 0 != t;) {
                    for (i = t - 15; 0 == we[i];) e[e.length] = Be(t, i), i -= 15;
                    for (i = t - 17; 0 == we[i];) e[e.length] = Be(t, i), i -= 17;
                    for (i = t + 15; 0 == we[i];) e[e.length] = Be(t, i), i += 15;
                    for (i = t + 17; 0 == we[i];) e[e.length] = Be(t, i), i += 17;
                    for (i = t - 1; 0 == we[i];) e[e.length] = Be(t, i), i--;
                    for (i = t + 1; 0 == we[i];) e[e.length] = Be(t, i), i++;
                    for (i = t + 16; 0 == we[i];) e[e.length] = Be(t, i), i += 16;
                    for (i = t - 16; 0 == we[i];) e[e.length] = Be(t, i), i -= 16;
                    t = Re[r++]
                }
                if (t = Re[r = (6 | se) << 4], 0 == we[i = t - 15] && (e[e.length] = Be(t, i)), 0 == we[i = t - 17] && (e[e.length] = Be(t, i)), 0 == we[i = t + 15] && (e[e.length] = Be(t, i)), 0 == we[i = t + 17] && (e[e.length] = Be(t, i)), 0 == we[i = t - 1] && (e[e.length] = Be(t, i)), 0 == we[i = t + 1] && (e[e.length] = Be(t, i)), 0 == we[i = t - 16] && (e[e.length] = Be(t, i)), 0 == we[i = t + 16] && (e[e.length] = Be(t, i)), !de) {
                    var n = le;
                    se || (n >>= 2), 1 & n && we[t + 1] == W && we[t + 2] == W && (e[e.length] = Be(t, t + 2, ee)), 2 & n && we[t - 1] == W && we[t - 2] == W && we[t - 3] == W && (e[e.length] = Be(t, t - 2, te))
                }
            }

            function Ke(e) {
                var t, i, r = 8 == se ? -16 : 16,
                    n = 8 == se ? 16 : 8;
                for (i = (1 | se) << 4, a = Re[i++]; 0 != a;) we[t = a + r - 1] & n && He(e, a, t), we[t = a + r + 1] & n && He(e, a, t), a = Re[i++];
                if (-1 != ce) {
                    var a, o = se | q;
                    (15 & we[a = ce - ((r = se == _ ? -16 : 16) + 1)]) == o && (e[e.length] = Be(a, ce, Z)), (15 & we[a = ce - (r - 1)]) == o && (e[e.length] = Be(a, ce, Z))
                }
                for (i = (2 | se) << 4, a = Re[i++]; 0 != a;) we[t = a + 31] & n && (e[e.length] = Be(a, t)), we[t = a + 33] & n && (e[e.length] = Be(a, t)), we[t = a + 14] & n && (e[e.length] = Be(a, t)), we[t = a - 14] & n && (e[e.length] = Be(a, t)), we[t = a - 31] & n && (e[e.length] = Be(a, t)), we[t = a - 33] & n && (e[e.length] = Be(a, t)), we[t = a + 18] & n && (e[e.length] = Be(a, t)), we[t = a - 18] & n && (e[e.length] = Be(a, t)), a = Re[i++];
                for (i = (3 | se) << 4, a = Re[i++]; 0 != a;) {
                    for (t = a; 0 == we[t -= 15];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[t -= 17];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[t += 15];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[t += 17];);
                    we[t] & n && (e[e.length] = Be(a, t)), a = Re[i++]
                }
                for (i = (4 | se) << 4, a = Re[i++]; 0 != a;) {
                    for (t = a; 0 == we[--t];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[++t];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[t -= 16];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[t += 16];);
                    we[t] & n && (e[e.length] = Be(a, t)), a = Re[i++]
                }
                for (i = (5 | se) << 4, a = Re[i++]; 0 != a;) {
                    for (t = a; 0 == we[t -= 15];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[t -= 17];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[t += 15];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[t += 17];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[--t];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[++t];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[t -= 16];);
                    for (we[t] & n && (e[e.length] = Be(a, t)), t = a; 0 == we[t += 16];);
                    we[t] & n && (e[e.length] = Be(a, t)), a = Re[i++]
                }
                a = Re[i = (6 | se) << 4], we[t = a - 15] & n && (e[e.length] = Be(a, t)), we[t = a - 17] & n && (e[e.length] = Be(a, t)), we[t = a + 15] & n && (e[e.length] = Be(a, t)), we[t = a + 17] & n && (e[e.length] = Be(a, t)), we[t = a - 1] & n && (e[e.length] = Be(a, t)), we[t = a + 1] & n && (e[e.length] = Be(a, t)), we[t = a - 16] & n && (e[e.length] = Be(a, t)), we[t = a + 16] & n && (e[e.length] = Be(a, t))
            }

            function He(e, t, i) {
                var r = 240 & i;
                144 == r || 32 == r ? (e[e.length] = Be(t, i, ie | ne), e[e.length] = Be(t, i, ie | re), e[e.length] = Be(t, i, ie | ae), e[e.length] = Be(t, i, ie)) : e[e.length] = Be(t, i, 0)
            }

            function ze(e, t) {
                var i = we[t] & _,
                    r = i == _ ? -16 : 16,
                    n = t + r;
                0 == we[n] && (He(e, t, n), (48 == (240 & t) && i != _ || 128 == (240 & t) && i == _) && 0 == we[n += r] && (e[e.length] = Be(t, n)))
            }

            function Ve(e, t, i, r, n, a, o, s) {
                this.ep = e, this.castleRights = t, this.inCheck = i, this.baseEval = r, this.hashKeyLow = n, this.hashKeyHigh = a, this.move50 = o, this.captured = s
            }
            var Qe = [0, 1, 3, 3, 5, 9, 900, 0, 0, 1, 3, 3, 5, 9, 900, 0];

            function Ye(e) {
                var t = 255 & e,
                    i = e >> 8 & 255,
                    r = we[t],
                    n = Qe[15 & r],
                    a = Qe[15 & we[i]];
                if (n <= a) return !0;
                if (e >> 16) return !0;
                var o = r & _ ? _ : 0,
                    s = 8 - o,
                    l = r & _ ? -16 : 16;
                if ((15 & we[i + l + 1]) == (q | s) || (15 & we[i + l - 1]) == (q | s)) return !1;
                var c = new Array,
                    h = n - a;
                if (Xe(i, s, c), 0 != c.length && h > Qe[B]) return !1;
                we[t] = 0;
                for (var u = U; u <= K; u++)
                    if (Ze(i, s, c, u) && h > Qe[u]) return we[t] = r, !1;
                if ((15 & we[i - l + 1]) == (q | o) || (15 & we[i - l - 1]) == (q | o)) return we[t] = r, !0;
                Ze(i, s, c, H);
                var f = new Array;
                Xe(i, o, f);
                for (u = U; u <= H; u++) Ze(i, o, f, u);
                we[t] = r;
                for (var d = a - n;;) {
                    for (var m = 1e3, g = -1, p = 0; p < c.length; p++) {
                        if (0 != c[p])(y = Qe[7 & we[c[p]]]) < m && (m = y, g = p)
                    }
                    if (-1 == g) return !0;
                    if ((d += m) < 0) return !1;
                    var v = c[g];
                    c[g] = 0, Je(i, v, o, f, c), m = 1e3, g = -1;
                    for (p = 0; p < f.length; p++) {
                        var y;
                        if (0 != f[p])(y = Qe[7 & we[f[p]]]) < m && (m = y, g = p)
                    }
                    if (-1 == g) return !1;
                    if (0 <= (d -= m)) return !0;
                    v = f[g], f[g] = 0, Je(i, v, o, f, c)
                }
            }

            function Je(e, t, i, r, n) {
                var a = -z[t - e + 128].delta;
                if (0 != a) {
                    for (t += a; 0 == we[t];) t += a;
                    24 & we[t] && h(e, t) && ((8 & we[t]) == i ? r[r.length] = t : n[n.length] = t)
                }
            }

            function Xe(e, t, i) {
                for (var r = (t | B) << 4, n = Re[r++]; 0 != n;) h(e, n) && (i[i.length] = n), n = Re[r++]
            }

            function Ze(e, t, i, r) {
                for (var n = (t | r) << 4, a = Re[n++], o = !1; 0 != a;) We(e, a) && (i[i.length] = a, o = !0), a = Re[n++];
                return o
            }

            function et(e, t, i, r) {
                n.postMessage("pv " + function(e, t, i, r) {
                    var n = $ + g;
                    return "Ply:" + r + " Score:" + t + " Nodes:" + n + " NPS:" + (n / (i / 1e3) | 0) + " " + o(e, 15)
                }(e, t, i, r))
            }

            function tt(e, t, i, r) {
                null != e && (Le(e), n.postMessage(a(e)))
            }
            var it = !0;
            n.addEventListener("message", function(e) {
                if ("go" != e.data && !it || (l(), it = !1, "go" != e.data))
                    if ("position" == e.data.match("^position")) {
                        l();
                        var t = De(e.data.substr(9, e.data.length - 9));
                        0 != t.length && n.postMessage("message " + t)
                    } else "search" == e.data.match("^search") ? (C = parseInt(e.data.substr(7, e.data.length - 7), 10), r(tt, 99, et)) : "analyze" == e.data ? (C = 99999999999, r(null, 99, et)) : Le(i(e.data))
            })
        }
    }, {}],
    13: [function(e, t, i) {
        "use strict";
        var r = function() {
            function e(e, t) {
                this.name = e, this.id = t, this.isHuman = !1, this.isMoving = !1
            }
            var t = e.prototype;
            return t.toString = function() {
                return this.name
            }, t.makeMove = function() {
                throw "makeMove() must be initialized correctly in child class"
            }, t.choosePromotion = function() {
                throw "choosePromotion() must be initialized correctly in child class"
            }, t.endGame = function() {
                this.isMoving = !1
            }, e
        }();
        t.exports = r
    }, {}],
    14: [function(e, t, i) {
        "use strict";
        var $ = arguments[3],
            S = arguments[4],
            C = arguments[5],
            M = JSON.stringify;
        t.exports = function(e, t) {
            var i, r = !0,
                n = "undefined" != typeof polyfilled && polyfilled;
            try {
                new Blob(["var x = 1;"], {
                    type: "text/javascript"
                })
            } catch (e) {
                r = !1
            }
            if ("undefined" == typeof document || !r || n) return function(e) {
                var i = [],
                    r = [];
                return e({
                    addEventListener: function(e, t) {
                        if ("message" !== e) throw new Error('Only the event "message" is supported');
                        r.push(t)
                    },
                    postMessage: function(e) {
                        var t = {
                            data: e
                        };
                        i.forEach(function(e) {
                            return e(t)
                        }), this.onmessage && this.onmessage(t)
                    },
                    close: function() {}
                }), {
                    isFakeWebWorker: !0,
                    addEventListener: function(e, t) {
                        if ("message" !== e) throw new Error('Only the event "message" is supported');
                        i.push(t)
                    },
                    postMessage: function(e) {
                        var t = {
                            data: e
                        };
                        r.forEach(function(e) {
                            return e(t)
                        }), this.onmessage && this.onmessage(t)
                    },
                    terminate: function() {}
                }
            }(e);
            for (var a = Object.keys(C), o = 0, s = a.length; o < s; o++) {
                var l = a[o],
                    c = C[l].exports;
                if (c === e || c && c.default === e) {
                    i = l;
                    break
                }
            }
            if (!i) {
                i = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
                for (var h = {}, u = 0, f = a.length; u < f; u++) {
                    var d = a[u];
                    h[d] = d
                }
                S[i] = ["function(require,module,exports){" + e + "(self); }", h]
            }
            var m = Math.floor(Math.pow(16, 8) * Math.random()).toString(16),
                g = {};
            g[i] = i, S[m] = ["function(require,module,exports){\n            // try to call default if defined to also support babel esmodule exports\n            var f = require(" + M(i) + ");\n            (f.default ? f.default : f)(self);\n        }", g];
            var p = {};
            ! function e(t) {
                p[t] = !0;
                for (var i in S[t][1]) {
                    var r = S[t][1][i];
                    p[r] || e(r)
                }
            }(m);
            var v = "(" + $ + ")({" + Object.keys(p).map(function(e) {
                    return M(e) + ":[" + S[e][0] + "," + M(S[e][1]) + "]"
                }).join(",") + "},{},[" + M(m) + "])",
                y = window.URL || window.webkitURL || window.mozURL || window.msURL,
                b = new Blob([v], {
                    type: "text/javascript"
                });
            if (t && t.bare) return b;
            var k = y.createObjectURL(b),
                w = new Worker(k);
            return w.objectURL = k, w
        }
    }, {}],
    15: [function(e, t, i) {
        "use strict";
        var a = e("./helper-functions").captainsLog,
            s = function(t, e, i, r, n) {
                "undefined" != typeof APP_MODE && APP_MODE && (t = "https://cardgames.io" + t), i = i || function() {
                    a.debug("Successfully posted to this url: " + t + " with this data : " + JSON.stringify(e))
                }, r = r || function(e) {
                    console.log("ERROR for urL " + t), a.error("ERROR: " + JSON.stringify(e))
                }, $.ajax({
                    type: "POST",
                    url: t,
                    headers: n || {},
                    data: JSON.stringify(e),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: i,
                    error: r
                })
            },
            o = function(e, t, i) {
                if ("undefined" != typeof APP_MODE && APP_MODE && (e = "https://cardgames.io" + e), !t) throw new TypeError("Success handler missing");
                return i = i || function(e) {
                    a.error(JSON.stringify(e))
                }, $.ajax({
                    type: "GET",
                    url: e,
                    success: t,
                    error: i
                })
            },
            r = {
                avatars: {
                    getStats: function(e, t) {
                        return o("/api/avatars/", e, t)
                    },
                    getLatest: function(e, t) {
                        return o("/api/avatars/latest", e, t)
                    },
                    saveFace: function(e, t, i) {
                        var r = {
                            code: e,
                            userAgent: navigator.userAgent
                        };
                        s("/api/avatars/", r, t, i)
                    }
                },
                adfree: {
                    getCode: function(e, t, i) {
                        return o("/api/adfree/" + e, t, i)
                    },
                    activateCode: function(e, t, i) {
                        return s("/api/adfree/" + e + "/activate", {
                            code: e
                        }, t, i)
                    }
                },
                gdpr: {
                    accept: function(e, t, i, r) {
                        return s("/api/gdpr/accept", {
                            allowPersonalizedAds: e,
                            userAgent: t
                        }, i, r)
                    }
                },
                country: {
                    get: function(e, t) {
                        return o("/lambda/country/", e, t)
                    }
                },
                errors: {
                    getLatest: function(e, t) {
                        return o("/api/errors/latest", e, t)
                    },
                    getByName: function(e, t, i) {
                        return o("/api/errors/" + e, t, i)
                    },
                    log: function(e, t, i, r, n, a) {
                        void 0 === a && (a = 0);
                        var o = {
                            name: e,
                            slug: t,
                            errorMessage: i,
                            url: location.href,
                            userAgent: navigator.userAgent,
                            maxMailCount: a
                        };
                        s("/api/errors", o, r, n)
                    }
                },
                badDomain: function() {
                    $.ajax({
                        url: "https://cardgames.io/api/errors/baddomain/?domain=" + location.hostname + "&href=" + encodeURIComponent(location.href),
                        dataType: "jsonp",
                        jsonpCallback: "nothing"
                    })
                },
                events: {
                    post: function(e, t, i) {
                        s("/api/events/", e, t, i)
                    }
                },
                numberedGames: {
                    win: function(e, t, i, r, n) {
                        return i = i.replace(/ /g, "-"), s("/api/" + t + "/" + i + "/numberedgames/" + e + "/win", r, n)
                    },
                    postSaveResult: function(e, t, i, r, n, a) {
                        return r = r.replace(/ /g, "-"), s("/api/" + i + "/" + r + "/numberedgames/" + t + "/saveresult", e, n, a)
                    },
                    start: function(e, t, i, r, n) {
                        return i = i.replace(/ /g, "-"), s("/api/" + t + "/" + i + "/numberedgames/" + e + "/start", r, n)
                    },
                    getGame: function(e, t, i, r, n) {
                        return i = i.replace(/ /g, "-"), o("/api/" + t + "/" + i + "/numberedgames/" + e + "/?domain=" + encodeURIComponent(location.href), r, n)
                    },
                    getStats: function(e, t, i, r) {
                        return t = t.replace(/ /g, "-"), o("/api/" + e + "/" + t + "//numberedgames/stats", i, r)
                    }
                },
                visitors: {
                    post: function(e, t, i) {
                        return s("/api/visitors", e, t, i)
                    }
                },
                badWords: {
                    get: function(e, t) {
                        return o("/api/badwords", e, t)
                    }
                }
            };
        t.exports = r
    }, {
        "./helper-functions": 19
    }],
    16: [function(e, t, i) {
        "use strict";
        var r = function() {
            function e(e, t, i) {
                if (void 0 === i && (i = !1), this.debug = i, this.buffers = {}, this.audioElements = {}, this.lastSource = null, this.isSoundOn = t || function() {
                        return !0
                    }, document.location.search.match(/soundlog/) && (this.logDiv = $("<textarea>", {
                        id: "soundlog"
                    }).appendTo("#play-page"), this.logDiv.css({
                        width: "600px",
                        height: "300px",
                        background: "black",
                        color: "white"
                    })), "undefined" != typeof AudioContext ? this.audioContext = new AudioContext : "undefined" != typeof webkitAudioContext ? this.audioContext = new webkitAudioContext : "undefined" != typeof Audio ? (this.log("AudioContext not available, using Audio tags instead..."), this.loadAudioElements(e)) : this.log("No audio available"), this.audioContext) {
                    if (!this.audioContext.resume) {
                        var r = this;
                        this.audioContext.resume = function() {
                            return r.log('Set Fake state to "running"'), this.state = "running", {
                                then: function(e) {
                                    return e()
                                }
                            }
                        }
                    }
                    this.loadBuffers(e), this.setupUnlocking()
                }
            }
            var t = e.prototype;
            return t.setupUnlocking = function() {
                function r(e) {
                    if (n.log("Trying to unlock AudioContext on event " + e.type), !o.resume) {
                        var t = [];
                        for (var i in o) t.push(i);
                        return t.sort(), void setTimeout(function() {
                            throw new Error("No resume available. User Agent: " + navigator.userAgent + ", available methods: " + t)
                        }, 200)
                    }
                    o.resume().then(function() {
                        "running" === o.state ? (n.log("AudioContext now unlocked"), a.forEach(function(e) {
                            return document.body.removeEventListener(e, r, !0)
                        }), n.listeningForUnlock = !1) : n.log("Failed to resume AudioContext, state is " + o.state)
                    })
                }
                var n = this,
                    a = ["touchstart", "touchend", "keydown", "mousedown"],
                    o = this.audioContext;
                this.listeningForUnlock || (this.listeningForUnlock = !0, a.forEach(function(e) {
                    return document.body.addEventListener(e, r, !0)
                }))
            }, t.log = function(e) {
                this.debug && console.log("AudioPlayer: " + e), this.logDiv && (this.hasloggedPlay || (this.hasloggedPlay = 0), this.hasloggedPlay < 4 && e.match(/^Playing/) ? (this.logDiv.val(this.logDiv.val() + "\n" + e), this.hasloggedPlay++) : e.match(/^Playing/) || this.logDiv.val(this.logDiv.val() + "\n" + e))
            }, t.loadBuffers = function(e) {
                for (var t in e) this.loadBuffer(t, e[t])
            }, t.loadBuffer = function(t, e) {
                var i = this,
                    r = new XMLHttpRequest;
                if (r.name = t, r.open("GET", e), r.responseType = "arraybuffer", r.addEventListener("load", function(e) {
                        i.audioContext.decodeAudioData(e.target.response, function(e) {
                            i.log("Buffered sound: " + t), i.buffers[t] = e
                        })
                    }, !1), r.send(), this[t]) throw new Error("Sound name '" + t + "' conflicts with built in method in AudioPlayer");
                this[t] = function(e) {
                    return i.tryPlay(t, e)
                }
            }, t.loadAudioElements = function(t) {
                function e(e) {
                    if (i.audioElements[e] = new Audio(t[e]), i[e]) throw new Error("Sound name '" + e + "' conflicts with built in method in AudioPlayer");
                    i[e] = function() {
                        return i.tryPlayAudioElement(e)
                    }
                }
                var i = this;
                for (var r in t) e(r)
            }, t.tryPlay = function(t, i) {
                var r = this;
                if (this.isSoundOn())
                    if (this.audioContext && this.buffers[t]) {
                        var e = function() {
                            try {
                                r.log("Playing " + t);
                                var e = r.audioContext.createBufferSource();
                                if (e.buffer = r.buffers[t], e.connect(r.audioContext.destination), r.lastSource && !r.lastSource.finished && !i) try {
                                    r.lastSource.stop()
                                } catch (e) {
                                    r.log("Audio buffer for sound " + t + " failed to stop: " + e)
                                }
                                e.onended = function() {
                                    return e.finished = !0
                                }, e.start(0), r.lastSource = e
                            } catch (e) {
                                r.log("Audio buffer for sound " + t + " failed to play: " + e)
                            }
                        };
                        "interrupted" === this.audioContext.state ? (this.log('State is "interrupted", resuming context before playing'), this.audioContext.resume().then(e)) : e(), "suspended" === this.audioContext.state && this.setupUnlocking()
                    } else this.log("Can't play sound " + t + ", either there is no AudioContext or it's not buffered yet.");
                else this.log("Sound is off, not playing " + t)
            }, t.tryPlayAudioElement = function(t) {
                if (this.isSoundOn())
                    if (this.audioElements[t])
                        if (4 !== this.audioElements[t].readyState) this.log("Audio element for sound " + t + " is not fully loaded");
                        else try {
                            this.lastAudioElement && this.lastAudioElement.pause(), this.audioElements[t].currentTime = 0, this.audioElements[t].play(), this.lastAudioElement = this.audioElements[t]
                        } catch (e) {
                            this.log("Audio element for sound " + t + " failed to play: " + e), console.log(e)
                        } else this.log("Audio element for sound " + t + " doesn't exist");
                else this.log("Sound is off, not playing " + t)
            }, t.stop = function() {
                try {
                    this.lastAudioElement ? this.lastAudioElement.pause() : this.lastSource && !this.lastSource.finished && this.lastSource.stop()
                } catch (e) {
                    this.log("Failed to stop audio: " + e)
                }
            }, e
        }();
        t.exports = r
    }, {}],
    17: [function(e, t, i) {
        "use strict";
        var r, l = e("./util"),
            n = e("./helper-functions"),
            s = n.captainsLog,
            c = n._setTimeout,
            a = n._setInterval,
            h = l.settings,
            u = e("./gamecontrol"),
            f = e("./temp-storage"),
            o = {
                h: "&hearts;",
                s: "&spades;",
                d: "&diams;",
                c: "&clubs;"
            };

        function d() {
            r && (window.requestAnimationFrame(d), $.fx.tick())
        }
        window.requestAnimationFrame && (l.qs.gid ? s.debug("Multiplayer game, not using requestAnimationFrame") : ($.fx.timer = function(e) {
            e() && jQuery.timers.push(e) && !r && (r = !0, d())
        }, $.fx.stop = function() {
            r = !1
        }));
        var m = navigator.userAgent.match(/Android (4|5|6|7|8|9)/) && navigator.userAgent.match(/ SM-|samsung/g);
        l.qs.android && (m = !0), m && (o = {
            h: "&#x2661;",
            s: "&#x2664;",
            d: "&#x2662;",
            c: "&#x2667;"
        });
        var g, p = (g = 1, {
            get: function() {
                return g
            },
            set: function(e) {
                "string" == typeof e && (e = {
                    verySlow: .5,
                    slow: .8,
                    normal: 1,
                    fast: 1.5,
                    veryFast: 2.2
                } [e]), g = e, $.fx.speeds._default = v(400), $.fx.speeds.fast = v(200), $.fx.speeds.slow = v(600), 1 != g && (y("animate", 1), y("fadeOut", 0), y("fadeIn", 0), c.speed = g, a.speed = g)
            },
            toString: function() {
                return "SPEED: " + g
            },
            ms: v
        });

        function v(e) {
            return e / g
        }

        function y(e, i) {
            var r = $.fn[e];
            $.fn[e] = function() {
                var e = Array.prototype.slice.call(arguments),
                    t = e[i];
                return "number" == typeof t ? e[i] = v(t) : t && t.duration && (t.duration = v(t.duration)), r.apply(this, e)
            }
        }

        function b(e) {
            $("#" + e + " div").addClass("sad")
        }

        function k(e) {
            $("#" + e + " div").removeClass("sad")
        }
        h.speed && "normal" !== h.speed && p.set(h.speed), l.cake("scroll") && (window.scroll(0, parseInt(l.cake("scroll"))), l.deleteCake("scroll")), document.referrer && document.referrer.length && (document.referrer.match(/^https:\/\/cardgames\.io\//) || document.referrer.match(/127\.0\.0\.1/) || l.trackEvent("Referral", document.referrer));
        var w, S, C, M = (w = "", S = {}, C = 0, $(document).on("keypress", function(e) {
            var t = (new Date).getTime();
            2e3 < t - C && (w = ""), C = t;
            var i = String.fromCharCode(e.which);
            for (var r in w += i, S) {
                if (r == w) return S[r](), void(w = "");
                if (r.substr(0, w.length) == w) return
            }
            for (var n in S)
                if (n.substr(0, 1) == i) return void(w = i);
            w = ""
        }), function(e, t) {
            S[e] = t
        });

        function x(e) {
            void 0 === e && (e = "");
            var i = e.split(","),
                t = s.messages.filter(function(t) {
                    return i.some(function(e) {
                        return -1 !== t.toLowerCase().indexOf(e.trim().toLowerCase())
                    })
                });
            0 === t.length ? $("#matrix textarea").val("Sorry, no log lines found for term: " + e) : $("#matrix textarea").val(t.join("\n"))
        }
        window.players && window.players.top && "2" === window.players.top.code && $("body").addClass("default-top-player"), M("matrix", function() {
            $("body").toggleClass("matrix");
            var e = $("#matrix textarea");
            $("body").hasClass("matrix") && (x(), e.scrollTop(e[0].scrollHeight), setTimeout(function() {
                $("#matrix input").val("").focus()
            }, 200))
        }), $("#matrix-log-filter").on("input", function(e) {
            var t = $("#matrix-log-filter").val().trim().toLowerCase(),
                i = $("#matrix textarea");
            t.match(/^(:q|quit|exit|matrix)$/) ? $("body").removeClass("matrix") : t.match(/fuck/) ? i.val("We're not that kind of site!") : "help" === t ? i.val("What do you need help with?") : "who are you" === t ? i.val("My name is Skynet.") : "skynet" === t ? i.val("Welcome to Cyberdyne systems.") : "shutdown" === t ? i.val("Shutting site down in 5 seconds...") : "cheat" === t ? i.val("Nice try!") : x(t.trim())
        }), l.qs.autoplay && ("number" == typeof l.qs.autoplay ? p.set(l.qs.autoplay) : p.set(3)), $(function() {
            for (var e = 0, t = ["bottom", "top", "left", "right"]; e < t.length; e++) {
                var i = t[e];
                l.preloadBackgroundImageClass("face-small sad face-" + i + "-player")
            }

            function n(e) {
                if (void 0 === h) return {};
                var t = void 0 !== h[e] ? h : l.siteSettings;
                return void 0 === t[e] ? (s.error("Bad option name: " + e), {}) : t
            }
            $(document).on("keypress", function(e) {
                13 === e.which && $("#start-new-game").is(":visible") && $("#start-new-game").click()
            }), APP_MODE && (l.siteSettings.showAdSettingsLink && $("#ad-settings").css("display", "block"), window.app = {
                showAdSettingsLink: function() {
                    l.siteSettings.set("showAdSettingsLink", !0), $("#ad-settings").css("display", "block")
                },
                hideAdSettingsLink: function() {
                    l.siteSettings.set("showAdSettingsLink", !1), $("#ad-settings").hide()
                }
            }, $(".game-links a").on("click", function(e) {
                var t = e.target.href;
                e.preventDefault(), l.ads.trigger(function() {
                    location.href = t
                })
            }), window.addEventListener("message", function(e) {
                if ("new-face" === e.data) {
                    loadPlayerFaces(), $("#temphidenames").remove(), $("body").removeClass("subview-open avatars-subview-open");
                    var t = $("#title h1").data("real-title");
                    t && $("#title h1").text(t)
                }
            }), window.addEventListener("orientationchange", function(e) {
                $("body").removeClass("subview-open avatars-subview-open  statistics-subview-open");
                var t = $("#title h1").data("real-title");
                t && $("#title h1").text(t)
            }), $('a[href$="/statistics/"]').on("click", function(e) {
                e.preventDefault(), $("#statistics-subview").attr("src") || $("#statistics-subview").attr("src", e.target.href), $("body").addClass("subview-open").addClass("statistics-subview-open"), l.mobileMenu.close()
            }), $('a[href$="/avatars/"]').on("click", function(e) {
                e.preventDefault();
                var t = $("#title h1"),
                    i = t.text();
                t.data("real-title", i), t.text("CHANGE PLAYER"), $("#avatars-subview").attr("src") || $("#avatars-subview").attr("src", "/avatars/"), $("body").addClass("subview-open").addClass("avatars-subview-open"), l.mobileMenu.close()
            }), $(".appmode-remove").remove(), $(".game-links a").each(function() {
                $(this).attr("href", $(this).attr("href") + "?" + (new Date).getTime())
            }), $('a[href="#ad-settings"]').on("click", function(e) {
                e.preventDefault(), l.mobileMenu.close(), window.Android ? Android.adSettings() : window.webkit.messageHandlers.adSettings.postMessage("Hi there")
            })), $("#play-page").on("click", function() {}), $('.option-row input[type="radio"]').each(function() {
                var e = $(this).attr("name");
                n(e)[e] == $(this).val() && $(this).prop("checked", !0)
            }), $(".option-row input+span").on("touchstart", function(e) {
                $(this).siblings("input").trigger("click"), e.preventDefault()
            }), $('.option-row input[type="radio"]').on("change", function(e) {
                var t = $(this).attr("name"),
                    i = n(t),
                    r = $(this).val();
                "number" == typeof i[t] ? i.set(t, parseInt(r)) : i.set(t, r)
            }), $('.option-row input[type="checkbox"]').each(function() {
                var e = $(this).attr("name"),
                    t = n(e);
                $(this).prop("checked", t[e])
            }), $('.option-row input[type="checkbox"]').on("change", function(e) {
                var t = $(this).attr("name");
                n(t).set(t, $(this).is(":checked"))
            }), l.siteSettings.addListener("useDarkTheme", function(e) {
                e.value ? $("html").addClass("dark-theme") : $("html").removeClass("dark-theme")
            }), l.siteSettings.addListener("hideMultiplayerButton", function(e) {
                l.siteSettings.hideMultiplayerButton && ($("#multiplayer-button").hide(), APP_MODE || alert("You've chosen to hide the Multiplayer button. It will still show up when you load the page, but will be hidden as soon as the game starts."))
            }), l.siteSettings.addListener("holidayThemes", function(e) {
                e.value ? (themes.turnOn(), l.deleteCake("themeoff")) : themes.turnOff()
            }), l.siteSettings.addListener("alwaysUseInterstitialAds", function(e) {
                $(".don-draper").css("visibility", e.value ? "hidden" : "visible")
            }), l.siteSettings.addListener("spreadCards", function(e) {
                try {
                    webRenderer._adjustHand(human)
                } catch (e) {}
            }), void 0 !== h && h.addListener("speed", function(e) {
                $("#speed-value").text({
                    slow: "Slow",
                    verySlow: "Very slow",
                    normal: "Normal",
                    fast: "Fast",
                    veryFast: "Very fast"
                } [h.speed]), p.set(h.speed)
            }), $("#facebook-promo a").click(function() {
                l.trackEvent("FacebookLinkClick")
            }), c(function() {
                l.preloadImage(STATIC_ASSET_DOMAIN + "/shared/images/svg/trophy.svg")
            }, 9e3), $(".avatar").click(function() {
                l.trackEvent("ClickPlayer", $(this).attr("id"))
            }), $("#game-options-page button").click(function() {
                $("body").removeClass("options-open")
            }), $('a[href="#options"]').click(function(e) {
                e.preventDefault(), l.removeConfetti(), l.mobileMenu.isOpen() && l.mobileMenu.close(), $("body").addClass("options-open"), $("body").removeClass("multiplayer-open")
            });
            void 0 !== h && $("#speed-value").text({
                verySlow: "Very slow",
                slow: "Slow",
                normal: "Normal",
                fast: "Fast",
                veryFast: "Very fast"
            } [h.speed]), $('a[href="#newgame"]').click(function(e) {
                function t() {
                    l.qs.gid ? document.location.href = document.location.pathname : (l.isMobileLookActive(), l.reloadPage())
                }
                e.preventDefault(), e.stopPropagation(), l.removeConfetti();
                var i, r, n = "You have a game in progress. Are you sure you want to start a new game and abandon the current game?";
                i = u.isGameStarted(), r = u.isGameFinished();
                var a = new f(window.slug);
                return i ? r ? l.cake("results") || a.get("scores") ? confirm(n) && (l.cake("results", ""), a.remove("scores"), l.trackEvent("NewGame", "Finished"), l.ads.trigger(t)) : (l.trackEvent("NewGame", "Finished"), l.ads.trigger(t)) : confirm(n) && (l.trackEvent("NewGame", "Abandoned"), l.cake("results") && l.cake("results", ""), a.remove("scores"), l.ads.trigger(t)) : l.cake("results") || a.get("scores") ? confirm(n) && (l.cake("results", ""), a.remove("scores"), l.trackEvent("NewGame", "NotStarted"), l.ads.trigger(t)) : (l.trackEvent("NewGame", "NotStarted"), l.ads.trigger(t)), !1
            });

            function r(e) {
                return e && e.toUpperCase().match(/-THX1138$/)
            }

            function a() {
                window.paused ? (window.paused = !1, window.pauseTime += (new Date).getTime() - window.pausedAt, $('a[href="#pause"]').text("Pause Game"), $("#play-page").removeClass("paused"), $("#pause-notification").hide()) : u.isGameFinished() || (window.pauseTime = window.pauseTime || 0, window.pausedAt = (new Date).getTime(), window.paused = !0, $('a[href="#pause"]').text("Resume Game"), $("#play-page").addClass("paused"), $("#pause-notification").show())
            }
            r(l.cake("betacode")) && $("#board").removeClass("beta"), $("#beta-screen button").on("click", function(e) {
                e.preventDefault();
                var t = $("#beta-screen input").val();
                r(t) ? ($("#board").removeClass("beta"), l.cake("betacode", t, 20)) : alert("That is not a valid code")
            }), $('a[href="#rules"],a[href="#about"]').on("click", function(e) {
                e.target.href.match(/#rules/) ? ($("body").removeClass("about-open"), $("body").addClass("rules-open")) : ($("body").removeClass("rules-open"), $("body").addClass("about-open")), APP_MODE && e.preventDefault(), l.mobileMenu.close()
            }), $('a[href="#pause"]').click(function(e) {
                a(), l.mobileMenu.close(), e.preventDefault()
            }), $("#resume-button").click(function(e) {
                a(), l.mobileMenu.close(), e.preventDefault()
            }), $(".theme-off").on("click", function(e) {
                e.preventDefault(), l.cake("themeoff", "1", 10, "/"), $("html").removeClass(themes.current)
            }), $(".theme-on").on("click", function(e) {
                e.preventDefault(), l.deleteCake("themeoff"), 0 === $("#theme-css").length && $("<link>", {
                    href: "/themes/" + siteVersion + "/" + themes.current + ".min.css",
                    id: "theme-css",
                    rel: "stylesheet"
                }).appendTo("head"), $("html").addClass(themes.current)
            }), $(window).on("pagehide", function(e) {
                window.paused || (window.pageHiddenAt = (new Date).getTime())
            }), $(window).on("pageshow", function() {
                if (!window.paused && window.pageHiddenAt) {
                    var e = (new Date).getTime() - window.pageHiddenAt;
                    "undefined" == typeof pauseTime && (window.pauseTime = 0), window.pauseTime += e
                }
            }), void 0 === document.createElement("div").style.webkitTextStroke && $("html").addClass("no-text-stroke"), window.startTime = (new Date).getTime(), (new Date).toString().match(/ May 4 /) && $("#the-force").text("May the 4th be with you");
            try {
                if (!l.isMobileLookActive()) {
                    var o = document.createElement("div");
                    o.innerHTML = "&nbsp;", o.className = "adsbox", document.body.appendChild(o), setTimeout(function() {
                        0 === o.offsetHeight ? $("body").addClass("adblock") : "3030" !== location.port || l.qs.ads || $(".don-draper ins").each(function() {
                            var e = document.createElement("iframe");
                            e.src = "/merchandise/", e.setAttribute("class", "dev-ad"), e.frameBorder = 0, e.scrolling = "no", $(this).append(e)
                        });
                        o.parentNode.removeChild(o)
                    }, 100)
                }
            } catch (e) {}
        }), l.browser.supportsSvg || function(e) {
            if (e) {
                var t = "../";
                return "/" === document.location.pathname && (t = ""), $("#firefox-Logo").attr("src", t + "shared/images/Icon_Mozilla.png"), $("#Chrome-Logo").attr("src", t + "shared/images/Icon_Chrome.png"), $("#oldbrowser").show()
            }
            $("#oldbrowser").hide()
        }(!0), void 0 !== i && (t.exports = {
            loadPlayerFace: function(e, t, i) {
                var r = l.getFaceUrl(e, !1),
                    n = l.getFaceUrl(e, !0),
                    a = l.getHairClass(e);
                l.createFaceStyleElement(t.substr(1), r, n);
                var o = $(t + " .face-small"),
                    s = o.get(0).className.match(/hair-\w+/);
                s && (s = s[0], o.data("original-hair") || o.data("original-hair", s), o.removeClass(s)), o.addClass(a), o.data("current-hair", a), $(t + " small").text(i), $(t + " .face-small").css("margin", "auto"), $(t).css("margin-left", "-" + $(t).width() / 2 + "px")
            },
            addCheat: M,
            makePlayersSad: function(e) {
                for (var t = ["top-player", "bottom-player", "left-player", "right-player"], i = 0; i < t.length; i++) - 1 == e.indexOf(t[i]) ? b(t[i]) : k(t[i])
            },
            makePlayerSad: b,
            makePlayerHappy: k,
            makeAllPlayersHappy: function() {
                $(".avatar div").removeClass("sad")
            },
            SPEED: p,
            HTML_CARD_SUITS: o
        })
    }, {
        "./gamecontrol": 18,
        "./helper-functions": 19,
        "./temp-storage": 27,
        "./util": 28
    }],
    18: [function(e, t, i) {
        "use strict";
        var r = "notstarted",
            n = null;
        t.exports = {
            isGameNotStarted: function() {
                return "notstarted" === r
            },
            isGameStarted: function() {
                return "started" === r
            },
            isGameFinished: function() {
                return "finished" === r
            },
            isStuck: function() {
                return "stuck" === r
            },
            startGame: function() {
                r = "started"
            },
            finishGame: function() {
                r = "finished"
            },
            stuck: function() {
                r = "stuck"
            },
            resetGameStatus: function() {
                r = "notstarted"
            },
            addRestartHandler: function(e) {
                n = e
            },
            canRestart: function() {
                return null !== n
            },
            restart: function() {
                if (null === n) throw new Error('No restart handler has been registered. Check "canRestart()" before calling this function');
                n()
            }
        }
    }, {}],
    19: [function(e, t, i) {
        "use strict";
        var o = {
                x: -1,
                m: Math.pow(2, 32),
                a: 1664525,
                b: 1013904223,
                init: function(e) {
                    void 0 === e && (e = -1), this.x = -1 == e ? Math.floor(Math.random() * this.m) : e
                },
                next: function() {
                    return -1 == this.x && this.init(), this.x = (this.a * this.x + this.b) % this.m, this.x / (this.m - 1)
                }
            },
            r = {
                shuffle: function(e, t) {
                    void 0 === t && (t = -1);
                    var i = e.length;
                    if (0 !== i)
                        for (o.init(t); --i;) {
                            var r = Math.floor(o.next() * (i + 1)),
                                n = e[i],
                                a = e[r];
                            e[i] = a, e[r] = n
                        }
                },
                remove: function(e, t) {
                    var i = e.indexOf(t);
                    return -1 !== i && (e.splice(i, 1), !0)
                },
                random: function(e) {
                    return e[Math.floor(Math.random() * e.length)]
                }
            };
        var n = {
            info: function(e) {
                this.messages.push("INFO: " + e), this.level.match(/info|verbose|debug/) && (console.info ? console.info(e) : console.log("INFO: " + e))
            },
            messages: [],
            error: function(e) {
                this.messages.push("ERROR: " + e), console.error ? console.error(e) : console.log("ERROR: " + e)
            },
            debug: function(e) {
                this.messages.push("DEBUG: " + e), "debug" == this.level && (console.debug ? console.debug(e) : console.log("DEBUG: " + e))
            },
            warn: function(e) {
                this.messages.push("WARN: " + e), this.level.match(/info|verbose|warn|debug/) && (console.warn ? console.warn(e) : console.log("WARN: " + e))
            },
            toString: function() {
                return "gott log "
            },
            level: "info"
        };

        function a(e, t) {
            return 1 !== a.speed && (t = Math.floor(t / a.speed)), setTimeout(e, t)
        }

        function s(e, t) {
            return 1 !== s.speed && (t = Math.floor(t / s.speed)), setInterval(e, t)
        }
        s.speed = a.speed = 1, void 0 !== i && (t.exports = {
            captainsLog: n,
            dataBind: function(e, o) {
                return e.replace(/@(\w+(\.\w+)*)/g, function(e, t) {
                    for (var i, r = t.split("."), n = o, a = 0; a < r.length; a++) {
                        if (i = r[a], void 0 === n) return "<undefined>";
                        if (null === n || null === n[i]) return "<null>";
                        if (void 0 === n[i]) return "<undefined>";
                        n = n[i]
                    }
                    return "" + n
                })
            },
            _setTimeout: a,
            _setInterval: s,
            randomInt: function(e, t) {
                return Math.floor(Math.random() * (t - e + 1)) + e
            },
            ArrayUtils: r,
            addDelaysToFunctions: function(e, t) {
                function i(e, t, i) {
                    var r = e[t];
                    if (!r) throw new Error("Unrecognized func name: " + t);
                    e[t] = function() {
                        var e = this,
                            t = arguments;
                        a(function() {
                            r.apply(e, t)
                        }, i)
                    }
                }
                for (var r in t) {
                    i(e, r, t[r])
                }
            },
            cson: function(e) {
                return "undefined" == typeof JSON ? "JSON Not Available" : JSON.stringify(function e(t) {
                    var i = Object.prototype.toString;
                    if ("undefined" == typeof JSON) return "JSON Not Available";
                    if (null == t) return t;
                    if (t.name || t.shortName) return t.name || t.shortName;
                    if ("[object Array]" == i.call(t)) {
                        for (var r = [], n = 0; n < t.length; n++) r.push(e(t[n]));
                        return r
                    }
                    if ("[object Object]" != i.call(t)) return t;
                    var a = {};
                    for (var o in t) a[o] = e(t[o]);
                    return a
                }(e), null, 2).replace(/\s*"([HSDC]\d\d?)"\s*(\]|,)/gm, "$1$2").replace(/"([HSDC]\d\d?)"/gm, "$1")
            },
            combinations: function(e, n) {
                return function e(t, i, r) {
                    if (0 !== t.length || 0 !== i.length) return 0 === i.length ? n ? t.length >= n && r.push(t) : r.push(t) : (e(t.concat(i[0]), i.slice(1, i.length), r), e(t, i.slice(1, i.length), r)), r
                }([], e, [])
            }
        })
    }, {}],
    20: [function(e, t, i) {
        "use strict";
        var s = e("../util"),
            r = e("./multiplayer-util"),
            n = r.normalizeTable,
            a = r.randomId,
            o = r.setupMultiplayerLogging,
            l = e("../helper-functions").captainsLog,
            c = e("../statistics"),
            h = e("../temp-storage"),
            u = e("./name-handler"),
            f = function() {
                function e(e, t) {
                    var i = this;
                    if (this.slug = e, this.roomId = t, this.tempStorage = new h(e), o(), s.siteSettings.multiplayerPublicId || (s.siteSettings.set("multiplayerPublicId", a()), s.siteSettings.set("multiplayerPrivateId", a())), this.publicId = s.siteSettings.multiplayerPublicId, this.privateId = s.siteSettings.multiplayerPrivateId, this.playerInfo = {}, this.declineCount = 0, this.setupEventHandlers(), u(function() {
                            return i.newNameReady()
                        }, function(e) {
                            return i.changedNameReady(e)
                        }), s.siteSettings.multiplayerGameInProgress && !s.qs.gid) {
                        var r = Math.max(0, s.siteSettings.playerRating - 3);
                        l.debug("Are on offline page, with multiplayerGameInProgress=true, decreasing playerRating by 3 points!"), s.siteSettings.set("playerRating", r), s.siteSettings.set("multiplayerGameInProgress", !1)
                    }
                    var n = this.tempStorage.get("connectlobby");
                    n && n > (new Date).getTime() && !s.qs.gid && this.connect()
                }
                var t = e.prototype;
                return t.newNameReady = function() {
                    $(".multiplayer-lobby-link").click()
                }, t.changedNameReady = function(e) {
                    e.newName !== e.oldName && ($(".player-" + s.siteSettings.multiplayerPublicId + " small").text(s.siteSettings.playerName), this.socket.emit("name-change", s.siteSettings.playerName))
                }, t.message = function(e) {
                    $("#challenge-lobby-message").html(e)
                }, t.showCover = function() {
                    $("#cover").fadeIn(200)
                }, t.hideCover = function() {
                    $("#cover").fadeOut(200)
                }, t.showDialog = function(e) {
                    this.showCover(), $(e).show()
                }, t.hideDialog = function(e) {
                    $(e).hide(), "#multiplayer-challenge-lobby" !== e && this.lobbyWindowOpen ? $("#multiplayer-challenge-lobby").show() : this.hideCover()
                }, t.setupEventHandlers = function() {
                    function e(e, t) {
                        return $(e).on("click", t.bind(i))
                    }
                    var i = this;
                    e(".multiplayer-lobby-link", this.openMultiplayerLobby), e(".close-multiplayer", this.closeMultiplayerLobby), e("#disconnect-lobby", this.manualDisconnect), e(".close-dialog", this.closeAllDialogs), $(".online-players-list").on("click", ".online-player", function(e) {
                        return i.sendChallenge(e)
                    }), e("#cancel-invite", this.cancelChallenge), e("#accept-multiplayer", this.acceptChallenge), e("#decline-multiplayer", this.declineChallenge)
                }, t.setupMessageHandlers = function() {
                    function e(e, t) {
                        return i.socket.on(e, t.bind(i))
                    }
                    var i = this;
                    e("connect", this.onConnect), e("disconnect", this.onDisconnect), e("connect_error", this.onConnectError), e("reconnection", this.onReconnect), e("start-game", this.onStartGame), e("players-online-full", this.onPlayersOnlineFull), e("players-online-delta", this.onPlayersOnlineDelta), e("online-count", this.onOnlineCount), e("name-change", this.onNameChange), e("challenge-received", this.challengeReceived), e("challenge-accepted", this.challengeAccepted), e("challenge-declined", this.challengeDeclined), e("challenge-cancelled", this.challengeCancelled), e("update-app", this.onUpdateApp)
                }, t.createConnectionUrl = function() {
                    var e, t = this.slug;
                    e = "cardgames.io" === location.hostname || "production" === s.qs.server || APP_MODE ? "https://" + t + ".cardgames.io/" : "https://dev.cardgames.io:3031/";
                    var i = s.siteSettings.players.bottom.code,
                        r = s.siteSettings.playerName,
                        n = s.siteSettings.playerRating;
                    return this.roomId && (t += "-" + this.roomId), e += "lobby", e += "?face=" + i + "&name=" + r + "&publicId=" + this.publicId + "&privateId=" + this.privateId + "&clientversion=" + siteVersion + "&game=" + t + "&type=challenge&rating=" + n
                }, t.openMultiplayerLobby = function(e) {
                    var t = this;
                    e.preventDefault(), s.mobileMenu.close(), this.lobbyWindowOpen = !0;
                    try {
                        window.sessionStorage.getItem("nothing")
                    } catch (e) {
                        return this.showDialog("#no-cookies"), $("#no-cookies").show(), void $("#no-cookies button").on("click", function(e) {
                            t.hideDialog("#no-cookies")
                        })
                    }
                    if (!s.siteSettings.playerName || "You" === s.siteSettings.playerName) return this.showDialog("#enter-name"), void $("#name-new").focus();
                    if (this.showDialog("#multiplayer-challenge-lobby"), s.isMobileLookActive()) {
                        var i = $("#challenge-lobby-message").height(),
                            r = $("#multiplayer-challenge-lobby .button-container").position().top - i - 52 - 20;
                        $(".online-players-list").height(Math.floor(r))
                    }
                    this.setReconnectExpiry(), this.connect(), this.socket && this.socket.connected && this.socket.emit("open-lobby-window")
                }, t.closeMultiplayerLobby = function() {
                    this.hideDialog("#multiplayer-challenge-lobby"), this.socket.emit("close-lobby-window"), this.lobbyWindowOpen = !1
                }, t.setReconnectExpiry = function() {
                    var e = (new Date).getTime() + 18e5;
                    this.tempStorage.set("connectlobby", e)
                }, t.closeAllDialogs = function() {
                    $(".multiplayer-dialog").hide(), this.lobbyWindowOpen ? $("#multiplayer-challenge-lobby").show() : this.hideCover()
                }, t.onUpdateApp = function() {
                    this.disconnect(), $("#multiplayer-button").text("Multiplayer"), this.message("Hi. It looks like you're using an old version of our app. Please update to the latest version to continue playing our multiplayer games ðŸ˜Ž."), $("#disconnect-lobby").hide(), this.tempStorage.remove("connectlobby"), this.lobbyWindowOpen = !1
                }, t.manualDisconnect = function(e) {
                    e.preventDefault(), this.disconnect(), $("#multiplayer-button").text("Multiplayer"), $(".multiplayer-dialog").hide(), this.showDialog("#manual-disconnect"), this.tempStorage.remove("connectlobby"), this.lobbyWindowOpen = !1
                }, t.onStartGame = function(e) {
                    n(e, this.publicId), this.tempStorage.set(e.id, e), this.isStarting = !0, c.cancelGame(), location.href = "/" + this.slug + "/?gid=" + e.id
                }, t.setOnlineCount = function(e) {
                    10 <= e ? $("#multiplayer-button").text("Online (10+)") : $("#multiplayer-button").text("Online (" + e + ")"), e <= 1 ? this.message('You are the only player online. Just click "Close", if more players come online they\'ll see you and can challenge you to a game.') : this.message('These players are currently online. Click on them to challenge them to a game. <br>A player with <span class="checkmark">âœ“</span> has finished at least their last 3 games.')
                }, t.onPlayersOnlineFull = function(e) {
                    $("#connection-error").remove(), $(".online-player").each(function() {
                        var t = $(this).data("id");
                        e.find(function(e) {
                            return e.id === t
                        }) || $(this).remove()
                    });
                    var t = e,
                        i = Array.isArray(t),
                        r = 0;
                    for (t = i ? t : t[Symbol.iterator]();;) {
                        var n;
                        if (i) {
                            if (r >= t.length) break;
                            n = t[r++]
                        } else {
                            if ((r = t.next()).done) break;
                            n = r.value
                        }
                        var a = n;
                        0 === $(".player-" + a.id).length && this.createPlayerDiv(a), this.playerInfo[a.id] = a
                    }
                    this.setOnlineCount(e.length), this.updateScrollBars()
                }, t.onNameChange = function(e, t) {
                    e !== s.siteSettings.multiplayerPublicId && $(".player-" + e + " small").text(t)
                }, t.updateScrollBars = function() {
                    var e = $(".online-players-list"),
                        t = e.get(0);
                    t.scrollHeight > t.clientHeight ? e.addClass("large") : e.removeClass("large")
                }, t.onOnlineCount = function(e) {
                    this.setOnlineCount(e)
                }, t.sendChallenge = function(e) {
                    var t = $(e.currentTarget).data("id");
                    if (this.declineCount = 0, t === s.siteSettings.multiplayerPublicId) return $("#multiplayer-challenge-lobby").hide(), $("#challenge-yourself input").val(s.siteSettings.playerName), setTimeout(function() {
                        return $("#challenge-yourself input").focus()
                    }, 200), void this.showDialog("#challenge-yourself");
                    this.opponent = this.playerInfo[t], this.socket.emit("send-challenge", t), s.preloadBackgroundImage(s.getFaceUrl(this.opponent.face, !0)), this.showChallengeDialog("#challenge-sent")
                }, t.cancelChallenge = function() {
                    this.socket.emit("cancel-challenge", this.opponent.id), this.lobbyWindowOpen ? ($("#challenge-sent").hide(), $("#multiplayer-challenge-lobby").show()) : this.hideDialog("#challenge-sent"), delete this.opponent
                }, t.acceptChallenge = function() {
                    this.lobbyWindowOpen = !1, this.socket.emit("accept-challenge", this.opponent.id), this.showChallengeDialog("#challenge-accepted-you"), this.declineCount = 0
                }, t.declineChallenge = function() {
                    this.socket.emit("decline-challenge", this.opponent.id), this.hideDialog("#challenge-received"), delete this.opponent, this.declineCount++, this.checkForDeclineLimit()
                }, t.checkForDeclineLimit = function() {
                    6 <= this.declineCount && (this.disconnect(), $("#multiplayer-button").text("Multiplayer"), $("#cover").hide(), $(".multiplayer-dialog").hide(), this.tempStorage.remove("connectlobby"), this.lobbyWindowOpen = !1, this.declineCount = 0)
                }, t.showChallengeDialog = function(e, t) {
                    void 0 === t && (t = !1), $(".multiplayer-dialog").hide(), $(e + " p span").text(this.opponent.name);
                    var i = s.getFaceUrl(this.opponent.face, t);
                    $(e + " .player-image").css("background-image", "url(" + i + ")"), 3 <= this.opponent.rating ? $(e + " .player-image").addClass("finisher") : $(e + " .player-image").removeClass("finisher"), this.showDialog(e)
                }, t.challengeReceived = function(e) {
                    this.opponent = e, s.preloadBackgroundImage(s.getFaceUrl(this.opponent.face, !0)), this.showChallengeDialog("#challenge-received")
                }, t.challengeAccepted = function() {
                    this.lobbyWindowOpen = !1, this.showChallengeDialog("#challenge-accepted")
                }, t.challengeCancelled = function(e) {
                    if (this.opponent)
                        if (this.opponent.id === e) {
                            if ($("#challenge-accepted-you").is(":visible")) return this.showChallengeDialog("#challenge-cancelled", !0), void delete this.opponent;
                            if ($("#challenge-received").is(":visible")) return this.showChallengeDialog("#challenge-cancelled", !0), this.declineCount++, this.checkForDeclineLimit(), void delete this.opponent;
                            l.debug("Ignoring cancelled challenge from " + this.opponent.name + ", we have no dialog showing!"), delete this.opponent
                        } else l.debug("Ignoring cancelled challenge from id=" + e + ", we are being challenged by " + this.opponent.name);
                    else l.debug("Ignoring cancelled challenge from id=" + e)
                }, t.challengeDeclined = function(e, t) {
                    if (this.opponent && this.opponent.id === e) {
                        var i = ["Probably afraid of you.", "Maybe they had to go wash their hair.", "Maybe they spontaneously combusted.", "Perhaps they had a food related emergency.", "Probably knew how good you are at this game.", "Maybe afraid to lose!"];
                        l.debug("invite-rejected, reason=" + t);
                        var r = i[Math.floor(Math.random() * i.length)],
                            n = this.opponent.name,
                            a = "Sorry, " + n + " declined your challenge. " + r;
                        "disconnected" === t ? a = n + " has just disconnected and can't accept your challenge. Try someone else." : "challenging" === t ? a = n + " is currently challenging someone else and can't reply to your challenge. Try someone else." : "challenged" === t && (a = n + " is currently being challenged by someone else and can't respond to your challenge. Try someone else."), $("#challenge-declined p").text(a), this.showChallengeDialog("#challenge-declined", !0), delete this.opponent
                    }
                }, t.onPlayersOnlineDelta = function(e) {
                    var t = e.newPlayers,
                        i = Array.isArray(t),
                        r = 0;
                    for (t = i ? t : t[Symbol.iterator]();;) {
                        var n;
                        if (i) {
                            if (r >= t.length) break;
                            n = t[r++]
                        } else {
                            if ((r = t.next()).done) break;
                            n = r.value
                        }
                        var a = n;
                        0 === $(".player-" + a.id).length && this.createPlayerDiv(a), this.playerInfo[a.id] = a
                    }
                    var o = function() {
                            if (l) {
                                if (c >= s.length) return "break";
                                h = s[c++]
                            } else {
                                if ((c = s.next()).done) return "break";
                                h = c.value
                            }
                            var e = $(".player-" + h);
                            e.fadeOut(function() {
                                return e.remove()
                            })
                        },
                        s = e.removedPlayerIds,
                        l = Array.isArray(s),
                        c = 0;
                    for (s = l ? s : s[Symbol.iterator]();;) {
                        var h;
                        if ("break" === o()) break
                    }
                    this.message('These players are currently online. Click on them to challenge them to a game. <br>A player with <span class="checkmark">âœ“</span> has finished at least their last 3 games.'), this.setOnlineCount($(".online-player").length - e.removedPlayerIds.length), this.updateScrollBars(), $("#connection-error").remove()
                }, t.createPlayerDiv = function(e) {
                    var t = $("<span>").addClass("online-player").addClass("player-" + e.id).data("id", e.id).data("face", e.face),
                        i = "hair-" + (e.face.length <= 2 ? e.face : e.face.charAt(2)),
                        r = e.name;
                    e.id === this.publicId && r !== s.siteSettings.playerName && (r = s.siteSettings.playerName);
                    var n = s.getFaceUrl(e.face, !1),
                        a = $("<div>").addClass("face-small").addClass(i).css("background-image", "url(" + n + ")"),
                        o = $("<small>").text(r);
                    t.append(a).append(o), 3 <= e.rating && t.addClass("finisher"), t.appendTo(".online-players-list")
                }, t.showMessageBox = function(e, t) {
                    $("#error-message-box h3").text(e), $("#error-message-box p").text(t), $("#error-message-box").show()
                }, t.connect = function() {
                    if (s.qs.gid) this.message("You are already playing a multiplayer game, you can't start another one right now");
                    else {
                        if (!this.socket) {
                            var e = this.createConnectionUrl();
                            l.debug("Connection url: " + e), this.socket = io(e, {
                                reconnection: !0,
                                reconnectAttempts: 10
                            }), this.setupMessageHandlers()
                        }
                        this.socket.connected || this.socket.connect()
                    }
                }, t.disconnect = function() {
                    this.socket && this.socket.connected && this.socket.disconnect()
                }, t.onDisconnect = function(e) {
                    l.debug("Socket disconnected: " + e), "io server disconnect" === e && ($("#multiplayer-button").text("Multiplayer"), $(".multiplayer-dialog, #cover").hide(), this.tempStorage.remove("connectlobby"), this.lobbyWindowOpen = !1)
                }, t.onConnect = function() {
                    l.debug("Socket connected"), $("#connection-error").remove(), $("#multiplayer-challenge-lobby").is(":visible") && this.socket.emit("open-lobby-window"), this.setupVisibilityHandling()
                }, t.setupVisibilityHandling = function() {
                    var e = this;
                    if (!this.hasSetupVisibilityHandling) {
                        var t = !1;
                        document.addEventListener("visibilitychange", function() {
                            "hidden" === document.visibilityState && e.socket && e.socket.connected && (t = !0, l.debug("Disconnecting, page is hidden"), e.disconnect()), "visible" === document.visibilityState && t && (e.connect(), l.debug("Connecting, page is visible again!"), t = !1)
                        }), this.hasSetupVisibilityHandling = !0
                    }
                }, t.onReconnect = function(e) {
                    l.debug("Reconnected: " + e), $("#multiplayer-challenge-lobby").is(":visible") && this.socket.emit("open-lobby-window")
                }, t.onConnectError = function(e) {
                    l.error("Connection error: " + e), 0 === $("#connection-error").length && $(".online-players-list").html($("<div/>").attr("id", "connection-error").text("CONNECTION ERROR ðŸ˜Ÿ").append($("<div/>").text("Trying to reconnect..."))), this.message("")
                }, e
            }();
        t.exports = f
    }, {
        "../helper-functions": 19,
        "../statistics": 26,
        "../temp-storage": 27,
        "../util": 28,
        "./multiplayer-util": 22,
        "./name-handler": 23
    }],
    21: [function(e, t, i) {
        "use strict";
        var f = e("../util"),
            o = e("../helper-functions").captainsLog,
            r = e("./multiplayer-util").normalizeTable,
            c = e("./speech-handler"),
            h = e("../temp-storage");
        f.qs.nodisconnect && f.cake("nodisconnect", "1", 100, "/");
        var n = function() {
            function e(e, t, i) {
                var r = this;
                this.slug = e, this.table = t, this.players = i, this.publicId = f.siteSettings.multiplayerPublicId, this.privateId = f.siteSettings.multiplayerPrivateId, this.handlers = {}, this.speechHandler = new c(function(e) {
                    return r.sendPhrase(e)
                }), this.receivedMoves = [{
                    nr: 0
                }], this.sentMoves = [{
                    nr: 0
                }], this.tempStorage = new h(e);
                var n = function() {
                        if (o) {
                            if (s >= a.length) return "break";
                            l = a[s++]
                        } else {
                            if ((s = a.next()).done) return "break";
                            l = s.value
                        }
                        var t = l;
                        r.players.find(function(e) {
                            return e.multiplayerId === t.id
                        }).bot = t.bot
                    },
                    a = this.table.players,
                    o = Array.isArray(a),
                    s = 0;
                for (a = o ? a : a[Symbol.iterator]();;) {
                    var l;
                    if ("break" === n()) break
                }
                this.setupSubstituteMoves(), this.setupConcedeHandler(), this.setupRematchHandler(), this.setupTurnOffTimerHandler(), $(document).on("visibilitychange", function() {
                    return r.visibilityChange()
                }), setTimeout(function() {
                    return r.visibilityChange()
                }, 3e3), window.addEventListener("beforeunload", function() {
                    return r.beforeUnloadWindow()
                })
            }
            var t = e.prototype;
            return t.setupSubstituteMoves = function() {
                var n = this,
                    a = this.players,
                    e = function() {
                        if (i) {
                            if (o >= t.length) return "break";
                            s = t[o++]
                        } else {
                            if ((o = t.next()).done) return "break";
                            s = o.value
                        }
                        var r = s;
                        "bottom-player" === r.id ? r.shouldMakeSubstituteMove = function() {
                            return !1
                        } : r.shouldMakeSubstituteMove = function() {
                            if (!r.offline) return !1;
                            if (((new Date).getTime() - r.offline) / 1e3 < 10) return !1;
                            for (var e = a.indexOf(r), t = e + 1; t <= e + 3; t++) {
                                var i = a[t % a.length];
                                if (!i.offline) return i.multiplayerId === n.publicId
                            }
                            return !1
                        }
                    },
                    t = this.players,
                    i = Array.isArray(t),
                    o = 0;
                for (t = i ? t : t[Symbol.iterator]();;) {
                    var s;
                    if ("break" === e()) break
                }
            }, t.on = function(e, t) {
                this.handlers[e] || (this.handlers[e] = []), this.handlers[e].push(t)
            }, t.fireEvent = function(e, t) {
                if (this.handlers[e]) {
                    var i = this.handlers[e],
                        r = Array.isArray(i),
                        n = 0;
                    for (i = r ? i : i[Symbol.iterator]();;) {
                        var a;
                        if (r) {
                            if (n >= i.length) break;
                            a = i[n++]
                        } else {
                            if ((n = i.next()).done) break;
                            a = n.value
                        }
                        a({
                            type: e,
                            data: t
                        })
                    }
                }
            }, t.beforeUnloadWindow = function() {
                if (!this.gameFinished && f.siteSettings.multiplayerGameInProgress && 1 < this.onlinePlayerCount()) {
                    o.debug("Abandoning game that still has active players, setting rating to rating - 3"), f.siteSettings.set("multiplayerGameInProgress", !1);
                    var e = Math.max(0, f.siteSettings.playerRating - 3);
                    f.siteSettings.set("playerRating", e)
                }
                this.gameFinished || 2 !== this.table.playerCount.maxPlayers || this.sendMove({
                    type: "forcequit",
                    reason: "abandon",
                    playerId: this.players[0].multiplayerId
                })
            }, t.visibilityChange = function() {
                this.gameFinished || (this.visibilityLog || (this.visibilityLog = ""), "visible" === document.visibilityState ? this.socket.connected ? (this.socket.emit("visible"), this.hidden = !1, this.visibilityLog += "\nvisible " + (new Date).toLocaleTimeString()) : this.visibilityLog += "\nvisible-not-connected " + (new Date).toLocaleTimeString() : "hidden" === document.visibilityState && (this.socket.connected ? (this.socket.emit("hidden"), this.hidden = !0, this.visibilityLog += "\nhidden " + (new Date).toLocaleTimeString()) : this.visibilityLog += "\nhidden-not-connected " + (new Date).toLocaleTimeString()))
            }, t.connect = function() {
                var i = this,
                    e = this.slug,
                    t = f.siteSettings.players.bottom.code,
                    r = f.siteSettings.playerName;
                if (!t || !r) throw new Error("No face or name, no connection can be made");
                var n = "https://" + this.table.hostname + "/lobby";
                n += "?face=" + t + "&name=" + r + "&publicId=" + this.publicId + "&privateId=" + this.privateId + "&clientversion=" + siteVersion + "&game=" + e + "&tableId=" + this.table.id + "&round=" + this.table.round, o.debug("Connecting to " + n);
                this.socket = io(n, {
                    reconnection: !0,
                    reconnectAttempts: 10
                });

                function a(e, t) {
                    return i.socket.on(e, t.bind(i))
                }
                a("connect", this.onConnect), a("disconnect", this.onDisconnect), a("player-online", this.onPlayerOnline), a("player-offline", this.onPlayerOffline), a("table-state", this.onTableState), a("players-ready", this.onPlayersReady), a("move", this.onMove), a("next-table", this.onNextTable), a("speak", this.onSpeak), a("table-not-found", this.onTableNotFound), a("get-out", this.onGetOut), a("sync-moves", this.onSyncMoves), a("migrate", this.onMigrate), a("rematch", this.onRematch), a("turn-off-timer", this.onTurnOffTimer), a("check-visible", this.onCheckVisible), a("start-game", this.onStartGame), a("custom-message", this.onCustomMessage), $(".exit-multiplayer-game").on("click", function() {
                    return location.href = location.pathname
                }), this.speechHandler.enable()
            }, t.sendPhrase = function(e) {
                this._phraseTrack || (this._phraseTrack = []);
                try {
                    this._phraseTrack.push({
                        time: (new Date).getTime(),
                        id: e,
                        toString: function() {
                            return this.id + ":" + new Date(this.time).toISOString().substr(11)
                        }
                    })
                } catch (e) {}
                var t = (new Date).getTime();
                6 <= this._phraseTrack.length && t - this._phraseTrack[this._phraseTrack.length - 6].time < 1e3 && (f.forceTrackEvent("HackerMoron", "Sending phrases " + this._phraseTrack + " too quickly. Name: " + this.players[0].name + ", id: " + this.players[0].id), this._phraseTrack = []), this.checkMandalorianEasterEgg(e), this.socket.emit("speak", e)
            }, t.checkMandalorianEasterEgg = function(e) {
                var i = this;
                "this-is-the-way" === e && (f.siteSettings.set("mandalorian", f.siteSettings.mandalorian + 1), 3 === f.siteSettings.mandalorian && ($(".m-name").text("Mandalorian"), this.showDialog("#mandalorian"), $("#mandalorian-no").on("click", function() {
                    f.trackEvent("Mandalorian", "No", 0, "", "", 1), i.hideDialog("#mandalorian")
                }), $("#mandalorian-yes").on("click", function() {
                    f.trackEvent("Mandalorian", "Yes", 0, "", "", 1);
                    var e = f.siteSettings.players;
                    e.bottom.code = "19", e.bottom.face = "/shared/images/svg/face-19.svg", e.bottom.faceSad = e.bottom.face, e.bottom.type = "classic", f.siteSettings.set("players", e);
                    var t = ".face-bottom-player, .face-bottom-player.sad { background-image:url(" + e.bottom.face + ");}";
                    $("<style/>").text(t).appendTo("head"), i.hideDialog("#mandalorian")
                })))
            }, t.showDialog = function(e) {
                $("#cover").fadeIn(), $(e).show()
            }, t.setupConcedeHandler = function() {
                var e = this;
                $("#concede").on("click", function() {
                    e.showDialog("#concede-dialog")
                }), $("#concede-dialog button").on("click", function() {
                    e.hideDialog("#concede-dialog")
                }), $("#concede-confirm").on("click", function() {
                    e.fireEvent("forcequit", {
                        player: e.players[0],
                        reason: "concede"
                    }), e.sendMove({
                        type: "forcequit",
                        reason: "concede",
                        playerId: e.players[0].multiplayerId
                    })
                })
            }, t.onCheckVisible = function() {
                this.socket.emit("confirm-visible", "visible" === document.visibilityState)
            }, t.setupRematchHandler = function() {
                var e = this;
                $("#rematch-yes").on("click", function() {
                    e.socket.emit("rematch", !0), 2 === e.table.players.length ? $("#rematch-text").text("Waiting for response from your opponent...") : $("#rematch-text").text("Waiting for response from others..."), $("#rematch-yes, #rematch-no").attr("disabled", "disabled")
                }), $("#rematch-no, #rematch-cancel").on("click", function() {
                    e.socket.emit("rematch", !1), $("#rematch").remove(), $("#suggest-rematch, .suggest-rematch").remove()
                }), $("#rematch-fail").on("click", function() {
                    $("#rematch").remove(), $("#suggest-rematch, .suggest-rematch").attr("disabled", "disabled")
                }), $("#suggest-rematch, .suggest-rematch").on("click", function() {
                    return e.suggestRematch()
                })
            }, t.setupTurnOffTimerHandler = function() {
                var e = this;
                if (this.table.noTimer) {
                    $("#ask-to-turn-off-timer").attr("disabled", "disabled"), o.debug("Timer already turned off for table in previous rounds!");
                    var t = this.players,
                        i = Array.isArray(t),
                        r = 0;
                    for (t = i ? t : t[Symbol.iterator]();;) {
                        var n;
                        if (i) {
                            if (r >= t.length) break;
                            n = t[r++]
                        } else {
                            if ((r = t.next()).done) break;
                            n = r.value
                        }
                        var a = n;
                        a.timer && a.timer.disable && (a.timer.disable(), o.debug("Turned off timer for " + a.name)), a._noTimer = !0
                    }
                } else !1 === this.table.noTimer && ($("#ask-to-turn-off-timer").attr("disabled", "disabled"), o.debug("Already asked for timer off on this table!")), $("#turn-off-timer-yes").on("click", function() {
                    e.socket.emit("turn-off-timer", !0), 2 === e.table.players.length ? $("#turn-off-timer-text").text("Waiting for response from your opponent...") : $("#turn-off-timer-text").text("Waiting for response from others..."), $("#turn-off-timer-yes, #turn-off-timer-no").attr("disabled", "disabled")
                }), $("#turn-off-timer-no").on("click", function() {
                    e.socket.emit("turn-off-timer", !1)
                }), $("#turn-off-timer-ok").on("click", function() {
                    $("#ask-to-turn-off-timer").attr("disabled", "disabled"), e.hideDialog("#turn-off-timer")
                }), void 0 === this.table.noTimer && $("#ask-to-turn-off-timer").on("click", function() {
                    e.socket.emit("turn-off-timer", !0), $("#phrases").fadeOut(200)
                })
            }, t.hideDialog = function(e) {
                $("#cover").fadeOut(), $(e).hide()
            }, t.onConnect = function() {
                if (this.visibilityChange(), o.debug("Socket connected!"), this.hideDialog("#reconnecting"), this.updatePhrases(), 1 < this.receivedMoves.length) {
                    var e = this.receivedMoves[this.receivedMoves.length - 1];
                    this.socket.emit("sync-moves", e.nr)
                }
            }, t.onRematch = function(t, e, i) {
                var r = this,
                    n = $("#rematch"),
                    a = this.players.find(function(e) {
                        return e.multiplayerId === t
                    });
                if (console.log("onRematch: " + i), this.gameFinished) {
                    if (i && f.forceTrackEvent("RematchActiveGame", t + " - " + a + ", delayed rematch worked!"), !n.is(":visible")) {
                        var o = this.players,
                            s = Array.isArray(o),
                            l = 0;
                        for (o = s ? o : o[Symbol.iterator]();;) {
                            var c;
                            if (s) {
                                if (l >= o.length) break;
                                c = o[l++]
                            } else {
                                if ((l = o.next()).done) break;
                                c = l.value
                            }
                            var h = c,
                                u = $("<div/>").addClass("rematch-face face-" + h.id);
                            $("#rematch-faces").append(u)
                        }
                        n.show()
                    }
                    a.rematch = e, this.players.every(function(e) {
                        return e.rematch
                    }) && ($("#rematch-text").text("The rematch is on! Setting up your game table..."), $("#rematch-yes, #rematch-no").attr("disabled", "disabled")), e ? $("#rematch-faces .face-" + a.id).addClass("rematch-yes") : ($("#rematch-faces .face-" + a.id).addClass("rematch-no").addClass("sad"), 2 === this.table.players.length ? $("#rematch-text").text("Sorry, your opponent didn't want a rematch.") : $("#rematch-text").text("Sorry, not everyone wanted a rematch."), $("#rematch-yes, #rematch-no, #rematch-cancel").hide(), $("#rematch-fail").show(), $("#suggest-rematch").remove())
                } else if (i) f.forceTrackEvent("RematchActiveGame", t + " - " + a + ". Was retry, stopping");
                else {
                    f.forceTrackEvent("RematchActiveGame", t + " - " + a + ". Trying again in 5 seconds.");
                    setTimeout(function() {
                        return r.onRematch(t, e, !0)
                    }, 5e3)
                }
            }, t.onTurnOffTimer = function(t, e) {
                var i = this;
                $("#ask-to-turn-off-timer").attr("disabled", "disabled").off("click");
                var r = $("#turn-off-timer"),
                    n = this.players.find(function(e) {
                        return e.multiplayerId === t
                    });
                if (!r.is(":visible") && !this.hasShownTimerDialog) {
                    var a = this.players,
                        o = Array.isArray(a),
                        s = 0;
                    for (a = o ? a : a[Symbol.iterator]();;) {
                        var l;
                        if (o) {
                            if (s >= a.length) break;
                            l = a[s++]
                        } else {
                            if ((s = a.next()).done) break;
                            l = s.value
                        }
                        var c = l,
                            h = $("<div/>").addClass("turn-off-timer-face face-" + c.id);
                        $("#turn-off-timer-faces").append(h)
                    }
                    t === this.publicId ? (2 === this.players.length ? $("#turn-off-timer-text").text("You have asked for the timer to be turned off. Waiting for your opponent to respond...") : $("#turn-off-timer-text").text("You have asked for the timer to be turned off. Waiting for the other players to respond..."), $("#turn-off-timer-yes, #turn-off-timer-no").hide(), $("#turn-off-timer-ok").attr("disabled", "disabled").show()) : $("#turn-off-timer-text").text(n.name + " is asking whether you would like to turn the timer off, so you can take as long as you want to play. Do you want to turn it off?"), this.showDialog("#turn-off-timer"), setTimeout(function() {
                        return i.hideDialog("#turn-off-timer")
                    }, 25e3), this.hasShownTimerDialog = !0, $("#turn-off-timer-text").height($("#turn-off-timer-text").height())
                }
                if (n.turnOffTimer = e, this.players.every(function(e) {
                        return e.turnOffTimer
                    })) {
                    $("#turn-off-timer h2").text("The timer is off!"), $("#turn-off-timer-text").text("The timer has been turned off! Now enjoy your very slow game!"), $("#turn-off-timer-yes, #turn-off-timer-no").hide(), $("#turn-off-timer-ok").show().removeAttr("disabled"), setTimeout(function() {
                        return i.hideDialog("#turn-off-timer")
                    }, 5e3);
                    var u = this.players,
                        f = Array.isArray(u),
                        d = 0;
                    for (u = f ? u : u[Symbol.iterator]();;) {
                        var m;
                        if (f) {
                            if (d >= u.length) break;
                            m = u[d++]
                        } else {
                            if ((d = u.next()).done) break;
                            m = d.value
                        }
                        var g = m;
                        g.timer && g.timer.disable && g.timer.disable(), g._noTimer = !0
                    }
                }
                e ? $("#turn-off-timer-faces .face-" + n.id).addClass("turn-off-timer-yes") : ($("#turn-off-timer h2").text("The timer will remain on!"), $("#turn-off-timer-faces .face-" + n.id).addClass("turn-off-timer-no").addClass("sad"), 2 === this.table.players.length ? t === this.publicId ? ($("#turn-off-timer-text").text("You didn't want to turn off the timer, it will remain on!"), $("#turn-off-timer").hide()) : $("#turn-off-timer-text").text("Sorry, your opponent didn't want to turn off the timer, it will remain on!") : t === this.publicId ? $("#turn-off-timer-text").text("You didn't want to turn off the timer, it will remain on!") : $("#turn-off-timer-text").text("Sorry, not everyone wanted to turn off the timer, it will remain on!"), $("#turn-off-timer-yes, #turn-off-timer-no").hide(), $("#turn-off-timer-ok").show().removeAttr("disabled"), setTimeout(function() {
                    return i.hideDialog("#turn-off-timer")
                }, 5e3))
            }, t.updatePhrases = function() {
                function i(e) {
                    $("#phrases-list, #emoji-list").html("");
                    var t = e.text,
                        i = Array.isArray(t),
                        r = 0;
                    for (t = i ? t : t[Symbol.iterator]();;) {
                        var n;
                        if (i) {
                            if (r >= t.length) break;
                            n = t[r++]
                        } else {
                            if ((r = t.next()).done) break;
                            n = r.value
                        }
                        var a = n;
                        $("<div/>", {
                            id: a.id
                        }).addClass("speak-bubble").text(a.text).appendTo("#phrases-list")
                    }
                    var o = e.emoji,
                        s = Array.isArray(o),
                        l = 0;
                    for (o = s ? o : o[Symbol.iterator]();;) {
                        var c;
                        if (s) {
                            if (l >= o.length) break;
                            c = o[l++]
                        } else {
                            if ((l = o.next()).done) break;
                            c = l.value
                        }
                        var h = c;
                        $("<div/>", {
                            id: h.id
                        }).addClass("emoji-speak").text(h.text).appendTo("#emoji-list")
                    }
                }
                $.get("https://cardgames.io/api/multiplayergames/phrases/").done(function(e) {
                    i(e), o.debug("Loading phrases from internet..."), f.siteSettings.set("multiplayerPhrases", e)
                }).fail(function(e) {
                    o.debug("Failed to load phrases: " + JSON.stringify(e)), f.trackEvent("PhrasesError", "Status: " + e.status + ", statusText: " + e.statusText, 0, "", "", 1);
                    var t = f.siteSettings.multiplayerPhrases;
                    t.emoji && (o.debug("Loading last good phrases"), i(t))
                })
            }, t.onStartGame = function(e) {
                this.tempStorage.remove("joinedtable"), r(e, this.publicId), this.tempStorage.set(e.id, e), location.href = "/" + this.slug + "/?gid=" + e.id
            }, t.suggestRematch = function() {
                this.gameFinished && (this.socket.emit("rematch", !0), $("#rematch-text").text("You suggested a rematch, waiting for response..."), $("#rematch-yes, #rematch-no").hide(), $("#rematch-cancel").show())
            }, t.reconnectStep = function() {
                var e = this,
                    t = 10 - Math.round(((new Date).getTime() - this.disconnectTime) / 1e3);
                this.socket.connected ? (this.hideDialog("#reconnecting"), delete this.disconnectTime) : t < 0 ? (this.socket.disconnect(), $("#reconnecting").hide(), $("#reconnecting-failed").show(), this.tempStorage.remove(f.qs.gid)) : ($("#reconnecting p span").text(t), setTimeout(function() {
                    return e.reconnectStep()
                }, 1e3))
            }, t.onGetOut = function() {
                if (!this.gameFinished && 2 !== this.table.playerCount.maxPlayers) {
                    if ("1" == f.cake("nodisconnect")) return this.socket.emit("visible"), void f.trackEvent("VISIBILITYERROR", "VLOG: " + this.visibilityLog, 0, "", "", 1);
                    $(".multiplayer-dialog").hide(), $("#cover").fadeIn(), $("#get-out").show(), this.socket.disconnect(), this.tempStorage.remove("scores"), f.deleteCake("results")
                }
            }, t.onDisconnect = function(e) {
                var t = this;
                o.debug("Socket disconnected. Reason: " + e), this.gameFinished || "io client disconnect" !== e && (this.disconnectTime = (new Date).getTime(), setTimeout(function() {
                    return t.reconnectStep()
                }), this.showDialog("#reconnecting"))
            }, t.onSyncMoves = function(e) {
                var t = this.sentMoves,
                    i = Array.isArray(t),
                    r = 0;
                for (t = i ? t : t[Symbol.iterator]();;) {
                    var n;
                    if (i) {
                        if (r >= t.length) break;
                        n = t[r++]
                    } else {
                        if ((r = t.next()).done) break;
                        n = r.value
                    }
                    var a = n;
                    a.nr > e && this.socket.emit("move", a)
                }
            }, t.onPlayersReady = function(e) {
                var t = this.players,
                    i = Array.isArray(t),
                    r = 0;
                for (t = i ? t : t[Symbol.iterator]();;) {
                    var n;
                    if (i) {
                        if (r >= t.length) break;
                        n = t[r++]
                    } else {
                        if ((r = t.next()).done) break;
                        n = r.value
                    }
                    var a = n;
                    e.includes(a.multiplayerId) && (a.offline = (new Date).getTime() - 2e4, a.bot ? $(".p-" + a.multiplayerId).removeClass("offline") : $(".p-" + a.multiplayerId).addClass("offline"))
                }
                this.gameStartTime = (new Date).getTime(), o.debug("Players ready"), this.table.isPrivate || (o.debug("Players ready, setting multiplayerGameInProgress to true"), f.siteSettings.set("multiplayerGameInProgress", !0)), this.fireEvent("players-ready")
            }, t.onTableNotFound = function() {
                this.gameFinished || this.showDialog("#table-not-found")
            }, t.onMigrate = function(e) {
                this.table.hostname = e, this.socket.off("disconnect"), this.socket.disconnect(), this.connect()
            }, t.onlinePlayerCount = function() {
                return this.players.filter(function(e) {
                    return !e.offline
                }).length
            }, t.onPlayerOnline = function(t) {
                delete this.players.find(function(e) {
                    return e.multiplayerId === t
                }).offline, o.debug("Player online: " + t), $(".p-" + t).removeClass("offline"), 1 < this.onlinePlayerCount() && !this.gameFinished && !this.table.isPrivate && (o.debug("More than us online, setting multiplayerGameInProgress to true"), f.siteSettings.set("multiplayerGameInProgress", !0))
            }, t.onPlayerOffline = function(t) {
                o.debug("Player offline: " + t);
                var e = this.players.find(function(e) {
                    return e.multiplayerId === t
                });
                e && (e.offline = (new Date).getTime(), $("#suggest-rematch").is(":visible") && !e.rematch && $("#suggest-rematch").attr("disabled", "disabled"), $("#rematch").is(":visible") && !e.rematch && this.onRematch(t, !1)), $(".p-" + t).addClass("offline"), 1 !== this.onlinePlayerCount() || this.gameFinished || (o.debug("Only us left, removing multiplayerGameInProgress"), f.siteSettings.set("multiplayerGameInProgress", !1))
            }, t.onTableState = function(e) {
                var i = this;
                $("#top-player .face-small, #left-player .face-small, #right-player .face-small").addClass("offline");
                var t = this.players.filter(function(e) {
                        return "bottom-player" !== e.id
                    }),
                    r = Array.isArray(t),
                    n = 0;
                for (t = r ? t : t[Symbol.iterator]();;) {
                    var a;
                    if (r) {
                        if (n >= t.length) break;
                        a = t[n++]
                    } else {
                        if ((n = t.next()).done) break;
                        a = n.value
                    }
                    a.offline = (new Date).getTime()
                }
                var o = function() {
                        if (l) {
                            if (c >= s.length) return "break";
                            h = s[c++]
                        } else {
                            if ((c = s.next()).done) return "break";
                            h = c.value
                        }
                        var t = h;
                        $(".p-" + t).removeClass("offline"), delete i.players.find(function(e) {
                            return e.multiplayerId === t
                        }).offline
                    },
                    s = e.onlinePlayers,
                    l = Array.isArray(s),
                    c = 0;
                for (s = l ? s : s[Symbol.iterator]();;) {
                    var h;
                    if ("break" === o()) break
                }
            }, t.onMove = function(t) {
                if (!this.gameFinished) {
                    try {
                        if (localStorage.dropmoves && Math.random() <= .2) return void o.debug("Dropping move " + t.nr)
                    } catch (e) {}
                    var e = this.receivedMoves[this.receivedMoves.length - 1];
                    if (t.nr <= e.nr) t.resend ? o.debug("Got resent move " + t.nr + " that I didn't need") : f.trackEvent("OldMove", "Got move " + t.nr + ", last move nr was " + e.nr);
                    else {
                        if (t.nr > e.nr + 1) return f.trackEvent("FutureMove", "Got move " + t.nr + ", last move nr was " + e.nr), void this.socket.emit("sync-moves", e.nr);
                        this.receivedMoves.push(t);
                        var i = this.players.find(function(e) {
                            return e.multiplayerId === t.playerId
                        });
                        if (i) {
                            var r = i.multiplayerId === f.siteSettings.multiplayerPublicId && !t.substitute,
                                n = t.substitutePlayerId === f.siteSettings.multiplayerPublicId;
                            r ? o.debug("Not putting our own move in the queue") : n ? o.debug("Not putting our own subsitute move in the queue") : "forcequit" === t.type ? (f.siteSettings.set("multiplayerGameInProgress", !1), this.gameFinished || this.fireEvent("forcequit", {
                                player: i,
                                reason: t.reason
                            })) : i.multiplayerMoves.push(t)
                        } else f.trackEvent("MoveWithoutPlayer", "Move.playerId" + t.playerId + ", player ids: " + this.players.map(function(e) {
                            return e.multiplayerId
                        }).join(","), 0, "", "", 1)
                    }
                }
            }, t.onSpeak = function(e) {
                window.opponentTurn && "your-turn" === e.phraseId && e.playerId !== this.publicId && f.trackEvent("YourTurnBad", "Our publicId: " + this.publicId + ", receivedMoves: " + JSON.stringify(this.receivedMoves) + ", MOVEERR: " + window.moveError, 0, "", "", 1), this.speechHandler.receivePhrase(e.phraseId, e.playerId)
            }, t.onNextTable = function(e) {
                o.debug("Got the table for round " + e.round), r(e, this.publicId), this.tempStorage.set(e.id, e), this.fireEvent("next-table", e)
            }, t.sendMove = function(e) {
                e.nr = this.sentMoves[this.sentMoves.length - 1].nr + 1, this.sentMoves.push(e);
                try {
                    if (localStorage.dropmoves && Math.random() <= .2) return void o.debug("Dropping move " + e.nr)
                } catch (e) {}
                this.socket.emit("move", e)
            }, t.sendCustomMessage = function(e) {
                this.socket.emit("custom-message", e)
            }, t.onCustomMessage = function(e) {
                this.fireEvent("custom-message", e)
            }, t.sendResult = function(e, t) {
                void 0 === t && (t = !0);
                if (o.debug("Sending result: " + JSON.stringify(e)), this.socket.emit("result", e), this.gameFinished = !0, e.finished) {
                    this.tempStorage.remove(f.qs.gid);
                    try {
                        window.history.pushState("", document.title, location.pathname)
                    } catch (e) {}
                    this.players.every(function(e) {
                        return !e.offline || e.bot
                    }) && "abandon" !== e.endReason && $("#suggest-rematch").css("display", "inline-block");
                    var i = (new Date).getTime() - this.gameStartTime;
                    "abandon" === e.endReason || "concede" === e.endReason && i < 18e4 || (o.debug("Increasing rating by 1, endReason was " + e.endReason + ", elapsed time was " + i + "ms"), f.siteSettings.set("playerRating", Math.min(20, f.siteSettings.playerRating + 1)), f.siteSettings.set("multiplayerGameInProgress", !1))
                } else if (t) {
                    $("#start-new-game").text("Start next round");
                    var r = (new Date).getTime(),
                        n = setInterval(function() {
                            var e = (new Date).getTime() - r,
                                t = Math.round((2e4 - e) / 1e3);
                            $("#multiplayer-refresh-countdown span").text(t), t <= 10 && $("#multiplayer-refresh-countdown").show(), t <= 0 && (clearInterval(n), f.ads.trigger(f.reloadPage))
                        }, 1e3);
                    $(".multiplayer-start-next-round").on("click", function() {
                        clearInterval(n)
                    })
                }
            }, e
        }();
        t.exports = n
    }, {
        "../helper-functions": 19,
        "../temp-storage": 27,
        "../util": 28,
        "./multiplayer-util": 22,
        "./speech-handler": 25
    }],
    22: [function(e, t, i) {
        "use strict";
        var h = e("../util"),
            r = e("../helper-functions").captainsLog,
            o = setInterval,
            n = clearInterval;
        var a = function() {
            function e(e) {
                this.showMessage = e
            }
            var t = e.prototype;
            return t.disable = function() {
                try {
                    this.showMessage("Timer is turned off!")
                } catch (e) {
                    $("#message, #messageBox p").text("Timer is turned off!")
                }
                this.disabled = !0
            }, t.start = function(i, r, n) {
                var a = this;
                if (!this.disabled) {
                    this.waitStart = (new Date).getTime(), n = n || "Can't leave the other players waiting too long! We will play a random card for you in $REMAINING$ seconds...", this.stop(), this.timeoutId = o(function() {
                        if (a.disabled) a.stop();
                        else {
                            $("#turn-off-timer").is(":visible") && (a.waitStart += 1e3);
                            var e = Math.round(((new Date).getTime() - a.waitStart) / 1e3),
                                t = i - e;
                            t <= 10 && (a.showMessage(n.replace("$REMAINING$", Math.max(0, t))), t <= -1 && (r(), a.stop()))
                        }
                    }, 1e3)
                }
            }, t.isActive = function() {
                return !!this.timeoutId
            }, t.stop = function() {
                this.timeoutId && (n(this.timeoutId), delete this.timeoutId)
            }, e
        }();
        t.exports = {
            normalizeTable: function(e, t) {
                for (var i = 0; e.players[0].id !== t;) {
                    var r = e.players.pop();
                    if (e.players.unshift(r), 5 < ++i) throw new Error("Human player with id " + t + " not found!")
                }
                e.players[0].pos = "bottom";
                var n = e.players.length;
                2 === n ? e.players[1].pos = "top" : 3 === n ? (e.players[1].pos = "left", e.players[2].pos = "top") : 4 === n && (e.players[1].pos = "left", e.players[2].pos = "top", e.players[3].pos = "right"), e.facedata = {};
                var a = e.players,
                    o = Array.isArray(a),
                    s = 0;
                for (a = o ? a : a[Symbol.iterator]();;) {
                    var l;
                    if (o) {
                        if (s >= a.length) break;
                        l = a[s++]
                    } else {
                        if ((s = a.next()).done) break;
                        l = s.value
                    }
                    var c = l;
                    e.facedata[c.pos] = {
                        name: c.name,
                        face: h.getFaceUrl(c.face),
                        faceSad: h.getFaceUrl(c.face, !0),
                        code: c.face,
                        type: "custom"
                    }
                }
            },
            AutoPlayTimer: a,
            randomId: function() {
                var e = "abcdefghijklmnopqrstuvwxyz";
                e += e.toUpperCase();
                for (var t = "", i = 0; i < 14; i++) t += e.charAt(Math.floor(Math.random() * e.length));
                return t + (new Date).getMilliseconds()
            },
            setupMultiplayerLogging: function() {
                if ("dev.cardgames.io" === location.hostname || h.qs.debug || 1 == h.qs.debug) {
                    try {
                        localStorage.debug = "socket.io-client:socket"
                    } catch (e) {}
                    r.level = "debug"
                }
            }
        }
    }, {
        "../helper-functions": 19,
        "../util": 28
    }],
    23: [function(e, t, i) {
        "use strict";
        var o = e("../util"),
            s = e("./names");
        t.exports = function(t, r) {
            function n(e) {
                return e.replace(/^\s*|\s*$/g, "")
            }

            function e(i, r) {
                $(i).on("input", function(e) {
                    var t = n($(i).val());
                    s.validateName(t).isValid ? $(r).removeAttr("disabled") : $(r).attr("disabled", "disabled")
                })
            }

            function a(e) {
                o.siteSettings.set("playerName", e);
                var t = o.siteSettings.players;
                t.bottom.name = e, o.siteSettings.set("players", t), $(".bottom-player-name").text(e)
            }
            e("#name-new", "#confirm-name-new"), e("#name-change", "#confirm-name-change"), $("#confirm-name-new").on("click", function(e) {
                $("#enter-name").hide(), a(n($("#name-new").val())), t()
            }), $("#confirm-name-change").on("click", function(e) {
                $("#challenge-yourself").hide(), $("#multiplayer-challenge-lobby").show();
                var t = o.siteSettings.playerName,
                    i = n($("#name-change").val());
                a(i), r({
                    oldName: t,
                    newName: i
                })
            }), $("#cancel-name-new").on("click", function(e) {
                $("#cover").fadeOut(), $("#enter-name").hide()
            })
        }
    }, {
        "../util": 28,
        "./names": 24
    }],
    24: [function(e, t, i) {
        "use strict";
        i.validateName = function(e) {
            for (var t = new RegExp("[a-zA-Z-Ã€-Ã¿-'\\s]"), i = new RegExp("^([a-zA-Z-Ã€-Ã¿-']+\\s?[a-zA-Z-Ã€-Ã¿-']+$)"), r = 0; r < e.length; r++)
                if (!t.test(e[r])) return {
                    isValid: !1,
                    "reason": " contains invalid characters"
                };
            return 12 < e.length ? {
                isValid: !1,
                "reason": "'s too long"
            } : e.length < 2 ? {
                isValid: !1,
                "reason": "'s too short"
            } : i.test(e) ? e.toLowerCase().includes("fuck") ? {
                isValid: !1,
                "reason": " contains a bad word"
            } : {
                isValid: !0,
                "reason": ""
            } : {
                isValid: !1,
                "reason": " contains too many spaces"
            }
        }
    }, {}],
    25: [function(e, t, i) {
        "use strict";
        var o = e("../util"),
            r = function() {
                function e(e) {
                    var t = this;
                    this.send = e, $("#speak").on("click", function(e) {
                        return t.show(e)
                    }), $("#phrases-list").on("click touchstart", ".speak-bubble", function(e) {
                        return t.speak(e)
                    }), $("#emoji-list").on("click touchstart", ".emoji-speak", function(e) {
                        return t.speak(e)
                    }), $("#cancel-speak").on("click", function(e) {
                        return t.hide(e)
                    })
                }
                var t = e.prototype;
                return t.speak = function(e) {
                    console.log(e.type), e.preventDefault(), $("#phrases").fadeOut(), this.showBubble(e.target.id, o.siteSettings.multiplayerPublicId), this.send(e.target.id)
                }, t.showBubble = function(e, t) {
                    var i, r, n = $(".p-" + t).parent().find(".bubble"),
                        a = $(".p-" + t);
                    r = e.includes("emoji-") ? (i = $("#emoji-list #" + e).text(), "multiplayer-bubble-emoji") : (i = $("#phrases-list #" + e).text(), "multiplayer-bubble-text"), i ? "disabled" !== $("#speak").attr("disabled") ? (n.show(), i.includes(":(") && a.addClass("sad"), n.find("p span").html($("<span/>").addClass(r).text(i)), n.find("div").hide(), n.find("img").hide(), setTimeout(function() {
                        n.fadeOut(), a.removeClass("sad")
                    }, 3500)) : o.trackEvent("PhraseWhenSilent", "", 0, "", "", 1) : o.trackEvent("BadPhrase", e)
                }, t.receivePhrase = function(e, t) {
                    this.showBubble(e, t)
                }, t.show = function() {
                    $("#phrases").show()
                }, t.hide = function() {
                    $("#phrases").hide()
                }, t.disable = function() {
                    $("#speak").attr("disabled", "disabled"), this.hide()
                }, t.enable = function() {
                    $("#speak").removeAttr("disabled")
                }, e
            }();
        t.exports = r
    }, {
        "../util": 28
    }],
    26: [function(e, t, i) {
        "use strict";
        var r, n = e("./util"),
            a = n.logError,
            o = n.qs,
            s = e("../shared/helper-functions").captainsLog,
            u = !!o.gid;
        try {
            r = window.localStorage
        } catch (e) {
            r = null
        }
        var f = null,
            d = null;
        var l = (window.slug || "unknown") + ".stats";

        function c() {
            var e = r.getItem(l);
            if (e) {
                var t = JSON.parse(e);
                if (t && t.players && t.startTime) return t;
                r.removeItem(l);
                try {
                    a("Stats for " + l + " was malformed, removed it. First 50 chars of the data were: " + (e + "").substr(0, 50))
                } catch (e) {}
            }
            var i = {
                version: 4,
                startTime: (new Date).getTime(),
                gameCount: 0,
                abandonedGameCount: 0,
                finishedGameCount: 0,
                playersInGameCount: {},
                totalGameTime: 0,
                averageGameTime: null,
                maxGameTime: null,
                minGameTime: null,
                players: {}
            };
            return h(i), i
        }

        function h(e) {
            try {
                r.setItem(l, JSON.stringify(e))
            } catch (e) {
                s.error("localStorage is full")
            }
        }

        function m(e) {
            var t = c();
            e(t), h(t)
        }

        function g(e) {
            var t = {
                gameCount: 0,
                abandonedGameCount: 0,
                finishedGameCount: 0,
                winCount: 0,
                loseCount: 0,
                drawCount: 0,
                winPercentage: 0,
                totalGameTime: 0
            };
            return (e = e || {
                score: !0,
                tournaments: !0,
                streaks: !0,
                wonGameTime: !0
            }).wonGameTime && (t.minWonGameTime = null, t.maxWonGameTime = null, t.avgWonGameTime = null, t.totalWonGameTime = 0), e.score && (t.totalScore = 0, t.maxScore = null, t.minScore = null, t.avgScore = null), e.streaks && (t.winningStreak = 0, t.losingStreak = 0, t.maxWinningStreak = 0, t.maxLosingStreak = 0), e.tournaments && (t.finishedTournamentCount = 0, t.winTournamentCount = 0, t.loseTournamentCount = 0, t.totalTournamentScore = 0, t.avgTournamentScore = 0, t.tournamentWinPercentage = 0, t.tournamentWinningStreak = 0, t.tournamentLosingStreak = 0, t.tournamentMaxWinningStreak = 0, t.tournamentMaxLosingStreak = 0), t
        }
        var p = {
            get: c,
            enabled: !0,
            multiplayer: !1,
            clear: function() {
                this.enabled && r.removeItem(l)
            },
            emptyPlayer: g,
            minimumVersion: function(e) {
                if (this.enabled) {
                    var t = this.get();
                    t && t.version < e && this.clear()
                }
            },
            startGame: function(a, o) {
                this.enabled && (this.options = o || {
                    tournaments: !0,
                    streaks: !0,
                    score: !0,
                    wonGameTime: !0
                }, this.currentPlayers = a, f = (new Date).getTime(), d = null, m(function(e) {
                    e.playersInGameCount[a.length] = (e.playersInGameCount[a.length] || 0) + 1, e.gameCount++, e.abandonedGameCount++;
                    for (var t = 0; t < a.length; t++) {
                        var i = a[t];
                        if (!i.id) throw new Error("Missing id on player in statistics!");
                        var r = i.id;
                        if (u) {
                            if ("bottom-player" !== r) continue;
                            r = "multi-player"
                        }
                        e.players[r] || (e.players[r] = g(o));
                        var n = e.players[r];
                        n.gameCount++, n.abandonedGameCount++
                    }
                }))
            },
            cancelGame: function() {
                if (this.enabled && this.currentPlayers) {
                    var n = this.currentPlayers;
                    d = f = null;
                    var a = this.options;
                    m(function(e) {
                        e.playersInGameCount[n.length] = (e.playersInGameCount[n.length] || 0) - 1, e.gameCount--, e.abandonedGameCount--;
                        for (var t = 0; t < n.length; t++) {
                            var i = n[t];
                            if ("multi-player" !== i.id) {
                                e.players[i.id] || (e.players[i.id] = g(a));
                                var r = e.players[i.id];
                                r.gameCount--, r.abandonedGameCount--
                            }
                        }
                    })
                }
            },
            finishGame: function(s, l, e) {
                if (this.enabled) {
                    var c = [],
                        h = this.options;
                    if (m(function(e) {
                            l || (d = (new Date).getTime(), l = d - f, "number" == typeof pauseTime && (l -= pauseTime)), e.finishedGameCount++, e.abandonedGameCount = Math.max(e.abandonedGameCount - 1, 0), e.totalGameTime += l, e.averageGameTime = e.totalGameTime / e.finishedGameCount, e.maxGameTime = null === e.maxGameTime ? l : Math.max(l, e.maxGameTime), e.minGameTime = null === e.minGameTime ? l : Math.min(l, e.minGameTime);
                            for (var t = 0; t < s.length; t++) {
                                var i = s[t],
                                    r = i.id;
                                if (u) {
                                    if ("bottom-player" !== r) continue;
                                    r = "multi-player"
                                }
                                var n = e.players[r];
                                for (var a in n || (e.players[r] = g(h), (n = e.players[r]).abandonedGameCount++, n.gameCount++), i.stats = i.stats || {}, i.stats.score |= 0, n.abandonedGameCount = Math.max(n.abandonedGameCount - 1, 0), n.finishedGameCount++, n.totalScore += i.stats.score, n.minScore = null === n.minScore ? i.stats.score : Math.min(n.minScore, i.stats.score), n.maxScore = null === n.maxScore ? i.stats.score : Math.max(n.maxScore, i.stats.score), n.avgScore = n.totalScore / n.finishedGameCount, n.totalGameTime += l, "win" == i.stats.result ? (n.winCount++, n.winningStreak++, n.losingStreak = 0, n.maxWinningStreak = Math.max(n.maxWinningStreak, n.winningStreak), null === n.minWonGameTime ? n.minWonGameTime = l : l < n.minWonGameTime && (c.push({
                                        oldTime: n.minWonGameTime,
                                        newTime: l,
                                        name: i.name
                                    }), n.minWonGameTime = l), n.minWonGameTime = null === n.minWonGameTime ? l : Math.min(n.minWonGameTime, l), n.maxWonGameTime = null === n.maxWonGameTime ? l : Math.max(n.maxWonGameTime, l), n.totalWonGameTime += l, n.avgWonGameTime = n.totalWonGameTime / n.winCount) : "lose" == i.stats.result ? (n.loseCount++, n.winningStreak = 0, n.losingStreak++, n.maxLosingStreak = Math.max(n.maxLosingStreak, n.losingStreak)) : "draw" == i.stats.result && (n.drawCount++, n.winningStreak = 0, n.losingStreak = 0), n.winPercentage = n.winCount / n.finishedGameCount, i.stats.tournamentResult && (n.finishedTournamentCount++, n.totalTournamentScore += i.stats.tournamentScore, n.avgTournamentScore = n.totalTournamentScore / n.finishedTournamentCount, "win" == i.stats.tournamentResult ? (n.winTournamentCount++, n.tournamentWinningStreak++, n.tournamentLosingStreak = 0, n.tournamentMaxWinningStreak = Math.max(n.tournamentMaxWinningStreak, n.tournamentWinningStreak)) : "lose" == i.stats.tournamentResult && (n.loseTournamentCount++, n.tournamentLosingStreak++, n.tournamentWinningStreak = 0, n.tournamentMaxLosingStreak = Math.max(n.tournamentMaxLosingStreak, n.tournamentLosingStreak)), n.tournamentWinPercentage = n.winTournamentCount / n.finishedTournamentCount), i.stats)
                                    if (!a.match(/^(score|result|tournamentResult|tournamentScore)$/)) {
                                        var o = i.stats[a];
                                        "number" == typeof o && (a.match(/maximum/) ? (void 0 === n[a] || o > n[a]) && (n[a] = o) : a.match(/minimum/) ? (void 0 === n[a] || o < n[a]) && (n[a] = o) : (n[a] |= 0, n[a] += i.stats[a]))
                                    }
                            }
                        }), e)
                        for (var t = 0; t < c.length; t++) e(c[t])
                }
            },
            startMultiplayerChallengeGame: function(t) {
                m(function(e) {
                    e.activeMultiplayerGame = {
                        name: t.name,
                        face: t.face
                    }
                })
            },
            finishMultiplayerChallengeGame: function(r) {
                m(function(e) {
                    var t = r.find(function(e) {
                        return "bottom-player" !== e.id
                    });
                    e.multiplayer || (e.multiplayer = []);
                    var i = e.multiplayer.find(function(e) {
                        return e.name === t.name && e.face === t.face
                    });
                    i || (i = {
                        name: t.name,
                        face: t.face,
                        win: 0,
                        lose: 0,
                        draw: 0
                    }, e.multiplayer.push(i)), "win" === t.stats.result ? i.lose++ : "lose" === t.stats.result ? i.win++ : i.draw++, delete e.activeMultiplayerGame
                })
            },
            checkAbandonedMultiplayerGame: function() {
                this.registeredUnload || (this.registeredUnload = !0, window.addEventListener("beforeunload", function() {
                    p.checkAbandonedMultiplayerGame()
                }));
                var e = c();
                if (e.activeMultiplayerGame) {
                    var t = e.activeMultiplayerGame,
                        i = t.name,
                        r = t.face;
                    e.multiplayer || (e.multiplayer = []);
                    var n = e.multiplayer.find(function(e) {
                        return e.name === i && e.face === r
                    });
                    n ? n.lose++ : (n = {
                        name: i,
                        face: r,
                        win: 0,
                        lose: 1,
                        draw: 0
                    }, e.multiplayer.push(n)), delete e.activeMultiplayerGame, h(e)
                }
            },
            isGameActive: function() {
                return null !== f && null === d
            },
            saveRaw: function(e) {
                m(e)
            }
        };
        try {
            localStorage.setItem("test", "test"), localStorage.removeItem("test"), JSON.parse('{"test":"test"}'), JSON.stringify({
                "test": "test"
            }), p.supported = !0
        } catch (e) {
            p.supported = !1
        }
        if (!p.supported)
            for (var v in p) "supported" != v && (p[v] = function() {});
        t.exports = p
    }, {
        "../shared/helper-functions": 19,
        "./util": 28
    }],
    27: [function(e, t, i) {
        "use strict";
        var r = e("./util"),
            n = r.cake,
            a = r.deleteCake,
            o = function() {
                function e(e) {
                    this.slug = e, this.sessionStorageAvailable = !0;
                    try {
                        sessionStorage.test = 1, delete sessionStorage.test
                    } catch (e) {
                        this.sessionStorageAvailable = !1
                    }
                }
                var t = e.prototype;
                return t.useCookies = function(e) {
                    return ("undefined" == typeof window || !window.APP_MODE || !window.Android) && (!this.sessionStorageAvailable || "scores" === e || "autodeal" === e || "lastdealerindex" === e)
                }, t.set = function(e, t) {
                    this.useCookies(e) ? n(this.slug + "." + e, JSON.stringify(t)) : sessionStorage.setItem(this.slug + "." + e, JSON.stringify(t))
                }, t.get = function(e, t) {
                    var i;
                    return null !== (i = this.useCookies(e) ? n(this.slug + "." + e) : sessionStorage.getItem(this.slug + "." + e)) ? JSON.parse(i) : t
                }, t.remove = function(e) {
                    this.useCookies(e) ? a(this.slug + "." + e) : sessionStorage.removeItem(this.slug + "." + e)
                }, e
            }();
        t.exports = o
    }, {
        "./util": 28
    }],
    28: [function(e, t, i) {
        "use strict";
        var r = 730,
            f = window.setTimeout,
            n = e("./helper-functions"),
            d = n.captainsLog,
            a = n._setTimeout,
            m = e("./api"),
            s = e("./gamecontrol");

        function g() {
            return window.matchMedia ? matchMedia("(max-width: " + r + "px)").matches : $(window).width() <= r
        }
        "dev.cardgames.io" == document.location.hostname && (d.level = "debug"), window.console && window.console.log || (window.console = {
            log: function() {},
            debug: function() {},
            info: function() {},
            warn: function() {},
            error: function() {}
        });
        var p = "gdprconsent";

        function v(e, t, i, r) {
            if (void 0 === t) {
                if (document.cookie && navigator.cookieEnabled) {
                    for (var n = document.cookie.split(";"), a = {}, o = 0; o < n.length; o++) {
                        var s = n[o].replace(/^\s*|\s*$/g, "").split("=");
                        a[s[0]] = decodeURIComponent(s[1])
                    }
                    return a[e] || null
                }
                return y(e)
            }
            if (null === v(p) && e !== p && !APP_MODE) return y(e, t), void console.log("Consent has not been given to set cookies, using dough for " + e + "=" + t + " ...");
            navigator.cookieEnabled || (d.debug("Cookies are disabled in this browser, setting up temporary value " + e + "=" + t + " ..."), y(e, t));
            var l = e + "=" + encodeURIComponent(t);
            if (i) {
                var c = new Date;
                c.setTime(c.getTime() + 24 * i * 60 * 60 * 1e3), l += "; expires=" + c.toUTCString()
            }
            r && (l += "; path=" + r), b(e), document.cookie = l;
            try {
                var h = v(e);
                if (h != t) {
                    if (!t && !h) return;
                    if (!navigator.cookieEnabled) return;
                    var u = navigator.userAgent.match(/Firefox/);
                    k("CAKEFAIL", "Name=" + e + ", set " + t + ", got " + h + ", cookies=" + navigator.cookieEnabled + ", firefox=" + u + ", cookie=" + document.cookie, 0, "", "", 1)
                }
            } catch (e) {}
        }

        function y(e, t) {
            try {
                var i = {};
                try {
                    i = JSON.parse(window.name)
                } catch (e) {
                    i = {}
                }
                if ("object" == typeof i && null !== i || (i = {}), void 0 === t) return void 0 !== i[e] ? i[e] : null;
                i[e] = t, window.name = JSON.stringify(i)
            } catch (e) {
                try {
                    m.errors.log("DoughError", slug, e.message + " , window.name=" + window.name, null, null, 5)
                } catch (e) {}
                return null
            }
        }

        function b(e) {
            var t = e + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = t, document.cookie = t + " path=/";
            try {
                var i = JSON.parse(window.name);
                i && "object" == typeof i && void 0 !== i[e] && (delete i[e], window.name = JSON.stringify(i))
            } catch (e) {}
        }
        try {
            b("site.multiplayerPhrases")
        } catch (e) {}

        function k(e, t, i, r, n, a) {
            if ("FinishGame" == e && s.finishGame(), category = category || "", t = t || "", i = i || 0, r = r || "", n = n || "", "Error" === (e = e || "") && "" === r && "undefined" != typeof window && (r = window.siteVersion || ""), APP_MODE) {
                var o = navigator.userAgent || "";
                n = o.match(/iPhone/i) ? "APP-iPhone" : o.match(/iPad/i) ? "APP-iPad" : o.match(/android/i) ? "APP-Android" : "APP-Unknown - " + o
            }
            a = a || k.PROBABILITY, d.debug("TrackEvent: action=" + e + ", label=" + t + ", value=" + i + ", variable1=" + r + ", variable2=" + n + ", probability=" + a), APP_MODE && (a = 1), Math.random() <= a && m.events.post({
                category: category,
                action: e,
                label: t,
                value: i,
                variable1: r,
                variable2: n,
                probability: a
            })
        }

        function o(e, t, i, r, n) {
            k(e, t, i, r, n, 1)
        }(window.trackEvent = k).PROBABILITY = .01;
        var l, w, c = {},
            h = document,
            u = "loc",
            S = "hos",
            C = Math;

        function M(a, o) {
            this.meta = {
                prefix: a,
                defaults: o,
                listeners: {}
            }, a += ".";
            var s = this;
            try {
                this.meta.cookies = function() {
                    if (!document.cookie) return {};
                    for (var e = {}, t = function(e) {
                            return decodeURIComponent(e).replace(/^\s*|\s*$/g, "")
                        }, i = document.cookie.split(";"), r = 0; r < i.length; r++) {
                        var n = i[r].split("=");
                        e[t(n[0])] = t(n[1])
                    }
                    return e
                }()
            } catch (e) {
                alert("EXCEPTION WHEN PARSING COOKIES" + e)
            }

            function e(e) {
                for (var t in e)
                    if (t.substr(0, a.length) == a) {
                        var i = e[t],
                            r = t.substr(a.length),
                            n = o[r];
                        if (void 0 === n) continue;
                        if (void 0 !== n.defaultValue && (n = n.defaultValue), "number" == typeof n) s[r] = parseFloat(i);
                        else if ("boolean" == typeof n)
                            if ("true" == i) s[r] = !0;
                            else {
                                if ("false" != i) continue;
                                s[r] = !1
                            }
                        else s[r] = "object" == typeof n ? JSON.parse(i) : i
                    }
            }
            try {
                window.localStorage && e(localStorage)
            } catch (e) {}
            for (var t in e(this.meta.cookies), o) this.meta.listeners[t] = [], void 0 === this[t] && (o[t] && void 0 !== o[t].defaultValue ? this[t] = o[t].defaultValue : this[t] = o[t])
        }
        M.prototype.addListener = function(e, t) {
            this.meta.listeners[e] || (this.meta.listeners[e] = []), this.meta.listeners[e].push(t)
        }, M.prototype.set = function(n, a) {
            if (APP_MODE || null !== v(p)) {
                if (void 0 === this[n] || "function" == typeof this[n]) throw "Invalid key: " + n;
                if (typeof a != typeof this[n]) throw "Unexpected type for " + n + ", expected " + typeof this[n] + ", got " + typeof a;
                var e, t;
                if (this[n] = a, void 0 !== this.meta.defaults[n].defaultValue) {
                    var i = this.meta.defaults[n];
                    e = i.defaultValue, t = i.allowedValues, i.minValue, i.maxValue
                } else e = this.meta.defaults[n];
                var o = this.meta,
                    r = this.meta.prefix + "." + n;
                if (a == e) {
                    this.meta.cookies[r] && (document.cookie = escape(r) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/");
                    try {
                        localStorage.removeItem(r)
                    } catch (e) {}
                    c()
                } else {
                    if (t) {
                        for (var s = !1, l = 0; l < t.length; l++)
                            if (a == t[l]) {
                                s = !0;
                                break
                            } if (!s) throw "Bad value for " + n + ": " + a + ". Allowed values are: " + t
                    }
                    c();
                    try {
                        "object" == typeof a && (a = JSON.stringify(a)), localStorage.setItem(r, a)
                    } catch (e) {
                        document.cookie = escape(r) + "=" + escape(a) + "; expires=Tue, 19 Jan 2030 03:14:07 GMT; path=/"
                    }
                }
            } else console.log("GDPR consent has not been given, ignoring " + n + "=" + a);

            function c() {
                var e = o.listeners[n],
                    t = Array.isArray(e),
                    i = 0;
                for (e = t ? e : e[Symbol.iterator]();;) {
                    var r;
                    if (t) {
                        if (i >= e.length) break;
                        r = e[i++]
                    } else {
                        if ((i = e.next()).done) break;
                        r = i.value
                    }
                    r({
                        key: n,
                        value: a
                    })
                }
                "string" == typeof a || "number" == typeof a ? $('.option-row input[name="' + n + '"][value="' + a + '"]').prop("checked", !0) : "boolean" == typeof a && $('.option-row input[name="' + n + '"][type="checkbox"]').prop("checked", a)
            }
        };
        try {
            l = new M(slug, defaultSettings)
        } catch (e) {
            alert("ERROR when loading settings for " + slug + ", err: " + e)
        }
        try {
            w = new M("site", window.defaultSiteSettings || {})
        } catch (e) {
            alert("ERROR when loading site-settings for " + slug + ", err: " + e)
        }
        if (window.siteSettings = w, window.players) {
            for (var x in players) {
                players[x].name !== players[x].defaultName && $("." + x + "-player-name").text(players[x].name);
                var P = players[x].code + "",
                    A = P.match(/^\d+$/) ? P : P.charAt(2);
                $(".face-" + x + "-player.face-small").addClass("hair-" + A), $("#challenge-yourself .face-bottom-player").addClass("hair-" + A)
            }
            $("#temphidenames").remove()
        }
        $(".show-after-names").removeClass("show-after-names");
        var T = {};
        if (! function() {
                var e = document.location.search.replace(/\?/, "");
                if (e)
                    for (var t = e.split("&"), i = 0; i < t.length; i++) {
                        var r = t[i].split("="),
                            n = r[0],
                            a = r[1];
                        n = o(window.settings || {}, n), n = o(w, n), a = l(a), T[n] = a, s(window.settings || {}, n, a), s(w, n, a)
                    }

                function o(e, t) {
                    for (var i in e)
                        if (i.toLowerCase() == t.toLowerCase()) return i;
                    return t
                }

                function s(e, t, i) {
                    var r = e[t];
                    if (void 0 !== r)
                        if ("boolean" != typeof r || "number" != typeof i) {
                            if (typeof r != typeof i) throw "Incompatible types for " + t + ": " + typeof r + " and " + typeof i;
                            e[t] = i
                        } else e[t] = !!i
                }

                function l(e) {
                    if (void 0 === e) return !0;
                    if (e.match(/^\d+$/)) return parseInt(e);
                    if ("true" == e) return !0;
                    if ("false" == e) return !1;
                    if (e.match(/,/)) {
                        for (var t = (e = e.replace(/,$/, "")).split(","), i = 0; i < t.length; i++) t[i] = l(t[i]);
                        return t
                    }
                    return e
                }
            }(), "debug" === T.log && (d.level = "debug"), (location.hostname || "").match(/translat/) || T.translatecheck ? ($("#play-page").remove(), $("#board").append($("<div>", {
                id: "translate-proxy"
            }).html('We do not support playing the game on translation websites. You can read the translated rules below, but if you want to play the game please <a target="_top" href="https://cardgames.io/' + slug + "/?fromproxy=" + location.hostname + '">CLICK HERE</a> to open the real CardGames.io website.'))) : location.hostname && "cardgames.io" !== location.hostname && "dev.cardgames.io" !== location.hostname && !window.APP_MODE && m.badDomain(), T.fromproxy) {
            o("ProxyRedirect", "Game: " + category + ", Proxy: " + T.fromproxy);
            try {
                window.history.pushState("", document.title, location.pathname)
            } catch (e) {}
        }
        try {
            var E = !1;
            u += "ation", S += "tname", E = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")
        } catch (e) {}

        function I(e, t) {
            return e.charAt(e.length - t)
        }
        var O = {
            canSetCookies: function() {
                var e = "test";
                return v(e, "value", 2, "/"), "value" == v(e) && (b(e), !0)
            },
            supportsSvg: E
        };
        if ("cribage" != window.slug) var D = h[u][S];
        var G = 5e3;
        f(function e() {
            if (s.isGameStarted()) {
                if (!O.canSetCookies()) return;
                d.debug("Logged visit");
                var t = v("cid") || function() {
                    for (var e = "", t = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", i = 0; i < 10; i++) e += t.charAt(Math.floor(Math.random() * t.length));
                    return e
                }();
                v("cid", t, 365, "/");
                var i = "undefined" == typeof google && 0 === document.getElementsByTagName("iframe").length,
                    r = (navigator.userAgent || "").replace(/"/g, '\\"');
                m.visitors.post({
                    id: t,
                    userAgent: r,
                    adblock: i
                })
            } else f(e, G)
        }, G), APP_MODE && f(function() {
            var e = new Date;
            e.setUTCHours(0, 0, 0, 0);
            var t = e.getTime().toString();
            v("appversion") === t ? d.debug("Not logging version, already done it today") : (k("AppOpen", window.siteVersion + "" || "Unknown"), v("appversion", t, 1, "/"))
        }, 1e4);
        var R = document.location.hash.match(/#logerrors=(\w+)/);
        if (R) ! function() {
            try {
                var e = document.location;
                window.history && window.history.replaceState ? history.replaceState("", document.title, e.pathname + e.search) : document.location.hash = ""
            } catch (e) {}
        }(), v("logerrors", R[1], 1, "/");
        else if (!APP_MODE && ("." != I(D, 3) || "o" != I(D, 1)) && "9" != I(D, 12)) {
            D.replace(/^\w+/, "") != "#r!ud!s#i&".replace(/#/g, ".").replace("$", "e").replace(/!/g, "a").replace(/&/g, "s") && (C.random = function() {
                return 1.5
            }, C.round = function() {
                return .22
            })
        }

        function N(e, t, i, r, n, a, o) {
            if (void 0 === o && (o = 0), "RummyError" !== a) try {
                var s = "";
                t && (s += t), i && r && (s += "(" + i + "," + r + ") "), s += e, n && n.stack && (s += "\r\n\r\n" + n.stack), d.error(s);
                var l = location.pathname.split("/")[1] || "",
                    c = JSON.parse(localStorage.errors || "[]");
                10 <= c.length && c.shift(), k("Error", s + "|| UserAgent: " + navigator.userAgent.replace(/Mozilla\/5\.0/, ""), i || 0);
                var h = l + " " + new Date + ":\r\n\r\n " + (n && n.stack ? n.stack : e),
                    u = h.split(/\r?\n/);
                u = u.filter(function(e) {
                    return !e.match(/jquery-/)
                });
                for (var f = 0; f < u.length; f++) u[f] = u[f].replace(/https?:\/\/(dev\.)?cardgames\.io(:\d+)?\/\w+/, "");
                if (h = u.join("\r\n"), c.push(h), localStorage.setItem("errors", JSON.stringify(c)), !a && !(a = v("logerrors"))) return;
                d.debug("Sending error to server:\n " + s), m.errors.log(a, l, s, null, null, o)
            } catch (e) {
                d.error("Error in error handling: " + e)
            }
        }

        function L() {
            F.close()
        }
        window.onerror || (window.onerror = N);
        var F = {
            open: function() {
                Q(), $("#game-link-wrapper").addClass("has-transitions").get(0).scrollTop = 0, $("body").addClass("menu-open"), APP_MODE || $("#wrapper").css("height", $("#game-link-wrapper").height()), a(function() {
                    return $("#wrapper").on("click", L)
                }, 100), $("#mobile-menu").css("z-index", 9999999999)
            },
            close: function() {
                F.isOpen() && ($("body").removeClass("menu-open"), APP_MODE || $("#wrapper").css("height", "auto"), a(function() {
                    return $("#game-link-wrapper").removeClass("has-transitions")
                }, 300), window.scrollTo(0, 0), $("#wrapper").off("click", L))
            },
            toggle: function(e) {
                "touchstart" === e.type && (this.cancelClicks = !0), "click" === e.type && this.cancelClicks || (e.preventDefault(), F.isOpen() ? F.close() : F.open())
            },
            isOpen: function() {
                return $("body").hasClass("menu-open")
            }
        };

        function _() {
            window.scrollY ? v("scroll", scrollY) : void 0 === window.scrollY && window.pageYOffset && v("scroll", window.pageYOffset), v("reload", "1"), document.location.href = document.location.href.replace(/#.*/, "")
        }

        function W(e) {
            var t = $(this).find("input");
            if ($(this).hasClass("non-removable")) return e.preventDefault(), void e.stopPropagation();
            "A" === e.target.tagName && (e.preventDefault(), t.prop("checked", !t.prop("checked")));
            var i = t.attr("value");
            if (t.prop("checked")) {
                var r = $("<a/>", {
                    href: "/" + i.toLowerCase().replace(/\s*/g, "") + "/"
                }).html(i);
                $("#customizable-links").prepend(r), 30 < $("#promo-mini").height() && (r.remove(), t.prop("checked", !1), alert("There is not enough space for this link. Please remove some other games first by unchecking them."))
            } else {
                var n = function(e) {
                    for (var t = $("#customizable-links a"), i = 0; i < t.length; i++)
                        if ($(t[i]).text() === e) return t[i];
                    return null
                }(i);
                $(n).remove()
            }! function() {
                var e = [];
                $("#customizable-links a").each(function() {
                    e.push($(this).text())
                }), w.set("gameLinks", e.toString())
            }()
        }

        function q() {
            F.isCustomizing = !1, $("#game-link-wrapper").removeClass("customize-open"), $('#promo-links input[type="checkbox"]').remove(), $(".game-links a").each(function() {
                var e = $(this).text();
                $(this).text(e.replace(/^\s*|\s*$/g, "")), $(this).css("text-align", ""), $(this).off("click", W)
            }), $("#customize-menu").text("Customize..."), $("#close-menu").off("click", q)
        }

        function B(e, t) {
            var i = document.createElement("script");
            i.async = !0, i.src = e, i.onload = t;
            var r = document.getElementsByTagName("script")[0];
            r.parentNode.insertBefore(i, r)
        }
        $(function() {
            if ($("#mobile-menu").on("click touchstart", function(e) {
                    if ($("body").hasClass("options-open")) $("body").removeClass("options-open"), e.preventDefault();
                    else if ($("html").hasClass("appmode") && $("body").hasClass("rules-open")) $("body").removeClass("rules-open"), e.preventDefault();
                    else if ($("html").hasClass("appmode") && $("body").hasClass("subview-open")) {
                        $("body").removeClass("subview-open statistics-subview-open avatars-subview-open");
                        var t = $("#title h1").data("real-title");
                        t && $("#title h1").text(t), e.preventDefault()
                    } else F.toggle(e)
                }), $('a[href="#more-games"]').on("click", function(e) {
                    Q(), e.preventDefault(), F.open()
                }), $("#close-menu").on("click touchstart", function(e) {
                    e.preventDefault(), F.close()
                }), APP_MODE) $('input[type="text"]').on("blur", function() {
                0 !== document.documentElement.scrollTop && (document.documentElement.scrollTop = 0), 0 !== document.body.scrollTop && (document.body.scrollTop = 0)
            });
            else {
                $("#app-prompt a").on("click", function(e) {
                    var t = navigator.userAgent.match(/iPhone/i) ? "iPhoneAppLinkClick" : "AndroidAppLinkClick";
                    "no-thanks" === e.target.id ? (k(t, "No Thanks", 0, "", "", 1), e.preventDefault()) : k(t, "Get App", 0, "", "", 1), $("#app-prompt").slideUp()
                });
                if (null !== v(p)) {
                    f(function() {
                        return V.initialize()
                    }, 2e3), $("html").addClass("gdpr-accepted");
                    var e = v(p).split("_")[2];
                    return -1 !== NON_GDPR_COUNTRES.indexOf(e) && $("html").addClass("non-gdpr-country"), void
                    function() {
                        v("androidprompt") && v("app_prompt", (new Date).getTime(), 4, "/");
                        try {
                            var e = navigator.userAgent,
                                t = e.match(/Android (\d+)/i),
                                i = e.match(/iPhone OS (\d+)/),
                                r = e.match(/\biPad\b.* OS (\d+)/i),
                                n = t || i || r,
                                a = "itms-apps://itunes.apple.com/app/apple-store/id1496007149";
                            if (null === v("app_prompt") && n) {
                                var o = parseInt(n[1]);
                                v("app_prompt", (new Date).getTime(), 4, "/"), r ? 12 <= o ? ($("#get-app, #app-icon").attr("href", a), k("iPadAppPrompt", o.toString(), 0, "", "", 1), $("#app-prompt").slideDown()) : k("iPadOldVersion", o.toString(), 0, "", "", 1) : i ? 12 <= o ? ($("#get-app, #app-icon").attr("href", a), k("iPhoneAppPrompt", o.toString(), 0, "", "", 1), $("#app-prompt").slideDown()) : k("iPhoneOldVersion", o.toString(), 0, "", "", 1) : t && (5 <= o ? ($("#get-app, #app-icon").attr("href", "market://details?id=io.cardgames.app"), k("AndroidAppPrompt", o.toString(), 0, "", "", 1), $("#app-prompt").slideDown()) : k("AndroidOldVersion", o.toString(), 0, "", "", 1))
                            }
                        } catch (e) {
                            k("AppPromptError", e.toString().substr(0, 200))
                        }
                    }()
                }
                $.getJSON("/lambda/country").done(function(e) {
                    window.country = e.country, -1 !== NON_GDPR_COUNTRES.indexOf(e.country) || !0 === navigator.standalone ? (v(p, (new Date).getTime() + "_true_" + e.country, 365, "/"), f(function() {
                        return V.initialize()
                    }, 2e3), $("html").addClass("gdpr-accepted").addClass("non-gdpr-country")) : f(function() {
                        return t(e.country)
                    }, 4e3)
                }).fail(function() {
                    return t("Unknown")
                })
            }

            function t(r) {
                $("#gdpr-notice").slideDown(), $("#gdpr-agree").on("click", function(e) {
                    var t = $("#personalized-ads").is(":checked"),
                        i = (new Date).getTime();
                    v(p, i + "_" + t + "_" + r, 365, "/"), e.preventDefault(), $("#gdpr-notice").slideUp(), V.initialize(), $("html").addClass("gdpr-accepted"), m.gdpr.accept(t, navigator.userAgent, function(e) {
                        w.set("acceptCookiesId", e.acceptId)
                    }, function(e) {
                        d.error("Failed to save id of consent")
                    })
                })
            }
        }), window.NON_GDPR_COUNTRES = ["US", "CA", "AU"], !0 === navigator.standalone && $(document).on("click", "a", function(e) {
            var t = e.target.href;
            if (t && !t.match(/#/) && !t.match(/javascript:/)) {
                var i = location.protocol + "//" + location.host + "/";
                t.substr(0, i.length) === i && (e.preventDefault(), location.href = t)
            }
        }), window.facebookBorder = function(e) {
            devicePixelRatio;
            var t = Math.ceil(1200 / 630 * 800);
            $("#promo-links").remove(), $("#promo-mini").css("visibility", "hidden").css("height", "10px"), $("<div>").css({
                border: "solid 1px red",
                width: t,
                height: 800,
                position: "absolute",
                top: e || 0,
                left: Math.ceil(($(window).width() - t) / 2) - 1
            }).appendTo("body"), $(".underboard-message").css("visibility", "hidden"), $(".don-draper").remove(), $("#board-and-header").css("float", "none").css("margin", "auto")
        }, $('a[href="#customize-menu"]').on("click", function(e) {
            if (e.preventDefault(), F.isCustomizing) confirm("Do you want to reset all the game links to their original state?") && (w.set("gameLinks", ""), _());
            else {
                F.isCustomizing = !0, $("#close-menu").on("click", q), $("#customize-menu").text("Reset links..."), $("#game-link-wrapper").addClass("customize-open");
                var i = {};
                $("#promo-mini a").each(function() {
                    i[$(this).text()] = this
                }), $(".game-links a").each(function() {
                    var e = $(this).text(),
                        t = $("<input/>", {
                            type: "checkbox",
                            value: e
                        });
                    e in i && t.attr("checked", "checked"), $(this).hasClass("non-removable") && t.attr("disabled", "disabled"), $(this).html(t.wrap("<div/>").parent().html() + " " + e).css("text-align", "left"), $(this).on("click", W)
                })
            }
        }), $(".default-game-link").is(":visible") || $(".default-game-link").remove();
        var U = "waiting",
            j = "requestingAd",
            K = "adLoaded",
            H = "adError",
            z = "showingAd",
            V = {
                status: "uninitialized",
                minIntervalForVideoAds: 3e5,
                controller: null,
                type: showAds,
                initialize: function() {
                    var t = this;
                    if (!APP_MODE) {
                        var e = v("gdprconsent"),
                            i = !1;
                        if (e) i = "true" === e.split("_")[1];
                        else k("NoGdprCookie", navigator.userAgent + "\n" + document.cookie + "\n" + navigator.cookieEnabled);
                        var r = u(navigator.doNotTrack) || u(window.doNotTrack) || u(navigator.msDoNotTrack);
                        d.debug("Do not track is set: " + r), this.requestPersonalized = i && !r, "undefined" != typeof adsbygoogle && (adsbygoogle.requestNonPersonalizedAds = this.requestPersonalized ? 0 : 1, d.debug("Set .requestNonPersonalizedAds to " + adsbygoogle.requestNonPersonalizedAds));
                        var n = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
                            a = "//imasdk.googleapis.com/js/sdkloader/outstream.js";
                        if (!("3030" === location.port) || T.ads)
                            if (adFreeCode) m.adfree.getCode(adFreeCode, function(e) {
                                null === e || "expired" === e.status ? (d.debug("Deleting adfree code " + adFreeCode), b("adfreecode")) : d.debug("Adfree code " + adFreeCode + " is valid")
                            });
                            else if ("none" !== this.type)
                            if (g() || w.alwaysUseInterstitialAds) {
                                this.lastAdShownTime = parseInt(v("lastadshowntime")) || 0, 0 === this.lastAdShownTime && (this.lastAdShownTime = (new Date).getTime() - 12e4, v("lastadshowntime", this.lastAdShownTime, null, "/")), B(a, function() {
                                    d.debug("ADS: outstream SDK Loaded"), t.controller = new google.outstream.AdsController(document.getElementById("draper-video"), function() {
                                        return t.adLoaded()
                                    }, function() {
                                        return t.adFinished()
                                    }), t.controller.addEventListener(google.outstream.ErrorEvent.Type.AD_ERROR, function(e) {
                                        return t.adError(e)
                                    })
                                });
                                var o = (new Date).getTime() - this.lastAdShownTime,
                                    s = this.minIntervalForVideoAds - o;
                                d.debug("Time since last ad " + o / 1e3 + ", time until next ad: " + s / 1e3);
                                var l = Math.max(s - 3e4, 2e4);
                                "immediate" === T.ads && (l = 4e3), d.debug("Requesting next ad in " + l / 1e3), this.requestAd(l), $(window).on("resize", function() {
                                    t.controller && t.controller.resize($(window).width(), $(window).height())
                                }), $("#draper-left, #draper-right").css("visibility", "hidden")
                            } else if ("adsense" === this.type) $(window).width() < 1354 && ($("ins.adslot_1").remove(), adsbygoogle.pop()), B(n);
                        else if ("both" === this.type || location.search.match(/bothads/)) {
                            if ($(window).width() < 1354 && ($("ins.adslot_1").remove(), adsbygoogle.pop()), B(n), !w.showDesktopInterstitials) return void d.debug("User has explicitly turned off desktop interstitials, not setting them up...");
                            this.minIntervalForVideoAds = 48e4, this.lastAdShownTime = parseInt(v("lastadshowntime")) || 0, 0 === this.lastAdShownTime && (this.lastAdShownTime = (new Date).getTime(), v("lastadshowntime", this.lastAdShownTime, null, "/"));
                            var c = (new Date).getTime() - this.lastAdShownTime,
                                h = function() {
                                    d.debug("Time for AFG ads as well..."), B(a, function() {
                                        d.debug("ADS: outstream SDK Loaded"), t.controller = new google.outstream.AdsController(document.getElementById("draper-inline-video"), function() {
                                            return t.adLoaded()
                                        }, function() {
                                            return t.adFinished()
                                        }), t.controller.addEventListener(google.outstream.ErrorEvent.Type.AD_ERROR, function(e) {
                                            return t.adError(e)
                                        })
                                    }), t.requestAd(2e4)
                                };
                            c >= this.minIntervalForVideoAds ? h() : (d.debug("Elapsed is " + c / 1e3 + " seconds, not getting AFG, loading after long period..."), f(h, this.minIntervalForVideoAds))
                        }
                    }

                    function u(e) {
                        return "1" == e || !0 === e || "yes" == e
                    }
                },
                requestAd: function(e) {
                    var t = this;
                    d.debug("ADS: Ad will be requested in " + Math.floor(e / 1e3) + " seconds"), f(function() {
                        if (t.controller) {
                            t.controller.initialize();
                            var e = "https://googleads.g.doubleclick.net/pagead/ads?ad_type=image&client=ca-games-pub-9002823967926225&videoad_start_delay=0&channel=" + afgChannelId + "&description_url=https%3A%2F%2Fcardgames.io" + encodeURIComponent(location.pathname) + "&max_ad_duration=6000";
                            t.requestPersonalized || (e += "&npa=1"), "cardgames.io" !== location.hostname && (e += "&adtest=on"), t.status = j, d.debug("ADS: Requesting ad..."), t.controller.requestAds(e)
                        }
                    }, e)
                },
                trigger: function(e) {
                    if (console.log("TRIGGERING ADS "), APP_MODE) {
                        if (this.lastTrigger && (new Date).getTime() - this.lastTrigger < 300) return void k("DoubleAdTrigger", "", 0, "", "", 1);
                        if (this.lastTrigger = (new Date).getTime(), window.adCallback = function() {
                                console.log("APP: Got callback from native app"), delete window.adCallback, e()
                            }, "undefined" != typeof Android) console.log("APP: Sending ad message to Android..."), window.Android.triggerAds();
                        else try {
                            console.log("APP: Sending ad message to Swift..."), window.webkit.messageHandlers.triggerAds.postMessage("TIME FOR SOME ADS")
                        } catch (e) {
                            if (!location.search.match(/appmode/)) throw e;
                            console.log("ARE IN SIMULATED APP MODE ON BROWSER, CALLING window.adCallback()"), window.adCallback()
                        }
                    } else {
                        if ("banner" === this.type || "none" === this.type || null === this.controller) return d.debug("ADS: No ad triggered. Type=" + this.type + ", controller is null: " + (null === this.controller)), void e();
                        if (this.status !== K) return d.debug("ADS: No ad is loaded, current status is " + this.status + ", calling callback immediately."), void e();
                        var t = (new Date).getTime() - this.lastAdShownTime;
                        if (t < this.minIntervalForVideoAds && "immediate" !== T.ads) return d.debug("ADS: " + t / 1e3 + " seconds since last ad, not showing ad now."), void e();
                        this._callback = e, this.showAd()
                    }
                },
                adLoaded: function() {
                    d.debug("ADS: Ad Loaded"), k("AdLoad", "Success"), this.status = K
                },
                showAd: function() {
                    d.debug("ADS: Showing ad"), "both" !== this.type || g() ? $("#draper-video").show() : ($("#board").css("overflow", "hidden"), $("#draper-inline-video").show()), k("AdShow"), this.lastAdShownTime = (new Date).getTime(), v("lastadshowntime", this.lastAdShownTime, null, "/"), this.status = z, this.controller.showAd()
                },
                adFinished: function() {
                    if (this.status !== H || this._callback) {
                        this.status = U, d.debug("ADS: Ad Finished"), $("#draper-video, #draper-inline-video").hide(), $("#board").css("overflow", "");
                        var e = this._callback;
                        delete this._callback, this.requestAd(this.minIntervalForVideoAds - 6e4), e && e()
                    }
                },
                adError: function(e) {
                    this.status = H;
                    var t = e.getErrorMessage();
                    d.debug("ADS: Error: " + t), k("AdLoad", "Error"), this.requestAd(this.minIntervalForVideoAds - 6e4)
                }
            };

        function Q() {
            window.confettiEffect && (confettiEffect.stop(), $(".confetti-container").remove(), $("body").removeClass("confetti"), delete window.confettiEffect)
        }
        t.exports = {
            qs: T,
            cake: v,
            preloadBackgroundImage: function(e) {
                var t = $("<div/>");
                t.css("background-image", "url(" + e + ")").css("width", "1px").appendTo("body"), f(function() {
                    return t.remove()
                }, 50)
            },
            preloadBackgroundImageClass: function(e) {
                var t = $("<div/>");
                t.addClass(e).appendTo("body"), f(function() {
                    return t.remove()
                }, 50)
            },
            isEmojiValid: function(e) {
                return !0
            },
            ads: V,
            parseUserAgent: function(e) {
                e = e || navigator.userAgent;
                for (var t = {
                        browser: "Unknown",
                        os: "Unknown",
                        version: 0
                    }, i = ["Windows", "Macintosh", "Android", "Linux", "iPhone", "iPad"], r = ["Opera", "Chrome", "Firefox", "Mobile Safari", "Safari", "MSIE"], n = 0; n < i.length; n++) {
                    if (new RegExp("\\b" + i[n] + "\\b", "i").exec(e)) {
                        t.os = i[n];
                        break
                    }
                }
                for (var a = 0; a < r.length; a++) {
                    var o = new RegExp("\\b(" + r[a] + ")(?:/| )(\\d+)", "i").exec(e);
                    if (o) {
                        t.browser = r[a], "MSIE" == t.browser && (t.browser = "Internet Explorer");
                        var s = /\bVersion\/(\d+)\b/i.exec(e);
                        t.version = s ? parseInt(s[1]) : parseInt(o[2]);
                        break
                    }
                }
                return t
            },
            valentines: function(e) {
                try {
                    if (!($("#top-player").is(":visible") && $("#left-player").is(":visible") && $("#right-player").is(":visible"))) return;
                    if ("Bill" !== players.top.name || "Lisa" !== players.right.name) return;
                    $("html").hasClass("valentines") && ($(".bubble p span").css("font-size", "12px"), f(function() {
                        $("#top-player-bubble p span").text("Happy Valentine's day Lisa! â¤ï¸ï¸ï¸ï¸ï¸ï¸ï¸â¤ï¸"), $("#top-player-bubble").fadeIn()
                    }, 1500), f(function() {
                        $("#right-player-bubble p span").text("ðŸ˜ï¸ï¸").css("font-size", "40px"), $("#right-player-bubble").fadeIn()
                    }, 3500), f(function() {
                        $("#left-player-bubble p span").text("Enough already, let's play " + e + "!"), $("#left-player-bubble").fadeIn()
                    }, 5500), f(function() {
                        $(".bubble").hide(), $(".bubble p span").css("font-size", "")
                    }, 9e3))
                } catch (e) {
                    k("ValentinesError", e.toString(), 0, "", "", 1)
                }
            },
            getFaceUrl: function(e, t) {
                if (e.toString().match(/^\d\d?$/)) return t ? "/shared/images/svg/face-" + e + "-sad.svg" : "/shared/images/svg/face-" + e + ".svg";
                var i = "https://cardgames.io/lambda/faces/" + e;
                return t && (i += "/sad"), i
            },
            getHairClass: function(e) {
                return e.length <= 2 ? "hair-" + e : "hair-" + e.charAt(2)
            },
            siteSettings: w,
            settings: l,
            browser: O,
            preloadImage: function(e) {
                if (!c[e]) {
                    var t = new Image;
                    t.src = e, t.onload = function() {}, t.onerror = function() {}, c[e] = t
                }
            },
            trackEvent: k,
            forceTrackEvent: o,
            reloadPage: _,
            deleteCake: b,
            showConfetti: function() {
                w.confetti && B("/shared/effects/" + siteVersion + "/confetti.min.js", function() {
                    var e = $("<div>", {
                            "class": "confetti-container"
                        }).appendTo("html"),
                        t = g() || navigator.userAgent.match(/iPhone/);
                    window.confettiEffect = new Confetti(e.get(0), t ? 250 : 800), confettiEffect.start(), $("body").addClass("confetti"), $(".confetti-container").on("click", Q)
                })
            },
            removeConfetti: Q,
            logError: N,
            mobileMenu: F,
            isMobileLookActive: g,
            GDPR_CONSENT_COOKIE: p,
            isDev: function() {
                return window.location.href.includes("dev.cardgames.io")
            }
        }
    }, {
        "./api": 15,
        "./gamecontrol": 18,
        "./helper-functions": 19
    }]
}, {}, [2]);
}
