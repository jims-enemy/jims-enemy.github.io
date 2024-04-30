let socket;

function setup() {
  createCanvas(400, 400);
  
  // Connect to the server
  socket = io.connect("http://localhost:5000");
  
  // Send a message to the server
  socket.emit("message", "Hello from p5.js!");
  
  // Listen for responses from the server
  socket.on("response", function(data) {
    console.log(data);
  });
}

function draw() {
  background(220);
}
