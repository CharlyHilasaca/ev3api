const client = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Clave secreta para JWT
const JWT_SECRET = 'tu_clave_secreta';

// Registro de usuario
exports.registerUser = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si el email ya está registrado
        const userExists = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Asignar siempre 'cliente' como rol por defecto
        const userRol = 'cliente';

        // Insertar el nuevo usuario
        const result = await client.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, email, hashedPassword, userRol]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente', user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

// Login de usuario
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.rows[0].id, email: user.rows[0].email, rol: user.rows[0].rol },
            JWT_SECRET,
            { expiresIn: '24h' } // Configura la expiración del token
        );

        res.json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

// Obtener datos del usuario con el token
exports.getUserData = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del encabezado Authorization
        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Obtener los datos del usuario desde la base de datos
        const user = await client.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = $1', [decoded.id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ user: user.rows[0] });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        res.status(500).json({ error: 'Error al obtener los datos del usuario' });
    }
};