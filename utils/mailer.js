const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const enviarCorreo = async ({ para, asunto, mensaje }) => {
  await transporter.sendMail({
    from: `"Viajes Chuares" <${process.env.MAIL_USER}>`,
    to: para,
    subject: asunto,
    html: mensaje
  });
};

module.exports = enviarCorreo;
