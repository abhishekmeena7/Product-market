const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
};

exports.publish = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isPublished: true });
  res.json({ success: true });
};

exports.unpublish = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isPublished: false });
  res.json({ success: true });
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
