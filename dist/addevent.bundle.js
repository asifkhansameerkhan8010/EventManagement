/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!******************************!*\
  !*** ./addevent/addevent.ts ***!
  \******************************/

var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
const loggedInUser = localStorage.getItem('loggedInUser');
if (!loggedInUser) {
    alert('You must be logged in to add or edit events.');
    window.location.href = 'index.html';
}
// events for logged-in user or initialize an empty array
const userEventsKey = `events_${loggedInUser}`;
let userEvents = JSON.parse(localStorage.getItem(userEventsKey) || '[]');
function populateEventCategories() {
    const categorySelect = document.getElementById('event-category');
    if (categorySelect) {
        categorySelect.innerHTML = '';
        // Retrieve categories from ls
        const categories = JSON.parse(localStorage.getItem('categories_list') || '[]');
        // category select element
        categories.forEach(categoryObj => {
            const option = document.createElement('option');
            option.value = categoryObj.name.toLowerCase();
            option.textContent = categoryObj.name;
            categorySelect.appendChild(option);
        });
    }
}
// to populate cate
populateEventCategories();
function populateForm(eventId) {
    const event = userEvents.find(event => event.id === eventId);
    if (event) {
        const nameInput = document.getElementById('event-name');
        const dateInput = document.getElementById('event-date');
        const locationInput = document.getElementById('location');
        const descriptionInput = document.getElementById('event-description');
        const statusInput = document.getElementById('event-status');
        const categoryInput = document.getElementById('event-category');
        const submitButton = document.querySelector('button[type="submit"]');
        if (nameInput)
            nameInput.value = event.name || '';
        if (dateInput)
            dateInput.value = event.date || '';
        if (locationInput)
            locationInput.value = event.location || '';
        if (descriptionInput)
            descriptionInput.value = event.description || '';
        if (statusInput)
            statusInput.value = event.status || '';
        if (categoryInput)
            categoryInput.value = event.category || '';
        if (submitButton)
            submitButton.innerText = 'Update Event';
    }
    else {
        console.error('Event not found');
    }
}
// Check for editing an event
const urlParams = new URLSearchParams(window.location.search);
const eventId = parseInt(urlParams.get('eventId') || '', 10);
console.log(eventId);
if (eventId) {
    populateForm(eventId);
}
(_a = document.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (event) {
    event.preventDefault();
    const eventName = document.getElementById('event-name').value;
    const eventDate = document.getElementById('event-date').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('event-description').value;
    const status = document.getElementById('event-status').value;
    const category = document.getElementById('event-category').value;
    // Create a new event object or update the existing one
    const newEvent = {
        id: eventId || Date.now(), // Uses existing ID if editing, else generate new
        name: eventName,
        date: eventDate,
        location: location,
        description: description,
        status: status,
        category: category,
        guests: []
    };
    if (eventId) {
        const index = userEvents.findIndex(event => event.id === eventId);
        if (index !== -1) {
            userEvents[index] = newEvent;
        }
    }
    else {
        userEvents.push(newEvent);
    }
    // Save the updated events array back to the ls
    localStorage.setItem(userEventsKey, JSON.stringify(userEvents));
    this.reset();
    alert('Event saved successfully!');
    window.location.href = 'dashboard.html';
});

})();

/******/ })()
;
//# sourceMappingURL=addevent.bundle.js.map