// CONTACTO

const form = document.getElementById("formulario");

    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      if (nombre === "" || email === "" || mensaje === "") {
        Swal.fire("Envio fallido", "Completa todos los campos solicitados", "error");
        return;
      }else{
          Swal.fire("Mensaje enviado exitosamente", "El mensaje ha sido enviado correctamente", "success");
        form.reset();
      }
    });

    // Menu interactivo navbar

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
    window.location.href = "../views/login.html";
}
function irRegister() {
    window.location.href = "../views/register.html";
}