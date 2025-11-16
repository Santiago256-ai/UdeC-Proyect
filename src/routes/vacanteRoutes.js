import express from "express";
import { 
    crearVacante, 
    listarVacantes, 
    eliminarVacante, 
    listarVacantesPorEmpresa
} from "../controllers/vacanteController.js"; 

const router = express.Router();

// 🟢 Crear vacante (POST /) se convierte en POST /api/vacantes
router.post("/", crearVacante); 

// 🟢 Listar TODAS las vacantes (GET /) se convierte en GET /api/vacantes
router.get("/", listarVacantes); 

// ✅ Listar vacantes por ID de empresa (GET /empresa/:id) se convierte en GET /api/vacantes/empresa/:id
router.get("/empresa/:id", listarVacantesPorEmpresa);

// Eliminar vacante (DELETE /:id) se convierte en DELETE /api/vacantes/:id
router.delete("/:id", eliminarVacante);

export default router;