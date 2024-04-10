/**
 * Sound Effect Credits:
 * <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=140883">UNIVERSFIELD</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=140883">Pixabay</a>
 * <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=126515">UNIVERSFIELD</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=126515">Pixabay</a>
 * <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=143022">UNIVERSFIELD</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=143022">Pixabay</a>
 * <a href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=87963">Pixabay</a>
 * <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=132470">UNIVERSFIELD</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=132470">Pixabay</a>
 */

import { showToast, showModal } from "./utils.js";

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
            `${serverIP}/load-audio?filename=${localStorage.getItem(
              "upload_audio_cache"
            )}&filetype=${"stem"}&stemname=${stem}`
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
