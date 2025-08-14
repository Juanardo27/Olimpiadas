(async () => {
  // Obtenemos el usuario desde el localStorage y lo parseamos de JSON a objeto
  const user = JSON.parse(localStorage.getItem('usuario'));

  // Validamos que el usuario esté logueado y sea de tipo "cliente"
  if (!user || user.tipo_usuario !== 'cliente') {
    alert('Ingresá como cliente.');
    return window.location = '/login'; // Redirigimos al login si no cumple
  }

  // Obtenemos el script actual para acceder a su atributo data-categoria
  const script = document.currentScript;
  const categoria = parseInt(script.dataset.categoria); // ID de la categoría a mostrar

  // Consultamos la API para traer todos los productos
  const res = await fetch('/api/productos');
  const productos = await res.json();

  // Seleccionamos el contenedor donde se mostrarán los productos
  const cont = document.getElementById('listaProductos');

  // Filtramos los productos que pertenecen a la categoría seleccionada
  cont.innerHTML = productos
    .filter(p => p.id_categoria === categoria) // Filtra por categoría
    .map(p => {
      const sinStock = p.stock === 0; // Verifica si el producto tiene stock
      return `
        <div class="paquete-card">
          <div class="contenido">
            <p>${p.descripcion}</p> <!-- Nombre o descripción del producto -->
            <p><strong>$${p.precio}</strong></p> <!-- Precio -->
            <p class="subtitulo">Stock: ${p.stock}</p> <!-- Cantidad disponible -->
            <button onclick="agregarAlCarrito(${p.id_producto}, ${p.precio})" ${sinStock ? 'disabled' : ''}>
              ${sinStock ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      `;
    }).join(''); // Une todo en un solo string para renderizar en el HTML

  // Definimos la función global para agregar un producto al carrito
  window.agregarAlCarrito = async (id, precio) => {
    // Enviamos un POST a la API para crear un pedido temporal (carrito)
    const resp = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clienteId: user.id_cliente, // ID del cliente actual
        productoId: id,            // ID del producto agregado
        cantidad: 1,               // Por defecto se agrega una unidad
        subtotal: precio           // Precio del producto
      })
    });

    // Si la respuesta no es correcta, mostramos el error
    if (!resp.ok) {
      const err = await resp.text();
      return alert('⛔ Error: ' + err);
    }

    // Si todo sale bien, notificamos al usuario
    alert('✅ Producto agregado al carrito');
  };
})();
