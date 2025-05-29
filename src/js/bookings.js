"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const bookingList = document.getElementById("booking-list");

  // Om ingen token finns, dirigera till login
  if (!token) {
    window.location.href = "login.html";
    return;
  }

 /**
   * Hämta bokningar från servern
   * Endast tillgängligt för inloggad admin via Bearer-token
   */
  async function fetchBookings() {
    try {
      const resp = await fetch("http://localhost:5000/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`, // JWT skickas med i headern
        },
      });

      // Om inte OK (t.ex. 401) → visa fel
      if (!resp.ok) throw new Error("Kunde inte hämta bokningar.");

      const bookings = await resp.json();
      renderBookings(bookings); // Visa bokningarna i HTML
    } catch (err) {
      bookingList.innerHTML = `<p class="error">${err.message}</p>`;
    }
  }

  /**
   * Visa bokningarna i gränssnittet
   * Skapar HTML för varje bokning + redigeringsformulär
   */
  function renderBookings(items) {
    if (items.length === 0) {
      bookingList.innerHTML = "<p>Inga bokningar ännu.</p>";
      return;
    }

    bookingList.innerHTML = items
      .map((b) => `
        <article class="booking-item">
          <h3>${b.name} (${b.guests} gäster)</h3>
          <p><strong>Email:</strong> ${b.email}</p>
          <p><strong>Datum:</strong> ${b.date}</p>
          <p><strong>Tid:</strong> ${b.time}</p>
          <p><strong>Bord:</strong> ${b.table_id || "Ej tilldelat"}</p>
          
          <!-- Redigera och Radera-knappar -->
          <button data-id="${b.id}" class="edit-btn">Redigera</button>
          <button data-id="${b.id}" class="delete-btn">Radera</button>

          <!-- Redigeringsformulär (dolt som standard) -->
          <form class="edit-form" data-id="${b.id}" style="display: none;">
            <input type="text" name="name" value="${b.name}" required />
            <input type="email" name="email" value="${b.email}" required />
            <input type="number" name="guests" value="${b.guests}" required />
            <input type="date" name="date" value="${b.date}" required />
            <input type="time" name="time" value="${b.time}" required />
            <button type="submit">Spara ändringar</button>
          </form>
        </article>
      `)
      .join("");
  }

  /**
   * Hantera klick på redigera- eller raderaknapp
   */
  bookingList.addEventListener("click", (e) => {
    const id = e.target.dataset.id;

    // Om "Radera"-knappen klickas
    if (e.target.classList.contains("delete-btn")) {
      deleteBooking(id);
    }

    // Om "Redigera"-knappen klickas → växla visning av redigeringsformulär
    if (e.target.classList.contains("edit-btn")) {
      const parent = e.target.closest(".booking-item");
      const form = parent.querySelector(".edit-form");
      form.style.display = form.style.display === "none" ? "block" : "none";
    }
  });

  /**
   * Hantera inskickat redigeringsformulär för en bokning
   */
  bookingList.addEventListener("submit", async (e) => {
    if (e.target.classList.contains("edit-form")) {
      e.preventDefault();
      const form = e.target;
      const id = form.dataset.id;

      // Skapa ett objekt med uppdaterad data från formuläret
      const updated = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        guests: parseInt(form.guests.value),
        date: form.date.value,
        time: form.time.value,
      };

      try {
        const resp = await fetch(`http://localhost:5000/api/bookings/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updated),
        });

        if (!resp.ok) throw new Error("Kunde inte uppdatera bokning.");
        fetchBookings(); // Uppdatera listan efter redigering
      } catch (err) {
        alert(err.message);
      }
    }
  });

  /**
   * Radera en bokning via DELETE-anrop
   */
  async function deleteBooking(id) {
    if (!confirm("Är du säker på att du vill radera bokningen?")) return;

    try {
      const resp = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) throw new Error("Kunde inte radera bokning.");
      fetchBookings(); // Uppdatera listan efter radering
    } catch (err) {
      alert(err.message);
    }
  }

  // Starta genom att hämta bokningarna
  fetchBookings();
});