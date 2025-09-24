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

// Spawn de Cards

fetch("/assets/data/producto.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("cards");

    data.slice(0, 4).forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.className = "card";

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
  })
  .catch(error => console.error("Error al cargar JSON:", error));