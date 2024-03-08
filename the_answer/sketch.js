// works best if these are the same
let columns = 20;
let rows = 20;

let godMode = false; //makes the snake INVINCIBLE

let ateApple = false;
let canTurn = true;
let gracePeriod = true;

let snakeCoords = [];

// declaration of things to be changed in the setup function
let currentX;
let currentY;
let appleX;
let appleY;
let portalX1;
let portalX2;
let portalY1;
let portalY2;
let direction;


function moveApple() {
  /**Sets appleX and appleY to random values equivalent to grid coordinates.*/
  appleX = round(random(columns - 1)) * width / columns;
  appleY = round(random(rows - 1)) * height / rows;
}

function movePortal() {
  /**Sets each portal's coordinates to random values equivalent to grid coordinates.*/
  portalX1 = round(random(columns - 1)) * width / columns;
  portalY1 = round(random(rows - 1)) * height / rows;
  portalX2 = round(random(columns - 1)) * width / columns;
  portalY2 = round(random(rows - 1)) * height / rows;
}

function setup() {
  createCanvas(400, 400); // Change this value to resize the window; works best with squares.

  while (
    // The snake should start facing over half of the squares.
    direction === 0 && currentX > width / 2 ||
    direction === 2 && currentX < width / 2 ||
    direction === 1 && currentY > width / 2 ||
    direction === 3 && currentY < width / 2 ||

    // Ensures nothing initially spawns on each other.
    currentX === appleX && currentY === appleY ||
    currentX === portalX1 && currentY === portalY1 ||
    currentX === portalX2 && currentY === portalY2 ||
    appleX === portalX1 && appleY === portalY1 ||
    appleX === portalX2 && appleY === portalY2
  ) {

    // Randomly sets initial values.
    currentX = round(random(columns - 1)) * width / columns;
    currentY = round(random(rows - 1)) * height / rows;
    direction = round(random(3));
    moveApple();
    movePortal();
  }
  frameRate(8); // Change this value to change the speed. (Default: 8)
}

function grid() {
  /**Draws a white grid with the amount of rows and columns equal to their variable counterparts.*/
  stroke("white");

  // Draws columns.
  for (let lineX = 0; lineX <= width; lineX += width / columns) {
    line(lineX, 0, lineX, height);
  }

  // Draws rows.
  for (let lineY = 0; lineY <= height; lineY += height / rows) {
    line(0, lineY, width, lineY);
  }
}

function moveSnake() {
  /**Updates currentX and currentY based on the current direction faced, and kills the snake when colliding with itself or leaving the boundaries if godMode is false, after a turn of nothing happening.*/
  
  // Updates snake's position.
  if (direction === 0) { // Facing right.
    currentX += width / columns;
  }
  else if (direction === 2) { // Facing left.
    currentX -= width / columns;
  }
  else if (direction === 1) { // Facing down.
    currentY += height / rows;
  }
  else {  // Facing up.
    currentY -= height / rows;
  }

  // Snake death logic.
  if (
    
    // The new position collides with a body part.  
    (snakeCoords.some(
      (arr) => JSON.stringify(arr) === JSON.stringify([currentX, currentY])
    ) ||
    // The snake leaves the screen.
      currentX >= width ||
      currentX < 0 ||
      currentY >= height ||
      currentY < 0) &&

    // Ignores all of this if godMode is on.  
    !godMode
  ) {
    
    // Kills the snake by permanently moving it off screen after giving the user a chance to recover.
    if (!gracePeriod) {
      currentX = width ** width;
      snakeCoords = [];
    }
    
    // Gives the user a chance to recover by moving the snake back to it's previous position for one turn.
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

  // Resets gracePeriod if safe.
  else {
    gracePeriod = true; 
  } 
  
  // Draws the snake's body.
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

  // Draws the snake's head.
  fill("yellow");
  rect(currentX, currentY, width / columns, height / rows);
}

function apple() {
  /** */
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
