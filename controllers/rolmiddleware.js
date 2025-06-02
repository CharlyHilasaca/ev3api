const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tu_clave_secreta';

module.exports = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next(); // El usuario tiene el rol 'admin', continuar con la solicitud
    } else {
        res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
    }
};