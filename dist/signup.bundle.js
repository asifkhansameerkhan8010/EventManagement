/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!**************************!*\
  !*** ./signup/signup.ts ***!
  \**************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const signupForm = document.getElementById('signup-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const signupError = document.getElementById('signup-error');
signupForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    // Check if passwords match
    if (password !== confirmPassword) {
        signupError.textContent = 'Passwords do not match!';
        return;
    }
    if (localStorage.getItem(email)) {
        signupError.textContent = 'An account with this email already exists!';
        return;
    }
    // Save new user data to local storage
    const user = { username, email, password };
    localStorage.setItem(email, JSON.stringify(user)); // email as a unique key 
    signupError.textContent = '';
    signupForm.reset();
    alert('Sign up successful! You can now log in.');
    window.location.href = '../login/login.html';
});

})();

/******/ })()
;
//# sourceMappingURL=signup.bundle.js.map