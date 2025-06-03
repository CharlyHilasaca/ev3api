const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const authMiddleware = require('../controllers/middleware');
const roleMiddleware = require('../controllers/rolmiddleware');

// Rutas CRUD para productos
router.get('/productos', productController.getProducts);
router.get('/productos/:id', productController.getProductById);
router.post('/productos', authMiddleware, roleMiddleware, productController.createProduct); // Solo admin
router.put('/productos/:id', authMiddleware, roleMiddleware, productController.updateProduct); // Solo admin
router.delete('/productos/:id', authMiddleware, roleMiddleware, productController.deleteProduct); // Solo admin

// Rutas CRUD para usuarios
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/user', userController.getUserData);

module.exports = router;