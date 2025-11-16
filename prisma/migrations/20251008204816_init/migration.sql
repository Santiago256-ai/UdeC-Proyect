/*
  Warnings:

  - You are about to drop the column `correo` on the `Postulacion` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Postulacion` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Postulacion` table. All the data in the column will be lost.
  - You are about to drop the column `empresa` on the `Vacante` table. All the data in the column will be lost.
  - You are about to drop the column `fechaPublicacion` on the `Vacante` table. All the data in the column will be lost.
  - Made the column `usuarioId` on table `Postulacion` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Postulacion" DROP CONSTRAINT "Postulacion_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Postulacion" DROP COLUMN "correo",
DROP COLUMN "createdAt",
DROP COLUMN "nombre",
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "programa" TEXT,
ADD COLUMN     "semestre" INTEGER,
ALTER COLUMN "usuarioId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "rol" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vacante" DROP COLUMN "empresa",
DROP COLUMN "fechaPublicacion";

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
