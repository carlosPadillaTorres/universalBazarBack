#!/bin/bash

echo "🚀 Iniciando proceso de carga de productos..."

# Verificar que existen las variables de entorno necesarias
if [ -z "${MONGO_ATLAS_URL}" ]; then
  echo "❌ ERROR: MONGO_ATLAS_URL no está definida"
  exit 1
fi

if [ -z "${MONGO_INITDB_DATABASE}" ]; then
  echo "❌ ERROR: MONGO_INITDB_DATABASE no está definida"
  exit 1
fi

# Obtener la ruta del directorio del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRODUCTS_JSON="${SCRIPT_DIR}/products.json"

# Verificar que existe el archivo products.json
if [ ! -f "${PRODUCTS_JSON}" ]; then
  echo "❌ ERROR: No se encontró el archivo products.json en ${PRODUCTS_JSON}"
  exit 1
fi

echo "📁 Archivo de productos encontrado: ${PRODUCTS_JSON}"
echo "🔌 Conectando a: ${MONGO_ATLAS_URL}"
echo "📊 Base de datos: ${MONGO_INITDB_DATABASE}"

# Leer el contenido del JSON y escaparlo para poder pasarlo a mongosh
PRODUCTS_JSON_CONTENT=$(cat "${PRODUCTS_JSON}" | jq -c .)

# Ejecutar el script de MongoDB
mongosh "${MONGO_ATLAS_URL}" <<EOF
use ${MONGO_INITDB_DATABASE}

// Verificar si la base de datos está vacía
const count = db.products.countDocuments();
print("📊 Productos actuales en la base de datos:", count);

if (count > 0) {
  print("⚠️  La base de datos ya contiene", count, "productos. No se realizará la inserción.");
  print("💡 Si deseas reiniciar los datos, elimina la colección primero con: db.products.drop()");
  quit(0);
}

print("✨ Base de datos vacía. Procediendo con la inserción de productos...");

// Parsear los datos de productos
const productsData = ${PRODUCTS_JSON_CONTENT};

print("📦 Total de productos a insertar:", productsData.length);

// Procesar y preparar los productos
const productsToInsert = productsData.map(product => {
  // Convertir fechas en el meta si existen
  if (product.meta) {
    if (product.meta.createdAt) product.meta.createdAt = new Date(product.meta.createdAt);
    if (product.meta.updatedAt) product.meta.updatedAt = new Date(product.meta.updatedAt);
  }
  
  // Convertir fechas en las reviews si existen
  if (product.reviews && Array.isArray(product.reviews)) {
    product.reviews = product.reviews.map(review => {
      if (review.date) review.date = new Date(review.date);
      return review;
    });
  }
  
  return product;
});

// Insertar todos los productos
try {
  const result = db.products.insertMany(productsToInsert, { ordered: false });
  print("✅ Productos insertados exitosamente:", Object.keys(result.insertedIds).length);
  
  // Verificar la inserción
  const finalCount = db.products.countDocuments();
  print("🎉 Total de productos en la base de datos:", finalCount);
  
  // Mostrar algunos productos de ejemplo
  print("\n📋 Productos de ejemplo insertados:");
  db.products.find().limit(3).forEach(p => {
    print("  - ID:", p.id, "| SKU:", p.sku, "| Título:", p.title, "| Categoría:", p.category);
  });
  
  print("\n✅ Proceso completado exitosamente");
} catch (error) {
  print("❌ Error al insertar productos:", error.message);
  quit(1);
}

EOF

echo ""
echo "🏁 Script finalizado"