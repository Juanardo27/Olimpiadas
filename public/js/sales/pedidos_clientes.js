// IIFE para proteger el scope y ejecutar el código al cargar la página
(async () => {
  // Obtiene el usuario logueado desde localStorage y verifica permisos
  const user = JSON.parse(localStorage.getItem('usuario'));
  if (!user || user.tipo_usuario !== 'jefe') {
    alert('Acceso denegado');
    return location.href = '/login';
  }

  // Referencias a elementos del DOM
  const tabla = document.querySelector('#tablaPedidos tbody');
  const modal = document.getElementById('modalDetalle');
  const modalBody = document.getElementById('detalleBody');
  const modalClose = document.getElementById('cerrarModal');

  // Función para cargar y mostrar los pedidos en la tabla
  async function cargarPedidos() {
    const res = await fetch('/api/reportes/pedidos');
    const pedidos = await res.json();

    tabla.innerHTML = '';

    // Si no hay pedidos, muestra mensaje
    if (!pedidos.length) {
      tabla.innerHTML = '<tr><td colspan="6">📭 No hay pedidos</td></tr>';
      return;
    }

    // Recorre los pedidos y genera las filas de la tabla
    pedidos.forEach(p => {
      const botones = [];

      // Si el pedido está confirmado, muestra botones de entregar/cancelar
      if (p.estado === 'confirmado') {
        botones.push(`<button onclick="entregar(${p.id_pedido})">✅ Entregar</button>`);
        botones.push(`<button onclick="cancelar(${p.id_pedido})">❌ Cancelar</button>`);
      }

      // Botón para ver detalle del pedido
      botones.push(`<button onclick="verDetalle(${p.id_pedido})">📄 Detalle</button>`);

      // Agrega la fila a la tabla
      tabla.innerHTML += `
        <tr>
          <td>${p.id_pedido}</td>
          <td>${p.fecha_pedido.split('T')[0]}</td>
          <td>${p.cliente}</td>
          <td>$${p.total}</td>
          <td>${p.estado}</td>
          <td>${botones.join(' ')}</td>
        </tr>
      `;
    });
  }

  // Marca un pedido como entregado
  window.entregar = async (id) => {
    const confirmar = confirm('¿Marcar como entregado?');
    if (!confirmar) return;

    const res = await fetch(`/api/reportes/entregar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jefeId: user.id_usuario })
    });

    if (res.ok) await cargarPedidos();
    else alert('⛔ Error al entregar');
  };

  // Cancela un pedido
  window.cancelar = async (id) => {
    const confirmar = confirm('¿Cancelar el pedido? Esta acción es irreversible.');
    if (!confirmar) return;

    const res = await fetch(`/api/reportes/cancelar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jefeId: user.id_usuario })
    });

    if (res.ok) await cargarPedidos();
    else alert('⛔ Error al cancelar');
  };

  // Muestra el detalle de un pedido en un modal
  window.verDetalle = async (id) => {
    const res = await fetch(`/api/reportes/detalle/${id}`);
    const detalles = await res.json();

    modalBody.innerHTML = '';
    detalles.forEach(d => {
      modalBody.innerHTML += `
        <tr>
          <td>${d.descripcion}</td>
          <td>$${d.precio}</td>
          <td>${d.cantidad}</td>
          <td>$${d.subtotal}</td>
        </tr>
      `;
    });

    modal.showModal();
  };

  // Cierra el modal de detalle
  modalClose.onclick = () => modal.close();

  // Carga los pedidos al iniciar
  await cargarPedidos();
})();