//interface for user data
import {User} from "../models/Model"

const signupForm = document.getElementById('signup-form') as HTMLFormElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;
const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
const signupError = document.getElementById('signup-error') as HTMLParagraphElement;

signupForm.addEventListener('submit', function (event: Event) {
    event.preventDefault(); 

    const username: string = usernameInput.value;
    const email: string = emailInput.value;
    const password: string = passwordInput.value;
    const confirmPassword: string = confirmPasswordInput.value;

    // Check if passwords match
    if (password !== confirmPassword) {
        signupError.textContent = 'Passwords do not match!';
        return;
    }

    if (localStorage.getItem(email)) {
        signupError.textContent = 'An account with this email already exists!';
        return;
    }

    // Save new user data to local storage
    const user: User = { username, email, password };
    localStorage.setItem(email, JSON.stringify(user)); // email as a unique key 

    signupError.textContent = '';
    signupForm.reset();

    alert('Sign up successful! You can now log in.');
    window.location.href = '../login/login.html'; 
});
