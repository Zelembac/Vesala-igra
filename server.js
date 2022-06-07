const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

app.use(express.static(path.join(__dirname + "/public")));

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.username = "Gost";

  socket.on("newuser", (data) => {
    socket.broadcast.emit("user-connected", { username: data.username });
    socket.emit("user-connected", { username: data.username });
    socket.username = data.username;
  });
  socket.on("dissconnected", (data) => {
    socket.broadcast.emit("user-dissconnected", { username: socket.username });
    socket.emit("user-dissconnected", { username: socket.username });
  });

  socket.on("chat", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-ovo", {
      message: data.message,
      username: socket.username,
    });
    socket.emit("chat-ovo", {
      message: data.message,
      username: socket.username,
    });
  });
  socket.on("kuca", (data) => {
    socket.broadcast.emit("kuca", { username: socket.username });
  });
});

server.listen(5000);
