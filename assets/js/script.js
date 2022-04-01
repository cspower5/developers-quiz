//settings
const timePerQuestion = 5,
	  wrongAnswerTimePenalty = 4,
	  correctAnswerScoreBonus = 10,
	  localStorageKey = "quiz",
	  numberOfHighScores = 5;

//app variables
var score, timer, timeRemaining, currentQuestionIndex;


function init(){
	//happens ONCE when the page loads
	document.querySelector("#start button").addEventListener("click", startGame);
	document.querySelector("#score button").addEventListener("click", storeName);
	renderHighScores();
}

//event handlers
function listenForAnswer(){
	const buttons = document.querySelectorAll("#game button");
	for (let button of buttons){
		button.addEventListener("click", handleAnswer);
	}
}

//state management
function changeState(newState){
	document.body.className = newState;
}

//output (HTML)
function showTimeRemaining(){
	document.querySelector("header span").textContent = timeRemaining;
}
function showScore(){
	document.querySelector("#score span").textContent = score;
}
function renderQuestion(question){
	let html = `
		<h2>${question.q}</h2>
		<ul>
	`;
	let answers = shuffle(question.a);
	for (let ans of answers){
		html += `<li><button>${ans}</button></li>`;
	}
	html += "</ul>";
	document.querySelector("#game").innerHTML = html;
}
function renderHighScores(){
	const data = getStorage();
	let html = ``;
	if (!data.length) html = "No High Scores Yet...";
	else {
		for (let {name, score} of data){
			html += `<li>${name}: ${score}</li>`;
		}
	}
	document.querySelector("#highscore ol").innerHTML = html;
}

//game engine
function startGame(){
	//happens every time a new game starts
	currentQuestionIndex = 0;
	score = 0;
	timeRemaining = timePerQuestion * questions.length;
	startTimer();
	loadNextQuestion();
	changeState("game");
}
function loadNextQuestion(){
	const question = questions[currentQuestionIndex];
	if (!question) return endGame(); //return stops function right there
	renderQuestion(question);
	listenForAnswer();
}
function handleAnswer(e){
	//e is the click event object
	//e.target is the button that was clicked
	//e.target.textContent is the text in the button that was clicked
	const userAnswer = e.target.textContent;
	const rightAnswer = questions[currentQuestionIndex].a[0];
	if (userAnswer === rightAnswer){
		//right answer!
		score += correctAnswerScoreBonus;
	}
	else {
		//wrong answer...
		timeRemaining -= wrongAnswerTimePenalty;
	}
	currentQuestionIndex++;
	loadNextQuestion();
}
function endGame(){
	changeState("score");
	stopTimer();
	score = Math.max(score + timeRemaining, 0);
	showScore();
}

//timer engine
function startTimer(){
	showTimeRemaining();
	timer = setInterval(tick, 1000);
}
function tick(){
	timeRemaining--;
	if (timeRemaining <= 0){
		timeRemaining = 0;
		stopTimer(); //we've run out of time
		endGame();
	}
	showTimeRemaining();
}
function stopTimer(){
	clearInterval(timer);
}

//local storage engine
function storeName(){
	const name = document.querySelector("#score input").value.trim();
	if (!name) return;
	const data = getStorage();
	data.push({name, score});
	//sort and limit before storing
	data.sort((a,b) => b.score - a.score);
	saveStorage(data.slice(0, numberOfHighScores));
	renderHighScores();
	changeState("start");
}
function getStorage(){
	const data = localStorage.getItem(localStorageKey);
	if (!data) return [];
	return JSON.parse(data);
}
function saveStorage(data){
	localStorage.setItem(localStorageKey, JSON.stringify(data));
}

//helpers
function shuffle(arr){
	return [...arr].sort(() => Math.random() - 0.5);
}

//data
const questions = [
	{
		q: "What is the answer?",
		a: [
			"Correct",
			"Wrong",
			"Very Wrong",
			"Incorrect"
		]
	},
	{
		q: "Do you know the answer?",
		a: [
			"Correct",
			"Wrong",
			"Very Wrong",
			"Incorrect"
		]
	}
];

//initialization
init();