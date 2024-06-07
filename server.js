const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const Filter = require("bad-words");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const handler = require("./utils/messages");
const userHandler = require("./utils/users");

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("a new connection established!!!");

  socket.on("join", ({ username, room }, callback) => {
    const { err, user } = userHandler.addUser({
      id: socket.id,
      username,
      room,
    });

    if (err) {
      return callback(err);
    }

    socket.join(user.room);

    socket.emit(
      "message",
      handler.generateMessage("CHAT-GOD", "welcome to the chat")
    );
    socket.broadcast
      .to(room)
      .emit(
        "message",
        handler.generateMessage(
          "CHAT-GOD",
          `${user.username} has joined the room`
        )
      );

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: userHandler.getUsersOfRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = userHandler.getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("profanity is not allowed");
    }

    // const filteredMsg = filter.clean(message);
    io.to(user.room).emit(
      "message",
      handler.generateMessage(user.username, message)
    );
    callback();
  });

  socket.on("sendLocation", (coordinates) => {
    const user = userHandler.getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      handler.locationMessage(user.username, coordinates)
    );
  });

  socket.on("disconnect", () => {
    const user = userHandler.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        handler.generateMessage(
          "CHAT-GOD",
          `${user.username} has left the chat`
        )
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: userHandler.getUsersOfRoom(user.room),
      });
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
