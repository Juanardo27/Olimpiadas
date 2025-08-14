require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Middleware para parsear formularios y JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacto', require('./routes/contacto'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/reportes', require('./routes/reportes'));

// Rutas HTML principales (renderizan archivos de la carpeta views)
const map = [
    ['/', 'visitor/index.html'],
    ['/login', 'visitor/login.html'],
    ['/register', 'visitor/register.html'],
    ['/paquetes', 'client/paquetes.html'],
    ['/vuelos', 'client/vuelos.html'],
    ['/hoteles', 'client/hoteles.html'],
    ['/pedidos', 'client/pedidos.html'],
    ['/contacto', 'client/contacto.html'],
    ['/carrito', 'client/carrito.html'],
    ['/pedidos_clientes', 'sales/pedidos_clientes.html'],
    ['/productos', 'sales/productos.html'],
    ['/reporte', 'sales/reporte.html']
];
map.forEach(([r, file]) =>
  app.get(r, (req, res) => res.sendFile(path.join(__dirname, 'views', file)))
);

// Inicia el servidor en el puerto 3000
app.listen(3000, () => console.log('Servidor en http://localhost:3000'));