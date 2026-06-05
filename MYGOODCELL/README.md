# 🟢 Good Cell SAS - Sistema de Tienda Tecnología Premium

Sistema de gestión de tienda tecnológica con catálogo de productos, panel administrativo y API REST.

---

## 🚀 Inicio Rápido

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

La API queda disponible en: `http://localhost:8000`  
Documentación automática: `http://localhost:8000/docs`

### Frontend

Abrir `frontend/pages/index.html` con Live Server en VS Code.

---

## 👥 Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@goodcell.com | admin23 |

---

## 📁 Estructura del Proyecto

```
MYGOODCELL/
├── backend/
│   ├── api/              # Endpoints PHP (legacy)
│   ├── config/           # Configuración BD
│   └── main.py           # API FastAPI (principal)
├── database/
│   └── goodcell_db.sql   # Script base de datos MySQL
├── frontend/
│   ├── css/              # Estilos
│   ├── img/              # Imágenes
│   ├── js/               # JavaScript
│   └── pages/            # Páginas HTML
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 🔌 Endpoints API

### Públicos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Estado de la API |
| GET | `/health` | Health check |
| POST | `/api/auth` | Login de usuario |
| GET | `/api/categorias` | Listar categorías activas |
| GET | `/api/categorias/{id}` | Detalle de categoría |
| GET | `/api/productos` | Listar productos activos |
| GET | `/api/producto?id={id}` | Detalle de producto |

### Admin (requieren token)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/admin/categorias` | Todas las categorías |
| POST | `/api/admin/categorias` | Crear categoría |
| PUT | `/api/admin/categorias/{id}` | Actualizar categoría |
| GET | `/api/admin/productos` | Todos los productos |
| POST | `/api/admin/productos` | Crear producto |
| PUT | `/api/admin/productos/{id}` | Actualizar producto |

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **FastAPI** — Framework Python moderno y de alto rendimiento para APIs REST
- **MySQL** — Base de datos relacional para persistencia de datos
- **Uvicorn** — Servidor ASGI para correr FastAPI
- **Pydantic** — Validación de datos y serialización

### Frontend
- **HTML5 / CSS3 / JavaScript** — Interfaz de usuario responsiva
- **Fetch API** — Comunicación con el backend

### Herramientas de Desarrollo
- **Git / GitHub** — Control de versiones
- **VS Code** — Editor de código
- **GitHub Actions** — Integración continua (CI)

### Deploy
- **Render** — Plataforma de despliegue del backend
- **Supabase** — Base de datos en producción

---

## 🏗️ Arquitectura

```
[Frontend HTML/JS]
       │
       │ fetch() HTTP requests
       ▼
[FastAPI - main.py]
       │
       │ mysql-connector
       ▼
[MySQL - goodcell_db]
```

---

## ✅ Justificación de Tecnologías

**FastAPI** fue elegido por su alto rendimiento, documentación automática con Swagger, validación nativa con Pydantic y sintaxis moderna con Python async.

**MySQL** fue elegido por su robustez, soporte amplio en hosting y familiaridad del equipo con SQL relacional.

**Render** fue elegido para el deploy por su integración directa con GitHub, plan gratuito disponible y soporte nativo para aplicaciones Python/FastAPI.

---

## Integrantes

- Juan Esteban Garces Giraldo

**Versión:** 1.0.0 | **Sistema:** Good Cell SAS | **Año:** 2025
