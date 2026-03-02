const form = document.getElementById('formCursos');
const tabla = document.getElementById('tablaCursos');

document.addEventListener('DOMContentLoaded', () => {
  cargarCursos();
});

// READ: obtener y mostrar cursos
async function cargarCursos() {
  try {
    const r = await fetch('/api/cursos');
    const cursos = await r.json();

    tabla.innerHTML = cursos.map(c => `
      <tr data-id="${c.id}">
        <td><input class="inp nombre" value="${escapeHtml(c.nombre)}"></td>
        <td><input class="inp instructor" value="${escapeHtml(c.instructor)}"></td>
        <td><input class="inp horas" value="${escapeHtml(c.horas)}"></td>
        <td><input class="inp nivel" value="${escapeHtml(c.nivel)}"></td>
        <td><input class="inp fecha" value="${escapeHtml(c.fecha)}"></td>
        <td><input class="inp costo" value="${escapeHtml(c.costo)}"></td>
        <td class="actions">
          <button class="btn editar">Actualizar</button>
          <button class="btn eliminar">Eliminar</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
    toastr.error('Error al cargar cursos');
  }
}

// CREATE: registrar curso
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const instructor = document.getElementById('instructor').value;
  const horas = document.getElementById('horas').value;
  const nivel = document.getElementById('nivel').value;
  const fecha = document.getElementById('fecha').value;
  const costo = document.getElementById('costo').value;

  try {
    const r = await fetch('/api/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre,instructor, horas, nivel, fecha, costo })
    });

    const data = await r.json();

    if (!r.ok) {
      toastr.error(data.error || 'No se pudo registrar');
      return;
    }

    toastr.success('Registro exitoso ✅');

    // Limpia campos y recarga (como lo pediste)
    form.reset();
    location.reload();
  } catch (err) {
    console.error(err);
    toastr.error('Error al registrar');
  }
});

// Delegación de eventos para UPDATE y DELETE
tabla.addEventListener('click', async (e) => {
  const tr = e.target.closest('tr');
  if (!tr) return;

  const id = tr.dataset.id;

  // UPDATE
  if (e.target.classList.contains('editar')) {
    const nombre = tr.querySelector('.nombre').value;
    const instructor = tr.querySelector('.instructor').value;
    const horas = tr.querySelector('.horas').value;
    const nivel = tr.querySelector('.nivel').value;
    const fecha = tr.querySelector('.fecha').value;
    const costo = tr.querySelector('.costo').value;

    try {
      const r = await fetch(`/api/cursos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre,instructor, horas, nivel, fecha, costo })
      });

      const data = await r.json();

      if (!r.ok) {
        toastr.error(data.error || 'No se pudo actualizar');
        return;
      }

      // Se refleja automáticamente porque el usuario ya editó el input
      // (si quieres, aquí también podríamos volver a cargar la tabla)
      toastr.info('Curso actualizado ');
    } catch (err) {
      console.error(err);
      toastr.error('Error al actualizar');
    }
  }

  // DELETE
if (e.target.classList.contains('eliminar')) {

    const result = await Swal.fire({
        title: '¿Está seguro de eliminar el curso?',
        text: 'No podrá revertir esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      const r = await fetch(`/api/cursos/${id}`, { method: 'DELETE' });
      const data = await r.json();

      if (!r.ok) {
        toastr.error(data.error || 'No se pudo eliminar');
        return;
      }

      // Quitar la fila del DOM (sin recargar)
      tr.remove();
      toastr.success('Curso eliminado ✅');
    } catch (err) {
      console.error(err);
      toastr.error('Error al eliminar');
    }
  }
});

// Evita romper HTML al imprimir valores
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}