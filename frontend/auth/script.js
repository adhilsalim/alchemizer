import {
  AuthCreateAccount,
  AuthSignInWithEmailAndPassword,
  AuthForgetPassword,
  AuthContinueWithGoogle,
  AuthIsLoggedIn,
  AuthSignOut 
} from "./authentication.js";

// ------------------------------ Toast ------------------------------ //
const toastContainer = document.getElementById("main-toast-container");

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


// ------------------------------ Animation ------------------------------ //
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// ------------------------------ sign up ------------------------------ //
const signUpActionButton = document.getElementById("auth-sign-up-button");

signUpActionButton.addEventListener("click", () => {
  const name = document.getElementById("auth-sign-up-name").value;
  const email = document.getElementById("auth-sign-up-email").value;
  const password = document.getElementById("auth-sign-up-password").value;

  // check whether name and email are not empty
  if (name === "") {
    alert("Please enter your name.");
    return;
  }
  if (email === "") {
    alert("Please enter your email.");
    return;
  }

  // check whether password is at least 6 characters long and not empty
  if (password === "" || password.length < 6) {
    alert("Please enter your password.");
    return;
  }

  AuthCreateAccount(name, email, password)
    .then((response) => {
      console.log(response);
      window.location.href = "http://localhost:3000/studio/";
    })
    .catch((error) => {
      console.error(error);
      alert("Error creating account: " + error.message);
    });
});

// ------------------------------ sign out ------------------------------ //
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("signout")) {
	AuthSignOut()
  .then(response => {console.log(response);
	showToast({
			type: "info",
			title: "Signed Out",
			message: response.message,
		});
  })
  .catch(error => {console.error(error)
	showToast({
			type: "error",
			title: "Error Signing Out",
			message: error.message,
		});
  });
}