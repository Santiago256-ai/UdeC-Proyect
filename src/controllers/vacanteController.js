import prisma from "../prismaClient.js";

// 🟢 1. Crear una nueva vacante (CORREGIDO con validación de ID de empresa)
export const crearVacante = async (req, res) => {
    try {
        console.log("📩 Datos recibidos:", req.body);
        
        const { 
            titulo, 
            descripcion, 
            ubicacion,
            tipo,
            modalidad,
            salario,
            empresaId // Clave para la relación
        } = req.body;

        // --- INICIO DE VALIDACIÓN MEJORADA ---

        // 1. Validación de campos obligatorios de la vacante
        if (!titulo || !descripcion || !ubicacion || !tipo || !modalidad) {
            console.error("❌ ERROR 400: Faltan datos de la vacante.");
            return res.status(400).json({ error: "Faltan campos obligatorios de la vacante (título, descripción, ubicación, tipo, modalidad)." });
        }
        
        // 2. ✅ VALIDACIÓN CRÍTICA: ID de la Empresa
        const idEmpresaNumerico = parseInt(empresaId);

        if (!empresaId || isNaN(idEmpresaNumerico) || idEmpresaNumerico <= 0) {
            console.error(`❌ ERROR 401/400: ID de empresa inválido o ausente. Valor: ${empresaId}`);
            // Usamos 401 (No Autorizado) si falta el ID de la sesión.
            return res.status(401).json({ error: "No autorizado. El ID de la empresa no es válido o la sesión no se cargó correctamente." });
        }

        // --- FIN DE VALIDACIÓN MEJORADA ---


        const vacante = await prisma.vacante.create({
            data: { 
                titulo, 
                descripcion, 
                ubicacion,
                tipo,
                modalidad,
                salario: salario || null, // Si es String y está vacío, usamos null
                empresaId: idEmpresaNumerico, // Usamos el ID ya convertido y validado
            },
        });

        console.log("✅ Vacante creada:", vacante);
        res.status(201).json(vacante);

    } catch (error) {
        // Esto captura errores de Prisma (ej: La FK empresaId no existe en la tabla empresa)
        console.error("❌ Error 500 al crear vacante:", error.message);
        res.status(500).json({ error: "Error interno al crear la vacante. Verifique el log del servidor. (Posible error de Clave Foránea)." });
    }
};

// 🟡 2. Listar vacantes por ID de empresa
export const listarVacantesPorEmpresa = async (req, res) => {
    try {
        const empresaId = parseInt(req.params.id); 

        if (isNaN(empresaId)) {
            return res.status(400).json({ error: "ID de empresa inválido." });
        }

        const vacantes = await prisma.vacante.findMany({
            where: { empresaId: empresaId }, 
            orderBy: { id: "desc" },
        });

        res.json(vacantes);
    } catch (error) {
        console.error("❌ Error al listar vacantes por empresa:", error);
        res.status(500).json({ error: "Error interno al listar las vacantes." });
    }
};

// 🟡 3. Listar todas las vacantes
export const listarVacantes = async (req, res) => {
    try {
        const vacantes = await prisma.vacante.findMany({
            orderBy: { id: "desc" },
        });
        res.json(vacantes);
    } catch (error) {
        console.error("❌ Error al listar vacantes:", error);
        res.status(500).json({ error: "Error interno al listar vacantes." });
    }
};

// 🔴 4. Eliminar una vacante por ID
export const eliminarVacante = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "El ID de la vacante es obligatorio." });
        }

        const vacanteExistente = await prisma.vacante.findUnique({
            where: { id: parseInt(id) },
        });

        if (!vacanteExistente) {
            return res.status(404).json({ error: "Vacante no encontrada." });
        }

        await prisma.vacante.delete({
            where: { id: parseInt(id) },
        });

        console.log("🗑️ Vacante eliminada:", id);
        res.json({ message: "Vacante eliminada correctamente." });
    } catch (error) {
        console.error("❌ Error al eliminar vacante:", error);
        res.status(500).json({ error: "Error interno al eliminar vacante." });
    }
};