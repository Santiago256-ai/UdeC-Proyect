import { Router } from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";

// ⬅️ AGREGAR IMPORTACIONES DEL CONTROLADOR
import { crearEstudiante, loginEstudiante } from "../controllers/estudianteController.js"; 

const prisma = new PrismaClient();
const router = Router();

// Configuración de multer para PDFs (Se mantiene igual)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") return cb(new Error("Solo se permiten PDFs"));
        cb(null, true);
    },
});

// 🛣️ RUTA DE REGISTRO
// ✅ CORREGIDO: Eliminamos el prefijo "/estudiantes"
// Ruta final esperada: /api/estudiantes/registro
router.post("/registro", crearEstudiante);

// 🔐 RUTA AGREGADA: LOGIN DE ESTUDIANTE/USUARIO
// ✅ CORREGIDO: Eliminamos el prefijo "/estudiantes"
// Ruta final esperada: /api/estudiantes/login
router.post("/login", loginEstudiante); 

// GET: Obtener postulaciones de un usuario (Ruta correcta)
// Ruta final: /api/estudiantes/usuario/:usuarioId
router.get("/usuario/:usuarioId", async (req, res) => {
    const usuarioId = parseInt(req.params.usuarioId);
    const postulaciones = await prisma.postulacion.findMany({
        where: { usuarioId },
        include: { vacante: true },
    });
    res.json(postulaciones);
});

// POST: Subir CV a una vacante (Ruta correcta)
// Ruta final: /api/estudiantes/:vacanteId/upload
router.post("/:vacanteId/upload", upload.single("cv"), async (req, res) => {
    try {
        const vacanteId = parseInt(req.params.vacanteId);
        const { usuarioId, telefono } = req.body;

        if (!req.file) return res.status(400).json({ error: "Archivo no encontrado" });

        const postulacion = await prisma.postulacion.create({
            data: {
                vacanteId,
                usuarioId: parseInt(usuarioId),
                telefono,
                cv_url: req.file.filename,
            },
        });

        res.json({ message: "CV subido exitosamente", postulacion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al subir CV" });
    }
});

export default router;