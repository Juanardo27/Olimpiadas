document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
      };

      const res = await fetch('/login', {
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