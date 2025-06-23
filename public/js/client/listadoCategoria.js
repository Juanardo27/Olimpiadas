(async () => {
  const user = JSON.parse(localStorage.getItem('usuario'));
  if (!user || user.tipo_usuario !== 'cliente') {
    alert('Ingresá como cliente.');
    return window.location = '/login';
  }

  const script = document.currentScript;
  const categoria = parseInt(script.dataset.categoria);
  const res = await fetch('/api/productos');
  const productos = await res.json();
  const cont = document.getElementById('listaProductos');

  cont.innerHTML = productos
    .filter(p => p.id_categoria === categoria)
    .map(p => {
      const sinStock = p.stock === 0;
      return `
        <div class="paquete-card">
          <div class="contenido">
            <p>${p.descripcion}</p>
            <p><strong>$${p.precio}</strong></p>
            <p class="subtitulo">Stock: ${p.stock}</p>
            <button onclick="agregarAlCarrito(${p.id_producto}, ${p.precio})" ${sinStock ? 'disabled' : ''}>
              ${sinStock ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      `;
    }).join('');

  window.agregarAlCarrito = async (id, precio) => {
    const resp = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clienteId: user.id_cliente,
        productoId: id,
        cantidad: 1,
        subtotal: precio
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      return alert('⛔ Error: ' + err);
    }

    alert('✅ Producto agregado al carrito');
  };
})();
