const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '', // cambiá si usás contraseña
  database: process.env.DB_NAME || 'sistema_turismo'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err.message);
  } else {
    console.log('📡 Conectado a MySQL correctamente');
  }
});

module.exports = db;