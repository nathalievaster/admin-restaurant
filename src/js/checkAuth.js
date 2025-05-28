"use strict";

const token = localStorage.getItem("token");

// Kontrollera att token inte är null, tom eller strängen "undefined"
if (!token || token === "undefined") {
    window.location.href = "login.html";
}
