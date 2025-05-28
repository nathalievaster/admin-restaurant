document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const menuList = document.getElementById("menu-list");

  async function fetchMenu() {
    try {
      const resp = await fetch("http://localhost:5000/api/menu", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) throw new Error("Kunde inte hämta menyn.");

      const menuItems = await resp.json();
      renderMenu(menuItems);
    } catch (err) {
      menuList.innerHTML = `<p class="error">${err.message}</p>`;
    }
  }

  // Om det inte finns några objekt i menyn, skriv ut i html
  function renderMenu(items) {
    if (items.length === 0) {
      menuList.innerHTML = "<p>Ingen meny tillgänglig.</p>";
      return;
    }

    menuList.innerHTML = items
      .map(
        (item) => `
        <article class="menu-item">
          <h3>${item.name}</h3>
          <p>${item.description || "Ingen beskrivning"}</p>
          <p><strong>Pris:</strong> ${item.price} kr</p>
          <p><strong>Kategori:</strong> ${item.category}</p>
          <p><strong>Tillgänglig:</strong> ${item.available ? "Ja" : "Nej"}</p>
          <button data-id="${item.id}" class="edit-btn">Redigera</button>
          <button data-id="${item.id}" class="delete-btn">Radera</button>
        </article>`
      )
      .join("");

      // Radera menyobjekt
    menuList.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      if (e.target.classList.contains("delete-btn")) {
        deleteMenuItem(id);
      }
    });
  }

  async function deleteMenuItem(id) {
    if (!confirm("Är du säker på att du vill radera detta menyobjekt?")) return;

    try {
      const resp = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) throw new Error("Kunde inte radera objektet.");

      fetchMenu(); // Ladda om listan
    } catch (err) {
      alert(err.message);
    }
  }

  fetchMenu();
});
