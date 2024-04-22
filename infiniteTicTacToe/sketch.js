let currentGame = {grid: [[0, 0, 0,], [0, 0, 0,], [0, 0, 0]], color: "white"};
let drawSpeed = 1000;
let timer;
let megaBoard = [[], [], []];
let turnX = true;
let newColor = "white";


const COLUMNS = 3;
const ROWS = 3;
const ACCELERATION = 1.0813826568003;

for (let currentColumn = 0; currentColumn < COLUMNS; currentColumn++) {
  for (let currentRow = 0; currentRow < ROWS; currentRow++) {
    
    if (currentRow === 0) {
      newColor = 255000000;
    }

    else if (currentRow === 1) {
      newColor = 255000;
    }

    else {
      newColor = 255;
    }


    megaBoard[currentColumn][currentRow] = {grid: [[0, 0, 0,], [0, 0, 0,], [0, 0, 0]], color: newColor};
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  let x = Math.floor(mouseX/(width/(ROWS*2))) - ROWS;
  let y = Math.floor(mouseY/(height/(COLUMNS*2))) - COLUMNS;

  if (x >= 0 && y >= 0) {
    if (currentGame.grid[y][x] === 0) {
      if (turnX) {
        currentGame.grid[y][x] = {player: "X", drawn: 0, lastUpdate: timer};
        checkIf3();
      }
      else {
        currentGame.grid[y][x] = {player: "O", drawn: 0, lastUpdate: timer};
        checkIf3();
      }

      turnX = ! turnX;
    }
  }
}

function draw() {
  background("black");
  drawBoards();

  timer = millis();
  drawPlayers(width/2, height/2, width, height);
}

function drawBoards(){
  for (let currentColumn = 0; currentColumn < COLUMNS; currentColumn++) {
    for (let currentRow = 0; currentRow < ROWS; currentRow++) {
      stroke(megaBoard[currentColumn][currentRow].color);
      drawGame(0 + width/6 * currentRow, 0 + height/6 * currentColumn, width/6 * (currentRow + 1), height/6 * (currentColumn + 1));
    }
  }

  stroke(currentGame.color);
  drawGame(width/2, height/2, width, height);
}

function drawGame(x1, y1, x2, y2) {
  // Draws the columns.
  for (let currentColumn = 0; currentColumn <= COLUMNS; currentColumn++) {
    line((x2 - x1)/COLUMNS * currentColumn + x1, y1, (x2 - x1)/COLUMNS * currentColumn + x1, y2);
  }

  // Draws the rows.
  for (let currentRow = 0; currentRow <= ROWS; currentRow++) {
    line(x1,(y2 - y1)/ROWS * currentRow + y1, x2, (y2 - y1)/ROWS * currentRow + y1);
  }
}

function drawPlayers(x1, y1, x2, y2) {
  let gridWidth = (x2 - x1)/COLUMNS;
  let gridHeight = (y2 - y1)/ROWS;

  for (let gridY = 0; gridY < COLUMNS; gridY++) {
    for (let gridX = 0; gridX < ROWS; gridX++) {
      let squareX1 = gridWidth * gridX + x1;
      let squareY1 = gridHeight * gridY + y1;
      let squareX2 = gridWidth * (gridX + 1) + x1;
      let squareY2 = gridHeight * (gridY + 1) + y1;
      let thisSquare = currentGame.grid[gridY][gridX];
      let yDistance = squareY2 - squareY1;
      let speedUp = ACCELERATION ** thisSquare.drawn/50;
      let slowDown = Math.log(thisSquare.drawn - 50)/Math.log(ACCELERATION)/50;

      if (currentGame.grid[gridY][gridX].player === "X") {
        drawX(squareX1, squareY1, squareX2, squareY2, thisSquare, yDistance, speedUp, slowDown);
      }

      else if (currentGame.grid[gridY][gridX].player === "O") {
        drawO(squareX1, squareY1, squareX2, thisSquare, yDistance, speedUp, slowDown);
      }
    }
  }

  function drawX(squareX1, squareY1, squareX2, squareY2, thisSquare, yDistance, speedUp, slowDown) {

    if (thisSquare.drawn <= 50) {
      line(squareX1, squareY1, squareX1 + (squareX2 - squareX1) * speedUp,
        squareY1 + yDistance * speedUp);
    }
    else {
      line(squareX1, squareY1, squareX2, squareY2);
      line(squareX2, squareY1, squareX2 + (squareX1 - squareX2) * slowDown,
        squareY1 + yDistance * slowDown);
    }

    updateTimer(thisSquare);
  }
}

function drawO(squareX1, squareY1, squareX2, thisSquare, yDistance, speedUp, slowDown) {
  noFill();
  let xDistance = squareX2 - squareX1;

  if (thisSquare.drawn <= 50) {
    arc(squareX1 + xDistance/2, squareY1 + yDistance/2, xDistance, yDistance, 0, PI * speedUp);
  }
  else {
    arc(squareX1 + xDistance/2, squareY1 + yDistance/2, xDistance, yDistance, 0, PI + PI * slowDown);
  }

  updateTimer(thisSquare);

}

function updateTimer(thisSquare) {
  if (timer >= drawSpeed/100 + thisSquare.lastUpdate &&
            thisSquare.drawn < 100) {
    thisSquare.drawn += (timer - thisSquare.lastUpdate)/(drawSpeed/100);
    if (thisSquare.drawn >= 100) {
      thisSquare.drawn = 100;
    }
    thisSquare.lastUpdate = timer;
  }
}

function checkIf3() {
  for (let checkLine = 0; checkLine < 3; checkLine++) {
    if (currentGame.grid[checkLine][0].player === currentGame.grid[checkLine][1].player &&
    currentGame.grid[checkLine][1].player === currentGame.grid[checkLine][2].player &&
    (currentGame.grid[checkLine][2].player === "X" || currentGame.grid[checkLine][2].player === "O") ||
    currentGame.grid[0][checkLine].player === currentGame.grid[1][checkLine].player &&
    currentGame.grid[1][checkLine].player === currentGame.grid[2][checkLine].player &&
    (currentGame.grid[2][checkLine].player === "X" || currentGame.grid[2][checkLine].player === "O") ||
    (currentGame.grid[0][0].player === currentGame.grid[1][1].player &&
    currentGame.grid[1][1].player === currentGame.grid[2][2].player ||
    currentGame.grid[0][2].player === currentGame.grid[1][1].player &&
    currentGame.grid[1][1].player === currentGame.grid[2][0].player) &&
    (currentGame.grid[1][1].player === "X" || currentGame.grid[1][1].player === "O")) {
      console.log("win");
    }
  }
}