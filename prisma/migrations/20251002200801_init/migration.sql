-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HojaDeVida" (
    "id" SERIAL NOT NULL,
    "archivo" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "HojaDeVida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vacante" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "requisitos" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "Vacante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Postulacion" (
    "id" SERIAL NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "vacanteId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Postulacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- AddForeignKey
ALTER TABLE "HojaDeVida" ADD CONSTRAINT "HojaDeVida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacante" ADD CONSTRAINT "Vacante_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_vacanteId_fkey" FOREIGN KEY ("vacanteId") REFERENCES "Vacante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
