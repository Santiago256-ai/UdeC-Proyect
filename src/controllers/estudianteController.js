import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // ⬅️ CAMBIADO: Usar bcryptjs si usaste 'bcrypt' sin el módulo. Mejor usar 'bcryptjs' que es más común en Node.js.
import jwt from 'jsonwebtoken'; // ⬅️ AGREGADO: Importar JWT

const prisma = new PrismaClient();
// ⚠️ CLAVE SECRETA: Es crucial usar la misma clave secreta de tu empresaController.js
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_debes_cambiarla'; 


// Función de Registro de Estudiante (Se mantiene igual, solo se actualiza la importación de bcrypt)
export const crearEstudiante = async (req, res) => {
    const { nombres, apellidos, correo, usuario, contraseña, rol } = req.body; 

    try {
        // 1. Cifrar la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10); 

        // 2. Crear el registro en Prisma con los campos separados
        const nuevoEstudiante = await prisma.usuario.create({
            data: { 
                nombres, 
                apellidos, 
                usuario, 
                correo, 
                password: hashedPassword,
                rol, 
            },
        });

        // 3. Devolver la respuesta (sin la contraseña)
        const { password: _, ...estudianteSinPassword } = nuevoEstudiante;
        res.status(201).json(estudianteSinPassword); 
        
    } catch (error) {
        console.error("Error de Prisma:", error);
        if (error.code === 'P2002') {
            const target = error.meta.target.includes('correo') ? 'correo' : 'nombre de usuario';
            return res.status(409).json({ error: `El ${target} ya está registrado.` });
        }
        res.status(500).json({ error: 'Error interno del servidor al crear estudiante.' });
    }
};

// 🔐 FUNCIÓN CORREGIDA: Inicio de Sesión (loginUsuario)
export const loginEstudiante = async (req, res) => { // ⬅️ Exportamos como loginEstudiante para seguir la convención del frontend
    // El frontend envía 'identificador' y 'contraseña'
    const { identificador, contraseña: password } = req.body; 

    if (!identificador || !password) {
        return res.status(400).json({ error: 'Identificador y contraseña son requeridos.' });
    }

    try {
        // 1. Buscar al usuario por correo O por nombre de usuario
        const usuarioEncontrado = await prisma.usuario.findFirst({
            where: {
                OR: [
                    { correo: identificador },
                    { usuario: identificador },
                ],
            },
        });

        // 2. Verificar si el usuario existe
        if (!usuarioEncontrado) {
            // Devolver 404 o 401. El frontend lo interpretará como un error y pasará a intentar con el login de empresa.
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // 3. Comparar la contraseña hasheada
        const isMatch = await bcrypt.compare(password, usuarioEncontrado.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // 4. Generar el Token JWT
        const token = jwt.sign(
            { id: usuarioEncontrado.id, correo: usuarioEncontrado.correo, rol: usuarioEncontrado.rol },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 5. Devolver la respuesta (excluyendo la contraseña y añadiendo el token/rol)
        const { password: _, ...usuarioLogueado } = usuarioEncontrado;

        res.status(200).json({ 
            message: "Inicio de sesión exitoso.", 
            token,
            usuario: {
                ...usuarioLogueado,
                rol: usuarioLogueado.rol || 'estudiante' // ⬅️ CLAVE: Devolver el rol para la redirección
            }
        });

    } catch (error) {
        console.error("Error durante el login de usuario:", error);
        res.status(500).json({ error: 'Error interno del servidor durante el inicio de sesión.' });
    }
};
// ⚠️ Nota: Si tu frontend llama a esta función como loginUsuario en lugar de loginEstudiante,
// asegúrate de cambiar el nombre de la exportación a 'loginUsuario' y la importación en las rutas.