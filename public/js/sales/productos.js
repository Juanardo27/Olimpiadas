// IIFE para proteger el scope y ejecutar el código al cargar la página
(async () => {
  // Verifica usuario logueado y permisos de jefe
  const user = JSON.parse(localStorage.getItem('usuario'));
  if (!user || user.tipo_usuario !== 'jefe') {
    alert('Acceso no autorizado');
    return location.href = '/login';
  }

  // Referencias a elementos del DOM
  const form = document.getElementById('formProducto');
  const tabla = document.querySelector('#tablaProductos tbody');
  const btnGuardar = document.getElementById('btnGuardar');
  const btnCancelar = document.getElementById('btnCancelar');

  // Carga y muestra los productos en la tabla
  async function cargarProductos() {
    const res = await fetch('/api/productos');
    const productos = await res.json();
    tabla.innerHTML = '';

    // Si no hay productos, muestra mensaje
    if (!productos.length) {
      tabla.innerHTML = '<tr><td colspan="8">📭 No hay productos</td></tr>';
      return;
    }

    // Recorre los productos y genera las filas de la tabla
    productos.forEach(p => {
      const estado = p.activo ? 'Publicado' : 'Eliminado';

      // Botones según estado del producto
      const botones = p.activo
        ? `
          <button class="btn-editar" onclick='editar(${JSON.stringify(p)})'>Editar</button>
          <button class="btn-eliminar" onclick='eliminar(${p.id_producto})'>X</button>
        `
        : `<button class="btn-comprar" onclick='restaurar(${p.id_producto})'>Restaurar</button>`;

      // Agrega la fila a la tabla
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

  // Llena el formulario con los datos del producto a editar
  window.editar = (p) => {
    form.id_producto.value = p.id_producto;
    form.codigo_producto.value = p.codigo_producto;
    form.descripcion.value = p.descripcion;
    form.precio.value = p.precio;
    form.stock.value = p.stock;
    form.id_categoria.value = p.id_categoria;

    btnGuardar.textContent = 'Guardar Cambios';
    btnGuardar.style.marginBottom = '20px'
    btnCancelar.style.display = 'inline-block';
  };

  // Elimina (desactiva) un producto
  window.eliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
    if (res.ok) await cargarProductos();
    else alert('⛔ Error al eliminar producto');
  };

  // Restaura un producto eliminado
  window.restaurar = async (id) => {
    if (!confirm('¿Restaurar este producto?')) return;
    const res = await fetch(`/api/productos/restaurar/${id}`, { method: 'PATCH' });
    if (res.ok) await cargarProductos();
    else alert('⛔ Error al restaurar producto');
  };

  // Cancela la edición y limpia el formulario
  btnCancelar.addEventListener('click', () => {
    form.reset();
    form.id_producto.value = '';
    btnGuardar.textContent = 'Agregar Producto';
    btnCancelar.style.display = 'none';
  });

  // Maneja el envío del formulario para agregar o editar productos
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Obtiene los datos del formulario
    const data = {
      codigo_producto: form.codigo_producto.value,
      descripcion: form.descripcion.value,
      precio: parseFloat(form.precio.value),
      stock: parseInt(form.stock.value),
      id_categoria: parseInt(form.id_categoria.value),
      modificado_por: user.id_usuario
    };

    const id = form.id_producto.value;

    // Envía la petición correspondiente (POST para agregar, PUT para editar)
    const res = await fetch(id ? `/api/productos/${id}` : '/api/productos', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // Si la petición fue exitosa, recarga la tabla y limpia el formulario
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

  // Carga los productos al iniciar
  await cargarProductos();
})();