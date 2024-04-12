let currentGame = [[0, 0, 0,], [0, 0, 0,], [0, 0, 0]];
let drawSpeed = 1000;
let timer;

const COLUMNS = 3;
const ROWS = 3;

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
    }
    else {
      currentGame[y][x] = {player: "O", drawn: 0, lastUpdate: timer};
    }

    turnX = ! turnX;
  }
}

function draw() {
  background("black");
  drawGame(0, 0, width, height);

  timer = millis();
  drawX(0, 0, width, height);
  //drawO();
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

function drawX(x1, y1, x2, y2) {
  let gridWidth = (x2 - x1)/COLUMNS;
  let gridHeight = (y2 - y1)/ROWS;

  for (let gridY = 0; gridY < COLUMNS; gridY++) {
    for (let gridX = 0; gridX < ROWS; gridX++) {
      if (currentGame[gridY][gridX].player === "X") {
        let squareX1 = gridWidth * gridX + x1;
        let squareY1 = gridHeight * gridY + y1;
        let squareX2 = gridWidth * (gridX + 1) + x1;
        let squareY2 = gridHeight * (gridY + 1) + y1;
        let thisSquare = currentGame[gridY][gridX];

        if (thisSquare.drawn <= 50) {
          line(squareX1, squareY1, squareX1 + (squareX2 - squareX1) * thisSquare.drawn/50, squareY1 + (squareY2 - squareY1) * thisSquare.drawn/50);
        }
        else {
          line(squareX1, squareY1, squareX2, squareY2);
          line(squareX2, squareY1,
            squareX2 + (squareX1 - squareX2) * (thisSquare.drawn - 50)/50, squareY1 + (squareY2 - squareY1) * (thisSquare.drawn - 50)/50);
        }

        if (timer >= drawSpeed/100 + thisSquare.lastUpdate &&
            thisSquare.drawn < 100) {
          thisSquare.drawn += (timer - thisSquare.lastUpdate)/(drawSpeed/100);
          if (thisSquare.drawn >= 100) {
            thisSquare.drawn = 100;
          }
          thisSquare.lastUpdate = timer;
        }
      }
    }
  }
}

/* function drawO(x1, y1, x2, h2) {
  let gridWidth = (x2 - x1)/COLUMNS;
  let gridHeight = (y2 - y1)/ROWS;

} */