// middleware/auth.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_universidad_cundinamarca_2024';

// Middleware para verificar el token JWT
const authMiddleware = async (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Acceso denegado. No se proporcionó token de autenticación.' 
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar el usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true
      }
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Token no válido - usuario no encontrado'
      });
    }

    // Agregar el usuario al request
    req.usuario = usuario;
    next();
    
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token no válido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error en el servidor de autenticación'
    });
  }
};

// Middleware para verificar roles específicos
const requireRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        error: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}`
      });
    }
    next();
  };
};

// Middleware específico para cada rol
const requireEstudiante = requireRol(['estudiante']);
const requireEmpresa = requireRol(['empresa']);
const requireAdmin = requireRol(['admin']);
const requireEmpresaOAdmin = requireRol(['empresa', 'admin']);

module.exports = {
  authMiddleware,
  requireRol,
  requireEstudiante,
  requireEmpresa,
  requireAdmin,
  requireEmpresaOAdmin
};