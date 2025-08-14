// Maneja el envío del formulario de login
document.getElementById('formLogin').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;

  // Obtiene los datos del formulario
  const data = {
    email: form.email.value.trim(),
    contraseña: form.contraseña.value
  };

  try {
    // Envía la petición de login al backend
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // Si hay error, muestra mensaje
    if (!res.ok) {
      const err = await res.text();
      return alert('Error: ' + err);
    }

    // Guarda el usuario en localStorage si el login fue exitoso
    const usuario = await res.json();
    localStorage.setItem('usuario', JSON.stringify(usuario));

    console.log('✅ Usuario logueado:', usuario);

    // Redirige según el tipo de usuario
    setTimeout(() => {
      if (usuario.tipo_usuario === 'cliente' || usuario.tipo_usuario === 'jefe') {
        window.location.href = '/';
      } else {
        alert('Tipo de usuario no reconocido.');
      }
    }, 100);

  } catch (err) {
    console.error(err);
    alert('⛔ Error inesperado al iniciar sesión.');
  }
});