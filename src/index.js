import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes.js";
import vacantesRoutes from "./routes/vacantesRoutes.js";
import cvsRoutes from "./routes/cvsRoutes.js";
import postulacionesRoutes from "./routes/postulacionesRoutes.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/vacantes", vacantesRoutes);
app.use("/cvs", cvsRoutes);
app.use("/postulaciones", postulacionesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));
