let rowLines = 10;
let columnLines = 20;
let tetrisBoards = new Map();
let games = 6;
for(let board = 0; board < games; board++) {
  tetrisBoards.set(`tetrisGame${board}`, new Map());
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background("black");
  drawGames();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawGrid(gridX1, gridY1, gridX2, gridY2) {
  stroke("white");
  for(let currentRow = 0; currentRow < rowLines + 1; currentRow++) {
    line((gridX2 - gridX1)/rowLines * currentRow + gridX1, gridY1, (gridX2 - gridX1)/rowLines * currentRow + gridX1, gridY2);
  }
  for(let currentColumn = 0; currentColumn < columnLines + 1; currentColumn++) {
    line(gridX1,(gridY2 - gridY1)/columnLines * currentColumn + gridY1, gridX2, (gridY2 - gridY1)/columnLines * currentColumn + gridY1);
  }
}

function drawGames() {
  drawGrid(width/3, 0, width/3 * 2, height);
  for(let currentGridRow = 0; currentGridRow < Math.ceil((games - 1)/2)) {
    for(let currentGridColumn = 0; currentGridColumn < Math.floor((games - 1)/2)) {
      drawGrid()
    }
  }
}