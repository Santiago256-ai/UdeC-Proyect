/*
  Warnings:

  - You are about to drop the column `nombre` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nit]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuario]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annualRevenue` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyType` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactName` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distributionChannels` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `economicSector` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employees` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foundationYear` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mainClients` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phones` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apellidos` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombres` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rol` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "annualRevenue" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "companyType" TEXT NOT NULL,
ADD COLUMN     "contactName" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "distributionChannels" TEXT NOT NULL,
ADD COLUMN     "economicSector" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "emailAuthorization" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "employees" TEXT NOT NULL,
ADD COLUMN     "equity" TEXT,
ADD COLUMN     "foundationYear" INTEGER NOT NULL,
ADD COLUMN     "mainClients" TEXT NOT NULL,
ADD COLUMN     "nit" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phones" TEXT NOT NULL,
ADD COLUMN     "totalAssets" TEXT;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "nombre",
ADD COLUMN     "apellidos" TEXT NOT NULL,
ADD COLUMN     "nombres" TEXT NOT NULL,
ADD COLUMN     "usuario" TEXT NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "rol" SET NOT NULL,
ALTER COLUMN "rol" SET DEFAULT 'estudiante';

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_email_key" ON "Empresa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_nit_key" ON "Empresa"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usuario_key" ON "Usuario"("usuario");
