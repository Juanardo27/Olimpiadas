document.addEventListener('DOMContentLoaded', () => {
  const btnSesion = document.getElementById('btnSesion');
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const nombre = payload.email?.split('@')[0] || 'Usuario';
      btnSesion.textContent = `Hola, ${nombre}`;
      btnSesion.onclick = () => {
        if (confirm('¿Cerrar sesión?')) {
          localStorage.removeItem('token');
          location.reload();
        }
      };
    } catch (error) {
      localStorage.removeItem('token');
    }
  } else {
    btnSesion.onclick = () => {
      window.location.href = '/pages/login.html'; // <- Redirección
    };
  }
});