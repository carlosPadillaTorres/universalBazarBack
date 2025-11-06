// Script de inicialización de productos para producción
// Ejecutar con: node scripts/init-products.js

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_ATLAS_URL;
const DB_NAME = process.env.MONGO_INITDB_DATABASE || 'db_universal_bazar';

async function initProducts() {
  console.log('🚀 Iniciando proceso de carga de productos...');

  if (!MONGO_URI) {
    console.error('❌ ERROR: MONGO_ATLAS_URL no está definida');
    process.exit(1);
  }

  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');

    const db = client.db(DB_NAME);
    const collection = db.collection('products');

    // Verificar si ya hay productos
    const count = await collection.countDocuments();
    console.log(`📊 Productos actuales en la base de datos: ${count}`);

    if (count > 0) {
      console.log('⚠️  La base de datos ya contiene productos. No se realizará la inserción.');
      console.log('💡 Si deseas reiniciar los datos, elimina la colección primero.');
      return;
    }

    // Leer archivo de productos
    const productsPath = path.join(__dirname, 'products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    console.log(`📦 Total de productos a insertar: ${productsData.length}`);

    // Procesar fechas
    const productsToInsert = productsData.map(product => {
      if (product.meta) {
        if (product.meta.createdAt) product.meta.createdAt = new Date(product.meta.createdAt);
        if (product.meta.updatedAt) product.meta.updatedAt = new Date(product.meta.updatedAt);
      }

      if (product.reviews && Array.isArray(product.reviews)) {
        product.reviews = product.reviews.map(review => {
          if (review.date) review.date = new Date(review.date);
          return review;
        });
      }

      return product;
    });

    // Insertar productos
    const result = await collection.insertMany(productsToInsert, { ordered: false });
    console.log(`✅ Productos insertados exitosamente: ${result.insertedCount}`);

    // Verificar la inserción
    const finalCount = await collection.countDocuments();
    console.log(`🎉 Total de productos en la base de datos: ${finalCount}`);

    // Mostrar algunos productos de ejemplo
    const samples = await collection.find().limit(3).toArray();
    console.log('\n📋 Productos de ejemplo insertados:');
    samples.forEach(p => {
      console.log(`  - ID: ${p.id} | SKU: ${p.sku} | Título: ${p.title} | Categoría: ${p.category}`);
    });

    console.log('\n✅ Proceso completado exitosamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🏁 Script finalizado');
  }
}

initProducts();
