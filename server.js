const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("a new connection established!!!");

  socket.emit("message", "welcome to the chat");
  socket.broadcast.emit("message", "a new user has joined....");

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("sendLocation", (coordinates) => {
    io.emit("locationMessage", coordinates);
  });

  socket.on("disconnect", () => {
    io.emit("message", "a user has left....");
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
