import express from "express";
import multer from "multer";
import path from "path"; // 🚨 Agregamos path
import { 
    crearPostulacion, 
    obtenerPostulacionesPorVacante,
    actualizarEstadoPostulacion 
} from "../controllers/postulacionController.js"; 

const router = express.Router();

// 📂 Configuración de almacenamiento con multer (CORREGIDO el destino)
const storage = multer.diskStorage({
  // Usamos path.join para apuntar correctamente a src/uploads desde la raíz
  destination: (req, file, cb) => cb(null, path.join(path.resolve(), 'src', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Solo se permiten archivos PDF"));
    }
    cb(null, true);
  },
});

// --- RUTAS DE POSTULACIÓN ---

// 1. GET: Obtener postulaciones por ID de Vacante
router.get("/vacante/:vacanteId", obtenerPostulacionesPorVacante);

// 2. POST: Subir CV y crear postulación
router.post(
  "/upload",
  upload.single("cv"), 
  crearPostulacion 
);

// 3. PATCH: Actualizar el estado de una postulación
router.patch("/:id/estado", actualizarEstadoPostulacion);

export default router;