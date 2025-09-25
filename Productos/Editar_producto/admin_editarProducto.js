// admin_editarProducto.js (sin vista previa de imagen)

document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos ---
  const statusEl = document.getElementById('statusMsg');   // mensajes globales
  const searchMsg = document.getElementById('searchMsg');   // mensajes búsqueda

  const formBuscar = document.getElementById('formBuscar');
  const btnBuscar = document.getElementById('btnBuscar');
  const inputBuscar = document.getElementById('buscarId');

  const cardDatos = document.getElementById('cardDatos');
  const formProd = document.getElementById('formProducto');
  const btnGuardar = document.getElementById('btnGuardar');

  const fNombre = document.getElementById('nombre');
  const fPrecio = document.getElementById('precio');
  const fStock = document.getElementById('stock');
  const fPlataforma = document.getElementById('plataforma');
  const fDescripcion = document.getElementById('descripcion');
  const fImagenUrl = document.getElementById('imagenUrl');

  // --- Storage helpers ---
  const KEY = 'cdgames_productos';
  const getAll = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  };
  const saveAll = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

  // --- UI helpers ---
  const show = (el, msg, ok = false) => {
    el.hidden = false;
    el.textContent = msg;
    el.className = 'status ' + (ok ? 'ok' : 'err');
  };
  const hide = (el) => {
    el.hidden = true;
    el.textContent = '';
    el.className = 'status';
  };

  // ID actual (interno, no visible)
  let currentId = null;

  function fillForm(p) {
    fNombre.value = p.nombre ?? '';
    fPrecio.value = Number.isFinite(p.precio) ? p.precio : '';
    fStock.value = Number.isFinite(p.stock) ? p.stock : '';
    fPlataforma.value = p.plataforma ?? '';
    fDescripcion.value = p.descripcion ?? '';
    fImagenUrl.value = p.imagenUrl ?? '';
  }

  // Buscar por ID
  function buscarProducto() {
    hide(searchMsg);
    hide(statusEl);

    const raw = (inputBuscar.value || '').trim();
    if (!/^\d+$/.test(raw)) {
      show(searchMsg, 'Ingresa un ID válido (solo números).', false);
      cardDatos.classList.add('hidden');
      currentId = null;
      return;
    }

    const id = parseInt(raw, 10);
    const lista = getAll();
    const prod = lista.find(p => String(p.id) === String(id));

    if (!prod) {
      show(searchMsg, 'No se encontró un producto con ese ID. Verifícalo en la Lista de productos.', false);
      cardDatos.classList.add('hidden');
      currentId = null;
      return;
    }

    currentId = prod.id;
    fillForm(prod);
    cardDatos.classList.remove('hidden');
    show(searchMsg, 'Producto encontrado. Cargando datos…', true);
    setTimeout(() => hide(searchMsg), 1200);
  }

  function validate() {
    const nombre = fNombre.value.trim();
    const precio = parseInt(fPrecio.value, 10);
    const stock = parseInt(fStock.value, 10);
    const plataforma = fPlataforma.value.trim();
    const descripcion = (fDescripcion.value || '').trim();
    const imagenUrl = (fImagenUrl.value || '').trim();

    if (!nombre) return { ok: false, msg: 'El nombre del videojuego es obligatorio.' };
    if (!Number.isInteger(precio) || precio <= 0)
      return { ok: false, msg: 'Precio inválido. Debe ser un entero mayor a 0.' };
    if (!Number.isInteger(stock) || stock < 0)
      return { ok: false, msg: 'Stock inválido. Debe ser un entero mayor o igual a 0.' };
    if (descripcion.length > 300)
      return { ok: false, msg: 'La descripción no puede superar 300 caracteres.' };
    if (imagenUrl && !/^https?:\/\//i.test(imagenUrl))
      return { ok: false, msg: 'URL de imagen inválida. Debe comenzar con http:// o https://.' };

    return {
      ok: true,
      data: { nombre, precio, stock, plataforma, descripcion, imagenUrl }
    };
  }

  function guardarCambios() {
    hide(statusEl);

    if (currentId == null) {
      show(statusEl, 'Primero carga un producto por ID.', false);
      return;
    }

    const v = validate();
    if (!v.ok) { show(statusEl, v.msg, false); return; }

    const lista = getAll();
    const idx = lista.findIndex(p => String(p.id) === String(currentId));
    if (idx === -1) { show(statusEl, 'El producto ya no existe. Actualiza la página.', false); return; }

    const prev = lista[idx] || {};
    const updated = {
      ...prev,
      id: prev.id,
      nombre: v.data.nombre,
      precio: v.data.precio,
      stock: v.data.stock,
      plataforma: v.data.plataforma,
      descripcion: v.data.descripcion,
      imagenUrl: v.data.imagenUrl,
      modificado: new Date().toISOString(),
    };
    if (prev.creado && !updated.creado) updated.creado = prev.creado;
    if (typeof prev.activo === 'boolean') updated.activo = prev.activo;

    lista[idx] = updated;
    saveAll(lista);

    show(statusEl, 'Producto actualizado correctamente.', true);
  }

  // Eventos
  btnBuscar.addEventListener('click', buscarProducto);
  formBuscar.addEventListener('submit', (e) => { e.preventDefault(); buscarProducto(); });

  btnGuardar.addEventListener('click', guardarCambios);
  formProd.addEventListener('submit', (e) => { e.preventDefault(); guardarCambios(); });
});
