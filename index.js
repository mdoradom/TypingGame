var time = document.querySelector(".time");
var playButton = document.querySelector("button");
var words = document.querySelector(".words");
var timerContainer = document.querySelector(".time");
var scoreContainer = document.querySelector(".score");
var points = 0;
var seconds = 60;
var typed;
var spans;

// https://rapidapi.com/dpventures/api/wordsapi/
// falta subscribirse a la api para que deje usarla
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '2cc55d8909msh0027a79098d232ep124555jsnaf7f2b4401a5',
		'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
	}
};

fetch('https://wordsapiv1.p.rapidapi.com/words/hatchback/typeOf', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));

// list of words that will be displayed during the game
const list = ["CASA", "AMAPOLA", "DINOSAURIO"];

// this method will reset all the game and start the game from 0 points and 60 remaining seconds
function timer() {
	points = 0;
	var timeInterval = setInterval(function(){ // setIntervall will execute that function every 1000 ms (1 second)
		playButton.disabled = true;
		seconds--;
		time.innerHTML = seconds;
		if (seconds === 0) {
			scoreContainer.innerHTML = "0";
			alert("Time is up! you've got " + points + " points")
			words.innerHTML = "";
			playButton.disabled = false;
			seconds = 60;
			timerContainer = "60";
			clearInterval(timeInterval) // this will reset the interval, otherwise it won't stop when it ends
		}
	}, 1000);
}


// this method will pick a random word from the list and will divide it with "span" tags between every letter, 
// so you can change the background color when the player presses one letter
function randWord() {
	words.innerHTML = ""; // this will remove the previous displayed word, otherwise the words will stack
	var random = Math.floor(Math.random() * ((list.length-1) - 0 + 1)) + 0; // gets the random word
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

// this method will check the pressed letter and compare it with the corresponding letter of the word
// the way it does that is by seeing if the span of the letter that is checking has a "bg" propertie, if it does, it will jump to the next letter
function typing(e) {
	typed = String.fromCharCode(e.which);
	console.log(typed);

	for (var i = 0; i < spans.length; i++) {
		if (spans[i].innerHTML === typed) {
			if (spans[i].classList.contains("bg")) {
				continue;
			} else if (spans[i].classList.contains("bg") === false && spans[i - 1] === undefined || spans[i - 1].classList.contains("bg") !== false) {
				spans[i].classList.add("bg");
				break;
			}
		}
	}

	var checker = 0;
	for (var j = 0; j < spans.length; j++) {
		if (spans[j].className === "span bg") {
			checker++;
		}

		if (checker === spans.length) {
			words.classList.add("animate");
			words.classList.add("fadeOut");
			points++;
			scoreContainer.innerHTML = points;
			document.removeEventListener("keydown", typing, false);
			setTimeout(function() {
				words.className = "words"
				randWord();
				document.addEventListener("keydown", typing, false);
			}, 400);
		}
	}
}

// this event will call the method timer() and randWord() when you press the Play button
playButton.addEventListener("click", function(e) {
	timer();
	randWord();
	playButton.disabled = true;
});

// this method will call the method typing() and send the key that was typed to the method
document.addEventListener("keydown", typing, false);