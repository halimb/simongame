const STEP_LIMIT = 20;
const DELAY = 500;

const SOUNDS = [
    "sound/b.mp3",
    "sound/csharp.mp3",
    "sound/e.mp3",
    "sound/a.mp3",
    "sound/g.mp3"
];

const COLORS = [
    "#FF4D23",
    "#FFE523",
    "#5D29B8",
    "#1BC05E"
];

var restartBtn = document.getElementById("restart");
var strictBtn = document.getElementById("strict");
var panel = document.getElementById("panel");
var hint = document.getElementById("hint");
var disp = document.getElementById("disp");
var t = [];
var qs = [];
var seq = [];
var prev;
var curr = 0;
var idle = true;
var playing = false;
var strict = false;

hint.onclick = getHint;
restartBtn.onclick = restart;
strictBtn.onclick = toggleStrict;

init();

function init() {
    // inflate the quarter divs
    for (let i = 0; i < 4; i++) {
        var id = "q" + i;
        var quarter = "<div id='" + id + "' class='quarter'></div>";
        panel.innerHTML += quarter;
    }
    // bind sounds and set bg color
    for (var i = 0; i < 4; i++) {
        // refs
        var q = document.getElementById("q" + i);
        qs.push(q);

        //bind sound
        q.onclick = (function(x) {
            return function() {
                if (playing) {
                    getMove(x);
                    playSound(x);
                } else if (idle) {
                    t.push(setTimeout(playNext, 200));
                    idle = false;
                }
            }
        })(i);

        //bind bg color
        q.style.backgroundColor = COLORS[i];
    }

}

function setOpacity(el, op) {
    el.style.opacity = op;
}

function playSound(i, rate) {
    var sound = new Audio(SOUNDS[i]);
    if (rate) {
        sound.playbackRate = rate;
    }
    sound.play();
}

function addMove() {
    var move = Date.now() % 4;
    seq.push(move);
}

function playSeq(s) {
    var i = 0

    function next() {
        //reset opacity
        if (i > 0) {
            prev = s[i - 1];
            setOpacity(qs[prev], 1);
        }

        if (i < s.length) {
            var id = s[i];
            setOpacity(qs[id], .6);
            playSound(id);
            i++;
            t.push(setTimeout(next, DELAY));
        } else {
            setPlaying(true);
        }
    }
    next();
    showRem();
}

function showRem() {
    showMsg(seq.length, "num");
}

function playNext() {
    addMove();
    playSeq(seq);
}

function getMove(i) {
    if (playing) {
        clearTimeouts();
        //Correct move
        if (i == seq[curr]) {
            curr++;
            showMsg("=)", "num");
            t.push(setTimeout(showRem, 3 * DELAY))
            if (curr == seq.length) {
                setPlaying(false);
                curr = 0;
                //Win
                if (seq.length == STEP_LIMIT) {
                    seq = [];
                    t.push(setTimeout(final, DELAY));
                    t.push(setTimeout(playNext, 5 * DELAY));
                    return;
                }
                t.push(setTimeout(playNext, 2 * DELAY));
            }
        }

        //Wrong move
        else {
            setPlaying(false);
            seq = strict ? [] : seq;
            func = strict ?
                restart :
                function() { playSeq(seq) };
            t.push(setTimeout(
                function() { final(true) },
                DELAY / 2));
            t.push(setTimeout(func, 5 * DELAY));
            curr = 0;
            return;
        }
    }
}

function setPlaying(p) {
    if (playing != p) {
        playing = p;
        qs.forEach(function(el) {
            setInteractive(el, p);
        });
    }
}

function toggleStrict() {
    console.log("inside toggleStrict")
    strict = !strict;
    var cls = strict ?
        "btn strict" :
        "btn";

    strictBtn.className = cls;
}

function setInteractive(q, playing) {
    q.className = playing ?
        "quarter interactive" :
        "quarter idle";

    q.style.cursor = playing ?
        "pointer" :
        "default";
}

function final(loss) {
    var msg = loss ?
        "wrong<br>move<br>=(" : "win!<br>=)";
    var clas = loss ? "msg" : "win";
    var repeat = loss ? 3 : 11;
    showMsg(msg, clas);

    if (!loss) {
        clearTimeouts();
        t.push(setTimeout(restart, 4 * DELAY));
    }
    playAlert(loss, repeat);
}

function playAlert(loss, l) {
    function playNote(x) {
        var id = loss ? 4 : x % 4;
        playSound(id, 2);
        if (x < l) {
            t.push(setTimeout(
                function() { playNote(x + 1) },
                100));
        }
    }
    playNote(0);
}

function getHint() {
    if (playing) {
        var s = [seq[curr]];
        playSeq(s);
    }
}

function restart() {
    clearTimeouts();
    setPlaying(false);
    seq = [];
    curr = 0;
    showMsg("Starting<br> a new<br>game", "restart");
    t.push(setTimeout(playNext, DELAY * 3))
}

function clearTimeouts() {
    if (t.length) {
        t.forEach(function(el) {
            window.clearTimeout(el);
        });
        t = [];
    }
}

function showMsg(msg, clas) {
    var res = "<div class=" + clas + ">" + msg + "</div>"
    disp.innerHTML = res;
}