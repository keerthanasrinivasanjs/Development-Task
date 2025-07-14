let allUsers = [];
let currentPage = 1;
const usersPerPage = 10;

export async function loadUsers(page = 1) {
    const res = await fetch(`/users?page=${page}&limit=${usersPerPage}`);
    if (!res.ok) {
        console.error("Failed to fetch users:", res.statusText);
        return;
    }

    const data = await res.json();
    allUsers = data;
    displayUsers();
    await renderPagination();
}

export function displayUsers() {
    const tbody = document.getElementById('user-table-body');
    tbody.innerHTML = '';

    if (!Array.isArray(allUsers) || allUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No users found</td></tr>`;
        return;
    }

    allUsers.forEach(user => {
        const row = document.createElement('tr');
        row.enableEdit = function () {
            this.innerHTML = `
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
        };
        tbody.appendChild(row);
    });
}

async function getTotalPages(limit) {
    const res = await fetch('/user-count');
    const data = await res.json(); // { total: 43 }
    return Math.ceil(data.total / limit);
}
export function getAllUsers() {
    return allUsers || [];
}
export async function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = await getTotalPages(usersPerPage);

    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = async () => {
        if (currentPage > 1) {
            currentPage--;
            await loadUsers(currentPage);
        }
    };
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        if (i === currentPage) pageBtn.style.background = '#03a9f4';
        pageBtn.onclick = async () => {
            currentPage = i;
            await loadUsers(currentPage);
        };
        pagination.appendChild(pageBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = async () => {
        if (currentPage < totalPages) {
            currentPage++;
            await loadUsers(currentPage);
        }
    };
    pagination.appendChild(nextBtn);
}

window.enableEditMode = function (row, user) {
    row.innerHTML = `
    <td>${user.Id}</td>
    <td><input value="${user.Name}" id="edit-name-${user.Id}"></td>
    <td><input value="${user.Email}" id="edit-email-${user.Id}"></td>
    <td><input value="${user.Phone}" id="edit-phone-${user.Id}"></td>
    <td><input value="${user.Age}" id="edit-age-${user.Id}"></td>
    <td><input value="${user.City}" id="edit-city-${user.Id}"></td>
    <td>
      <button onclick="window.saveUser(${user.Id})">Save</button>
      <button onclick="window.loadUsers(currentPage)">Cancel</button>
    </td>
  `;
};

window.saveUser = async function (id) {
    const name = document.getElementById(`edit-name-${id}`).value.trim();
    const email = document.getElementById(`edit-email-${id}`).value.trim();
    const phone = document.getElementById(`edit-phone-${id}`).value.trim();
    const age = parseInt(document.getElementById(`edit-age-${id}`).value.trim());
    const city = document.getElementById(`edit-city-${id}`).value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+\d{1,3}\s?\d{10}$/;
    const namePattern = /^[A-Za-z\s]{2,50}$/;

    if (!namePattern.test(name)) return alert("Invalid name");
    if (!emailPattern.test(email)) return alert("Invalid email");
    if (!phonePattern.test(phone)) return alert("Invalid phone");
    if (isNaN(age) || age < 1 || age > 120) return alert("Invalid age");

    const res = await fetch(`/update-user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name: name, Email: email, Phone: phone, Age: age, City: city })
    });

    if (res.ok) {
        await loadUsers(currentPage);
    } else {
        alert("Failed to update user");
    }
};

window.deleteUser = async function (id) {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const res = await fetch(`/users/${id}`, { method: 'DELETE' });

    if (res.ok) {
        await loadUsers(currentPage);
    } else {
        alert("Failed to delete user");
    }
};

window.loadUsers = loadUsers;