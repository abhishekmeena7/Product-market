const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  type: { type: String },
  quantity: { type: String },
  stock: { type: String },
  mrp: { type: Number },
  sellingPrice: { type: Number },
  brandName: { type: String },
  images: { type: [String], default: [] },
  exchangeOrReturnEligible: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
