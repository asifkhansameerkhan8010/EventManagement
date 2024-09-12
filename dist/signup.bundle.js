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
const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
const usernameValidationRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;
signupForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    if (!usernameValidationRegex.test(username)) {
        signupError.textContent = 'Username must start with a letter and can only contain letters and numbers.';
        return;
    }
    // Check if passwords match
    if (password !== confirmPassword) {
        signupError.textContent = 'Passwords do not match!';
        return;
    }
    if (!passwordValidationRegex.test(password)) {
        signupError.textContent = 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one special character.';
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
    window.location.href = 'index.html';
});

})();

/******/ })()
;
//# sourceMappingURL=signup.bundle.js.map