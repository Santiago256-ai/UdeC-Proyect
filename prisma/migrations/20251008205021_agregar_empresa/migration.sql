/*
  Warnings:

  - Added the required column `empresaId` to the `Vacante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vacante" ADD COLUMN     "empresaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vacante" ADD CONSTRAINT "Vacante_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
