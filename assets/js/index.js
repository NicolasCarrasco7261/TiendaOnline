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

function verMas() {
    window.location.href = "/assets/views/producto.html";
}

// CONTACTO

const form = document.getElementById("formulario");
    const respuesta = document.getElementById("respuesta");

    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      if (nombre === "" || email === "" || mensaje === "") {
        swal ("Envio fallido",
                 "Completa todos los campos solicitados", "error");
        return;
      }

      // Validación simple de email
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(email)) {
        swal ("Error al ingresar correo",
                 "Debes ingresar un correo valido", "error");
        return;
      }

      // Si pasa validación
      swal ("Mensaje enviado exitosamente",
                 "El mensaje ha sido enviado correctamente", "success");
      // Limpiar campos
      form.reset();
    });