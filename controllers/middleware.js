const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tu_clave_secreta';

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer"
    if (!token) {
        return res.status(403).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); 
        req.user = decoded; 
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error); // Depuración
        res.status(401).json({ error: 'Token inválido' });
    }
};