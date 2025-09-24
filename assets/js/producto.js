const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    if (navLinks.classList.contains("active")) {
        menuBtn.innerHTML = "X";
        menuBtn.setAttribute("aria-expanded", "true")
    } else {
        menuBtn.innerHTML = "☰";
        menuBtn.setAttribute("aria-expanded", "false")
    }


});

// Funciones para ir login y register

function irLogin() {
    window.location.href = "/assets/views/login.html";
}
function irRegister() {
    window.location.href = "/assets/views/register.html";
}


// Buscar un producto

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cards");
  const searchInput = document.getElementById("search");

  let data = [];

  function renderCards(items) {
    container.innerHTML = "";
    if (items.length === 0) {
      container.innerHTML = "<p>No se encontraron productos</p>";
      return;
    }

    items.slice(0, 8).forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${item.imagen}" alt="${item.titulo}">
        <div class="card-body">
          <h3>${item.titulo}</h3>
          <p>${item.descripcion}</p>
          <p class="price">$${item.precio.toLocaleString("es-CL")}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Cargar productos una sola vez
  fetch("/assets/data/producto.json")
    .then(response => response.json())
    .then(json => {
      data = json;
      renderCards(data); // mostrar todos al inicio
    })
    .catch(error => console.error("Error al cargar JSON:", error));

  // Filtrar en tiempo real
  searchInput.addEventListener("input", e => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = data.filter(item =>
      item.titulo.toLowerCase().includes(searchTerm) ||
      item.descripcion.toLowerCase().includes(searchTerm)
    );
    renderCards(filtered);
  });
});