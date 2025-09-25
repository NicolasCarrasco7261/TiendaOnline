// admin_verProductos.js
// Lista productos, permite seleccionar una fila y eliminarla (localStorage).

document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'cdgames_productos';
  const tbody = document.getElementById('tbodyProductos');
  const btnEliminar = document.getElementById('btnEliminar');
  const status = document.getElementById('statusMsg');

  let selectedId = null;

  // Placeholder embebido si no hay imagen o falla la carga
  const PLACEHOLDER_SVG = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
      <rect width="100%" height="100%" rx="8" ry="8" fill="#e5e7eb"/>
      <text x="50%" y="52%" font-size="12" text-anchor="middle" fill="#6b7280" font-family="Arial">Sin img</text>
    </svg>
  `);
  const PLACEHOLDER = `data:image/svg+xml;utf8,${PLACEHOLDER_SVG}`;

  const fmtCLP = new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP', minimumFractionDigits: 0
  });

  const getAll = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  };
  const saveAll = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

  const show = (msg, ok = false) => {
    status.hidden = false;
    status.textContent = msg;
    status.className = 'status ' + (ok ? 'ok' : 'err');
  };
  const clearMsg = () => {
    status.hidden = true;
    status.textContent = '';
    status.className = 'status';
  };

  function render() {
    clearMsg();                     // <- limpia mensaje al renderizar
    btnEliminar.disabled = true;
    selectedId = null;

    const data = getAll().sort((a, b) => (a.id || 0) - (b.id || 0));
    tbody.innerHTML = '';

    if (!data.length) {
      const tr = document.createElement('tr');
      tr.className = 'empty';
      tr.innerHTML = `<td colspan="7">No hay productos para mostrar.</td>`;
      tbody.appendChild(tr);
      return;
    }

    for (const p of data) {
      const tr = document.createElement('tr');
      tr.dataset.id = String(p.id ?? '');
      const imgSrc = p.imagenUrl && /^https?:\/\//i.test(p.imagenUrl) ? p.imagenUrl : PLACEHOLDER;

      tr.innerHTML = `
        <td>${p.id ?? ''}</td>
        <td>${(p.nombre || '')}</td>
        <td>${(p.plataforma || '')}</td>
        <td>${Number.isFinite(p.precio) ? fmtCLP.format(p.precio) : ''}</td>
        <td>${Number.isFinite(p.stock) ? p.stock : ''}</td>
        <td><img class="thumb" src="${imgSrc}" alt="Imagen de ${(p.nombre || 'producto')}" onerror="this.src='${PLACEHOLDER}'"></td>
        <td>${(p.descripcion || '').toString().length > 120 ? (p.descripcion || '').toString().slice(0, 119) + '…' : (p.descripcion || '')}</td>
      `;

      // Selección/deselección de fila (toggle)
      tr.addEventListener('click', () => {
        const isSame = String(selectedId) === String(p.id);
        Array.from(tbody.querySelectorAll('tr.selected')).forEach(r => r.classList.remove('selected'));
        if (isSame) {
          selectedId = null;
          btnEliminar.disabled = true;
        } else {
          tr.classList.add('selected');
          selectedId = p.id;
          btnEliminar.disabled = false;
        }
      });

      tbody.appendChild(tr);
    }
  }

  btnEliminar.addEventListener('click', () => {
    if (selectedId == null) return;

    const lista = getAll();
    const nueva = lista.filter(p => String(p.id) !== String(selectedId));
    saveAll(nueva);

    // Importante: primero renderizamos (esto limpia el mensaje),
    // luego mostramos el mensaje para que quede visible.
    render();
    show('Producto eliminado exitosamente.', true);
  });

  render();
});
