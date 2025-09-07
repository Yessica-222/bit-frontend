# BIT-Frontend - Electro Tecnológicas Cauca

Este repositorio contiene el **frontend del sistema e-commerce Electro Tecnológicas Cauca**, desarrollado en **Angular**.  
Incluye las interfaces gráficas para usuarios y administradores, conectadas al backend vía API REST.

---

## Tecnologías principales

- **Angular 17+**
- **TypeScript**
- **HTML5 · CSS3**
- **Bootstrap / Angular Material**
- **RxJS · HttpClient**
- **JWT para autenticación**

---

## Estructura de carpetas

```bash
src/app/
├── components/
│   ├── pages/
│   │   ├── admin/         # Panel de administración
│   │   ├── home/          # Página principal
│   │   ├── payment/       # Módulo de pagos
│   │   ├── products/      # Gestión de productos
│   │   ├── services/      # Servicios disponibles
│   │   ├── sign-in/       # Login
│   │   ├── sign-up/       # Registro
│   │   └── user/          # Sección de usuario (carrito, citas, facturas, perfil)
│   └── shared/            # Navbar, componentes comunes
├── guards/                # Guards de rutas protegidas
├── models/                # Modelos de datos
├── services/              # Servicios Angular para consumir API
├── app.config.ts
├── app.routes.ts
├── app.html
└── app.css
```
---
### **Instalación y configuración**

1. Clonar el repositorio:

   - git clone https://github.com/Yessica-222/bit-frontend
    - cd bit-frontend


2. Instalar dependencias:

   - npm install


### **Iniciar el servidor de desarrollo:**

 - ng serve 

### Requisitos previos

- Node.js >= 16

- Angular CLI >= 17

- npm o yarn instalado

- Backend corriendo en http://localhost:5000/api

### **Funcionalidades principales**
 Usuario

- Registro e inicio de sesión

- Navegación dinámica según autenticación

- Gestión de perfil

- Carrito de compras con cálculo de total

- Citas técnicas (agendar, ver, cancelar)

- Facturas y pagos

 Administrador

- Panel de administración

- CRUD de productos

- Gestión de servicios

- Facturas y pagos

- Gestión de usuarios


### Autor

##  Autor

Desarrollado por **Yessica Alexandra Conejo Muñoz**  

📍 Popayán, Colombia  
📧 Contacto: munozyessica769@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/yessica-alexandra-conejo-munoz-desarrolladorweb)  

---