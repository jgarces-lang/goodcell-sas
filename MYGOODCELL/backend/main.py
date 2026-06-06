"""
Good Cell SAS - Backend FastAPI
API REST para tienda de tecnología premium
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import psycopg2
import psycopg2.extras
import os
import hashlib
import secrets
from dotenv import load_dotenv

load_dotenv()

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

def get_db():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "db.yunhasulmudkgubcqbjp.supabase.co"),
        database=os.getenv("DB_NAME", "postgres"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
        port=os.getenv("DB_PORT", "5432")
    )
    try:
        yield conn
    finally:
        conn.close()

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
    imagen: Optional[str] = "../img/producto-placeholder.png"
    activo: Optional[int] = 1

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_admin(credentials: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    if not credentials:
        raise HTTPException(status_code=401, detail="No autorizado")
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("SELECT * FROM usuarios WHERE rol = 'admin' AND activo = 1 LIMIT 1")
    admin = cursor.fetchone()
    if not admin:
        raise HTTPException(status_code=401, detail="No autorizado")
    return admin

@app.get("/")
def root():
    return {"ok": True, "message": "Good Cell SAS API v1.0.0"}

@app.get("/health")
def health():
    return {"ok": True, "status": "running"}

@app.post("/api/auth")
def login(data: LoginRequest, db=Depends(get_db)):
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    password_hash = hash_password(data.password)
    cursor.execute(
        "SELECT id, nombre, email, rol FROM usuarios WHERE email = %s AND contrasena_hash = %s AND activo = 1",
        (data.email, password_hash)
    )
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    token = secrets.token_hex(32)
    return {"ok": True, "data": dict(user), "token": token}

@app.get("/api/categorias")
def get_categorias(db=Depends(get_db)):
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("SELECT * FROM categorias WHERE activo = 1 ORDER BY nombre")
    categorias = cursor.fetchall()
    return {"ok": True, "data": [dict(c) for c in categorias]}

@app.get("/api/categorias/{categoria_id}")
def get_categoria(categoria_id: int, db=Depends(get_db)):
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("SELECT * FROM categorias WHERE id = %s AND activo = 1", (categoria_id,))
    categoria = cursor.fetchone()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return {"ok": True, "data": dict(categoria)}

@app.get("/api/productos")
def get_productos(db=Depends(get_db)):
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("""
        SELECT p.*, c.nombre AS categoria_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.activo = 1
        ORDER BY p.creado_en DESC
    """)
    productos = cursor.fetchall()
    return {"ok": True, "data": [dict(p) for p in productos]}

@app.get("/api/producto")
def get_producto(id: int, db=Depends(get_db)):
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("""
        SELECT p.*, c.nombre AS categoria_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.id = %s AND p.activo = 1
    """, (id,))
    producto = cursor.fetchone()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"ok": True, "data": dict(producto)}

@app.get("/api/admin/categorias")
def admin_get_categorias(db=Depends(get_db), admin=Depends(verify_admin)):
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("SELECT * FROM categorias ORDER BY nombre")
    return {"ok": True, "data": [dict(c) for c in cursor.fetchall()]}

@app.post("/api/admin/categorias", status_code=201)
def admin_create_categoria(data: CategoriaCreate, db=Depends(get_db), admin=Depends(verify_admin)):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO categorias (nombre, descripcion, imagen, activo) VALUES (%s, %s, %s, %s) RETURNING id",
        (data.nombre, data.descripcion, data.imagen, data.activo)
    )
    new_id = cursor.fetchone()[0]
    db.commit()
    return {"ok": True, "message": "Categoría creada", "id": new_id}

@app.put("/api/admin/categorias/{categoria_id}")
def admin_update_categoria(categoria_id: int, data: CategoriaCreate, db=Depends(get_db), admin=Depends(verify_admin)):
    cursor = db.cursor()
    cursor.execute(
        "UPDATE categorias SET nombre=%s, descripcion=%s, imagen=%s, activo=%s WHERE id=%s",
        (data.nombre, data.descripcion, data.imagen, data.activo, categoria_id)
    )
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return {"ok": True, "message": "Categoría actualizada"}

@app.get("/api/admin/productos")
def admin_get_productos(db=Depends(get_db), admin=Depends(verify_admin)):
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
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
        """INSERT INTO productos 
        (categoria_id, nombre, descripcion, precio, marca, stock, imagen, activo)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
        (data.categoria_id, data.nombre, data.descripcion, data.precio,
         data.marca, data.stock, data.imagen, data.activo)
    )
    new_id = cursor.fetchone()[0]
    db.commit()
    return {"ok": True, "message": "Producto creado", "id": new_id}

@app.put("/api/admin/productos/{producto_id}")
def admin_update_producto(producto_id: int, data: ProductoCreate, db=Depends(get_db), admin=Depends(verify_admin)):
    cursor = db.cursor()
    cursor.execute(
        """UPDATE productos SET categoria_id=%s, nombre=%s, descripcion=%s,
        precio=%s, marca=%s, stock=%s, imagen=%s, activo=%s WHERE id=%s""",
        (data.categoria_id, data.nombre, data.descripcion, data.precio,
         data.marca, data.stock, data.imagen, data.activo, producto_id)
    )
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"ok": True, "message": "Producto actualizado"}
