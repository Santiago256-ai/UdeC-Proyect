// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_universidad_cundinamarca_2024';

// Registro de usuario
const register = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    console.log('📝 Intentando registrar usuario:', { nombre, correo, rol });

    // Validar campos requeridos
    if (!nombre || !correo || !password || !rol) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son obligatorios: nombre, correo, password, rol'
      });
    }

    // Validar roles permitidos
    const rolesPermitidos = ['estudiante', 'empresa', 'admin'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({
        success: false,
        error: 'Rol no válido. Los roles permitidos son: estudiante, empresa, admin'
      });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        success: false,
        error: 'El formato del correo electrónico no es válido'
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        error: 'El correo electrónico ya está registrado'
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario en la base de datos
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password: hashedPassword,
        rol
      }
    });

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Usuario registrado exitosamente:', usuario.correo);

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al registrar usuario'
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    console.log('🔐 Intentando login:', correo);

    // Validar campos requeridos
    if (!correo || !password) {
      return res.status(400).json({
        success: false,
        error: 'Correo y contraseña son obligatorios'
      });
    }

    // Buscar usuario por correo
    const usuario = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (!usuario) {
      return res.status(400).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login exitoso:', usuario.correo);

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al iniciar sesión'
    });
  }
};

// Obtener perfil del usuario actual
const getPerfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      usuario
    });

  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al obtener perfil'
    });
  }
};

module.exports = {
  register,
  login,
  getPerfil
};