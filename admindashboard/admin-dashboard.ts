import { User, Category, BackupData, BackupMetadata } from "../models/Model";

const userListBody = document.getElementById('user-list-body') as HTMLTableSectionElement;
const addUserForm = document.getElementById('add-user-form') as HTMLFormElement;
const submitButton = document.querySelector('.submit-button') as HTMLButtonElement;
const signupError = document.getElementById('signup-error') as HTMLParagraphElement;
const backupButton = document.getElementById('backup-button') as HTMLButtonElement;
const restoreButton = document.getElementById('restore-button') as HTMLButtonElement;
const backupHistoryContainer = document.getElementById('backup-history') as HTMLDivElement;
const addUserButton = document.getElementById('adduser') as HTMLButtonElement;
const formContainer = document.querySelector('.form-container') as HTMLDivElement;
const viewBackupHistoryButton = document.getElementById('view-backup-history-button') as HTMLButtonElement;

let editingEmail: string | null = null;

function displayUsers(): void {
    if (!userListBody) return;
    userListBody.innerHTML = '';

    const userKeys = Object.keys(localStorage).filter(key =>
        key.includes('@') && !key.includes('events') && !key.includes('guests') && key !== 'loggedInUser'
    );

    userKeys.forEach(key => {
        const userData = localStorage.getItem(key);
        if (userData) {
            const user: User = JSON.parse(userData);

            if (user.role === 'admin' && (!user.username || user.username.trim() === '')) {
                user.username = 'admin';
            }
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role || 'user'}</td>
                <td>
                    <button class="edit-button" data-email="${user.email}">Edit</button>
                    <button class="delete-button" data-email="${user.email}">Delete</button>
                </td>
            `;
            userListBody.appendChild(row);
        }
    });
}

displayUsers();

userListBody.addEventListener('click', function(event: Event) {
    const target = event.target as HTMLElement;
    const email = target.getAttribute('data-email');

    if (email) {
        if (target.classList.contains('edit-button')) {
            editUser(email);
        } else if (target.classList.contains('delete-button') && confirm('Are you sure you want to delete this user?')) {
            deleteUser(email);
        }
    }
});

function editUser(email: string): void {
    const userData = localStorage.getItem(email);
    if (userData) {
        const user: User = JSON.parse(userData);
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const emailInput = document.getElementById('email') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
        const roleSelect = document.getElementById('role') as HTMLSelectElement;

        if (usernameInput && emailInput && passwordInput && confirmPasswordInput && roleSelect) {
            usernameInput.value = user.username;
            emailInput.value = user.email;
            passwordInput.value = user.password;
            confirmPasswordInput.value = user.password;
            roleSelect.value = user.role || 'user';
            editingEmail = email;

            submitButton.textContent = 'Update User';
            formContainer.style.display = 'block';
        } else {
            console.error('One or more form elements are missing.');
        }
    }
}

function deleteUser(email: string): void {
    const userData = localStorage.getItem(email);
    if (userData) {
        const user: User = JSON.parse(userData);
        if (user.role === 'admin') {
            alert('Cannot delete admin user.');
            return;
        }
    }
    localStorage.removeItem(email);
    deleteUserRelatedData(email);
    displayUsers();
}

addUserButton.addEventListener('click', () => {
    formContainer.style.display = 'block';
});

addUserForm.addEventListener('submit', function(event: Event) {
    event.preventDefault();

    const username = (document.getElementById('username') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value;
    const role = (document.getElementById('role') as HTMLSelectElement).value;

    if (password !== confirmPassword) {
        signupError.textContent = 'Passwords do not match!';
        return;
    }

    if (editingEmail) {
        if (localStorage.getItem(email) && email !== editingEmail) {
            signupError.textContent = 'An account with this email already exists!';
            return;
        }

        localStorage.removeItem(editingEmail);
    } else if (localStorage.getItem(email)) {
        signupError.textContent = 'An account with this email already exists!';
        return;
    }

    const user: User = { username, email, password, role };
    localStorage.setItem(email, JSON.stringify(user));
    signupError.textContent = '';
    addUserForm.reset();
    displayUsers();
    formContainer.style.display = 'none';
    submitButton.textContent = 'Add User';
    editingEmail = null;
});

function deleteUserRelatedData(email: string): void {
    const keysToDelete = Object.keys(localStorage).filter(key =>
        key.startsWith(`events_${email}`) || key.startsWith(`guests_${email}`) || key.startsWith(`agenda_${email}`)
    );

    keysToDelete.forEach(key => localStorage.removeItem(key));
}

function getCategories(): Category[] {
    const categoriesData = localStorage.getItem('categories');
    return categoriesData ? JSON.parse(categoriesData) as Category[] : [];
}

function getLoggedInUserName(): string {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (loggedInUserEmail) {
        const userData = localStorage.getItem(loggedInUserEmail);
        if (userData) {
            const user: User = JSON.parse(userData);
            return user.username || 'admin'; 
        }
    }
    return 'admin'; 
}

function backupData(): void {
    const userName = getLoggedInUserName(); 

    const data: BackupData = {
        users: {},
        events: {},
        guests: {},
        agendas: {},
        categories: getCategories()
    };

    Object.keys(localStorage).forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            if (key.includes('@')) {
                data.users[key] = JSON.parse(value);
            } else if (key.startsWith('events_')) {
                data.events[key] = JSON.parse(value);
            } else if (key.startsWith('guests_')) {
                data.guests[key] = JSON.parse(value);
            } else if (key.startsWith('agenda_')) {
                data.agendas[key] = JSON.parse(value);
            }
        }
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    updateBackupHistory(`backup_${new Date().toISOString()}.json`, userName);
}

backupButton.addEventListener('click', backupData);

function displayBackupHistory(): void {
    const backupHistory = JSON.parse(localStorage.getItem('backupHistory') || '[]') as BackupMetadata[];
    backupHistoryContainer.innerHTML = '';

    backupHistory.forEach(metadata => {
        const item = document.createElement('div');
        item.innerHTML = `
            <p><strong>Date:</strong> ${metadata.date}</p>
            <p><strong>File:</strong> ${metadata.fileName}</p>
            <p><strong>Backed up by:</strong> ${metadata.userName}</p> 
        `;
        backupHistoryContainer.appendChild(item);
    });
}

function addBackupMetadata(fileName: string, userName: string): void {
    const backupHistory = JSON.parse(localStorage.getItem('backupHistory') || '[]') as BackupMetadata[];
    backupHistory.push({ 
        date: new Date().toLocaleString(), 
        fileName,
        userName 
    });
    localStorage.setItem('backupHistory', JSON.stringify(backupHistory));
}

function updateBackupHistory(fileName: string, userName: string): void {
    addBackupMetadata(fileName, userName);
    displayBackupHistory();
}

restoreButton.addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.addEventListener('change', function(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const result = e.target?.result as string;
                const data: BackupData = JSON.parse(result);

                Object.keys(localStorage).forEach(key => localStorage.removeItem(key));
                Object.keys(data.users).forEach(key => localStorage.setItem(key, JSON.stringify(data.users[key])));
                Object.keys(data.events).forEach(key => localStorage.setItem(key, JSON.stringify(data.events[key])));
                Object.keys(data.guests).forEach(key => localStorage.setItem(key, JSON.stringify(data.guests[key])));
                Object.keys(data.agendas).forEach(key => localStorage.setItem(key, JSON.stringify(data.agendas[key])));
                localStorage.setItem('categories', JSON.stringify(data.categories));

                displayUsers();
                displayBackupHistory();
            };
            reader.readAsText(file);
        }
    });

    input.click();
});

// Toggle backup history visibility
function toggleBackupHistoryVisibility(): void {
    const isVisible = backupHistoryContainer.style.display === 'block';
    backupHistoryContainer.style.display = isVisible ? 'none' : 'block';
}

// Add event listener for the "View Backup History" button
viewBackupHistoryButton.addEventListener('click', toggleBackupHistoryVisibility);

// Add event listener for clicks outside of the backup history container
document.addEventListener('click', function(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!backupHistoryContainer.contains(target) && !viewBackupHistoryButton.contains(target)) {
        backupHistoryContainer.style.display = 'none';
    }
});
