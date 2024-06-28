import jwt from 'jsonwebtoken';

const secretKey = 'your_secret_key'; // Utiliza la misma clave secreta que en authController.js

const authMiddleware = (req, res, next) => {
    // Obtener el token del encabezado Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // El encabezado Authorization debe tener el formato "Bearer <token>"
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded.userId; // Establecer el usuario en el objeto de solicitud
        next(); // Continuar con la siguiente middleware o ruta
    } catch (err) {
        res.status(401).json({ message: 'Token no válido' });
    }
};

export default authMiddleware;
