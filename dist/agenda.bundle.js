/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!**************************!*\
  !*** ./agenda/agenda.ts ***!
  \**************************/

function showAgendaModal(eventId) {
    const modal = document.getElementById('event-agenda-modal');
    const closeBtn = document.querySelector('#event-agenda-modal .close');
    const agendaItemsContainer = document.getElementById('agenda-items-container');
    const agendaForm = document.getElementById('agenda-form');
    const addAgendaButton = document.getElementById('add-agenda-item');
    modal.style.display = 'block';
    // Retrieve the logged-in user from ls
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert('User not logged in');
        return;
    }
    // Load existing agenda items from local storage
    const eventAgendaKey = `agenda_${loggedInUser}_${eventId}`;
    let agendaItems = JSON.parse(localStorage.getItem(eventAgendaKey) || '[]');
    // Display existing agenda items
    agendaItemsContainer.innerHTML = '';
    agendaItems.forEach(item => {
        const agendaItemDiv = document.createElement('div');
        agendaItemDiv.innerHTML = `
            <p><strong>Start Time:</strong> ${item.startTime}</p>
            <p><strong>End Time:</strong> ${item.endTime}</p>
            <p><strong>Description:</strong> ${item.description}</p>
        `;
        agendaItemsContainer.appendChild(agendaItemDiv);
    });
    //adding a new agenda item
    addAgendaButton.addEventListener('click', function () {
        const startTime = document.getElementById('agenda-start-time').value;
        const endTime = document.getElementById('agenda-end-time').value;
        const description = document.getElementById('agenda-description').value;
        if (startTime && endTime && description) {
            const newItem = {
                startTime,
                endTime,
                description
            };
            // Add new item to the list and save to local storage
            agendaItems.push(newItem);
            localStorage.setItem(eventAgendaKey, JSON.stringify(agendaItems));
            // Clear and update agenda display
            agendaItemsContainer.innerHTML = '';
            agendaItems.forEach(item => {
                const agendaItemDiv = document.createElement('div');
                agendaItemDiv.innerHTML = `
                    <p><strong>Start Time:</strong> ${item.startTime}</p>
                    <p><strong>End Time:</strong> ${item.endTime}</p>
                    <p><strong>Description:</strong> ${item.description}</p>
                `;
                agendaItemsContainer.appendChild(agendaItemDiv);
            });
            // Clear the form fields
            agendaForm.reset();
        }
        else {
            alert('Please fill out all fields.');
        }
    });
    // Close the modal when the close button is clicked
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });
    // Close the modal if clicked outside of it
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
// `showAgendaModal` globally for the event cards
window.showAgendaModal = showAgendaModal;

/******/ })()
;
//# sourceMappingURL=agenda.bundle.js.map