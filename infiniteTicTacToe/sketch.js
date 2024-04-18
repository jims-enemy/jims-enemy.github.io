let currentGame = [[0, 0, 0,], [0, 0, 0,], [0, 0, 0]];
let drawSpeed = 1000;
let timer;

const COLUMNS = 3;
const ROWS = 3;
const ACCELERATION = 1.0813826568003;

let turnX = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  let x = Math.floor(mouseX/(width/ROWS));
  let y = Math.floor(mouseY/(height/COLUMNS));

  if (currentGame[y][x] === 0) {
    if (turnX) {
      currentGame[y][x] = {player: "X", drawn: 0, lastUpdate: timer};
      checkIf3();
    }
    else {
      currentGame[y][x] = {player: "O", drawn: 0, lastUpdate: timer};
      checkIf3();
    }

    turnX = ! turnX;
  }
}

function draw() {
  background("black");
  drawGame(0, 0, width, height);

  timer = millis();
  drawPlayers(0, 0, width, height);
}

function drawGame(x1, y1, x2, y2) {
  stroke("white");

  // Draws the columns.
  for(let currentColumn = 0; currentColumn < COLUMNS; currentColumn++) {
    line((x2 - x1)/COLUMNS * currentColumn + x1, y1, (x2 - x1)/COLUMNS * currentColumn + x1, y2);
  }

  // Draws the rows.
  for(let currentRow = 0; currentRow < ROWS; currentRow++) {
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
      let thisSquare = currentGame[gridY][gridX];
      let yDistance = squareY2 - squareY1;
      let speedUp = ACCELERATION ** thisSquare.drawn/50;
      let slowDown = Math.log(thisSquare.drawn - 50)/Math.log(ACCELERATION)/50;

      if (currentGame[gridY][gridX].player === "X") {
        drawX(squareX1, squareY1, squareX2, squareY2, thisSquare, yDistance, speedUp, slowDown);
      }

      else if (currentGame[gridY][gridX].player === "O") {
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
    if (currentGame[checkLine][0].player === currentGame[checkLine][1].player &&
    currentGame[checkLine][1].player === currentGame[checkLine][2].player &&
    (currentGame[checkLine][2].player === "X" || currentGame[checkLine][2].player === "O") ||
    currentGame[0][checkLine].player === currentGame[1][checkLine].player &&
    currentGame[1][checkLine].player === currentGame[2][checkLine].player &&
    (currentGame[2][checkLine].player === "X" || currentGame[2][checkLine].player === "O") ||
    (currentGame[0][0].player === currentGame[1][1].player &&
    currentGame[1][1].player === currentGame[2][2].player ||
    currentGame[0][2].player === currentGame[1][1].player &&
    currentGame[1][1].player === currentGame[2][0].player) &&
    (currentGame[1][1].player === "X" || currentGame[1][1].player === "O")) {
      console.log("win");
    }
  }
}