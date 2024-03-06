const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");

fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];
  if (file && file.type === "audio/mpeg") {
    uploadBtn.disabled = false;
  } else {
    uploadBtn.disabled = true;
  }
});

uploadBtn.addEventListener("click", function () {
  const file = fileInput.files[0];
  // Here, you can add code to upload the file to a server or perform any other desired action
  console.log("Uploading file:", file);
});
