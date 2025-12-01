import jwt from 'jsonwebtoken';
import { usuario } from '../models/usuario.js';

const isAuthenticated = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const tokenLimpio = token.replace('Bearer ', '');
        
        const cifrado = jwt.verify(tokenLimpio, process.env.JWT_SECRET); 
        
        const user = await usuario.findById(cifrado.id).select('rol');
        
        if (!user) {
            return res.status(404).json({ mensaje: 'Token inválido: Usuario no encontrado.' });
        }

        req.usuario = user; 
        
        next(); 

    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
};

export default isAuthenticated;