"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const messageList = document.getElementById("messages-list");

  // Om ej inloggad → gå till login
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Hämta meddelanden
  async function fetchMessages() {
    try {
      const resp = await fetch("https://rest-restaurant.onrender.com/api/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) throw new Error("Kunde inte hämta meddelanden.");
      const messages = await resp.json();
      renderMessages(messages);
    } catch (err) {
      messageList.innerHTML = `<p class="error">${err.message}</p>`;
    }
  }

  // Visa meddelanden
  function renderMessages(items) {
    if (items.length === 0) {
      messageList.innerHTML = "<p>Inga nya meddelanden.</p>";
      return;
    }

    messageList.innerHTML = items
      .map((msg) => `
        <article class="message">
          <h3>Från: ${msg.name}</h3>
          <p><strong>Email:</strong> ${msg.email}</p>
          <p><strong>Meddelande:</strong><br>${msg.message}</p>
          <p><small>Skickat: ${new Date(msg.created).toLocaleString()}</small></p>
        </article>
      `)
      .join("");
  }

  // Start
  fetchMessages();
});
