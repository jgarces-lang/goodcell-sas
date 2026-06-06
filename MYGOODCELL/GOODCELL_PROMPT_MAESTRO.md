# PROMPT MAESTRO — GOOD CELL SAS
# Usar al inicio de cada nueva conversación con cualquier IA

## CONTEXTO DEL PROYECTO

Soy Juan Garces, estudiante de Tecnología en Desarrollo de Software 
en la Universidad Tecnológica de Pereira (UTP), Colombia.

Este proyecto tiene dos propósitos simultáneos:
1. Página web REAL para el negocio familiar **Good Cell SAS** — tienda de tecnología premium en Pereira
2. Proyecto final universitario de las materias Modelado de Software y Base de Datos

---

## NEGOCIO

- **Nombre:** Good Cell SAS
- **Tipo:** Tienda de tecnología premium
- **Ciudad:** Pereira, Risaralda, Colombia
- **WhatsApp:** +57 310 5000800
- **Dominio:** goodcell.com (Bluehost)
- **Logo:** Pulgar verde con iconos de tecnología (archivo: logo-good-cell.png)
- **Marcas:** Apple, BOSE, JBL, Logitech, Shokz, Fujifilm, Wacom, Alexa, Belkin, Razer, Redragon, Victrola, Cubitt, Xiaomi, Trust, Microsoft

---

## STACK TECNOLÓGICO

- **Frontend:** HTML + CSS + JavaScript vanilla (SIN frameworks)
- **Backend:** PHP puro
- **Base de datos:** MySQL
- **Hosting:** Bluehost (PHP + MySQL incluidos)
- **Local:** XAMPP en Linux (Fedora)
- **Editor:** VS Code / Cursor
- **IA de código:** OpenCode (terminal)

---

## ESTRUCTURA DEL PROYECTO

```
~/MYGOODCELL-20260527T173633Z-3-001/MYGOODCELL/
├── frontend/
│   ├── pages/
│   │   ├── index.html      → Catálogo principal
│   │   ├── producto.html   → Detalle de producto
│   │   └── admin.html      → Panel de administración
│   ├── css/
│   │   └── style.css       → ~1027 líneas, tema oscuro/claro
│   ├── js/
│   │   └── main.js         → ~850 líneas, lógica completa
│   └── img/
│       ├── logo-good-cell.png
│       └── producto-placeholder.png
├── backend/
│   ├── api/
│   │   ├── productos.php
│   │   ├── producto.php
│   │   ├── categorias.php
│   │   ├── admin_productos.php
│   │   ├── admin_categorias.php
│   │   ├── auth.php
│   │   └── _helpers.php
│   └── config/
│       └── database.php
└── database/
    └── goodcell_db.sql
```

**Ruta XAMPP:** `/opt/lampp/htdocs/MYGOODCELL/`
**URL local:** `http://localhost/MYGOODCELL/frontend/pages/index.html`

---

## BASE DE DATOS — goodcell_db

### Tablas
```sql
categorias (id, nombre, descripcion, imagen, activo, creado_en)
productos (id, categoria_id, nombre, descripcion, precio, imagen, marca, stock, activo, creado_en)
usuarios (id, nombre, email, contrasena_hash, rol, activo, creado_en)
pedidos (id, nombre_cliente, telefono, total, estado, nota_whatsapp, creado_en)
detalle_pedido (id, pedido_id, producto_id, cantidad, precio_unit, subtotal)
```

### 7 Categorías
1. Parlantes (JBL, BOSE)
2. Audífonos (Shokz)
3. Apple
4. Gaming (Logitech, Redragon)
5. Fotografía (Fujifilm)
6. Hogar Inteligente (Amazon Alexa)
7. Accesorios (Belkin)

### 14 Productos actuales
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

### Credenciales admin
- Email: admin@goodcell.com
- Password: admin123

---

## LO QUE YA FUNCIONA ✅

- Catálogo con búsqueda por texto y filtro por categoría
- 14 productos con imágenes desde URLs externas
- Página de detalle con especificaciones y botón WhatsApp
- Panel admin con CRUD completo de productos y categorías
- Toggle claro/oscuro funcional
- Backend PHP conectado a MySQL real
- Autenticación de administrador con sesiones PHP
- Logo de Good Cell en el navbar

---

## DISEÑO VISUAL DESEADO

### Estilo general
- **Tema:** Oscuro por defecto, con toggle a claro
- **Fondo:** #0a0a0a (negro profundo)
- **Acento:** #4ade80 (verde Good Cell — conecta con el logo)
- **Cards:** #111111 con borde #1a1a1a
- **Inspiración:** Razer.com + Apple.com
- **Tipografía:** Inter (Google Fonts)

### Paleta completa
```
--bg: #0a0a0a
--surface: #111111
--surface-2: #1a1a1a
--accent: #4ade80
--accent-dark: #1a3a1a
--accent-border: #2d5a2d
--text: #f5f7fa
--muted: rgba(245,247,250,0.65)
--border: #1a1a1a
--whatsapp: #25d366
```

### Pantallas principales
1. **index.html** — Catálogo con:
   - Navbar sticky con logo + toggle tema
   - Hero verde oscuro con título grande, partículas y barra de búsqueda
   - Filtros de categorías en chips/pills horizontales
   - Grid de 3 columnas con cards de productos
   - Cada card: imagen (4:3), categoría en verde, nombre, descripción, precio, botón "Ver detalle"
   - Botón flotante WhatsApp

2. **producto.html** — Detalle con:
   - Imagen grande a la izquierda
   - Info completa a la derecha (categoría, nombre, precio, stock, descripción)
   - Grid de especificaciones (categoría, marca, precio, stock)
   - Botón WhatsApp verde grande con mensaje prellenado
   - Botón "Volver al catálogo"

3. **admin.html** — Panel con:
   - Formulario crear/editar productos
   - Formulario crear/editar categorías
   - Tabla de productos con editar/desactivar
   - Tabla de categorías

### Animaciones deseadas (pendientes)
- Scroll parallax en página de detalle (hero fullscreen tipo Apple)
- Cards con fade-in en cascada al hacer scroll
- Hover: elevación de card + borde verde sutil
- Transiciones suaves entre páginas

---

## CLASES CSS PRINCIPALES (del HTML actual)

```
Navbar: .navbar-wrap, .navbar, .navbar__brand, .navbar__brand-logo,
        .theme-toggle, .navbar__toggle, .navbar__menu, .navbar__link,
        .navbar__link--active, .navbar__cta

Hero: .hero, .hero__card, .hero__pill, .hero__title, .hero__text,
      .searchbar, .searchbar__icon, .input

Filtros: .catalog-controls, .field-label, .chips, .chip, .select,
         .catalog-stats

Catálogo: .products-grid, .product-card, .product-card__image-wrap,
          .product-card__image, .product-card__body, .product-card__category,
          .product-card__name, .product-card__desc, .product-card__footer,
          .product-card__price

Detalle: .product-detail, .product-detail__card, .product-detail__image-wrap,
         .product-detail__image, .product-detail__info, .product-detail__category,
         .product-detail__name, .product-detail__price, .product-detail__badge,
         .product-detail__desc, .specs-grid, .spec-card, .product-detail__actions

Admin: .admin-wrap, .grid-2, .form-card, .form-grid, .form-group,
       .table-section, .table-header, .badge, .badge--active, .badge--inactive

Globales: .btn, .btn--primary, .btn--whatsapp, .btn--ghost, .btn--danger,
          .container, .section-title, .section-subtitle, .footer-note,
          .whatsapp-fab, .reveal, .sr-only
```

---

## LO QUE FALTA CONSTRUIR ⏳

### Urgente (antes del 6 de Junio)
1. Restaurar CSS premium (el que se dañó durante experimentos)
2. Configurar Git y subir a GitHub
3. Mejorar imágenes de productos (URLs correctas de cada producto real)
4. README.md completo

### Futuro cercano
5. Efecto parallax en página de detalle (scroll tipo Apple)
6. Subir a Bluehost en goodcell.com
7. Agregar los 40+ productos reales de Good Cell
8. Sección "Productos relacionados" en detalle
9. Conectar tablas pedidos y detalle_pedido al frontend

---

## REGLAS DE DESARROLLO

- Todo el código comentado en español
- Mobile first → luego desktop
- Precios en pesos colombianos formato $X.XXX.XXX
- Botón de contacto siempre abre WhatsApp con mensaje predefinido
- SIN librerías externas (vanilla JS, CSS puro)
- SIN cursor personalizado (causaba bugs)
- SIN loading screen (causaba pantalla negra)
- Compatible con PHP en Bluehost
- El CSS usa variables CSS para ambos temas (oscuro/claro)

---

## COMANDOS ÚTILES

```bash
# Iniciar XAMPP
sudo /opt/lampp/lampp start

# Copiar frontend a XAMPP
sudo cp -r ~/MYGOODCELL-20260527T173633Z-3-001/MYGOODCELL/frontend /opt/lampp/htdocs/MYGOODCELL/

# Copiar backend a XAMPP
sudo cp -r ~/MYGOODCELL-20260527T173633Z-3-001/MYGOODCELL/backend /opt/lampp/htdocs/MYGOODCELL/

# Copiar todo a XAMPP
sudo cp -r ~/MYGOODCELL-20260527T173633Z-3-001/MYGOODCELL /opt/lampp/htdocs/

# Ver logs de Apache
sudo tail -f /opt/lampp/logs/error_log
```

---

## NOTA PARA LA IA

Juan Garces es estudiante principiante aprendiendo mientras construye.
Explica cada concepto paso a paso, usa analogías simples.
Cuando hagas cambios al código, explica qué cambiaste y por qué.
Prefiere cambios pequeños e incrementales sobre refactorizaciones grandes.
Siempre verifica que los cambios funcionan antes de continuar.
