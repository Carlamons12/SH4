document.addEventListener('DOMContentLoaded', () => {
  cargarCursos();
});

async function cargarCursos() {
  try {
    const r = await fetch('/api/cursos');
    const cursos = await r.json();

    const cont = document.getElementById('listaCursos');

    cont.innerHTML = cursos.map(c => `
      <div class="card">
        <h3>${c.nombre}</h3>
        <p><b>Instructor:</b> ${c.instructor}</p>
        <p><b>Horas:</b> ${c.horas}</p>
        <p><b>Nivel:</b> ${c.nivel}</p>
        <p><b>Fecha:</b> ${c.fecha}</p>
        <p><b>Costo:</b> $${c.costo}</p>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
    alert('Error al cargar cursos');
  }

  
}

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('usuario'));

document.getElementById('nombreUsuario').textContent =
  `👤 ${user.nombre} (${user.rol})`;
});

function cerrarSesion() {
  localStorage.removeItem('usuario');
  window.location.href = 'index.html';
}