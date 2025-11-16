import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });


const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.usuario.findMany();
    console.log("✅ Conectado a MySQL. Usuarios encontrados:", users.length);
  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
