import {Event} from "../models/Model"

const loggedInUser: string | null = localStorage.getItem('loggedInUser');
if (!loggedInUser) {
    alert('You must be logged in to add or edit events.');
    window.location.href = '../login/login.html';
}

// events for logged-in user or initialize an empty array
const userEventsKey: string = `events_${loggedInUser}`;
let userEvents: Event[] = JSON.parse(localStorage.getItem(userEventsKey) || '[]');


function populateEventCategories(): void {
    const categorySelect = document.getElementById('event-category') as HTMLSelectElement;
    if (categorySelect) {
        categorySelect.innerHTML = ''; 

        // Retrieve categories from ls
        const categories: { name: string }[] = JSON.parse(localStorage.getItem('categories_list') || '[]');

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

function populateForm(eventId: number): void {
    const event = userEvents.find(event => event.id === eventId);
    if (event) {
        const nameInput = document.getElementById('event-name') as HTMLInputElement;
        const dateInput = document.getElementById('event-date') as HTMLInputElement;
        const locationInput = document.getElementById('location') as HTMLInputElement;
        const descriptionInput = document.getElementById('event-description') as HTMLInputElement;
        const statusInput = document.getElementById('event-status') as HTMLInputElement;
        const categoryInput = document.getElementById('event-category') as HTMLSelectElement;
        const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;

        if (nameInput) nameInput.value = event.name || '';
        if (dateInput) dateInput.value = event.date || '';
        if (locationInput) locationInput.value = event.location || '';
        if (descriptionInput) descriptionInput.value = event.description || '';
        if (statusInput) statusInput.value = event.status || '';
        if (categoryInput) categoryInput.value = event.category || '';
        if (submitButton) submitButton.innerText = 'Update Event';
    } else {
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

document.querySelector('form')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const eventName = (document.getElementById('event-name') as HTMLInputElement).value;
    const eventDate = (document.getElementById('event-date') as HTMLInputElement).value;
    const location = (document.getElementById('location') as HTMLInputElement).value;
    const description = (document.getElementById('event-description') as HTMLInputElement).value;
    const status = (document.getElementById('event-status') as HTMLInputElement).value;
    const category = (document.getElementById('event-category') as HTMLSelectElement).value;

    // Create a new event object or update the existing one
    const newEvent: Event = {
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
    } else {
        userEvents.push(newEvent);
    }

    // Save the updated events array back to the ls
    localStorage.setItem(userEventsKey, JSON.stringify(userEvents));

    (this as HTMLFormElement).reset();

    alert('Event saved successfully!');
    window.location.href = '../dashboard/dashboard.html';
});
