const r = require('express').Router();
const db = require('../db/conexion');
const enviarCorreo = require('../utils/mailer');

// 📦 Agregar producto al carrito con verificación de stock
r.post('/', (req, res) => {
  const { clienteId, productoId, cantidad, subtotal } = req.body;
  const fecha = new Date().toISOString().split('T')[0];

  if (!clienteId || !productoId || !cantidad) return res.status(400).send('Faltan datos');

  // Verificamos el stock disponible
  db.query('SELECT stock FROM Producto WHERE id_producto = ?', [productoId], (err, rStock) => {
    if (err || !rStock.length) return res.status(500).send('Error al consultar stock');
    const stockActual = rStock[0].stock;

    if (stockActual < cantidad) return res.status(400).send('No hay stock disponible');

    db.query('SELECT * FROM Pedido WHERE id_cliente = ? AND estado = "pendiente"', [clienteId], (err, pedidos) => {
      if (err) return res.status(500).send('Error al buscar pedido');

      const continuar = (id_pedido) => {
        db.query(
          'SELECT * FROM DetallePedido WHERE id_pedido = ? AND id_producto = ?',
          [id_pedido, productoId],
          (err2, detalles) => {
            if (err2) return res.status(500).send('Error al consultar detalle');

            if (detalles.length) {
              const detalle = detalles[0];
              const nuevaCantidad = detalle.cantidad + cantidad;

              if (nuevaCantidad > stockActual) {
                return res.status(400).send('No hay suficiente stock para esta cantidad');
              }

              const nuevoSubtotal = detalle.subtotal + subtotal;

              db.query(
                'UPDATE DetallePedido SET cantidad = ?, subtotal = ? WHERE id_detalle = ?',
                [nuevaCantidad, nuevoSubtotal, detalle.id_detalle],
                (err3) => {
                  if (err3) return res.status(500).send('Error al actualizar detalle');

                  db.query(
                    'UPDATE Pedido SET total = (SELECT SUM(subtotal) FROM DetallePedido WHERE id_pedido = ?) WHERE id_pedido = ?',
                    [id_pedido, id_pedido],
                    (err4) => err4 ? res.status(500).send('Error al actualizar total') : res.send('Actualizado')
                  );
                }
              );
            } else {
              db.query(
                'INSERT INTO DetallePedido (id_pedido, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)',
                [id_pedido, productoId, cantidad, subtotal],
                (err4) => {
                  if (err4) return res.status(500).send('Error al agregar producto');

                  db.query(
                    'UPDATE Pedido SET total = (SELECT SUM(subtotal) FROM DetallePedido WHERE id_pedido = ?) WHERE id_pedido = ?',
                    [id_pedido, id_pedido],
                    (err5) => err5 ? res.status(500).send('Error al actualizar total') : res.send('Agregado')
                  );
                }
              );
            }
          }
        );
      };

      if (pedidos.length) {
        continuar(pedidos[0].id_pedido);
      } else {
        db.query(
          'INSERT INTO Pedido (id_cliente, fecha_pedido, estado, total, entregado_por) VALUES (?, ?, ?, ?, NULL)',
          [clienteId, fecha, 'pendiente', subtotal],
          (err5, result) => {
            if (err5) {
              console.error('❌ Error al crear pedido:', err5);
              return res.status(500).send('Error al crear pedido');
            }
            continuar(result.insertId);
          }
        );
      }
    });
  });
});


// 🧾 Obtener productos del carrito
r.get('/clientes/:id', (req, res) => {
  const id = req.params.id;
  db.query(`
    SELECT dp.id_detalle, p.id_pedido, pr.id_producto, pr.descripcion, pr.precio, dp.cantidad, dp.subtotal
    FROM Pedido p
    JOIN DetallePedido dp ON p.id_pedido = dp.id_pedido
    JOIN Producto pr ON dp.id_producto = pr.id_producto
    WHERE p.id_cliente = ? AND p.estado = 'pendiente'
  `, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener productos del carrito:', err);
      return res.status(500).json([]);
    }
    res.json(result);
  });
});

// ✏️ Modificar cantidad y actualizar total
r.patch('/detalle/:id', (req, res) => {
  const { cantidad, subtotal } = req.body;

  db.query('UPDATE DetallePedido SET cantidad = ?, subtotal = ? WHERE id_detalle = ?',
    [cantidad, subtotal, req.params.id],
    (err) => {
      if (err) return res.status(500).send('Error al modificar producto');

      db.query('SELECT id_pedido FROM DetallePedido WHERE id_detalle = ?', [req.params.id], (err2, r2) => {
        if (err2 || !r2.length) return res.status(500).send('Error al obtener pedido');

        const id_pedido = r2[0].id_pedido;

        db.query(
          'UPDATE Pedido SET total = (SELECT SUM(subtotal) FROM DetallePedido WHERE id_pedido = ?) WHERE id_pedido = ?',
          [id_pedido, id_pedido],
          (err3) => err3 ? res.status(500).send('Error al actualizar total') : res.send('Cantidad y total actualizados')
        );
      });
    }
  );
});

// ❌ Eliminar producto y actualizar total
r.delete('/detalle/:id', (req, res) => {
  const id_detalle = req.params.id;

  db.query('SELECT id_pedido FROM DetallePedido WHERE id_detalle = ?', [id_detalle], (err, result) => {
    if (err || !result.length) return res.status(500).send('Error al buscar detalle');

    const id_pedido = result[0].id_pedido;

    db.query('DELETE FROM DetallePedido WHERE id_detalle = ?', [id_detalle], (err2) => {
      if (err2) return res.status(500).send('Error al eliminar producto');

      db.query(
        'UPDATE Pedido SET total = (SELECT IFNULL(SUM(subtotal), 0) FROM DetallePedido WHERE id_pedido = ?) WHERE id_pedido = ?',
        [id_pedido, id_pedido],
        (err3) => err3 ? res.status(500).send('Error al actualizar total') : res.send('Producto eliminado y total actualizado')
      );
    });
  });
});

// 🛍️ Finalizar compra
r.patch('/finalizar/:clienteId', (req, res) => {
  const clienteId = req.params.clienteId;
  const { metodo_pago } = req.body;

  db.query('SELECT * FROM Pedido WHERE id_cliente = ? AND estado = "pendiente"', [clienteId], (err, pedidos) => {
    if (err || !pedidos.length) {
      console.error('❌ Error al obtener pedido pendiente:', err);
      return res.status(400).send('No hay pedido pendiente');
    }

    const pedido = pedidos[0];

    db.query('SELECT SUM(subtotal) AS total FROM DetallePedido WHERE id_pedido = ?', [pedido.id_pedido], (err2, r2) => {
      if (err2) return res.status(500).send('Error al calcular total');

      const total = r2[0].total;

      db.query('UPDATE Pedido SET estado = "confirmado", total = ? WHERE id_pedido = ?', [total, pedido.id_pedido], (err3) => {
        if (err3) return res.status(500).send('Error al actualizar pedido');

        db.query(
          'INSERT INTO Venta (id_pedido, fecha_venta, monto_final, estado_pago, metodo_pago) VALUES (?, NOW(), ?, ?, ?)',
            [pedido.id_pedido, total, 'pendiente', metodo_pago],

          async (err4) => {
            if (err4) return res.status(500).send('Error al registrar venta');

            // Enviar email al cliente
            const clienteQuery = `
              SELECT u.email, u.nombre FROM Usuario u
              JOIN Cliente c ON u.id_usuario = c.id_usuario
              WHERE c.id_cliente = ?
            `;

            db.query(clienteQuery, [clienteId], async (e1, clienteData) => {
              if (e1 || !clienteData.length) return res.send('Compra finalizada');

              const cliente = clienteData[0];
              const asuntoCliente = '🛒 Confirmación de tu compra';
              const mensajeCliente = `
                <p>Hola ${cliente.nombre},</p>
                <p>Tu compra por $${total} fue registrada exitosamente.</p>
                <p>Gracias por confiar en nosotros.</p>
                <br>
                <p>Pronto estaremos contactandote para confirmar tu pedido.</p>
              `;

              try {
                await enviarCorreo({
                  para: cliente.email,
                  asunto: asuntoCliente,
                  mensaje: mensajeCliente
                });
              } catch (error) {
                console.error('❌ Error al enviar correo al cliente:', error);
              }

              // Enviar aviso a jefes de venta
              const jefesQuery = `SELECT email FROM Usuario WHERE tipo_usuario = 'jefe' AND activo = 1`;

              db.query(jefesQuery, async (e2, jefes) => {
                if (!e2 && jefes.length) {
                  const emails = jefes.map(j => j.email).join(', ');
                  const asunto = '🛒 Nueva compra pendiente de entrega';
                  const mensaje = `
                    <p>El cliente <b>${cliente.nombre}</b> ha realizado una compra.</p>
                    <p>Total: $${total}</p>
                    <p>Debe ser verificada y entregada.</p>
                  `;

                  try {
                    await enviarCorreo({ para: emails, asunto, mensaje });
                  } catch (errMail) {
                    console.error('❌ Error al enviar correo a jefes:', errMail);
                  }
                }

                res.send('Compra finalizada');
              });
            });
          }
        );
      });
    });
  });
});
// 🧹 Cancelar pedido completo
r.patch('/cancelar/:clienteId', (req, res) => {
  const clienteId = req.params.clienteId;

  db.query('SELECT id_pedido FROM Pedido WHERE id_cliente = ? AND estado = "pendiente"', [clienteId], (err, result) => {
    if (err || !result.length) return res.status(400).send('No hay pedido pendiente');

    const id_pedido = result[0].id_pedido;

    db.query('DELETE FROM DetallePedido WHERE id_pedido = ?', [id_pedido], err2 => {
      if (err2) return res.status(500).send('Error al eliminar productos');

      db.query('DELETE FROM Pedido WHERE id_pedido = ?', [id_pedido], err3 => {
        if (err3) return res.status(500).send('Error al eliminar pedido');
        res.send('Pedido cancelado');
      });
    });
  });
});
// 📜 Obtener historial de pedidos de un cliente
r.get('/historial/:clienteId', (req, res) => {
  const clienteId = req.params.clienteId;

  db.query(`
    SELECT p.id_pedido, p.fecha_pedido, p.estado, p.total, v.metodo_pago, v.estado_pago
    FROM Pedido p
    LEFT JOIN Venta v ON p.id_pedido = v.id_pedido
    WHERE p.id_cliente = ? AND p.estado != 'pendiente'
    ORDER BY p.fecha_pedido DESC
  `, [clienteId], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener historial:', err);
      return res.status(500).json([]);
    }
    res.json(result);
  });
});


module.exports = r;
