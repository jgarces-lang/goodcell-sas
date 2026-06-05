from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["ok"] == True

def test_health():
    response = client.get("/health")
    assert response.status_code == 200

def test_get_categorias():
    response = client.get("/api/categorias")
    assert response.status_code == 200
    assert "data" in response.json()

def test_get_productos():
    response = client.get("/api/productos")
    assert response.status_code == 200
    assert "data" in response.json()

def test_login_invalido():
    response = client.post("/api/auth", json={
        "email": "noexiste@test.com",
        "password": "wrongpass"
    })
    assert response.status_code == 401