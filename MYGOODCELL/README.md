# 🟢 Good Cell SAS — Tienda de Tecnología Premium

Sistema web full-stack para tienda de tecnología premium. Catálogo de productos con búsqueda, filtros, panel admin CRUD, carrito vía WhatsApp y API REST.
**Proyecto real + Proyecto final universitario** — Juan Esteban Garces Giraldo, Tecnología en Desarrollo de Software, UTP.

---

## 🚀 Inicio Rápido

```bash
# Backend (FastAPI + SQLite — sin BD externa)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# API en: http://localhost:8000
# Docs: http://localhost:8000/docs

# Frontend (HTML estático)
# Abrir frontend/pages/index.html con Live Server
```

> ⚡ El frontend en producción apunta a `https://goodcell-sas.onrender.com`

---

## 👤 Credenciales Admin

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@goodcell.com | admin23 |

---

## 📦 Estructura Actual

```
MYGOODCELL/
├── backend/
│   ├── main.py           # API FastAPI (principal)
│   ├── goodcell.db       # SQLite (embebido, sin setup)
│   ├── requirements.txt  # Dependencias Python
│   ├── test_main.py      # Tests con pytest
│   ├── api/              # Endpoints PHP (alternativa legacy)
│   └── config/           # Conexión BD para PHP
├── frontend/
│   ├── pages/
│   │   ├── index.html    # Catálogo principal
│   │   ├── producto.html # Detalle de producto
│   │   └── admin.html    # Panel de administración
│   ├── css/style.css     # Estilos premium (tema oscuro/claro)
│   ├── js/main.js        # Lógica completa del frontend
│   └── img/              # Logo e imágenes
├── database/
│   └── goodcell_db.sql   # Schema MySQL (referencia)
├── .github/              # CI/CD con GitHub Actions
└── README.md
```

---

## 🛒 Productos (14)

| Producto | Precio | Marca | Categoría |
|---|---|---|---|
| BOSE S1 Pro+ | $3.500.000 | BOSE | Parlantes |
| JBL Neo One Compact | $3.000.000 | JBL | Parlantes |
| Shokz Open Dots | $800.000 | Shokz | Audífonos |
| Shokz OpenRun Pro 2 Garmin | $950.000 | Shokz | Audífonos |
| Apple Adaptador USB-C 20W | $120.000 | Apple | Apple |
| Apple Pencil USB-C | $550.000 | Apple | Apple |
| Logitech G502 Hero | $280.000 | Logitech | Gaming |
| Teclado Redragon Horus TKL | $350.000 | Redragon | Gaming |
| Fujifilm Instax Mini 12 | $400.000 | Fujifilm | Fotografía |
| Impresora Instax Mini Link 3 | $550.000 | Fujifilm | Fotografía |
| Alexa Echo Pop | $270.000 | Amazon | Hogar Inteligente |
| Alexa Echo Dot | $320.000 | Amazon | Hogar Inteligente |
| Belkin Batería 10K MagSafe | $350.000 | Belkin | Accesorios |
| Cable Belkin USB-A Lightning | $100.000 | Belkin | Accesorios |

---

## 🔌 Endpoints API (FastAPI)

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

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Backend | FastAPI (Python) + Uvicorn |
| Base de Datos | SQLite (embebido) |
| Frontend | HTML5 + CSS3 + JavaScript Vanilla |
| Auth | Token-based (SHA256) |
| Tests | pytest + TestClient |
| CI/CD | GitHub Actions |
| Deploy | Render (`goodcell-sas.onrender.com`) |
| Alternativa | PHP + MySQL (compatible con Bluehost) |

---

## 🏗️ Arquitectura

```
[Cliente Navegador]
       │ fetch() con credentials: omit
       ▼
[FastAPI — main.py]
       │ sqlite3
       ▼
[SQLite — goodcell.db]
```

---

## 📈 Evolución del Proyecto

1. **PHP + MySQL** — Versión inicial con XAMPP
2. **FastAPI + Supabase (PostgreSQL)** — Primer deploy en Render
3. **FastAPI + SQLite** — Migración final: cero configuración, portátil, ideal para sustentación

---

## ✅ Tests

```bash
cd backend
pytest test_main.py -v
```

5 tests: root, health, categorías, productos, login inválido.

---

## ✅ Justificación de Tecnologías

**FastAPI** fue elegido por su alto rendimiento, documentación automática con Swagger, validación nativa con Pydantic y sintaxis moderna con Python async.

**SQLite** fue elegido para la versión actual porque no requiere instalación ni configuración externa — cualquiera puede clonar y ejecutar el proyecto al instante.

**JavaScript Vanilla** se usó en el frontend porque el proyecto no necesita un framework pesado; las 3 páginas se comunican con la API mediante Fetch API de forma directa y eficiente.

**Render** permite deploy gratuito con integración directa desde GitHub y soporte nativo para FastAPI.

---

## 👨‍💻 Integrante

**Juan Esteban Garces Giraldo** — Tecnología en Desarrollo de Software, UTP

**Versión:** 2.0.0 | **Sistema:** Good Cell SAS | **Año:** 2026
