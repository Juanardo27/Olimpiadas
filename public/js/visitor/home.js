// Código para la página principal (visitor/index.html)
// Verificar si ya está logueado y redirigir si es necesario
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('usuario');
  if (user) {
    location.href = '/paquetes';
  }
});
