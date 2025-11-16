import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

import vacanteRoutes from "./routes/vacanteRoutes.js";
import postulacionRoutes from "./routes/postulacionRoutes.js";
import empresaRoutes from "./routes/empresaRoutes.js";
import estudianteRoutes from "./routes/estudianteRoutes.js";
import pool from "./database.js";

const app = express();

// 🧩 Middlewares
app.use(cors());
app.use(express.json());

// 🟢 Servir archivos estáticos
app.use("/uploads", express.static(path.join(path.resolve(), "src", "uploads")));

// 🔵 Ruta de prueba con base de datos
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el servidor");
  }
});

// 📦 Rutas API
app.use("/api/vacantes", vacanteRoutes);
app.use("/api/postulaciones", postulacionRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/estudiantes", estudianteRoutes);

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
