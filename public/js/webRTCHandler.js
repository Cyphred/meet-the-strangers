import * as wss from "./wss.js";
import * as store from "./store.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";

let connectedUserDetails; // Stores the information of the connected peer
let peerConnection; // Stores the information of the connection with peer
let dataChannel; // Stores the data channel for transceiving text

// Defines the user media to request permissions for
const defaultConstraints = {
  audio: true,
  video: true,
};

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:13902" }],
};

/**
 * Sets up the local video stream
 */
export const getLocalPreview = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints) // Gets user media devices
    .then((stream) => {
      // Update UI to show local stream
      ui.updateLocalVideo(stream);

      // Shows video call buttons once local stream is available
      ui.showVideoCallButtons();

      // Sets user's state to be available for a video call
      store.setCallState(constants.callState.CALL_AVAILABLE);

      // Save local stream to state
      store.setLocalStream(stream);
    })
    .catch((err) => {
      console.error(err);
    });
};

/**
 * Initializes a webRTC peer connection
 */
const createPeerConnection = () => {
  // Initialize with defined settings
  peerConnection = new RTCPeerConnection(configuration);

  // Creates a data channel named "chat"
  dataChannel = peerConnection.createDataChannel("chat");

  peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;
    dataChannel.onopen = () => {};

    dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      ui.appendMessage(message);
    };
  };

  // Event listener upon receiving ICE candidate
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      // Send our ICE candidates to peer
      wss.sendDataUsingWebRTCSignalling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignalling.ICE_CANDIDATE,
        candidate: event.candidate,
      });
    }
  };

  // Event listener upon connection state changing
  peerConnection.onconnectionstatechange = (event) => {
    if (peerConnection.connectionState === "connected") {
      // TODO add logic for when the connection's status is 'connected'
    }
  };

  // Prepare state and UI to accommodate an incoming media stream
  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteVideo(remoteStream);

  // Event listener upon receiving tracks
  peerConnection.ontrack = (event) => {
    // Send incoming media stream to prepared stream
    remoteStream.addTrack(event.track);
  };

  // Add our stream to peer connection for sending if call type is video
  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    // Fetch local stream object
    const localStream = store.getState().localStream;

    // Iterate through stored audio and video stream and add them to peer connection
    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  }
};

// TODO document this
export const sendMessageUsingDataChannel = (message) => {
  const stringifiedMessage = JSON.stringify(message);
  dataChannel.send(stringifiedMessage);
};

/**
 * Prepares a webRTC offer before sending it to a peer
 * @param {String} callType is the constant defining the type of call
 * @param {String} receiverCode is the socket ID of the receiver
 */
export const sendPreOffer = (callType, receiverCode) => {
  // Save the peer and the call's details
  connectedUserDetails = {
    callType,
    socketId: receiverCode,
  };

  // Show outgoing call dialog when initiating either a video or
  // chat call using a personal code
  switch (callType) {
    case constants.callType.CHAT_PERSONAL_CODE:
    case constants.callType.VIDEO_PERSONAL_CODE:
      ui.showOutgoingCallDialog(cancelCallHandler);
      break;
  }

  // Makes caller unavailable for calling before sending the offer
  store.setCallState(constants.callState.CALL_UNAVAILABLE);

  // Emits the offer to the receiver
  wss.sendPreOffer({ callType, receiverCode });
};

/**
 * Handles incoming pre-offers
 * @param {Object} data is the object containing the pre-offer's information
 */
export const handlePreOffer = (data) => {
  // Destructure the required data
  const { callType, callerSocketId } = data;

  if (!checkCallPossibility(callType)) {
    return sendPreOfferAnswer(
      constants.preOfferAnswer.CALL_UNAVAILABLE,
      callerSocketId
    );
  }

  // Update the connected user's details
  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };

  // Make receiver unavailable
  store.setCallState(constants.callState.CALL_UNAVAILABLE);

  // Show incoming call dialog when a pre-offer for a chat or video call
  // using a personal code is received
  switch (callType) {
    case constants.callType.CHAT_PERSONAL_CODE:
    case constants.callType.VIDEO_PERSONAL_CODE:
      ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
      break;
  }
};

/**
 * Handles the acceptance of a call
 */
const acceptCallHandler = () => {
  createPeerConnection();
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);
};

/**
 * Handles the rejection of a call
 */
const rejectCallHandler = () => {
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
  setIncomingCallsAvailable();
};

const cancelCallHandler = () => {};

/**
 * Sends an answer to the pre-offer and updates the UI accordingly
 * @param {String} preOfferAnswer is the answer to be returned to the caller
 */
const sendPreOfferAnswer = (preOfferAnswer, callerSocketId = null) => {
  const socketId = callerSocketId
    ? callerSocketId
    : connectedUserDetails.socketId;
  const data = {
    callerSocketId: socketId,
    preOfferAnswer,
  };

  ui.removeAllDialogs();
  wss.sendPreOfferAnswer(data);
};

/**
 * Handles incoming answers to a previous pre-offer
 * @param {Object} data is the contents of the incoming answer
 */
export const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data;

  ui.removeAllDialogs();

  switch (preOfferAnswer) {
    case constants.preOfferAnswer.RECEIVER_NOT_FOUND:
      // Show dialog that user has not been found
      ui.showInfoDialog(preOfferAnswer);
      setIncomingCallsAvailable();
      break;
    case constants.preOfferAnswer.CALL_UNAVAILABLE:
      // Show dialog that user is not available for a call
      ui.showInfoDialog(preOfferAnswer);
      setIncomingCallsAvailable();
      break;
    case constants.preOfferAnswer.CALL_REJECTED:
      // Show dialog that call has been rejected
      ui.showInfoDialog(preOfferAnswer);
      setIncomingCallsAvailable();
      break;
    case constants.preOfferAnswer.CALL_ACCEPTED:
      ui.showCallElements(connectedUserDetails.callType);
      createPeerConnection();
      sendWebRTCOffer();
      break;
  }
};

/**
 * Sends a webRTC offer to the connected peer
 */
const sendWebRTCOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  wss.sendDataUsingWebRTCSignalling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignalling.OFFER,
    offer: offer,
  });
};

/**
 * Handles incoming webRTC offers
 * @param {Object} data is the information received from the webRTC signal
 */
export const handleWebRTCOffer = async (data) => {
  // Setting of SDP data
  await peerConnection.setRemoteDescription(data.offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  wss.sendDataUsingWebRTCSignalling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignalling.ANSWER,
    answer,
  });
};

/**
 * Handles incoming webRTC answers
 * @param {Object} data is the information received from the webRTC answer
 */
export const handleWebRTCAnswer = async (data) => {
  await peerConnection.setRemoteDescription(data.answer);
};

export const handleWebRTCCandidate = async (data) => {
  try {
    await peerConnection.addIceCandidate(data.candidate);
  } catch (err) {
    console.error(
      "Error occured when trying to add received ICE candidate",
      err
    );
  }
};

let screenSharingStream;

export const toggleScreenSharing = async (enabled) => {
  if (enabled) {
    const localStream = store.getState().localStream;
    const senders = peerConnection.getSenders();
    const videoSender = senders.find((sender) => {
      return sender.track.kind === localStream.getVideoTracks()[0].kind;
    });
    if (videoSender) {
      videoSender.replaceTrack(localStream.getVideoTracks()[0]);
    }

    // Stop screen sharing stream
    store
      .getState()
      .screenSharingStream.getTracks()
      .forEach((track) => track.stop());

    store.setScreenSharingActive(!enabled);

    ui.updateLocalVideo(localStream);
  } else {
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      store.setScreenSharingStream(screenSharingStream);

      // Replace current video track that is being sent
      const senders = peerConnection.getSenders();
      const videoSender = senders.find((sender) => {
        return (
          sender.track.kind === screenSharingStream.getVideoTracks()[0].kind
        );
      });
      if (videoSender) {
        videoSender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
      }

      store.setScreenSharingActive(!enabled);

      ui.updateLocalVideo(screenSharingStream);
    } catch (err) {
      console.error(
        "Error occurred when trying to get screen sharing stream",
        err
      );
    }
  }
};

// Hang up

export const handleHangUp = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  };

  wss.sendUserHangedUp(data);
  closePeerConnectionAndResetState();
};

export const handleConnectedUserHangedUp = () => {
  closePeerConnectionAndResetState();
};

const closePeerConnectionAndResetState = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  // Set mic and camera active for the next call in case one or both
  // is deactivated in the current call
  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === constants.callType.VIDEO_STRANGER
  ) {
    store.getState().localStream.getVideoTracks()[0].enabled = true;
    store.getState().localStream.getAudioTracks()[0].enabled = true;
  }

  ui.updateUIAfterHangUp(connectedUserDetails.callType);
  setIncomingCallsAvailable();
  connectedUserDetails = null;
};

const checkCallPossibility = (callType) => {
  const callState = store.getState().callState;

  if (callState === constants.callState.CALL_AVAILABLE) {
    return true;
  }

  // If a video call is requested but the receiver is only available for text chat
  /* TODO possibly remove this block
  if (
    (callType === constants.callType.VIDEO_PERSONAL_CODE ||
      callType === constants.callType.VIDEO_STRANGER) &&
    callState === constants.callState.CALL_AVAILABLE_ONLY_CHAT
  ) {
    return false;
  }
  */

  return false;
};

/**
 * Sets call state depending on the availability of local video stream
 */
const setIncomingCallsAvailable = () => {
  const localStream = store.getState().localStream;
  if (localStream) {
    store.setCallState(constants.callState.CALL_AVAILABLE);
  } else {
    store.setCallState(constants.callState.CALL_AVAILABLE_ONLY_CHAT);
  }
};
