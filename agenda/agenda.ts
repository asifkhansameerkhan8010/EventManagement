function showAgendaModal(eventId: number): void {
    const modal = document.getElementById('event-agenda-modal') as HTMLElement;
    const closeBtn = document.querySelector('#event-agenda-modal .close') as HTMLElement;
    const agendaItemsContainer = document.getElementById('agenda-items-container') as HTMLElement;
    const agendaForm = document.getElementById('agenda-form') as HTMLFormElement;
    const addAgendaButton = document.getElementById('add-agenda-item') as HTMLButtonElement;

    modal.style.display = 'block';

    // Retrieve the logged-in user from ls
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert('User not logged in');
        return;
    }

    // Load existing agenda items from local storage
    const eventAgendaKey = `agenda_${loggedInUser}_${eventId}`;
    let agendaItems: { startTime: string, endTime: string, description: string }[] = JSON.parse(localStorage.getItem(eventAgendaKey) || '[]');

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
        const startTime = (document.getElementById('agenda-start-time') as HTMLInputElement).value;
        const endTime = (document.getElementById('agenda-end-time') as HTMLInputElement).value;
        const description = (document.getElementById('agenda-description') as HTMLInputElement).value;

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
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Close the modal when the close button is clicked
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close the modal if clicked outside of it
    window.addEventListener('click', function (event: MouseEvent) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// `showAgendaModal` globally for the event cards
(window as any).showAgendaModal = showAgendaModal;