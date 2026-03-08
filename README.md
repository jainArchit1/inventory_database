# Inventory Database + APIs

This is the backend implementation for the Inventory Database assignment, built using Node.js, Express, and MongoDB (via Mongoose).

## Setup & Run

1. Run `npm install` to install dependencies.
2. Run `node server.js` to start the server. By default, it runs on `http://localhost:3000`.

## Endpoints

- `POST /supplier` - Create a new supplier.
  Body: `{ "name": "...", "city": "..." }`
- `POST /inventory` - Create new inventory.
  Body: `{ "supplier_id": "<objectId>", "product_name": "...", "quantity": 10, "price": 10 }`
- `GET /inventory` - Get all inventory.
- `GET /inventory?groupedBySupplier=true` - Get all inventory grouped by supplier and sorted by total inventory value (quantity × price).

## Database Schema Explanation

We used a **Document Database (MongoDB)** using Mongoose schemas:

- **Supplier Collection**:
  - `name` (String, required)
  - `city` (String, required)
  
- **Inventory Collection**:
  - `supplier_id` (ObjectId, ref: 'Supplier', required)
  - `product_name` (String, required)
  - `quantity` (Number, required, min: 0)
  - `price` (Number, required, min: 0.01)

The relationship is inherently **One Supplier → Many Inventory Items**. We model this by embedding a document reference (`supplier_id`) in each Inventory document, which closely mimics foreign keys in relational databases, allowing for robust filtering and grouping.

## Why MongoDB (NoSQL) was Chosen

MongoDB was chosen for its schema flexibility and rapid iteration speed with Node.js/Express. Although the relationships defined in this assignment are typically suited for a relational database (SQL), MongoDB's powerful **Aggregation Pipeline** (`$lookup`, `$group`) combined with Mongoose allows us to effortlessly mimic relational constraints (e.g., validating supplier existence before insertion) and perform complex grouping arithmetic like calculating the total inventory value—without the rigid migrations required by SQL. Using MongoDB Atlas additionally provides a zero-setup testing path.

## Indexing & Optimization Suggestion

To optimize the grouping query (`All inventory grouped by supplier`), I recommend creating a **single index** on the `Inventory` collection:

```javascript
InventorySchema.index({ supplier_id: 1 });
```

**Why?**
The most frequent read operation for our aggregation pipeline starts by grouping or filtering by `supplier_id`. Indexing `supplier_id` dramatically speeds up the `$lookup` and `$group` stages by allowing the database engine to quickly fetch all inventory items related to a specific supplier without performing a full collection scan (Collection Scan vs Index Scan).
