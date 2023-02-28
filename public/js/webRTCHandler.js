import * as store from "./store.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";

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
      console.log("Stream fetched");
      ui.updateLocalVideo(stream);
      store.setLocalStream(stream);
    })
    .catch((err) => {
      console.log("Error accessing local media streams");
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
      console.log("Successfully connected with peer");
    }
  };

  // Receiving tracks
  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteVideo(remoteStream);

  peerConnection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  };
};
