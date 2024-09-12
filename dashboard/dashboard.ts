import { AgendaItem, Event } from "../models/Model";

const loggedInUser: string | null = localStorage.getItem('loggedInUser');
if (!loggedInUser) {
    alert('Please log in first.');
    window.location.href = 'index.html'; 
}

document.getElementById('username-display')!.innerText = `${loggedInUser}`;

// User events from local storage
const userEventsKey: string = `events_${loggedInUser}`;
let userEvents: Event[] = JSON.parse(localStorage.getItem(userEventsKey) || '[]');

// Populate category filter dropdown
function populateCategoryFilter(): void {
    const categoryFilter = document.getElementById('filter-category') as HTMLSelectElement;
    categoryFilter.innerHTML = '';
    const categories = JSON.parse(localStorage.getItem('categories_list') || '[]');

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Filter by Category';
    categoryFilter.appendChild(defaultOption);

    // Categories from local storage
    categories.forEach((category: { name: string }) => {
        const option = document.createElement('option');
        option.value = category.name.toLowerCase();
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

populateCategoryFilter();

// Render events
function renderEvents(events: Event[]): void {
    const eventsList = document.getElementById('events-list')!;
    eventsList.innerHTML = ''; 

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';

        // Card content
        eventCard.innerHTML = `
            <h3>${event.name}</h3>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Description:</strong> ${event.description}</p>
            <p><strong>Status:</strong> <span class="status ${event.status.toLowerCase()}">${event.status}</span></p>
            <button id="viewdetails-btn-${event.id}">View Details</button>
            <button id="manageguest-btn-${event.id}">Manage Guests</button>
            <button id="editevent-btn-${event.id}">Edit Event</button>
            <button id="dlt-btn-${event.id}" style="background-color: red; color: white;">Delete</button>
        `;
        
        eventsList.appendChild(eventCard);

        // Add event listeners
        document.getElementById(`viewdetails-btn-${event.id}`)!.addEventListener('click', () => viewEventDetails(event.id));
        document.getElementById(`manageguest-btn-${event.id}`)!.addEventListener('click', () => manageGuests(event.id));
        document.getElementById(`editevent-btn-${event.id}`)!.addEventListener('click', () => editEvent(event.id));
        document.getElementById(`dlt-btn-${event.id}`)!.addEventListener('click', () => deleteEvent(event.id));
    });
}

// Delete an event
function deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            alert('User not logged in');
            return;
        }
        
        const eventKey = `events_${loggedInUser}`;
        let userEvents = JSON.parse(localStorage.getItem(eventKey) || '[]') as Event[];
        userEvents = userEvents.filter((event: Event) => event.id !== eventId);
        localStorage.setItem(eventKey, JSON.stringify(userEvents));

        const specificEventKey = `event_${eventId}`;
        localStorage.removeItem(specificEventKey);

        const agendaKey = `agenda_${loggedInUser}_${eventId}`;
        localStorage.removeItem(agendaKey);

        const guestListKey = `guests_${loggedInUser}_${eventId}`;
        localStorage.removeItem(guestListKey);

        renderEvents(userEvents);
    }
}

// Function to filter events
function filterEvents(): void {
    const searchText = (document.getElementById('search-bar') as HTMLInputElement).value.toLowerCase();
    const selectedDateFilter = (document.getElementById('filter-date') as HTMLSelectElement).value;
    const selectedCategoryFilter = (document.getElementById('filter-category') as HTMLSelectElement).value;
    const selectedStatusFilter = (document.getElementById('filter-status') as HTMLSelectElement).value;

    let filteredEvents = userEvents;

    // Search filter
    if (searchText) {
        filteredEvents = filteredEvents.filter(event => event.name.toLowerCase().includes(searchText));
    }

    if (selectedDateFilter) {
        const today = new Date();
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            if (selectedDateFilter === 'today') {
                return eventDate.toDateString() === today.toDateString();
            } else if (selectedDateFilter === 'week') {
                const startOfWeek = today.getDate() - today.getDay();
                const endOfWeek = startOfWeek + 6;
                const startOfWeekDate = new Date(today.setDate(startOfWeek));
                const endOfWeekDate = new Date(today.setDate(endOfWeek));
                return eventDate >= startOfWeekDate && eventDate <= endOfWeekDate;
            } else if (selectedDateFilter === 'month') {
                return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
            }
            return true;
        });
    }

    if (selectedCategoryFilter) {
        filteredEvents = filteredEvents.filter(event => event.category === selectedCategoryFilter);
    }

    if (selectedStatusFilter) {
        filteredEvents = filteredEvents.filter(event => event.status === selectedStatusFilter);
    }

    renderEvents(filteredEvents);
}

// Filter functionality
renderEvents(userEvents);
(document.getElementById('search-bar') as HTMLInputElement).addEventListener('input', filterEvents);
(document.getElementById('filter-date') as HTMLSelectElement).addEventListener('change', filterEvents);
(document.getElementById('filter-category') as HTMLSelectElement).addEventListener('change', filterEvents);
(document.getElementById('filter-status') as HTMLSelectElement).addEventListener('change', filterEvents);

// Logout functionality
document.getElementById('logout-button')!.addEventListener('click', function () {
    localStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    window.location.href = 'index.html'; 
});

// View Event Details
function viewEventDetails(eventId: number): void {
    showAgendaModal(eventId); 
}

// Manage Guests
function manageGuests(eventId: number): void {
    window.location.href = `guest-management.html?eventId=${eventId}`;
}

// Edit Event
function editEvent(eventId: number): void {
    window.location.href = `addevent.html?eventId=${eventId}`;
}

// Function to display the agenda modal
function showAgendaModal(eventId: number): void {
    const modal = document.getElementById('event-agenda-modal')!;
    const closeBtn = modal.querySelector('.close') as HTMLElement;
    const agendaItemsContainer = document.getElementById('agenda-items-container')!;
    
    agendaItemsContainer.innerHTML = '';

    // Fetch agenda data for the selected event
    const eventKey = `event_${eventId}`;
    const event = JSON.parse(localStorage.getItem(eventKey) || '{}') as Event;
    
    if (event && event.agenda && event.agenda.length > 0) {
        // Display existing agenda items
        event.agenda.forEach(item => {
            const agendaItemDiv = document.createElement('div');
            agendaItemDiv.innerHTML = `
                <p><strong>Start Time:</strong> ${item.startTime}</p>
                <p><strong>End Time:</strong> ${item.endTime}</p>
                <p><strong>Description:</strong> ${item.description}</p>
            `;
            agendaItemsContainer.appendChild(agendaItemDiv);
        });
    } else {
        const noAgendaMessage = document.createElement('p');
        noAgendaMessage.textContent = 'No agenda items found. Please add a new agenda.';
        agendaItemsContainer.appendChild(noAgendaMessage);
    }

    modal.style.display = 'block';

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
