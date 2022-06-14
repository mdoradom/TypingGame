var time = document.querySelector(".time");
var playButton = document.querySelector("button");
var words = document.querySelector(".words");
var timerContainer = document.querySelector(".time");
var scoreContainer = document.querySelector(".score");
var leaderBoard = document.querySelector("table");
var points = 0;
var seconds = 60;
var typed;
var spans;
const list = [];

// it will get 100 words of 10 letters from the Random Word API: http://random-word-api.herokuapp.com/home
fetch('https://random-word-api.herokuapp.com/word?length=10&number=100')
	.then(response => response.json())
	.then(response => {
		for (var i = 0; i < response.length; i++) {
			list.push(response[i]);
		}
	})
	.catch(err => console.error(err));

// this method will reset all the game and start the game from 0 points and 60 remaining seconds
function timer() {
	points = 0;
	var timeInterval = setInterval(function(){ // setIntervall will execute that function every 1000 ms (1 second)
		playButton.disabled = true;
		seconds--;
		time.innerHTML = seconds;
		if (seconds == 0) {
			scoreContainer.innerHTML = "0";
			alert("Time is up! you've got " + points + " points")
			words.innerHTML = "";
			playButton.disabled = false;
			seconds = 60;
			timerContainer = "60";
			updateLeaderBoard();
			clearInterval(timeInterval) // this will reset the interval, otherwise it won't stop when it ends
		}
	}, 1000);
}


function updateLeaderBoard() {
	var row = leaderBoard.insertRow(1);
	var cel = row.insertCell(0);
	cel.innerHTML = points;
	sortTable();
}

function sortTable() {
	var rows, switching, i, x, y, shouldSwitch;
	switching = true;
	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
		//start by saying: no switching is done:
		switching = false;
		rows = leaderBoard.rows;
		/*Loop through all table rows (except the
		first, which contains table headers):*/
		for (i = 1; i < (rows.length - 1); i++) {
			//start by saying there should be no switching:
			shouldSwitch = false;
			/*Get the two elements you want to compare,
			one from current row and one from the next:*/
			x = rows[i].getElementsByTagName("TD")[0];
			y = rows[i + 1].getElementsByTagName("TD")[0];
			//check if the two rows should switch place:
			if (Number(x.innerHTML) < Number(y.innerHTML)) {
			//if so, mark as a switch and break the loop:
				shouldSwitch = true;
				break;
			}
		}
		if (shouldSwitch) {
			/*If a switch has been marked, make the switch
			and mark that a switch has been done:*/
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
		}
	}
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
		span.innerHTML = wordArray[i].toUpperCase();
		console.log(wordArray[i].toUpperCase());
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
		if (spans[i].innerHTML == typed) {
			if (spans[i].classList.contains("bg")) {
				continue;
			} else if (spans[i].classList.contains("bg") == false && spans[i - 1] == undefined || spans[i - 1].classList.contains("bg") !== false) {
				spans[i].classList.add("bg");
				break;
			}
		}
	}

	var checker = 0;
	for (var j = 0; j < spans.length; j++) {
		if (spans[j].className == "span bg") {
			checker++;
		}

		if (checker == spans.length) {
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