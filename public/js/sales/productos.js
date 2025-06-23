(async () => {
  const user = JSON.parse(localStorage.getItem('usuario'));
  if (!user || user.tipo_usuario !== 'jefe') {
    alert('Acceso no autorizado');
    return location.href = '/login';
  }

  const form = document.getElementById('formProducto');
  const tabla = document.querySelector('#tablaProductos tbody');
  const btnGuardar = document.getElementById('btnGuardar');
  const btnCancelar = document.getElementById('btnCancelar');

  async function cargarProductos() {
    const res = await fetch('/api/productos');
    const productos = await res.json();
    tabla.innerHTML = '';

    if (!productos.length) {
      tabla.innerHTML = '<tr><td colspan="8">📭 No hay productos</td></tr>';
      return;
    }

    productos.forEach(p => {
      const estado = p.activo ? 'Publicado' : 'Eliminado';

      const botones = p.activo
        ? `
          <button onclick='editar(${JSON.stringify(p)})'>✏️</button>
          <button onclick='eliminar(${p.id_producto})'>❌</button>
        `
        : `<button onclick='restaurar(${p.id_producto})'>🔁 Restaurar</button>`;

      tabla.innerHTML += `
        <tr>
          <td>${p.id_producto}</td>
          <td>${p.codigo_producto}</td>
          <td>${p.descripcion}</td>
          <td>$${p.precio}</td>
          <td>${p.stock}</td>
          <td>${p.id_categoria}</td>
          <td>${estado}</td>
          <td>${botones}</td>
        </tr>
      `;
    });
  }

  window.editar = (p) => {
    form.id_producto.value = p.id_producto;
    form.codigo_producto.value = p.codigo_producto;
    form.descripcion.value = p.descripcion;
    form.precio.value = p.precio;
    form.stock.value = p.stock;
    form.id_categoria.value = p.id_categoria;

    btnGuardar.textContent = 'Guardar Cambios';
    btnCancelar.style.display = 'inline-block';
  };

  window.eliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
    if (res.ok) await cargarProductos();
    else alert('⛔ Error al eliminar producto');
  };

  window.restaurar = async (id) => {
    if (!confirm('¿Restaurar este producto?')) return;
    const res = await fetch(`/api/productos/restaurar/${id}`, { method: 'PATCH' });
    if (res.ok) await cargarProductos();
    else alert('⛔ Error al restaurar producto');
  };

  btnCancelar.addEventListener('click', () => {
    form.reset();
    form.id_producto.value = '';
    btnGuardar.textContent = 'Agregar Producto';
    btnCancelar.style.display = 'none';
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const data = {
      codigo_producto: form.codigo_producto.value,
      descripcion: form.descripcion.value,
      precio: parseFloat(form.precio.value),
      stock: parseInt(form.stock.value),
      id_categoria: parseInt(form.id_categoria.value),
      modificado_por: user.id_usuario
    };

    const id = form.id_producto.value;

    const res = await fetch(id ? `/api/productos/${id}` : '/api/productos', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      await cargarProductos();
      form.reset();
      form.id_producto.value = '';
      btnGuardar.textContent = 'Agregar Producto';
      btnCancelar.style.display = 'none';
    } else {
      const err = await res.text();
      alert('⛔ Error: ' + err);
    }
  });

  await cargarProductos();
})();
