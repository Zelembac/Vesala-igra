const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

app.use(express.static(path.join(__dirname + "/public")));

const io = require("socket.io")(server);
const users = {};

io.on("connection", (socket) => {
  socket.on("newuser", (data) => {
    users[socket.id] = data;
    socket.broadcast.emit("user-connected", data);
    socket.emit("user-connected", data);
  });
  socket.on("disconnected", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    socket.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });

  socket.on("chat", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", {
      message: data,
      username: users[socket.id],
    });
    socket.emit("chat-message", {
      message: data,
      username: users[socket.id],
    });
  });
  socket.on("kuca", (data) => {
    socket.broadcast.emit("kuca", users[socket.id]);
  });
});

server.listen(5000);
