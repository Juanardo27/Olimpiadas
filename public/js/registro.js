document.addEventListener('DOMContentLoaded', () => {
  const registroForm = document.getElementById('registroForm');

  if (registroForm) {
    registroForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      };

      const res = await fetch('/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const resultado = await res.json();

      if (res.ok) {
        localStorage.setItem('token', resultado.token);
        window.location.href = '/pages/home.html';
      } else {
        alert(resultado.error);
      }
    });
  }
});