// Redirect if not logged in
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
}

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

// Create playlist
document.getElementById("createPlaylistBtn").addEventListener("click", async () => {
    const name = document.getElementById("playlistNameInput").value;
    const msg = document.getElementById("message");

    msg.innerText = "";

    if (!name) {
        msg.innerText = "Please enter a playlist name.";
        return;
    }

    try {
        const response = await fetch("/playlists", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ name })
        });

        const result = await response.json();

        msg.innerText = result.message;
        loadPlaylists(); // refresh list
    } catch (error) {
        msg.innerText = "Something went wrong.";
    }
});

// Load playlists
async function loadPlaylists() {
    const container = document.getElementById("playlistsContainer");
    container.innerHTML = "";

    try {
        const response = await fetch("/playlists", {
            headers: { "Authorization": "Bearer " + token }
        });

        // FIX STARTS HERE
        const result = await response.json();  // server sends an object
        const playlists = result.data;         // extract the array
        // FIX ENDS HERE

        playlists.forEach(pl => {
            const div = document.createElement("div");
            div.className = "playlist-item";

            div.innerHTML = `
                <p><strong>${pl.name}</strong></p>
                <button onclick="viewSongs(${pl.id})">View Songs</button>
                <button onclick="renamePlaylist(${pl.id})">Rename</button>
                <button onclick="deletePlaylist(${pl.id})">Delete</button>
                <hr>
            `;

            container.appendChild(div);
        });

    } catch (error) {
        container.innerText = "Could not load playlists.";
    }
}

loadPlaylists();


// View songs inside playlist
function viewSongs(id) {
    window.location.href = "songs.html?playlistId=" + id;
}

// Rename playlist
async function renamePlaylist(id) {
    const newName = prompt("Enter new playlist name:");

    if (!newName) return;

    await fetch(`/playlists/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name: newName })
    });

    loadPlaylists();
}

// Delete playlist
async function deletePlaylist(id) {
    if (!confirm("Are you sure?")) return;

    const response = await fetch(`/playlists/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    const result = await response.json();
    alert(result.message); // or show it on page

    loadPlaylists();
}
