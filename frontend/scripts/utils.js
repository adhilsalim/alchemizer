const toastContainer = document.getElementById("main-toast-container");
const modalContainer = document.getElementById("main-modal-container");

// ----------------- Show Toast ----------------- //
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

// ----------------- Show Modal ----------------- //
const showModal = (data) => {
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
};

export { showToast, showModal };
