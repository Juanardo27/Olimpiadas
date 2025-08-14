# Proyecto Olimpiadas

## Estructura del Proyecto

- **app.js**  
  Archivo principal del servidor. Configura Express, middlewares, rutas de la API y rutas para servir los archivos HTML de la carpeta `views`.

- **package.json**  
  Define las dependencias del proyecto y scripts de npm.

- **db/**  
  - **conexion.js**  
    Configura y exporta la conexión a la base de datos MySQL.

- **public/**  
  Carpeta de archivos estáticos servidos al cliente (CSS, imágenes y JS).
  - **css/estilos.css**  
    Hoja de estilos principal para toda la aplicación.
  - **img/**  
    Imágenes usadas en la web (banners, logos, etc).
  - **js/**  
    Scripts de frontend organizados por módulos:
    - **client/**  
      Lógica JS para clientes (carrito, historial, contacto, listado de productos).
    - **sales/**  
      Lógica JS para jefes de ventas (gestión de productos, pedidos, reportes).
    - **shared/**  
      Scripts compartidos (menú dinámico, protección de rutas).
    - **visitor/**  
      Scripts para visitantes (registro, login, home).

- **routes/**  
  Rutas de la API backend, cada archivo implementa endpoints para una funcionalidad:
  - **auth.js**  
    Registro y login de usuarios.
  - **contacto.js**  
    Envío de mensajes de contacto.
  - **pedidos.js**  
    Lógica de carrito, pedidos y compras de clientes.
  - **productos.js**  
    Gestión CRUD de productos.
  - **reportes.js**  
    Reportes y gestión de pedidos para jefes de ventas.

- **utils/**  
  - **mailer.js**  
    Utilidad para enviar correos electrónicos usando Nodemailer.

- **views/**  
  Archivos HTML que representan las páginas del sitio, organizados por tipo de usuario:
  - **client/**  
    Vistas para clientes (carrito, contacto, hoteles, paquetes, pedidos, vuelos).
  - **sales/**  
    Vistas para jefes de ventas (gestión de productos, pedidos de clientes, reportes).
  - **visitor/**  
    Vistas para visitantes (inicio, login, registro).

---

## ¿Cómo funciona el flujo general?

1. **Visitantes** pueden registrarse o iniciar sesión.
2. **Clientes** pueden navegar paquetes, vuelos y hoteles, agregar productos al carrito, finalizar compras y ver su historial.
3. **Jefes de ventas** pueden gestionar productos, ver pedidos de clientes, marcar pedidos como entregados/cancelados y consultar reportes.
4. El backend maneja la lógica de negocio, persistencia en MySQL y el envío de correos.
5. El frontend consume la API mediante fetch y actualiza la interfaz dinámicamente.

---

# ¿Cómo poder probar y ver la página?

## ✅ Guía Completa para Ejecutar el Proyecto

### 1. Requisitos previos

- **XAMPP (Apache + MySQL)**  
  [Descargar aquí](https://www.apachefriends.org/es/index.html)

- **Node.js**  
  [Descargar aquí](https://nodejs.org/)

- **Visual Studio Code**  
  [Descargar aquí](https://code.visualstudio.com/)

---

### 2. Iniciar XAMPP

- Abre **XAMPP Control Panel**.
- Activa los servicios:
  - Apache ✅
  - MySQL ✅

---

### 3. Configurar la Base de Datos

- En tu navegador, abre:  
  [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
- Crea una base de datos llamada:  
  `sistema_turismo`
- Importa el archivo SQL:
  - Ve a la pestaña **Importar**.
  - Selecciona el archivo dentro de la carpeta **Base de Datos** del proyecto.
  - Haz clic en **Continuar**.

---

### 4. Instalar dependencias en VSCode

- Abre la carpeta del proyecto en **VSCode**.
- Abre la terminal (Ctrl + ñ o Terminal → Nueva Terminal).
- Instala las librerías necesarias ejecutando:

  npm install bcrypt dotenv express jsonwebtoken mysql2

---

### 5. Ejecutar el servidor

- En la terminal, ejecuta:

  node app.js

- Si todo está correcto, deberías ver en la terminal:

  Servidor en http://localhost:3000
  ✅ Conectado a la base de datos sistema_turismo

- Luego abre en tu navegador:  
  [http://localhost:3000](http://localhost:3000)

---

### 6. Archivos importantes

- **app.js**  
  Archivo principal para iniciar el servidor.

- **db/conexion.js**  
  Configuración de la conexión con MySQL.

- **/Base de Datos/**  
  Carpeta que contiene el archivo `.sql` para importar la base de datos.


