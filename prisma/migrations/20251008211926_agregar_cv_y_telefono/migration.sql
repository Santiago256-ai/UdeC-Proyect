/*
  Warnings:

  - You are about to drop the column `programa` on the `Postulacion` table. All the data in the column will be lost.
  - You are about to drop the column `semestre` on the `Postulacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Postulacion" DROP COLUMN "programa",
DROP COLUMN "semestre",
ALTER COLUMN "cv_url" DROP NOT NULL;
