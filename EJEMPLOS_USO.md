# Ejemplos de Uso de la API

## 1. Crear un Usuario

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "carlos@ejemplo.com",
    "nombre": "Carlos García",
    "password_hash": "hashed_password_here"
  }'
```

**Respuesta exitosa (201):**
```json
{
  "id": 1,
  "email": "carlos@ejemplo.com",
  "nombre": "Carlos García",
  "password_hash": "hashed_password_here",
  "creado_en": "2025-11-24T10:30:00.000Z"
}
```

## 2. Crear Productos

```bash
# Producto 1
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop HP Pavilion",
    "descripcion": "Laptop de 15 pulgadas, Intel i7, 16GB RAM",
    "precio": 899.99,
    "stock": 15
  }'

# Producto 2
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mouse Logitech MX Master",
    "descripcion": "Mouse inalámbrico profesional",
    "precio": 99.99,
    "stock": 50
  }'

# Producto 3
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Teclado Mecánico RGB",
    "descripcion": "Teclado mecánico con switches Cherry MX",
    "precio": 149.99,
    "stock": 2
  }'
```

## 3. Obtener Todos los Productos

```bash
curl http://localhost:3000/api/productos
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Laptop HP Pavilion",
    "descripcion": "Laptop de 15 pulgadas, Intel i7, 16GB RAM",
    "precio": 899.99,
    "stock": 15,
    "creado_en": "2025-11-24T10:35:00.000Z"
  },
  {
    "id": 2,
    "nombre": "Mouse Logitech MX Master",
    "descripcion": "Mouse inalámbrico profesional",
    "precio": 99.99,
    "stock": 50,
    "creado_en": "2025-11-24T10:35:30.000Z"
  }
]
```

## 4. Crear Pedido

```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1
  }'
```

**Respuesta (201):**
```json
{
  "id": 1,
  "usuario_id": 1,
  "total": 0,
  "estado": "CREADO",
  "creado_en": "2025-11-24T10:40:00.000Z"
}
```

## 5. Agregar Ítems al Pedido

```bash
# Agregar Laptop
curl -X POST http://localhost:3000/api/pedidos/1/detalles \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 1,
    "cantidad": 1
  }'

# Agregar Mouse
curl -X POST http://localhost:3000/api/pedidos/1/detalles \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 2,
    "cantidad": 2
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "pedido_id": 1,
  "producto_id": 1,
  "cantidad": 1,
  "precio_unit": 899.99,
  "creado_en": "2025-11-24T10:42:00.000Z"
}
```

## 6. Obtener Detalles del Pedido

```bash
curl http://localhost:3000/api/pedidos/1/detalles
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "pedido_id": 1,
    "producto_id": 1,
    "cantidad": 1,
    "precio_unit": "899.99",
    "creado_en": "2025-11-24T10:42:00.000Z",
    "producto": {
      "id": 1,
      "nombre": "Laptop HP Pavilion",
      "precio": "899.99",
      "stock": 14
    }
  },
  {
    "id": 2,
    "pedido_id": 1,
    "producto_id": 2,
    "cantidad": 2,
    "precio_unit": "99.99",
    "creado_en": "2025-11-24T10:42:30.000Z",
    "producto": {
      "id": 2,
      "nombre": "Mouse Logitech MX Master",
      "precio": "99.99",
      "stock": 48
    }
  }
]
```

## 7. Actualizar Estado del Pedido

```bash
curl -X PATCH http://localhost:3000/api/pedidos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "CONFIRMADO"
  }'
```

## 8. Consultas de Analytics

### 8.1 Pedidos Detallados

```bash
curl http://localhost:3000/api/analytics/pedidos-detallados
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "usuario_id": 1,
    "nombre": "Carlos García",
    "email": "carlos@ejemplo.com",
    "total": "1099.97",
    "estado": "CONFIRMADO",
    "creado_en": "2025-11-24T10:40:00.000Z",
    "cantidad_items": 2
  }
]
```

### 8.2 Productos con Stock Bajo

```bash
# Stock por debajo de 5 unidades (por defecto)
curl http://localhost:3000/api/analytics/productos-bajo-stock

# Stock por debajo de 10 unidades
curl http://localhost:3000/api/analytics/productos-bajo-stock?umbral=10
```

**Respuesta:**
```json
[
  {
    "id": 3,
    "nombre": "Teclado Mecánico RGB",
    "descripcion": "Teclado mecánico con switches Cherry MX",
    "precio": "149.99",
    "stock": 2
  }
]
```

### 8.3 Historial de Usuario

```bash
curl http://localhost:3000/api/analytics/historial-usuario/1
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "total": "1099.97",
    "estado": "CONFIRMADO",
    "creado_en": "2025-11-24T10:40:00.000Z",
    "cantidad_items": 2,
    "total_productos": 3
  }
]
```

### 8.4 Top Productos

```bash
# Top 10 (por defecto)
curl http://localhost:3000/api/analytics/top-productos

# Top 5
curl http://localhost:3000/api/analytics/top-productos?limit=5
```

**Respuesta:**
```json
[
  {
    "id": 2,
    "nombre": "Mouse Logitech MX Master",
    "precio": "99.99",
    "total_vendido": 2,
    "numero_pedidos": 1,
    "ingresos_totales": "199.98"
  },
  {
    "id": 1,
    "nombre": "Laptop HP Pavilion",
    "precio": "899.99",
    "total_vendido": 1,
    "numero_pedidos": 1,
    "ingresos_totales": "899.99"
  }
]
```

### 8.5 Top Usuarios (Clientes)

```bash
curl http://localhost:3000/api/analytics/top-usuarios?limit=10
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "email": "carlos@ejemplo.com",
    "nombre": "Carlos García",
    "numero_pedidos": 1,
    "gasto_total": "1099.97",
    "gasto_promedio": "1099.97"
  }
]
```

### 8.6 Ventas Diarias

```bash
# Últimos 30 días (por defecto)
curl http://localhost:3000/api/analytics/ventas-diarias

# Últimos 60 días
curl http://localhost:3000/api/analytics/ventas-diarias?dias=60
```

**Respuesta:**
```json
[
  {
    "fecha": "2025-11-24",
    "numero_pedidos": 1,
    "total_ventas": "1099.97",
    "promedio_venta": "1099.97"
  }
]
```

### 8.7 Stock Menor a Cantidad

```bash
# Stock menor a 10 unidades
curl http://localhost:3000/api/analytics/stock-menor-a/10
```

**Respuesta:**
```json
[
  {
    "id": 3,
    "nombre": "Teclado Mecánico RGB",
    "descripcion": "Teclado mecánico con switches Cherry MX",
    "precio": "149.99",
    "stock": 2
  }
]
```

### 8.8 Pedidos por Estado

```bash
curl http://localhost:3000/api/analytics/pedidos-por-estado
```

**Respuesta:**
```json
[
  {
    "estado": "CONFIRMADO",
    "cantidad": 1,
    "total_ventas": "1099.97",
    "promedio_venta": "1099.97"
  },
  {
    "estado": "PENDIENTE",
    "cantidad": 0,
    "total_ventas": null,
    "promedio_venta": null
  }
]
```

### 8.9 Ventas del Mes Actual

```bash
curl http://localhost:3000/api/analytics/ventas-mes
```

**Respuesta:**
```json
[
  {
    "mes": "2025-11",
    "numero_pedidos": 1,
    "total_ventas": "1099.97",
    "promedio_venta": "1099.97",
    "venta_minima": "1099.97",
    "venta_maxima": "1099.97"
  }
]
```

### 8.10 Resumen de Inventario

```bash
curl http://localhost:3000/api/analytics/resumen-inventario
```

**Respuesta:**
```json
[
  {
    "categoria": "General",
    "numero_productos": 3,
    "stock_total": 67,
    "precio_promedio": "349.99",
    "precio_minimo": "99.99",
    "precio_maximo": "899.99",
    "valor_inventario": "23499.33"
  }
]
```

## 9. Verificar Sincronización en MongoDB

```bash
# Conectarse a MongoDB
docker exec -it ecommerce-mongo mongosh -u mongoadmin -p mongo_pass --authenticationDatabase admin

# Dentro del shell:
use ecommerce
db.orderevents.find().pretty()
```

**Resultado esperado:**
```json
{
  "_id": ObjectId("..."),
  "orderId": 1,
  "event": "CREADO",
  "timestamp": ISODate("2025-11-24T10:40:00.000Z"),
  "metadata": {
    "source": "nestjs-api"
  },
  "__v": 0
}
```

## 10. Errores Comunes

### Email duplicado

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "carlos@ejemplo.com",
    "nombre": "Test",
    "apellido": "Test"
  }'
```

**Respuesta (400):**
```json
{
  "statusCode": 400,
  "message": "El email ya está registrado",
  "timestamp": "2025-11-24T10:45:00.000Z",
  "path": "/api/usuarios"
}
```

### Validación fallida

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalido",
    "nombre": "A"
  }'
```

**Respuesta (400):**
```json
{
  "statusCode": 400,
  "message": "Error de validación",
  "errors": [
    {
      "field": "email",
      "errors": ["email must be an email"]
    },
    {
      "field": "nombre",
      "errors": ["nombre must be longer than or equal to 3 characters"]
    },
    {
      "field": "password_hash",
      "errors": ["password_hash should not be empty"]
    }
  ],
  "timestamp": "2025-11-24T10:45:30.000Z",
  "path": "/api/usuarios"
}
```

### Stock insuficiente

```bash
curl -X POST http://localhost:3000/api/pedidos/1/detalles \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 3,
    "cantidad": 100
  }'
```

**Respuesta (400):**
```json
{
  "statusCode": 400,
  "message": "Stock insuficiente",
  "timestamp": "2025-11-24T10:46:00.000Z",
  "path": "/api/pedidos/1/detalles"
}
```

---

**¡Estos ejemplos cubren todos los casos de uso principales de la API!** 🚀
