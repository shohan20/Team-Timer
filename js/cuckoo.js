var bubbles={
    fullname: "masum",
    id: "A_A5zxyG7BSiGAkxAAFN",
    initials: "M",
    sessions : {
        breakTime: {
            durations: [10, 15, 25],
            streak: 0,
            sum: 0
        },
        currentType: "work",
        work: {
            durations: [5, 10, 15, 20, 25],
            maxStreak: 1500,
            streak: 0,
            sum: 0
        }
    },
    flags: {
        _isBreakTime: false
    }

};
function generateBubbles(e) {
    //console.log('haha');
    function t(e) {
        return function(t) {
            var a = l[t.cluster];
            if (a !== t) {
                var s = t.x - a.x
                    , o = t.y - a.y
                    , n = Math.sqrt(s * s + o * o)
                    , i = t.radius + a.radius;
                n !== i && (n = (n - i) / n * e,
                    t.x -= s *= n,
                    t.y -= o *= n,
                    a.x += s,
                    a.y += o)
            }
        }
    }
    function a(e) {
        var t = d3.geom.quadtree(v);
        return function(a) {
            var s = a.radius + c + Math.max(i, r)
                , o = a.x - s
                , n = a.x + s
                , u = a.y - s
                , d = a.y + s;
            t.visit(function(t, s, c, m, p) {
                if (t.point && t.point !== a) {
                    var l = a.x - t.point.x
                        , f = a.y - t.point.y
                        , v = Math.sqrt(l * l + f * f)
                        , k = a.radius + t.point.radius + (a.cluster === t.point.cluster ? i : r);
                    v < k && (v = (v - k) / v * e,
                        a.x -= l *= v,
                        a.y -= f *= v,
                        t.point.x += l,
                        t.point.y += f)
                }
                return s > n || m < o || c > d || p < u
            })
        }
    }
    var s = e;
    $(".js-bubble-container svg") && $(".js-bubble-container svg").remove();
    var o = window.innerWidth
        , n = window.innerHeight
        , i = 30
        , r = 6
        , c = 80
        , u = e.sessions[e.sessions.currentType].durations;
    $.inArray("HAVE A-BREAK", u) < 0 && $.inArray("SKIP-BREAK", u) < 0 && (e.flags._isBreakTime ? u.push("SKIP-BREAK") : u.push("HAVE A-BREAK"));
    var d;
    if (1 === u.length)
        d = 0;
    else {
        var m = u.slice(0, -1).reduce(function(e, t) {
            return e + t
        });
        d = parseInt(m / u.length)
    }
    var p = u.length
        , l = new Array(1)
        , f = function(e) {
        var t, a;
        o > 800 ? (t = 30,
            a = 90) : (t = 20,
            a = 30);
        var s = t + 1.4 * e;
        return s >= t + a ? a : s
    }
        , v = d3.range(p).map(function(e) {
        var t;
        t = isNaN(u[e]) ? d : u[e];
        var a = Math.floor(1 * Math.random())
            , s = {
            name: u[e],
            cluster: a,
            radius: f(t),
            x: 200 * Math.cos(a / 1 * 2 * Math.PI) + o / 2 + Math.random(),
            y: 200 * Math.sin(a / 1 * 2 * Math.PI) + n / 2 + Math.random()
        };
        return (!l[a] || t > l[a].radius) && (l[a] = s),
            s
    });
    force = d3.layout.force().nodes(v).size([o, n]).gravity(.4).charge(0).on("tick", function(e) {
        k.each(t(10 * e.alpha * e.alpha)).each(a(.5)).attr("transform", function(e) {
            return "translate(" + e.x + "," + e.y + ")"
        })
    }).start();
    var k = d3.select(".js-bubble-container").append("svg").attr("width", o).attr("height", n).selectAll("circle").data(v).enter().append("g").attr("class", "bubble js-bubble-play").attr("data-duration", function(e) {
        return e.name
    }).call(force.drag);
    k.append("circle").attr("class", "bubble__circle").attr("r", function(e) {
        return e.radius
    }),
        k.append("text").text(function(e) {
            return e.name
        }).attr("dx", 0).attr("dy", ".35em").attr("y", function(e) {
            return isNaN(e.name) ? e.radius / -6 : 0
        }).attr("class", "bubble__text").attr("font-size", function(e) {
            return isNaN(e.name) ? e.radius / 3.5 : .8 * e.radius
        }).attr("letter-spacing", function(e) {
            if (isNaN(e.name))
                return "0.2em"
        }).text(function(e) {
            return e.name
        }).call(function(e, t) {
            e.each(function() {
                for (var e = d3.select(this), a = e.text().split("-").reverse(), s = a.pop(), o = [], n = 0, i = e.attr("y"), r = parseFloat(e.attr("dy")), c = e.text(null).append("tspan").attr("x", 0).attr("y", i).attr("dy", r + "em"); s; ) {
                    if (o.push(s),
                            c.text(o.join(" ")).attr("dy", function() {
                                return a.length >= 1 ? "-0.05em" : r + "em"
                            }),
                        c.node().getComputedTextLength() > t && o.length > 1) {
                        o.pop(),
                            c.text(o.join(" ")),
                            o = [s];
                        var u = 1.1 * ++n + r;
                        c = e.append("tspan").attr("x", 0).attr("y", i).attr("dy", u + "em").text(s)
                    }
                    s = a.pop()
                }
            })
        }, 40),
        $(".js-bubble-play").on("click", function() {
            console.log("clickeddd");

            duration = $(this).attr("data-duration"),
                isNaN(duration) ? skipSessionType() : timerStart(parseInt(duration))


        });
    var g;
    window.onresize = function() {
        clearTimeout(g),
            g = setTimeout(function() {
                generateBubbles(s)
            }, 200)
    }
}
function joinCuckoo() {
    /*var e = Cookies.getJSON("cuckooUser");
    e && e.fullname ? (socket.emit("update user", e.fullname),
    e.email && socket.emit("change email", e.email)) : $(".js-page--name").fadeIn()*/
    updateSettings(bubbles);
    updateSessions(bubbles);
    updateStates(bubbles);


}

var timeinterval;
var timeRemain=0;
var baseTime=0;
var health=100;


function timerStart(e) {
    console.log('timerStart '+ e);
    $('.js-bubble-container').hide();
    $('.timer').css('transform', 'translate(-50%, -50%)');

    //Math.parseInt(e);

    timeRemain=parseInt(e)*60;
    baseTime= timeRemain;

    updateClock();
    timeinterval = setInterval(updateClock,1000);
}

function updateClock(){

    timeRemain--;

    var min= Math.floor(timeRemain/60);
    var sec= timeRemain%60;

    var showSec=("0"+sec).slice(-2);

    document.getElementById('clock').innerHTML=min+":"+showSec;

    if(timeRemain<=0){
        console.log("time remain 0");
        clearInterval(timeinterval);


        setPetHealth(true);

        if(bubbles.sessions.currentType=='work'){

            bubbles.sessions.currentType='breakTime';
            bubbles.flags._isBreakTime=true;
        }
        else {

            bubbles.sessions.currentType = 'work';
            bubbles.flags._isBreakTime=false;
        }
        updateSessions(bubbles);
        updateStates(bubbles);


        $('.timer').css('transform', 'translate(-200%, -200%)');
        $('.js-bubble-container').show();
    }
}

function timerAction(e) {
    //console.log("pause clicked");
    //socket.emit(e + " timer");

    if(e=='pause'){
        $('.link-events').show();
        $('.link-event--pause').hide();
        clearInterval(timeinterval);
    } else if(e=='play'){
        $('.link-events').hide();
        $('.link-event--pause').show();
        clearInterval(timeinterval);
        timeinterval = setInterval(updateClock,1000);
    } else if(e=='reset'){
        $('.link-events').hide();
        $('.link-event--pause').show();
        timeRemain= baseTime;
        clearInterval(timeinterval);
        updateClock();
        timeinterval = setInterval(updateClock,1000);
    } else if(e=='stop'){
        clearInterval(timeinterval);
        $('.timer').css('transform', 'translate(-200%, -200%)');
        $('.js-bubble-container').show();
    }
}

function setHealthGif(h) {
    console.log(h);
    var gif = $('#pet-gif');
    //console.log(gif);
    if(h>=91) {
        gif.attr("src", 'image/anim/cat_91_100.gif');
    }
    else if(h>=81 && h<=90) {
        gif.attr("src", 'image/anim/cat_81_90.gif');
    }
    else if(h>=71 && h<=80) {
        gif.attr("src", 'image/anim/cat_71_80.gif');
    }
    else if(h>=61 && h<=70) {
        gif.attr("src", 'image/anim/cat_61_70.gif');
    }
    else if(h>=41 && h<=60) {
        gif.attr("src", 'image/anim/cat_41_60.gif');
    }
    else if(h>=21 && h<=40) {
        gif.attr("src", 'image/anim/cat_21_40.gif');
    }
    else {
        gif.attr("src", 'image/anim/cat_0_20.gif');
    }
}



function getPetHealth() {

    //document.getElementById("pet-health").style.width=health+"%";


    $.post("../php/getHealth.php", {
        data: 'none'
    }, function (data) {
        console.log(data);
        health= parseInt(data);
        document.getElementById("pet-health").style.width=health+"%";
        setHealthGif(health);

    }).fail(function() {
        //alert( "error" );
        health= 100;
        document.getElementById("pet-health").style.width=health+"%";
        setHealthGif(health);
    });

}

getPetHealth();


function setPetHealth(pos) {

    var rad=  Math.round(health*10/100);

    if(pos==true){
        health+=rad;
    }else{
        health-=rad;
    }

    if(health<0){
        health=0;
    }

    if(health>100){
        health=100;
    }
    
    setHealthGif(health);
    document.getElementById("pet-health").style.width=health+"%";

    $.post("../php/setHealth.php", {

        health: health

    }, function (data) {
        console.log(data);


    });

}


function removeSession(e) {
    var t = $(e).parents(".js-sessions").attr("data-session-type")
        , a = parseInt($(e).parent().text());
    //socket.emit("remove session", t, a)

    if(bubbles.sessions.currentType=="work")
        bubbles.sessions.work.durations.pop();
    else
        bubbles.sessions.breakTime.durations.pop();
    if(t=="work") {

        var index = bubbles.sessions.work.durations.indexOf(+a);
        if (index > -1) {
            bubbles.sessions.work.durations.splice(index,1);
        }
    }
    else {

        var index = bubbles.sessions.breakTime.durations.indexOf(+a);
        if (index > -1) {
            bubbles.sessions.breakTime.durations.splice(index,1);
        }
    }

    console.log(bubbles);
    updateSettings(bubbles);

    if(bubbles.sessions.currentType==t)
        generateBubbles(bubbles);



}
function removeRoadmapSession(e) {
  //  e = $(e).parents(".roadmap__item"),
    //    socket.emit("delete roadmap", e.attr("id"))
}

function skipSessionType() {

    setPetHealth(false);

    //socket.emit("skip session")
    var index = bubbles.sessions.work.durations.indexOf("HAVE A-BREAK");
    if (index > -1) {
        bubbles.sessions.work.durations.splice(index,1);
    }
    var index = bubbles.sessions.breakTime.durations.indexOf("SKIP-BREAK");
    if (index > -1) {
        bubbles.sessions.work.durations.splice(index,1);
    }
    if(bubbles.sessions.currentType=='work'){

        bubbles.sessions.currentType='breakTime';
        bubbles.flags._isBreakTime=true;
    }
    else {

        bubbles.sessions.currentType = 'work';
        bubbles.flags._isBreakTime=false;
    }

    updateSessions(bubbles);
    updateStates(bubbles);
}

function presetSessions(e) {
    //socket.emit("preset session", e)
}

function activateDeactivateRoadmap() {
  //  socket.emit("activate/deactivate roadmap")
}

function createRoadmapSession(e) {
 //   socket.emit("create roadmap", e)
}
function clearRoadmap() {
 //   socket.emit("clear roadmap")
}
function changePieconColor(e) {
    var t;
    t = "#42A5F0" === e ? "#BADEFA" : "#6B6DE2" === e ? "#C9CAF4" : "#FFF",
        Piecon.setOptions({
            color: e,
            shadow: e,
            background: t
        })
}

function toggleSidebar(e) {
    $(".js-sidebar-content").hide(),
        $(".js-sidebar-content[data-sidebar-content=" + e + "]").show();
    var t = document.body.classList;
    t.contains("isSidebarOpened") ? $(".js-sidebar").attr("data-content-active") === e && t.remove("isSidebarOpened") : t.add("isSidebarOpened"),
        $(".js-sidebar").attr("data-content-active", e)
}
function toggleSwitcher(e) {
    $(".js-switcher").attr("data-content-active", e)
}
function updateCuckoo(e) {
    updateStates(e),
        updateSettings(e)
}
function updateTimer(e) {
    $(".js-timer").text(e.currentFormatted),
        $(".js-progress-bar").height(e.currentProgress + "%"),
        e.current <= 0 ? (Piecon.reset(),
            document.title = "Cuckoo - Timer for remote teams") : (Piecon.setProgress(e.currentProgress),
            updateTitleBar(e)),
        updateRoadmapProgress(e.roadmap)
}

function updateTitleBar(e) {
    e.roadmap ? document.title = e.currentFormatted + " - " + e.roadmap.sessionPurpose : document.title = e.currentFormatted
}

function updateActivity(e) {
    var t = e.activity
        , a = $(".js-activity");
    a.empty();
    for (var s = 0; s < t.length; s++) {
        var o = $('<div class="activity__item"><div class="activity__info">' + t[s].message + '<span class="activity__time">' + t[s].time_since + "</span></div></div>")
            , n = t[s].user;
        o.prepend(createAvatarElement(n)),
            a.append(o)
    }
}

function updateRoadmap(e) {
    var t = $(".js-roadmaps");
    t.empty(),
        e.sessions.forEach(function(e) {
            var a = $('<div id="' + e.id + '" class="roadmap__item"><div class="roadmap__duration">' + e.duration + '</div><div class="roadmap__title">' + e.title + '</div><div class="sidebar__delete" onclick="removeRoadmapSession(this)"><img src="images/icon-close-circle.svg"></div></div>');
            e.current && a.addClass("isCurrent"),
            e.finished && a.addClass("isFinished"),
                t.append(a)
        })
}

function updateRoadmapProgress(e) {
    e ? ($(".js-roadmap-eta-progress").width(e.currentProgress + "%"),
        $(".js-roadmap-eta-progress").attr("data-current", e.currentFormatted),
        $(".js-roadmap-eta-remaining").text(e.remainingFormatted)) : ($(".js-roadmap-eta-progress").width("0%"),
        $(".js-roadmap-eta-progress").removeAttr("data-current"),
        $(".js-roadmap-eta-remaining").text("--:--"))
}

function updateStates(e) {
    var t = document.body.classList;
    e.flags._isTimerPaused ? t.add("timerIsPaused") : t.remove("timerIsPaused"),
        e.flags._isTimerActive ? (t.add("timerIsActive"),
            dismissBubbles()) : t.remove("timerIsActive"),
        e.flags._isTimerRunning ? t.add("isTimerIsRunning") : t.remove("isTimerIsRunning"),
        e.flags._isTimerFinished ? t.add("isTimerFinished") : t.remove("isTimerFinished"),
        e.flags._isBreakTime ? (changePieconColor("#42A5F0"),
            t.add("isBreakTime")) : (changePieconColor("#6B6DE2"),
            t.remove("isBreakTime")),
        e.flags._isRoadmapActive ? t.add("isRoadmapActive") : t.remove("isRoadmapActive"),
        e.flags._isMessageOnly ? t.add("isMessageOnly") : t.remove("isMessageOnly"),
        $(".js-timer-purpose").html(e.sessionPurpose);
        if(e.flags._isTimerActive)
            updateTimer(e.timer)
}

function updateSettings(e) {
    function t(e, t) {
        var s = $(".js-sessions[data-session-type=" + t + "]");
        s.children().remove();
        for (var o = 0; o < e.length; o++)
            a(e[o], s)
    }
    function a(e, t) {
        var a = '<div class="sidebar__session">' + e + '<div class="js-remove-session sidebar__delete" onclick="removeSession(this)"><img src="https://cuckoo.team/images/icon-close-circle.svg"></div></div>';
        $(t).append(a)
    }
    t(e.sessions.work.durations, "work"),
        t(e.sessions.breakTime.durations, "breakTime")
}

function updateSessions(e) {
    e.flags._isRoadmapActive || generateBubbles(e)
}

function updateUsers(e) {
    var t = $(".js-team__list")
        , a = $(".js-team__info");
    a.empty(),
        a.append("<span>" + e.length + " member(s) in this Cuckoo.</span>"),
        t.find(".avatar").remove(),
        e.forEach(function(e) {
            t.prepend(createAvatarElement(e))
        })
}

function updateUser(e) {
    Cookies.set("cuckooUser", e, {
        expires: 365
    }),
    e.fullname && $(".js-username").val(e.fullname),
    e.email && $(".js-email").val(e.email),
        $(".js-page--name").fadeOut(),
        $(".js-avatar").empty(),
        $(".js-avatar").prepend(createAvatarElement(e))
}

function createAvatarElement(e) {
    var t = $('<div class="avatar"></div>')
        , a = $('<div class="avatar__image"></div>')
        , s = $("<span></span>");
    return e.fullname && a.attr("data-fullname", e.fullname),
    e.initials && s.attr("data-label", e.initials),
    e.gravatar && (t.addClass("hasGravatar"),
        a.css("background-image", "url(" + e.gravatar + "&d=https://cuckoo.team/images/avatar-blank-slate.png)")),
    e.id === socket.id && (t.addClass("avatar--current-user"),
        a.attr("data-fullname", e.fullname + " (you)")),
    "cuckoo" === e && (t.addClass("avatar--cuckoo"),
        a.attr("data-fullname", e)),
        a.append(s),
        t.append(a),
        t
}

function dismissBubbles() {
    "undefined" != typeof force && -.5 !== force.gravity() && force.gravity(-.5).charge(10).start()
}



var clipboard = function() {
    var e = $("#js-content-clipboard");
    return 0 !== e.length && e.attr("size", e.val().length - 2),
        new Clipboard(".js-copy-clipboard")
}();

Piecon.setOptions({
    color: "#6B6DE2",
    background: "#fff",
    shadow: "#6B6DE2",
    fallback: !1
}),
    $(".js-join-cuckoo-form").submit(function(e) {
        e.preventDefault();
        var t = $("#username").val();
     //   socket.emit("update user", t)
    }),
    $(".js-change-username-form").submit(function(e) {
        e.preventDefault();
        var t = $(".js-username").val();
     //   socket.emit("change username", t)
    }),
    $(".js-change-email-form").submit(function(e) {
        e.preventDefault();
        var t = $(".js-email").val();
    //    socket.emit("change email", t)
    }),
    $(".js-add-session-form").submit(function(e) {
        e.preventDefault();
        var t = $(this).find("input")
            , a = t.val()
            , s = $(this).attr("data-session-type");
        //socket.emit("add session", s, a),
           if(bubbles.sessions.currentType=="work")
            bubbles.sessions.work.durations.pop();
           else
            bubbles.sessions.breakTime.durations.pop();

           if(s=="work") {

                var index = bubbles.sessions.work.durations.indexOf(+a);
                if (index <= -1) {
                    bubbles.sessions.work.durations.push(+a);
                }
            }
            else {

                var index = bubbles.sessions.breakTime.durations.indexOf(+a);
                if (index <= -1) {
                    bubbles.sessions.breakTime.durations.push(+a);
                }
            }
            t.val("");
            console.log(bubbles);
            updateSettings(bubbles);
        if(bubbles.sessions.currentType==s)
            generateBubbles(bubbles);

    }),
    $(".js-add-roadmap-session").submit(function(e) {
        e.preventDefault();
        var t = $(this).find(".js-roadmap-session-duration")
            , a = $(this).find(".js-roadmap-session-title")
            , s = t.val();
        createRoadmapSession({
            title: a.val(),
            duration: s
        }),
            t.val(5),
            a.val("")
    }),
    $("#js-feedback").submit(function(e) {
        e.preventDefault(),
            $.ajax({
                type: "POST",
                url: "https://hooks.zapier.com/hooks/catch/9825/5duo7l/",
                data: $("#js-feedback").serialize(),
                success: function(e) {
                    $("#js-feedback-form-response").html("Your feedback was sent. <br>Thank you! 👋"),
                        $(".js-feedback-text").val("")
                }
            })
    }),
    $(".js-sound-mouseHover").hover(function() {
        Sounds.soundCuckooMouseOver.play()
    });
var Notifications = function() {
    var e, t = window.Notify.default, a = new t("Team!",{
        body: "Time to get some rest!",
        icon: "images/desktop-icons/icon-desktop-notification-start-break.png",
        closeOnClick: !0
    }), s = new t("Team!",{
        body: "Time to make something great!",
        icon: "images/desktop-icons/icon-desktop-notification-start-work.png",
        closeOnClick: !0
    });
    return {
        timeToRest: a,
        timeToWork: s,
        verifyPermission: function() {
            t.needsPermission && t.isSupported() && t.requestPermission()
        },
        cuckooNotify: function(e) {
            e.flags._isBreakTime ? (Sounds.soundCuckooFocusEnd.play(),
                s.show()) : (Sounds.soundCuckooBreakEnd.play(),
                a.show())
        },
        inAppNotification: function(t, a) {
            t && $(".js-notification").html('<div class="notification">' + t + "</div>"),
            void 0 !== e && clearTimeout(e),
                e = setTimeout(function() {
                    $(".js-notification").empty()
                }, 1e3 * a)
        }
    }
}()
    , Shortcut = {
    init: function() {
        key("p, space, r, s, esc", function(e, t) {
            socket && socket.emit("shortcut", t.shortcut),
            "esc" === t.shortcut && document.body.classList.remove("isSidebarOpened")
        })
    }
};

$(document).click(function(e) {
    $(e.target).closest(".js-checkbox").length || $(".js-checkbox").prop("checked", !1),
    $(e.target).closest(".js-sidebar").length || document.body.classList.remove("isSidebarOpened")
});

var Sounds = {
    soundCuckooBreakEnd: new buzz.sound("https://cuckoo.team/sounds/cuckoo-break-end.wav",{
        preload: !0
    }),
    soundCuckooFocusEnd: new buzz.sound("https://cuckoo.team/sounds/cuckoo-focus-end.wav",{
        preload: !0
    }),
    soundCuckooMouseOver: new buzz.sound("https://cuckoo.team/sounds/cuckoo-mouse-over.wav",{
        preload: !0
    }),
    soundCuckooMemberJoined: new buzz.sound("https://cuckoo.team/sounds/cuckoo-member-joined.wav",{
        preload: !0
    })
};
Shortcut.init(),
    Notifications.verifyPermission(),
    FastClick.attach(document.body),
    joinCuckoo();

