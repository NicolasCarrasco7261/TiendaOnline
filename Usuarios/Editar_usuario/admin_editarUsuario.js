// admin_editarUsuario.js (sin campo RUN visible)
// 1) Buscar usuario por RUN  2) Mostrar formulario  3) Guardar cambios

document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'cdgames_usuarios';

  // --- Tarjeta búsqueda
  const searchForm = document.getElementById('searchForm');
  const buscarRunEl = document.getElementById('buscarRun');
  const btnBuscar = document.getElementById('btnBuscar');
  const searchMsg = document.getElementById('searchMsg');

  // --- Tarjeta edición
  const editCard = document.getElementById('editCard');
  const editForm = document.getElementById('editForm');
  const nombreEl = document.getElementById('nombre');
  const apellidosEl = document.getElementById('apellidos');
  const correoEl = document.getElementById('correo');
  const nacimientoEl = document.getElementById('nacimiento');
  const direccionEl = document.getElementById('direccion');
  const regionEl = document.getElementById('region');
  const comunaEl = document.getElementById('comuna');
  const btnGuardar = document.getElementById('btnGuardar');
  const editMsg = document.getElementById('editMsg');

  // RUN actual (no visible)
  let currentRun = null;

  // ---------- helpers UI ----------
  const showMsg = (el, text, ok = false) => {
    el.hidden = false; el.textContent = text;
    el.className = 'status ' + (ok ? 'ok' : 'err');
  };
  const hideMsg = (el) => { el.hidden = true; el.textContent = ''; el.className = 'status'; };
  const mark = (el, ok = true) => {
    el.style.borderColor = ok ? '#cbd2d9' : '#ef4444';
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
  };
  const resetMarks = () => {
    [nombreEl, apellidosEl, correoEl, nacimientoEl, direccionEl, regionEl, comunaEl]
      .forEach(i => mark(i, true));
  };

  // ---------- storage ----------
  const getAll = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  };
  const saveAll = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

  // ---------- validaciones ----------
  const normRUN = v => (v || '').toString().replace(/[.\-]/g, '').toUpperCase().trim();
  const validRUN = v => /^[0-9]{7,8}[0-9K]$/i.test(v);
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const allowedDomain = v => /@gmail\.com$/i.test(v);
  const validISODate = v => /^\d{4}-\d{2}-\d{2}$/.test(v);

  // ---------- fill form ----------
  function fillForm(u) {
    nombreEl.value = u.nombre || '';
    apellidosEl.value = u.apellidos || '';
    correoEl.value = u.correo || '';
    nacimientoEl.value = u.nacimiento || '';
    direccionEl.value = u.direccion || '';
    regionEl.value = u.region || '';
    comunaEl.value = u.comuna || '';
  }

  // Buscar por RUN
  btnBuscar.addEventListener('click', () => {
    hideMsg(searchMsg); hideMsg(editMsg); resetMarks();

    const run = normRUN(buscarRunEl.value);
    if (!validRUN(run)) {
      mark(buscarRunEl, false);
      showMsg(searchMsg, 'RUN inválido. Ingresa sin puntos ni guion (puede terminar en K).');
      return;
    }

    const data = getAll();
    const found = data.find(u => u.run === run);
    if (!found) {
      showMsg(searchMsg, 'No se encontró un usuario con ese RUN.', false);
      editCard.classList.add('hidden');
      return;
    }

    currentRun = run;           // guardamos el RUN internamente
    fillForm(found);            // rellenamos el formulario
    editCard.classList.remove('hidden');
    showMsg(searchMsg, 'Usuario encontrado. Cargando datos…', true);
    setTimeout(() => hideMsg(searchMsg), 1200);
  });

  // Validar y construir objeto actualizado (sin RUN editable)
  function validateAndBuild() {
    resetMarks(); hideMsg(editMsg);
    const errors = [];

    if (!currentRun || !validRUN(currentRun)) {
      showMsg(editMsg, 'RUN interno inválido. Intenta buscar nuevamente.', false);
      return null;
    }

    const nombre = nombreEl.value.trim();
    if (!nombre || nombre.length > 50) errors.push({ el: nombreEl, msg: 'Nombre requerido (máx. 50).' });

    const apellidos = apellidosEl.value.trim();
    if (!apellidos || apellidos.length > 100) errors.push({ el: apellidosEl, msg: 'Apellidos requeridos (máx. 100).' });

    const correo = (correoEl.value || '').trim().toLowerCase();
    if (!validEmail(correo) || !allowedDomain(correo) || correo.length > 100)
      errors.push({ el: correoEl, msg: 'Correo inválido. Solo se permite @gmail.com.' });

    const nacimiento = (nacimientoEl.value || '').trim();
    if (nacimiento && !validISODate(nacimiento))
      errors.push({ el: nacimientoEl, msg: 'Fecha debe ser AAAA-MM-DD o dejar vacío.' });

    const direccion = direccionEl.value.trim();
    if (!direccion || direccion.length > 300)
      errors.push({ el: direccionEl, msg: 'Dirección requerida (máx. 300).' });

    const region = regionEl.value.trim();
    if (!region) errors.push({ el: regionEl, msg: 'Región requerida.' });

    const comuna = comunaEl.value.trim();
    if (!comuna) errors.push({ el: comunaEl, msg: 'Comuna requerida.' });

    if (errors.length) {
      const f = errors[0];
      errors.forEach(e => mark(e.el, false));
      showMsg(editMsg, f.msg, false);
      f.el.focus();
      return null;
    }

    return {
      run: currentRun,
      nombre,
      apellidos,
      correo,
      nacimiento: nacimiento || null,
      direccion,
      region,
      comuna,
    };
  }

  btnGuardar.addEventListener('click', () => {
    const updated = validateAndBuild();
    if (!updated) return;

    const lista = getAll();
    const idx = lista.findIndex(u => u.run === updated.run);
    if (idx === -1) {
      showMsg(editMsg, 'No se encontró el usuario (tal vez fue eliminado).', false);
      return;
    }

    const creado = lista[idx]?.creado || new Date().toISOString();
    lista[idx] = { ...lista[idx], ...updated, creado };
    saveAll(lista);

    showMsg(editMsg, 'Datos actualizados correctamente.', true);
  });

  // submit con Enter
  searchForm.addEventListener('submit', e => { e.preventDefault(); btnBuscar.click(); });
  editForm.addEventListener('submit', e => { e.preventDefault(); btnGuardar.click(); });

  // limpiar marcas al escribir
  [buscarRunEl, nombreEl, apellidosEl, correoEl, nacimientoEl, direccionEl, regionEl, comunaEl]
    .forEach(el => el?.addEventListener('input', () => { mark(el, true); hideMsg(searchMsg); hideMsg(editMsg); }));

  // Autocargar si guardaste un RUN desde "Ver Usuarios"
  const preRun = normRUN(localStorage.getItem('cdgames_usuario_edit') || '');
  if (preRun) {
    localStorage.removeItem('cdgames_usuario_edit');
    buscarRunEl.value = preRun;
    btnBuscar.click();
  }
});
