// import { showToast, showModal } from "./utils.js";
/*

SORRY for the code quality! Gotta do a lot of refactoring and clean up.

*/
// ----------------- Clear Console ----------------- //
console.clear();

// ----------------- Global Variables -----------------//
const DDSP_CHECKPOINTS = {
  violin:
    "https://storage.googleapis.com/magentadata/js/checkpoints/ddsp/violin",
  flute: "https://storage.googleapis.com/magentadata/js/checkpoints/ddsp/flute",
};

const AUDIO_EXAMPLE = {
  example_audio_1: {
    fileName: "naan_yen.mp3",
    title: "Naan Yen",
    singers: "A.R. Rahman, Rayhanah",
    description: "Coke Studio India Season 3: Episode 1.",
    duration: "0:55",
  },
  example_audio_2: {
    fileName: "tujo_mila_raabta.mp3",
    title: "Tu Jo Mila Raabta",
    singers: "Shirley Setia, Jubin Nautiyal",
    description: "T-Series Mixtape Season 2.",
    duration: "0:46",
  },
};

const STEM_DICT = {
  "2stems": ["vocals", "accompaniment"],
  "4stems": ["vocals", "drums", "bass", "other"],
  "5stems": ["vocals", "drums", "bass", "piano", "other"],
};

let selectedStems = "2stems";
let selectedInstrument = "violin";
let selectedConversionMode = "WebGL";
let audioConversionData = null;
// let isLoggedIn = true;
let WARNINGS = {
  audioSeparationFileExists: false,
  audioSeparationInProgress: false,
  audioConversionFileExists: false,
  audioConversionInProgress: false,
};
const SERVER_IP = "http://localhost:5000";

//----------------- DOM Elements -----------------//
const navbar = document.querySelector(".nav-container");
const NavbarLinks = document.querySelectorAll(".nav-link");
const heroSection = document.querySelector(".hero-section");
const toastContainer = document.getElementById("main-toast-container");
const modalContainer = document.getElementById("main-modal-container");
const welcomeTitle = document.querySelector("#welcome-title");
const welcomeSubtitle = document.querySelector("#welcome-subtitle");
const separateAudioButton = document.getElementById("separate-audio");
const convertAudioButton = document.getElementById("convert-audio");
const MainAudioPlayerContainer = document.querySelector(
  "#main-audio-player-container"
);
const mainAudioTitle = document.querySelector("#audio_main_title");
const audioSeparationLoader = document.getElementById(
  "audio-separation-loader"
);
const audioSeparationContainer = document.getElementById(
  "audio-separation-container"
);
const audioConversionLoader = document.getElementById(
  "audio-conversion-loader"
);
const audioConversionContainer = document.getElementById(
  "audio-conversion-container"
);
const songSearchButton = document.getElementById("song-search-button");
const songSearchInput = document.getElementById("song-search-input");
const songSearchContainer = document.getElementById("song-search-container");
const songSearchQueryText = document.getElementById("song-search-query-text");
const youtubePlayerCloseButton = document.getElementById("iframe-close-button");
const youtubeVideoContainer = document.getElementsByClassName(
  "youtube-mini-player-container"
)[0];


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

// ----------------- YouTube Mini Player ----------------- //
youtubeVideoContainer.style.display = "none";

// ----------------- Welcome Message ----------------- //

welcomeTitle.textContent = `Hello, ${getUserName("first")}`;
welcomeSubtitle.textContent = `Welcome back to your studio`;

// ----------------- Load Selected Audio ----------------- //

loadSelectedAudio(localStorage.getItem("upload_audio_cache"));

// ----------------- Load Audio Example Attributes ----------------- //

document.querySelector("#audio_example_container_1 .card-title").textContent =
  AUDIO_EXAMPLE.example_audio_1.title;
document.querySelector("#audio_example_container_1 .card-text").textContent =
  AUDIO_EXAMPLE.example_audio_1.duration;
document
  .querySelector("#audio_example_container_1 .card-text")
  .setAttribute("title", AUDIO_EXAMPLE.example_audio_1.singers);

document.querySelector("#audio_example_container_2 .card-title").textContent =
  AUDIO_EXAMPLE.example_audio_2.title;
document.querySelector("#audio_example_container_2 .card-text").textContent =
  AUDIO_EXAMPLE.example_audio_2.duration;
document
  .querySelector("#audio_example_container_2 .card-text")
  .setAttribute("title", AUDIO_EXAMPLE.example_audio_2.singers);

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

function showToast(data) {
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
}

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

function showModal(data) {
  console.log("Showing modal:", data);
  const modalHTML = `<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="staticBackdropLabel">${
    data.title
  }</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body">${
      data.body
    }</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" ${
      data.autoClose ? 'data-bs-dismiss="modal" aria-label="Close"' : ""
    } onclick='${data.actionFunction}'>${
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
}

// ----------------- separateAudioButton Event Listener ----------------- //
/**
 * This event listener is triggered when the 'separateAudioButton' is clicked.
 *
 * Upon clicking, it first checks if the user is logged in. If the user is not logged in,
 * it redirects the user to the authentication page and returns.
 *
 * If the user is logged in, it creates a dropdown menu with options for selecting the number
 * of stems. Stems are groups of audio sources that are mixed together to create a cohesive
 * musical piece. The options are "2 stems", "4 stems", and "5 stems".
 *
 * It then displays a modal dialog with the title "Select Stems", the dropdown menu as the body,
 * the JavaScript function 'getStems()' as the action function to be executed when the action
 * button is clicked, the text "Continue" on the action button, and the modal set to automatically
 * close when the action button is clicked.
 *
 * This event listener is typically used to allow the user to select the number of stems before
 * separating the audio.
 */

separateAudioButton.addEventListener("click", () => {
  console.log("Separate Audio Clicked");
  console.log('The user is not logged in ', localStorage.getItem("isLoggedIn") == "logout");

  // return;

  if ((localStorage.getItem("isLoggedIn") == "logout")){
    window.location.href = "http://localhost:3000/auth";
    return;
  }

  if (WARNINGS.audioSeparationInProgress) {
    let modalHTML = `<div><p>Audio separation is in progress. Please wait until the current process is complete.</p></div>`;
    showModal({
      title: "Audio Separation In Progress ⚠️",
      body: modalHTML,
      actionFunction: "console.log('Audio separation in progress')",
      autoClose: true,
      actionButtonText: "Okay",
    });
  } else if (WARNINGS.audioSeparationFileExists) {
    let modalHTML = `<div><p>You have existing stems. This action will overwrite them. Save your stems before proceeding.</p></div>`;
    showModal({
      title: "Separate Audio",
      body: modalHTML,
      actionFunction: "setWarning(`audioSeparationFileExists`, false)",
      autoClose: true,
      actionButtonText: "Saved",
    });
  } else {
    let modalHTml = `<div class="dropdown">
  <p>stems are groups of audio sources that are mixed together to create a cohesive musical piece.</p>
  <ul>
  <li>2-stems: vocals + accompaniment</li>
  <li>4-stems: vocals + drum + bass + other</li>
  <li>5-stems: vocals + drums + bass + piano + other</li>
  </ul>
  <br>
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="stem-dropdown-btn">
    Select Stems: ${selectedStems}</button>
  <ul class="dropdown-menu" id="stem-dropdown-menu">
    <li class="dropdown-item" onclick="selectStem('2stems')">2 stems</li>
    <li class="dropdown-item" onclick="selectStem('4stems')">4 stems</li>
    <li class="dropdown-item" onclick="selectStem('5stems')">5 stems</li>
  </ul>
</div>`;
    showModal({
      title: "Select Stems",
      body: modalHTml,
      actionFunction: "getStems()",
      autoClose: true,
      actionButtonText: "Separate",
    });
  }
});

// ----------------- Select Stems ----------------- //
/**
 * This function is used to select the number of stems and update the dropdown button text accordingly.
 *
 * It takes an integer 'stems' as an argument, which represents the number of stems selected by the user.
 *
 * The function first assigns the 'stems' argument to the global variable 'selectedStems' and logs a message
 * to the console with the selected number of stems.
 *
 * It then selects the dropdown button with the ID 'stem-dropdown-btn' and updates its text content to
 * "Select Stems: {selectedStems}", where "{selectedStems}" is the number of stems selected by the user.
 *
 * This function is typically used as the callback function for the 'change' event of the stem selection dropdown.
 */

function selectStem(stems) {
  selectedStems = stems;
  console.log("Select Stems:", selectedStems);

  document.getElementById(
    "stem-dropdown-btn"
  ).textContent = `Select Stems: ${selectedStems}`;
}

// ----------------- Get Stems ----------------- //
/**
 * This function separates the uploaded audio into different stems and displays them in the audio separation section.
 *
 * It first displays the audio separation loader and shows a toast notification with the title "Separating Audio 🎶",
 * the type "info", the message "This may take a few minutes<br>Wait until we bake your music!", and a delay of 10 seconds.
 *
 * It then makes a fetch request to the server's '/separate-audio' endpoint with the filename and the number of stems as query parameters.
 * The filename is retrieved from the local storage under the key 'upload_audio_cache', and the number of stems is the global variable 'selectedStems'.
 *
 * If the fetch request is successful, it hides the audio separation loader and clears the innerHTML of 'audioSeparationContainer'.
 *
 * It then logs a message to the console with the stems to get and makes a fetch request for each stem to the server's '/load-audio' endpoint with the filename,
 * the filetype "stem", and the stem name as query parameters.
 *
 * If the fetch request for a stem is successful, it creates a blob from the response, creates a URL representing the blob, and creates the HTML for the audio player
 * with the blob URL as the source. It then parses the HTML string into a DOM node and appends it to 'audioSeparationContainer'.
 *
 * After all stems have been fetched, it logs a success message to the console and shows a toast notification with the title "Audio Separated 🎉", the type "success",
 * the message "Audio separated successfully. You can find them in the audio separation section.", and a delay of 10 seconds.
 *
 * If an error occurs during the fetch request to '/separate-audio' or during the fetch request for a stem, it logs the error to the console and shows a toast notification
 * with the title "Error Separating Audio 💔", the type "error", the message "Error separating audio", and a delay of 5 seconds.
 */

function getStems() {
  audioSeparationLoader.style.display = "block";
  showToast({
    title: "Separating Audio 🎶",
    type: "info",
    message: "This may take a few minutes<br>Wait until we bake your music!",
    delay: 10000,
  });

  WARNINGS.audioSeparationInProgress = true;

  fetch(
    `${SERVER_IP}/separate-audio?filename=${localStorage.getItem(
      "upload_audio_cache"
    )}&stems=${selectedStems}`
  )
    .then((response) => response.json())
    .then((data) => {
      WARNINGS.audioSeparationFileExists = true;
      WARNINGS.audioSeparationInProgress = false;
      audioSeparationLoader.style.display = "none";
      audioSeparationContainer.innerHTML = "";

      console.log("getting stems:", STEM_DICT[selectedStems]);
      STEM_DICT[selectedStems].forEach((stem) => {
        (async () => {
          const tempFileName = localStorage.getItem("upload_audio_cache");
          const response = await fetch(
            `${SERVER_IP}/load-audio?filename=${localStorage
              .getItem("upload_audio_cache")
              .replace(".mp3", "")
              .replace(".wav", "")}&filetype=${"stem"}&stemname=${stem}`
          );
          if (response.ok) {
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            const functionCall = `globalAudioConversionManager({ type: "stem", filename: "${
              tempFileName.replace(".mp3", "").replace(".wav", "").toString() +
              "/" +
              stem.toString()
            }"})`;
            const audioPLayerHTML = `<div class="col-12 mt-2 mb-2"><div class="stem-audio-container">
            <div class="stem-audio-title"> <p>${stem}</p> </div> <div class="stem-audio-player">
            <wave-audio-path-player src="${audioUrl}" wave-width="360" wave-height="80" color="#55007f" wave-options='{"animation":true,"samples":100, "type": "wave"}' title="">
            </wave-audio-path-player> </div> 
            <div class="stem-audio-controls" style="display: flex; flex-direction: row; justify-content: end;"> 
            <a href="${audioUrl}" download="${stem}.mp3"><div class="card-control-icon"> <span class="material-symbols-outlined">download</span></div></a>
            <div class="card-control-icon"><span class="material-symbols-outlined" onclick='${functionCall}'>arrow_split</span></div></div></div></div>`;

            const htmlElement = new DOMParser().parseFromString(
              audioPLayerHTML,
              "text/html"
            ).body.firstChild;
            audioSeparationContainer.appendChild(htmlElement);
          }
        })();
      });

      console.log("Audio separation successful:", data.message);
      showToast({
        title: "Audio Separated 🎉",
        type: "success",
        message:
          "Audio separated successfully. You can find them in the audio separation section.",
        delay: 10000,
      });
    })
    .catch((error) => {
      console.error("Error separating audio:", error);
      showToast({
        title: "Error Separating Audio 💔",
        type: "error",
        message: "Error separating audio",
        delay: 5000,
      });
    });
}

// ----------------- Get Selected Audio ----------------- //
/**
 * This asynchronous function loads the selected audio file from the server and displays it in the main audio player.
 *
 * It takes a string 'fileName' as an argument, which represents the name of the audio file to load.
 *
 * If 'fileName' is provided, it first shows a toast notification with the title "Loading Audio", the type "info",
 * the message "Loading {fileName}", and a delay of 3 seconds.
 *
 * It then makes a fetch request to the server's '/load-audio' endpoint with 'fileName' as a query parameter.
 *
 * If the fetch request is successful, it logs the headers of the response to the console, creates a blob from the response,
 * creates a URL representing the blob, and sets the innerHTML of 'MainAudioPlayerContainer' to the HTML for the audio player
 * with the blob URL as the source.
 *
 * It then logs a message to the console with the blob URL and sets the title of the main audio to the title of the audio file
 * retrieved from the server. If the title is "Unknown", it sets the title to the name of the file without the extension.
 *
 * Finally, it shows a toast notification with the title "Audio Loaded 🎉", the type "info", the message "Selected audio loaded successfully.",
 * and a delay of 3 seconds.
 *
 * If the fetch request is not successful or an error occurs during the fetch request, it shows a toast notification with the title "Error Loading Audio 😓",
 * the type "error", the message "Internal server error. Please try again later.", and a delay of 5 seconds, and throws an error.
 *
 * If 'fileName' is not provided, it shows a toast notification with the title "No Audio Found 🔎", the type "error", the message "No audio found",
 * and a delay of 5 seconds, and logs a message to the console.
 */

async function loadSelectedAudio(fileName) {
  if (fileName) {
    try {
      const response = await fetch(
        `${SERVER_IP}/load-audio?filename=${fileName}`
      );
      if (response.ok) {
        console.log("headers:", ...response.headers);
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        MainAudioPlayerContainer.innerHTML = `<wave-audio-path-player src="${audioUrl}" wave-width="400" wave-height="80" color="#55007f" wave-options='{"animation":true,"samples":100, "type": "wave"}' id="main-audio-player" title=""></wave-audio-path-player>`;
        console.log("Audio loaded:", audioUrl);
        // set main audio title
        (async () => {
          let title = await getAudioTitle(fileName);
          if (title === "Unknown") {
            title = fileName.split(".")[0];
          }
          mainAudioTitle.innerHTML = title;
        })();
        showToast({
          title: "Audio Loaded 🎉",
          type: "info",
          message: "Selected audio loaded successfully.",
          delay: 3000,
        });
      } else {
        showToast({
          title: "Error Loading Audio 😓",
          type: "error",
          message: "Internal server error. Please try again later.",
          delay: 5000,
        });
        throw new Error("Error loading audio");
      }
    } catch (error) {
      showToast({
        title: "Error Loading Audio 😓",
        type: "error",
        message: "Internal server error. Please try again later.",
        delay: 5000,
      });
      console.error("Error loading audio:", error);
    }
  } else {
    showToast({
      title: "No Audio Found 🔎",
      type: "error",
      message: "No audio found",
      delay: 5000,
    });
    console.log("No audio found");
  }
}

// ----------------- Get Audio Title ----------------- //
/**
 * This asynchronous function fetches the title of the specified audio file from the server.
 *
 * It takes a string 'fileName' as an argument, which represents the name of the audio file.
 *
 * If 'fileName' is provided, it makes a fetch request to the server's '/get-audio-title' endpoint with 'fileName' as a query parameter.
 *
 * If the fetch request is successful, it logs the JSON data from the response to the console, logs the title of the audio to the console,
 * and returns the title.
 *
 * If the fetch request is not successful or an error occurs during the fetch request, it shows a toast notification with the title "Error Fetching Audio Title 😓",
 * the type "error", the message "Internal server error. Please try again later.", and a delay of 5 seconds, logs the error to the console, and returns null.
 *
 * This function is typically used to fetch the title of the audio file after it has been uploaded to the server.
 */

async function getAudioTitle(fileName) {
  try {
    const response = await fetch(
      `${SERVER_IP}/get-audio-title?filename=${fileName}`
    );
    const data = await response.json();
    console.log(data);
    console.log("Audio Title:", data.title);
    return data.title;
  } catch (error) {
    showToast({
      title: "Error Fetching Audio Title 😓",
      type: "error",
      message: "Internal server error. Please try again later.",
      delay: 5000,
    });
    console.error("Error fetching audio title:", error);
    return null;
  }
}
// ----------------- Data URI to Blob ----------------- //
/**
 * This function converts a data URI to a Blob object.
 *
 * It takes a string 'dataURI' as an argument, which represents the data URI to convert.
 *
 * The function first splits the 'dataURI' by the comma (',') to separate the base64 encoded data from the MIME type.
 * It then decodes the base64 data into a binary string using the 'atob()' function.
 *
 * It also splits the MIME type part of the 'dataURI' by the colon (':') and the semicolon (';') to get the actual MIME type.
 *
 * It then creates an ArrayBuffer of the same length as the binary string and a new Uint8Array view for the buffer.
 *
 * It iterates over the binary string and sets each byte in the Uint8Array to the char code of the corresponding character in the binary string.
 *
 * Finally, it creates a new Blob object from the ArrayBuffer and the MIME type and returns it.
 *
 * This function is typically used to convert a data URI (e.g., a base64 encoded image) to a Blob object for further processing or storage.
 */

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

// ----------------- Get User Name ----------------- //
/**
 * This function retrieves the user's name from local storage and returns it in the specified format.
 *
 * It takes a string 'method' as an argument, which specifies the format of the name to return.
 * The possible values are "first" for the first name, "middle" for the middle name, "last" for the last name,
 * and "full" for the full name. If 'method' is not provided or does not match any of these values, the function
 * returns the full name.
 *
 * The function first retrieves the user's full name from local storage under the key 'user_full_name'.
 * If the name is not found (i.e., it is null), the function returns the string "User".
 *
 * If the name is found, the function splits it into words by the space character and returns the word
 * corresponding to the specified 'method'. If 'method' is "first", it returns the first word. If 'method'
 * is "middle", it returns the second word. If 'method' is "last", it returns the third word. If 'method'
 * is "full" or does not match any of the specified values, it returns the full name.
 *
 * This function is typically used to display the user's name in the user interface.
 */

function getUserName(method) {
  let userName = localStorage.getItem("user_full_name");

  if (userName === null) {
    return "User";
  }

  if (method === "first") {
    return userName.split(" ")[0];
  } else if (method === "middle") {
    return userName.split(" ")[1];
  } else if (method === "last") {
    return userName.split(" ")[2];
  } else if (method === "full") {
    return userName;
  }
  return userName;
}

// ----------------- Load Audio Template ----------------- //
/**
 * This function loads an audio template into the audio player.
 *
 * It takes a string 'template' as an argument, which represents the key of the audio template to load.
 *
 * The function first logs the audio template object to the console for debugging purposes.
 *
 * It then calls the 'loadSelectedAudio()' function with the filename of the audio template as an argument.
 * The 'loadSelectedAudio()' function is responsible for fetching the audio file from the server and displaying
 * it in the audio player.
 *
 * Finally, the function stores the filename of the audio template in local storage under the key 'upload_audio_cache'.
 * This allows the filename to be retrieved later without having to fetch it from the server again.
 *
 * This function is typically used to load a predefined audio template when the user selects it from a list of available templates.
 */

function loadAudioTemplate(template) {
  console.log(AUDIO_EXAMPLE[template]);
  loadSelectedAudio(AUDIO_EXAMPLE[template].fileName);
  localStorage.setItem("upload_audio_cache", AUDIO_EXAMPLE[template].fileName);
}

// ----------------- Set User Name ----------------- //
/**
 * This function stores the user's name in local storage.
 *
 * It takes a string 'username' as an argument, which represents the user's full name.
 *
 * The function simply calls the 'setItem()' method of the 'localStorage' object with the key 'user_full_name'
 * and the 'username' argument. This stores the 'username' in local storage under the key 'user_full_name'.
 *
 * The stored name can be retrieved later using the 'getItem()' method of the 'localStorage' object with the
 * key 'user_full_name'.
 *
 * This function is typically used to store the user's name after they have logged in or updated their name.
 */

function setUserName(username) {
  localStorage.setItem("user_full_name", username);
}

// ----------------- Convert Audio Button Event Listener ----------------- //
convertAudioButton.addEventListener("click", () => {
  console.log("Convert Audio Clicked");
  if ((localStorage.getItem("isLoggedIn") == "logout")){
    window.location.href = "http://localhost:3000/auth";
    return;
  }
  globalAudioConversionManager({
    type: "main",
    filename: localStorage.getItem("upload_audio_cache"),
  });
});

// ----------------- Set Conversion Mode ----------------- //
function selectConversionMode(mode) {
  selectedConversionMode = mode;
  console.log("Select Conversion Mode:", selectedConversionMode);

  document.getElementById(
    "conversion-mode-dropdown-btn"
  ).textContent = `Selected : ${selectedConversionMode}`;
}

// ----------------- Set Warning ----------------- //
/**
 * This function sets a warning in the WARNINGS object.
 *
 * It takes two arguments: a string 'warning', which represents the key of the warning, and a boolean 'value',
 * which represents the value of the warning.
 *
 * The function simply assigns the 'value' to the 'warning' key in the WARNINGS object. If the 'warning' key
 * does not exist in the WARNINGS object, it is created.
 *
 * This function is typically used to set the state of various warnings in the application. The WARNINGS object
 * can then be checked at various points in the application to determine whether to display certain warnings to the user.
 */

function setWarning(warning, value) {
  WARNINGS[warning] = value;
}

// ----------------- Convert Audio ----------------- //
function convertAudio() {
  console.log("audioConversionData", audioConversionData);
  if (audioConversionData === null) {
    showToast({
      title: "Audio Data Not Found",
      type: "error",
      message: "Please select an audio to convert",
      delay: 5000,
    });
    return;
  }

  if (selectedConversionMode === "WebGL") {
    console.log("WebGL conversion");

    let modalHTML = `<div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="instrument-dropdown-btn">
      Selected : ${selectedInstrument}</button>
    <ul class="dropdown-menu" id="instrument-dropdown-menu">
      <li class="dropdown-item" onclick="selectInstrument('violin')">Violin</li>
      <li class="dropdown-item" onclick="selectInstrument('flute')">Flute</li>
    </ul>
  </div>`;

    setTimeout(() => {
      showModal({
        title: "Select Instrument",
        body: modalHTML,
        actionFunction: "convertAudioToInstrument()",
        autoClose: true,
        actionButtonText: "Start Conversion",
      });
    }, 500);

    showToast({
      title: "Select an instrument",
      type: "info",
      message:
        "Please select an instrument to which you want to convert your audio",
      delay: 10000,
    });
  } else if (selectedConversionMode === "Google Host") {
    console.log("Google Host conversion");

    convertAudioToInstrument();
  } else {
    console.log("Invalid conversion mode");
    showToast({
      title: "Invalid Conversion Mode",
      type: "error",
      message: "Please select a valid conversion mode",
      delay: 5000,
    });
  }
}

// ----------------- Convert Audio To Instrument ----------------- //
async function convertAudioToInstrument() {
  if (selectedConversionMode === "WebGL") {
    if (audioConversionData.type === "main") {
      const response = await fetch(
        `${SERVER_IP}/load-audio?filename=${localStorage.getItem(
          "upload_audio_cache"
        )}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const audioBuffer = await loadAudioFromBlob(blob);
        const checkpoint_url = DDSP_CHECKPOINTS[selectedInstrument];
        console.log("checkpoint_url", checkpoint_url);

        audioConversionLoader.style.display = "block";

        showToast({
          title: "Performing tone transfer",
          type: "info",
          message: "Converting audio to " + selectedInstrument,
          delay: 10000,
        });

        const transferredAudioBuffer = await performToneTransfer(
          audioBuffer,
          checkpoint_url
        );
        const wavBlob = audioBufferToWavBlob(transferredAudioBuffer);
        const audioUrl = URL.createObjectURL(wavBlob);
        audioConversionLoader.style.display = "none";

        const audioPLayerHTML = `<div class="col-12 mt-2 mb-2"><div class="stem-audio-container">
        <div class="stem-audio-title"> <p>${selectedInstrument}</p> </div> <div class="stem-audio-player">
        <wave-audio-path-player src="${audioUrl}" wave-width="360" wave-height="80" color="#55007f" wave-options='{"animation":true,"samples":100, "type": "wave"}' title="">
        </wave-audio-path-player> </div> 
        <div class="stem-audio-controls" style="display: flex; flex-direction: row; justify-content: end;"> 
        <a href="${audioUrl}" download="${selectedInstrument}.mp3"><div class="card-control-icon"> <span class="material-symbols-outlined">download</span></div></a>
        </div></div></div>`;

        const htmlElement = new DOMParser().parseFromString(
          audioPLayerHTML,
          "text/html"
        ).body.firstChild;
        audioConversionContainer.innerHTML = "";
        audioConversionContainer.appendChild(htmlElement);

        showToast({
          title: "Audio Converted 🎉",
          type: "success",
          message: "Audio converted successfully",
          delay: 10000,
        });
      }
    } else if (audioConversionData.type === "stem") {
      (async () => {
        const blob = await getAudioFromFlask({
          type: "stem",
          stem: {
            directory: 'default',
            getOnly: audioConversionData.filename.split("/")[1],
          },
          onlyBlob: true,
        });
      
        console.log("blob", blob);

        const audioBuffer = await loadAudioFromBlob(blob);
        const checkpoint_url = DDSP_CHECKPOINTS[selectedInstrument];
        console.log("checkpoint_url", checkpoint_url);

        audioConversionLoader.style.display = "block";

        showToast({
          title: "Performing tone transfer",
          type: "info",
          message: "Converting audio to " + selectedInstrument,
          delay: 10000,
        });

        const transferredAudioBuffer = await performToneTransfer(
          audioBuffer,
          checkpoint_url
        );
        const wavBlob = audioBufferToWavBlob(transferredAudioBuffer);
        const audioUrl = URL.createObjectURL(wavBlob);
        audioConversionLoader.style.display = "none";

        const audioPLayerHTML = `<div class="col-12 mt-2 mb-2"><div class="stem-audio-container">
        <div class="stem-audio-title"> <p>${selectedInstrument}</p> </div> <div class="stem-audio-player">
        <wave-audio-path-player src="${audioUrl}" wave-width="360" wave-height="80" color="#55007f" wave-options='{"animation":true,"samples":100, "type": "wave"}' title="">
        </wave-audio-path-player> </div> 
        <div class="stem-audio-controls" style="display: flex; flex-direction: row; justify-content: end;"> 
        <a href="${audioUrl}" download="${selectedInstrument}.mp3"><div class="card-control-icon"> <span class="material-symbols-outlined">download</span></div></a>
        </div></div></div>`;

        const htmlElement = new DOMParser().parseFromString(
          audioPLayerHTML,
          "text/html"
        ).body.firstChild;
        audioConversionContainer.innerHTML = "";
        audioConversionContainer.appendChild(htmlElement);

        showToast({
          title: "Audio Converted 🎉",
          type: "success",
          message: "Audio converted successfully",
          delay: 10000,
        });
      })();
    } else {
      showToast({
        title: "Invalid Audio Type",
        type: "error",
        message: "Please select a valid audio to convert",
        delay: 5000,
      });
      return;
    }
  } else if (selectedConversionMode === "Google Host") {
    showToast({
      title: "Converting your audio",
      type: "info",
      message: "This may take a few minutes. Wait until we convert your music!",
      delay: 10000,
    });

    if (audioConversionData.type === "main") {
      const response = await fetch(
        `${SERVER_IP}/convert-audio?filename=${localStorage.getItem(
          "upload_audio_cache"
        )}&filetype=main`
      );

      if (response.ok) {
        console.log("Audio converted successfully");
        if (
          getAudioFromFlask({
            type: "convert",
            convert: {
              directory: audioConversionData.filename
                .replace(".mp3", "")
                .replace(".wav", ""),
            },
            onlyHTML: true,
            HTMLcontainer: audioConversionContainer,
          })
        ) {
          showToast({
            title: "Audio Converted 🎉",
            type: "success",
            message:
              "Audio converted successfully. You can find the converted audio in the audio conversion section.",
            delay: 10000,
          });
        }
      } else {
        showToast({
          title: "Something went wrong",
          type: "error",
          message: "We faced an unintended error. Please try again later",
          delay: 5000,
        });
        return;
      }
    } else if (audioConversionData.type === "stem") {
      const response = await fetch(
        `${SERVER_IP}/convert-audio?filename=${audioConversionData.filename}&filetype=stem`
      );

      if (response.ok) {
        console.log("Audio converted successfully");
        if (
          getAudioFromFlask({
            type: "convert",
            convert: {
              directory: audioConversionData.filename
                .replace(".mp3", "")
                .replace(".wav", ""),
            },
            onlyHTML: true,
            HTMLcontainer: audioConversionContainer,
          })
        ) {
          showToast({
            title: "Audio Converted 🎉",
            type: "success",
            message:
              "Audio converted successfully. You can find the converted audio in the audio conversion section.",
            delay: 10000,
          });
        }
      } else {
        showToast({
          title: "Something went wrong",
          type: "error",
          message:
            "We were not able to connect to google host. Please try again later",
          delay: 5000,
        });
        return;
      }
    } else {
      showToast({
        title: "Invalid Conversion Mode",
        type: "error",
        message: "Please select a valid conversion mode",
        delay: 5000,
      });
      return;
    }
  }
}
// Function to fetch and decode an audio Blob
async function loadAudioFromBlob(blob) {
  const context = new AudioContext();
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await context.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

// Function to convert AudioBuffer to WAV Blob
function audioBufferToWavBlob(audioBuffer) {
  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
  }

  let channels = 1,
    sampleRate = audioBuffer.sampleRate;
  let frameCount = audioBuffer.length;
  let buffer = new ArrayBuffer(44 + frameCount * 2);
  let view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + frameCount * 2, true);
  writeString(view, 8, "WAVE");
  // FMT sub-chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  // data sub-chunk
  writeString(view, 36, "data");
  view.setUint32(40, frameCount * 2, true);
  floatTo16BitPCM(view, 44, audioBuffer.getChannelData(0));

  return new Blob([buffer], { type: "audio/wav" });
}

// Function to perform tone transfer (unchanged)
async function performToneTransfer(audioBuffer, checkpointUrl) {
  let synthesizedAudioBuffer = null;

  try {
    const spice = new mm.SPICE();
    await spice.initialize();

    const audioFeatures = await spice.getAudioFeatures(audioBuffer);
    const ddsp = new mm.DDSP(checkpointUrl);
    await ddsp.initialize();
    const synthesizedBuffer = await ddsp.synthesize(audioFeatures);

    const context = new AudioContext();
    const arrayBufferToAudioBuffer = (audioCtx, arrayBuffer, sampleRate) => {
      const newBuffer = audioCtx.createBuffer(
        1,
        arrayBuffer.length,
        sampleRate
      );
      newBuffer.copyToChannel(arrayBuffer, 0);
      return newBuffer;
    };
    synthesizedAudioBuffer = arrayBufferToAudioBuffer(
      context,
      synthesizedBuffer,
      48000
    );
  } catch (error) {
    console.error("Error performing tone transfer:", error);
    showToast({
      title: "Error Performing Tone Transfer",
      type: "error",
      message:
        "This could be due to insufficient GPU memory. Avoid running other GPU-intensive tasks simultaneously.",
      delay: 5000,
    });
    return null;
  }

  return synthesizedAudioBuffer;
}

// ----------------- Select Instrument ----------------- //
function selectInstrument(instrument) {
  selectedInstrument = instrument;
  console.log("Select Instrument:", selectedInstrument);

  document.getElementById(
    "instrument-dropdown-btn"
  ).textContent = `Selected : ${selectedInstrument}`;
}

// ----------------- Global Audio Conversion Manager ----------------- //
function globalAudioConversionManager(data) {
  console.log("Global Audio Conversion Manager", data);

  audioConversionData = data;

  if (WARNINGS.audioConversionInProgress) {
    let modalHTML = `<div><p>Audio conversion is in progress. Please wait until the current process is complete.</p></div>`;
    showModal({
      title: "Audio Conversion In Progress ⚠️",
      body: modalHTML,
      actionFunction: "console.log('Audio conversion in progress')",
      autoClose: true,
      actionButtonText: "Okay",
    });
  } else if (WARNINGS.audioConversionFileExists) {
    let modalHTML = `<div><p>You have existing converted audio files. This action will overwrite them. Save your audio files before proceeding.</p></div>`;
    showModal({
      title: "Convert Audio",
      body: modalHTML,
      actionFunction: "setWarning('audioConversionFileExists', false)",
      autoClose: true,
      actionButtonText: "Saved",
    });
  } else {
    let modalHTml = `<div class="dropdown">
  <p>Convert your audio to an instrument,<br><br>If you select WebGL, you have to specify the instrument to be converted, also it requires a GPU.<br><br>If you select Google Host, you don't need to specify the instrument, but it can take longer to convert.</p>
  <ul>
  <li>WebGL (experimental) </li>
  <li>Google Host (recommended)</li>
  </ul>
  <br>
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="conversion-mode-dropdown-btn">
    Selected : ${selectedConversionMode}</button>
  <ul class="dropdown-menu" id="conversion-mode-dropdown-menu">
    <li class="dropdown-item" onclick="selectConversionMode('WebGL')">WebGL</li>
    <li class="dropdown-item" onclick="selectConversionMode('Google Host')">Google Host</li>
  </ul>
</div>`;

    showModal({
      title: "Select Conversion Mode",
      body: modalHTml,
      actionFunction: "convertAudio()",
      autoClose: true,
      actionButtonText: "Convert",
    });
  }
}

// ----------------- Song Search Button Event Listener ----------------- //
songSearchButton.addEventListener("click", () => {
  if (songSearchInput.value === "") {
    showToast({
      title: "No Song Found",
      type: "error",
      message: "Please enter a song name to search",
      delay: 5000,
    });
  } else {
    fetch(`${SERVER_IP}/search-song?query=${songSearchInput.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.length === 0) {
          showToast({
            title: "No Song Found",
            type: "error",
            message: "No song found with the given name",
            delay: 5000,
          });
        } else {
          songSearchContainer.innerHTML = "";
          let songHTML = "";
          data.items.forEach((song) => {
            songHTML = `<article class="search_results__card">
    <div class="search_results__image">
        <img src="${song.snippet.thumbnails.medium.url}" alt="${song.snippet.title}"
            class="search_results__img">
        <a href="#" onclick="openInIframe('${song.id.videoId}'); return false;" class="search_results__button button"><span class="material-symbols-outlined">north_east</span></a></div>
    <div class="search_results__content">
        <h3 class="search_results__subtitle">${song.snippet.channelTitle}</h3>
        <h2 class="search_results__title">${song.snippet.title}</h2>
    </div>
</article>`;

            const songDocument = new DOMParser().parseFromString(
              songHTML,
              "text/html"
            );
            songSearchContainer.appendChild(songDocument.body.firstChild);
          });
          // songSearchContainer.innerHTML = songHTML;
          songSearchQueryText.textContent = `Showing results for "${songSearchInput.value}"`;
        }
      })
      .catch((error) => {
        console.error("Error searching song:", error);
        showToast({
          title: "Error Searching Song",
          type: "error",
          message: "Internal server error. Please try again later.",
          delay: 5000,
        });
      });
  }
});

// ----------------- Open In Iframe ----------------- //
function openInIframe(videoId) {
  const iframe = document.getElementById("youtube-video-iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  youtubeVideoContainer.style.display = "block";
}

// ----------------- Make Draggable ----------------- //
function makeDraggable(el) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  const dragMouseDown = (e) => {
    e.preventDefault();
    // Get the mouse cursor position at startup:
    pos3 = e.clientX || e.touches[0].clientX;
    pos4 = e.clientY || e.touches[0].clientY;
    document.addEventListener("mouseup", closeDragElement);
    document.addEventListener("mousemove", elementDrag);
    // For touch devices:
    document.addEventListener("touchend", closeDragElement);
    document.addEventListener("touchmove", elementDrag);
  };

  const elementDrag = (e) => {
    e.preventDefault();
    // Calculate the new cursor position:
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    pos1 = pos3 - clientX;
    pos2 = pos4 - clientY;
    pos3 = clientX;
    pos4 = clientY;
    // Set the element's new position:
    el.style.top = el.offsetTop - pos2 + "px";
    el.style.left = el.offsetLeft - pos1 + "px";
  };

  const closeDragElement = () => {
    // Stop moving when mouse button is released:
    document.removeEventListener("mouseup", closeDragElement);
    document.removeEventListener("mousemove", elementDrag);
    // For touch devices:
    document.removeEventListener("touchend", closeDragElement);
    document.removeEventListener("touchmove", elementDrag);
  };

  el.addEventListener("mousedown", dragMouseDown);
  // For touch devices:
  el.addEventListener("touchstart", dragMouseDown);
}

let draggableDiv = document.querySelector(".draggable");
makeDraggable(draggableDiv);

// ----------------- Close Youtube Video ----------------- //
youtubePlayerCloseButton.addEventListener("click", () => {
  youtubeVideoContainer.style.display = "none";
  document.getElementById("youtube-video-iframe").src = "";
});

// ----------------- Get Audio From Flask ----------------- //
async function getAudioFromFlask(audioData) {
  // ensure only one of onlyBlobURL, onlyBlob, and onlyHTML is true
  // FIX THIS
  // if ((audioData.onlyBlobURL + audioData.onlyBlob + audioData.onlyHTML) !== 1) {
  //   console.error(
  //     "getAudioFromFlask",
  //     "Only one of onlyBlobURL, onlyBlob, and onlyHTML can be true"
  //   );
  //   showToast({
  //     title: "Invalid Audio Data Configuration",
  //     type: "error",
  //     message:
  //       "Cannot get audio from Flask. Only one of onlyBlobURL, onlyBlob, and onlyHTML can be true at the same time.",
  //     delay: 5000,
  //   });

  //   return false;
  // }

  // check if onlyHTML is true and HTML container is not provided
  if (audioData.onlyHTML && !audioData.HTMLcontainer) {
    console.error("getAudioFromFlask", "HTML container not provided");
    showToast({
      title: "HTML Container Not Provided",
      type: "error",
      message: "HTML container should be provided if onlyHTML is true.",
      delay: 5000,
    });

    return false;
  }

  // check the type of audio data
  if (audioData.type === "main") {
    // TODO, return false for now
    return false;
  } else if (audioData.type === "stem") {
    if (!audioData.stem.directory) {
      console.error("getAudioFromFlask", "Stem directory not provided");
      showToast({
        title: "Stem Directory Not Provided",
        type: "error",
        message: "Cannot get audio from Flask. Stem directory not provided.",
        delay: 5000,
      });

      return false;
    }

    if (audioData.stem.getOnly) {
      console.log("getAudioFromFlask", "Getting only stem");
      try {
        const response = await fetch(
          `${SERVER_IP}/load-audio?filename=${localStorage
            .getItem("upload_audio_cache")
            .replace(".mp3", "")
            .replace(".wav", "")}&filetype=stem&stemname=${
            audioData.stem.getOnly
          }`
        );
        const blob = await response.blob();

        if (audioData.onlyBlob) {
          console.log("getAudioFromFlask", "Returning blob");
          console.log("blob from function", blob);
          return blob;
        }

        const audioUrl = URL.createObjectURL(blob);

        if (audioData.onlyBlobURL) {
          return audioUrl;
        }

        if (audioData.onlyHTML) {
          return false;
        }
      } catch (error) {
        console.error("Error fetching audio:", error);
        showToast({
          title: "Error Fetching Audio",
          type: "error",
          message: "Internal server error. Please try again later.",
          delay: 5000,
        });
        return false;
      }
    } else if (audioData.stem.getAll) {
      // TODO, return false for now
      return false;
    } else {
      console.error("getAudioFromFlask", "Invalid stem data configuration");
      showToast({
        title: "Invalid Stem Data Configuration",
        type: "error",
        message:
          "Cannot get audio from Flask. Invalid stem data configuration.",
        delay: 5000,
      });

      return false;
    }
  } else if (audioData.type === "convert") {
    if (audioData.onlyBlob) {
      // TODO, return false for now
      return false;
    }

    if (!audioData.convert.directory) {
      console.error("getAudioFromFlask", "Convert directory not provided");
      showToast({
        title: "Convert Directory Not Provided",
        type: "error",
        message: "Cannot get audio from Flask. Convert directory not provided.",
        delay: 5000,
      });
      return false;
    }

    const instrument_list = ["Violin", "Flute", "Trumpet", "Saxophone"];
    let audioUrls = [];

    // if onlyHTML is true, clear container
    if (audioData.onlyHTML) {
      audioData.HTMLcontainer.innerHTML = "";
    }

    instrument_list.forEach(async (instrument) => {
      const response = await fetch(
        `${SERVER_IP}/load-audio?directory=${audioData.convert.directory}&filetype=convert&instrument=${instrument}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);

        // add blob URL to audioUrls if onlyBlobURL is true
        if (audioData.onlyBlobURL) {
          audioUrls.push(audioUrl);
        }

        // create HTML component if onlyHTML is true
        if (audioData.onlyHTML) {
          const audioPLayerHTML = `<div class="col-12 mt-2 mb-2"><div class="stem-audio-container">
      <div class="stem-audio-title"> <p>${instrument}</p> </div> <div class="stem-audio-player">
      <wave-audio-path-player src="${audioUrl}" wave-width="360" wave-height="80" color="#55007f" wave-options='{"animation":true,"samples":100, "type": "wave"}' title="">
      </wave-audio-path-player> </div> 
      <div class="stem-audio-controls" style="display: flex; flex-direction: row; justify-content: end;"> 
      <a href="${audioUrl}" download="${instrument}.mp3"><div class="card-control-icon"> <span class="material-symbols-outlined">download</span></div></a>
      </div></div></div>`;

          const htmlElement = new DOMParser().parseFromString(
            audioPLayerHTML,
            "text/html"
          ).body.firstChild;

          audioData.HTMLcontainer.appendChild(htmlElement);
        }
      } else {
        console.error("getAudioFromFlask", "Error getting converted audio");
        showToast({
          title: "Error getting converted audio",
          type: "error",
          message:
            "Either the file does not exist or the directory is invalid.",
          delay: 5000,
        });

        return false;
      }
    });

    if (audioData.onlyBlobURL) {
      return audioUrls;
    } else {
      return true;
    }
  } else {
    console.error("getAudioFromFlask", "Invalid audio data type");
    showToast({
      title: "Invalid Audio Data Type",
      type: "error",
      message: "Cannot get audio from Flask. Invalid audio data type.",
      delay: 5000,
    });

    return false;
  }
}

// ----------------- create new project ----------------- //
function createNewProject(loadProject = false){
  if(loadProject){
    window.location.href = "http://localhost:3000/?new-project=true";
  }
  else{
    let modalHTML = `<div><p>Creating new project will clear all the data in the current project. Are you sure you want to create a new project?</p></div>`;
  showModal({
    title: "Warning ⚠️",
    body: modalHTML,
    actionFunction: "createNewProject(true)",
    autoClose: true,
    actionButtonText: "Yes",
  });
  }
}