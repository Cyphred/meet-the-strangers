import * as store from "./store.js";
import * as ui from "./ui.js";
import * as constants from "./constants.js";

let socketIO = null;
let connectedUserDetails;

const handlePreOffer = (data) => {
  const { callType, callerSocketId } = data;

  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };

  switch (callType) {
    case constants.callType.CHAT_PERSONAL_CODE:
    case constants.callType.VIDEO_PERSONAL_CODE:
      ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
      break;
  }
};

export const sendPreOffer = (callType, receiverCode) => {
  connectedUserDetails = {
    callType,
    socketId: receiverCode,
  };

  switch (callType) {
    case constants.callType.CHAT_PERSONAL_CODE:
    case constants.callType.VIDEO_PERSONAL_CODE:
      ui.showOutgoingCallDialog(cancelCallHandler);
      break;
  }

  socketIO.emit("pre-offer", { callType, receiverCode });
};

const acceptCallHandler = () => {
  console.log("Call accepted");
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
};

const rejectCallHandler = () => {
  console.log("Call rejected");
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
};

const cancelCallHandler = () => {
  console.log("Call cancelled");
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

const sendPreOfferAnswer = (preOfferAnswer) => {
  const data = {
    callerSocketId: connectedUserDetails.socketId,
    preOfferAnswer,
  };

  socketIO.emit("pre-offer-answer", data);
};
