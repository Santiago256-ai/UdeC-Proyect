import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; // ⬅️ IMPORTAR JWT
const prisma = new PrismaClient();

// ⚠️ CLAVE SECRETA: Es crucial usar una clave compleja y leerla desde .env
// Si usas dotenv, asegúrate de que se cargue al inicio de tu aplicación.
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_debes_cambiarla'; 

// Crear una nueva empresa
export const crearEmpresa = async (req, res) => {
    try {
        const {
            companyName,
            email,
            phones,
            contactName,
            nit,
            address,
            city,
            department,
            companyType,
            economicSector,
            foundationYear,
            annualRevenue,
            totalAssets,
            equity,
            employees,
            distributionChannels,
            mainClients,
            emailAuthorization,
            password 
        } = req.body;

        // 3. Validación de campos obligatorios (Añadimos 'password')
        if (!companyName || !email || !phones || !contactName || !address || !city || !department || !companyType || !economicSector || !foundationYear || !annualRevenue || !employees || !distributionChannels || !mainClients || !password) {
            return res.status(400).json({ error: "Faltan campos obligatorios, incluyendo la contraseña" });
        }
        
        // Opcional: Verificar si el email ya existe
        const existingEmpresa = await prisma.empresa.findUnique({
            where: { email: email },
        });

        if (existingEmpresa) {
            return res.status(409).json({ error: "El correo electrónico ya está registrado." });
        }

        // 4. HASHEAR LA CONTRASEÑA
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 

        const nuevaEmpresa = await prisma.empresa.create({
            data: {
                // Información Básica
                nombre: companyName,
                email,
                password: hashedPassword, // ⬅️ GUARDAR EL HASH
                phones,
                contactName,
                nit: nit || null,

                // Ubicación
                address,
                city,
                department,

                // Información Empresarial
                companyType,
                economicSector,
                foundationYear: parseInt(foundationYear),
                employees,

                // Información Financiera y Comercial
                annualRevenue,
                totalAssets: totalAssets || null,
                equity: equity || null,
                distributionChannels,
                mainClients,
                emailAuthorization: Boolean(emailAuthorization),
            },
        });

        // Eliminamos la contraseña del objeto que enviamos de vuelta
        const { password: _, ...empresaData } = nuevaEmpresa; 
        
        console.log("✅ Empresa creada:", empresaData);
        res.status(201).json({ 
            message: "Empresa registrada correctamente", 
            empresa: empresaData 
        });

    } catch (error) {
        console.error("❌ Error al crear empresa:", error);
        if (error.code === 'P2002') {
            res.status(409).json({ error: "Ya existe un registro con ese correo o NIT." });
        } else {
            res.status(500).json({ error: "Error interno al registrar la empresa" });
        }
    }
};

// 🔐 NUEVA FUNCIÓN: Iniciar sesión de la empresa
export const loginEmpresa = async (req, res) => {
    try {
        // En tu frontend envías 'identificador' y 'contraseña', aquí los mapeamos a 'email' y 'password'
        const { identificador: email, contraseña: password } = req.body; 

        if (!email || !password) {
            return res.status(400).json({ error: "Faltan credenciales (email y password)." });
        }

        // 1. Buscar la empresa por email
        const empresa = await prisma.empresa.findUnique({
            where: { email },
        });

        if (!empresa) {
            return res.status(401).json({ error: "Credenciales incorrectas." });
        }

        // 2. Comparar la contraseña ingresada con el hash guardado
        const passwordMatch = await bcrypt.compare(password, empresa.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Credenciales incorrectas." });
        }

        // 3. Generar el Token Web JSON (JWT)
        const token = jwt.sign(
            { id: empresa.id, email: empresa.email, rol: 'empresa' }, // Payload
            JWT_SECRET,
            { expiresIn: '1d' } 
        );

        // 4. Devolver respuesta exitosa (sin el hash de la contraseña)
        const { password: _, ...empresaData } = empresa;

        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            usuario: { 
                ...empresaData,
                rol: 'empresa' // ⬅️ CLAVE: Devuelve el rol para que el frontend pueda redireccionar
            }
        });

    } catch (error) {
        console.error("❌ Error al iniciar sesión de empresa:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};


// Listar todas las empresas (Se mantiene igual)
export const listarEmpresas = async (req, res) => {
    try {
        const empresas = await prisma.empresa.findMany({
            orderBy: { id: "desc" },
            select: {
                id: true,
                nombre: true,
                email: true,
                // ... (campos de información pública)
            }
        });
        res.json(empresas);
    } catch (error) {
        console.error("❌ Error al listar empresas:", error);
        res.status(500).json({ error: "Error al listar empresas" });
    }
};