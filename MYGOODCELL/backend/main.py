"""
Good Cell SAS - Backend FastAPI con SQLite
API REST para tienda de tecnología premium
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import sqlite3
import os
import hashlib
import secrets

app = FastAPI(
    title="Good Cell SAS API",
    description="API REST para tienda de tecnología premium",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)

DB_PATH = os.path.join(os.path.dirname(__file__), "goodcell.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            contrasena_hash TEXT NOT NULL,
            rol TEXT DEFAULT 'cliente',
            activo INTEGER DEFAULT 1,
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE,
            descripcion TEXT,
            imagen TEXT,
            activo INTEGER DEFAULT 1,
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            categoria_id INTEGER NOT NULL,
            nombre TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            precio REAL NOT NULL,
            marca TEXT NOT NULL,
            stock INTEGER DEFAULT 0,
            imagen TEXT,
            activo INTEGER DEFAULT 1,
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        );
    """)

    # Seed categorias
    cursor.execute("SELECT COUNT(*) FROM categorias")
    if cursor.fetchone()[0] == 0:
        categorias = [
            ('Parlantes', 'Equipos de audio premium'),
            ('Audifonos', 'Audifonos premium'),
            ('Apple', 'Accesorios Apple'),
            ('Gaming', 'Equipos gaming'),
            ('Fotografía', 'Equipos fotografía'),
            ('Hogar Inteligente', 'Domótica y smart home'),
            ('Accesorios', 'Accesorios varios'),
        ]
        cursor.executemany("INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)", categorias)

    # Seed productos
    cursor.execute("SELECT COUNT(*) FROM productos")
    if cursor.fetchone()[0] == 0:
        productos = [
            (1, 'BOSE S1 Pro+', 'Parlante profesional portátil con sonido potente y batería de larga duración.', 3500000, 'BOSE', 5),
            (1, 'JBL Neo One Compact', 'Parlante compacto premium con bajos definidos y conectividad moderna.', 3000000, 'JBL', 8),
            (2, 'Shokz Open Dots', 'Audifonos de conducción ósea Pro 2 Open', 500000, 'Shokz', 10),
            (3, 'Apple Pencil USB-C', 'Precisión profesional para dibujo, notas y productividad en iPad.', 550000, 'Apple', 15),
            (4, 'Logitech G502 Hero', 'Mouse gaming ergonómico con sensor de alta precisión.', 280000, 'Logitech', 12),
            (5, 'Fujifilm Instax Mini 12', 'Cámara instantánea con estilo moderno y resultados vibrantes.', 400000, 'Fujifilm', 7),
            (6, 'Amazon Echo Pop', 'Asistente inteligente compacto para audio y control del hogar.', 270000, 'Amazon', 20),
            (7, 'Cable Belkin USB-A Lightning', 'Cable resistente para carga y transferencia de datos.', 100000, 'Belkin', 30),
        ]
        cursor.executemany(
            "INSERT INTO productos (categoria_id, nombre, descripcion, precio, marca, stock) VALUES (?, ?, ?, ?, ?, ?)",
            productos
        )

    # Seed admin
    cursor.execute("SELECT COUNT(*) FROM usuarios")
    if cursor.fetchone()[0] == 0:
        password_hash = hashlib.sha256("admin23".encode()).hexdigest()
        cursor.execute(
            "INSERT INTO usuarios (nombre, email, contrasena_hash, rol) VALUES (?, ?, ?, ?)",
            ('Administrador Good Cell', 'admin@goodcell.com', password_hash, 'admin')
        )

    conn.commit()
    conn.close()

init_db()

# Modelos
class LoginRequest(BaseModel):
    email: str
    password: str

class CategoriaCreate(BaseModel):
    nombre: str
    descripcion: str
    imagen: Optional[str] = None
    activo: Optional[int] = 1

class ProductoCreate(BaseModel):
    categoria_id: int
    nombre: str
    descripcion: str
    precio: float
    marca: str
    stock: int
    imagen: Optional[str] = None
    activo: Optional[int] = 1

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_admin(credentials: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    if not credentials:
        raise HTTPException(status_code=401, detail="No autorizado")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE rol = 'admin' AND activo = 1 LIMIT 1")
    admin = cursor.fetchone()
    if not admin:
        raise HTTPException(status_code=401, detail="No autorizado")
    return dict(admin)

# Endpoints
@app.get("/")
def root():
    return {"ok": True, "message": "Good Cell SAS API v1.0.0"}

@app.get("/health")
def health():
    return {"ok": True, "status": "running"}

@app.post("/api/auth")
def login(data: LoginRequest, db=Depends(get_db)):
    cursor = db.cursor()
    password_hash = hash_password(data.password)
    cursor.execute(
        "SELECT id, nombre, email, rol FROM usuarios WHERE email = ? AND contrasena_hash = ? AND activo = 1",
        (data.email, password_hash)
    )
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    token = secrets.token_hex(32)
    return {"ok": True, "data": dict(user), "token": token}

@app.get("/api/categorias")
def get_categorias(db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM categorias WHERE activo = 1 ORDER BY nombre")
    return {"ok": True, "data": [dict(c) for c in cursor.fetchall()]}

@app.get("/api/categorias/{categoria_id}")
def get_categoria(categoria_id: int, db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM categorias WHERE id = ? AND activo = 1", (categoria_id,))
    categoria = cursor.fetchone()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return {"ok": True, "data": dict(categoria)}

@app.get("/api/productos")
def get_productos(db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.*, c.nombre AS categoria_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.activo = 1
        ORDER BY p.creado_en DESC
    """)
    return {"ok": True, "data": [dict(p) for p in cursor.fetchall()]}

@app.get("/api/producto")
def get_producto(id: int, db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.*, c.nombre AS categoria_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.id = ? AND p.activo = 1
    """, (id,))
    producto = cursor.fetchone()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"ok": True, "data": dict(producto)}

@app.get("/api/admin/categorias")
def admin_get_categorias(db=Depends(get_db), admin=Depends(verify_admin)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM categorias ORDER BY nombre")
    return {"ok": True, "data": [dict(c) for c in cursor.fetchall()]}

@app.post("/api/admin/categorias", status_code=201)
def admin_create_categoria(data: CategoriaCreate, db=Depends(get_db), admin=Depends(verify_admin)):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO categorias (nombre, descripcion, imagen, activo) VALUES (?, ?, ?, ?)",
        (data.nombre, data.descripcion, data.imagen, data.activo)
    )
    db.commit()
    return {"ok": True, "message": "Categoría creada", "id": cursor.lastrowid}

@app.put("/api/admin/categorias/{categoria_id}")
def admin_update_categoria(categoria_id: int, data: CategoriaCreate, db=Depends(get_db), admin=Depends(verify_admin)):
    cursor = db.cursor()
    cursor.execute(
        "UPDATE categorias SET nombre=?, descripcion=?, imagen=?, activo=? WHERE id=?",
        (data.nombre, data.descripcion, data.imagen, data.activo, categoria_id)
    )
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return {"ok": True, "message": "Categoría actualizada"}

@app.get("/api/admin/productos")
def admin_get_productos(db=Depends(get_db), admin=Depends(verify_admin)):
    cursor = db.cursor()
    cursor.execute("""
        SELECT p.*, c.nombre AS categoria_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        ORDER BY p.creado_en DESC
    """)
    return {"ok": True, "data": [dict(p) for p in cursor.fetchall()]}

@app.post("/api/admin/productos", status_code=201)
def admin_create_producto(data: ProductoCreate, db=Depends(get_db), admin=Depends(verify_admin)):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO productos (categoria_id, nombre, descripcion, precio, marca, stock, imagen, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (data.categoria_id, data.nombre, data.descripcion, data.precio, data.marca, data.stock, data.imagen, data.activo)
    )
    db.commit()
    return {"ok": True, "message": "Producto creado", "id": cursor.lastrowid}

@app.put("/api/admin/productos/{producto_id}")
def admin_update_producto(producto_id: int, data: ProductoCreate, db=Depends(get_db), admin=Depends(verify_admin)):
    cursor = db.cursor()
    cursor.execute(
        "UPDATE productos SET categoria_id=?, nombre=?, descripcion=?, precio=?, marca=?, stock=?, imagen=?, activo=? WHERE id=?",
        (data.categoria_id, data.nombre, data.descripcion, data.precio, data.marca, data.stock, data.imagen, data.activo, producto_id)
    )
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"ok": True, "message": "Producto actualizado"}
