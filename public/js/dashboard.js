import { setupAddUserForm } from './addUser.js';
import { setupSearchForm } from './searchUsers.js';
import { loadUsers } from './userTable.js';

let allUsers = [];

window.addEventListener('DOMContentLoaded', async () => {

  allUsers = await loadUsers();


  setupAddUserForm(() => allUsers, async () => {
    allUsers = await loadUsers();
  });

  setupSearchForm(() => allUsers, filtered => {
    allUsers = filtered;
    displayUsers(currentPage);
    renderPagination();
  });
});
