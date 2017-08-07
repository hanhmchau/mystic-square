// JavaScript Document
var right=37;
var down=38;
var left=39;
var up=40;

function move(direction, playerMove) {
	var temp = -1;
	var emptyPos = whereIsId(16);
	var row = emptyPos.row;
	var col = emptyPos.col;

	//identifying the piece that needs to move
	//moveRow, moveCol: Coordinates of the piece that needs to move
	var moveRow, moveCol;
	switch (direction) {
			//the empty thing actually moves left
		case 39:
			if (col > 0) {
				moveRow = row;
				moveCol = col - 1;
				temp = board[moveRow][moveCol];
				board[row][col - 1] = 16;
			}
			break;
			//up: the empty thing moves up
		case 40:
			if (row > 0) {
				moveRow = row - 1;
				moveCol = col;
				temp = board[moveRow][moveCol];
				board[row - 1][col] = 16;
			}
			break;
			//right: the empty thing moves right
		case 37:
			if (col < 3) {
				moveRow = row;
				moveCol = col + 1;
				temp = board[moveRow][moveCol];
				board[row][col + 1] = 16;
			}
			break;
			//down
		case 38:
			if (row < 3) {
				moveRow = row + 1;
				moveCol = col;
				temp = board[moveRow][moveCol];
				board[row + 1][col] = 16;
			}
	}
	if (temp == -1) {
		return 0;
	}
	board[row][col] = temp;
	
	//temp is the identity of the piece that needs to move
	//temp has been switched to where the empty place was

	var mover = document.getElementById("piece" + temp);
	translate(mover, row, col);
	if (playerMove){
		moveCount++;
		updateMove();
	}
	
	//update board in storage
	localStorage.setItem("board",JSON.stringify(board));	
	if (playerMove && win()) {
		wonGame();
	}
	return 1;
}


function translate(mover, moveRow, moveCol) {
	mover.style.left = moveCol * 25 + "%";
	mover.style.top = moveRow * 25 + "%";
	
}

function moveMouse(piece){
	var id=parseInt(piece.id.replace("piece",""));
	
	var coord=whereIsId(id);
	var row=coord.row;
	var col=coord.col;
	
	var coordEmpty=whereIsId(16);
	var rowEmpty=coordEmpty.row;
	var colEmpty=coordEmpty.col;
	
	var rel=relativePosition(coord, coordEmpty);
	switch (rel){
		case 39: moveRepeatedly(left,coordEmpty.col-coord.col);
			break;
		case 37: moveRepeatedly(right, coord.col-coordEmpty.col);
			break;
		case 40: moveRepeatedly(up,coordEmpty.row-coord.row);
			break;
		case 38: moveRepeatedly(down,coord.row-coordEmpty.row);
			break;
	}
}

function relativePosition(coord, coordEmpty){
	if (coordEmpty.row==coord.row){
		if (coord.col<coordEmpty.col){
			return left; //39
		}
		else {
			return right; //37
		}
	}
	if (coordEmpty.col==coord.col){
		if (coord.row<coordEmpty.row){
			return up; //40
		}
		else {
			return down; //38
		}
	}
	return 0;
}

function moveRepeatedly(direction,times){
	for (var i=0;i<times;i++){
		move(direction,true);
	}
}

function whereIsId(id) {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (board[i][j] == id) {
				return new Coordinate(i, j);
			}
		}
	}
}

function Coordinate(row, col) {
	this.row = row;
	this.col = col;
}

function scramble() {

	//randomizing the direction
	var num;

	//number of times the piece is successfully moved
	var timesMoved = 0;

	while (timesMoved < 500) {
		num = Math.floor((Math.random() * 10) + 37);
		timesMoved += move(num, false);
	}
}

function win() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (i * 4 + j + 1 != board[i][j]) {
				return false;
			}
		}
	}
	return true;
}