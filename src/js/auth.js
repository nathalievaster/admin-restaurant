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
                "content-type": "application/json"
            },
            body: JSON.stringify(user)
        })

        if (resp.ok) {
            const data = await resp.json();
            console.log(data)
        } else {
            throw error;
        }
    } catch (error) {
        console.log("Felaktivt användarnamn eller lösenord");
    }
}

// Koppla formuläret till funktionen
const form = document.getElementById("login-form");
form.addEventListener("submit", loginAdmin);