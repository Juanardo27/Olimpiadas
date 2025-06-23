const r = require('express').Router();
const db = require('../db/conexion');
const bcrypt = require('bcrypt');

// REGISTRO
r.post('/register', async (req, res) => {
  const { nombre, apellido, email, contraseña } = req.body;

  if (!nombre || !apellido || !email || !contraseña)
    return res.status(400).send('Faltan datos');

  db.query('SELECT * FROM Usuario WHERE email = ?', [email], async (e, r2) => {
    if (e) return res.status(500).send('Error al buscar usuario');
    if (r2.length) return res.status(400).send('Ya existe un usuario con ese correo');

    const passHash = await bcrypt.hash(contraseña, 10);

    db.query(
      'INSERT INTO Usuario (nombre, apellido, email, contraseña, tipo_usuario, activo) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellido, email, passHash, 'cliente', true],
      (err, resultado) => {
        if (err) return res.status(500).send('Error al registrar usuario');

        const id_usuario = resultado.insertId;

        db.query(
          'INSERT INTO Cliente (id_usuario, fecha_registro) VALUES (?, NOW())',
          [id_usuario],
          err2 => {
            if (err2) return res.status(500).send('Error al crear cliente');
            res.sendStatus(200);
          }
        );
      }
    );
  });
});

// LOGIN
r.post('/login', (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña)
    return res.status(400).send('Faltan datos');

  db.query('SELECT * FROM Usuario WHERE email = ?', [email], async (e, r2) => {
    if (e) return res.status(500).send('Error al buscar usuario');
    if (!r2.length) return res.status(401).send('Usuario no encontrado');

    const usuario = r2[0];
    const valid = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!valid) return res.status(401).send('Contraseña incorrecta');

    if (usuario.tipo_usuario === 'cliente') {
      db.query(
        'SELECT id_cliente FROM Cliente WHERE id_usuario = ?',
        [usuario.id_usuario],
        (err2, r3) => {
          if (err2 || !r3.length)
            return res.status(500).send('Error al obtener cliente');

          const id_cliente = r3[0].id_cliente;

          res.json({
            id_usuario: usuario.id_usuario,
            id_cliente,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            tipo_usuario: usuario.tipo_usuario
          });
        }
      );
    } else {
      // Jefes u otros usuarios
      res.json({
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        tipo_usuario: usuario.tipo_usuario
      });
    }
  });
});

module.exports = r;
