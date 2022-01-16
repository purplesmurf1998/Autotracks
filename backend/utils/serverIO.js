const { Server } = require('socket.io');
var io = null;

exports.io = function() {
  return io;
}

exports.initialize = function(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:8080", "http://localhost:8081"]
    }
  })
  // start the socket
  io.on("connection", (socket) => {
    console.log("Socket " + socket.id + " connected.");
    socket.emit("connected", "Connected to server socket");
  });
  io.on("disconnect", (socket) => {
    console.log("Socket " + socket.id + " disconnected.");
  });
}
