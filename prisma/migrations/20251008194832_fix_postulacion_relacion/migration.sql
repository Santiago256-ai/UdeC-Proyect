/*
  Warnings:

  - You are about to drop the column `fecha` on the `Postulacion` table. All the data in the column will be lost.
  - Added the required column `correo` to the `Postulacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cv_url` to the `Postulacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Postulacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Postulacion" DROP CONSTRAINT "Postulacion_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Postulacion" DROP COLUMN "fecha",
ADD COLUMN     "correo" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "cv_url" TEXT NOT NULL,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "telefono" TEXT,
ALTER COLUMN "usuarioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vacante" ADD COLUMN     "fechaPublicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
