let columnLines = 10;
let rowLines = 20;
let tetrisBoards = new Map();
let games = 9; // Does NOT work with 2 or less.
for (let board = 0; board < games; board++) {
  let boardMap = new Map();
  boardMap.set("minos", []);
  tetrisBoards.set(`tetrisGame${board}`, boardMap);
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  for(let coordinatePair of [["x1", width/3], ["y1", 0], ["x2", width/3 * 2], ["y2", height]]) {
    tetrisBoards.get("tetrisGame0").set(coordinatePair[0], coordinatePair[1]);
  }
  let currentGame = 1;
  for(let currentGameRow = 0; currentGameRow < Math.ceil(Math.sqrt(games - 1)) && currentGame !== games; currentGameRow++) {
    for(let currentGameColumn = 0; currentGameColumn < Math.ceil(Math.sqrt(games - 1)) && currentGame !== games; currentGameColumn++) {
      for(let keyValuePair of [["x1", currentGameColumn * width/(3 * Math.ceil(Math.sqrt(games - 1)))],
        ["y1", currentGameRow * height/Math.ceil(Math.sqrt(games - 1))],
        ["x2", currentGameColumn * width/(3 * Math.ceil(Math.sqrt(games - 1))) + width/(3 * Math.ceil(Math.sqrt(games - 1)))],
        ["y2", currentGameRow * height/Math.ceil(Math.sqrt(games - 1)) + height/Math.ceil(Math.sqrt(games - 1))]]) {
        tetrisBoards.get(`tetrisGame${currentGame}`).set(keyValuePair[0], keyValuePair[1]);
      }
      currentGame++;
    }
  }
}

function draw() {
  background("black");
  for(let gameNumber = 0; gameNumber < games; gameNumber++) {
    drawGrid(tetrisBoards.get(`tetrisGame${gameNumber}`));
  }
  
  drawMinos();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for(let coordinatePair of [["x1", width/3], ["y1", 0], ["x2", width/3 * 2], ["y2", height]]) {
    tetrisBoards.get("tetrisGame0").set(coordinatePair[0], coordinatePair[1]);
  }
  let currentGame = 1;
  for(let currentGameRow = 0; currentGameRow < Math.ceil(Math.sqrt(games - 1)) && currentGame !== games; currentGameRow++) {
    for(let currentGameColumn = 0; currentGameColumn < Math.ceil(Math.sqrt(games - 1)) && currentGame !== games; currentGameColumn++) {
      for(let coordinatePair of [["x1", currentGameColumn * width/(3 * Math.ceil(Math.sqrt(games - 1)))], ["y1", currentGameRow * height/Math.ceil(Math.sqrt(games - 1))], ["x2", currentGameColumn * width/(3 * Math.ceil(Math.sqrt(games - 1))) + width/(3 * Math.ceil(Math.sqrt(games - 1)))], ["y2", currentGameRow * height/Math.ceil(Math.sqrt(games - 1)) + height/Math.ceil(Math.sqrt(games - 1))]]) {
        tetrisBoards.get(`tetrisGame${currentGame}`).set(coordinatePair[0], coordinatePair[1]);
      }
      currentGame++;
    }
  }
}

function drawGrid(currentTetrisGame) {
  stroke("white");
  for(let currentColumn = 0; currentColumn < columnLines + 1; currentColumn++) {
    line((currentTetrisGame.get("x2") - currentTetrisGame.get("x1"))/columnLines * currentColumn + currentTetrisGame.get("x1"), currentTetrisGame.get("y1"), (currentTetrisGame.get("x2") - currentTetrisGame.get("x1"))/columnLines * currentColumn + currentTetrisGame.get("x1"), currentTetrisGame.get("y2"));
  }
  for(let currentRow = 0; currentRow < rowLines + 1; currentRow++) {
    line(currentTetrisGame.get("x1"),(currentTetrisGame.get("y2") - currentTetrisGame.get("y1"))/rowLines * currentRow + currentTetrisGame.get("y1"), currentTetrisGame.get("x2"), (currentTetrisGame.get("y2") - currentTetrisGame.get("y1"))/rowLines * currentRow + currentTetrisGame.get("y1"));
  }
}

function drawMinos() {
  for (let [gameName, gameOfTetris] of tetrisBoards) {
    for(let currentMino of gameOfTetris.get("minos")) {
      fill(currentMino.color);
      rect(currentMino.column * (gameOfTetris.get("x2") - gameOfTetris.get("x1"))/columnLines + gameOfTetris.get("x1"),
        currentMino.row * (gameOfTetris.get("y2") - gameOfTetris.get("y1"))/rowLines + gameOfTetris.get("y1"), 
        (gameOfTetris.get("x2") - gameOfTetris.get("x1"))/columnLines,
        (gameOfTetris.get("y2") - gameOfTetris.get("y1"))/rowLines);
    }
  }
}

function swap() {
  let gameZero = tetrisBoards.get("tetrisGame0");
  let numberOfGame = 1;
  for (let [nameOfGame, tetrisInformation] of tetrisBoards) {
    if (nameOfGame !== "tetrisGame0") {
      tetrisBoards.set(`tetrisGame${numberOfGame - 1}`, tetrisInformation);
      numberOfGame++;
    }
  }
  tetrisBoards.set(`tetrisGame${numberOfGame - 1}`, gameZero);
  windowResized();
}