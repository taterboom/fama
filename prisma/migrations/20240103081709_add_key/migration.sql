/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `License` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `License` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `License` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "License" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "License_key_key" ON "License"("key");
