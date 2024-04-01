console.clear();

// ----------------- Global Variables -----------------//
const separateAudioButton = document.getElementById("separate-audio");

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

//----------------- DOM Elements -----------------//
const welcomeTitle = document.querySelector("#welcome-title");
const welcomeSubtitle = document.querySelector("#welcome-subtitle");
const MainAudioPlayer = document.querySelector("#main-audio-player");
const MainAudioPlayerContainer = document.querySelector(
  "#main-audio-player-container"
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
  console.log("Select Audio Button Clicked");
  fetch(
    `http://localhost:5000/separate-audio?filename=${localStorage.getItem(
      "upload_audio_cache"
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Audio separation successful:", data.message);
      alert("Audio separation successful:", data.message);
    })
    .catch((error) => {
      console.error("Error separating audio:", error);
      alert("Error separating audio:", error);
    });
});

// ----------------- Get Selected Audio ----------------- //
function loadSelectedAudio(fileName) {
  if (fileName) {
    fetch(`http://localhost:5000/load-audio?filename=${fileName}`)
      .then((response) => response.blob())
      .then((blob) => {
        const audioUrl = URL.createObjectURL(blob);
        MainAudioPlayerContainer.innerHTML = `<wave-audio-path-player src="${audioUrl}" wave-width="400" wave-height="80" color="#55007f" wave-options='{"animation":true,"samples":100, "type": "wave"}' id="main-audio-player"></wave-audio-path-player>`;
        console.log("Audio loaded:", audioUrl);
      })
      .catch((error) => {
        console.error("Error loading audio:", error);
      });
  } else {
    console.log("No audio found");
    alert("No audio found");
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
