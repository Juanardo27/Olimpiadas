// Código para la página principal (visitor/index.html)
// Verifica si el usuario ya está logueado y redirige a /paquetes si es así
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('usuario');
  if (user) {
    location.href = '/paquetes';
  }
});