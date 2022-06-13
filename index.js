var time = document.querySelector(".time");
var playButton = document.getElementById("playButton");
var words = document.querySelector(".words");
var timerContainer = document.querySelector(".time");
var scoreContainer = document.querySelector(".score");
var points = 0;
var seconds = 60;
var typed;
var word;
var spans;

const list = ["CASA", "AMAPOLA", "DINOSAURIO"];

function timer() {
	points = 0;
	playButton.disabled = true;
	var timeInterval = setInterval(function(){
		seconds--;
		time.innerHTML = seconds;
		if (seconds == 0) {
			scoreContainer.innerHTML = "0";
			alert("Time is up! you've got " + points + " points")
			words.innerHTML = "";
			playButton.disabled = false;
			seconds = 60;
			timerContainer = "60";
			clearInterval(timeInterval)
		}
	}, 1000);
}

function randWord() {
	words.innerHTML = "";
	var random = Math.floor(Math.random() * ((list.length-1) - 0 + 1)) + 0;
	var wordArray = list[random].split("");
	for (var i = 0; i < wordArray.length; i++) {
		var span = document.createElement("span");
		span.classList.add("span");
		span.innerHTML = wordArray[i];
		words.appendChild(span);
	  }
	spans = document.querySelectorAll(".span")
	console.log(spans)
}

function typing(e) {
	typed = String.fromCharCode(e.which);

	console.log(typed);

	for (var i = 0; i < spans.length; i++) {
		if (spans[i].innerHTML === typed) {
			if (spans[i].classList.contains("bg")) {
				continue;
			} else if (
				(spans[i].classList.contains("bg") == false && spans[i - 1] == undefined) || spans[i - 1].classList.contains("bg") != false
			) {
				spans[i].classList.add("bg");
				break;
			}
		}
	}

	var checker = 0;
	for (var i = 0; i < spans.length; i++) {
		if (spans[i].className == "span bg") {
			checker++;
		}

		if (checker == spans.length) {
			words.classList.add("animated");
			words.classList.add("fadeOut");
			points++;
			scoreContainer.innerHTML = points;
			setTimeout(function() {
				words.className = "words"
				randWord();
				document.addEventListener("keydown", typing, false);
			}, 400);
		}
	}
}

playButton.addEventListener("click", function(e) {
	timer();
	randWord();
});

document.addEventListener("keydown", typing, false);