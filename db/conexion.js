// db/conexion.js
// Configura y establece la conexión con la base de datos MySQL

const mysql = require('mysql2'); // Importa el módulo para trabajar con MySQL

// Crea la conexión con las credenciales y la base de datos especificada
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Usuario de la BD (ajustar según configuración)
  password: '',        // Contraseña del usuario (si aplica)
  database: 'sistema_turismo' // Nombre de la base de datos
});

// Verifica la conexión e informa en consola si hay errores o si se conectó correctamente
conexion.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a la BD:', err);
  } else {
    console.log('✅ Conectado a la base de datos sistema_turismo');
  }
});

// Exporta la conexión para ser usada en otros módulos
module.exports = conexion;