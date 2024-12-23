/*
 * jQuery FlexSlider v2.5.0
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
;(function(n) {
    n.flexslider = function(t, i) {
        var r = n(t);
        r.vars = n.extend({}, n.flexslider.defaults, i);
        var f = r.vars.namespace, v = window.navigator && window.navigator.msPointerEnabled && window.MSGesture, y = ("ontouchstart"in window || v || window.DocumentTouch && document instanceof DocumentTouch) && r.vars.touch, a = "click touchend MSPointerUp keyup", s = "", p, h = r.vars.direction === "vertical", o = r.vars.reverse, e = r.vars.itemWidth > 0, c = r.vars.animation === "fade", l = r.vars.asNavFor !== "", u = {}, w = !0;
        n.data(t, "flexslider", r);
        u = {
            init: function() {
                r.animating = !1;
                r.currentSlide = parseInt(r.vars.startAt ? r.vars.startAt : 0, 10);
                isNaN(r.currentSlide) && (r.currentSlide = 0);
                r.animatingTo = r.currentSlide;
                r.atEnd = r.currentSlide === 0 || r.currentSlide === r.last;
                r.containerSelector = r.vars.selector.substr(0, r.vars.selector.search(" "));
                r.slides = n(r.vars.selector, r);
                r.container = n(r.containerSelector, r);
                r.count = r.slides.length;
                r.syncExists = n(r.vars.sync).length > 0;
                r.vars.animation === "slide" && (r.vars.animation = "swing");
                r.prop = h ? "top" : "marginLeft";
                r.args = {};
                r.manualPause = !1;
                r.stopped = !1;
                r.started = !1;
                r.startTimeout = null;
                r.transitions = !r.vars.video && !c && r.vars.useCSS && function() {
                    var i = document.createElement("div")
                      , n = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                    for (var t in n)
                        if (i.style[n[t]] !== undefined)
                            return r.pfx = n[t].replace("Perspective", "").toLowerCase(),
                            r.prop = "-" + r.pfx + "-transform",
                            !0;
                    return !1
                }();
                r.ensureAnimationEnd = "";
                r.vars.controlsContainer !== "" && (r.controlsContainer = n(r.vars.controlsContainer).length > 0 && n(r.vars.controlsContainer));
                r.vars.manualControls !== "" && (r.manualControls = n(r.vars.manualControls).length > 0 && n(r.vars.manualControls));
                r.vars.customDirectionNav !== "" && (r.customDirectionNav = n(r.vars.customDirectionNav).length === 2 && n(r.vars.customDirectionNav));
                r.vars.randomize && (r.slides.sort(function() {
                    return Math.round(Math.random()) - .5
                }),
                r.container.empty().append(r.slides));
                r.doMath();
                r.setup("init");
                r.vars.controlNav && u.controlNav.setup();
                r.vars.directionNav && u.directionNav.setup();
                r.vars.keyboard && (n(r.containerSelector).length === 1 || r.vars.multipleKeyboard) && n(document).bind("keyup", function(n) {
                    var t = n.keyCode, i;
                    r.animating || t !== 39 && t !== 37 || (i = t === 39 ? r.getTarget("next") : t === 37 ? r.getTarget("prev") : !1,
                    r.flexAnimate(i, r.vars.pauseOnAction))
                });
                r.vars.mousewheel && r.bind("mousewheel", function(n, t) {
                    n.preventDefault();
                    var i = t < 0 ? r.getTarget("next") : r.getTarget("prev");
                    r.flexAnimate(i, r.vars.pauseOnAction)
                });
                r.vars.pausePlay && u.pausePlay.setup();
                r.vars.slideshow && r.vars.pauseInvisible && u.pauseInvisible.init();
                r.vars.slideshow && (r.vars.pauseOnHover && r.hover(function() {
                    r.manualPlay || r.manualPause || r.pause()
                }, function() {
                    r.manualPause || r.manualPlay || r.stopped || r.play()
                }),
                r.vars.pauseInvisible && u.pauseInvisible.isHidden() || (r.vars.initDelay > 0 ? r.startTimeout = setTimeout(r.play, r.vars.initDelay) : r.play()));
                l && u.asNav.setup();
                y && r.vars.touch && u.touch();
                (!c || c && r.vars.smoothHeight) && n(window).bind("resize orientationchange focus", u.resize);
                r.find("img").attr("draggable", "false");
                setTimeout(function() {
                    r.vars.start(r)
                }, 200)
            },
            asNav: {
                setup: function() {
                    if (r.asNav = !0,
                    r.animatingTo = Math.floor(r.currentSlide / r.move),
                    r.currentItem = r.currentSlide,
                    r.slides.removeClass(f + "active-slide").eq(r.currentItem).addClass(f + "active-slide"),
                    v)
                        t._slider = r,
                        r.slides.each(function() {
                            var t = this;
                            t._gesture = new MSGesture;
                            t._gesture.target = t;
                            t.addEventListener("MSPointerDown", function(n) {
                                n.preventDefault();
                                n.currentTarget._gesture && n.currentTarget._gesture.addPointer(n.pointerId)
                            }, !1);
                            t.addEventListener("MSGestureTap", function(t) {
                                t.preventDefault();
                                var i = n(this)
                                  , u = i.index();
                                n(r.vars.asNavFor).data("flexslider").animating || i.hasClass("active") || (r.direction = r.currentItem < u ? "next" : "prev",
                                r.flexAnimate(u, r.vars.pauseOnAction, !1, !0, !0))
                            })
                        });
                    else
                        r.slides.on(a, function(t) {
                            t.preventDefault();
                            var i = n(this)
                              , u = i.index()
                              , e = i.offset().left - n(r).scrollLeft();
                            e <= 0 && i.hasClass(f + "active-slide") ? r.flexAnimate(r.getTarget("prev"), !0) : n(r.vars.asNavFor).data("flexslider").animating || i.hasClass(f + "active-slide") || (r.direction = r.currentItem < u ? "next" : "prev",
                            r.flexAnimate(u, r.vars.pauseOnAction, !1, !0, !0))
                        })
                }
            },
            controlNav: {
                setup: function() {
                    r.manualControls ? u.controlNav.setupManual() : u.controlNav.setupPaging()
                },
                setupPaging: function() {
                    var c = r.vars.controlNav === "thumbnails" ? "control-thumbs" : "control-paging", h = 1, e, o, t, i;
                    if (r.controlNavScaffold = n('<ol class="' + f + "control-nav " + f + c + '"><\/ol>'),
                    r.pagingCount > 1)
                        for (t = 0; t < r.pagingCount; t++)
                            o = r.slides.eq(t),
                            e = r.vars.controlNav === "thumbnails" ? '<img src="' + o.attr("data-thumb") + '"/>' : "<a>" + h + "<\/a>",
                            "thumbnails" === r.vars.controlNav && !0 === r.vars.thumbCaptions && (i = o.attr("data-thumbcaption"),
                            "" !== i && undefined !== i && (e += '<span class="' + f + 'caption">' + i + "<\/span>")),
                            r.controlNavScaffold.append("<li>" + e + "<\/li>"),
                            h++;
                    r.controlsContainer ? n(r.controlsContainer).append(r.controlNavScaffold) : r.append(r.controlNavScaffold);
                    u.controlNav.set();
                    u.controlNav.active();
                    r.controlNavScaffold.delegate("a, img", a, function(t) {
                        if (t.preventDefault(),
                        s === "" || s === t.type) {
                            var i = n(this)
                              , e = r.controlNav.index(i);
                            i.hasClass(f + "active") || (r.direction = e > r.currentSlide ? "next" : "prev",
                            r.flexAnimate(e, r.vars.pauseOnAction))
                        }
                        s === "" && (s = t.type);
                        u.setToClearWatchedEvent()
                    })
                },
                setupManual: function() {
                    r.controlNav = r.manualControls;
                    u.controlNav.active();
                    r.controlNav.bind(a, function(t) {
                        if (t.preventDefault(),
                        s === "" || s === t.type) {
                            var i = n(this)
                              , e = r.controlNav.index(i);
                            i.hasClass(f + "active") || (r.direction = e > r.currentSlide ? "next" : "prev",
                            r.flexAnimate(e, r.vars.pauseOnAction))
                        }
                        s === "" && (s = t.type);
                        u.setToClearWatchedEvent()
                    })
                },
                set: function() {
                    var t = r.vars.controlNav === "thumbnails" ? "img" : "a";
                    r.controlNav = n("." + f + "control-nav li " + t, r.controlsContainer ? r.controlsContainer : r)
                },
                active: function() {
                    r.controlNav.removeClass(f + "active").eq(r.animatingTo).addClass(f + "active")
                },
                update: function(t, i) {
                    r.pagingCount > 1 && t === "add" ? r.controlNavScaffold.append(n("<li><a>" + r.count + "<\/a><\/li>")) : r.pagingCount === 1 ? r.controlNavScaffold.find("li").remove() : r.controlNav.eq(i).closest("li").remove();
                    u.controlNav.set();
                    r.pagingCount > 1 && r.pagingCount !== r.controlNav.length ? r.update(i, t) : u.controlNav.active()
                }
            },
            directionNav: {
                setup: function() {
                    var t = n('<ul class="' + f + 'direction-nav"><li class="' + f + 'nav-prev"><a class="' + f + 'prev" href="#">' + r.vars.prevText + '<\/a><\/li><li class="' + f + 'nav-next"><a class="' + f + 'next" href="#">' + r.vars.nextText + "<\/a><\/li><\/ul>");
                    r.customDirectionNav ? r.directionNav = r.customDirectionNav : r.controlsContainer ? (n(r.controlsContainer).append(t),
                    r.directionNav = n("." + f + "direction-nav li a", r.controlsContainer)) : (r.append(t),
                    r.directionNav = n("." + f + "direction-nav li a", r));
                    u.directionNav.update();
                    r.directionNav.bind(a, function(t) {
                        t.preventDefault();
                        var i;
                        (s === "" || s === t.type) && (i = n(this).hasClass(f + "next") ? r.getTarget("next") : r.getTarget("prev"),
                        r.flexAnimate(i, r.vars.pauseOnAction));
                        s === "" && (s = t.type);
                        u.setToClearWatchedEvent()
                    })
                },
                update: function() {
                    var n = f + "disabled";
                    r.pagingCount === 1 ? r.directionNav.addClass(n).attr("tabindex", "-1") : r.vars.animationLoop ? r.directionNav.removeClass(n).removeAttr("tabindex") : r.animatingTo === 0 ? r.directionNav.removeClass(n).filter("." + f + "prev").addClass(n).attr("tabindex", "-1") : r.animatingTo === r.last ? r.directionNav.removeClass(n).filter("." + f + "next").addClass(n).attr("tabindex", "-1") : r.directionNav.removeClass(n).removeAttr("tabindex")
                }
            },
            pausePlay: {
                setup: function() {
                    var t = n('<div class="' + f + 'pauseplay"><a><\/a><\/div>');
                    r.controlsContainer ? (r.controlsContainer.append(t),
                    r.pausePlay = n("." + f + "pauseplay a", r.controlsContainer)) : (r.append(t),
                    r.pausePlay = n("." + f + "pauseplay a", r));
                    u.pausePlay.update(r.vars.slideshow ? f + "pause" : f + "play");
                    r.pausePlay.bind(a, function(t) {
                        t.preventDefault();
                        (s === "" || s === t.type) && (n(this).hasClass(f + "pause") ? (r.manualPause = !0,
                        r.manualPlay = !1,
                        r.pause()) : (r.manualPause = !1,
                        r.manualPlay = !0,
                        r.play()));
                        s === "" && (s = t.type);
                        u.setToClearWatchedEvent()
                    })
                },
                update: function(n) {
                    n === "play" ? r.pausePlay.removeClass(f + "pause").addClass(f + "play").html(r.vars.playText) : r.pausePlay.removeClass(f + "play").addClass(f + "pause").html(r.vars.pauseText)
                }
            },
            touch: function() {
                var p, w, f, u, n, s, d, b, k, l = !1, a = 0, y = 0, i = 0;
                if (v) {
                    t.style.msTouchAction = "none";
                    t._gesture = new MSGesture;
                    t._gesture.target = t;
                    t.addEventListener("MSPointerDown", g, !1);
                    t._slider = r;
                    t.addEventListener("MSGestureChange", nt, !1);
                    t.addEventListener("MSGestureEnd", tt, !1);
                    function g(n) {
                        n.stopPropagation();
                        r.animating ? n.preventDefault() : (r.pause(),
                        t._gesture.addPointer(n.pointerId),
                        i = 0,
                        u = h ? r.h : r.w,
                        s = Number(new Date),
                        f = e && o && r.animatingTo === r.last ? 0 : e && o ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : e && r.currentSlide === r.last ? r.limit : e ? (r.itemW + r.vars.itemMargin) * r.move * r.currentSlide : o ? (r.last - r.currentSlide + r.cloneOffset) * u : (r.currentSlide + r.cloneOffset) * u)
                    }
                    function nt(r) {
                        var e, o, a;
                        if (r.stopPropagation(),
                        e = r.target._slider,
                        e) {
                            if (o = -r.translationX,
                            a = -r.translationY,
                            i = i + (h ? a : o),
                            n = i,
                            l = h ? Math.abs(i) < Math.abs(-o) : Math.abs(i) < Math.abs(-a),
                            r.detail === r.MSGESTURE_FLAG_INERTIA) {
                                setImmediate(function() {
                                    t._gesture.stop()
                                });
                                return
                            }
                            (!l || Number(new Date) - s > 500) && (r.preventDefault(),
                            !c && e.transitions && (e.vars.animationLoop || (n = i / (e.currentSlide === 0 && i < 0 || e.currentSlide === e.last && i > 0 ? Math.abs(i) / u + 2 : 1)),
                            e.setProps(f + n, "setTouch")))
                        }
                    }
                    function tt(t) {
                        var r, e, h;
                        (t.stopPropagation(),
                        r = t.target._slider,
                        r) && (r.animatingTo !== r.currentSlide || l || n === null || (e = o ? -n : n,
                        h = e > 0 ? r.getTarget("next") : r.getTarget("prev"),
                        r.canAdvance(h) && (Number(new Date) - s < 550 && Math.abs(e) > 50 || Math.abs(e) > u / 2) ? r.flexAnimate(h, r.vars.pauseOnAction) : c || r.flexAnimate(r.currentSlide, r.vars.pauseOnAction, !0)),
                        p = null,
                        w = null,
                        n = null,
                        f = null,
                        i = 0)
                    }
                } else
                    d = function(n) {
                        r.animating ? n.preventDefault() : (window.navigator.msPointerEnabled || n.touches.length === 1) && (r.pause(),
                        u = h ? r.h : r.w,
                        s = Number(new Date),
                        a = n.touches[0].pageX,
                        y = n.touches[0].pageY,
                        f = e && o && r.animatingTo === r.last ? 0 : e && o ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : e && r.currentSlide === r.last ? r.limit : e ? (r.itemW + r.vars.itemMargin) * r.move * r.currentSlide : o ? (r.last - r.currentSlide + r.cloneOffset) * u : (r.currentSlide + r.cloneOffset) * u,
                        p = h ? y : a,
                        w = h ? a : y,
                        t.addEventListener("touchmove", b, !1),
                        t.addEventListener("touchend", k, !1))
                    }
                    ,
                    b = function(t) {
                        a = t.touches[0].pageX;
                        y = t.touches[0].pageY;
                        n = h ? p - y : p - a;
                        l = h ? Math.abs(n) < Math.abs(a - w) : Math.abs(n) < Math.abs(y - w);
                        (!l || Number(new Date) - s > 500) && (t.preventDefault(),
                        !c && r.transitions && (r.vars.animationLoop || (n = n / (r.currentSlide === 0 && n < 0 || r.currentSlide === r.last && n > 0 ? Math.abs(n) / u + 2 : 1)),
                        r.setProps(f + n, "setTouch")))
                    }
                    ,
                    k = function() {
                        if (t.removeEventListener("touchmove", b, !1),
                        r.animatingTo === r.currentSlide && !l && !(n === null)) {
                            var i = o ? -n : n
                              , e = i > 0 ? r.getTarget("next") : r.getTarget("prev");
                            r.canAdvance(e) && (Number(new Date) - s < 550 && Math.abs(i) > 50 || Math.abs(i) > u / 2) ? r.flexAnimate(e, r.vars.pauseOnAction) : c || r.flexAnimate(r.currentSlide, r.vars.pauseOnAction, !0)
                        }
                        t.removeEventListener("touchend", k, !1);
                        p = null;
                        w = null;
                        n = null;
                        f = null
                    }
                    ,
                    t.addEventListener("touchstart", d, !1)
            },
            resize: function() {
                !r.animating && r.is(":visible") && (e || r.doMath(),
                c ? u.smoothHeight() : e ? (r.slides.width(r.computedW),
                r.update(r.pagingCount),
                r.setProps()) : h ? (r.viewport.height(r.h),
                r.setProps(r.h, "setTotal")) : (r.vars.smoothHeight && u.smoothHeight(),
                r.newSlides.width(r.computedW),
                r.setProps(r.computedW, "setTotal")))
            },
            smoothHeight: function(n) {
                if (!h || c) {
                    var t = c ? r : r.viewport;
                    n ? t.animate({
                        height: r.slides.eq(r.animatingTo).height()
                    }, n) : t.height(r.slides.eq(r.animatingTo).height())
                }
            },
            sync: function(t) {
                var i = n(r.vars.sync).data("flexslider")
                  , u = r.animatingTo;
                switch (t) {
                case "animate":
                    i.flexAnimate(u, r.vars.pauseOnAction, !1, !0);
                    break;
                case "play":
                    i.playing || i.asNav || i.play();
                    break;
                case "pause":
                    i.pause()
                }
            },
            uniqueID: function(t) {
                return t.filter("[id]").add(t.find("[id]")).each(function() {
                    var t = n(this);
                    t.attr("id", t.attr("id") + "_clone")
                }),
                t
            },
            pauseInvisible: {
                visProp: null,
                init: function() {
                    var n = u.pauseInvisible.getHiddenProp(), t;
                    n && (t = n.replace(/[H|h]idden/, "") + "visibilitychange",
                    document.addEventListener(t, function() {
                        u.pauseInvisible.isHidden() ? r.startTimeout ? clearTimeout(r.startTimeout) : r.pause() : r.started ? r.play() : r.vars.initDelay > 0 ? setTimeout(r.play, r.vars.initDelay) : r.play()
                    }))
                },
                isHidden: function() {
                    var n = u.pauseInvisible.getHiddenProp();
                    return n ? document[n] : !1
                },
                getHiddenProp: function() {
                    var t = ["webkit", "moz", "ms", "o"], n;
                    if ("hidden"in document)
                        return "hidden";
                    for (n = 0; n < t.length; n++)
                        if (t[n] + "Hidden"in document)
                            return t[n] + "Hidden";
                    return null
                }
            },
            setToClearWatchedEvent: function() {
                clearTimeout(p);
                p = setTimeout(function() {
                    s = ""
                }, 3e3)
            }
        };
        r.flexAnimate = function(t, i, s, a, v) {
            var w, p, d, b, k;
            if (r.vars.animationLoop || t === r.currentSlide || (r.direction = t > r.currentSlide ? "next" : "prev"),
            l && r.pagingCount === 1 && (r.direction = r.currentItem < t ? "next" : "prev"),
            !r.animating && (r.canAdvance(t, v) || s) && r.is(":visible")) {
                if (l && a)
                    if (w = n(r.vars.asNavFor).data("flexslider"),
                    r.atEnd = t === 0 || t === r.count - 1,
                    w.flexAnimate(t, !0, !1, !0, v),
                    r.direction = r.currentItem < t ? "next" : "prev",
                    w.direction = r.direction,
                    Math.ceil((t + 1) / r.visible) - 1 !== r.currentSlide && t !== 0)
                        r.currentItem = t,
                        r.slides.removeClass(f + "active-slide").eq(t).addClass(f + "active-slide"),
                        t = Math.floor(t / r.visible);
                    else
                        return r.currentItem = t,
                        r.slides.removeClass(f + "active-slide").eq(t).addClass(f + "active-slide"),
                        !1;
                r.animating = !0;
                r.animatingTo = t;
                i && r.pause();
                r.vars.before(r);
                r.syncExists && !v && u.sync("animate");
                r.vars.controlNav && u.controlNav.active();
                e || r.slides.removeClass(f + "active-slide").eq(t).addClass(f + "active-slide");
                r.atEnd = t === 0 || t === r.last;
                r.vars.directionNav && u.directionNav.update();
                t === r.last && (r.vars.end(r),
                r.vars.animationLoop || r.pause());
                c ? y ? (r.slides.eq(r.currentSlide).css({
                    opacity: 0,
                    zIndex: 1
                }),
                r.slides.eq(t).css({
                    opacity: 1,
                    zIndex: 2
                }),
                r.wrapup(p)) : (r.slides.eq(r.currentSlide).css({
                    zIndex: 1
                }).animate({
                    opacity: 0
                }, r.vars.animationSpeed, r.vars.easing),
                r.slides.eq(t).css({
                    zIndex: 2
                }).animate({
                    opacity: 1
                }, r.vars.animationSpeed, r.vars.easing, r.wrapup)) : (p = h ? r.slides.filter(":first").height() : r.computedW,
                e ? (d = r.vars.itemMargin,
                k = (r.itemW + d) * r.move * r.animatingTo,
                b = k > r.limit && r.visible !== 1 ? r.limit : k) : b = r.currentSlide === 0 && t === r.count - 1 && r.vars.animationLoop && r.direction !== "next" ? o ? (r.count + r.cloneOffset) * p : 0 : r.currentSlide === r.last && t === 0 && r.vars.animationLoop && r.direction !== "prev" ? o ? 0 : (r.count + 1) * p : o ? (r.count - 1 - t + r.cloneOffset) * p : (t + r.cloneOffset) * p,
                r.setProps(b, "", r.vars.animationSpeed),
                r.transitions ? (r.vars.animationLoop && r.atEnd || (r.animating = !1,
                r.currentSlide = r.animatingTo),
                r.container.unbind("webkitTransitionEnd transitionend"),
                r.container.bind("webkitTransitionEnd transitionend", function() {
                    clearTimeout(r.ensureAnimationEnd);
                    r.wrapup(p)
                }),
                clearTimeout(r.ensureAnimationEnd),
                r.ensureAnimationEnd = setTimeout(function() {
                    r.wrapup(p)
                }, r.vars.animationSpeed + 100)) : r.container.animate(r.args, r.vars.animationSpeed, r.vars.easing, function() {
                    r.wrapup(p)
                }));
                r.vars.smoothHeight && u.smoothHeight(r.vars.animationSpeed)
            }
        }
        ;
        r.wrapup = function(n) {
            c || e || (r.currentSlide === 0 && r.animatingTo === r.last && r.vars.animationLoop ? r.setProps(n, "jumpEnd") : r.currentSlide === r.last && r.animatingTo === 0 && r.vars.animationLoop && r.setProps(n, "jumpStart"));
            r.animating = !1;
            r.currentSlide = r.animatingTo;
            r.vars.after(r)
        }
        ;
        r.animateSlides = function() {
            !r.animating && w && r.flexAnimate(r.getTarget("next"))
        }
        ;
        r.pause = function() {
            clearInterval(r.animatedSlides);
            r.animatedSlides = null;
            r.playing = !1;
            r.vars.pausePlay && u.pausePlay.update("play");
            r.syncExists && u.sync("pause")
        }
        ;
        r.play = function() {
            r.playing && clearInterval(r.animatedSlides);
            r.animatedSlides = r.animatedSlides || setInterval(r.animateSlides, r.vars.slideshowSpeed);
            r.started = r.playing = !0;
            r.vars.pausePlay && u.pausePlay.update("pause");
            r.syncExists && u.sync("play")
        }
        ;
        r.stop = function() {
            r.pause();
            r.stopped = !0
        }
        ;
        r.canAdvance = function(n, t) {
            var i = l ? r.pagingCount - 1 : r.last;
            return t ? !0 : l && r.currentItem === r.count - 1 && n === 0 && r.direction === "prev" ? !0 : l && r.currentItem === 0 && n === r.pagingCount - 1 && r.direction !== "next" ? !1 : n === r.currentSlide && !l ? !1 : r.vars.animationLoop ? !0 : r.atEnd && r.currentSlide === 0 && n === i && r.direction !== "next" ? !1 : r.atEnd && r.currentSlide === i && n === 0 && r.direction === "next" ? !1 : !0
        }
        ;
        r.getTarget = function(n) {
            return r.direction = n,
            n === "next" ? r.currentSlide === r.last ? 0 : r.currentSlide + 1 : r.currentSlide === 0 ? r.last : r.currentSlide - 1
        }
        ;
        r.setProps = function(n, t, i) {
            var u = function() {
                var i = n ? n : (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo
                  , u = function() {
                    if (e)
                        return t === "setTouch" ? n : o && r.animatingTo === r.last ? 0 : o ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : r.animatingTo === r.last ? r.limit : i;
                    switch (t) {
                    case "setTotal":
                        return o ? (r.count - 1 - r.currentSlide + r.cloneOffset) * n : (r.currentSlide + r.cloneOffset) * n;
                    case "setTouch":
                        return o ? n : n;
                    case "jumpEnd":
                        return o ? n : r.count * n;
                    case "jumpStart":
                        return o ? r.count * n : n;
                    default:
                        return n
                    }
                }();
                return Math.floor(u) * -1 + "px"
            }();
            r.transitions && (u = h ? "translate3d(0," + u + ",0)" : "translate3d(" + u + ",0,0)",
            i = i !== undefined ? i / 1e3 + "s" : "0s",
            r.container.css("-" + r.pfx + "-transition-duration", i),
            r.container.css("transition-duration", i));
            r.args[r.prop] = u;
            (r.transitions || i === undefined) && r.container.css(r.args);
            r.container.css("transform", u)
        }
        ;
        r.setup = function(t) {
            if (c)
                r.slides.css({
                    width: "100%",
                    float: "left",
                    marginRight: "-100%",
                    position: "relative"
                }),
                t === "init" && (y ? r.slides.css({
                    opacity: 0,
                    display: "block",
                    webkitTransition: "opacity " + r.vars.animationSpeed / 1e3 + "s ease",
                    zIndex: 1
                }).eq(r.currentSlide).css({
                    opacity: 1,
                    zIndex: 2
                }) : r.vars.fadeFirstSlide == !1 ? r.slides.css({
                    opacity: 0,
                    display: "block",
                    zIndex: 1
                }).eq(r.currentSlide).css({
                    zIndex: 2
                }).css({
                    opacity: 1
                }) : r.slides.css({
                    opacity: 0,
                    display: "block",
                    zIndex: 1
                }).eq(r.currentSlide).css({
                    zIndex: 2
                }).animate({
                    opacity: 1
                }, r.vars.animationSpeed, r.vars.easing)),
                r.vars.smoothHeight && u.smoothHeight();
            else {
                var i, s;
                t === "init" && (r.viewport = n('<div class="' + f + 'viewport"><\/div>').css({
                    overflow: "hidden",
                    position: "relative"
                }).appendTo(r).append(r.container),
                r.cloneCount = 0,
                r.cloneOffset = 0,
                o && (s = n.makeArray(r.slides).reverse(),
                r.slides = n(s),
                r.container.empty().append(r.slides)));
                r.vars.animationLoop && !e && (r.cloneCount = 2,
                r.cloneOffset = 1,
                t !== "init" && r.container.find(".clone").remove(),
                r.container.append(u.uniqueID(r.slides.first().clone().addClass("clone")).attr("aria-hidden", "true")).prepend(u.uniqueID(r.slides.last().clone().addClass("clone")).attr("aria-hidden", "true")));
                r.newSlides = n(r.vars.selector, r);
                i = o ? r.count - 1 - r.currentSlide + r.cloneOffset : r.currentSlide + r.cloneOffset;
                h && !e ? (r.container.height((r.count + r.cloneCount) * 200 + "%").css("position", "absolute").width("100%"),
                setTimeout(function() {
                    r.newSlides.css({
                        display: "block"
                    });
                    r.doMath();
                    r.viewport.height(r.h);
                    r.setProps(i * r.h, "init")
                }, t === "init" ? 100 : 0)) : (r.container.width((r.count + r.cloneCount) * 200 + "%"),
                r.setProps(i * r.computedW, "init"),
                setTimeout(function() {
                    r.doMath();
                    r.newSlides.css({
                        width: r.computedW,
                        float: "left",
                        display: "block"
                    });
                    r.vars.smoothHeight && u.smoothHeight()
                }, t === "init" ? 100 : 0))
            }
            e || r.slides.removeClass(f + "active-slide").eq(r.currentSlide).addClass(f + "active-slide");
            r.vars.init(r)
        }
        ;
        r.doMath = function() {
            var f = r.slides.first()
              , n = r.vars.itemMargin
              , t = r.vars.minItems
              , u = r.vars.maxItems;
            r.w = r.viewport === undefined ? r.width() : r.viewport.width();
            r.h = f.height();
            r.boxPadding = f.outerWidth() - f.width();
            e ? (r.itemT = r.vars.itemWidth + n,
            r.minW = t ? t * r.itemT : r.w,
            r.maxW = u ? u * r.itemT - n : r.w,
            r.itemW = r.minW > r.w ? (r.w - n * (t - 1)) / t : r.maxW < r.w ? (r.w - n * (u - 1)) / u : r.vars.itemWidth > r.w ? r.w : r.vars.itemWidth,
            r.visible = i.numItems,
            r.move = r.vars.move > 0 && r.vars.move < r.visible ? r.vars.move : r.visible,
            r.pagingCount = Math.ceil((r.count - r.visible) / r.move) + 1,
            r.last = r.pagingCount - 1,
            r.limit = r.pagingCount === 1 ? 0 : r.vars.itemWidth > r.w ? r.itemW * (r.count - 1) + n * (r.count - 1) : (r.itemW + n) * r.count - r.w - n) : (r.itemW = r.w,
            r.pagingCount = r.count,
            r.last = r.count - 1);
            r.computedW = r.itemW - r.boxPadding
        }
        ;
        r.update = function(n, t) {
            r.doMath();
            e || (n < r.currentSlide ? r.currentSlide += 1 : n <= r.currentSlide && n !== 0 && (r.currentSlide -= 1),
            r.animatingTo = r.currentSlide);
            r.vars.controlNav && !r.manualControls && (t === "add" && !e || r.pagingCount > r.controlNav.length ? u.controlNav.update("add") : (t === "remove" && !e || r.pagingCount < r.controlNav.length) && (e && r.currentSlide > r.last && (r.currentSlide -= 1,
            r.animatingTo -= 1),
            u.controlNav.update("remove", r.last)));
            r.vars.directionNav && u.directionNav.update()
        }
        ;
        r.addSlide = function(t, i) {
            var u = n(t);
            r.count += 1;
            r.last = r.count - 1;
            h && o ? i !== undefined ? r.slides.eq(r.count - i).after(u) : r.container.prepend(u) : i !== undefined ? r.slides.eq(i).before(u) : r.container.append(u);
            r.update(i, "add");
            r.slides = n(r.vars.selector + ":not(.clone)", r);
            r.setup();
            r.vars.added(r)
        }
        ;
        r.removeSlide = function(t) {
            var i = isNaN(t) ? r.slides.index(n(t)) : t;
            r.count -= 1;
            r.last = r.count - 1;
            isNaN(t) ? n(t, r.slides).remove() : h && o ? r.slides.eq(r.last).remove() : r.slides.eq(t).remove();
            r.doMath();
            r.update(i, "remove");
            r.slides = n(r.vars.selector + ":not(.clone)", r);
            r.setup();
            r.vars.removed(r)
        }
        ;
        u.init()
    }
    ;
    n(window).blur(function() {
        focused = !1
    }).focus(function() {
        focused = !0
    });
    n.flexslider.defaults = {
        namespace: "flex-",
        selector: ".slides > li",
        animation: "fade",
        easing: "swing",
        direction: "horizontal",
        reverse: !1,
        animationLoop: !0,
        smoothHeight: !1,
        startAt: 0,
        slideshow: !0,
        slideshowSpeed: 7e3,
        animationSpeed: 600,
        initDelay: 0,
        randomize: !1,
        fadeFirstSlide: !0,
        thumbCaptions: !1,
        numItems: 1,
        pauseOnAction: !0,
        pauseOnHover: !1,
        pauseInvisible: !0,
        useCSS: !0,
        touch: !0,
        video: !1,
        controlNav: !0,
        directionNav: !0,
        prevText: "",
        nextText: "",
        keyboard: !0,
        multipleKeyboard: !1,
        mousewheel: !1,
        pausePlay: !1,
        pauseText: "Pause",
        playText: "Play",
        controlsContainer: "",
        manualControls: "",
        customDirectionNav: "",
        sync: "",
        asNavFor: "",
        itemWidth: 0,
        itemMargin: 0,
        minItems: 1,
        maxItems: 0,
        move: 0,
        allowOneSlide: !0,
        start: function() {},
        before: function() {},
        after: function() {},
        end: function() {},
        added: function() {},
        removed: function() {},
        init: function() {}
    };
    n.fn.flexslider = function(t) {
        if (t === undefined && (t = {}),
        typeof t == "object")
            return this.each(function() {
                var i = n(this)
                  , u = t.selector ? t.selector : ".slides > li"
                  , r = i.find(u);
                r.length === 1 && t.allowOneSlide === !0 || r.length === 0 ? (r.fadeIn(400),
                t.start && t.start(i)) : i.data("flexslider") === undefined && new n.flexslider(this,t)
            });
        var i = n(this).data("flexslider");
        switch (t) {
        case "play":
            i.play();
            break;
        case "pause":
            i.pause();
            break;
        case "stop":
            i.stop();
            break;
        case "next":
            i.flexAnimate(i.getTarget("next"), !0);
            break;
        case "prev":
        case "previous":
            i.flexAnimate(i.getTarget("prev"), !0);
            break;
        default:
            typeof t == "number" && i.flexAnimate(t, !0)
        }
    }
}
)(jQuery);
