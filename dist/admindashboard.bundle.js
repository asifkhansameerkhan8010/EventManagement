/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!*******************************************!*\
  !*** ./admindashboard/admin-dashboard.ts ***!
  \*******************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const userListBody = document.getElementById('user-list-body');
const addUserForm = document.getElementById('add-user-form');
const submitButton = document.querySelector('.submit-button');
const signupError = document.getElementById('signup-error');
const backupButton = document.getElementById('backup-button');
const restoreButton = document.getElementById('restore-button');
const backupHistoryContainer = document.getElementById('backup-history');
const addUserButton = document.getElementById('adduser');
const formContainer = document.querySelector('.form-container');
const viewBackupHistoryButton = document.getElementById('view-backup-history-button');
let editingEmail = null;
function displayUsers() {
    if (!userListBody)
        return;
    userListBody.innerHTML = '';
    const userKeys = Object.keys(localStorage).filter(key => key.includes('@') && !key.includes('events') && !key.includes('guests') && key !== 'loggedInUser');
    userKeys.forEach(key => {
        const userData = localStorage.getItem(key);
        if (userData) {
            const user = JSON.parse(userData);
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
userListBody.addEventListener('click', function (event) {
    const target = event.target;
    const email = target.getAttribute('data-email');
    if (email) {
        if (target.classList.contains('edit-button')) {
            editUser(email);
        }
        else if (target.classList.contains('delete-button') && confirm('Are you sure you want to delete this user?')) {
            deleteUser(email);
        }
    }
});
function editUser(email) {
    const userData = localStorage.getItem(email);
    if (userData) {
        const user = JSON.parse(userData);
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const roleSelect = document.getElementById('role');
        if (usernameInput && emailInput && passwordInput && confirmPasswordInput && roleSelect) {
            usernameInput.value = user.username;
            emailInput.value = user.email;
            passwordInput.value = user.password;
            confirmPasswordInput.value = user.password;
            roleSelect.value = user.role || 'user';
            editingEmail = email;
            submitButton.textContent = 'Update User';
            formContainer.style.display = 'block';
        }
        else {
            console.error('One or more form elements are missing.');
        }
    }
}
function deleteUser(email) {
    const userData = localStorage.getItem(email);
    if (userData) {
        const user = JSON.parse(userData);
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
addUserForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = document.getElementById('role').value;
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
    }
    else if (localStorage.getItem(email)) {
        signupError.textContent = 'An account with this email already exists!';
        return;
    }
    const user = { username, email, password, role };
    localStorage.setItem(email, JSON.stringify(user));
    signupError.textContent = '';
    addUserForm.reset();
    displayUsers();
    formContainer.style.display = 'none';
    submitButton.textContent = 'Add User';
    editingEmail = null;
});
function deleteUserRelatedData(email) {
    const keysToDelete = Object.keys(localStorage).filter(key => key.startsWith(`events_${email}`) || key.startsWith(`guests_${email}`) || key.startsWith(`agenda_${email}`));
    keysToDelete.forEach(key => localStorage.removeItem(key));
}
function getCategories() {
    const categoriesData = localStorage.getItem('categories');
    return categoriesData ? JSON.parse(categoriesData) : [];
}
function getLoggedInUserName() {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (loggedInUserEmail) {
        const userData = localStorage.getItem(loggedInUserEmail);
        if (userData) {
            const user = JSON.parse(userData);
            return user.username || 'admin';
        }
    }
    return 'admin';
}
function backupData() {
    const userName = getLoggedInUserName();
    const data = {
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
            }
            else if (key.startsWith('events_')) {
                data.events[key] = JSON.parse(value);
            }
            else if (key.startsWith('guests_')) {
                data.guests[key] = JSON.parse(value);
            }
            else if (key.startsWith('agenda_')) {
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
function displayBackupHistory() {
    const backupHistory = JSON.parse(localStorage.getItem('backupHistory') || '[]');
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
function addBackupMetadata(fileName, userName) {
    const backupHistory = JSON.parse(localStorage.getItem('backupHistory') || '[]');
    backupHistory.push({
        date: new Date().toLocaleString(),
        fileName,
        userName
    });
    localStorage.setItem('backupHistory', JSON.stringify(backupHistory));
}
function updateBackupHistory(fileName, userName) {
    addBackupMetadata(fileName, userName);
    displayBackupHistory();
}
restoreButton.addEventListener('click', function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', function (event) {
        var _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                const result = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                const data = JSON.parse(result);
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
function toggleBackupHistoryVisibility() {
    const isVisible = backupHistoryContainer.style.display === 'block';
    backupHistoryContainer.style.display = isVisible ? 'none' : 'block';
}
// Add event listener for the "View Backup History" button
viewBackupHistoryButton.addEventListener('click', toggleBackupHistoryVisibility);
// Add event listener for clicks outside of the backup history container
document.addEventListener('click', function (event) {
    const target = event.target;
    if (!backupHistoryContainer.contains(target) && !viewBackupHistoryButton.contains(target)) {
        backupHistoryContainer.style.display = 'none';
    }
});

})();

/******/ })()
;
//# sourceMappingURL=admindashboard.bundle.js.map