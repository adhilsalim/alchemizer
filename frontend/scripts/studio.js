console.clear();

//----------------- DOM Elements -----------------//
const welcomeTitle = document.querySelector("#welcome-title");
const welcomeSubtitle = document.querySelector("#welcome-subtitle");

// ----------------- Welcome Message ----------------- //
welcomeTitle.textContent = `Hello, ${getUserName("first")}`;
welcomeSubtitle.textContent = `Welcome back to your studio`;

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
