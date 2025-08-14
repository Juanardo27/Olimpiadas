// proteger.js: Protege rutas según el tipo de usuario
(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Página protegida para clientes
  // Si la ruta contiene '/client/' y el usuario no es cliente, redirige al login de visitantes
  if (location.pathname.includes('/client/') && (!usuario || usuario.tipo_usuario !== 'cliente')) {
    alert('Acceso restringido a clientes');
    return location.href = '/visitor/login.html';
  }

  // Página protegida para jefes
  // Si la ruta contiene '/admin/' y el usuario no es jefe, redirige al login de visitantes
  if (location.pathname.includes('/admin/') && (!usuario || usuario.tipo_usuario !== 'jefe')) {
    alert('Acceso restringido a jefes de ventas');
    return location.href = '/visitor/login.html';
  }
})();