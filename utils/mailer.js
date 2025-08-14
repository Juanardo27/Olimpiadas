const nodemailer = require('nodemailer');

// Configura el transporte de correo usando variables de entorno
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// Función utilitaria para enviar correos electrónicos
const enviarCorreo = async ({ para, asunto, mensaje }) => {
  await transporter.sendMail({
    from: `"Viajes Chuares" <${process.env.MAIL_USER}>`,
    to: para,
    subject: asunto,
    html: mensaje
  });
};

module.exports = enviarCorreo;