require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacto', require('./routes/contacto'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/reportes', require('./routes/reportes'));

// Rutas HTML
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

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
