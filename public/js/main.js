const socket = io("/");
socket.on("connect", () => {
  console.log("Successfully connected to WS server via", socket.id);
});
