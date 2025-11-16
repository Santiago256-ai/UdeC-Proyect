/*
  Warnings:

  - Added the required column `modalidad` to the `Vacante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Vacante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ubicacion` to the `Vacante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Postulacion" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "Vacante" ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modalidad" TEXT NOT NULL,
ADD COLUMN     "salario" TEXT,
ADD COLUMN     "tipo" TEXT NOT NULL,
ADD COLUMN     "ubicacion" TEXT NOT NULL;
