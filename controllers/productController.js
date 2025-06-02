const client = require('../db');

// Obtener todos los productos
exports.getProducts = async (req, res) => {
	try {
		const result = await client.query('SELECT * FROM productos');
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: 'Error al obtener productos' });
	}
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await client.query('SELECT * FROM productos WHERE id = $1', [id]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Producto no encontrado' });
		}
		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: 'Error al obtener el producto' });
	}
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
	try {
		const { name, description, price, stock, image_url } = req.body;
		const result = await client.query(
			'INSERT INTO productos (name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
			[name, description, price, stock, image_url]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: 'Error al crear el producto' });
	}
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, price, stock, image_url } = req.body;
		const result = await client.query(
			'UPDATE productos SET name = $1, description = $2, price = $3, stock = $4, image_url = $5 WHERE id = $6 RETURNING *',
			[name, description, price, stock, image_url, id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Producto no encontrado' });
		}
		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: 'Error al actualizar el producto' });
	}
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await client.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Producto no encontrado' });
		}
		res.json({ message: 'Producto eliminado correctamente' });
	} catch (error) {
		res.status(500).json({ error: 'Error al eliminar el producto' });
	}
};
