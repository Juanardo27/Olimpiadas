const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'claveSecreta123'; // En producción, usá una variable de entorno

// REGISTRO
router.post('/registro', async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  db.query('SELECT * FROM Usuario WHERE email = ?', [email], async (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al verificar email' });
    if (resultados.length > 0) return res.status(409).json({ error: 'Correo ya registrado' });

    try {
      const hash = await bcrypt.hash(password, 10);

      const sqlUsuario = `
        INSERT INTO Usuario (nombre, apellido, email, contraseña, tipo_usuario, activo)
        VALUES (?, ?, ?, ?, 'cliente', 1)
      `;

      db.query(sqlUsuario, [nombre, apellido, email, hash], (err, resultado) => {
        if (err) return res.status(500).json({ error: 'Error al registrar usuario' });

        const id_usuario = resultado.insertId;
        const fechaRegistro = new Date();

        const sqlCliente = `
          INSERT INTO Cliente (id_usuario, fecha_registro)
          VALUES (?, ?)
        `;

        db.query(sqlCliente, [id_usuario, fechaRegistro], (err2) => {
          if (err2) return res.status(500).json({ error: 'Usuario creado pero falló insertar Cliente' });

          const token = jwt.sign({ id_usuario, tipo: 'cliente', email }, SECRET);

          res.status(200).json({
            mensaje: 'Usuario y cliente registrados con éxito',
            token,
            primeraVez: true
          });
        });
      });
    } catch (err) {
      res.status(500).json({ error: 'Error al encriptar la contraseña' });
    }
  });
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM Usuario WHERE email = ?', [email], async (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al buscar usuario' });
    if (resultados.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const usuario = resultados[0];
    const valido = await bcrypt.compare(password, usuario.contraseña);
    if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        tipo: usuario.tipo_usuario,
        email: usuario.email
      },
      SECRET
    );

    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        tipo: usuario.tipo_usuario
      }
    });
  });
});

module.exports = router;