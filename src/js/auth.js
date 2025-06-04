async function loginAdmin(e) {
    e.preventDefault(); // Förhindrar standardformulärbeteende så att sidan inte laddas om

    // Hämta inmatningsfälten
    let usernameInput = document.getElementById("username");
    let passwordInput = document.getElementById("password");

    // Rensa och hämta värden
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Elementet som felmeddelanden kommer ligga i
    const errorMsg = document.getElementById("error-msg");

    // Kontrollera att fälten är ifyllda
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

    // Skapa objekt med inloggningsuppgifter
    let user = {
        username: usernameInput.value,
        password: passwordInput.value
    }

    // Skicka POST-förfrågan till api
    try {
        const resp = await fetch("https://rest-restaurant.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        // Konvertera resp till json
        const data = await resp.json();

        // Inloggningen lyckas, så sparas token och omdirigeras till index.html
        if (resp.ok) {
            const token = data.response.token;
            localStorage.setItem("token", token);
            window.location.href = "index.html"; 
            // Fel, visa felmeddelande
        } else {
            errorMsg.textContent = data.message || "Felaktigt användarnamn eller lösenord";
        }
        // Fångar nätverksfel
    } catch (error) {
        errorMsg.textContent = "Något gick fel. Försök igen.";
        console.error(error);
    }

}

// Koppla formuläret till funktionen
const form = document.getElementById("login-form");
form.addEventListener("submit", loginAdmin);