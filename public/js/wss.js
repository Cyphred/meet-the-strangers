import * as store from "./store.js";
import * as ui from "./ui.js";

let socketIO = null;

const handlePreOffer = (data) => {
  console.log(data);
};

export const sendPreOffer = (callType, receiverCode) => {
  socketIO.emit("pre-offer", { callType, receiverCode });
};

export const registerSocketEvents = (socket) => {
  socketIO = socket;

  socket.on("connect", () => {
    console.log("Successfully connected to WS server via", socket.id);
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
  });

  socket.on("pre-offer", (data) => {
    // webRTCHandler.handlePreOffer(data);
    handlePreOffer(data);
  });
};
