# Good Cell SAS — Tienda de Tecnología Premium

Sistema web full-stack para tienda de tecnología premium. Catálogo de productos con búsqueda, filtros, panel admin CRUD, carrito vía WhatsApp y API REST.

**Proyecto real + Proyecto final universitario** — Juan Esteban Garces Giraldo, Tecnología en Desarrollo de Software, UTP.

## Inicio Rápido

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

> El frontend en producción apunta a `https://goodcell-sas.onrender.com`
## Credenciales Admin

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@goodcell.com | admin23 |

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | FastAPI (Python) + Uvicorn | 0.111.0 / 0.30.1 |
| Base de Datos | SQLite (embebido, sin setup) | — |
| Frontend | HTML5 + CSS3 + JavaScript Vanilla | — |
| Auth | Token-based (SHA256 + secrets) | — |
| Tests | pytest + TestClient (FastAPI) | — |
| CI/CD | GitHub Actions | — |
| Deploy | Render (`goodcell-sas.onrender.com`) | — |
| Python | 3.11.11 | — |

## Estructura del Proyecto

MYGOODCELL/
├── backend/
│   ├── main.py             # API FastAPI (12 endpoints)
│   ├── goodcell.db         # SQLite (se crea automáticamente)
│   ├── requirements.txt    # Dependencias Python
│   ├── runtime.txt         # Python 3.11.11 para Render
│   ├── test_main.py        # 5 tests con pytest
│   ├── api/                # Endpoints PHP (alternativa legacy)
│   └── config/             # Conexión BD para PHP
├── frontend/
│   ├── pages/
│   │   ├── index.html      # Catálogo principal
│   │   ├── producto.html   # Detalle de producto + WhatsApp
│   │   └── admin.html      # Panel de administración CRUD
│   ├── css/
│   │   └── style.css       # 1223 líneas, tema oscuro/claro
│   ├── js/
│   │   └── main.js         # 950 líneas, lógica completa
│   └── img/
│       ├── logo-good-cell.png
│       └── producto-placeholder.png
├── database/
│   └── goodcell_db.sql     # Schema MySQL (referencia legacy)
├── GOODCELL_PROMPT_MAESTRO.md
└── README.md

## Arquitectura

[Cliente Navegador] ── fetch() ──▶ [FastAPI — main.py] ── sqlite3 ──▶ [SQLite — goodcell.db]
                                        │
                                        ▼
                               Swagger Docs /docs

**Frontend:** 3 páginas HTML estáticas servidas con Live Server o cualquier HTTP server.
**Backend:** API REST en FastAPI con Uvicorn, sin dependencia de BD externa.
**Comunicación:** Fetch API con `credentials: "omit"` (sin cookies, stateless).

## Endpoints API (FastAPI)

### Públicos

| Método | Endpoint | Descripción |
|--------|----------|------------|
| GET | `/` | Estado de la API |
| GET | `/health` | Health check |
| POST | `/api/auth` | Login de administrador |
| GET | `/api/categorias` | Listar categorías activas |
| GET | `/api/categorias/{id}` | Detalle de categoría |
| GET | `/api/productos` | Listar productos activos (con categoría) |
| GET | `/api/producto?id={id}` | Detalle de producto |

### Admin (protegidos con token)

| Método | Endpoint | Descripción |
|--------|----------|------------|
| GET | `/api/admin/categorias` | Todas las categorías |
| POST | `/api/admin/categorias` | Crear categoría |
| PUT | `/api/admin/categorias/{id}` | Actualizar categoría |
| GET | `/api/admin/productos` | Todos los productos |
| POST | `/api/admin/productos` | Crear producto |
| PUT | `/api/admin/productos/{id}` | Actualizar producto |

**Total: 13 rutas** (7 públicas + 6 admin)

## Base de Datos

### Esquema (SQLite, 3 tablas)

```sql
usuarios   (id, nombre, email, contrasena_hash, rol, activo, creado_en)
categorias (id, nombre, descripcion, imagen, activo, creado_en)
productos  (id, categoria_id → categorias.id, nombre, descripcion, precio, marca, stock, imagen, activo, creado_en)
```
### 7 Categorías

| ID | Nombre | Descripción |
|----|--------|------------|
| 1 | Parlantes | Equipos de audio premium |
| 2 | Audifonos | Audífonos premium |
| 3 | Apple | Accesorios Apple |
| 4 | Gaming | Equipos gaming |
| 5 | Fotografía | Equipos fotografía |
| 6 | Hogar Inteligente | Domótica y smart home |
| 7 | Accesorios | Accesorios varios |

### 8 Productos (seed data)

| Producto | Precio | Marca | Categoría |
|----------|--------|-------|-----------|
| BOSE S1 Pro+ | $3.500.000 | BOSE | Parlantes |
| JBL Neo One Compact | $3.000.000 | JBL | Parlantes |
| Shokz Open Dots | $500.000 | Shokz | Audifonos |
| Apple Pencil USB-C | $550.000 | Apple | Apple |
| Logitech G502 Hero | $280.000 | Logitech | Gaming |
| Fujifilm Instax Mini 12 | $400.000 | Fujifilm | Fotografía |
| Amazon Echo Pop | $270.000 | Amazon | Hogar Inteligente |
| Cable Belkin USB-A Lightning | $100.000 | Belkin | Accesorios |

> Se pueden agregar más productos desde el panel admin o directamente en la seed de `main.py`.

## Funcionalidades del Frontend

### index.html — Catálogo principal
- Navbar sticky con logo y menú responsive (hamburguesa)
- Toggle de tema oscuro/claro (persiste en localStorage)
- Hero con efecto typewriter y partículas
- Buscador en tiempo real por nombre, marca y descripción
- Filtro por categoría (chips + select)
- Grid de productos con skeleton loading
- Efecto reveal con IntersectionObserver
- Cursor personalizado en desktop

### producto.html — Detalle de producto
- Imagen con fallback a placeholder
- Especificaciones en grid
- Botón WhatsApp con mensaje predefinido del producto
- Productos relacionados (misma categoría, máximo 3)

### admin.html — Panel de administración
- Login por email + contraseña
- Dashboard con estadísticas (productos, categorías, stock, activos)
- CRUD completo de productos y categorías
- Tablas con editar y activar/desactivar

## Carrito de Compra (WhatsApp)

El carrito funciona a través de WhatsApp. No hay carrito tradicional ni pasarela de pagos.

**Flujo:**
1. El usuario ve un producto en el catálogo
2. Hace clic en "Ver detalle"
3. En la página de detalle, hace clic en el botón verde de WhatsApp
4. Se abre WhatsApp con un mensaje predefinido con los datos del producto
5. El negocio atiende la solicitud de forma personalizada

**Número:** +57 310 5000800 (Pereira, Colombia)

## Autenticación

- **Login:** `POST /api/auth` con `{ email, password }`
- **Hash:** SHA256 de la contraseña
- **Token:** `secrets.token_hex(32)` generado en cada login
- **Admin:** Los endpoints protegidos usan `HTTPBearer` y verifican que exista un admin activo en la BD
- **Credenciales seed:** admin@goodcell.com / admin23

## Tests

```bash
cd backend
pytest test_main.py -v
```
5 tests:
- `test_root` — GET `/` retorna 200
- `test_health` — GET `/health` retorna 200
- `test_get_categorias` — GET `/api/categorias` retorna data
- `test_get_productos` — GET `/api/productos` retorna data
- `test_login_invalido` — POST `/api/auth` con credenciales incorrectas retorna 401

## CI/CD (GitHub Actions)

**Archivo:** `.github/workflows/ci.yml`

**Trigger:** Push o PR a `main`

**Pipeline:**
1. Checkout del código
2. Configura Python 3.12
3. Instala dependencias (FastAPI, pytest, httpx)
4. Ejecuta `pytest test_main.py -v`

## Deploy (Render)

- **URL:** https://goodcell-sas.onrender.com
- **Documentación API:** https://goodcell-sas.onrender.com/docs (Swagger UI)
- **Backend:** FastAPI + Uvicorn en Render (plan gratuito)
- **Base de datos:** SQLite embebido (archivo `goodcell.db`)
- **Frontend:** Archivos estáticos servidos con Live Server o cualquier HTTP server

## Evolución del Proyecto

1. **PHP + MySQL** — Versión inicial con XAMPP (backup legacy en `backend/api/`)
2. **FastAPI + Supabase (PostgreSQL)** — Primer deploy en Render
3. **FastAPI + SQLite** — Versión actual: cero configuración, portátil, ideal para sustentación

## Justificación de Tecnologías

**FastAPI** — Alto rendimiento, documentación automática con Swagger, validación nativa con Pydantic y soporte async.

**SQLite** — No requiere instalación ni configuración externa. Cualquiera puede clonar y ejecutar el proyecto al instante.

**JavaScript Vanilla** — El proyecto no necesita un framework pesado; 3 páginas se comunican con la API mediante Fetch API.

**Render** — Deploy gratuito con integración directa desde GitHub y soporte nativo para FastAPI.

## Diseño Visual

| Propiedad | Tema Oscuro | Tema Claro |
|-----------|------------|-----------|
| Fondo | `#0a0a0a` | `#f8f8f8` |
| Superficie | `#111111` | `#ffffff` |
| Acento | `#4ade80` (verde) | `#22c55e` |
| Texto | `#f5f7fa` | `#111111` |
| Tipografía | Inter (Google Fonts) | Inter |

- Inspirado en Razer.com + Apple.com
- Mobile first, responsive
- Animaciones: fade-in, typewriter, ripple, parallax

## Autor
**Juan Esteban Garces Giraldo** — Tecnología en Desarrollo de Software, UTP
**Versión:** 2.0.0 | **Sistema:** Good Cell SAS | **Año:** 2026