const jwt = require('jsonwebtoken');

const SECRET = 'claveSecreta123'; // 🔐 Usá process.env.JWT_SECRET en producción

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificamos si vino el header "Authorization: Bearer token..."
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado: token ausente' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded; // Ahora en cualquier ruta, podés usar req.usuario
    next(); // continúa a la ruta protegida
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = verificarToken;