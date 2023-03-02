import * as wss from "./wss.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as ui from "./ui.js";
import * as constants from "./constants.js";

let strangerCallType;

export const changeStrangerConnectionStatus = (status) => {
  const data = { status };
  wss.changeStrangerConnectionStatus(data);
};

export const getStrangerSocketIDAndConnect = (callType) => {
  strangerCallType = callType;
  wss.getStrangerSocketID();
};

export const connectWithStranger = (data) => {
  const { strangerSocketId } = data;

  if (strangerSocketId) {
    webRTCHandler.sendPreOffer(strangerCallType, strangerSocketId);
  } else {
    ui.showInfoDialog(constants.preOfferAnswer.NO_STRANGER_AVAILABLE);
  }
};
