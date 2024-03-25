// Bubble Movement Demo
// Object Notation and ArraysDemo
// March 25, 2024

let theBubbles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 5; i++) {
    spawnBubble;
  }
}

function draw() {
  background(220);

  displayBubbles();
}

function displayBubbles() {
  for (let bubble of theBubbles) {
    circle(bubble.x, bubble.y, bubble.size);
  }
}


function spawnBubble() {
  let someBubble = {
    size: random(10, 30),
    x: random(width),
    y: random(height),
    speed: 3,
    r: random(255),
    g: random(255),
    b: random(255),
    alpha: random(255)
  };
  theBubbles.push(someBubble);
}