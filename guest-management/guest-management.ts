const loggedInUser: string | null = localStorage.getItem('loggedInUser');
const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
console.log(window.location.search);
console.log(urlParams);
const eventId: string | null = urlParams.get('eventId');
console.log(eventId);

if (!loggedInUser || !eventId) {
    alert('Invalid access. Please log in and select an event.');
    window.location.href = '../login/login.html'; 
}

const eventGuestsKey: string = `guests_${loggedInUser}_${eventId}`;

let eventGuests: { name: string; email: string; rsvp: string }[] = JSON.parse(localStorage.getItem(eventGuestsKey) || '[]');

let editingIndex: number = -1;

function renderGuests(): void {
    const guestListBody = document.getElementById('guest-list-body') as HTMLElement;
    guestListBody.innerHTML = ''; 

    eventGuests.forEach((guest, index) => {
        const row: HTMLTableRowElement = document.createElement('tr');
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
        button.addEventListener('click', function(this: HTMLButtonElement) {
            const index = parseInt(this.getAttribute('data-index') || '0');
            editGuest(index);
        });
    });

    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', function(this: HTMLButtonElement) {
            const index = parseInt(this.getAttribute('data-index') || '0');
            removeGuest(index);
        });
    });
}

document.getElementById('add-guest-form')?.addEventListener('submit', function(this: HTMLFormElement, event: Event) {
    event.preventDefault(); 

    const guestName: string = (document.getElementById('guest-name') as HTMLInputElement).value;
    const guestEmail: string = (document.getElementById('guest-email') as HTMLInputElement).value;
    const guestRSVP: string = (document.getElementById('guest-rsvp') as HTMLInputElement).value;

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
    } else {
        eventGuests.push(guestDetails);
    }

    // Save the updated guest list back to local storage
    localStorage.setItem(eventGuestsKey, JSON.stringify(eventGuests));
    this.reset();
    (document.querySelector('.add-button') as HTMLButtonElement).textContent = 'Add Guest'; 
    renderGuests();

    alert('Guest saved successfully!');
});

// Remove a guest from the list
function removeGuest(index: number): void {
    if (confirm('Are you sure you want to remove this guest?')) {
        eventGuests.splice(index, 1);
        localStorage.setItem(eventGuestsKey, JSON.stringify(eventGuests)); 
        renderGuests(); 
    }
}

// Edit a guest's details
function editGuest(index: number): void {
    const guest = eventGuests[index];
    (document.getElementById('guest-name') as HTMLInputElement).value = guest.name;
    (document.getElementById('guest-email') as HTMLInputElement).value = guest.email;
    (document.getElementById('guest-rsvp') as HTMLInputElement).value = guest.rsvp;
    editingIndex = index; 
    (document.querySelector('.add-button') as HTMLButtonElement).textContent = 'Update Guest';
}

// Send invitations function
(document.querySelector('.send-invites-button') as HTMLButtonElement).addEventListener('click', function () {
    alert('Invitations sent successfully!');
});

renderGuests();
