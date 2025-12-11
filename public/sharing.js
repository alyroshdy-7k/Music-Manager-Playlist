// redirect if not logged in
const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

// logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

// load user's playlists
async function loadMyPlaylists() {
    const dropdown = document.getElementById("playlistDropdown");

    try {
        const res = await fetch("/playlists", {
            headers: { Authorization: "Bearer " + token }
        });

        const data = await res.json();
        const playlists = data.data;

        playlists.forEach(pl => {
            const option = document.createElement("option");
            option.value = pl.id;
            option.textContent = pl.name;
            dropdown.appendChild(option);
        });

    } catch (err) {
        console.log(err);
    }
}

// load playlists shared with me
async function loadSharedPlaylists() {
    const container = document.getElementById("sharedContainer");
    container.innerHTML = "";

    try {
        const res = await fetch("/share/shared", {
            headers: { Authorization: "Bearer " + token }
        });

        const data = await res.json();
        const shared = data.playlists;

        if (!shared || shared.length === 0) {
            container.innerHTML = "<p style='color:#c7b7e8;'>Nothing shared with you yet.</p>";
            return;
        }

        shared.forEach(item => {
            const box = document.createElement("div");
            box.className = "item-box";

            box.innerHTML = `
                <p><strong>${item.name}</strong></p>
                <p style="color:#c7b7e8;">Access: ${item.access_level}</p>
            `;

            container.appendChild(box);
        });

    } catch (err) {
        container.innerHTML = "<p>Error loading shared playlists.</p>";
    }
}

// share playlist
document.getElementById("shareBtn").addEventListener("click", async () => {
    const playlist_id = document.getElementById("playlistDropdown").value;
    const user_id_receiver = document.getElementById("receiverIdInput").value;
    const access_level = document.getElementById("accessLevelInput").value;
    const msg = document.getElementById("message");

    msg.innerText = "";

    if (!playlist_id || !user_id_receiver) {
        msg.innerText = "Please fill all fields.";
        return;
    }

    try {
        const res = await fetch("/share/share", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                playlist_id,
                user_id_receiver,
                access_level
            })
        });

        const data = await res.json();   // <-- FIX
        msg.innerText = data.message;    // <-- now only shows the actual message

        loadSharedPlaylists(); // refresh shared section

    } catch (err) {
        msg.innerText = "Could not share playlist.";
    }
});

// initial load
loadMyPlaylists();
loadSharedPlaylists();
