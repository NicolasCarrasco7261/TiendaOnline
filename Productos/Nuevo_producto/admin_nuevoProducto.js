// admin_nuevoProducto.js
// Guarda productos en localStorage con ID autoincremental y bloqueo de duplicados (Nombre+Plataforma)

document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'cdgames_productos';

  const form = document.querySelector('.form');
  const status = document.getElementById('statusMsg');
  if (!form || !status) return;

  // Inputs en el MISMO orden que en tu HTML:
  // 0: nombre, 1: precio, 2: stock, 3: plataforma, 4: descripcion, 5: imagenUrl
  const inputs = Array.from(form.querySelectorAll('input'));
  const [nombreEl, precioEl, stockEl, plataformaEl, descEl, imgEl] = inputs;

  const btn = form.querySelector('.btn.brand');

  /* ---------- Helpers UI ---------- */
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
  const mark = (el, ok = true) => {
    if (!el) return;
    el.style.borderColor = ok ? '#cbd2d9' : '#ef4444';
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
  };
  const clearMarks = () => inputs.forEach(el => mark(el, true));

  /* ---------- Storage ---------- */
  const getAll = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  };
  const saveAll = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

  /* ---------- Normalización y validación ---------- */
  const normalize = (s) => (s || '').toString().trim().replace(/\s+/g, ' ');
  const normCmp = (s) => normalize(s).toLowerCase();

  const isNumber = (v) => Number.isFinite(v);
  const isInt = (v) => Number.isInteger(v);

  const validImageUrl = (s) => /^https?:\/\/.+/i.test(s.trim());

  function validateAndBuild() {
    clearMarks();
    clearMsg();

    // Tomar valores
    const nombre = normalize(nombreEl.value);
    const precioNum = parseFloat((precioEl.value || '').toString().replace(',', '.'));
    const stockNum = parseInt((stockEl.value || '').toString(), 10);
    const plataforma = normalize(plataformaEl.value);
    const descripcion = normalize(descEl.value);
    const imagenUrl = normalize(imgEl.value);

    // Validaciones
    if (!nombre || nombre.length > 100) {
      mark(nombreEl, false); show('Nombre es obligatorio (máx. 100).'); return null;
    }
    if (!isNumber(precioNum) || precioNum < 0) {
      mark(precioEl, false); show('Precio debe ser un número válido (≥ 0).'); return null;
    }
    if (!isInt(stockNum) || stockNum < 0) {
      mark(stockEl, false); show('Stock debe ser un entero válido (≥ 0).'); return null;
    }
    if (!plataforma || plataforma.length > 50) {
      mark(plataformaEl, false); show('Plataforma es obligatoria (máx. 50).'); return null;
    }
    if (descripcion && descripcion.length > 300) {
      mark(descEl, false); show('Descripción demasiado larga (máx. 300).'); return null;
    }
    if (imagenUrl && !validImageUrl(imagenUrl)) {
      mark(imgEl, false); show('La URL de imagen debe comenzar con http:// o https://'); return null;
    }

    // Duplicados: Nombre+Plataforma (normalizados)
    const lista = getAll();
    const keyNombre = normCmp(nombre);
    const keyPlat = normCmp(plataforma);
    const dup = lista.some(p => normCmp(p.nombre) === keyNombre && normCmp(p.plataforma) === keyPlat);
    if (dup) {
      mark(nombreEl, false); mark(plataformaEl, false);
      show('Este juego ya existe para esa plataforma.');
      return null;
    }

    // ID autoincremental
    const nextId = (lista.length ? Math.max(...lista.map(p => Number(p.id) || 0)) : 0) + 1;

    return {
      id: nextId,
      nombre,
      precio: Number(precioNum.toFixed(2)), // guarda como número
      stock: stockNum,
      plataforma,
      descripcion: descripcion || null,
      imagenUrl: imagenUrl || null,
      creado: new Date().toISOString(),
      activo: true
    };
  }

  function handleSave() {
    const product = validateAndBuild();
    if (!product) return;

    const lista = getAll();
    lista.push(product);
    saveAll(lista);

    show('Producto registrado correctamente.', true);
    form.reset();
    clearMarks();
  }

  btn?.addEventListener('click', handleSave);

  // Soporta Enter en el formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSave();
  });

  // Quitar borde rojo y mensaje al escribir
  inputs.forEach(el => el.addEventListener('input', () => { mark(el, true); clearMsg(); }));
});
