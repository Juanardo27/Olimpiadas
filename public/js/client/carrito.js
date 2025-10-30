// public/js/client/carrito.js
// Maneja la lógica del carrito del cliente: carga productos, modifica cantidades y finaliza/cancela pedido

(async () => {
  // Obtiene usuario logueado desde localStorage
  const user = JSON.parse(localStorage.getItem('usuario'));

  // Verifica que el usuario sea cliente, si no, redirige al login
  if (!user || user.tipo_usuario !== 'cliente') {
    alert('Ingresá como cliente.');
    return window.location = '/login';
  }

  // Referencias a elementos del DOM
  const tabla = document.querySelector('#tablaCarrito tbody');
  const totalElem = document.getElementById('totalCarrito');
  const metodoPago = document.getElementById('metodoPago');
  const finalizarBtn = document.getElementById('finalizar');
  const cancelarBtn = document.getElementById('cancelar');

  let total = 0;

  // Cargar productos del carrito desde API
  async function cargarCarrito() {
    try {
      const res = await fetch(`/api/pedidos/clientes/${user.id_cliente}`);
      const productos = await res.json();

      tabla.innerHTML = '';
      total = 0;

      // Si no hay productos, muestra mensaje y deshabilita botones
      if (!productos.length) {
        tabla.innerHTML = `<tr><td colspan="5">🛒 Tu carrito está vacío.</td></tr>`;
        finalizarBtn.disabled = true;
        cancelarBtn.disabled = true;
        totalElem.textContent = `$0.00`;
        return;
      }

      // Habilita botones y genera filas para cada producto
      finalizarBtn.disabled = false;
      cancelarBtn.disabled = false;

      productos.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        tabla.innerHTML += `
          <tr>
            <td>${p.descripcion || 'Producto'}</td>
            <td>$${p.precio}</td>
            <td>
              <input type="number" min="1" value="${p.cantidad}" 
                onchange="modificarCantidad(${p.id_detalle}, ${p.precio}, this.value)">
            </td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>
              <button class="btn-eliminar" onclick="eliminarProducto(${p.id_detalle})">X</button>
            </td>
          </tr>
        `;
      });

      totalElem.textContent = `$${total.toFixed(2)}`;
    } catch (err) {
      alert('⛔ Error al cargar el carrito');
      console.error(err);
    }
  }

  // Llamada inicial para mostrar carrito al cargar la página
  await cargarCarrito();

  // Finalizar compra: envía PATCH a la API con el método de pago
  finalizarBtn.onclick = async () => {
    const metodo = metodoPago.value;
    if (!metodo) return alert('Seleccioná un método de pago.');

    const confirmar = confirm(`Total a pagar: $${total.toFixed(2)}\n¿Finalizar compra con ${metodo}?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/pedidos/finalizar/${user.id_cliente}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metodo_pago: metodo })
      });

      if (res.ok) {
        alert('🎉 Compra realizada con éxito');
        window.location = '/pedidos';
      } else {
        const err = await res.text();
        alert('⛔ Error: ' + err);
      }
    } catch (err) {
      alert('⛔ Error al finalizar compra');
      console.error(err);
    }
  };

  // Cancelar pedido completo
  cancelarBtn.onclick = async () => {
    const confirmar = confirm('¿Cancelar el pedido completo?');
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/pedidos/cancelar/${user.id_cliente}`, { method: 'PATCH' });

      if (res.ok) {
        alert('🗑️ Pedido cancelado.');
        await cargarCarrito();
      } else {
        const err = await res.text();
        alert('⛔ Error: ' + err);
      }
    } catch (err) {
      alert('⛔ Error al cancelar pedido');
      console.error(err);
    }
  };

  // Función para modificar cantidad desde el input en la tabla
  window.modificarCantidad = async (id_detalle, precio, nuevaCantidad) => {
    nuevaCantidad = parseInt(nuevaCantidad);
    if (nuevaCantidad < 1) return alert('Cantidad inválida');

    const nuevoSubtotal = nuevaCantidad * precio;

    try {
      const res = await fetch(`/api/pedidos/detalle/${id_detalle}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: nuevaCantidad, subtotal: nuevoSubtotal })
      });

      if (res.ok) {
        await cargarCarrito();
      } else {
        const err = await res.text();
        alert('⛔ Error al modificar cantidad: ' + err);
      }
    } catch (err) {
      alert('⛔ Error inesperado al modificar cantidad');
      console.error(err);
    }
  };

  // Eliminar un producto del carrito
  window.eliminarProducto = async (id_detalle) => {
    const confirmar = confirm('¿Eliminar este producto del carrito?');
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/pedidos/detalle/${id_detalle}`, { method: 'DELETE' });

      if (res.ok) {
        await cargarCarrito();
      } else {
        const err = await res.text();
        alert('⛔ Error al eliminar producto: ' + err);
      }
    } catch (err) {
      alert('⛔ Error inesperado al eliminar producto');
      console.error(err);
    }
  };
})();