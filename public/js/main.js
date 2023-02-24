import * as store from "./store.js";
import * as ui from "./ui.js";

export const registerSocketEvents = (socket) => {
  socket.on("connect", () => {
    console.log("Successfully connected to WS server via", socket.id);
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
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

// Registers event listeners for connection buttons
const personalCodeChatButton = document.getElementById(
  "personal_code_chat_button"
);

personalCodeChatButton.addEventListener("click", () => {
  console.log("Chat button clicked");
});

const personalCodeVideoButton = document.getElementById(
  "personal_code_video_button"
);

personalCodeVideoButton.addEventListener("click", () => {
  console.log("Video button clicked");
});
