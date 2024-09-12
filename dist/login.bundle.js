/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!************************!*\
  !*** ./login/login.ts ***!
  \************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const adminCredentials = {
    email: 'admin@gmail.com',
    password: '1',
    role: 'admin'
};
if (!localStorage.getItem(adminCredentials.email)) {
    localStorage.setItem(adminCredentials.email, JSON.stringify(adminCredentials));
}
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    // user data from ls
    const storedUser = localStorage.getItem(email);
    // Check if user exists
    if (!storedUser) {
        loginError.textContent = 'User does not exist! Please sign up first.';
        return;
    }
    const user = JSON.parse(storedUser);
    // Validate password
    if (user.password !== password) {
        loginError.textContent = 'Incorrect password. Please try again.';
        return;
    }
    localStorage.setItem('loggedInUser', email); // Save the logged-in user's email to identify current user
    loginError.textContent = '';
    loginForm.reset();
    if (user.role == "admin") {
        window.location.href = 'admin-dashboard.html';
    }
    else {
        window.location.href = 'dashboard.html';
    }
});

})();

/******/ })()
;
//# sourceMappingURL=login.bundle.js.map