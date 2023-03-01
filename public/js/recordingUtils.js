import * as store from "./store.js";

let mediaRecorder;
const recordedChunks = [];

// Defines codecs to be used
const vp9Codec = "video/webm; codecs=vp=9";
const vp9Options = { mimeType: vp9Codec };

export const startRecording = () => {
  const remoteStream = store.getState().remoteStream;

  // Tries to create a MediaRecorder instance using the preferred
  // codec if it is available. If not, allows MediaRecorder to
  // decide what codec to use.
  if (MediaRecorder.isTypeSupported(vp9Codec)) {
    mediaRecorder = new MediaRecorder(remoteStream, vp9Options);
  } else {
    mediaRecorder = new MediaRecorder(remoteStream);
  }

  // Will be called once the recording is stopped
  mediaRecorder.ondataavailable = handleDataAvailable;

  mediaRecorder.start();
};

export const pauseRecording = () => {
  mediaRecorder.pause();
};

export const resumeRecording = () => {
  mediaRecorder.resume();
};

export const stopRecording = () => {
  mediaRecorder.stop();
};

const downloadRecordedVideo = () => {
  const blob = new Blob(recordedChunks, { type: "video/webm" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = "recording.webm";

  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    downloadRecordedVideo();
  }
};
