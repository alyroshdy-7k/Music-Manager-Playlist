// Redirect if NOT logged in
const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

// Load all users for admin
async function loadUsers() {
    const container = document.getElementById("usersContainer");
    container.innerHTML = "<p style='color:#c7b7e8;'>Loading users...</p>";

    try {
        const res = await fetch("/auth/all-users", {
            headers: { Authorization: "Bearer " + token }
        });

        if (!res.ok) {
            container.innerHTML = "<p style='color:red;'>Access denied. Admins only.</p>";
            return;
        }

        const data = await res.json();
        const users = data.users;

        container.innerHTML = "";

        users.forEach(user => {
            const div = document.createElement("div");
            div.className = "item-box";

            div.innerHTML = `
                <p><strong>${user.username}</strong> (${user.email})</p>
                <p style="color:#c7b7e8;">Current Role: ${user.role}</p>

                <select id="role-${user.id}" class="input">
                    <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
                    <option value="artist" ${user.role === "artist" ? "selected" : ""}>Artist</option>
                    <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
                </select>

                <button onclick="updateRole(${user.id})">Update Role</button>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        container.innerHTML = "<p style='color:red;'>Error loading users.</p>";
    }
}

// Update user role
async function updateRole(userId) {
    const newRole = document.getElementById(`role-${userId}`).value;

    try {
        const res = await fetch(`/admin/users/${userId}/role`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({ role: newRole })
        });

        const data = await res.json();
        alert(data.message);

        loadUsers(); // Refresh list

    } catch (err) {
        alert("Error updating role.");
    }
}

// Load users on page start
loadUsers();
