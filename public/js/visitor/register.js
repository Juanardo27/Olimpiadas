// Maneja el envío del formulario de registro de usuario
document.getElementById('formRegistro').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;

  // Obtiene los datos del formulario
  const data = {
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    email: form.email.value.trim(),
    contraseña: form.contraseña.value
  };

  try {
    // Envía la petición de registro al backend
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // Si hay error, muestra mensaje
    if (!res.ok) {
      const err = await res.text();
      return alert('Error al registrar: ' + err);
    }

    // Login automático tras registro exitoso
    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, contraseña: data.contraseña })
    });

    // Si el login automático falla, muestra mensaje
    if (!loginRes.ok) {
      return alert('Cuenta creada, pero no se pudo iniciar sesión automáticamente.');
    }

    // Guarda el usuario en localStorage si el login fue exitoso
    const usuario = await loginRes.json();
    localStorage.setItem('usuario', JSON.stringify(usuario));

    console.log('✅ Registro + login exitoso:', usuario);

    // Redirige al inicio tras registro y login
    setTimeout(() => window.location.href = '/', 100);

  } catch (error) {
    console.error(error);
    alert('⛔ Error inesperado al registrar.');
  }
});