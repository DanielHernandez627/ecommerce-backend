// === mongo-init.js ===
// Inicialización de colecciones MongoDB

// Base de datos
use('ecommerce');

// Colección: logs de actividad
if (!db.getCollectionNames().includes('activity_logs')) {
db.createCollection('activity_logs');
db.activity_logs.createIndex({ userId: 1, timestamp: -1 });
}


// Colección: reseñas de productos
if (!db.getCollectionNames().includes('reviews')) {
db.createCollection('reviews');
db.reviews.createIndex({ productId: 1 });
}


// Colección: eventos del ciclo de vida del pedido
if (!db.getCollectionNames().includes('order_events')) {
db.createCollection('order_events');
db.order_events.createIndex({ orderId: 1, timestamp: -1 });
}


// Documento de prueba

// Evento inicial de ejemplo
db.order_events.insertOne({
orderId: 1,
event: "CREADO",
timestamp: new Date(),
metadata: { source: "init-script" }
});