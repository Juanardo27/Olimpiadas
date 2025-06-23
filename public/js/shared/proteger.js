// proteger.js
(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Página protegida para clientes
  if (location.pathname.includes('/client/') && (!usuario || usuario.tipo_usuario !== 'cliente')) {
    alert('Acceso restringido a clientes');
    return location.href = '/visitor/login.html';
  }

  // Página protegida para jefes
  if (location.pathname.includes('/admin/') && (!usuario || usuario.tipo_usuario !== 'jefe')) {
    alert('Acceso restringido a jefes de ventas');
    return location.href = '/visitor/login.html';
  }
})();
