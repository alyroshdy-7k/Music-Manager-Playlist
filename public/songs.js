// Redirect if the user isn't logged in
const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

// Simple logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

// Get playlistId from URL (when user clicked "View Songs")
const params = new URLSearchParams(window.location.search);
const playlistId = params.get("playlistId");

// Load all available catalog songs
async function loadAvailableSongs() {
    const container = document.getElementById("availableSongsContainer");
    container.innerHTML = "";

    try {
        const response = await fetch("/songs/available", {
            headers: { Authorization: "Bearer " + token }
        });

        const data = await response.json();
        const songs = data.songs;

        if (!songs || songs.length === 0) {
            container.innerText = "No available songs.";
            return;
        }

        const playlistsRes = await fetch("/playlists", {
            headers: { Authorization: "Bearer " + token }
        });
        const playlistsData = await playlistsRes.json();
        const playlists = playlistsData.data;

        songs.forEach(song => {
            const div = document.createElement("div");

            let dropdown = `<select id="dropdown-${song.id}">`;
            playlists.forEach(pl => {
                dropdown += `<option value="${pl.id}">${pl.name}</option>`;
            });
            dropdown += `</select>`;

            div.innerHTML = `
                <p><strong>${song.title}</strong> - ${song.artist}</p>
                ${dropdown}
                <button onclick="addSong(${song.id})">Add to Playlist</button>
                <button onclick="addFavourite(${song.id})">Favourite</button>
                <hr>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        container.innerText = "Could not load available songs.";
        console.error(err);
    }
}

// Add song to playlist
async function addSong(songId) {
    const playlistSelect = document.getElementById(`dropdown-${songId}`);
    const playlistId = playlistSelect.value;

    try {
        const res = await fetch("/songs/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({ songId, playlistId })
        });

        alert(await res.text());

        if (params.get("playlistId")) loadPlaylistSongs();

    } catch (err) {
        alert("Could not add song.");
    }
}

// Add favourite songs
async function addFavourite(songId) {
    try {
        const res = await fetch("/favourites/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({ song_id: songId })
        });

        const data = await res.json();
        alert(data.message || "Added to favourites!");
    } catch (err) {
        alert("Could not add to favourites.");
    }
}

// Load songs inside playlist
async function loadPlaylistSongs() {
    if (!playlistId) return;

    const container = document.getElementById("playlistSongsContainer");
    container.innerHTML = "";

    try {
        const res = await fetch(`/songs/all?playlistId=${playlistId}`, {
            headers: { Authorization: "Bearer " + token }
        });

        const data = await res.json();
        const songs = data.songs;

        if (!songs || songs.length === 0) {
            container.innerText = "No songs in this playlist.";
            return;
        }

        songs.forEach(song => {
            const div = document.createElement("div");
            div.innerHTML = `
                <p><strong>${song.title}</strong> - ${song.artist}</p>
                <hr>
            `;
            container.appendChild(div);
        });

    } catch (err) {
        container.innerText = "Could not load playlist songs.";
    }
}

loadAvailableSongs();
loadPlaylistSongs();
