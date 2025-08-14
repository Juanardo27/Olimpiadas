// Escucha el evento "submit" del formulario de contacto
document.getElementById('formContacto').addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que se recargue la página al enviar

  // Obtiene valores del formulario y los limpia de espacios
  const asunto = document.getElementById('asunto').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  // Obtiene datos del usuario guardados en localStorage
  const user = JSON.parse(localStorage.getItem('usuario'));
  console.log(user); // Debug: muestra info del usuario en consola

  // Valida que los campos no estén vacíos
  if (!asunto || !mensaje) return alert('Completá todos los campos.');

  // Muestra datos a enviar por consola (opcional para pruebas)
  console.log({ asunto, mensaje, email: user.email, nombre: user.nombre });

  // Envía los datos al backend mediante fetch
  const res = await fetch('/api/contacto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      asunto,
      mensaje,
      email: user.email,
      nombre: user.nombre
    })
  });

  // Si la respuesta es correcta, muestra mensaje y limpia el formulario
  if (res.ok) {
    alert('✅ Mensaje enviado con éxito.');
    document.getElementById('formContacto').reset();
  } else {
    // Si hay error, lo muestra
    const err = await res.text();
    alert('⛔ Error al enviar: ' + err);
  }
});
