// Espera a que el DOM esté cargado para inicializar el menú
document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    // Obtiene el usuario logueado desde localStorage
    const user = JSON.parse(localStorage.getItem('usuario'));
    const nav = document.getElementById('menuPrincipal');
    if (!nav) return;

    let menu = [];

    // Define el menú según el tipo de usuario
    if (!user) {
      // 🔹 Visitante
      menu = [
        { text: "🏠 Inicio", href: "/" },
        { text: "🔐 Iniciar sesión", href: "/login" }
      ];
    } else if (user.tipo_usuario === 'cliente') {
      // 🟢 Cliente
      menu = [
        { text: "🏠 Inicio", href: "/" },
        { text: "🛍️ Paquetes", href: "/paquetes" },
        { text: "✈️ Vuelos", href: "/vuelos" },
        { text: "🏨 Hoteles", href: "/hoteles" },
        { text: "🛒 Carrito", href: "/carrito" },
        { text: "📄 Mis pedidos", href: "/pedidos" },
        { text: "📩 Contacto", href: "/contacto" },
        { text: "🚪 Cerrar sesión", href: "#", action: cerrarSesion }
      ];
    } else if (user.tipo_usuario === 'jefe') {
      // 🔴 Jefe de ventas
      menu = [
        { text: "🏠 Inicio", href: "/" },
        { text: "📦 Productos", href: "/productos" },
        { text: "📬 Pedidos clientes", href: "/pedidos_clientes" },
        { text: "📊 Reportes", href: "/reporte" },
        { text: "🚪 Cerrar sesión", href: "#", action: cerrarSesion }
      ];
    }

    // 🔧 Renderizado dinámico del menú
    const ul = document.createElement('ul');
    ul.classList.add('menu');

    // Crea los elementos del menú según la configuración
    menu.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = item.text;
      a.href = item.href;

      // Si el ítem tiene acción (ej: cerrar sesión), la agrega
      if (item.action) {
        a.addEventListener('click', e => {
          e.preventDefault();
          item.action();
        });
      }

      li.appendChild(a);
      ul.appendChild(li);
    });

    nav.innerHTML = ''; // Limpia el contenido previo
    nav.appendChild(ul);
  })();

  // 🔐 Función para cerrar sesión
  function cerrarSesion() {
    localStorage.removeItem('usuario');
    alert('Sesión cerrada.');
    window.location = '/';
  }
});