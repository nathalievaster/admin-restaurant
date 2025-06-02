"use strict";

const token = localStorage.getItem("token");

// Funktion för att kontrollera om JWT-token har gått ut
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp < now;
  } catch (e) {
    console.error("Fel vid kontroll av token:", e);
    return true;
  }
}

// Kontrollera att token finns och inte är utgången
if (!token || token === "undefined" || isTokenExpired(token)) {
  localStorage.removeItem("token");
  alert("Din session har gått ut. Logga in igen.");
  window.location.href = "login.html";
}