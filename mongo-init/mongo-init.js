// === mongo-init.js ===
// Inicialización de colecciones MongoDB basadas en el e-commerce
// Datos coherentes con los casos especiales del seed MySQL

// Seleccionar base de datos
use('ecommerce');


// ================================
// COLECCIÓN: activity_logs
// ================================
if (!db.getCollectionNames().includes('activity_logs')) {
  db.createCollection('activity_logs');
  db.activity_logs.createIndex({ userId: 1, timestamp: -1 });
}

// Actividades iniciales
db.activity_logs.insertMany([
  { userId: 1, action: "LOGIN", timestamp: new Date(), ip: "192.168.1.10" },
  { userId: 2, action: "VIEW_PRODUCT", productId: 3, timestamp: new Date() },
  { userId: 3, action: "LOGIN", timestamp: new Date() },
  { userId: 1, action: "CREATE_ORDER", orderId: 1, timestamp: new Date() },
  { userId: 5, action: "LOGIN_FAILED", timestamp: new Date(), reason: "User has no orders" } // Caso especial
]);


// ================================
// COLECCIÓN: reviews
// ================================
if (!db.getCollectionNames().includes('reviews')) {
  db.createCollection('reviews');
  db.reviews.createIndex({ productId: 1 });
}

// Reseñas de productos (incluyendo casos especiales)
db.reviews.insertMany([
  { userId: 1, productId: 1, rating: 5, comment: "Excelente producto", created_at: new Date() },
  { userId: 2, productId: 3, rating: 4, comment: "Muy buen teclado", created_at: new Date() },
  { userId: 3, productId: 7, rating: 2, comment: "Stock muy bajo, difícil de comprar", created_at: new Date() }, // caso especial stock bajo
  { userId: 4, productId: 8, rating: 1, comment: "Nunca hay stock", created_at: new Date() },                  // caso especial stock 0
  { userId: 1, productId: 9, rating: 3, comment: "Interesante que sea gratis", created_at: new Date() }       // precio 0
]);


// ================================
// COLECCIÓN: order_events
// ================================
if (!db.getCollectionNames().includes('order_events')) {
  db.createCollection('order_events');
  db.order_events.createIndex({ orderId: 1, timestamp: -1 });
}

// Eventos por cada pedido del seed MySQL
db.order_events.insertMany([
  // Pedido 1
  { orderId: 1, event: "CREADO", timestamp: new Date(), metadata: { total: 4280.00 } },
  { orderId: 1, event: "PAGO_CONFIRMADO", timestamp: new Date() },

  // Pedido 2
  { orderId: 2, event: "CREADO", timestamp: new Date() },
  { orderId: 2, event: "PAGADO", timestamp: new Date() },

  // Pedido 3
  { orderId: 3, event: "CREADO", timestamp: new Date() },
  { orderId: 3, event: "ENVIADO", timestamp: new Date() },

  // Pedido 4 — sin detalles
  { orderId: 4, event: "CREADO", timestamp: new Date(), metadata: { warning: "Pedido sin detalles" } },

  // Pedido 5 — cancelado
  { orderId: 5, event: "CREADO", timestamp: new Date() },
  { orderId: 5, event: "CANCELADO", timestamp: new Date(), metadata: { reason: "Pago no completado" } },

  // Pedido 6 — cantidades altas
  { orderId: 6, event: "CREADO", timestamp: new Date(), metadata: { specialCase: "High quantity order" } },

  // Pedido 7 — detalles duplicados
  { orderId: 7, event: "CREADO", timestamp: new Date(), metadata: { integrity_issue: "Detalle duplicado" } },

  // Pedido 8 — producto con precio cero
  { orderId: 8, event: "CREADO", timestamp: new Date(), metadata: { product_price_zero: true } }
]);
