let currentGame = {grid: [[0, 0, 0,], [0, 0, 0,], [0, 0, 0]], R: 255, G: 255, B: 255};
let drawSpeed = 1000;
let timer;
let megaBoard = [[], [], []];
let currentPlayer = "Current turn: X";
let pickSquare = true;
let winnerFound = false;
let DEBUGFONTSIZE = 1;

const COLUMNS = 3;
const ROWS = 3;
const ACCELERATION = 1.0813826568003;

for (let currentColumn = 0; currentColumn < COLUMNS; currentColumn++) {
  for (let currentRow = 0; currentRow < ROWS; currentRow++) {
    let thisR = -127.5;
    let thisG = -127.5;
    let thisB = -127.5;
    
    if (currentRow === 0) {
      thisR = 510;

      for (let cycle = 0; cycle <= currentColumn; cycle++) {
        thisR = thisR/2;
        thisG += thisR/2;
        thisB += thisR/2;
      }
    }

    else if (currentRow === 1) {
      thisG = 510;

      for (let cycle = 0; cycle <= currentColumn; cycle++) {
        thisG = thisG/2;
        thisR += thisG/2;
        thisB += thisG/2;
      }
    }

    else {
      thisB = 510;

      for (let cycle = 0; cycle <= currentColumn; cycle++) {
        thisB = thisB/2;
        thisR += thisB/2;
        thisG += thisB/2;
      }
    }

    megaBoard[currentColumn][currentRow] = {grid: [[0, 0, 0,], [0, 0, 0,], [0, 0, 0]], R: thisR,
      G: thisG, B: thisB, player: 0};
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  if (!winnerFound) {
    if (!pickSquare) {
      let x = Math.floor(mouseX/(width/(COLUMNS*2))) - COLUMNS;
      let y = Math.floor(mouseY/(height/(ROWS*2))) - ROWS;

      if (x >= 0 && y >= 0) {
        if (currentGame.grid[y][x] === 0) {
          if (currentPlayer === "Current turn: X") {
            currentGame.grid[y][x] = {player: "X", drawn: 0, lastUpdate: timer};
            checkIf3();
            currentPlayer = "Current turn: O";
          }
          else {
            currentGame.grid[y][x] = {player: "O", drawn: 0, lastUpdate: timer};
            checkIf3();
            currentPlayer = "Current turn: X";
          }

          if (megaBoard[y][x].player === 0) {
            currentGame = megaBoard[y][x];
          }
          else if (currentGame.player !== 0) {
            pickSquare = true;
            currentGame = {grid: [[0, 0, 0,], [0, 0, 0,], [0, 0, 0]], R: 255, G: 255, B: 255};
          }
        }
      }
    }

    else if (mouseX <= width/2 && mouseY <= height/2) {
      let x = Math.floor(mouseX/(width/(COLUMNS*2)));
      let y = Math.floor(mouseY/(height/(ROWS*2)));

      if (megaBoard[y][x].player === 0) {
        currentGame = megaBoard[y][x];
        pickSquare = false;
      }
    }
  }
}

function draw() {
  background("black");
  // if (height < width) {
  //   textSize(104/667 * height);
  // }
  // else {
  //   textSize(104/1280 * width);
  // }

  textSize(DEBUGFONTSIZE);

  text(DEBUGFONTSIZE, 0, height);

  timer = millis();
  drawBoards();
}

function drawBoards(){
  for (let currentColumn = 0; currentColumn < COLUMNS; currentColumn++) {
    for (let currentRow = 0; currentRow < ROWS; currentRow++) {
      stroke(megaBoard[currentColumn][currentRow].R, megaBoard[currentColumn][currentRow].G, megaBoard[currentColumn][currentRow].B);
      drawGame(0 + width/6 * currentRow, 0 + height/6 * currentColumn, width/6 * (currentRow + 1), height/6 * (currentColumn + 1));
      drawPlayers(width/6 * currentRow, height/6 * currentColumn,
        width/6 * (currentRow + 1), height/6 * (currentColumn + 1),
        megaBoard[currentColumn][currentRow].grid);
    }
  }

  stroke(currentGame.R, currentGame.G, currentGame.B);
  drawGame(width/2, height/2, width, height);
  drawPlayers(width/2, height/2, width, height, currentGame.grid);

  stroke("white");
  drawGame(0, 0, width/2, height/2);
  drawPlayers(0, 0, width/2, height/2, megaBoard);
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

function drawPlayers(x1, y1, x2, y2, game) {
  let gridWidth = (x2 - x1)/COLUMNS;
  let gridHeight = (y2 - y1)/ROWS;

  for (let gridY = 0; gridY < COLUMNS; gridY++) {
    for (let gridX = 0; gridX < ROWS; gridX++) {
      let squareX1 = gridWidth * gridX + x1;
      let squareY1 = gridHeight * gridY + y1;
      let squareX2 = gridWidth * (gridX + 1) + x1;
      let squareY2 = gridHeight * (gridY + 1) + y1;
      let thisSquare = game[gridY][gridX];
      let yDistance = squareY2 - squareY1;
      let speedUp = ACCELERATION ** thisSquare.drawn/50;
      let slowDown = Math.log(thisSquare.drawn - 50)/Math.log(ACCELERATION)/50;
      
      if (game[gridY][gridX].player === "X") {
        drawX(squareX1, squareY1, squareX2, squareY2, thisSquare, yDistance, speedUp, slowDown);
      }

      else if (game[gridY][gridX].player === "O") {
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
      if (winnerFound) {
        noLoop();
      }
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
      if (currentPlayer === "Current turn: X") {
        currentGame.player = "X";
        currentGame.drawn = 0;
        currentGame.lastUpdate = timer;
      }
      else {
        currentGame.player = "O";
        currentGame.drawn = 0;
        currentGame.lastUpdate = timer;
      }

      for (let checkLine = 0; checkLine < 3; checkLine++) {
        if (megaBoard[checkLine][0].player === megaBoard[checkLine][1].player &&
        megaBoard[checkLine][1].player === megaBoard[checkLine][2].player &&
        (megaBoard[checkLine][2].player === "X" || megaBoard[checkLine][2].player === "O") ||
        megaBoard[0][checkLine].player === megaBoard[1][checkLine].player &&
        megaBoard[1][checkLine].player === megaBoard[2][checkLine].player &&
        (megaBoard[2][checkLine].player === "X" || megaBoard[2][checkLine].player === "O") ||
        (megaBoard[0][0].player === megaBoard[1][1].player &&
        megaBoard[1][1].player === megaBoard[2][2].player ||
        megaBoard[0][2].player === megaBoard[1][1].player &&
        megaBoard[1][1].player === megaBoard[2][0].player) &&
        (megaBoard[1][1].player === "X" || megaBoard[1][1].player === "O")) {
          winnerFound = true;
        }
      }
    }
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    DEBUGFONTSIZE++;
  }
  else if (keyCode === DOWN_ARROW) {
    DEBUGFONTSIZE--;
  }
}