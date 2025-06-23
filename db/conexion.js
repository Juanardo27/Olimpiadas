// db/conexion.js
const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // o el usuario que uses
  password: '',        // o la contraseña que tengas
  database: 'sistema_turismo'
});

conexion.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a la BD:', err);
  } else {
    console.log('✅ Conectado a la base de datos sistema_turismo');
  }
});

module.exports = conexion;
