const r = require('express').Router();
const db = require('../db/conexion');
const enviarCorreo = require('../utils/mailer');

// 📦 Obtener todos los pedidos (confirmado, entregado o cancelado)
r.get('/pedidos', (req, res) => {
  db.query(`
    SELECT p.id_pedido, p.fecha_pedido, p.total, p.estado, u.nombre AS cliente, p.entregado_por
    FROM Pedido p
    JOIN Cliente c ON p.id_cliente = c.id_cliente
    JOIN Usuario u ON c.id_usuario = u.id_usuario
    WHERE p.estado IN ('confirmado', 'entregado', 'cancelado')
    ORDER BY p.fecha_pedido DESC
  `, (err, result) => {
    if (err) return res.status(500).json([]);
    res.json(result);
  });
});

// 🔍 Obtener detalle de pedido
r.get('/detalle/:id', (req, res) => {
  db.query(`
    SELECT pr.descripcion, pr.precio, dp.cantidad, dp.subtotal
    FROM DetallePedido dp
    JOIN Producto pr ON dp.id_producto = pr.id_producto
    WHERE dp.id_pedido = ?
  `, [req.params.id], (e, r2) => e ? res.status(500).json([]) : res.json(r2));
});

// 🚚 Marcar pedido como entregado
r.patch('/entregar/:id', (req, res) => {
  const id = req.params.id;
  const { jefeId } = req.body;

  db.query('UPDATE Pedido SET estado = "entregado", entregado_por = ? WHERE id_pedido = ?', [jefeId, id], err => {
    if (err) return res.status(500).send('Error al entregar pedido');

    db.query('UPDATE Venta SET estado_pago = "pagado" WHERE id_pedido = ?', [id]);

    const q = `
      SELECT u.email, u.nombre FROM Usuario u
      JOIN Cliente c ON u.id_usuario = c.id_usuario
      JOIN Pedido p ON p.id_cliente = c.id_cliente
      WHERE p.id_pedido = ?
    `;
    db.query(q, [id], async (e2, r2) => {
      if (!e2 && r2.length) {
        const { email, nombre } = r2[0];
        await enviarCorreo({
          para: email,
          asunto: '📦 Pedido entregado',
          mensaje: `<p>Hola ${nombre}, tu pedido fue marcado como entregado. Nos estaremos comunicando para coordinar vuelo y/o hospedaje.</p>`
        });
      }
      res.send('Pedido entregado');
    });
  });
});

// ❌ Rechazar pedido
r.patch('/cancelar/:id', (req, res) => {
  const id = req.params.id;
  const { jefeId } = req.body;

  db.query('UPDATE Pedido SET estado = "cancelado", entregado_por = ? WHERE id_pedido = ?', [jefeId, id], err => {
    if (err) return res.status(500).send('Error al cancelar pedido');

    db.query('UPDATE Venta SET estado_pago = "rechazado" WHERE id_pedido = ?', [id]);

    const q = `
      SELECT u.email, u.nombre FROM Usuario u
      JOIN Cliente c ON u.id_usuario = c.id_usuario
      JOIN Pedido p ON p.id_cliente = c.id_cliente
      WHERE p.id_pedido = ?
    `;
    db.query(q, [id], async (e2, r2) => {
      if (!e2 && r2.length) {
        const { email, nombre } = r2[0];
        await enviarCorreo({
          para: email,
          asunto: '❌ Pedido cancelado',
          mensaje: `<p>Hola ${nombre}, lamentamos informarte que tu pedido ha sido cancelado por el equipo de ventas.</p>`
        });
      }
      res.send('Pedido cancelado');
    });
  });
});

// 📊 Reporte de ventas por cliente entregadas por el jefe logueado
r.get('/ventas/por-cliente/:id_jefe', (req, res) => {
  const jefeId = req.params.id_jefe;

  db.query(`
    SELECT u.nombre, v.fecha_venta, SUM(v.monto_final) AS total
    FROM Venta v
    JOIN Pedido p ON v.id_pedido = p.id_pedido
    JOIN Cliente c ON p.id_cliente = c.id_cliente
    JOIN Usuario u ON c.id_usuario = u.id_usuario
    WHERE p.estado = 'entregado' AND p.entregado_por = ?
    GROUP BY u.nombre, v.fecha_venta
    ORDER BY v.fecha_venta DESC
  `, [jefeId], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener reporte:', err);
      return res.status(500).json([]);
    }
    res.json(result);
  });
});
// 📊 Reporte general de ventas entregadas (para todos los jefes)
r.get('/ventas/entregadas', (req, res) => {
  db.query(`
    SELECT v.id_pedido, u.nombre, v.fecha_venta, v.monto_final
    FROM Venta v
    JOIN Pedido p ON v.id_pedido = p.id_pedido
    JOIN Cliente c ON p.id_cliente = c.id_cliente
    JOIN Usuario u ON c.id_usuario = u.id_usuario
    WHERE p.estado = 'entregado'
    ORDER BY v.fecha_venta DESC
  `, (err, result) => {
    if (err) {
      console.error('❌ Error al obtener reporte general:', err);
      return res.status(500).json([]);
    }
    res.json(result);
  });
});

module.exports = r;
