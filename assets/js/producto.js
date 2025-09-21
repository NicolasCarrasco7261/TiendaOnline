fetch("assets/data/producto.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("cards");

    data.slice(0, 4).forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card", "m-2");
      card.style.width = "19rem";

      card.innerHTML = `
        <img src="${item.imagen}" class="card-img-top" alt="${item.titulo}">
        <div id="cardBody" class="card-body text-light">
          <h5 class="card-title">${item.titulo}</h5>
          <p class="card-text">${item.descripcion}</p>
          <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-light">Ver más</button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => console.error("Error al cargar JSON:", error));