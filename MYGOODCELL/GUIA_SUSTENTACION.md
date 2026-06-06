# Guía de Sustentación — Good Cell SAS

## 1. Ficha Técnica del Proyecto

| Info | Detalle |
|------|---------|
| **Proyecto** | Good Cell SAS — Tienda de Tecnología Premium |
| **Desarrollador** | Juan Esteban Garces Giraldo |
| **Carrera** | Tecnología en Desarrollo de Software |
| **Universidad** | Universidad Tecnológica de Pereira (UTP) |
| **Propósito** | Proyecto real del negocio familiar + Proyecto final (Modelado de Software y Base de Datos) |
| **Versión** | 2.0.0 |
| **Año** | 2026 |

---

## 2. Stack Tecnológico (¿Qué usamos y por qué?)

### Backend: FastAPI (Python)
**¿Qué es?** Framework web moderno para construir APIs con Python.
**¿Por qué lo elegimos?**
- **Rendimiento:** Es uno de los frameworks Python más rápidos (compite con Node.js y Go)
- **Documentación automática:** Swagger UI en `/docs` — generada automáticamente
- **Validación nativa:** Usa Pydantic para validar datos de entrada/salida
- **Async nativo:** Soporta programación asíncrona para mejor rendimiento en I/O
- **Tipado:** Basado en type hints de Python, facilitando el desarrollo y debug

### Base de Datos: SQLite
**¿Qué es?** Motor de base de datos SQL embebido (no necesita servidor).
**¿Por qué lo elegimos?**
- **Cero configuración:** No instalar MySQL, PostgreSQL ni ningún servicio
- **Archivo único:** La BD es un solo archivo (`goodcell.db`) que se crea automáticamente
- **Portátil:** Clonar el repo, correr `pip install` y listo
- **Ideal para sustentación:** El jurado puede probar el proyecto en cualquier PC sin setup

### Frontend: HTML + CSS + JavaScript Vanilla
**¿Por qué sin frameworks?**
- El proyecto tiene solo 3 páginas → React/Vue/Angular sería sobredimensionado
- Comunicación directa con la API mediante Fetch API
- CSS con variables para tema oscuro/claro (sin librerías externas)
- JavaScript vanilla (~950 líneas) que maneja toda la lógica del frontend

### Deploy: Render (PaaS)
**¿Qué es?** Plataforma como servicio (PaaS) con plan gratuito.
**¿Por qué Render?**
- Integración directa con GitHub (push → deploy automático)
- Soporte nativo para FastAPI + Uvicorn
- SSL gratuito (HTTPS)
- Plan gratuito suficiente para un proyecto universitario

---

## 3. Arquitectura del Sistema

```
[NAVEGADOR]          [BACKEND]             [BASE DE DATOS]
   index.html    ──▶   FastAPI        ──▶    SQLite
   producto.html  ──▶  (main.py)      ──▶   goodcell.db
   admin.html    ──▶  12 endpoints
                         │
                         ▼
                    Swagger UI
                    /docs
```

**Flujo de una petición típica:**
1. Usuario abre `index.html` en el navegador
2. `main.js` hace `fetch("https://goodcell-sas.onrender.com/api/productos")`
3. FastAPI recibe la petición, consulta SQLite
4. SQLite devuelve los datos, FastAPI los formatea como JSON
5. `main.js` recibe el JSON y renderiza las cards de productos en el DOM

---

## 4. Base de Datos (Diseño Relacional)

### Diagrama de Tablas

```
usuarios
  id (PK) | nombre | email (UQ) | contrasena_hash | rol | activo | creado_en

categorias
  id (PK) | nombre (UQ) | descripcion | imagen | activo | creado_en

productos
  id (PK) | categoria_id (FK → categorias.id) | nombre | descripcion
  | precio | marca | stock | imagen | activo | creado_en
```

### Relaciones
- **1 categoría → N productos** (Una categoría tiene muchos productos)
- **1 usuario admin → gestiona el sistema** (rol = 'admin')

### Normalización
- 1FN: Todos los atributos son atómicos (ej: precio es un número, no "3.500.000 COP")
- 2FN: `productos.categoria_id` depende de toda la PK (id), no solo de parte
- 3FN: No hay dependencias transitivas — cada atributo depende directamente de la PK

---

## 5. API REST — Endpoints explicados

### Públicos (no requieren autenticación)

| Endpoint | Verbo | ¿Qué hace? |
|----------|-------|-----------|
| `/` | GET | Muestra estado de la API |
| `/health` | GET | Health check para el deploy |
| `/api/auth` | POST | Login: recibe email+password, devuelve token |
| `/api/categorias` | GET | Lista solo categorías activas |
| `/api/categorias/{id}` | GET | Detalle de una categoría específica |
| `/api/productos` | GET | Lista solo productos activos (con nombre de categoría) |
| `/api/producto?id=X` | GET | Detalle de un producto específico |

### Admin (requieren token de autenticación)

| Endpoint | Verbo | ¿Qué hace? |
|----------|-------|-----------|
| `/api/admin/categorias` | GET | Lista TODAS las categorías (activas e inactivas) |
| `/api/admin/categorias` | POST | Crea una nueva categoría |
| `/api/admin/categorias/{id}` | PUT | Actualiza una categoría |
| `/api/admin/productos` | GET | Lista TODOS los productos |
| `/api/admin/productos` | POST | Crea un nuevo producto |
| `/api/admin/productos/{id}` | PUT | Actualiza un producto |

**Principios REST aplicados:**
- Recursos identificados por URLs (`/api/productos`, `/api/categorias`)
- Verbos HTTP estándar (GET=leer, POST=crear, PUT=actualizar)
- Stateless (el servidor no guarda estado de sesión)
- Respuestas en JSON con estructura consistente `{ ok, data/message }`

---

## 6. Autenticación (¿Cómo funciona?)

### Proceso de Login
1. Usuario ingresa email + contraseña en el panel admin
2. Frontend envía `POST /api/auth { email, password }`
3. Backend hashea la contraseña con **SHA256**
4. Busca en tabla `usuarios` si existe un usuario con ese email y hash
5. Si coincide → genera token con `secrets.token_hex(32)` y lo devuelve
6. Si no coincide → HTTP 401 (Credenciales incorrectas)

### Protección de rutas admin
- Usan `HTTPBearer` de FastAPI (esperan token en header `Authorization: Bearer <token>`)
- Verifican que exista al menos un admin activo en la BD

### Seguridad implementada
- Contraseñas hasheadas con SHA256 (no en texto plano)
- Token aleatorio de 64 caracteres hexadecimales
- CORS abierto para desarrollo (allow_origins=["*"])

---

## 7. Frontend — Funcionalidades Clave

### Catálogo (index.html)
- **Búsqueda en tiempo real:** Filtra productos mientras el usuario escribe
- **Filtro por categoría:** Chips visuales y select dropdown
- **Skeleton loading:** Animación de carga mientras llegan los datos de la API
- **Tema oscuro/claro:** Persiste la preferencia en localStorage
- **Responsive:** Menú hamburguesa en móvil, grid adaptable

### Detalle de Producto (producto.html)
- **WhatsApp integrado:** Botón que abre WhatsApp con mensaje predefinido
- **Productos relacionados:** Muestra máximo 3 productos de la misma categoría

### Panel Admin (admin.html)
- **CRUD completo:** Crear, leer, actualizar y desactivar productos/categorías
- **Dashboard:** Estadísticas de productos, categorías, stock y activos
- **Formularios dinámicos:** Un mismo formulario sirve para crear y editar

---

## 8. Carrito de Compra — Integración WhatsApp

**No hay carrito tradicional ni pasarela de pagos.**

### ¿Por qué WhatsApp?
- Es el canal de ventas real del negocio (atención personalizada)
- Good Cell es un negocio familiar → el cliente prefiere hablar directamente
- Evita implementar una pasarela de pagos (complejo y costoso)

### Flujo de compra
1. Cliente ve producto en el catálogo
2. Hace clic en "Ver detalle"
3. Hace clic en botón WhatsApp verde
4. Se abre `wa.me/573105000800?text=Hola%20Good%20Cell...`
5. Cliente escribe su solicitud, el negocio atiende manualmente

---

## 9. CI/CD — GitHub Actions

**¿Qué es CI/CD?** Integración Continua / Despliegue Continuo — cada vez que hacemos push a `main`, se ejecutan los tests automáticamente.

### Pipeline
```
Push a main ──▶ GitHub Actions ──▶ Setup Python ──▶ pip install ──▶ pytest -v
```

### Tests (5)
| Test | ¿Qué verifica? |
|------|---------------|
| test_root | GET / → 200 OK |
| test_health | GET /health → 200 OK |
| test_get_categorias | GET /api/categorias → devuelve datos |
| test_get_productos | GET /api/productos → devuelve datos |
| test_login_invalido | POST /api/auth con credenciales malas → 401 |

---

## 10. Deploy — Render

**URL en producción:** https://goodcell-sas.onrender.com
**Documentación Swagger:** https://goodcell-sas.onrender.com/docs

**Cómo funciona el deploy:**
1. Repositorio conectado a Render
2. Cada push a `main` dispara un nuevo deploy automático
3. Render instala dependencias y ejecuta `uvicorn main:app`
4. La BD SQLite viaja con el código (se crea en el primer inicio)

---

## 11. Tema Visual (Diseño)

| Elemento | Detalle |
|----------|---------|
| Inspiración | Razer.com + Apple.com |
| Tipografía | Inter (Google Fonts) |
| Tema default | Oscuro (#0a0a0a) |
| Color acento | Verde Good Cell (#4ade80) |
| Animaciones | Fade-in, typewriter, ripple, parallax |
| Responsive | Mobile first, menú hamburguesa |

---

## 12. Posibles Preguntas del Jurado

### Sobre la Arquitectura
**¿Por qué FastAPI y no Django o Flask?**
FastAPI es más rápido que Flask, tiene documentación automática (Swagger) que Django no tiene por defecto, y su sintaxis moderna con type hints facilita el desarrollo. Además, al ser un proyecto pequeño, Django sería sobredimensionado.

**¿Por qué SQLite en lugar de PostgreSQL?**
Para esta fase del proyecto, SQLite elimina la necesidad de configurar un servidor de base de datos externo. Cualquier persona que clone el repositorio puede ejecutarlo inmediatamente sin instalar MySQL o PostgreSQL.

### Sobre la Seguridad
**¿Cómo se protegen las contraseñas?**
Se hashean con SHA256 antes de almacenarse. Sin embargo, en producción real se recomienda usar bcrypt o argon2 para mayor seguridad.

**¿Los tokens son seguros?**
Se generan con `secrets.token_hex(32)` que es criptográficamente seguro (64 caracteres aleatorios).

### Sobre el Frontend
**¿Por qué no usar React o Vue?**
El proyecto tiene solo 3 páginas HTML. Usar un framework SPA (Single Page Application) agregaría complejidad innecesaria. JavaScript Vanilla con Fetch API es suficiente y más eficiente para este alcance.

**¿Cómo se maneja el estado del tema oscuro/claro?**
Se almacena en `localStorage`. Cuando el usuario cambia el tema, se guarda la preferencia y al recargar la página se restaura automáticamente.

### Sobre el Modelado de Datos
**¿Está normalizada la base de datos?**
Sí. Está en 3FN: cada tabla tiene una PK, los atributos son atómicos, y no hay dependencias transitivas.

**¿Qué tipo de relaciones hay?**
Una relación 1:N entre categorías y productos (una categoría tiene muchos productos, un producto pertenece a una categoría).

### Sobre el Carrito
**¿Por qué no implementaron un carrito tradicional?**
Porque el negocio real funciona con atención personalizada por WhatsApp. Los clientes prefieren hablar directamente con el vendedor para resolver dudas antes de comprar. Además, implementar una pasarela de pagos implica costos y regulaciones que están fuera del alcance universitario.

### Sobre el Futuro
**¿Qué mejoras se pueden hacer?**
- Migrar a PostgreSQL para producción real
- Implementar JWT real para autenticación
- Agregar carrito de compras completo con pasarela de pagos
- Conectar las tablas `pedidos` y `detalle_pedido` (ya existen en el schema SQL)
- Agregar los 40+ productos reales del negocio
- Subir el frontend a Bluehost con dominio real goodcell.com

---

## 13. Comandos Útiles para la Demo

```bash
# Iniciar backend
cd backend
uvicorn main:app --reload
# http://localhost:8000
# http://localhost:8000/docs (Swagger)

# Correr tests
cd backend
pytest test_main.py -v

# Ver estructura de la BD
cd backend
python3 -c "
import sqlite3
conn = sqlite3.connect('goodcell.db')
c = conn.cursor()
for r in c.execute('SELECT p.nombre, p.precio, c.nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id'):
    print(r)
conn.close()
"
```

---

## 14. Resumen de 1 Minuto (Elevator Pitch)

"Good Cell SAS es un sistema web para la tienda de tecnología de mi familia en Pereira. Tiene un catálogo de productos con búsqueda y filtros, un panel de administración para gestionar el inventario, y el carrito funciona por WhatsApp. El backend está hecho con FastAPI que es un framework moderno de Python, usa SQLite para que no necesite configuración, y el frontend es HTML, CSS y JavaScript puro. Está desplegado en Render y cada vez que hago push a GitHub se ejecutan tests automáticos con GitHub Actions."
