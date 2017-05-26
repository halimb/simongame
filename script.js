var panel = document.getElementById("panel");
var hint = document.getElementById("hint");
var disp = document.getElementById("disp");
var qs= [];
var seq = [];
var prev;
var curr = 0;
var idle = true;
var playing = false;
var strict = false;
const delay = 500;
const limit = 3;


var soundURLs = [ 	
		"sound/b.mp3", 
		"sound/csharp.mp3", 
		"sound/e.mp3", 
		"sound/a.mp3"
	];

var colors = [ 	
		"#FF4D23", 
		"#FFE523", 
		"#5D29B8", 
		"#1BC05E"
	];

hint.onclick = getHint;

function init() {
	// inflate the quarter divs
	for(let i = 0; i < 4; i++) {
		var id = "q" + i;
		var quarter = "<div id='" + id + "' class='quarter'><span class='num'>"+i+"</span></div>";
		panel.innerHTML += quarter;
	}
	// bind sounds and set bg color
	for(var i = 0; i < 4; i++) {
		// refs
		var q = document.getElementById("q" + i);
		qs.push(q);

		//bind sound
		q.onclick =( function(x){
			return function() {
				if(playing) {
					getMove(x);
					playSound(x);
				}
				else if(idle) {
					setTimeout(playNext, 200);
					idle = false;
				}
			}
		})(i);

		//bind bg color
		q.style.backgroundColor = colors[i];
	}

}

function setOpacity(el, op) {
	el.style.opacity = op;
}

function playSound(i) {
	var sound = new Audio(soundURLs[i]);
	sound.play();
}

function addMove() {
	var move = Math.floor(Math.random() * 4);
	seq.push(move);
}

function playSeq(s) {
	var i = 0	
	function next() {
		//reset opacity
		if(i > 0) {
			prev = s[i -1];
			setOpacity(qs[prev], 1);
		} 

		if(i < s.length) {
			var id = s[i];
			setOpacity(qs[id], .6);
			playSound(id);
			i++;
			setTimeout(next, delay);
		}
		else{
			setPlaying(true);
		}
	}
	next();
	console.log(seq)
}



//TEST
function playNext() {
	addMove();
	disp.innerHTML = seq.length;
	playSeq(seq);
}

init();


var play = document.getElementById("play");
play.onclick = function(){playSeq(seq)};



function getMove(i) {
	if(playing) {

		//Correct move
		if(i == seq[curr]) {
			curr++;
			if(curr == seq.length ) {
				curr = 0;
				//Win
				if(seq.length == limit) {
					seq = [];
					setTimeout(win, delay);
					setTimeout(playNext, 5 * delay);
					return;
				}
				setPlaying(false);
				setTimeout(playNext, 2 * delay);
			}
		}

		//Wrong move
		else {
			setPlaying(false);
			seq = strict ? [] : seq;
			func = strict ? playNext : function(){playSeq(seq)};
			setTimeout(func, 3*delay)
			curr = 0;
			return;
		}	
	}
}

function setPlaying(p) {
	if(playing != p) {
		playing = p;
		qs.forEach(function(el) {
			setInteractive(el, p);
		});	
	}
}

function setInteractive(q, playing) {
	q.className = playing ? "quarter interactive" : "quarter idle";
	q.style.cursor = playing ? "pointer" : "default !important";
}

function win() {
	var l = 9;
	function playNote(x) {
		playSound(x%5);
		if(x < l) {
			setTimeout(function(){playNote(x + 1)}, 150);
		}
	}
	playNote(0);
}

function getHint() {
	var s = [seq[curr]];
	playSeq(s);
}
