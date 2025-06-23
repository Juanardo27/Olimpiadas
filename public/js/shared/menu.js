document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    const user = JSON.parse(localStorage.getItem('usuario'));
    const nav = document.getElementById('menuPrincipal');
    if (!nav) return;

    let menu = [];

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

    menu.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = item.text;
      a.href = item.href;

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
