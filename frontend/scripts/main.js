console.clear();

//----------------- Global Variables -----------------//
let file = null;

// ----------------- DOM Elements ----------------- //
const selectAudioButton = document.getElementById("select-audio");
const selectAudioButtonText = document.getElementById("select-audio-text");
const uploadAudioButton = document.getElementById("upload-audio");
const navbar = document.querySelector(".nav-container");
const heroSection = document.querySelector(".hero-main");

// ----------------- Navbar Auto Expand Animation ----------------- //

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
uploadAudioButton.addEventListener("click", () => {
  if (file) {
    console.log("Uploading file", file);
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
        console.error("Error uploading file", error);
      });
  } else {
    alert("Please select/record an audio file.");
  }
});

// ----------------- Cache File ----------------- //
function cacheFile(file) {
  if (file) {
    localStorage.setItem("upload_audio_cache", file.name);
    console.log("File name cached:", file.name);
  } else {
    console.log("CRASH: No file selected.");
    alert("CRASH: Audio caching failed.");
  }
}
