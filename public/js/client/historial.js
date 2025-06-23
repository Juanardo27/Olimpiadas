(async () => {
    const user = JSON.parse(localStorage.getItem('usuario'));
  if (!user || user.tipo_usuario !== 'cliente') {
    alert('Ingresá como cliente.');
    return location.href = '/login';
  }

  const tabla = document.querySelector('#tablaHistorial tbody');
  
  try {
      const res = await fetch(`/api/pedidos/historial/${user.id_cliente}`);
      const pedidos = await res.json();
      
      if (!pedidos.length) {
      tabla.innerHTML = `<tr><td colspan="5">📭 No tenés pedidos aún.</td></tr>`;
      return;
    }

    pedidos.forEach(p => {
        const fechaFormateada = new Date(p.fecha_pedido).toISOString().slice(0, 10).replace(/-/g, '/');
      tabla.innerHTML += `
        <tr>
          <td>${p.id_pedido}</td>
          <td>${fechaFormateada}</td>
          <td>${p.estado}</td>
          <td>$${p.total}</td>
          <td>${p.metodo_pago || '-'}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error('⛔ Error al cargar historial:', err);
    tabla.innerHTML = `<tr><td colspan="5">❌ Error al cargar datos.</td></tr>`;
  }
})();
