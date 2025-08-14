const r = require('express').Router();
const db = require('../db/conexion');
const enviarCorreo = require('../utils/mailer');

// 📨 Enviar mensaje al sector de atención al cliente
r.post('/', (req, res) => {
  const { asunto, mensaje } = req.body;

  // Valida que no falten campos obligatorios
  if (!asunto || !mensaje) return res.status(400).send('Faltan campos');

  // Buscar email del sector de atención al cliente desde la base de datos
  const sql = `SELECT email_sector FROM CorreoDestino WHERE sector = 'Atención al cliente'`;

  db.query(sql, (err, resultado) => {
    if (err || !resultado.length) {
      console.error('❌ Error al obtener el correo del sector:', err);
      return res.status(500).send('Error al obtener destino');
    }

    const emailDestino = resultado[0].email_sector;

    // Enviar el correo usando la utilidad de mailer
    enviarCorreo({
      para: emailDestino,
      asunto: `📩 Contacto: ${asunto}`,
      mensaje: `<p>${mensaje}</p>`
    })
      .then(() => res.send('Mensaje enviado'))
      .catch((errMail) => {
        console.error('❌ Error al enviar mensaje:', errMail);
        res.status(500).send('Error al enviar mensaje');
      });
  });
});

module.exports = r;
