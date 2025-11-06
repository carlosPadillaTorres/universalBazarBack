# 📝 Testing Product Creation

## Endpoints

### Create Product
- **Method:** `POST`
- **URL:** `/products/create`
- **Content-Type:** `application/json`

---

## ✅ Required Fields

```json
{
  "title": "string (required, min 1 char)",
  "description": "string (required)",
  "category": "string (required, will be lowercased)",
  "price": "number (required, positive)"
}
```

---

## 🔧 Optional Fields

```json
{
  "id": "number (auto-generated if not provided)",
  "discountPercentage": "number (0-100)",
  "rating": "number (0-5)",
  "stock": "number (min 0)",
  "tags": ["array of strings"],
  "brand": "string",
  "sku": "string (must be unique)",
  "weight": "number",
  "dimensions": {
    "width": "number",
    "height": "number",
    "depth": "number"
  },
  "warrantyInformation": "string",
  "shippingInformation": "string",
  "availabilityStatus": "string",
  "reviews": [
    {
      "rating": "number (0-5, required)",
      "comment": "string (required)",
      "date": "ISO date string (required)",
      "reviewerName": "string (required)",
      "reviewerEmail": "valid email (required)"
    }
  ],
  "returnPolicy": "string",
  "minimumOrderQuantity": "number (min 1)",
  "meta": {
    "createdAt": "ISO date string (auto-generated)",
    "updatedAt": "ISO date string (auto-generated)",
    "barcode": "string",
    "qrCode": "string"
  },
  "images": ["array of strings"],
  "thumbnail": "string"
}
```

---

## 🧪 Test Examples

### 1. Minimal Product (Only Required Fields)
Use: `examples/create-product-minimal.json`

```bash
# Using PowerShell
$body = Get-Content examples/create-product-minimal.json -Raw
Invoke-WebRequest -Uri http://localhost:1211/products/create -Method POST -Body $body -ContentType "application/json"
```

### 2. Complete Product (All Fields)
Use: `examples/create-product-complete.json`

```bash
# Using PowerShell
$body = Get-Content examples/create-product-complete.json -Raw
Invoke-WebRequest -Uri http://localhost:1211/products/create -Method POST -Body $body -ContentType "application/json"
```

### 3. Using Swagger UI
1. Go to: `http://localhost:1211/api`
2. Find `POST /products/create`
3. Click "Try it out"
4. Paste JSON from examples
5. Click "Execute"

---

## 🚨 Validation Errors

### Duplicate SKU
```json
{
  "status": 400,
  "error": "Product with SKU 'AP-WH-2024-001' already exists"
}
```

### Duplicate ID
```json
{
  "status": 400,
  "error": "Product with ID '123' already exists"
}
```

### Validation Error
```json
{
  "status": 400,
  "error": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "price must be a positive number"
    }
  ]
}
```

### Invalid Field Type
```json
{
  "statusCode": 400,
  "message": [
    "price must be a positive number",
    "title should not be empty"
  ],
  "error": "Bad Request"
}
```

---

## ✅ Success Response

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "690d1d6321d80a6e2c1f44a8",
    "id": 31,
    "title": "Premium Wireless Headphones",
    "description": "High-quality wireless headphones...",
    "category": "electronics",
    "price": 199.99,
    // ... rest of the product data
  }
}
```

---

## 🔍 Features

### ✅ Auto-generated ID
If you don't provide an `id`, the system will automatically generate the next sequential ID.

### ✅ Auto-generated timestamps
`meta.createdAt` and `meta.updatedAt` are automatically set to the current date/time.

### ✅ Category normalization
Categories are automatically converted to lowercase and trimmed.

### ✅ SKU uniqueness check
Prevents duplicate SKUs in the database.

### ✅ ID uniqueness check
Prevents duplicate IDs in the database.

### ✅ Detailed logs
All operations are logged to the console for easy debugging.

---

## 📊 Check Created Products

After creating products, verify them with:

```bash
# Get all products
Invoke-WebRequest -Uri http://localhost:1211/products/sales -UseBasicParsing

# Get product by ID
Invoke-WebRequest -Uri http://localhost:1211/products/byId/31 -UseBasicParsing

# Health check (shows product count)
Invoke-WebRequest -Uri http://localhost:1211/health -UseBasicParsing
```
