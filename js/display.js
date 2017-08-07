// JavaScript Document

//16 denotes the empty piece
var board = [
	[1, 2, 3, 4],
	[5, 6, 7, 8],
	[9, 10, 11, 12],
	[13, 14, 15, 16]
];

var originalPos=[];

var images = [
	"resource/window.png",
	"resource/cup.png",
	"resource/tree.png",
	"resource/cat.png",
	"resource/eevee.jpg"
];
var currentImage = "url(" + images[Math.floor(Math.random() * images.length)] + ")";

//redraw the puzzle with the current background image
function initiate() {
	preparatoryPosition();
	
	var playbox = document.getElementById("playbox");
	playbox.innerHTML = "";
	hasOldGame=JSON.parse(localStorage.getItem("playing"));

	if (hasOldGame) {
		board=JSON.parse(localStorage.getItem("board"));
		currentImage=localStorage.getItem("image");
		drawOldGame();
	}
	else {
		//clear the gameboard, start anew		
		drawNewGame();
	}
}

function drawNewGame() {
	drawShutter("Start");
	addShutterClicker();
	var row;
	for (var i = 0; i < 4; i++) {
		//create new row
		row = document.createElement("div");
		row.classList.add("row", "mx-0");
		playbox.appendChild(row);
		//create four pieces in a row
		for (var j = 0; j < 4; j++) {
			board[i][j] = i * 4 + (j + 1);
			drawPiece(row, i, j,i,j);
		}
	}
	repaint();
	addPieceClicker();	
}


function drawOldGame() {
	drawShutter("Start");
	addShutterClicker();
	hideShutter();
	
	var row;
	
	for (var i = 0; i < 4; i++) {
		row = document.createElement("div");
		row.classList.add("row", "mx-0");
		playbox.appendChild(row);
		for (var j = 0; j < 4; j++) {
			var x=originalPos[board[i][j]-1];
			drawPiece(row,x.row,x.col,i,j);
		}
	}
	repaint();
}

//draw a single new piece
//rowNum, colNum: determining the position of the background image, dependent on the id
//rowPos, colPos: determining the placement of the piece
function drawPiece(row, rowNum, colNum, rowPos, colPos) {
	var number = rowNum * 4 + (colNum + 1);
	if (number !== 16) {
		var piece = document.createElement("div");
		var pieceNum = "piece" + number;
		piece.classList.add("w-25", "piece", "outlined");
		piece.id = pieceNum;
		piece.style.top = rowPos * 25 + "%";
		piece.style.left = colPos * 25 + "%";
	
		//calculating position of the background image
		piece.style.backgroundPosition = colNum * 33 + "% " + rowNum * 33 + "%";
		row.appendChild(piece);
		addNumber(number,piece);
	}
}

function repaint() {
	localStorage.setItem("image", currentImage);
	var pieces = document.getElementsByClassName("piece");
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (i * 4 + j != 15) {
				paintPiece(pieces[i * 4 + j], i, j);
			}
		}
	}
}

function paintPiece(piece, x, y) {
	var number = x * 4 + y;
	setTimeout(function () {
		piece.style.backgroundImage = currentImage;
	}, 40 * number);
}

//change background of pieces on click
$(document).ready(function () {
	$(".dropdown-item").click(function () {
		var fileName = "url(" + images[$(this).data('foo')] + ")";
		currentImage = fileName;
		localStorage.setItem("image", currentImage);
		repaint();
	});
});

function drawShutter(message) {
	var playbox = document.getElementById("playbox");
	playbox.innerHTML += "<div id='shutter' class='h-100 shutter off'><span class='shutter-message'><h2>" + message + "</h2></span></div>";
}

function showShutter(message) {
	document.getElementById("shutter").firstElementChild.innerHTML = "<h2>" + message + "</h2>";
	document.getElementById("shutter").classList.add("off");
}

function hideShutter() {
	$(".shutter").removeClass("off");
}

function changeLabel(button, message, icon) {
	var button = document.getElementById(button);
	button.innerHTML = "<small>" + message + "</small>";
	button.innerHTML += "<span class='" + icon + " ml-2'></span>";
}

function winEffect() {
	$(".piece").removeClass("outlined");
	$(".piece").addClass("shine");
	setTimeout(function () {
		$(".piece").removeClass("shine");
	}, 500);
}

function addOutline() {
	$(".piece").addClass("outlined");
}

function preparatoryPosition(){
	for (var i=0;i<4;i++){
		for (var j=0;j<4;j++){
			originalPos.push(new Coordinate(i,j));
		}
	}
}

function addNumber(id, piece){
	var number=document.createElement("div");
	number.classList.add("number","w-100","h-100","d-inline-block","align-middle");
	number.innerHTML=id;
	piece.appendChild(number);
}
