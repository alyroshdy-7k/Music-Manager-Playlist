// Redirect if already logged in
if (localStorage.getItem("token")) {
    window.location.href = "home.html";
}

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const adminChecked = document.getElementById("adminCheck").checked;
    const msg = document.getElementById("message");

    msg.innerText = "";

    if (!email || !password) {
        msg.innerText = "Please fill all fields.";
        return;
    }

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const text = await response.text();
            msg.innerText = text;
            return;
        }

        const data = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("adminMode", adminChecked ? "true" : "false");

        window.location.href = "home.html";

    } catch (error) {
        msg.innerText = "Something went wrong.";
    }
});
