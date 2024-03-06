let columns = 1000;
let rows = 20;
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
let gracePeriod = true;



function moveApple() {
  appleX = round(random(columns - 1)) * width / columns;
  appleY = round(random(rows - 1)) * height / rows;
}

function movePortal() {
  portalX1 = round(random(columns - 1)) * width / columns;
  portalY1 = round(random(rows - 1)) * height / rows;
  portalX2 = round(random(columns - 1)) * width / columns;
  portalY2 = round(random(rows - 1)) * height / rows;
}

function setup() {
  createCanvas(400, 400);
  while (
    currentX === appleX && currentY === appleY ||
    direction === 0 && currentX > width / 2 ||
    direction === 2 && currentX < width / 2 ||
    direction === 1 && currentY > width / 2 ||
    direction === 3 && currentY < width / 2 ||
    currentX === portalX1 && currentY === portalY1 ||
    currentX === portalX2 && currentY === portalY2 ||
    appleX === portalX1 && appleY === portalY1 ||
    appleX === portalX2 && appleY === portalY2
  ) {
    currentX = round(random(columns - 1)) * width / columns;
    currentY = round(random(rows - 1)) * height / rows;
    direction = round(random(3));
    moveApple();
    movePortal();
  }
  frameRate(8);
}

function grid() {
  stroke("white");
  for (let lineX = 0; lineX <= width; lineX += width / columns) {
    line(lineX, 0, lineX, height);
  }
  for (let lineY = 0; lineY <= height; lineY += height / rows) {
    line(0, lineY, width, lineY);
  }
}

function moveSnake() {
  if (direction === 0) {
    currentX += width / columns;
  }
  else if (direction === 2) {
    currentX -= width / columns;
  }
  else if (direction === 1) {
    currentY += height / rows;
  }
  else {
    currentY -= height / rows;
  }
  if (
    (snakeCoords.some(
      (arr) => JSON.stringify(arr) === JSON.stringify([currentX, currentY])
    ) ||
      currentX >= width ||
      currentX < 0 ||
      currentY >= height ||
      currentY < 0) &&
    !godMode
  ) {
    if (!gracePeriod) {
      currentX = width ** width;
      snakeCoords = [];
    }
    else {
      gracePeriod = false;
      if (direction === 0) {
        currentX -= width / columns;
      }
      else if (direction === 2) {
        currentX += width / columns;
      }
      else if (direction === 1) {
        currentY -= height / rows;
      }
      else {
        currentY += height / rows;
      }
    }
  }
  else {
    gracePeriod = true; 
  } 
  
  stroke("black");
  fill("white");
  for (let bodyPart = 0; bodyPart < snakeCoords.length; bodyPart++) {
    rect(
      snakeCoords[bodyPart][0],
      snakeCoords[bodyPart][1],
      width / columns,
      height / rows
    );
  }
  fill("yellow");
  rect(currentX, currentY, width / columns, height / rows);
}

function apple() {
  noStroke();
  fill("red");
  while (
    round(currentX) === round(appleX) && round(currentY) === round(appleY) ||
    round(appleX) === round(portalX1) && round(appleY) === round(portalY1) ||
    round(appleX) === round(portalX2) && round(appleY) === round(portalY2)
  ) {
    moveApple();
    ateApple = true;
    for (let bodyPart = 0; bodyPart < snakeCoords.length; bodyPart++) {
      if (
        round(snakeCoords[bodyPart][0]) === round(appleX) &&
        round(snakeCoords[bodyPart][1]) === round(appleY)
      ) {
        appleX = currentX;
        appleY = currentY;
      }
    }
  }
  rect(appleX, appleY, width / columns, height / rows);
}

function portal() {
  noStroke();
  fill("blue");
  if (
    round(currentX) === round(portalX1) &&
    round(currentY) === round(portalY1)
  ) {
    currentX = portalX2;
    currentY = portalY2;
    while (
      round(currentX) === round(portalX1) &&
        round(currentY) === round(portalY1) ||
      round(currentX) === round(portalX2) &&
        round(currentY) === round(portalY2) ||
      round(appleX) === round(portalX1) &&
        round(appleY) === round(portalY1) ||
      round(appleX) === round(portalX2) && round(appleY) === round(portalY2)
    ) {
      movePortal();
      for (let bodyPart = 0; bodyPart < snakeCoords.length; bodyPart++) {
        if (
          round(snakeCoords[bodyPart][0]) === round(portalX1) &&
            round(snakeCoords[bodyPart][1]) === round(portalY1) ||
          round(snakeCoords[bodyPart][0]) === round(portalX2) &&
            round(snakeCoords[bodyPart][1]) === round(portalY2)
        ) {
          portalX1 = currentX;
          portalY1 = currentY;
        }
      }
    }
  }
  if (
    round(currentX) === round(portalX2) &&
    round(currentY) === round(portalY2)
  ) {
    currentX = portalX1;
    currentY = portalY1;
    while (
      round(currentX) === round(portalX1) &&
        round(currentY) === round(portalY1) ||
      round(currentX) === round(portalX2) &&
        round(currentY) === round(portalY2) ||
      round(appleX) === round(portalX1) &&
        round(appleY) === round(portalY1) ||
      round(appleX) === round(portalX2) && round(appleY) === round(portalY2)
    ) {
      movePortal();
      for (let bodyPart = 0; bodyPart < snakeCoords.length; bodyPart++) {
        if (
          round(snakeCoords[bodyPart][0]) === round(portalX1) &&
            round(snakeCoords[bodyPart][1]) === round(portalY1) ||
          round(snakeCoords[bodyPart][0]) === round(portalX2) &&
            round(snakeCoords[bodyPart][1]) === round(portalY2)
        ) {
          portalX2 = currentX;
          portalY2 = currentY;
        }
      }
    }
  }

  rect(portalX1, portalY1, width / columns, height / rows);
  rect(portalX2, portalY2, width / columns, height / rows);
}

function snakeBody() {
  if (gracePeriod) {
    snakeCoords.push([currentX, currentY]);
    if (!ateApple) {
      snakeCoords.shift();
    }
    else {
      ateApple = false;
    }
  }
}

function draw() {
  background("black");
  grid();
  moveSnake();
  canTurn = true;
  apple();
  portal();
  snakeBody();
}

function keyPressed() {
  if ((keyCode === 37 || keyCode === 65) && canTurn) {
    // left arrow or a
    if (direction > 0) {
      direction--;
    }
    else {
      direction = 3;
    }
    canTurn = false;
  }
  else if ((keyCode === 39 || keyCode === 68) && canTurn) {
    // right arrow or d
    if (direction < 3) {
      direction++;
    }
    else {
      direction = 0;
    }
    canTurn = false;
  }
}
