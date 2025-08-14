const r = require('express').Router();
const db = require('../db/conexion');

// ✅ Obtener todos los productos (activos y eliminados)
r.get('/', (req, res) => {
  db.query('SELECT * FROM Producto', (e, r2) =>
    e ? res.status(500).json([]) : res.json(r2)
  );
});

// ✅ Crear nuevo producto
r.post('/', (req, res) => {
  const { codigo_producto, descripcion, precio, stock, id_categoria, modificado_por } = req.body;

  // Valida datos obligatorios
  if (!codigo_producto || !descripcion || !precio || !stock || !id_categoria || !modificado_por) {
    return res.status(400).send('Faltan datos obligatorios');
  }

  db.query(
    `INSERT INTO Producto 
     (codigo_producto, descripcion, precio, stock, id_categoria, activo, modificado_por) 
     VALUES (?, ?, ?, ?, ?, 1, ?)`,
    [codigo_producto, descripcion, precio, stock, id_categoria, modificado_por],
    e => e ? res.status(500).send('Error al insertar producto') : res.send('Producto creado')
  );
});

// ✅ Actualizar producto existente
r.put('/:id', (req, res) => {
  const { id } = req.params;
  const { codigo_producto, descripcion, precio, stock, id_categoria, modificado_por } = req.body;

  // Valida datos obligatorios
  if (!codigo_producto || !descripcion || !precio || !stock || !id_categoria || !modificado_por) {
    return res.status(400).send('Faltan datos obligatorios');
  }

  db.query(
    `UPDATE Producto 
     SET codigo_producto = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ?, modificado_por = ?
     WHERE id_producto = ?`,
    [codigo_producto, descripcion, precio, stock, id_categoria, modificado_por, id],
    e => e ? res.status(500).send('Error al actualizar producto') : res.send('Producto actualizado')
  );
});

// ✅ Baja lógica (eliminar producto)
r.delete('/:id', (req, res) => {
  db.query(
    'UPDATE Producto SET activo = 0 WHERE id_producto = ?',
    [req.params.id],
    e => e ? res.status(500).send('Error al eliminar producto') : res.send('Producto dado de baja')
  );
});

// ✅ Restaurar producto
r.patch('/restaurar/:id', (req, res) => {
  db.query(
    'UPDATE Producto SET activo = 1 WHERE id_producto = ?',
    [req.params.id],
    e => e ? res.status(500).send('Error al restaurar producto') : res.send('Producto restaurado')
  );
});

// ✅ Obtener productos por categoría
r.get('/categoria/:id', (req, res) => {
  const id_categoria = req.params.id;

  db.query(
    'SELECT * FROM Producto WHERE id_categoria = ? AND activo = 1',
    [id_categoria],
    (e, r2) => e ? res.status(500).json([]) : res.json(r2)
  );
});

module.exports = r;