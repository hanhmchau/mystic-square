// JavaScript Document
var playing = false;
var paused = false;
var time = 0;
var timer;
var moveCount = 0;
var showTime = true;
var won = false;
var hasOldGame=JSON.parse(localStorage.getItem("playing"));

var pauseButtonIcon = "fa fa-pause-circle-o";
var resumeButtonIcon = "fa fa-play-circle-o";
var restartButtonIcon = "fa fa-rotate-left";

function addShutterClicker() {
	$("#shutter").on("click tap", function () {
		if (!playing) {
			startNewGame();
		} else {
			if (showTime) {
				startTimer();
			}
			hideShutter();
			changeLabel("pause", "Pause", pauseButtonIcon);
		}
	});
}

function addPieceClicker(){
	$(".piece").on("click tap", function (event) {
		if (playing && !paused) {
			moveMouse(event.target.parentNode);
		}
	});
}

$(document).ready(function () {
	$(document).keydown(function (e) {
		if (playing && !paused && e.keyCode >= 37 && e.keyCode <= 40) {
			move(e.keyCode, true);
		}
	});
	
	if (hasOldGame){
		addPieceClicker();
		startOldGame();
	}
	
	$("#toggleNumber").on("click tap",function(){
		$(".number").toggleClass("fade");
	});

	$("#timer").on("click tap", function () {
		showTime = !showTime;
		if (!showTime) {
			clearTimer();
		} else {
			updateTimer(0, 0);
			if (playing && !paused) {
				startTimer();
			}
		}
	});
	$("#pause").on("click tap", function () {
		if (playing) {
			paused = !paused;
			if (paused) {
				pauseTimer();
				showShutter("Resume");
				changeLabel("pause", "Resume", resumeButtonIcon);
			} else {
				if (showTime) {
					startTimer();
				}
				hideShutter();
				changeLabel("pause", "Pause", pauseButtonIcon);
			}
		}

	});

	$("#restart").on("click tap", waitForStart);
});

function waitForStart() {
	playing = false;
	localStorage.setItem("playing",playing);	
	paused = false;
	changeLabel("pause", "Pause", pauseButtonIcon);
	if (showTime) {
		updateTimer(0, 0);
	}
	moveCount = 0;
	updateMove();
	clearInterval(timer);
	initiate();
}

function startNewGame() {
	playing = true;
	localStorage.setItem("playing",playing);		
	hideShutter();
	time = 0;
	scramble();
	if (showTime) {
		updateTimer(0, 0);
		startTimer();
	}
	moveCount = 0;
}

function startOldGame(){
	playing = true;
	localStorage.setItem("playing",playing);	
	time=localStorage.getItem("time");
	if (showTime){
		var minute = Math.floor(time / 60);
		var second = time % 60;
		updateTimer(minute, second);		
		startTimer();
	}
	moveCount=localStorage.getItem("move");
	updateMove();
}

function startTimer() {
	addOutline();
	timer = setInterval(function () {
		time++;
		var minute = Math.floor(time / 60);
		var second = time % 60;
		updateTimer(minute, second);
	}, 1000);
}

function updateTimer(minute, second) {
	document.getElementById("timer").children[1].innerHTML = pad(minute) + ":" + pad(second);
	localStorage.setItem("time",time);	
}

function updateMove() {
	document.getElementById("move").children[1].innerHTML = moveCount;
	localStorage.setItem("move",moveCount);	
}

function pauseTimer() {
	clearInterval(timer);
}

function clearTimer() {
	clearInterval(timer);
	updateTimer("- -", "- -");
	time = 0;
}

function pad(n) {
	return (n < 10) ? ("0" + n) : n;
}

function wonGame() {
	winEffect();
	setTimeout(function () {
		playing = false;
		localStorage.setItem("playing",playing);		
		paused = false;
		clearInterval(timer);
		showShutter("You won!");
	}, 500);

	setTimeout(function () {
		showShutter("Restart");
	}, 1500);
}