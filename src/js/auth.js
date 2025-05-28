async function loginAdmin(e) {
    e.preventDefault();

    let usernameInput = document.getElementById("username");
    let passwordInput = document.getElementById("password");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const errorMsg = document.getElementById("error-msg");

    if (!username && !password) {
        errorMsg.textContent = "Fyll i både användarnamn och lösenord";
        return;
    } else if (!username) {
        errorMsg.textContent = "Fyll i användarnamn";
        return;
    } else if (!password) {
        errorMsg.textContent = "Fyll i lösenord";
        return;
    }

    // Töm tidigare felmeddelande
    errorMsg.textContent = "";

    let user = {
        username: usernameInput.value,
        password: passwordInput.value
    }

    try {
        const resp = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        const data = await resp.json();
        console.log("Login response:", data);

        if (resp.ok) {
            const token = data.response.token;
            localStorage.setItem("token", token);
            console.log("Token sparad i localstorage:", token);
            
        } else {
            errorMsg.textContent = data.message || "Felaktigt användarnamn eller lösenord";
        }
    } catch (error) {
        errorMsg.textContent = "Något gick fel. Försök igen.";
        console.error(error);
    }

}

// Koppla formuläret till funktionen
const form = document.getElementById("login-form");
form.addEventListener("submit", loginAdmin);