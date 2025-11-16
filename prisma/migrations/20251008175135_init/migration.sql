/*
  Warnings:

  - You are about to drop the column `fecha` on the `Postulacion` table. All the data in the column will be lost.
  - You are about to drop the column `requisitos` on the `Vacante` table. All the data in the column will be lost.
  - You are about to drop the `HojaDeVida` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."HojaDeVida" DROP CONSTRAINT "HojaDeVida_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Postulacion" DROP COLUMN "fecha",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Vacante" DROP COLUMN "requisitos",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."HojaDeVida";
