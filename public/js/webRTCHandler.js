import * as wss from "./wss.js";
import * as store from "./store.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";

let connectedUserDetails;
let peerConnection;
const defaultConstraints = {
  audio: true,
  video: true,
};

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:13902" }],
};

export const getLocalPreview = () => {
  // Gets user media devices
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      ui.updateLocalVideo(stream);
      store.setLocalStream(stream);
    })
    .catch((err) => {
      console.error(err);
    });
};

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      // Send our ICE candidates to peer
    }
  };
  peerConnection.onconnectionstatechange = (event) => {
    if (peerConnection.connectionState === "connected") {
    }
  };

  // Receiving tracks
  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteVideo(remoteStream);

  peerConnection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  };

  // Add our stream to peer connection
  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const localStream = store.getState().localStream;

    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
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

  wss.sendPreOffer({ callType, receiverCode });
};

export const handlePreOffer = (data) => {
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

const acceptCallHandler = () => {
  createPeerConnection();
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);
};

const rejectCallHandler = () => {
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
};

const cancelCallHandler = () => {};

const sendPreOfferAnswer = (preOfferAnswer) => {
  const data = {
    callerSocketId: connectedUserDetails.socketId,
    preOfferAnswer,
  };

  ui.removeAllDialogs();
  wss.sendPreOfferAnswer(data);
};

export const handlePreOfferAnswer = (data) => {
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
      ui.showCallElements(connectedUserDetails.callType);
      createPeerConnection();
      sendWebRTCOffer();
      break;
  }
};

const sendWebRTCOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  wss.sendDataUsingWebRTCSignalling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignalling.OFFER,
    offer: offer,
  });
};

export const handleWebRTCOffer = (data) => {
  console.log("webRTC offer received");
  console.log(data);
};
