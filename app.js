const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const dbConfig = {
  host: 'localhost',
  user: 'CarlaV',
  password: 'Vazmaga2*',
  database: 'cursos',
};

// ================= USUARIOS =================
app.post('/api/usuarios/registro', async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const hash = await bcrypt.hash(password, 10);

    const conn = await mysql.createConnection(dbConfig);
    await conn.execute(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hash, rol || 'usuario']
    );
    await conn.end();

    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

app.post('/api/usuarios/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    await conn.end();

    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    res.json({ ok: true, usuario: { id: user.id, nombre: user.nombre, rol: user.rol } });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// ================= CURSOS =================
app.get('/api/cursos', async (req, res) => {
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute('SELECT * FROM cursos ORDER BY id DESC');
  await conn.end();
  res.json(rows);
});

app.post('/api/cursos', async (req, res) => {
  const { nombre, instructor, horas, nivel, fecha, costo } = req.body;

  if (!nombre || !instructor || !horas || !nivel || !fecha || !costo) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const conn = await mysql.createConnection(dbConfig);
  await conn.execute(
    'INSERT INTO cursos (nombre, instructor, horas, nivel, fecha, costo) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, instructor, horas, nivel, fecha, costo]
  );
  await conn.end();

  res.json({ ok: true });
});

app.put('/api/cursos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, instructor, horas, nivel, fecha, costo } = req.body;

  const conn = await mysql.createConnection(dbConfig);
  await conn.execute(
    'UPDATE cursos SET nombre=?, instructor=?, horas=?, nivel=?, fecha=?, costo=? WHERE id=?',
    [nombre, instructor, horas, nivel, fecha, costo, id]
  );
  await conn.end();

  res.json({ ok: true });
});

app.delete('/api/cursos/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute('DELETE FROM cursos WHERE id=?', [id]);
  await conn.end();
  res.json({ ok: true });
});

app.listen(PORT, () => console.log('Servidor en http://localhost:' + PORT));