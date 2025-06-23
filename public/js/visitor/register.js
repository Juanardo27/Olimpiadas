document.getElementById('formRegistro').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;

  const data = {
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    email: form.email.value.trim(),
    contraseña: form.contraseña.value
  };

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.text();
      return alert('Error al registrar: ' + err);
    }

    // Login automático
    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, contraseña: data.contraseña })
    });

    if (!loginRes.ok) {
      return alert('Cuenta creada, pero no se pudo iniciar sesión automáticamente.');
    }

    const usuario = await loginRes.json();
    localStorage.setItem('usuario', JSON.stringify(usuario));

    console.log('✅ Registro + login exitoso:', usuario);

    setTimeout(() => window.location.href = '/', 100);

  } catch (error) {
    console.error(error);
    alert('⛔ Error inesperado al registrar.');
  }
});
