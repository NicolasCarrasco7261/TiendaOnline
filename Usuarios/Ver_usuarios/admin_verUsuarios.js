// admin_verUsuarios.js
// Lista usuarios desde localStorage, permite seleccionar una fila y eliminarla

document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'cdgames_usuarios';
  const tbody = document.querySelector('#usuariosTable tbody');
  const status = document.getElementById('statusMsg');
  const btnDelete = document.getElementById('btnDelete');

  let selectedRun = null; // RUN de la fila seleccionada

  function getUsuarios() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }
  function saveUsuarios(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }
  function showStatus(text, ok) {
    status.hidden = false;
    status.textContent = text;
    status.className = 'status ' + (ok ? 'ok' : 'err');
  }
  function clearStatus() {
    status.hidden = true;
    status.textContent = '';
    status.className = 'status';
  }
  function escapeHTML(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function render() {
    const data = getUsuarios();
    tbody.innerHTML = '';
    selectedRun = null; // al render reset selección
    clearStatus();

    if (!data.length) {
      const tr = document.createElement('tr');
      tr.className = 'placeholder';
      tr.innerHTML = `<td colspan="7">No hay usuarios para mostrar.</td>`;
      tbody.appendChild(tr);
      return;
    }

    // Ordenar por fecha de creación descendente (opcional)
    data.sort((a, b) => (b.creado || '').localeCompare(a.creado || ''));

    for (const u of data) {
      const tr = document.createElement('tr');
      tr.dataset.run = u.run || '';
      tr.innerHTML = `
        <td>${escapeHTML(u.run)}</td>
        <td>${escapeHTML(u.nombre)}</td>
        <td>${escapeHTML(u.apellidos)}</td>
        <td>${escapeHTML(u.correo)}</td>
        <td>${escapeHTML(u.region)}</td>
        <td>${escapeHTML(u.comuna)}</td>
        <td>${escapeHTML(u.direccion)}</td>
      `;
      tbody.appendChild(tr);
    }
  }

  // Selección de fila (event delegation)
  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr || tr.classList.contains('placeholder')) return;

    // quitar selección anterior
    tbody.querySelectorAll('tr.selected').forEach(r => r.classList.remove('selected'));

    // marcar nueva
    tr.classList.add('selected');
    selectedRun = tr.dataset.run || null;
    clearStatus();
  });

  // Eliminar usuario seleccionado
  btnDelete.addEventListener('click', () => {
    if (!selectedRun) {
      showStatus('Primero selecciona un usuario en la tabla.', false);
      return;
    }

    const lista = getUsuarios();
    const idx = lista.findIndex(u => u.run === selectedRun);
    if (idx === -1) {
      showStatus('No se encontró el usuario seleccionado.', false);
      return;
    }

    // eliminar y guardar
    lista.splice(idx, 1);
    saveUsuarios(lista);

    // refrescar
    render();
    showStatus('Usuario eliminado exitosamente.', true);
  });

  // Actualizar si otra pestaña modifica el storage
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) render();
  });

  // Render inicial
  render();
});
