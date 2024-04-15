// import { showToast } from "./utils.js";

console.clear();

//----------------- Global Variables -----------------//
let file = null;

// ----------------- DOM Elements ----------------- //
const toastContainer = document.getElementById("main-toast-container");
const selectAudioButton = document.getElementById("select-audio");
const selectAudioButtonText = document.getElementById("select-audio-text");
const uploadAudioButton = document.getElementById("upload-audio");
const navbar = document.querySelector(".nav-container");
const heroSection = document.querySelector(".hero-main");
const NavbarLinks = document.querySelectorAll(".nav-link");

// ----------------- Navbar Link Hover Event Listeners ----------------- //

/**
 * This script adds mouse event listeners to each link in the navigation bar.
 *
 * For each link in the navigation bar (NavbarLinks), two event listeners are added:
 *
 * 1. "mouseenter": This event is triggered when the mouse pointer enters the link area.
 *    When this event is triggered, the `mouseHovering` function is called with a string
 *    argument in the format "enter-{navid}", where "{navid}" is the ID of the navigation
 *    link as specified in the link's "data-navid" attribute.
 *
 * 2. "mouseleave": This event is triggered when the mouse pointer leaves the link area.
 *    When this event is triggered, the `mouseHovering` function is called with a string
 *    argument in the format "exit-{navid}", where "{navid}" is the ID of the navigation
 *    link as specified in the link's "data-navid" attribute.
 *
 * The `mouseHovering` function is expected to handle these events appropriately,
 * such as by changing the appearance of the navigation link to indicate that it is
 * being hovered over.
 */
NavbarLinks.forEach((link) => {
  link.addEventListener("mouseenter", () =>
    mouseHovering(`enter-${link.dataset.navid}`)
  );
  link.addEventListener("mouseleave", () =>
    mouseHovering(`exit-${link.dataset.navid}`)
  );
});

// ----------------- Navbar Auto Expand Animation ----------------- //
/**
 * This function controls the appearance of the navigation bar based on the intersection
 * between the target element and its root container (viewport or a specified element).
 *
 * It takes an array of IntersectionObserverEntry objects as an argument. Each entry
 * represents a change in the intersection status of a target element.
 *
 * For each entry:
 *
 * 1. If the target element is intersecting with the root container (i.e., it's visible
 *    within the viewport or the specified element), the function adds the "nav-expand"
 *    class to the navigation bar. This could, for example, expand the navigation bar or
 *    make it fully visible.
 *
 * 2. If the target element is not intersecting with the root container (i.e., it's not
 *    visible within the viewport or the specified element), the function removes the
 *    "nav-expand" class from the navigation bar. This could, for example, collapse the
 *    navigation bar or make it partially visible.
 *
 * This function is typically used as the callback function for an IntersectionObserver,
 * which watches for changes in the intersection between the target element and its root
 * container.
 */
const controlNavbar = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navbar.classList.add("nav-expand");
    } else {
      navbar.classList.remove("nav-expand");
    }
  });
};

// ----------------- Navbar Link Hover Animation ----------------- //
/**
 * This function changes the background color of the navigation bar and the body of the
 * document based on the navigation link being hovered over.
 *
 * It takes a string argument in the format "{action}-{navid}", where "{action}" is
 * either "enter" or "exit" and "{navid}" is the ID of the navigation link.
 *
 * If "{action}" is "enter", this means that the mouse pointer has entered the area of
 * the navigation link. The function changes the background color of the navigation bar
 * and the body of the document to the color specified by the CSS variable
 * "--nav-{navid}-background-color".
 *
 * If "{action}" is "exit", this means that the mouse pointer has left the area of the
 * navigation link. The function changes the background color of the navigation bar to
 * the color specified by the CSS variable "--nav-default-background-color" and the
 * background color of the body of the document to "#f6f3f3".
 *
 * This function is typically used as the callback function for mouse event listeners
 * added to the navigation links.
 */
const mouseHovering = (link) => {
  if (link.split("-")[0] === "enter") {
    navbar.style.background = `var(--nav-${
      link.split("-")[1]
    }-background-color)`;
    document.body.style.background = `var(--nav-${
      link.split("-")[1]
    }-background-color)`;
  } else {
    navbar.style.background = "var(--nav-default-background-color)";
    document.body.style.background = "#f6f3f3";
  }
};
const observer = new IntersectionObserver(controlNavbar);
observer.observe(heroSection);

// ----------------- Audio Selection ----------------- //
/**
 * This event listener is triggered when the 'selectAudioButton' is clicked.
 *
 * Upon clicking, it creates a new 'input' element of type 'file' which accepts .mp3 and .wav files.
 *
 * It then assigns an 'onchange' event to the input element. This event is triggered when the user selects a file.
 * The selected file is stored in the 'file' variable and cached using the 'cacheFile' function.
 *
 * After a file is selected, the text content of 'selectAudioButtonText' is changed to "Selected" and
 * the 'light-green-bgcolor' class is added to 'selectAudioButton' to provide visual feedback to the user.
 *
 * Finally, the 'click' method is called on the input element to programmatically open the file selection dialog.
 */
selectAudioButton.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".mp3, .wav";

  input.onchange = (e) => {
    file = e.target.files[0];
    cacheFile(file);
    selectAudioButtonText.textContent = "Selected";
    selectAudioButton.classList.add("light-green-bgcolor");
  };

  input.click();
});

// ----------------- Audio Upload ----------------- //
/**
 * This event listener is triggered when the 'uploadAudioButton' is clicked.
 *
 * Upon clicking, it checks if a file has been selected for upload. If no file has been selected,
 * it shows a toast notification with an error message.
 *
 * If a file has been selected, it logs a message to the console, changes the text content of
 * 'uploadAudioButton' to "Uploading...", and changes the button's background color to light green.
 *
 * It then creates a new FormData object and appends the selected file to it. This FormData object
 * is used to send the file to the server.
 *
 * A fetch request is made to the server's '/upload' endpoint with the FormData object as the body.
 * The request method is 'POST'.
 *
 * If the file is uploaded successfully, it logs a success message to the console and redirects the
 * user to the '/studio/' page.
 *
 * If an error occurs during the upload, it changes the button's background color to light red,
 * changes the button's text content to "Upload Failed", logs the error to the console, and shows a
 * toast notification with an error message.
 */
uploadAudioButton.addEventListener("click", () => {
  if (file) {
    console.log("Uploading file", file);
    uploadAudioButton.querySelector(".modal-button-text").textContent =
      "Uploading...";
    uploadAudioButton.classList.remove("light-red-bgcolor");
    uploadAudioButton.classList.add("light-green-bgcolor");
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("File uploaded successfully", data);
        window.location.href = `http://localhost:3000/studio/`;
      })
      .catch((error) => {
        uploadAudioButton.classList.remove("light-green-bgcolor");
        uploadAudioButton.classList.add("light-red-bgcolor");
        uploadAudioButton.querySelector(".modal-button-text").textContent =
          "Upload Failed";
        console.error("Error uploading file", error);
        showToast({
          title: "Upload Error 😭",
          type: "error",
          message: "Internal server error. Please try again later.",
          delay: 10000,
        });
      });
  } else {
    showToast({
      title: "Upload Error 😤",
      type: "error",
      message: "No file selected. Please select a file to upload.",
      delay: 10000,
    });
  }
});

// ----------------- Cache File ----------------- //
/**
 * This function caches the name of the selected file in the local storage.
 *
 * It takes a 'file' object as an argument. If a file is provided, it stores the file's name
 * in the local storage under the key 'upload_audio_cache' and logs a message to the console.
 *
 * If no file is provided (i.e., 'file' is null or undefined), it logs an error message to
 * the console and shows a toast notification with the title "Cache Error", the type "error",
 * the message "No file selected.", and a delay of 10 seconds.
 *
 * This function is typically used to cache the name of the file selected by the user for upload.
 * The cached file name can be used to pre-populate the file selection input if the user leaves
 * the page and comes back later.
 */
function cacheFile(file) {
  if (file) {
    localStorage.setItem("upload_audio_cache", file.name);
    console.log("File name cached:", file.name);
  } else {
    console.log("CRASH: No file selected.");
    showToast({
      title: "Cache Error",
      type: "error",
      message: "No file selected.",
      delay: 10000,
    });
  }
}

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
