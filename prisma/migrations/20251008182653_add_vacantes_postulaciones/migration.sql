/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Postulacion` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Vacante` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Postulacion" DROP COLUMN "createdAt",
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Vacante" DROP COLUMN "createdAt",
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
