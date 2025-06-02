const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');

// Rutas CRUD para productos
router.get('/productos', productController.getProducts);
router.get('/productos/:id', productController.getProductById);
router.post('/productos', productController.createProduct);
router.put('/productos/:id', productController.updateProduct);
router.delete('/productos/:id', productController.deleteProduct);

//Rutas CRUD para users
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id',userController.deleteUser);

module.exports = router;
