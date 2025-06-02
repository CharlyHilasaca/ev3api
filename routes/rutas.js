const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const authMiddleware = require('../controllers/middleware');

// Rutas CRUD para productos
router.get('/productos', productController.getProducts);
router.get('/productos/:id', productController.getProductById);
router.post('/productos', productController.createProduct);
router.put('/productos/:id', productController.updateProduct);
router.delete('/productos/:id', productController.deleteProduct);

// Rutas CRUD para usuarios
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
