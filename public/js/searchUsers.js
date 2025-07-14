import { getAllUsers, displayUsers } from './userTable.js';
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = input.value.trim().toLowerCase();
    if (!query) {
        alert("Please enter a search term");
        return;
    }

    const allUsers = getAllUsers();
    if (!Array.isArray(allUsers)) {
        console.error("User data is not loaded yet");
        return;
    }

    const filteredUsers = allUsers.filter(user =>
        user.Name.toLowerCase().includes(query) ||
        user.Email.toLowerCase().includes(query) ||
        user.City.toLowerCase().includes(query)
    );

    // Render search result
    const tbody = document.getElementById('user-table-body');
    tbody.innerHTML = '';

    if (filteredUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No matching users found</td></tr>`;
        return;
    }

    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${user.Id}</td>
      <td>${user.Name}</td>
      <td>${user.Email}</td>
      <td>${user.Phone}</td>
      <td>${user.Age}</td>
      <td>${user.City}</td>
      <td>
        <button onclick="window.enableEditMode(this.parentElement.parentElement, ${JSON.stringify(user).replace(/'/g, "\\'")})">Edit</button>
        <button class="delete-btn" onclick="window.deleteUser(${user.Id})">Delete</button>
      </td>
    `;
        tbody.appendChild(row);
    });
});
