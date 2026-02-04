# PROYECTO-TFG-ANGULAR-NODE.JS
TFG Francisco Javier Belda

# 💊 Sistema de Gestión Web para Farmacéuticas

## 📌 Descripción del proyecto

Este proyecto consiste en el desarrollo de una **aplicación web de gestión para el sector farmacéutico**, orientada a facilitar el control interno de una farmacéutica o farmacia de tamaño medio. El sistema permite gestionar de forma centralizada **medicamentos, pedidos a proveedores, inventario, empleados y turnos de trabajo**, todo ello mediante una interfaz web moderna y segura.

La aplicación está construida siguiendo una arquitectura **cliente-servidor**, con un **frontend SPA en Angular** y un **backend basado en Node.js y Express**, utilizando **MongoDB** como base de datos NoSQL.

---

## 🎯 Motivación

La principal motivación para realizar este proyecto surge de una combinación de factores personales y profesionales:

* 👨‍⚕️ Varios familiares han trabajado en el **sector sanitario y farmacéutico**, aportando una visión realista de las necesidades del sector.
* 🧠 Interés personal en desarrollar una **aplicación completa**, aplicada a un entorno profesional real.
* 🚀 Ganas de poner en práctica un **stack moderno (Angular + Node.js + MongoDB)** en un proyecto funcional de principio a fin.

El objetivo era crear una solución útil, realista y escalable que pudiera utilizarse como base para un producto real.

---

## 🏆 Objetivos del proyecto

* 🔐 Implementar **autenticación de usuarios** con control de acceso por roles (Gerente / Empleado).
* 💊 Gestionar medicamentos (alta, edición, eliminación y control de stock).
* 📦 Gestionar pedidos a proveedores y su impacto directo en el inventario.
* 👥 Administrar empleados y **planificar turnos** mediante un calendario mensual.
* 📊 Visualizar datos relevantes mediante **gráficos dinámicos**.
* 🌐 Desarrollar una **API RESTful** robusta, segura y escalable.
* 📁 Desplegar la aplicación con una guía clara de instalación y configuración.

---

## 🧰 Tecnologías y herramientas utilizadas

### 🖥️ Frontend

* ⚡ **Angular 19** – Framework SPA
* 🟦 **TypeScript** – Tipado estático
* 🎨 **HTML5 / CSS3** – Maquetación
* 🧩 **Bootstrap** – Diseño responsivo
* 🌐 **Axios** – Comunicación HTTP
* 📈 **QuickChart API** – Gráficos dinámicos

### 🛠️ Backend

* 🟢 **Node.js (v18+)** – Entorno de ejecución
* 🚏 **Express.js** – Framework web
* 🍃 **MongoDB (v8+)** – Base de datos NoSQL
* 🧬 **Mongoose** – ODM
* 🔐 **dotenv** – Variables de entorno
* 🔄 **cors** – Control de acceso
* ♻️ **Nodemon** – Desarrollo

### 🔧 Otras herramientas

* 🧪 **Postman** – Pruebas de API
* 🧠 **Git & GitHub** – Control de versiones
* 📝 **Visual Studio Code** – IDE

---

## ⚙️ ¿Cómo funciona la aplicación?

### 🔑 Autenticación y roles

* El usuario inicia sesión con correo y contraseña.
* El sistema identifica su **rol** (Gerente o Empleado).
* Las rutas y funcionalidades disponibles se ajustan automáticamente.

### 💊 Gestión de medicamentos

* Listado completo de medicamentos.
* Vista detallada con información, pedidos y ventas.
* Control automático de stock al realizar pedidos o ventas.
* Exportación de listados a **PDF**.

### 📦 Gestión de pedidos

* Creación, edición y eliminación de pedidos.
* Asociación directa con proveedores.
* Impacto automático en el stock.
* Protección frente a modificaciones una vez recibido el pedido.

### 👥 Empleados y turnos

* Calendario mensual interactivo.
* Asignación de turnos (mañana, tarde o libre).
* Vista centralizada para el gerente.

### 📊 Visualización de datos

* Gráficos de pedidos y ventas por medicamento.
* Integración mediante API externa (QuickChart).

---

## 🧱 Arquitectura del sistema

```text
Angular (SPA)
   │
   ├── Servicios HTTP (Axios)
   │
Node.js + Express (API REST)
   │
   ├── Controladores
   ├── Modelos (Mongoose)
   └── Rutas
   │
MongoDB (Base de datos NoSQL)
```

✔ Separación clara entre frontend y backend
✔ Arquitectura escalable y mantenible

---

## 🗄️ Modelo de datos (resumen)

* 👤 **Usuario**: autenticación y roles
* 👥 **Empleado**: datos personales y calendario
* 💊 **Medicamento**: stock, pedidos y ventas
* 🏭 **Proveedor**: información y pedidos asociados
* 📦 **Pedido**: control global de pedidos

---

## 🚀 Instalación y ejecución

### 📋 Requisitos previos

* Node.js v18+
* Angular CLI v19
* MongoDB
* Git

### ▶️ Pasos básicos

```bash
# Clonar repositorio
git clone https://github.com/TFG-ANGULAR-NODE.JS.git

# Backend
cd farmaceutica-nodejs
npm install
npm run dev

# Frontend
cd ../farmaceutica-angular
npm install
ng serve -o
```

📍 Backend: [http://localhost:3000](http://localhost:3000)
📍 Frontend: [http://localhost:4200](http://localhost:4200)

---

## 🔮 Mejoras futuras

* 🔐 Cifrado de contraseñas con **bcrypt**
* 🪪 Autenticación mediante **JWT**
* 📄 Generación de PDFs de pedidos
* 📊 Panel estadístico avanzado
* 📱 Aplicación móvil
* 🏢 Gestión completa de proveedores y empleados

---

## 📚 Conclusión

Este proyecto demuestra el desarrollo completo de una **aplicación web profesional**, aplicando buenas prácticas, tecnologías modernas y una arquitectura sólida. Ha servido como una excelente oportunidad para consolidar conocimientos Full Stack y enfrentarse a problemas reales de diseño, seguridad y escalabilidad.

---

## 👨‍💻 Autor

**Francisco Javier Belda Alovera**
📍 Técnico Superior en Desarrollo de Aplicaciones Web
📅 Junio 2025

---

⭐ Si este proyecto te resulta útil o interesante, ¡no dudes en darle una estrella en GitHub!
