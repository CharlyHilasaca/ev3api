const client = require('../db');

// Agregar un producto al carrito
exports.addToCart = async (req, res) => {
    try {
        const { producto_id, cantidad } = req.body;
        const usuario_id = req.user.id; // Se asume que el usuario está autenticado y su ID está disponible

        // Verificar si el producto ya está en el carrito
        const existingItem = await client.query(
            'SELECT * FROM carrito WHERE usuario_id = $1 AND producto_id = $2',
            [usuario_id, producto_id]
        );

        if (existingItem.rows.length > 0) {
            // Actualizar la cantidad si el producto ya está en el carrito
            const updatedItem = await client.query(
                'UPDATE carrito SET cantidad = cantidad + $1 WHERE usuario_id = $2 AND producto_id = $3 RETURNING *',
                [cantidad, usuario_id, producto_id]
            );
            return res.json(updatedItem.rows[0]);
        }

        // Agregar el producto al carrito
        const newItem = await client.query(
            'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES ($1, $2, $3) RETURNING *',
            [usuario_id, producto_id, cantidad]
        );
        res.status(201).json(newItem.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
};

// Obtener los productos del carrito
exports.getCart = async (req, res) => {
    try {
        const usuario_id = req.user.id; // Se asume que el usuario está autenticado y su ID está disponible

        const cartItems = await client.query(
            `SELECT c.id, p.nombre, p.descripcion, p.precio, p.imagen_url, c.cantidad 
             FROM carrito c
             JOIN productos p ON c.producto_id = p.id
             WHERE c.usuario_id = $1`,
            [usuario_id]
        );

        res.json(cartItems.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
};

// Actualizar la cantidad de un producto en el carrito
exports.updateCartItem = async (req, res) => {
    try {
        const { id } = req.params; // ID del producto en el carrito
        const { cantidad } = req.body;

        const updatedItem = await client.query(
            'UPDATE carrito SET cantidad = $1 WHERE id = $2 RETURNING *',
            [cantidad, id]
        );

        if (updatedItem.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        res.json(updatedItem.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto en el carrito' });
    }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
    try {
        const { id } = req.params; // ID del producto en el carrito

        const deletedItem = await client.query(
            'DELETE FROM carrito WHERE id = $1 RETURNING *',
            [id]
        );

        if (deletedItem.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        res.json({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
};

// Vaciar el carrito
exports.clearCart = async (req, res) => {
    try {
        const usuario_id = req.user.id; // Se asume que el usuario está autenticado y su ID está disponible

        await client.query('DELETE FROM carrito WHERE usuario_id = $1', [usuario_id]);

        res.json({ message: 'Carrito vaciado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
};