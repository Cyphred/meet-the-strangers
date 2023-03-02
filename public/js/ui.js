import * as constants from "./constants.js";
import * as elements from "./elements.js";

export const updatePersonalCode = (personalCode) => {
  const personalCodeParagraph = document.getElementById(
    "personal_code_paragraph"
  );
  personalCodeParagraph.innerHTML = personalCode;
};

// Updates the placeholder for the local video stream with the
// provided media stream
export const updateLocalVideo = (stream) => {
  // Fetch element where stream will be playing
  const localVideo = document.getElementById("local_video");

  // Set the provided stream as the source object
  localVideo.srcObject = stream;

  // Play the video once its metadata is loaded
  localVideo.addEventListener("loadmetadata", () => {
    localVideo.onplay();
  });
};

export const updateRemoteVideo = (stream) => {
  const remoteVideo = document.getElementById("remote_video");
  remoteVideo.srcObject = stream;
};

export const showIncomingCallDialog = (
  callType,
  acceptCallHandler,
  rejectCallHandler
) => {
  const callTypeInfo =
    callType === constants.callType.CHAT_PERSONAL_CODE ? "Chat" : "Video";

  const incomingCallDialog = elements.getIncomingCallDialog(
    callTypeInfo,
    acceptCallHandler,
    rejectCallHandler
  );

  // Removes all existing dialog elements before appending a new one
  removeAllDialogs();

  dialog.appendChild(incomingCallDialog);
};

export const showOutgoingCallDialog = (cancelCallHandler) => {
  const callingDialog = elements.getOutgoingCallDialog(cancelCallHandler);

  // Removes all existing dialog elements before appending a new one
  removeAllDialogs();

  dialog.appendChild(callingDialog);
};

export const removeAllDialogs = () => {
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
};

export const showInfoDialog = (preOfferAnswer) => {
  let infoDialog = null;

  switch (preOfferAnswer) {
    case constants.preOfferAnswer.CALL_REJECTED:
      infoDialog = elements.getInfoDialog(
        "Call rejected",
        "User has rejected your call."
      );
      break;
    case constants.preOfferAnswer.RECEIVER_NOT_FOUND:
      infoDialog = elements.getInfoDialog(
        "User not found",
        "You have entered an invalid code."
      );
      break;
    case constants.preOfferAnswer.CALL_UNAVAILABLE:
      infoDialog = elements.getInfoDialog(
        "Unable to contact User",
        "User is currently engaged in a call."
      );
      break;
  }

  if (infoDialog) {
    const dialog = document.getElementById("dialog");
    dialog.appendChild(infoDialog);

    // Removes all dialogs after 4 seconds
    setTimeout(() => {
      removeAllDialogs();
    }, [4000]);
  }
};

export const showCallElements = (callType) => {
  switch (callType) {
    case constants.callType.CHAT_PERSONAL_CODE:
      showChatCallElements();
      break;
    case constants.callType.VIDEO_PERSONAL_CODE:
      showVideoCallElements();
      break;
  }
};

const showChatCallElements = () => {
  const finishConnectionChatButtonContainer = document.getElementById(
    "finish_chat_button_container"
  );
  showElement(finishConnectionChatButtonContainer);

  const newMessageInput = document.getElementById("new_message");
  showElement(newMessageInput);

  // Block panel
  disableDashboard();
};

const showVideoCallElements = () => {
  const callButtons = document.getElementById("call_buttons");
  showElement(callButtons);

  const placeholder = document.getElementById("video_placeholder");
  hideElement(placeholder);

  const remoteVideo = document.getElementById("remote_video");
  showElement(remoteVideo);

  const newMessageInput = document.getElementById("new_message");
  showElement(newMessageInput);

  // Block panel
  disableDashboard();
};

// UI messages
export const appendMessage = (message, right = false) => {
  const messagesContainer = document.getElementById("messages_container");
  const messageElement = right
    ? elements.getSentMessage(message)
    : elements.getReceivedMessage(message);
  messagesContainer.appendChild(messageElement);
};
export const clearMessenger = () => {
  const messagesContainer = document.getElementById("messages_container");
  messagesContainer.querySelectorAll("*").forEach((n) => n.remove());
};

// Recording
export const showRecordingPanel = () => {
  const recordingButtons = document.getElementById("video_recording_buttons");
  showElement(recordingButtons);

  // Hides start recording button if there is an ongoing recording
  const startRecordingButton = document.getElementById(
    "start_recording_button"
  );
  hideElement(startRecordingButton);
};

/**
 * Hides the recording buttons and shows the start recording button.
 */
export const resetRecordingButtons = () => {
  const recordingButtons = document.getElementById("video_recording_buttons");
  hideElement(recordingButtons);

  const startRecordingButton = document.getElementById(
    "start_recording_button"
  );
  showElement(startRecordingButton);
};

export const switchRecordingButtons = (switchForResumeButton = false) => {
  const resumeButton = document.getElementById("resume_recording_button");
  const pauseButton = document.getElementById("pause_recording_button");

  if (switchForResumeButton) {
    hideElement(pauseButton);
    showElement(resumeButton);
  } else {
    hideElement(resumeButton);
    showElement(pauseButton);
  }
};

// UI after hanging up

export const updateUIAfterHangUp = (callType) => {
  enableDashboard();

  // Hide the call buttons
  if (
    callType === constants.callType.VIDEO_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_STRANGER
  ) {
    const callButtons = document.getElementById("call_buttons");
    hideElement(callButtons);
  } else {
    const chatCallButtons = document.getElementById(
      "finish_chat_button_container"
    );
    hideElement(chatCallButtons);
  }

  const newMessageInput = document.getElementById("new_message");
  hideElement(newMessageInput);
  clearMessenger();

  updateMicButton(false);
  updateCameraButton(false);

  // Hide remote video and show placeholder
  const remoteVideo = document.getElementById("remote_video");
  hideElement(remoteVideo);

  const placeholder = document.getElementById("video_placeholder");
  showElement(placeholder);

  removeAllDialogs();
};

// UI helper functions

const enableDashboard = () => {
  const dashboardBlocker = document.getElementById("dashboard_blur");
  if (!dashboardBlocker.classList.contains("display_none")) {
    dashboardBlocker.classList.add("display_none");
  }
};

const disableDashboard = () => {
  const dashboardBlocker = document.getElementById("dashboard_blur");
  if (!dashboardBlocker.classList.contains("display_none")) {
    dashboardBlocker.classList.remove("display_none");
  }
};

const hideElement = (element) => {
  if (!element.classList.contains("display_none")) {
    element.classList.add("display_none");
  }
};

const showElement = (element) => {
  if (element.classList.contains("display_none")) {
    element.classList.remove("display_none");
  }
};

// UI call buttons

const micOnImgSrc = "./utils/images/mic.png";
const micOffImgSrc = "./utils/images/micOff.png";

export const updateMicButton = (enabled) => {
  const micButtonImage = document.getElementById("mic_button_image");
  micButtonImage.src = enabled ? micOnImgSrc : micOffImgSrc;
};

const cameraOnImgSrc = "./utils/images/camera.png";
const cameraOffImgSrc = "./utils/images/cameraOff.png";

export const updateCameraButton = (enabled) => {
  console.log("Updating icon to", enabled);
  const cameraButtonImage = document.getElementById("camera_button_image");
  cameraButtonImage.src = enabled ? cameraOnImgSrc : cameraOffImgSrc;
};
