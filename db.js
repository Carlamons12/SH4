const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'CarlaV',
  user: 'Vazmaga2*',
  password: '',
  database: 'cursos'
});

module.exports = db;