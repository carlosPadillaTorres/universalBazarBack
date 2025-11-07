# Testing Sales API

## Endpoints

### Register Sale
- Method: POST
- URL: /sales/add
- Content-Type: application/json

Required fields:
- product: { title, price } (productId optional)
- quantity: integer >= 1
- buyer: { name, email }
- totalPrice: number > 0

Example (use examples/create-sale.json):

```powershell
$body = Get-Content examples/create-sale.json -Raw
Invoke-WebRequest -Uri http://localhost:1211/sales/add -Method POST -Body $body -ContentType "application/json"
```

### Get Sales
- Method: GET
- URL: /sales

```powershell
Invoke-WebRequest -Uri http://localhost:1211/sales -UseBasicParsing
```

Notes:
- If you reference an existing product via product.productId, the API will validate the product exists.
- saleId is auto-generated if omitted.
- Dates must be ISO-8601 strings if provided.
- Buyer email must be a valid email.

