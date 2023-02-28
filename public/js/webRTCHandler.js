import * as store from "./store.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";

const defaultConstraints = {
  audio: true,
  video: true,
};
let peerConnection;

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
};
