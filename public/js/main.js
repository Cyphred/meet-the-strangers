import * as store from "./store.js";
const socket = io("/");

socket.on("connect", () => {
  console.log("Successfully connected to WS server via", socket.id);
  store.setSocketId(socket.id);
});
