const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
// Debug: log available controller keys
console.log('products controller keys:', Object.keys(controller));

router.get('/', controller.getProducts);
router.post('/', controller.createProduct);
router.post('/:id/publish', controller.publish);
router.post('/:id/unpublish', controller.unpublish);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

module.exports = router;