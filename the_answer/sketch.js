// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let columns = 10;
let rows = 10;
let currentX;
let currentY;
let direction;
let appleX;
let appleY;
let snakeCoords = [];
let ateApple = false;
let godMode = false;
let canTurn = true;
let portalX1;
let portalX2;
let portalY1;
let portalY2;

function moveApple() {
  appleX = (round(random(columns - 1)) * width) / columns;
  appleY = (round(random(rows - 1)) * height) / rows;
}

function movePortal() {
  portalX1 = (round(random(columns - 1)) * width) / columns;
  portalY1 = (round(random(rows - 1)) * height) / rows;
  portalX2 = (round(random(columns - 1)) * width) / columns;
  portalY2 = (round(random(rows - 1)) * height) / rows;
}

function setup() {
  createCanvas(400, 400);
  while (currentX === appleX && currentY === appleY || direction === 0 && currentX  > width/2 || direction === 2 && currentX < width/2 || direction === 1 && currentY > width/2 || direction === 3 && currentY < width/2 || currentX === portalX1 && currentY === portalY1 || currentX === portalX2 && currentY === portalY2 || appleX === portalX1 && appleY === portalY1 || appleX === portalX2 && appleY === portalY2) {
    currentX = (round(random(columns - 1)) * width) / columns;
    currentY = (round(random(rows - 1)) * height) / rows;
    direction = round(random(3));
    moveApple();
    movePortal();
  }
  frameRate(8);
}

function grid() {
  stroke("white");
  for (let lineX = 0; lineX <= width; lineX += width / columns)
    line(lineX, 0, lineX, height);
  for (let lineY = 0; lineY <= height; lineY += height / rows) {
    line(0, lineY, width, lineY);
  }
}

function moveSnake() {
  if (direction === 0) {
    currentX += width / columns;
  } else if (direction === 2) {
    currentX -= width / columns;
  } else if (direction === 1) {
    currentY += height / columns;
  } else {
    currentY -= height / columns;
  }

  fill("green");
  stroke("black");
  rect(currentX, currentY, width / columns, height / rows);
  fill("white");
  for (let bodyPart = 0; bodyPart < snakeCoords.length; bodyPart++) {
    rect(snakeCoords[bodyPart][0], snakeCoords[bodyPart][1], width / columns, height / rows)
  }
}

function apple() {
  noStroke();
  fill("red");
    while (currentX === appleX && currentY === appleY) {
    moveApple();
    ateApple = true;
    for (let bodyPart = 0; bodyPart < snakeCoords.length; bodyPart++) {
    if(snakeCoords[bodyPart][0] === appleX && snakeCoords[bodyPart][1] === appleY) {
      appleX = currentX;
      appleY = currentY;
    }
  }
  }
 rect(appleX, appleY, width / columns, height / rows);

}

function portal() {
    noStroke();
  fill("red");
    while (currentX === appleX && currentY === appleY) {
    moveApple();
    ateApple = true;
    for (let bodyPart = 0; bodyPart < snakeCoords.length; bodyPart++) {
    if(snakeCoords[bodyPart][0] === appleX && snakeCoords[bodyPart][1] === appleY) {
      appleX = currentX;
      appleY = currentY;
    }
  }
  }
 rect(appleX, appleY, width / columns, height / rows);

}

function snakeBody() {
  snakeCoords.push([currentX, currentY]);
  if (!ateApple) {
    snakeCoords.shift();
      }
  else {
    ateApple = false;
  }
}

function killSnake() { // ADD ACTUALLY GOOD KILL LOGIC
    if ((snakeCoords.some(arr => JSON.stringify(arr) === JSON.stringify([currentX, currentY])) || currentX >= width || currentX < 0 || currentY >= height || currentY < 0) && ! godMode ) {
  currentX = width**width;
  snakeCoords = [];
} 



}

function draw() {
  background("black");
  grid();
  moveSnake();
  canTurn = true;
  apple();
  portal();
  killSnake();
  snakeBody();
  
}

function keyPressed() {
  if ((keyCode === 37 || keyCode === 65) && canTurn) {
    // left arrow or a
    if (direction > 0) {
      direction--;
    } else {
      direction = 3;
    }
    canTurn = false;
  } else if ((keyCode === 39 || keyCode === 68) && canTurn) {
    // right arrow or d
    if (direction < 3) {
      direction++;
    } else {
      direction = 0;
    }
    canTurn = false;
  }
}