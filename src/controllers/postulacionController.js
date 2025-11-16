import prisma from "../prismaClient.js";

// 🚨 CLAVE: Define la URL base de tu API. (Ajusta el puerto si es necesario)
// Nota: Es mejor usar variables de entorno (process.env.API_URL) pero lo definiremos aquí para la prueba.
const BASE_URL = "http://localhost:4000"; 

// 🟢 Crear una nueva postulación
export const crearPostulacion = async (req, res) => {
  try {
    const { usuarioId, telefono, vacanteId } = req.body;
    
    // 1. Convertir a entero. (uId y vId)
    const uId = parseInt(usuarioId);
    const vId = parseInt(vacanteId);
    
    // 2. Obtener la ruta relativa del CV
    // OJO: Si usas Multer, debes asegurarte de que esta ruta sea accesible por el servidor de archivos estáticos.
    // Si tu ruta de archivos estáticos es '/uploads', esto está bien.
    const cv_url_relativa = req.file ? `/uploads/${req.file.filename}` : null;

    // ✅ Validación: Chequear que los IDs sean números válidos y que los datos esenciales existan.
    if (isNaN(uId) || isNaN(vId) || !telefono || !cv_url_relativa) {
      return res.status(400).json({ 
        error: "Faltan datos obligatorios: ID de usuario/vacante inválido, CV o teléfono faltante." 
      });
    }

    // Verificar si ya existe una postulación para evitar duplicados
    const existePostulacion = await prisma.postulacion.findFirst({
        where: { vacanteId: vId, usuarioId: uId }
    });

    if (existePostulacion) {
        return res.status(409).json({ error: "Ya existe una postulación de este usuario para esta vacante." });
    }

    // Crear la postulación
    const postulacion = await prisma.postulacion.create({
      data: {
        telefono,
        cv_url: cv_url_relativa, // Guardamos solo la ruta relativa en la DB
        vacanteId: vId,
        usuarioId: uId,
        estado: "PENDIENTE", 
      },
      include: {
          usuario: true,
      }
    });
    
    // 🎯 CLAVE 1: Modificar la URL antes de enviar la respuesta al frontend
    const postulacionConUrlCompleta = {
        ...postulacion,
        cv_url: postulacion.cv_url ? `${BASE_URL}${postulacion.cv_url}` : null,
    };

    console.log("✅ Postulación creada:", postulacionConUrlCompleta);
    res.status(201).json(postulacionConUrlCompleta);

  } catch (error) {
    console.error("❌ Error al crear la postulación:", error);
    res.status(500).json({ error: "Error interno al crear la postulación." });
  }
};

// --------------------------------------------------------------------------

// ✅ OBTENER POSTULACIONES POR ID DE VACANTE (Para EmpresaDashboard.jsx)
export const obtenerPostulacionesPorVacante = async (req, res) => {
    try {
        const vacanteId = parseInt(req.params.vacanteId);

        if (isNaN(vacanteId)) {
            return res.status(400).json({ error: "ID de vacante inválido." });
        }

        const postulaciones = await prisma.postulacion.findMany({
            where: { vacanteId },
            include: { 
                usuario: {
                    select: {
                        id: true,
                        nombres: true, 
                        apellidos: true, 
                        correo: true,
                    }
                } 
            },
            orderBy: { id: "desc" },
        });
    
    // 🎯 CLAVE 2: Iterar y construir la URL completa para cada postulación
    const postulacionesConUrlsCompletas = postulaciones.map(p => ({
        ...p,
        cv_url: p.cv_url ? `${BASE_URL}${p.cv_url}` : null,
    }));


        res.json(postulacionesConUrlsCompletas);
    } catch (error) {
        console.error("❌ Error al obtener postulaciones por vacante:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
}

// --------------------------------------------------------------------------

// 🟢 FUNCIÓN: Actualizar el estado de una postulación (Sin cambios necesarios aquí)
export const actualizarEstadoPostulacion = async (req, res) => {
    // ... (mantener el resto de la función sin cambios) ...
    try {
        const postulacionId = parseInt(req.params.id);
        const { estado } = req.body; 

        // Validar el ID y el estado
        if (isNaN(postulacionId) || !estado) {
            return res.status(400).json({ error: "ID de postulación o estado inválido." });
        }

        // Validar que el estado sea uno de los permitidos
        const estadosValidos = ["PENDIENTE", "ACEPTADA", "RECHAZADA"];
        if (!estadosValidos.includes(estado.toUpperCase())) {
            return res.status(400).json({ error: "Estado no válido. Debe ser PENDIENTE, ACEPTADA o RECHAZADA." });
        }

        // Actualizar en la base de datos
        const postulacionActualizada = await prisma.postulacion.update({
            where: { id: postulacionId },
            data: { estado: estado.toUpperCase() }, // ✅ Usa el campo 'estado'
            include: { usuario: true } 
        });

        res.json(postulacionActualizada);

    } catch (error) {
        console.error("❌ Error al actualizar el estado de la postulación:", error);
        if (error.code === 'P2025') {
             return res.status(404).json({ error: "Postulación no encontrada." });
        }
        res.status(500).json({ error: "Error interno al actualizar la postulación." });
    }
}