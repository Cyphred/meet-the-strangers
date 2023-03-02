import * as wss from "./wss.js";
import * as webRTCHandler from "./webRTCHandler.js";

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
    // No stranger available
  }
};
