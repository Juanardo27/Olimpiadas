(async () => {
  const user = JSON.parse(localStorage.getItem('usuario'));
  if (!user || user.tipo_usuario !== 'jefe') {
    alert('Acceso denegado');
    return location.href = '/login';
  }

  const tabla = document.querySelector('#tablaPedidos tbody');
  const modal = document.getElementById('modalDetalle');
  const modalBody = document.getElementById('detalleBody');
  const modalClose = document.getElementById('cerrarModal');

  async function cargarPedidos() {
    const res = await fetch('/api/reportes/pedidos');
    const pedidos = await res.json();

    tabla.innerHTML = '';

    if (!pedidos.length) {
      tabla.innerHTML = '<tr><td colspan="6">📭 No hay pedidos</td></tr>';
      return;
    }

    pedidos.forEach(p => {
      const botones = [];

      if (p.estado === 'confirmado') {
        botones.push(`<button onclick="entregar(${p.id_pedido})">✅ Entregar</button>`);
        botones.push(`<button onclick="cancelar(${p.id_pedido})">❌ Cancelar</button>`);
      }

      botones.push(`<button onclick="verDetalle(${p.id_pedido})">📄 Detalle</button>`);

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

  modalClose.onclick = () => modal.close();

  await cargarPedidos();
})();
