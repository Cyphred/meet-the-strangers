import * as contsants from "./constants.js";
import * as elements from "./elements.js";

export const updatePersonalCode = (personalCode) => {
  const personalCodeParagraph = document.getElementById(
    "personal_code_paragraph"
  );
  personalCodeParagraph.innerHTML = personalCode;
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
