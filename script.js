var panel = document.getElementById("panel");
var qs= [];
var seq = [];
var prev;
const delay = 500;

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
		var quarter = "<div id='" + id + "' class='quarter'></div>";
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
				playSound(x);
			}
		})(i);

		//bind bg color
		q.style.backgroundColor = colors[i];
	}

}

function playSound(i) {
	var sound = new Audio(soundURLs[i]);
	setOpacity(qs[i], .2);
	sound.play();
}

function addMove() {
	var move = Math.floor(Math.random() * 4);
	seq.push(move);
}

function playSeq(s) {
	var i = 0	
	function playNext() {
		//reset opacity
		if(i > 0) {
			var prev = s[i -1];
			setOpacity(qs[prev], 1);
		} 

		playSound(s[i++]);
		if(i < s.length) {
			console.log(i-1)
			setTimeout(playNext, delay)
		}
	}
	playNext();
}

function setOpacity(el, op) {
	el.style.opacity = op;
}


//TEST
for(var i = 0; i < 10; i++) {
	addMove();
}

init();

playSeq(seq);


	
