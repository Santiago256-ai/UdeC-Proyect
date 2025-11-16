import express from "express";
import cors from "cors";
import path from "path";
import vacanteRoutes from "./routes/vacanteRoutes.js";
import postulacionRoutes from "./routes/postulacionRoutes.js";
import empresaRoutes from "./routes/empresaRoutes.js";
import estudianteRoutes from "./routes/estudianteRoutes.js";

const app = express();

// 🧩 Middlewares
app.use(cors());
app.use(express.json());

// 🟢 CORRECCIÓN CLAVE: Servir archivos estáticos desde 'src/uploads'
// Esto hace que la carpeta sea accesible públicamente a través del prefijo /uploads
// Por ejemplo: http://localhost:4000/uploads/archivo.pdf
app.use("/uploads", express.static(path.join(path.resolve(), 'src', 'uploads'))); 

// 📦 Rutas agrupadas bajo /api
app.use("/api/vacantes", vacanteRoutes); 
app.use("/api/postulaciones", postulacionRoutes); 
app.use("/api/empresas", empresaRoutes); 
app.use("/api/estudiantes", estudianteRoutes); 

// 🚀 Servidor
const PORT = 4000;
app.listen(PORT, () =>
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
);
