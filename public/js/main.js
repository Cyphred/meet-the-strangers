import * as store from "./store.js";
import * as constants from "./constants.js";
import * as wss from "./wss.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as ui from "./ui.js";
import * as recordingUtils from "./recordingUtils.js";

// Initializtion of socketIO connection
const socket = io("/");
wss.registerSocketEvents(socket);

// Shows local video preview
webRTCHandler.getLocalPreview();

// Registers event for personal code copy button
const personalCodeCopyButton = document.getElementById(
  "personal_code_copy_button"
);
personalCodeCopyButton.addEventListener("click", () => {
  const personalCode = store.getState().socketId;
  navigator.clipboard && navigator.clipboard.writeText(personalCode);
  //alert("Your perosnal code has been copied to the clipboard!");
});

// Registers event listeners for connection buttons
const personalCodeChatButton = document.getElementById(
  "personal_code_chat_button"
);

const personalCodeVideoButton = document.getElementById(
  "personal_code_video_button"
);

const personalCodeInput = document.getElementById("personal_code_input");

personalCodeChatButton.addEventListener("click", () => {
  webRTCHandler.sendPreOffer(
    constants.callType.CHAT_PERSONAL_CODE,
    personalCodeInput.value
  );
});

personalCodeVideoButton.addEventListener("click", () => {
  webRTCHandler.sendPreOffer(
    constants.callType.VIDEO_PERSONAL_CODE,
    personalCodeInput.value
  );
});

// Event listeners for video call buttons

const micButton = document.getElementById("mic_button");
micButton.addEventListener("click", () => {
  const localStream = store.getState().localStream;
  const micEnabled = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks()[0].enabled = !micEnabled;
  ui.updateMicButton(!micEnabled);
});

const cameraButton = document.getElementById("camera_button");
cameraButton.addEventListener("click", () => {
  const localStream = store.getState().localStream;
  const cameraEnabled = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks()[0].enabled = !cameraEnabled;
  ui.updateCameraButton(!cameraEnabled);
});

const screenSharingButton = document.getElementById("screen_sharing_button");
screenSharingButton.addEventListener("click", () => {
  const enabled = store.getState().screenSharingActive;
  webRTCHandler.toggleScreenSharing(enabled);
});

// Messenger

const newMessageInput = document.getElementById("new_message_input");
newMessageInput.addEventListener("keydown", (event) => {
  console.log("Change occurred");
  const key = event.key;

  if (key === "Enter") {
    webRTCHandler.sendMessageUsingDataChannel(event.target.value);
    ui.appendMessage(event.target.value, true);
    newMessageInput.value = "";
  }
});

const sendMessageButton = document.getElementById("send_message_button");
sendMessageButton.addEventListener("click", () => {
  const message = newMessageInput.value;
  webRTCHandler.sendMessageUsingDataChannel(message);
  ui.appendMessage(message, true);
  newMessageInput.value = "";
});

// Recording
const startRecordingButton = document.getElementById("start_recording_button");
startRecordingButton.addEventListener("click", () => {
  recordingUtils.startRecording();
  ui.showRecordingPanel();
});

const stopRecordingButton = document.getElementById("stop_recording_button");
stopRecordingButton.addEventListener("click", () => {
  recordingUtils.stopRecording();
  ui.resetRecordingButtons();
});

const pauseRecordingButton = document.getElementById("pause_recording_button");
pauseRecordingButton.addEventListener("click", () => {
  recordingUtils.pauseRecording();
  ui.switchRecordingButtons(true);
});

const resumeRecordingButton = document.getElementById(
  "resume_recording_button"
);
resumeRecordingButton.addEventListener("click", () => {
  recordingUtils.resumeRecording();
  ui.switchRecordingButtons();
});

// Hang up

const hangUpButton = document.getElementById("hang_up_button");
hangUpButton.addEventListener("click", () => {
  webRTCHandler.handleHangUp();
});

const hangupChatButton = document.getElementById("finish_chat_call_button");
hangupChatButton.addEventListener("click", () => {
  webRTCHandler.handleHangUp();
});
