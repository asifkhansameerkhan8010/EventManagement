import {UserCredentials} from "../models/Model"

const adminCredentials: UserCredentials = {
    email: 'admin@gmail.com',
    password: '1',
    role: 'admin'
};

// admin credentials are set in local storage
if (!localStorage.getItem(adminCredentials.email)) {
    localStorage.setItem(adminCredentials.email, JSON.stringify(adminCredentials));
}

const loginForm = document.getElementById('login-form') as HTMLFormElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;
const loginError = document.getElementById('login-error') as HTMLParagraphElement;

loginForm.addEventListener('submit', function (event: Event) {
    event.preventDefault(); 

    const email: string = emailInput.value;
    const password: string = passwordInput.value;

    // user data from ls
    const storedUser: string | null = localStorage.getItem(email);

    // Check if user exists
    if (!storedUser) {
        loginError.textContent = 'User does not exist! Please sign up first.';
        return;
    }

    const user: UserCredentials = JSON.parse(storedUser);

    // Validate password
    if (user.password !== password) {
        loginError.textContent = 'Incorrect password. Please try again.';
        return;
    }

    localStorage.setItem('loggedInUser', email); // Save the logged-in user's email to identify current user

    loginError.textContent = '';
    loginForm.reset();

    if (user.role == "admin") {
        window.location.href = '../admindashboard/admin-dashboard.html';
    } else {
        window.location.href = '../dashboard/dashboard.html';
    }
});
