document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const menuList = document.getElementById("menu-list");
  const addForm = document.getElementById("add-form");
  
  if (!token) {
    window.location.href = "login.html";
    return;
  }

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
        <form class="edit-form" data-id="${item.id}" style="display: none;">
          <input type="text" name="name" value="${item.name}" required />
          <input type="text" name="description" value="${item.description || ''}" />
          <input type="number" name="price" value="${item.price}" required />
          <input type="text" name="category" value="${item.category}" required />
          <label>
            Tillgänglig:
            <input type="checkbox" name="available" ${item.available ? "checked" : ""} />
          </label>
          <button type="submit">Spara</button>
        </form>
      </article>`
    )
      .join("");

      // Lyssna på alla klick inom menylistan
    menuList.addEventListener("click", (e) => {
      const id = e.target.dataset.id;

      // Om användaren klickar på Radera-knappen
      if (e.target.classList.contains("delete-btn")) {
        deleteMenuItem(id);
      }
      
      // Om användaren klickar på Redigera-knappen
        if (e.target.classList.contains("edit-btn")) {
            // Hitta det objekt som klicket är på
            const parent = e.target.closest(".menu-item");
            // Hämta formuläret för redigering
            const form = parent.querySelector(".edit-form");
            // Visa/göm redigeringsformuläret
            form.style.display = form.style.display === "none" ? "block" : "none";
        }
    });

    menuList.addEventListener("submit", (e) => {
  if (e.target.classList.contains("edit-form")) {
    e.preventDefault();
    const form = e.target;
    const id = form.dataset.id;

    const updated = {
      name: form.name.value.trim(),
      description: form.description.value.trim(),
      price: parseFloat(form.price.value),
      category: form.category.value.trim(),
      available: form.available.checked ? 1 : 0,
    };

    updateMenuItem(id, updated);
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

  // Lägg till nytt menyobjekt
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userInput = {
      name: document.getElementById("name").value.trim(),
      description: document.getElementById("description").value.trim(),
      price: parseFloat(document.getElementById("price").value),
      category: document.getElementById("category").value.trim(),
      available: document.getElementById("available").checked ? 1 : 0,
    };

    try {
      const resp = await fetch("http://localhost:5000/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userInput),
      });

      if (!resp.ok) throw new Error("Kunde inte lägga till menyobjekt.");
      addForm.reset();
      fetchMenu(); // uppdatera listan
    } catch (err) {
      alert(err.message);
    }
  });

  async function updateMenuItem(id, updatedData) {
  try {
    const resp = await fetch(`http://localhost:5000/api/menu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!resp.ok) throw new Error("Kunde inte uppdatera menyobjekt.");

    fetchMenu(); // Ladda om menyn
  } catch (err) {
    alert(err.message);
  }
}


  // Starta sidan
  fetchMenu();
});