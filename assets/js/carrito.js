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

// Funciones del carrito

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let total = calcularTotal();

// ✅ Agregar producto al carrito
function agregarAlCarrito(titulo, precio) {
  carrito.push({ titulo, precio });
  guardarCarrito();
  mostrarCarrito();
}

// ✅ Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ✅ Calcular total
function calcularTotal() {
  return carrito.reduce((acc, item) => acc + item.precio, 0);
}

// ✅ Mostrar carrito en pantalla
function mostrarCarrito() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.titulo} - $${item.precio}`;
    
    // Botón para eliminar 1 producto
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "❌";
    btnEliminar.style.marginLeft = "10px";
    btnEliminar.onclick = () => eliminarDelCarrito(index);

    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });

  total = calcularTotal();
  document.getElementById("total").textContent = "Total: $" + total;
}

// ✅ Eliminar producto específico
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  mostrarCarrito();
}

// ✅ Vaciar carrito
document.getElementById("vaciar").addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
});

// ✅ Finalizar compra
document.getElementById("comprar").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
  } else {
    alert("¡Gracias por tu compra!");
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
  }
});

// ✅ Cargar carrito al iniciar la página
document.addEventListener("DOMContentLoaded", mostrarCarrito);