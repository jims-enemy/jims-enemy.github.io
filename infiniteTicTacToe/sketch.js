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

  // Loops through every possible line combination for the current game.
  for (let checkLine = 0; checkLine < 3; checkLine++) {
    if (isThree(currentGame.grid, checkLine)) {

      // Sets the board to be X if they won.
      if (currentPlayer === "Current turn: X") {
        currentGame.player = "X";
      }

      // Otherwise, sets it to O.
      else {
        currentGame.player = "O";
      }

      currentGame.drawn = 0;
      currentGame.lastUpdate = timer;

      // Loops through every possible line combination for the full board.
      for (let checkLine = 0; checkLine < 3; checkLine++) {
        if (isThree(megaBoard, checkLine)) {
          
          // Sets the time won to be used for the end-of-game delay.
          winnerFound = timer;
        }
      }
    }
  }
}

function mouseClicked() {

  // Temporarily the stops the ability to play after the game has ended.
  if (!winnerFound) {

    // Regular play mode.
    if (!pickSquare) {

      // Sets x and y to be the mouse's current location relative to the current board.
      let x = Math.floor(mouseX/(width/(COLUMNS*2))) - COLUMNS;
      let y = Math.floor(mouseY/(height/(ROWS*2))) - ROWS;

      // Ensures you clicked on the board.
      if (x >= 0 && y >= 0) {

        // Places the marker if the spot is empty.
        if (currentGame.grid[y][x] === 0) {

          // Places X and sets the turn to O if it is turn X.
          if (currentPlayer === "Current turn: X") {
            currentGame.grid[y][x] = {player: "X", drawn: 0, lastUpdate: timer};
            currentPlayer = "Current turn: O";
          }

          // Otherwise, place O and set turn to X.
          else {
            currentGame.grid[y][x] = {player: "O", drawn: 0, lastUpdate: timer};
            currentPlayer = "Current turn: X";
          }

          checkIf3();

          // Moves the current board to the same one you clicked on as long as that one can be played on.
          if (megaBoard[y][x].player === 0 && megaBoard[y][x].grid.flatMap(subarray => subarray).some(element => element === 0)) {
            currentGame = megaBoard[y][x];
          }

          // Otherwise, allow the next player to play wherever they want.
          else if (currentGame.player !== 0 || ! currentGame.grid.flatMap(subarray => subarray).some(element => element === 0)) {
            pickSquare = true;
            currentGame = {grid: [[0, 0, 0,], [0, 0, 0,], [0, 0, 0]], R: 255, G: 255, B: 255};
          }
        }
      }
    }

    // Free-movement mode, as long as the mouse was clicked within the full board.
    else if (mouseX <= width/2 && mouseY <= height/2) {

      // Sets x and y to be the mouse's current location relative to the full board.
      let x = Math.floor(mouseX/(width/(COLUMNS*2)));
      let y = Math.floor(mouseY/(height/(ROWS*2)));

      // Sets the current board to where the user clicked, as long as they can play in that square.
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

/** Draws a grid.
 * @param {number} x1 - The first x-coordinate of the grid.
 * @param {number} y1 - The first y-coordinate of the grid.
 * @param {number} x2 - The second x-coordinate of the grid.
 * @param {number} y2 - The second y-coordinate of the grid. */
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

/** Updates the current square's percentage drawn and when it was last updated.
 * @param {object} thisSquare - The current square to be drawn. */
function updateTimer(thisSquare) {

  // Updates the percentage drawn if enough time has passed since it was last updated.
  if (timer >= drawSpeed/100 + thisSquare.lastUpdate &&
            thisSquare.drawn < 100) {
    thisSquare.drawn += (timer - thisSquare.lastUpdate)/(drawSpeed/100);

    // Caps it at 100% drawn.
    if (thisSquare.drawn >= 100) {
      thisSquare.drawn = 100;
    }

    // Sets the last updated time to the current time.
    thisSquare.lastUpdate = timer;
  }
}

/** Draws an X.
 * @param {number} squareX1 - The first x-coordinate of the square.
 * @param {number} squareY1 - The first y-coordinate of the square.
 * @param {number} squareX2 - The second x-coordinate of the square.
 * @param {number} squareY2 - The second y-coordinate of the square.
 * @param {object} thisSquare - The square that the X is being drawn in.
 * @param {number} yDistance - squareY2 minus squareY1.
 * @param {number} speedUp - A value that increases exponentially the more percentage drawn is.
 * @param {number} slowDown - A value that increases logarithmically the more percentage drawn is. */
function drawX(squareX1, squareY1, squareX2, squareY2, thisSquare, yDistance, speedUp, slowDown) {

  // When drawing the first line, speed up e
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
/** Draws every game. */
function drawBoards(){

  // Loops through every square on the mega board.
  for (let currentColumn = 0; currentColumn < COLUMNS; currentColumn++) {
    for (let currentRow = 0; currentRow < ROWS; currentRow++) {

      // Sets the color to the board's RGB values.
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