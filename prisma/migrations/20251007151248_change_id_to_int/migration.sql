/*
  Warnings:

  - You are about to drop the column `shortCode` on the `urls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shortUrl]` on the table `urls` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortUrl` to the `urls` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."urls_shortCode_key";

-- AlterTable
ALTER TABLE "urls" DROP COLUMN "shortCode",
ADD COLUMN     "shortUrl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "urls_shortUrl_key" ON "urls"("shortUrl");
