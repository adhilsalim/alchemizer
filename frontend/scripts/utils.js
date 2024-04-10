const toastContainer = document.getElementById("main-toast-container");
const modalContainer = document.getElementById("main-modal-container");

// ----------------- Show Toast ----------------- //
/**
 * This function displays a toast notification and plays an audio alert based on the type of the notification.
 *
 * It takes an object 'data' as an argument, which should contain the following properties:
 * - type: The type of the notification. It can be "error", "success", or "info".
 * - title: The title of the notification.
 * - message: The message of the notification.
 * - time: The time when the notification was created. If not provided, "just now" is used.
 * - delay: The delay in milliseconds before the toast notification automatically hides. If not provided, 5000 (5 seconds) is used.
 *
 * Based on the 'type', it plays an audio alert. If an error occurs while playing the audio, it logs the error to the console.
 *
 * It then creates a new toast notification with the provided 'title', 'message', 'time', and 'delay'. The color of the text in the toast notification is red if the 'type' is "error", and black otherwise.
 *
 * If there are any toast notifications that are hidden and faded, it removes them from the DOM.
 *
 * Finally, it shows the new toast notification.
 */

const showToast = (data) => {
  try {
    if (data.type === "error") {
      const errorAudio = new Audio("../audio/error.mp3");
      errorAudio.play();
    } else if (data.type === "success") {
      const successAudio = new Audio("../audio/success.mp3");
      successAudio.play();
    } else if (data.type === "info") {
      const infoAudio = new Audio("../audio/info.mp3");
      infoAudio.play();
    }
  } catch (error) {
    console.error("Error playing audio", error);
  }

  const toastHTML = `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" style="color: ${
    data.type === "error" ? "#cf4444" : "black"
  }"><div class="toast-header"><img src="" class="rounded me-2" alt=""><strong class="me-auto">${
    data.title
  }</strong><small class="text-muted">${
    data.time || "just now"
  }</small><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div><div class="toast-body">${
    data.message
  }</div></div>`;

  const toastElement = new DOMParser().parseFromString(toastHTML, "text/html")
    .body.firstChild;
  const toast = new bootstrap.Toast(toastContainer.appendChild(toastElement), {
    delay: data.delay || 5000,
  });

  const elementsToRemove = document.querySelectorAll("div.toast.fade.hide");

  elementsToRemove.forEach((element) => element.remove());

  toast.show();
};

// ----------------- Show Modal ----------------- //
/**
 * This function displays a modal dialog with the provided data.
 *
 * It takes an object 'data' as an argument, which should contain the following properties:
 * - title: The title of the modal.
 * - body: The body content of the modal.
 * - actionFunction: The JavaScript function to be executed when the action button is clicked.
 * - actionButtonText: The text to be displayed on the action button.
 * - autoClose: A boolean indicating whether the modal should automatically close when the action button is clicked.
 *
 * The function first logs a message to the console indicating that it is showing the modal.
 *
 * It then creates the HTML for the modal using the provided data and sets it as the innerHTML of 'modalContainer'.
 *
 * It adds the "show" class to 'modalContainer', sets its display style to "block", and sets its "aria-modal" attribute to "true" to make it visible and accessible.
 *
 * It also creates a backdrop element, adds the appropriate classes to it, and appends it to the body of the document.
 *
 * It then selects all elements with the 'data-bs-dismiss="modal"' attribute (i.e., the close buttons) and adds a click event listener to each of them.
 *
 * When a close button is clicked, it removes the "show" class from 'modalContainer', sets its display style to "none", removes its "aria-modal" attribute, and removes the backdrop from the body of the document.
 * It also removes the click event listener from the clicked button.
 */

const showModal = (data) => {
  console.log("Showing modal:", data);
  const modalHTML = `<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="staticBackdropLabel">${
    data.title
  }</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body">${
      data.body
    }</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" ${
      data.autoClose ? 'data-bs-dismiss="modal" aria-label="Close"' : ""
    } onclick="${data.actionFunction}">${
    data.actionButtonText
  }</button></div></div></div>`;

  modalContainer.innerHTML = modalHTML;
  modalContainer.classList.add("show");
  modalContainer.style.display = "block";
  modalContainer.setAttribute("aria-modal", "true");

  const backdrop = document.createElement("div");
  backdrop.classList.add("modal-backdrop", "fade", "show");
  document.body.appendChild(backdrop);

  var closeButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');

  closeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      modalContainer.classList.remove("show");
      modalContainer.style.display = "none";
      modalContainer.removeAttribute("aria-modal");
      backdrop.remove();
      button.removeEventListener("click", function () {});
    });
  });
};

export { showToast, showModal };
