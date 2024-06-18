import { AuthIsLoggedIn } from "../auth/authentication.js";

const WEB_SERVER = "http://localhost:3000";
const navbarAuthLink = document.getElementById("navbar-auth-action");
localStorage.setItem("isLoggedIn", "logout");

AuthIsLoggedIn()
  .then((response) => {
    console.log(response);
    if (response.success) {
      console.log("User is logged in");
      localStorage.setItem("isLoggedIn", "login");
      navbarAuthLink.innerHTML = "Sign Out";
      navbarAuthLink.href = `${WEB_SERVER}/auth/?signout=true`;
    } else {
      console.log("User is not logged in");
      localStorage.setItem("isLoggedIn", "logout");
      navbarAuthLink.innerHTML = "Sign In";
      navbarAuthLink.href = `${WEB_SERVER}/auth/`;
    }
  })
  .catch((error) => {
    console.error(error);
  });

console.log("authState.js loaded");
