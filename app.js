const express = require("express");
const http = require("http");
const { isObject } = require("util");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const socketio = require("socket.io")(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let connectedPeers = [];

socketio.on("connection", (socket) => {
  connectedPeers.push(socket.id);
  console.log(connectedPeers);

  socket.on("disconnect", () => {
    const newConnectedPeers = connectedPeers.filter((peerSocketId) => {
      peerSocketId !== socket.io;
    });

    connectedPeers = newConnectedPeers;
    console.log(connectedPeers);
  });
});

server.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
