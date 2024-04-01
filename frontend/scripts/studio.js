console.clear();

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
  console.log("Loading audio template", template);
}
