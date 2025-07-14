import { loadUsers } from './userTable.js';

const form = document.getElementById('add-user-form');
const usersPerPage = 10; // ⬅ Matches your pagination limit
let currentPage = 1;     // Optional: update if dynamically tracking page

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const age = parseInt(form.age.value.trim());
    const city = form.city.value.trim();

    // 🎯 Validations
    // 🔍 Regex patterns
    const namePattern = /^[A-Z][a-zA-Z\s]{1,49}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const phonePattern = /^\+91[\s\-]?\d{10}$|^\+\d{1,3}[\s\-]?\d{7,14}$/;

    // 🔐 Validation checks
    if (!namePattern.test(name)) {
        alert("Name must start with a capital letter and contain only letters/spaces");
        return;
    }
    if (!emailPattern.test(email)) {
        alert("Email must be in the format: name@gmail.com");
        return;
    }
    if (!phonePattern.test(phone)) {
        alert("Phone should be in format +91XXXXXXXXXX or +<country_code> XXXXX...");
        return;
    }
    if (isNaN(age) || age < 1 || age > 120) {
        alert("Age must be between 1 and 120");
        return;
    }
    try {
        const res = await fetch('/add-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Name: name, Email: email, Phone: phone, Age: age, City: city })
        });

        if (!res.ok) {
            alert("User could not be added");
            return;
        }

        // ✅ Refresh first page of users after successful add
        form.reset();
        currentPage = 1; // or keep track dynamically
        await loadUsers(currentPage); // respects OFFSET & LIMIT in backend
    } catch (err) {
        console.error("Add user failed:", err);
        alert("Something went wrong. Please try again.");
    }
});