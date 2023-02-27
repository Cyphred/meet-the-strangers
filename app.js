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

  socket.on("pre-offer", (data) => {
    const connectedPeer = connectedPeers.find((peerSocketId) => {
      return peerSocketId === data.receiverCode;
    });

    if (connectedPeer) {
      const emitData = {
        callerSocketId: socket.id,
        callType: data.callType,
      };

      socketio.to(data.receiverCode).emit("pre-offer", emitData);
    }
  });

  socket.on("pre-offer-answer", (data) => {
    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === data.callerSocketId
    );

    if (connectedPeer) {
      socketio.to(data.callerSocketId).emit("pre-offer-answer", data);
    }
  });

  socket.on("disconnect", () => {
    const newConnectedPeers = connectedPeers.filter((peerSocketId) => {
      return peerSocketId !== socket.id;
    });

    connectedPeers = newConnectedPeers;
    console.log(connectedPeers);
  });
});

server.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
