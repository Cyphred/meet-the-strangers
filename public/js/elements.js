export const getIncomingCallDialog = (
  callTypeInfo,
  acceptCallHandler,
  rejectCallHandler
) => {
  // Dialog wrapper
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");

  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);

  // Dialog title
  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Incoming ${callTypeInfo} Call`;

  // Adds title to dialog
  dialogContent.appendChild(title);

  // Avatar image
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");
  const image = document.createElement("img");
  const avatarImagePath = "./utils/images/dialogAvatar.png";
  image.src = avatarImagePath;
  imageContainer.appendChild(image);

  // Adds avatar image container to dialog
  dialogContent.appendChild(imageContainer);

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("dialog_button_container");

  // Accept Call Button
  const acceptCallButton = document.createElement("button");
  acceptCallButton.classList.add("dialog_accept_call_button");
  const acceptCallImg = document.createElement("img");
  acceptCallImg.classList.add("dialog_button_image");
  const acceptCallImgPath = "./utils/images/acceptCall.png";
  acceptCallImg.src = acceptCallImgPath;
  acceptCallButton.append(acceptCallImg);
  buttonContainer.appendChild(acceptCallButton);

  // Reject Call Button
  const rejectCallButton = document.createElement("button");
  rejectCallButton.classList.add("dialog_reject_call_button");
  const rejectCallImg = document.createElement("img");
  rejectCallImg.classList.add("dialog_button_image");
  const rejectCallImgPath = "./utils/images/rejectCall.png";
  rejectCallImg.src = rejectCallImgPath;
  rejectCallButton.append(rejectCallImg);
  buttonContainer.appendChild(rejectCallButton);

  // Adds button container to dialog
  dialogContent.appendChild(buttonContainer);

  // Add event listeners
  acceptCallButton.addEventListener("click", () => {
    acceptCallHandler();
  });

  rejectCallButton.addEventListener("click", () => {
    rejectCallHandler();
  });

  return dialog;
};

export const getOutgoingCallDialog = (cancelCallHandler) => {
  // Dialog wrapper
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");

  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);

  // Dialog title
  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Requesting Call`;

  // Adds title to dialog
  dialogContent.appendChild(title);

  // Avatar image
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");
  const image = document.createElement("img");
  const avatarImagePath = "./utils/images/dialogAvatar.png";
  image.src = avatarImagePath;
  imageContainer.appendChild(image);

  // Adds avatar image container to dialog
  dialogContent.appendChild(imageContainer);

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("dialog_button_container");

  // Cancel Call Button
  const rejectCallButton = document.createElement("button");
  rejectCallButton.classList.add("dialog_reject_call_button");
  const rejectCallImg = document.createElement("img");
  rejectCallImg.classList.add("dialog_button_image");
  const rejectCallImgPath = "./utils/images/rejectCall.png";
  rejectCallImg.src = rejectCallImgPath;
  rejectCallButton.append(rejectCallImg);
  buttonContainer.appendChild(rejectCallButton);

  // Adds button container to dialog
  dialogContent.appendChild(buttonContainer);

  return dialog;
};

export const getInfoDialog = (title, description) => {
  // Dialog wrapper
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");

  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);

  // Dialog title
  const dialogTitle = document.createElement("p");
  dialogTitle.classList.add("dialog_title");
  dialogTitle.innerHTML = title;

  // Adds title to dialog
  dialogContent.appendChild(dialogTitle);

  // Avatar image
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");
  const image = document.createElement("img");
  const avatarImagePath = "./utils/images/dialogAvatar.png";
  image.src = avatarImagePath;
  imageContainer.appendChild(image);

  // Adds avatar image container to dialog
  dialogContent.appendChild(imageContainer);

  // Adds description to dialog
  const dialogDescription = document.createElement("p");
  dialogDescription.classList.add("dialog_description");
  dialogDescription.innerHTML = description;

  // Adds description to dialog
  dialogContent.appendChild(dialogDescription);

  return dialog;
};
