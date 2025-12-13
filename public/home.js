// Redirect if not logged in
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
}

async function loadUser() {
    try {
        const res = await fetch("http://localhost:3001/auth/me", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        if (!res.ok) {
            document.getElementById("welcomeText").innerText = "Welcome!";
            return;
        }

        const data = await res.json();

        // Welcome text
        document.getElementById("welcomeText").innerText =
            `Hey ${data.user.username}, enjoy your music!`;

        // SHOW PROFILE (GET ME)
        document.getElementById("profileUsername").innerText = data.user.username;
        document.getElementById("profileEmail").innerText = data.user.email;
        document.getElementById("profileRole").innerText = data.user.role;
        document.getElementById("profileBox").style.display = "block";

        // Admin link based on REAL role from backend
        if (data.user.role === "admin") {
            document.getElementById("adminLink").style.display = "block";
        }

    } catch (err) {
        document.getElementById("welcomeText").innerText = "Welcome!";
    }
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

// Load profile info on page start
loadUser();
