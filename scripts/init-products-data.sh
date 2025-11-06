#!/bin/bash
set -e

echo "Insertando producto de ejemplo usando mongosh..."

# Requiere que DATABASE_URL y MONGO_INITDB_DATABASE estén en el entorno
mongosh "${DATABASE_URL}" <<EOF
use ${MONGO_INITDB_DATABASE}

const sku = "RCH45Q1A";
const id = 1;

// Buscar por sku o id para no duplicar
const existing = db.products.findOne({ \$or: [{ sku: sku }, { id: id }] });
if (existing) {
  print("Producto ya existe con _id:", existing._id);
} else {
  const product = {
    id: id,
    title: "Essence Mascara Lash Princess",
    description: "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
    category: "beauty",
    price: 9.99,
    discountPercentage: 7.17,
    rating: 4.94,
    stock: 5,
    tags: ["beauty", "mascara"],
    brand: "Essence",
    sku: sku,
    weight: 2,
    dimensions: { width: 23.17, height: 14.43, depth: 28.01 },
    warrantyInformation: "1 month warranty",
    shippingInformation: "Ships in 1 month",
    availabilityStatus: "Low Stock",
    reviews: [
      { rating: 2, comment: "Very unhappy with my purchase!", date: new Date("2024-05-23T08:56:21.618Z"), reviewerName: "John Doe", reviewerEmail: "john.doe@x.dummyjson.com" },
      { rating: 2, comment: "Not as described!", date: new Date("2024-05-23T08:56:21.618Z"), reviewerName: "Nolan Gonzalez", reviewerEmail: "nolan.gonzalez@x.dummyjson.com" },
      { rating: 5, comment: "Very satisfied!", date: new Date("2024-05-23T08:56:21.618Z"), reviewerName: "Scarlett Wright", reviewerEmail: "scarlett.wright@x.dummyjson.com" }
    ],
    returnPolicy: "30 days return policy",
    minimumOrderQuantity: 24,
    meta: { createdAt: new Date("2024-05-23T08:56:21.618Z"), updatedAt: new Date("2024-05-23T08:56:21.618Z"), barcode: "9164035109868", qrCode: "https://assets.dummyjson.com/public/qr-code.png" },
    images: ["https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"],
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
  };

  const result = db.products.insertOne(product);
  if (result.insertedId) print("✅ Producto insertado con _id:", result.insertedId);
  else print("❌ Error al insertar producto");
}
EOF