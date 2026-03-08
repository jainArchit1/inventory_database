const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be less than 0'],
  },
  price: {
    type: Number,
    required: true,
    min: [0.01, 'Price must be greater than 0'],
  }
}, { versionKey: false });

module.exports = mongoose.model('Inventory', inventorySchema);
