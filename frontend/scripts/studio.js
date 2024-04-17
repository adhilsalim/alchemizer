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
let isLoggedIn = true;
const serverIP = "http://localhost:5000";

//----------------- DOM Elements -----------------//

const toastContainer = document.getElementById("main-toast-container");
const modalContainer = document.getElementById("main-modal-container");
const welcomeTitle = document.querySelector("#welcome-title");
const welcomeSubtitle = document.querySelector("#welcome-subtitle");
const separateAudioButton = document.getElementById("separate-audio");
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
  if (!isLoggedIn) {
    window.location.href = "http://localhost:3000/auth";
    return;
  }

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
  console.log(audioExample[template]);
  loadSelectedAudio(audioExample[template].fileName);
  localStorage.setItem("upload_audio_cache", audioExample[template].fileName);
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
