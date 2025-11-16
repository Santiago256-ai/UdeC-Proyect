/*
  Warnings:

  - You are about to drop the column `estudianteId` on the `Postulacion` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `empresaId` on the `Vacante` table. All the data in the column will be lost.
  - You are about to drop the column `fechaCreacion` on the `Vacante` table. All the data in the column will be lost.
  - Added the required column `usuarioId` to the `Postulacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresa` to the `Vacante` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Postulacion" DROP CONSTRAINT "Postulacion_estudianteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Vacante" DROP CONSTRAINT "Vacante_empresaId_fkey";

-- AlterTable
ALTER TABLE "Postulacion" DROP COLUMN "estudianteId",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Vacante" DROP COLUMN "empresaId",
DROP COLUMN "fechaCreacion",
ADD COLUMN     "empresa" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
