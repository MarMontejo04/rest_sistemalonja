const isAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'Permiso denegado. Se requiere rol de Administrador.' });
    }
    next();
};

const isAdminOrVendedor = (req, res, next) => {
    const rol = req.usuario.rol;
    if (rol !== 'admin' && rol !== 'vendedor') {
        return res.status(403).json({ mensaje: 'Permiso denegado. Se requiere rol de Administrador o Vendedor.' });
    }
    next();
};

export { isAdmin, isAdminOrVendedor };