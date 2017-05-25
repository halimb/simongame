var panel = document.getElementById("panel");
var qs= [];
var sounds = [];
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

		//sounds
		var sound = new Audio(soundURLs[i]);
		sounds.push(sound);
		q.onclick =( function(x){
			return function() {
				sounds[x] = new Audio(soundURLs[x]);
				sounds[x].play()
			}
		})(i);

		//bg color
		q.style.backgroundColor = colors[i];
	}

}

function playSound(i) {
}
init();

	
