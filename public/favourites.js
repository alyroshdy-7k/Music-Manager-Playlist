// redirect if not logged in
const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

// logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

// load favourites from backend
async function loadFavourites() {
    const container = document.getElementById("favouritesContainer");
    container.innerHTML = "";

    try {
        const response = await fetch("/favourites/all", {
            headers: { Authorization: "Bearer " + token }
        });

        const data = await response.json();

        if (!data.songs || data.songs.length === 0) {
            container.innerHTML = "<p style='color:#c7b7e8;'>No favourites yet.</p>";
            return;
        }

        data.songs.forEach(song => {
            const box = document.createElement("div");
            box.className = "item-box";

            box.innerHTML = `
                <p><strong>${song.title}</strong> - ${song.artist}</p>
                <button class="btn" style="background:#cc4b4b;" onclick="removeFavourite(${song.id})">
                    Remove
                </button>
            `;

            container.appendChild(box);
        });

    } catch (err) {
        container.innerHTML = "<p>Could not load favourites.</p>";
    }
}

// remove a favourite
async function removeFavourite(songId) {
    try {
        const res = await fetch(`/favourites/remove/${songId}`, {
            method: "DELETE",
            headers: { Authorization: "Bearer " + token }
        });

        alert("Removed from favourites");
        loadFavourites();

    } catch (err) {
        alert("Could not remove favourite");
    }
}

loadFavourites();
