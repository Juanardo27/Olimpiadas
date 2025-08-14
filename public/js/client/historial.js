// Función autoejecutable (IIFE) para encapsular el código y ejecutarlo inmediatamente
(async () => {
    // Obtiene los datos del usuario almacenados en el localStorage y los convierte en objeto
    const user = JSON.parse(localStorage.getItem('usuario'));

    // Valida que exista un usuario y que sea del tipo 'cliente'
    if (!user || user.tipo_usuario !== 'cliente') {
        alert('Ingresá como cliente.');
        return location.href = '/login'; // Redirige al login si no cumple la condición
    }

    // Selecciona el <tbody> de la tabla donde se mostrará el historial de pedidos
    const tabla = document.querySelector('#tablaHistorial tbody');
    
    try {
        // Realiza una petición GET a la API para obtener el historial de pedidos del cliente
        const res = await fetch(`/api/pedidos/historial/${user.id_cliente}`);
        const pedidos = await res.json(); // Convierte la respuesta en JSON
        
        // Si no hay pedidos, muestra un mensaje en la tabla
        if (!pedidos.length) {
            tabla.innerHTML = `<tr><td colspan="5">📭 No tenés pedidos aún.</td></tr>`;
            return;
        }

        // Recorre cada pedido y lo agrega como una fila en la tabla
        pedidos.forEach(p => {
            // Formatea la fecha a YYYY/MM/DD
            const fechaFormateada = new Date(p.fecha_pedido).toISOString().slice(0, 10).replace(/-/g, '/');
            
            // Agrega una fila a la tabla con los datos del pedido
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
        // Si ocurre un error en la petición o el renderizado, se muestra en consola y en la tabla
        console.error('⛔ Error al cargar historial:', err);
        tabla.innerHTML = `<tr><td colspan="5">❌ Error al cargar datos.</td></tr>`;
    }
})();
