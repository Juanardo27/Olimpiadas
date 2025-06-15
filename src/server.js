const express = require('express');
const app = express();
const path = require('path');
const authRoutes = require('./routes/auth');

// Middleware para recibir JSON
app.use(express.json());

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de autenticación
app.use(authRoutes);

// Redirigir '/' al home directamente
app.get('/', (req, res) => {
  res.redirect('/pages/home.html');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});