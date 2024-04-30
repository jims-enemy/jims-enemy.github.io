let currentGame;
let megaBoard;
let pickSquare;
let tieDelay;
let timer;
let winnerFound;

// CurrentPlayer MUST be either set to "Current turn: X" or "Current turn: O".
let currentPlayer = "Current turn: X";

// Determines how long it takes to complete the animation of either an X or O, in milliseconds.
let drawSpeed = 1000;

// Sets starting win values.
let oWins = 0;
let xWins = 0;

const ACCELERATION = 1.0813826568003;
const COLUMNS = 3;
const ROWS = 3;

/** Sets the square's color based on currentColumn.
* 
* @param {number} currentColumn - The index of the current column.
* @returns {number[]} - An array containing the RGB color values.
*/
function setSquareColor(currentColumn) {

  // Sets the first color to 255 after the first loop.
  let currentColor = 510;

  // Must be negative so it is set to 0 on the first loop.
  let otherColor = -127.5;
  let otherOtherColor = -127.5;

  // Loops through each column, applying the color rules.
  for (let cycle = 0; cycle <= currentColumn; cycle++) {
    currentColor = currentColor/2;
    otherColor += currentColor/2;
    otherOtherColor += currentColor/2;
  }

  // Returns the result as an array.
  return [currentColor, otherColor, otherOtherColor];
}

/** Sets megaBoard to its default values and colors. */
function resetMegaBoard() {

  // Empty out whatever is in there.
  megaBoard = [[], [], []];

  // Creates a loop to set all of the colors to their default values.
  for (let currentColumn = 0; currentColumn < COLUMNS; currentColumn++) {
    for (let currentRow = 0; currentRow < ROWS; currentRow++) {
      let thisR;
      let thisB;
      let thisG;
      
      // The "red" row.
      if (currentRow === 0) {
        [thisR, thisG, thisB] = setSquareColor(currentColumn);
      }
  
      // The "green" row.
      else if (currentRow === 1) {
        [thisG, thisR, thisB] = setSquareColor(currentColumn);
      }
  
      // The "blue" row.
      else {
        [thisB, thisR, thisG] = setSquareColor(currentColumn);
      }
  
      // Pushes the new empty colored game onto the board.
      megaBoard[currentColumn][currentRow] = {grid: [[0, 0, 0,], [0, 0, 0,], [0, 0, 0]], R: thisR,
        G: thisG, B: thisB, player: 0};
    }
  }
}

/** Resets the game to its default values.
 * 
 * @param {boolean} updateWins - If true, increments the winner's win counter by one.
*/
function resetGame(updateWins) {

  // Increments the win count if needed.
  if (updateWins) {
    if (currentPlayer === "Current turn: X") {
      oWins++;
    }
    else {
      xWins++;
    }
  }

  // Empties currentGame and sets the remaining values back to where they were at the start.
  currentGame = {grid: [[0, 0, 0,], [0, 0, 0,], [0, 0, 0]], R: 255, G: 255, B: 255};
  resetMegaBoard();
  pickSquare = true;
  winnerFound = 0;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  resetGame(false);  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/** Determines whether or not someone has three in a line, checking along checkLine on thisGrid.
 * 
 * @param {Array} thisGrid - The 2D array you want to check.
 * @param {number} checkLine - Which horizontal and vertical line you want to check.
 * @returns {boolean} - Returns if there is a line or not.
*/
function isThree(thisGrid, checkLine) {
  return thisGrid[checkLine][0].player === thisGrid[checkLine][1].player &&
    thisGrid[checkLine][1].player === thisGrid[checkLine][2].player &&
    (thisGrid[checkLine][2].player === "X" || thisGrid[checkLine][2].player === "O") ||
    thisGrid[0][checkLine].player === thisGrid[1][checkLine].player &&
    thisGrid[1][checkLine].player === thisGrid[2][checkLine].player &&
    (thisGrid[2][checkLine].player === "X" || thisGrid[2][checkLine].player === "O") ||
    (thisGrid[0][0].player === thisGrid[1][1].player &&
    thisGrid[1][1].player === thisGrid[2][2].player ||
    thisGrid[0][2].player === thisGrid[1][1].player &&
    thisGrid[1][1].player === thisGrid[2][0].player) &&
    (thisGrid[1][1].player === "X" || thisGrid[1][1].player === "O");
}

/** Checks currentGame.grid for a line.
 * If found, sets currentGame.player to the winner and checks if they won the full game. */
function checkIf3() {
  for (let checkLine = 0; checkLine < 3; checkLine++) {
    if (isThree(currentGame.grid, checkLine)) {
      if (currentPlayer === "Current turn: X") {
        currentGame.player = "X";
      }
      else {
        currentGame.player = "O";
      }
      currentGame.drawn = 0;
      currentGame.lastUpdate = timer;

      for (let checkLine = 0; checkLine < 3; checkLine++) {
        if (isThree(megaBoard, checkLine)) {
          winnerFound = timer;
        }
      }
    }
  }
}

function mouseClicked() {

  // Temporarily the ability to play after the game has ended.
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

          if (megaBoard[y][x].player === 0 && megaBoard[y][x].grid.flatMap(subarray => subarray).some(element => element === 0)) {
            currentGame = megaBoard[y][x];
          }
          else if (currentGame.player !== 0 || ! currentGame.grid.flatMap(subarray => subarray).some(element => element === 0)) {
            pickSquare = true;
            currentGame = {grid: [[0, 0, 0,], [0, 0, 0,], [0, 0, 0]], R: 255, G: 255, B: 255};
          }
        }
      }
    }

    else if (mouseX <= width/2 && mouseY <= height/2) {
      let x = Math.floor(mouseX/(width/(COLUMNS*2)));
      let y = Math.floor(mouseY/(height/(ROWS*2)));

      if (megaBoard[y][x].player === 0 && megaBoard[y][x].grid.flatMap(subarray => subarray).some(element => element === 0)) {
        currentGame = megaBoard[y][x];
        pickSquare = false;
      }
    }
  }
}

function draw() {
  background("black");
  drawText();

  timer = millis();
  drawBoards();
  checkForEnd();

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


function drawO(squareX1, squareY1, squareX2, thisSquare, yDistance, speedUp, slowDown) {
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

function drawText() {
  let biggerWinner;

  if (String(xWins).length > String(oWins).length) {
    biggerWinner = String(xWins).length;
  }
  else {
    biggerWinner = String(oWins).length;
  }

  stroke("white");
  textAlign(LEFT, BOTTOM);

  if (height/2 - 4 < width/(768750011920929/62500000000000)) {
    textSize(height/2 - 4);
  }
  else {
    textSize(width / (768750011920929/62500000000000));
  }

  text(currentPlayer, 0, height);

  if (height/4 - 4 < width / (4 * (3.4000000953674312 + 0.5000000000000004 * biggerWinner))) {
    textSize(height/4 - 4);
  }
  else {
    textSize(width / (4 * (3.4000000953674312 + 0.5000000000000004 * biggerWinner)));
  }

  text("X wins: " + xWins, width/2, height/2);

  textAlign(RIGHT, TOP);

  text("O wins: " + oWins, width, 0);

}


function checkForEnd() {
  if (winnerFound > 0 && timer > winnerFound + drawSpeed * 2) {
    resetGame(true);
  }

  for (let gameY of megaBoard) {
    for (let gameX of gameY) {
      if (gameX.grid.flatMap(subarray => subarray).some(element => element === 0) && gameX.player === 0) {
        return;
      }
    }
  }

  if (tieDelay > 0) {
    if (timer > tieDelay + drawSpeed * 2) {
      resetGame(false);
      tieDelay = 0;
    }
  }
  else {
    tieDelay = timer;
  }
}