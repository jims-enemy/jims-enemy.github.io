let columnLines = 10;
let rowLines = 20;
let tetrisBoards = new Map();
let games = 9; // Does NOT work with 2 or less.
let bag = [];
let level = 1;
let timer;
let lastUpdate = 0;
let activeTetromino = {color: NaN,
  isActive: false,
  column1: NaN,
  row1: NaN,
  column2: NaN,
  row2: NaN,
  column3: NaN,
  row3: NaN,
  column4: NaN,
  row4: NaN};
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
  fillBag();
}

function draw() {
  timer = millis();
  background("black");
  for(let gameNumber = 0; gameNumber < games; gameNumber++) {
    drawGrid(tetrisBoards.get(`tetrisGame${gameNumber}`));
  }
  
  drawMinos();
  moveActiveTetromino();
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

function fillBag() {
  let loops = 0;
  let availableChoices = [1, 2, 3, 4, 5, 6, 7, 8];

  while(loops < 8) {
    let choice = round(random(0.45, 8.43));
    if (availableChoices.includes(choice)) {
      bag.push(choice);
      availableChoices.splice(availableChoices.indexOf(choice), 1);
      loops++;
    }
  }
}

function moveActiveTetromino() {
  if (activeTetromino.isActive) {
    if (activeTetromino.row1 >= 0 &&
      activeTetromino.row2 >= 0 &&
      activeTetromino.row3 >= 0 &&
      activeTetromino.row4 >= 0) {
      fill(activeTetromino.color);
      for (let columnRow of [[activeTetromino.column1, activeTetromino.row1], [activeTetromino.column2, activeTetromino.row2], [activeTetromino.column3, activeTetromino.row3], [activeTetromino.column4, activeTetromino.row4]]) {
        rect(columnRow[0] * (tetrisBoards.get("tetrisGame0").get("x2") - tetrisBoards.get("tetrisGame0").get("x1"))/columnLines + tetrisBoards.get("tetrisGame0").get("x1"),
          columnRow[1] * (tetrisBoards.get("tetrisGame0").get("y2") - tetrisBoards.get("tetrisGame0").get("y1"))/rowLines + tetrisBoards.get("tetrisGame0").get("y1"), 
          (tetrisBoards.get("tetrisGame0").get("x2") - tetrisBoards.get("tetrisGame0").get("x1"))/columnLines,
          (tetrisBoards.get("tetrisGame0").get("y2") - tetrisBoards.get("tetrisGame0").get("y1"))/rowLines);
      }
    }
    if (timer - lastUpdate >= (0.8 - (level - 1) * 0.007)**(level - 1) * 1000) {
      if (activeTetromino.row1 + 1 < rowLines &&
        activeTetromino.row2 + 1 < rowLines &&
        activeTetromino.row3 + 1 < rowLines &&
        activeTetromino.row4 + 1 < rowLines) {
        activeTetromino.row1++;
        activeTetromino.row2++;
        activeTetromino.row3++;
        activeTetromino.row4++;
      }
      else {
        for (let currentBlock of [[activeTetromino.row1, activeTetromino.column1],
          [activeTetromino.row2, activeTetromino.column2],
          [activeTetromino.row3, activeTetromino.column3],
          [activeTetromino.row4, activeTetromino.column4]]) {
          tetrisBoards.get("tetrisGame0").get("minos").push({color: activeTetromino.color,
            row: currentBlock[0],
            column: currentBlock[1]});
        }
        activeTetromino.isActive = false;
      }
      lastUpdate = timer;
    }
  }
  else {
    if (bag[0] === 1) { //SWAP
      swap();
    }
    else if (bag[0] === 2) { //I
      activeTetromino = {color: "cyan",
        isActive: true, 
        column1: Math.floor(columnLines/2) - 2,
        row1: -1,
        column2: Math.floor(columnLines/2) - 1,
        row2: -1,
        column3: Math.floor(columnLines/2),
        row3: -1,
        column4: Math.floor(columnLines/2) + 1,
        row4: -1
      };
    }
    else if (bag[0] === 3) { //J
      activeTetromino = {color: "blue",
        isActive: true,
        column1: Math.floor(columnLines/2) - 2,
        row1: -1,
        column2: Math.floor(columnLines/2) - 2,
        row2: 0,
        column3: Math.floor(columnLines/2) - 1,
        row3: 0,
        column4: Math.floor(columnLines/2),
        row4: 0
      };
    }
    else if (bag[0] === 4) { //L
      activeTetromino = {color: "orange",
        isActive: true,
        column1: Math.floor(columnLines/2) - 2,
        row1: 0,
        column2: Math.floor(columnLines/2) - 1,
        row2: 0,
        column3: Math.floor(columnLines/2),
        row3: 0,
        column4: Math.floor(columnLines/2),
        row4: -1
      };
    }
    else if (bag[0] === 5) { //O
      activeTetromino = {color: "yellow",
        isActive: true,
        column1: Math.floor(columnLines/2) - 1,
        row1: -1,
        column2: Math.floor(columnLines/2) - 1,
        row2: 0,
        column3: Math.floor(columnLines/2),
        row3: -1,
        column4: Math.floor(columnLines/2),
        row4: 0
      };
    }
    else if (bag[0] === 6) { //S
      activeTetromino = {color: "green",
        isActive: true,
        column1: Math.floor(columnLines/2) - 2,
        row1: 0,
        column2: Math.floor(columnLines/2) - 1,
        row2: 0,
        column3: Math.floor(columnLines/2) - 1,
        row3: -1,
        column4: Math.floor(columnLines/2),
        row4: -1
      };
    }
    else if (bag[0] === 7) { //Z
      activeTetromino = {color: "red",
        isActive: true,
        column1: Math.floor(columnLines/2) - 2,
        row1: -1,
        column2: Math.floor(columnLines/2) - 1,
        row2: -1,
        column3: Math.floor(columnLines/2) - 1,
        row3: 0,
        column4: Math.floor(columnLines/2),
        row4: 0
      };
    }
    else { //T
      activeTetromino = {color: "purple",
        isActive: true,
        column1: Math.floor(columnLines/2) - 2,
        row1: 0,
        column2: Math.floor(columnLines/2) - 1,
        row2: -1,
        column3: Math.floor(columnLines/2) - 1,
        row3: 0,
        column4: Math.floor(columnLines/2),
        row4: 0
      };
    }
    bag.shift();
  }
  if (bag.length < 7) {
    fillBag();
  }
}