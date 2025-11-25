# API E-commerce con NestJS, TypeORM y Mongoose

API completa para un sistema de e-commerce con soporte para MySQL (TypeORM) y MongoDB (Mongoose), incluyendo sincronización automática de eventos y análítica avanzada.

## 🚀 Características

- ✅ CRUD completo para Usuarios, Productos y Pedidos
- ✅ Sincronización automática MySQL → MongoDB
- ✅ Análitica avanzada con 10+ endpoints
- ✅ Validación de datos con class-validator
- ✅ Manejo centralizado de errores
- ✅ Tipado fuerte con TypeScript
- ✅ Relaciones entre entidades
- ✅ Inyección de dependencias

## 📋 Requisitos

- Node.js >= 18
- Docker y Docker Compose
- npm >= 9

## 🔧 Instalación

### 1. Clonar y instalar dependencias

```bash
cd entrega-final-bd
npm install
```

### 2. Variables de entorno

Se incluye archivo `.env` con la siguiente configuración:

```env
# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=rootpassword
MYSQL_DATABASE=ecommerce

# MongoDB
MONGO_URI=mongodb://mongoadmin:mongo_pass@localhost:27017/ecommerce?authSource=admin

# App
PORT=3000
NODE_ENV=development
```

### 3. Iniciar bases de datos con Docker

```bash
docker-compose up -d
```

Esto inicia:
- **MySQL 8.0**: puerto 3306
- **MongoDB 6.0**: puerto 27017

### 4. Ejecutar la aplicación

```bash
# Desarrollo con watch
npm run start:dev

# Producción
npm run build
npm run start:prod
```

La API estará disponible en: `http://localhost:3000/api`

## 📁 Estructura del Proyecto

```
src/
├── config/                    # Configuración de BD
│   ├── typeorm.config.ts     # Configuración TypeORM
│   └── mongoose.config.ts    # Configuración Mongoose
├── common/                    # Filtros y Pipes
│   ├── filters/
│   │   └── all-exceptions.filter.ts
│   └── pipes/
│       └── validation.pipe.ts
├── usuarios/                  # Módulo Usuarios
│   ├── entities/
│   ├── dto/
│   ├── usuarios.service.ts
│   ├── usuarios.controller.ts
│   └── usuarios.module.ts
├── productos/                 # Módulo Productos
│   ├── entities/
│   ├── dto/
│   ├── productos.service.ts
│   ├── productos.controller.ts
│   └── productos.module.ts
├── pedidos/                   # Módulo Pedidos
│   ├── entities/
│   │   ├── pedido.entity.ts
│   │   └── pedido-detalle.entity.ts
│   ├── schemas/
│   │   └── order-event.schema.ts  # Schema MongoDB
│   ├── dto/
│   ├── pedidos.service.ts
│   ├── pedidos.controller.ts
│   └── pedidos.module.ts
├── analytics/                 # Módulo Analytics
│   ├── analytics.service.ts
│   ├── analytics.controller.ts
│   └── analytics.module.ts
├── app.module.ts              # Módulo principal
└── main.ts                    # Punto de entrada
```

## 🔌 Endpoints

### Usuarios

```
POST   /api/usuarios              # Crear usuario
GET    /api/usuarios              # Obtener todos
GET    /api/usuarios/:id          # Obtener uno
PATCH  /api/usuarios/:id          # Actualizar
DELETE /api/usuarios/:id          # Eliminar
```

**Ejemplo de creación:**
```json
POST /api/usuarios
{
  "email": "juan@ejemplo.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "+34612345678",
  "ciudad": "Madrid",
  "pais": "España"
}
```

### Productos

```
POST   /api/productos             # Crear producto
GET    /api/productos             # Obtener todos
GET    /api/productos/:id         # Obtener uno
PATCH  /api/productos/:id         # Actualizar
DELETE /api/productos/:id         # Eliminar
```

**Ejemplo de creación:**
```json
POST /api/productos
{
  "nombre": "Laptop HP",
  "descripcion": "Laptop de 15 pulgadas",
  "precio": 899.99,
  "stock": 10,
  "categoria": "Electrónica"
}
```

### Pedidos

```
POST   /api/pedidos                    # Crear pedido
GET    /api/pedidos                    # Obtener todos
GET    /api/pedidos/:id                # Obtener uno
GET    /api/pedidos/:id/detalles       # Obtener detalles
POST   /api/pedidos/:id/detalles       # Agregar detalle
PATCH  /api/pedidos/:id                # Actualizar estado
DELETE /api/pedidos/:id                # Cancelar pedido
GET    /api/pedidos/usuario/:usuarioId # Pedidos de usuario
```

**Crear pedido:**
```json
POST /api/pedidos
{
  "usuario_id": 1,
  "notas": "Entrega en oficina"
}
```

**Agregar item al pedido:**
```json
POST /api/pedidos/1/detalles
{
  "producto_id": 1,
  "cantidad": 2
}
```

### Analytics - Reportes Avanzados

```
GET /api/analytics/pedidos-detallados          # Vista detallada de pedidos
GET /api/analytics/productos-bajo-stock        # Productos con stock bajo
GET /api/analytics/historial-usuario/:id       # Historial compras usuario
GET /api/analytics/pedidos-hoy                 # Pedidos creados hoy
GET /api/analytics/top-productos              # Top 10 productos vendidos
GET /api/analytics/top-usuarios                # Clientes con más compras
GET /api/analytics/ventas-diarias              # Ventas por día (últimos 30 días)
GET /api/analytics/stock-menor-a/:cantidad     # Stock inferior a cantidad
GET /api/analytics/pedidos-por-estado          # Agrupación por estado
GET /api/analytics/ventas-mes                  # Ventas del mes actual
GET /api/analytics/resumen-inventario          # Resumen stock por categoría
GET /api/analytics/ventas-por-categoria        # Ventas agrupadas por categoría
```

**Ejemplos de uso:**

```bash
# Top 5 productos vendidos
GET /api/analytics/top-productos?limit=5

# Stock menor a 10 unidades
GET /api/analytics/stock-menor-a/10

# Historial de usuario con ID 1
GET /api/analytics/historial-usuario/1

# Productos con stock bajo (por defecto: 5)
GET /api/analytics/productos-bajo-stock?umbral=15

# Ventas de los últimos 60 días
GET /api/analytics/ventas-diarias?dias=60
```

## 🔄 Sincronización MySQL → MongoDB

Cuando se crean, actualizan o cancelan pedidos, se registran automáticamente eventos en MongoDB:

**Colección: `order_events`**

```json
{
  "_id": ObjectId("..."),
  "orderId": 1,
  "event": "CREADO",
  "timestamp": "2025-11-24T10:30:00.000Z",
  "metadata": {
    "source": "nestjs-api"
  }
}
```

**Eventos registrados:**
- `CREADO`: Cuando se crea un nuevo pedido
- `ESTADO_ACTUALIZADO_*`: Cuando cambia el estado
- `CANCELADO`: Cuando se cancela un pedido

## ✅ Validación de Datos

Todos los DTOs utilizan `class-validator` para validación automática:

- **Email**: Validación de formato
- **Números**: Rango mínimo/máximo
- **Strings**: Longitud mínima/máxima
- **Campos requeridos**: Notificación clara
- **Errores formateados**: Respuesta estructurada

**Respuesta de error:**
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
    }
  ],
  "timestamp": "2025-11-24T10:30:00.000Z",
  "path": "/api/usuarios"
}
```

## 🛡️ Manejo de Errores

La aplicación incluye un filtro global de excepciones que:

- Captura todas las excepciones HTTP
- Maneja errores de validación
- Detecta duplicados en BD
- Retorna respuestas estructuradas
- Incluye metadata (timestamp, path)

## 📊 Entidades TypeORM

### Usuario
- `id`: PK
- `email`: Único, requerido
- `nombre`, `apellido`: Requerido
- `telefono`, `direccion`, `ciudad`, `pais`, `codigo_postal`: Opcional
- `estado`: "ACTIVO" por defecto
- Relación: 1→N con Pedidos

### Producto
- `id`: PK
- `nombre`: Único, requerido
- `descripcion`: Opcional
- `precio`: Decimal(10,2)
- `stock`: Entero, default 0
- `categoria`: Opcional
- `estado`: "DISPONIBLE" por defecto
- Relación: 1→N con PedidoDetalles

### Pedido
- `id`: PK
- `usuario_id`: FK → Usuarios
- `total`: Decimal(12,2)
- `estado`: "PENDIENTE", "CONFIRMADO", "ENVIADO", "ENTREGADO", "CANCELADO"
- `notas`: Opcional
- Relación: N→1 con Usuario, 1→N con PedidoDetalles

### PedidoDetalle
- `id`: PK
- `pedido_id`: FK → Pedidos (CASCADE)
- `producto_id`: FK → Productos
- `cantidad`: Entero
- `precio_unitario`, `subtotal`: Decimal(10,2)
- Relación: N→1 con Pedido y Producto

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:cov

# Tests E2E
npm run test:e2e
```

## 📦 Dependencias Instaladas

```
@nestjs/common: ^11.0.1
@nestjs/core: ^11.0.1
@nestjs/typeorm: TypeORM integration
@nestjs/mongoose: Mongoose integration
@nestjs/config: Manejo de variables de entorno
typeorm: ORM para MySQL
mongoose: ODM para MongoDB
mysql2: Driver MySQL
class-validator: Validación
class-transformer: Transformación de datos
```

## 🔒 Buenas Prácticas Implementadas

- ✅ Inyección de dependencias
- ✅ Separación de responsabilidades (Controller → Service → Repository)
- ✅ DTOs estrictos con validación
- ✅ Tipado fuerte TypeScript
- ✅ Manejo centralizado de errores
- ✅ Relaciones correctas entre entidades
- ✅ Sincronización automática BD
- ✅ Queries optimizadas
- ✅ Prefijo global de rutas

## 🚨 Troubleshooting

### Error de conexión MySQL

```bash
# Verificar que MySQL está corriendo
docker ps | grep mysql

# Ver logs
docker logs ecommerce-mysql
```

### Error de conexión MongoDB

```bash
# Verificar que MongoDB está corriendo
docker ps | grep mongo

# Ver logs
docker logs ecommerce-mongo
```

### Error de puerto en uso

```bash
# Cambiar puerto en .env
PORT=3001
```

### Reconstruir base de datos

```bash
# Parar contenedores
docker-compose down -v

# Iniciar nuevamente
docker-compose up -d
```

## 📝 Notas

- La aplicación utiliza `TYPEORM_SYNCHRONIZE=false`, requiere migraciones manuales
- Todos los endpoints son RESTful
- Las respuestas incluyen relaciones cargadas
- La sincronización MongoDB es asíncrona y no bloquea las respuestas
- Los DTOs son inmutables (PartialType para updates)

## 👨‍💻 Autor

Generado con NestJS CLI y configurado manualmente para máxima flexibilidad.

---

**¡La API está lista para producción!** 🎉
