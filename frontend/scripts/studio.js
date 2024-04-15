/**
 * Sound Effect Credits:
 * <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=140883">UNIVERSFIELD</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=140883">Pixabay</a>
 * <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=126515">UNIVERSFIELD</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=126515">Pixabay</a>
 * <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=143022">UNIVERSFIELD</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=143022">Pixabay</a>
 * <a href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=87963">Pixabay</a>
 * <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=132470">UNIVERSFIELD</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=132470">Pixabay</a>
 */

// import { showToast, showModal } from "./utils.js";

// ----------------- Clear Console ----------------- //
console.clear();

// ----------------- Global Variables -----------------//

const audioExample = {
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

const stemDict = {
  "2stems": ["vocals", "accompaniment"],
  "4stems": ["vocals", "drums", "bass", "other"],
  "5stems": ["vocals", "drums", "bass", "piano", "other"],
};

let selectedStems = "2stems";

const serverIP = "http://localhost:5000";

//----------------- DOM Elements -----------------//
const toastContainer = document.getElementById("main-toast-container");
const modalContainer = document.getElementById("main-modal-container");
const welcomeTitle = document.querySelector("#welcome-title");
const welcomeSubtitle = document.querySelector("#welcome-subtitle");
const separateAudioButton = document.getElementById("separate-audio");
// const MainAudioPlayer = document.querySelector("#main-audio-player");
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
// ----------------- Welcome Message ----------------- //
welcomeTitle.textContent = `Hello, ${getUserName("first")}`;
welcomeSubtitle.textContent = `Welcome back to your studio`;

// ----------------- Load Selected Audio ----------------- //
loadSelectedAudio(localStorage.getItem("upload_audio_cache"));

// ----------------- Load Audio Example Attributes ----------------- //
document.querySelector("#audio_example_container_1 .card-title").textContent =
  audioExample.example_audio_1.title;
document.querySelector("#audio_example_container_1 .card-text").textContent =
  audioExample.example_audio_1.duration;
document
  .querySelector("#audio_example_container_1 .card-text")
  .setAttribute("title", audioExample.example_audio_1.singers);

document.querySelector("#audio_example_container_2 .card-title").textContent =
  audioExample.example_audio_2.title;
document.querySelector("#audio_example_container_2 .card-text").textContent =
  audioExample.example_audio_2.duration;
document
  .querySelector("#audio_example_container_2 .card-text")
  .setAttribute("title", audioExample.example_audio_2.singers);

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
}

// ----------------- Get Stems ----------------- //
separateAudioButton.addEventListener("click", () => {
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
    actionButtonText: "Continue",
  });
});

function selectStem(stems) {
  selectedStems = stems;
  console.log("Select Stems:", selectedStems);

  document.getElementById(
    "stem-dropdown-btn"
  ).textContent = `Select Stems: ${selectedStems}`;
}

function getStems() {
  audioSeparationLoader.style.display = "block";
  showToast({
    title: "Separating Audio 🎶",
    type: "info",
    message: "This may take a few minutes<br>Wait until we bake your music!",
    delay: 10000,
  });

  fetch(
    `${serverIP}/separate-audio?filename=${localStorage.getItem(
      "upload_audio_cache"
    )}&stems=${selectedStems}`
  )
    .then((response) => response.json())
    .then((data) => {
      audioSeparationLoader.style.display = "none";

      audioSeparationContainer.innerHTML = "";

      console.log("getting stems:", stemDict[selectedStems]);
      stemDict[selectedStems].forEach((stem) => {
        (async () => {
          const response = await fetch(
            `${serverIP}/load-audio?filename=${localStorage
              .getItem("upload_audio_cache")
              .replace(".mp3", "")
              .replace(".wav", "")}&filetype=${"stem"}&stemname=${stem}`
          );
          if (response.ok) {
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            audioPLayerHTML = `<div class="col-12 mt-2 mb-2"><div class="stem-audio-container">
            <div class="stem-audio-title"> <p>${stem}</p> </div> <div class="stem-audio-player">
            <wave-audio-path-player src="${audioUrl}" wave-width="360" wave-height="80" color="#55007f" wave-options='{"animation":true,"samples":100, "type": "wave"}' title="">
            </wave-audio-path-player> </div> 
            <div class="stem-audio-controls" style="display: flex; flex-direction: row; justify-content: end;"> 
            <div class="card-control-icon"> <span class="material-symbols-outlined"> download </span> </div> 
            <div class="card-control-icon"> <span class="material-symbols-outlined" onclick="showToast({ title: 'Feature Coming Soon 🚀', message: 'This feature is under development and will be available soon.', type: 'info' })"> arrow_split </span> </div> </div> </div> </div>`;

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
async function loadSelectedAudio(fileName) {
  if (fileName) {
    try {
      showToast({
        title: "Loading Audio",
        type: "info",
        message: "Loading " + fileName,
        delay: 3000,
      });
      const response = await fetch(
        `${serverIP}/load-audio?filename=${fileName}`
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
async function getAudioTitle(fileName) {
  try {
    const response = await fetch(
      `${serverIP}/get-audio-title?filename=${fileName}`
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
function loadAudioTemplate(template) {
  console.log(audioExample[template]);
  loadSelectedAudio(audioExample[template].fileName);
  localStorage.setItem("upload_audio_cache", audioExample[template].fileName);
}
