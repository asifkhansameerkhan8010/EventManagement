import {Category} from "../models/Model"

document.addEventListener('DOMContentLoaded', function () {
    const categoryListBody = document.getElementById('category-list-body') as HTMLTableSectionElement;
    const addCategoryForm = document.getElementById('add-category-form') as HTMLFormElement;
    const categoryError = document.getElementById('category-error') as HTMLDivElement;
    const categoryNameInput = document.getElementById('category-name') as HTMLInputElement;
    
    let editingCategoryIndex: number | null = null; 

    // retrieve categories from ls
    function getCategories(): Category[] {
        const categories = localStorage.getItem('categories_list');
        return categories ? JSON.parse(categories) as Category[] : [];
    }

    // save cate back to ls
    function saveCategories(categories: Category[]): void {
        localStorage.setItem('categories_list', JSON.stringify(categories));
    }

    // cate in the admin panel
    function displayCategories(): void {
        const categories = getCategories();
        categoryListBody.innerHTML = ''; 

        categories.forEach((category, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name}</td>
                <td>
                    <button class="edit-button" data-index="${index}">Edit</button>
                    <button class="delete-button" data-index="${index}">Delete</button>
                </td>
            `;
            categoryListBody.appendChild(row);
        });
    }
    displayCategories();

    // Edit and Delete
    categoryListBody.addEventListener('click', function (event) {
        const button = event.target as HTMLElement;
        const index = button.getAttribute('data-index');

        if (!index) return;

        const categories = getCategories();

        if (button.classList.contains('edit-button')) {
            //edit action
            const category = categories[+index];
            if (category) {
                categoryNameInput.value = category.name; 
                editingCategoryIndex = +index; 
            }
        } else if (button.classList.contains('delete-button')) {
            //delete action
            if (confirm('Are you sure you want to delete this category?')) {
                categories.splice(+index, 1); 
                saveCategories(categories); 
                displayCategories(); 
                updateEventCategoryDropdown(); 
            }
        }
    });

    // adding or updating categories
    addCategoryForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const categoryName = categoryNameInput.value.trim();
        if (!categoryName) {
            categoryError.textContent = 'Category name cannot be empty!';
            return;
        }

        const categories = getCategories();

        // duplicate cate checking
        const duplicateCategory = categories.find((category, index) => category.name.toLowerCase() === categoryName.toLowerCase() && index !== editingCategoryIndex);
        if (duplicateCategory) {
            categoryError.textContent = 'Category name already exists!';
            return;
        }

        if (editingCategoryIndex !== null) {
            categories[editingCategoryIndex].name = categoryName;
            editingCategoryIndex = null;
        } else {
            categories.push({ name: categoryName });
        }

        saveCategories(categories); 
        categoryError.textContent = ''; 
        addCategoryForm.reset(); 
        displayCategories(); 
        updateEventCategoryDropdown();
    });

    // category dropdown USERSIDE 
    function updateEventCategoryDropdown(): void {
        const eventCategorySelect = document.getElementById('event-category') as HTMLSelectElement | null;
        if (!eventCategorySelect) return; 

        eventCategorySelect.innerHTML = ''; 

        const categories = getCategories(); 
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name.toLowerCase();
            option.textContent = category.name;
            eventCategorySelect.appendChild(option); 
        });
    }
    updateEventCategoryDropdown();
});
