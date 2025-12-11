// Redirect if not logged in
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
}

// Fetch user info
async function loadUser() {
    try {
        const res = await fetch("/auth/me", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        if (!res.ok) {
            document.getElementById("welcomeText").innerText = "Welcome!";
            return;
        }

        const data = await res.json();
        const username = data.user.username;

        document.getElementById("welcomeText").innerText =
            `Hey ${username}, Enjoy your music!`;

    } catch (err) {
        document.getElementById("welcomeText").innerText = "Welcome!";
    }
}

// Show admin link if admin mode is enabled
const adminMode = localStorage.getItem("adminMode");
if (adminMode === "true") {
    document.getElementById("adminLink").style.display = "block";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminMode");
    window.location.href = "login.html";
});

// Load profile info on page start
loadUser();
