const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("a new connection established!!!");

  socket.emit("message", "welcome to the chat");
  socket.broadcast.emit("message", "a new user has joined....");

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("profanity is not allowed");
    }

    // const filteredMsg = filter.clean(message);
    io.emit("message", message);
    callback();
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
