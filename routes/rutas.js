const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const authMiddleware = require('../controllers/middleware');
const roleMiddleware = require('../controllers/rolmiddleware');
const carrito = require('../controllers/shopingcar');

// Rutas CRUD para productos
router.get('/productos', productController.getProducts);
router.get('/productos/:id', productController.getProductById);
router.post('/productos', authMiddleware, roleMiddleware, productController.createProduct); // Solo admin
router.put('/productos/:id', authMiddleware, roleMiddleware, productController.updateProduct); // Solo admin
router.delete('/productos/:id', authMiddleware, roleMiddleware, productController.deleteProduct);

// Rutas CRUD para usuarios
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/user', userController.getUserData);

//carrito de compras
router.post('/carrito', authMiddleware, carrito.addToCart); // Agregar producto al carrito
router.get('/carrito', authMiddleware, carrito.getCart); // Obtener productos del carrito
router.put('/carrito/:id', authMiddleware, carrito.updateCartItem); // Actualizar cantidad de producto en el carrito
router.delete('/carrito/:id', authMiddleware, carrito.removeFromCart); // Eliminar producto del carrito
router.delete('/carrito', authMiddleware, carrito.clearCart); // Vaciar el carrito

module.exports = router;