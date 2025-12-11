async function signup() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("message");

    msg.innerText = "";

    if (!username || !email || !password) {
        msg.innerText = "Please fill all fields.";
        return;
    }

    try {
        const res = await fetch("/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            msg.innerText = data.error || "Signup failed.";
            return;
        }

        msg.innerText = data.message;

        // After signup, redirect to login page
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

    } catch (err) {
        msg.innerText = "Something went wrong.";
    }
}

