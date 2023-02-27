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

const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data;

  ui.removeAllDialogs();

  switch (preOfferAnswer) {
    case constants.preOfferAnswer.RECEIVER_NOT_FOUND:
      // Show dialog that user has not been found
      ui.showInfoDialog(preOfferAnswer);
      break;
    case constants.preOfferAnswer.CALL_UNAVAILABLE:
      // Show dialog that user is not available for a call
      ui.showInfoDialog(preOfferAnswer);
      break;
    case constants.preOfferAnswer.CALL_REJECTED:
      // Show dialog that call has been rejected
      ui.showInfoDialog(preOfferAnswer);
      break;
    case constants.preOfferAnswer.CALL_ACCEPTED:
      // Send webRTC offer
      ui.showCallElements(connectedUserDetails.callType);
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
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);
};

const rejectCallHandler = () => {
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
};

const cancelCallHandler = () => {};

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

  socket.on("pre-offer-answer", (data) => {
    handlePreOfferAnswer(data);
  });
};

const sendPreOfferAnswer = (preOfferAnswer) => {
  const data = {
    callerSocketId: connectedUserDetails.socketId,
    preOfferAnswer,
  };

  ui.removeAllDialogs();
  socketIO.emit("pre-offer-answer", data);
};
