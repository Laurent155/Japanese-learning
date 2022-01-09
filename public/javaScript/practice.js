/*
Functionality on the practice page.
*/

const problemInterface = `
	<h1 id="problemDisplay"></h1>
	<div id="answerDisplay"></div>
	<div id="inputField"><input class="inputBar" type="text" onkeydown="checkAnswer(this)"></div>
`

let practiceOptions = [
	"hiragana",
	"katakana",
	"N5_kanji_kun",
	"N5_kanji_compounds",
	"date_and_time"
];

let baseProblems = [];
let wrongAnswers = [];

let answered = false;
let r = 0.0;
let currentProblem = {
	character: "あ",
	romaji : ["a"]
};

window.onload = practiceOptions.forEach(function (option) {
	let newOption = document.createElement('div');
	newOption.innerHTML = `
		<div class="optionBox containerBox">
			<h1>${option.replace(/_/g, " ")} practice</h1>
			<button class="button" onclick="startPractice('${option}')">Select</button>
		</div>
	`;

	while (newOption.firstChild) {
		document.getElementById("selectionContainer").appendChild(newOption.firstChild);
    }
});

function startPractice(option) {
	let problemData = document.createElement('script');
	problemData.src = "javaScript/data/" + option + ".js";
	document.head.appendChild(problemData);
	problemData.onload = function () {
		baseProblems = eval(option);
		document.getElementById("selectionContainer").innerHTML = "";
		document.getElementById("practiceContainer").innerHTML =
		'<div id="practiceBox" class="containerBox"><button class="button" onclick="loadProblems()">Start</button></div>';
    }
}

document.addEventListener("keypress", function (event) {
	if (event.key === ' ' && answered == true) {
		answered = false;
		nextProblem();
	}
});

function loadProblems() {
	document.getElementById("practiceBox").innerHTML = problemInterface;
	nextProblem();
}

function nextProblem() {
	if (baseProblems.length > 0) {
		r = Math.floor(Math.random() * baseProblems.length);
		currentProblem = baseProblems[r];
		baseProblems.splice(r, 1);
		document.getElementById("answerDisplay").innerHTML = '';
		document.getElementById("problemDisplay").innerHTML = currentProblem.character;
		document.getElementById("inputField").innerHTML = '<input id="practiceInput" class="inputBar" type="text" onkeydown="checkAnswer(this)">';
		document.getElementById("practiceInput").select();
	} else if (wrongAnswers.length > 0) {
		baseProblems = wrongAnswers;
		wrongAnswers = [];
		nextProblem();
	} else {
		document.getElementById("practiceBox").innerHTML = '<h1>Finished!</h1>';
    }
}

function checkAnswer(answer) {
	if (event.key === 'Enter') {
		if (currentProblem.romaji.includes(answer.value.trim())) {
			document.getElementById("answerDisplay").style.color = "green";
		} else {
			document.getElementById("answerDisplay").style.color = "red";
			wrongAnswers.push(currentProblem);
		}
		document.getElementById("answerDisplay").innerHTML = currentProblem.romaji;
		document.getElementById("inputField").innerHTML = '<p>Press space to continue</p>';
		answered = true;
    }
}