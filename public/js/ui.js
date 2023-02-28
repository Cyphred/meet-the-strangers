import * as contsants from "./constants.js";
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

export const showIncomingCallDialog = (
  callType,
  acceptCallHandler,
  rejectCallHandler
) => {
  const callTypeInfo =
    callType === contsants.callType.CHAT_PERSONAL_CODE ? "Chat" : "Video";

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
    case contsants.preOfferAnswer.CALL_REJECTED:
      infoDialog = elements.getInfoDialog(
        "Call rejected",
        "User has rejected your call."
      );
      break;
    case contsants.preOfferAnswer.RECEIVER_NOT_FOUND:
      infoDialog = elements.getInfoDialog(
        "User not found",
        "You have entered an invalid code."
      );
      break;
    case contsants.preOfferAnswer.CALL_UNAVAILABLE:
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
    case contsants.callType.CHAT_PERSONAL_CODE:
      showChatCallElements();
      break;
    case contsants.callType.VIDEO_PERSONAL_CODE:
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
