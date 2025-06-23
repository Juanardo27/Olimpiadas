document.getElementById('formContacto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const asunto = document.getElementById('asunto').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const user = JSON.parse(localStorage.getItem('usuario'));
  console.log(user);

  if (!asunto || !mensaje) return alert('Completá todos los campos.');

  console.log({ asunto, mensaje, email: user.email, nombre: user.nombre });
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

  if (res.ok) {
    alert('✅ Mensaje enviado con éxito.');
    document.getElementById('formContacto').reset();
  } else {
    const err = await res.text();
    alert('⛔ Error al enviar: ' + err);
  }
});
