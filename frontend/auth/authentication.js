import { firebaseConfig } from './firebaseconfig.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, updateProfile, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to create an account with email and password
export function AuthCreateAccount(name, email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return updateProfile(user, { displayName: name })
        .then(() => ({ success: true, message: "User profile updated with name:" + name }))
        .catch((error) => ({ success: false, message: "Error updating user profile: " + error.message }));
    })
    .catch((error) => ({ success: false, message: "Error creating account: " + error.message }));
}

// Function to sign in with email and password
export function AuthSignInWithEmailAndPassword(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => ({ success: true, message: "User signed in: " + userCredential.user.email }))
    .catch((error) => ({ success: false, message: "Error signing in: " + error.message }));
}

// Function to send a password reset email
export function AuthForgetPassword(email) {
  return sendPasswordResetEmail(auth, email)
    .then(() => ({ success: true, message: "Password reset email sent to: " + email }))
    .catch((error) => ({ success: false, message: "Error sending password reset email: " + error.message }));
}

// Function to sign in with Google
export function AuthContinueWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      if (result.additionalUserInfo.isNewUser) {
        return updateProfile(user, { displayName: user.displayName })
          .then(() => ({ success: true, message: "New Google user profile updated with name: " + user.displayName }))
          .catch((error) => ({ success: false, message: "Error updating Google user profile: " + error.message }));
      } else {
        return { success: true, message: "Google user signed in: " + user.email };
      }
    })
    .catch((error) => ({ success: false, message: "Error with Google sign in: " + error.message }));
}

// Function to check if a user is logged in
export function AuthIsLoggedIn() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({ success: true, message: "User is logged in: " + user.email });
      } else {
        resolve({ success: false, message: "No user is logged in." });
      }
    });
  });
}

// Function to sign out the current user
export function AuthSignOut() {
    const auth = getAuth();
    return signOut(auth)
      .then(() => ({ success: true, message: "User signed out successfully." }))
      .catch((error) => ({ success: false, message: "Error signing out: " + error.message }));
  }