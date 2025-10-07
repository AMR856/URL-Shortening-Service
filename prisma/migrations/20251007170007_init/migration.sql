/*
  Warnings:

  - You are about to drop the column `shortUrl` on the `urls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shortCode]` on the table `urls` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortCode` to the `urls` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."urls_shortUrl_key";

-- AlterTable
ALTER TABLE "urls" DROP COLUMN "shortUrl",
ADD COLUMN     "shortCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "urls_shortCode_key" ON "urls"("shortCode");
