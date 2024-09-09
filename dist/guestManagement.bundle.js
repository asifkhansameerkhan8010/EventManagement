/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!**********************************************!*\
  !*** ./guest-management/guest-management.ts ***!
  \**********************************************/

var _a;
const loggedInUser = localStorage.getItem('loggedInUser');
const urlParams = new URLSearchParams(window.location.search);
console.log(window.location.search);
console.log(urlParams);
const eventId = urlParams.get('eventId');
console.log(eventId);
if (!loggedInUser || !eventId) {
    alert('Invalid access. Please log in and select an event.');
    window.location.href = '../login/login.html';
}
const eventGuestsKey = `guests_${loggedInUser}_${eventId}`;
let eventGuests = JSON.parse(localStorage.getItem(eventGuestsKey) || '[]');
let editingIndex = -1;
function renderGuests() {
    const guestListBody = document.getElementById('guest-list-body');
    guestListBody.innerHTML = '';
    eventGuests.forEach((guest, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${guest.name}</td>
            <td>${guest.email}</td>
            <td>${guest.rsvp}</td>
            <td>
                <button data-index="${index}" class="edit-button">Edit</button>
                <button data-index="${index}" class="remove-button">Remove</button>
            </td>
        `;
        guestListBody.appendChild(row);
    });
    // Attach event listeners after rendering guests
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index') || '0');
            editGuest(index);
        });
    });
    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index') || '0');
            removeGuest(index);
        });
    });
}
(_a = document.getElementById('add-guest-form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (event) {
    event.preventDefault();
    const guestName = document.getElementById('guest-name').value;
    const guestEmail = document.getElementById('guest-email').value;
    const guestRSVP = document.getElementById('guest-rsvp').value;
    // Check for email uniqueness
    if (eventGuests.some(guest => guest.email === guestEmail && editingIndex === -1)) {
        alert('This email is already in use. Please use a different email.');
        return;
    }
    // Create or update guest object
    const guestDetails = {
        name: guestName,
        email: guestEmail,
        rsvp: guestRSVP
    };
    if (editingIndex > -1) {
        eventGuests[editingIndex] = guestDetails;
        editingIndex = -1;
    }
    else {
        eventGuests.push(guestDetails);
    }
    // Save the updated guest list back to local storage
    localStorage.setItem(eventGuestsKey, JSON.stringify(eventGuests));
    this.reset();
    document.querySelector('.add-button').textContent = 'Add Guest';
    renderGuests();
    alert('Guest saved successfully!');
});
// Remove a guest from the list
function removeGuest(index) {
    if (confirm('Are you sure you want to remove this guest?')) {
        eventGuests.splice(index, 1);
        localStorage.setItem(eventGuestsKey, JSON.stringify(eventGuests));
        renderGuests();
    }
}
// Edit a guest's details
function editGuest(index) {
    const guest = eventGuests[index];
    document.getElementById('guest-name').value = guest.name;
    document.getElementById('guest-email').value = guest.email;
    document.getElementById('guest-rsvp').value = guest.rsvp;
    editingIndex = index;
    document.querySelector('.add-button').textContent = 'Update Guest';
}
// Send invitations function
document.querySelector('.send-invites-button').addEventListener('click', function () {
    alert('Invitations sent successfully!');
});
renderGuests();

/******/ })()
;
//# sourceMappingURL=guestManagement.bundle.js.map