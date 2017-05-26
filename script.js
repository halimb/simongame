var panel = document.getElementById("panel");
var qs= [];
var seq = [];
var prev;
var curr = 0;
var playing = true;
var strict = false;
const delay = 500;
const limit = 5;


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


function init() {
	// inflate the quarter divs
	for(let i = 0; i < 4; i++) {
		var id = "q" + i;
		var quarter = "<div id='" + id + "' class='quarter'><span class='num'>"+i+"</span></div>";
		panel.innerHTML += quarter;
	}
	var centerDiv = "<div class='center'></div>";
	panel.innerHTML += centerDiv;

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
			}
		})(i);

		//bind bg color
		q.style.backgroundColor = colors[i];
	}

	playNext();
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

function playSeq() {
	var s = seq;
	var i = 0	
	function next() {
		//reset opacity
		if(i > 0) {
			prev = s[i -1];
			setOpacity(qs[prev], 1);
		} 

		if(i < s.length) {
			var id = s[i];
			setOpacity(qs[id], .2);
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
	playSeq();
}

init();


var play = document.getElementById("play");
play.onclick = playSeq;

function getMove(i) {
	if(playing) {
		if(seq.length == 1) {
			console.log("\n\n <   <   <   <   <   <   <\n\n");
		}

		if(i == seq[curr]) {
			console.log("move: "+curr+", RIGHT MOVE :)\n\n");
			curr++;
			if(curr == seq.length ) {
				console.log("congatulations !");
				curr = 0;
				
				if(seq.length == limit) {
					console.log(" restarting the game..."+
						"\n\n >   >   >   >   >   >   >\n\n\n\n");
					seq = [];
				}
				setPlaying(false);
				setTimeout(playNext, 2 * delay);
			}
		}
		else {
			console.log("move: "+curr+", WRONG MOVE :("+
				"\n restarting the game..."+
				"\n\n >   >   >   >   >   >   >\n\n\n\n");
			setPlaying(false);
			seq = strict ? [] : seq;
			func = strict ? playNext : playSeq;
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