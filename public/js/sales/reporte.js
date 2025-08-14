// IIFE para proteger el scope y ejecutar el código al cargar la página
(async () => {
  // Verifica usuario logueado y permisos de jefe
  const user = JSON.parse(localStorage.getItem('usuario'));
  if (!user || user.tipo_usuario !== 'jefe') {
    alert('Ingresá como jefe de ventas.');
    return window.location = '/login';
  }

  // Solicita las ventas entregadas al backend
  const res = await fetch('/api/reportes/ventas/entregadas');
  const data = await res.json();
  const tbody = document.querySelector('#tablaReporte tbody');

  tbody.innerHTML = '';

  // Si no hay ventas entregadas, muestra mensaje
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="4">📭 No hay ventas entregadas registradas</td></tr>';
    return;
  }

  // Recorre las ventas y genera las filas de la tabla
  data.forEach(r => {
    const fecha = new Date(r.fecha_venta).toLocaleDateString();
    tbody.innerHTML += `
      <tr>
        <td>${r.id_pedido}</td>
        <td>${r.nombre}</td>
        <td>${fecha}</td>
        <td>$${r.monto_final}</td>
      </tr>`;
  });
})();