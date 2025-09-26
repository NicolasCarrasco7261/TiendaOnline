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

// Spawn de Cards

const data = [
  {
    "id": 1,
    "titulo": "Cyberpunk 2077",
    "descripcion": "Un RPG futurista en una ciudad abierta llena de historias.",
    "imagen": "https://nxtgame.cl/wp-content/uploads/2023/06/cyberpunk-2077.jpg",
    "precio": 39990,
    "requisitos_minimos": {
      "so": "Windows 10",
      "procesador": "Intel Core i5-3570K",
      "ram": "8 GB",
      "gpu": "GTX 780"
    },
    "requisitos_recomendados": {
      "so": "Windows 10",
      "procesador": "Intel Core i7-4790",
      "ram": "16 GB",
      "gpu": "GTX 1060"
    }
  },
  {
    "id": 2,
    "titulo": "Red Dead Redemption 2",
    "descripcion": "Acción y aventura en el salvaje oeste con gráficos realistas.",
    "imagen": "https://image.api.playstation.com/cdn/UP1004/CUSA03041_00/Hpl5MtwQgOVF9vJqlfui6SDB5Jl4oBSq.png",
    "precio": 45990,
    "requisitos_minimos": {
      "so": "Windows 10",
      "procesador": "Intel Core i5-2500K",
      "ram": "8 GB",
      "gpu": "GTX 770"
    },
    "requisitos_recomendados": {
      "so": "Windows 10",
      "procesador": "Intel Core i7-4770K",
      "ram": "12 GB",
      "gpu": "GTX 1060 6GB"
    }
  },
  {
    "id": 3,
    "titulo": "Minecraft",
    "descripcion": "Construcción, supervivencia y creatividad en un mundo de bloques.",
    "imagen": "https://cdnx.jumpseller.com/deus-digital/image/26018632/thumb/719/719?1659480453",
    "precio": 19990,
    "requisitos_minimos": {
      "so": "Windows 7",
      "procesador": "Intel Core i3",
      "ram": "4 GB",
      "gpu": "Intel HD Graphics 4000"
    },
    "requisitos_recomendados": {
      "so": "Windows 10",
      "procesador": "Intel Core i5",
      "ram": "8 GB",
      "gpu": "GTX 660"
    }
  },
  {
    "id": 4,
    "titulo": "Grand Theft Auto V",
    "descripcion": "Mundo abierto con crimen, acción y múltiples personajes jugables.",
    "imagen": "https://therpgstore.com/wp-content/uploads/2018/03/Grand-Theft-Auto-V-Premium-Edition-90.jpg",
    "precio": 24990,
    "requisitos_minimos": {
      "so": "Windows 7",
      "procesador": "Intel Core 2 Quad",
      "ram": "4 GB",
      "gpu": "Nvidia 9800 GT"
    },
    "requisitos_recomendados": {
      "so": "Windows 10",
      "procesador": "Intel Core i5-3470",
      "ram": "8 GB",
      "gpu": "GTX 660"
    }
  }
];  

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

function verMas() {
    window.location.href = "../views/producto.html";
}