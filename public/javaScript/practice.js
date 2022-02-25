/*
Functionality on the practice page.
*/

let answered = false;
let r = 0.0;
let initialRun = true;
let initialCorrect = 0;
let cycleNumber = 1;

const readingPracticeOptions = [
	"hiragana",
	"katakana",
	"N5_kanji_kun",
	"N5_kanji_compounds",
	"date_and_time",
	"N4_kanji_kun_1",
	"N4_kanji_kun_2",
	"N3_kanji_kun_1",
	"N3_kanji_kun_2",
	"N3_kanji_kun_3",
	"test"
];

const writingPracticeOptions = [
	"hiragana",
	"test"
];

let currentOptions = [];
let baseProblems = [];
let wrongAnswers = [];
let currentProblem = {
	character: "あ",
	romaji : ["a"]
};

function loadOptions(practiceOptions) {
	currentOptions = practiceOptions;
	document.getElementById("practiceContainer").innerHTML = "";
	practiceOptions.forEach(function (option) {
		let newOption = document.createElement('div');
		newOption.innerHTML = `
			<div class="optionBox containerBox">
				<h1>${option.replace(/_/g, " ")} practice</h1>
				<button class="redButton" onclick="startPractice('${option}')">Select</button>
			</div>
		`;

		while (newOption.firstChild) {
			document.getElementById("practiceContainer").appendChild(newOption.firstChild);
		}
	})
}

function startPractice(option) {
	initialRun = true;
	initialCorrect = 0;
	cycleNumber = 1;
	let problemData = document.createElement('script');
	problemData.src = "javaScript/data/" + option + ".js";
	document.head.appendChild(problemData);
	problemData.onload = function () {
		baseProblems = eval(option);
		document.getElementById("practiceContainer").innerHTML =
		'<div id="practiceBox" class="containerBox"><button class="redButton" onclick="loadProblems()">Start</button></div>';
    }
	problemData.remove();
}

document.addEventListener("keypress", function (event) {
	if (event.key === ' ' && answered == true) {
		answered = false;
		nextProblem();
	}
});

function loadProblems() {
	if(currentOptions == readingPracticeOptions) {
		document.getElementById("practiceBox").innerHTML = `
			<h1 id="problemDisplay"></h1>
			<div id="answerDisplay"></div>
			<div id="inputField"></div>
		`;
	} else {
		document.getElementById("practiceBox").innerHTML = `
			<h1 id="problemDisplay"></h1>
			<div id="canvasDisplay"><canvas id="myCanvas" width="200px" height="200px"></canvas></div>
			<div id="drawnDisplay"></div>
			<div id="answerDisplay"></div>
			<div id="inputField"></div>
		`;
		resetCanvas();
	}

	nextProblem();
}

function nextProblem() {
	if (baseProblems.length > 0) {
		if(currentOptions == readingPracticeOptions) {
			loadReadingProblem();
		} else {
			loadWritingProblem();
		}
	} else if (wrongAnswers.length > 0) {
		baseProblems = wrongAnswers;
		wrongAnswers = [];
		initialRun = false;
		cycleNumber++;
		nextProblem();
	} else {
		document.getElementById("practiceBox").innerHTML = `
			<h1>Finished!</h1>
			<p>You answered ${initialCorrect} problems correct first try.</p>
			<p>It took you ${cycleNumber} try(s) to answer every problem.</p>
			<button class="redButton" onclick="loadOptions(currentOptions)">Try another</button>
		`;
		fetch('http://localhost:4000/calendar', {method:'POST'}).then(()=>{
			console.log('thank you!');
		})
    }
}

function loadReadingProblem() {
	r = Math.floor(Math.random() * baseProblems.length);
	currentProblem = baseProblems[r];
	baseProblems.splice(r, 1);
	document.getElementById("answerDisplay").innerHTML = '';
	document.getElementById("problemDisplay").innerHTML = currentProblem.character;
	document.getElementById("inputField").innerHTML =
		'<input id="practiceInput" class="inputBar" type="text" onkeydown="checkAnswer(this)">';
	document.getElementById("practiceInput").select();
}

function loadWritingProblem() {
	r = Math.floor(Math.random() * baseProblems.length);
	currentProblem = baseProblems[r];
	baseProblems.splice(r, 1);
	clearCanvas();
	document.getElementById("drawnDisplay").innerHTML = '';
	document.getElementById("answerDisplay").innerHTML = '';
	document.getElementById("problemDisplay").innerHTML = currentProblem.romaji;
	document.getElementById("inputField").innerHTML = `
		<button id="send" class="redButton" onclick="processImage()">Send</button>
		<button id="clear" class="redButton" onclick="clearCanvas()">Clear</button>
	`;
}

function checkAnswer(answer) {
	if (event.key === 'Enter') {
		if (currentProblem.romaji.includes(answer.value.trim())) {
			document.getElementById("answerDisplay").style.color = "green";
			if(initialRun == true) {initialCorrect++;}
		} else {
			document.getElementById("answerDisplay").style.color = "red";
			wrongAnswers.push(currentProblem);
		}
		document.getElementById("answerDisplay").innerHTML = currentProblem.romaji;
		document.getElementById("inputField").innerHTML = '<p>Press space to continue</p>';
		answered = true;
    }
}

