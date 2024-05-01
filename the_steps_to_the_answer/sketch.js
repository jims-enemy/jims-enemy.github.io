let socket;
let userInput;
let textArea;
let userText = "";

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = new WebSocket("ws://localhost:8000");
  socket.onopen = () => {
    console.log("WebSocket connection established!");
  };
  socket.onmessage = (event) => {
    console.log("Received message from Python:", event.data);
  };
  userInput = createElement("textarea");
  userInput.position(width/16, height/7 * 6);
  userInput.size(width/8 * 7, height/9);
  userInput.style("resize", "none");
  stroke("white");
  textAlign(LEFT, TOP);
  fill("white");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  userInput.position(width/16, height/7 * 6);
  userInput.size(width/8 * 7, height/9);
}

function draw() {
  background("black");
  text(userText, width/16, 0, width/8 * 7, height/7 * 6);
}

function keyPressed() {
  if (keyCode === ENTER && userInput.elt === document.activeElement && ! keyIsDown(SHIFT)) {
    let lineBrokenText = "";
    let startSlice = 0;

    socket.send(userInput.value());

    for (let character = 0; character < lineBrokenText.length; character++) {
      if (textWidth(userInput.value().slice(startSlice, character)) > width/8 * 7) {
        character--;
        lineBrokenText += userInput.value().slice(startSlice, character) + "\n";
        startSlice = character;
      }
    }
    userText = lineBrokenText;
    userInput.value("");
    userInput.elt.blur();
  }
}