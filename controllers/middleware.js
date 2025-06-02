const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tu_clave_secreta';

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Agregar datos del usuario al objeto req
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};