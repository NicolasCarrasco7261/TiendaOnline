// admin_nuevoUsuario.js
// Guarda usuarios en localStorage y valida campos básicos (solo @gmail.com)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  if (!form) return;

  //Inputs en el mismo orden que en el HTML
  const inputs = Array.from(form.querySelectorAll('input'));
  const [
    runEl,            // RUN
    nombreEl,         // Nombre
    apellidosEl,      // Apellidos
    correoEl,         // Correo
    fechaEl,          // Fecha (opcional)
    direccionEl,      // Dirección
    regionEl,         // Región
    comunaEl          // Comuna
  ] = inputs;

  const btn = form.querySelector('.btn.brand') || form.querySelector('button[type="submit"]');

  /* ------- helpers de UI ------- */
  const msg = document.createElement('p');
  msg.style.marginTop = '8px';
  msg.style.fontSize = '14px';
  form.appendChild(msg);

  const show = (t, ok = false) => {
    msg.textContent = t;
    msg.style.color = ok ? '#065f46' : '#9b1c1c';
  };

  const mark = (el, ok = true) => {
    if (!el) return;
    el.style.borderColor = ok ? '#cbd2d9' : '#ef4444';
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
  };

  const cleanMarks = () => inputs.forEach(el => mark(el, true));

  /* ------- helpers de storage ------- */
  const KEY = 'cdgames_usuarios';
  const getAll = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  };
  const saveAll = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

  /* ------- validaciones ------- */
  const validRUN = v => /^[0-9]{7,8}[0-9K]$/i.test(v.trim());
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const allowedDomain = v => /@gmail\.com$/i.test(v); // <-- solo gmail.com
  const validISODate = v => /^\d{4}-\d{2}-\d{2}$/.test(v);

  const validate = () => {
    cleanMarks();
    const errors = [];

    const run = runEl.value.trim().toUpperCase();
    if (!validRUN(run)) errors.push({ el: runEl, msg: 'RUN inválido (sin puntos ni guion, termina en dígito/K).' });

    if (!nombreEl.value.trim() || nombreEl.value.length > 50)
      errors.push({ el: nombreEl, msg: 'Nombre requerido.' });

    if (!apellidosEl.value.trim() || apellidosEl.value.length > 100)
      errors.push({ el: apellidosEl, msg: 'Apellidos requeridos.' });

    const correo = (correoEl.value || '').trim().toLowerCase();
    if (!validEmail(correo) || !allowedDomain(correo) || correo.length > 100)
      errors.push({ el: correoEl, msg: 'Correo inválido. Solo se permite @gmail.com.' });

    const nacimiento = (fechaEl.value || '').trim();
    if (nacimiento && !validISODate(nacimiento))
      errors.push({ el: fechaEl, msg: 'Fecha debe ser AAAA-MM-DD.' });

    if (!direccionEl.value.trim() || direccionEl.value.length > 300)
      errors.push({ el: direccionEl, msg: 'Dirección requerida.' });

    if (!regionEl.value.trim()) errors.push({ el: regionEl, msg: 'Región requerida.' });
    if (!comunaEl.value.trim()) errors.push({ el: comunaEl, msg: 'Comuna requerida.' });

    if (errors.length) {
      errors.forEach(e => mark(e.el, false));
      show('❌ ' + errors[0].msg);
      errors[0].el.focus();
      return null;
    }

    return {
      run,
      nombre: nombreEl.value.trim(),
      apellidos: apellidosEl.value.trim(),
      correo,
      nacimiento: nacimiento || null,
      direccion: direccionEl.value.trim(),
      region: regionEl.value.trim(),
      comuna: comunaEl.value.trim(),
      creado: new Date().toISOString()
    };
  };

  /* ------- guardar ------- */
  const handleSave = () => {
    const data = validate();
    if (!data) return;

    const lista = getAll();

    // no duplicar RUN
    if (lista.some(u => u.run === data.run)) {
      mark(runEl, false);
      show('Ya existe un usuario con ese RUN.');
      runEl.focus();
      return;
    }

    lista.push(data);
    saveAll(lista);

    show('Usuario guardado en este navegador.', true);
    form.reset();
    cleanMarks();
  };

  btn?.addEventListener('click', handleSave);

  // Soporta Enter en el formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSave();
  });

  // Limpia mensaje y borde rojo al escribir
  inputs.forEach(el => el.addEventListener('input', () => { mark(el, true); msg.textContent = ''; }));
});
