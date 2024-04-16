// Character in 2D Grid
// Dan Schellenberg
// Apr 15, 2024

let grid;
let cellSize;
const GRID_SIZE = 10;
const PLAYER = 9;
const OPEN_TILE = 0;
const IMPASSIBLE = 1;
let player = {
  x: 0,
  y: 0
};

function setup() {
  createCanvas(windowWidth, windowHeight);

  //if randomizing the grid, do this:
  grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);
  
  if (height < width) {
    cellSize = height/grid.length;
  }
  else {
    cellSize = width/grid.length;
  }

  grid[player.y][player.x] = PLAYER;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  if (height < width) {
    cellSize = height/grid.length;
  }
  else {
    cellSize = width/grid.length;
  }
}

function draw() {
  background(220);
  displayGrid();
}

function keyPressed() {
  if (key === "r") {
    grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);
  }

  if (key === "e") {
    grid = generateEmptyGrid(GRID_SIZE, GRID_SIZE);
  }
  
  if (key === "w") {
    movePlayer(player.x, player.y - 1);
  }

  if (key === "s") {
    movePlayer(player.x, player.y + 1);
  }

  if (key === "a") {
    movePlayer(player.x - 1, player.y);
  }

  if (key === "d") {
    movePlayer(player.x + 1, player.y);
  }
}

function movePlayer(x, y) {
  if (x < GRID_SIZE && y < GRID_SIZE && 
  x >= 0 && y >= 0 && grid[y][x] === OPEN_TILE) {
    grid[player.y][player.x] = OPEN_TILE;

    player.x = x;
    player.y = y;

    grid[player.y][player.x] = PLAYER;
  }
}

function mousePressed() {
  let x = Math.floor(mouseX/cellSize);
  let y = Math.floor(mouseY/cellSize);

  // console.log(x, y);

  //don't fall off the edge of the grid...
  toggleCell(x, y); 
}

function toggleCell(x, y) {
  //toggle the color of the cell
  if (x < GRID_SIZE && y < GRID_SIZE && 
    x >= 0 && y >= 0) {
    if (grid[y][x] === OPEN_TILE) {
      grid[y][x] = IMPASSIBLE;
    }
    else if (grid[y][x] === IMPASSIBLE) {
      grid[y][x] = OPEN_TILE;
    }
  }
}

function displayGrid() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === OPEN_TILE) {
        fill("white");
      }
      else if (grid[y][x] === IMPASSIBLE){
        fill("black");
      }
      else if (grid[y][x] === PLAYER) {
        fill("red");
      }
      square(x * cellSize, y * cellSize, cellSize);
    }
  }
}

function generateRandomGrid(cols, rows) {
  let emptyArray = [];
  for (let y = 0; y < rows; y++) {
    emptyArray.push([]);
    for (let x = 0; x < cols; x++) {
      //half the time, be a 1. Other half, be a 0.
      if (random(100) < 50) {
        emptyArray[y].push(0);
      }
      else {
        emptyArray[y].push(1);
      }
    }
  }
  return emptyArray;
}

function generateEmptyGrid(cols, rows) {
  let emptyArray = [];
  for (let y = 0; y < rows; y++) {
    emptyArray.push([]);
    for (let x = 0; x < cols; x++) {
      emptyArray[y].push(OPEN_TILE);
    }
  }
  return emptyArray;
}