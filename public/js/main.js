import * as store from "./store.js";
const socket = io("/");

export const registerSocketEvents = (socket) => {
  socket.on("connect", () => {
    console.log("Successfully connected to WS server via", socket.id);
    store.setSocketId(socket.id);
  });
};

// Initializtion of socketIO connection
const socket = io("/");
registerSocketEvents(socket);

// Registers event for personal code copy button
const personalCodeCopyButton = document.getElementById(
  "personal_code_copy_button"
);
personalCodeCopyButton.addEventListener("click", () => {
  const personalCode = store.getState().socketId;
  navigator.clipboard && navigator.clipboard.writeText(personalCode);
  alert("Your perosnal code has been copied to the clipboard!");
});
