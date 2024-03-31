console.clear();

// ----------------- DOM Elements ----------------- //
const selectAudioButton = document.getElementById("select-audio");
const selectAudioButtonText = document.getElementById("select-audio-text");

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
    const file = e.target.files[0];
    console.log(file);
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = (readerEvent) => {
    //   const content = readerEvent.target.result;
    //   const audio = new Audio(content);
    //   audio.play();
    // };
    selectAudioButtonText.textContent = "Selected";
    selectAudioButton.classList.add("light-green-bgcolor");
  };

  input.click();
});
