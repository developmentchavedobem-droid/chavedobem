/*
  Warnings:

  - You are about to drop the column `email_confirm` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[campaignId,createdById]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'USER', 'CUSTOMER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email_confirm",
ADD COLUMN     "type" "UserType" NOT NULL;

-- CreateTable
CREATE TABLE "ReferralLink" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" SERIAL NOT NULL,
    "referralId" INTEGER NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdRevenue" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdRevenue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralLink_code_key" ON "ReferralLink"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AdRevenue_month_year_key" ON "AdRevenue"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_campaignId_createdById_key" ON "Ticket"("campaignId", "createdById");

-- AddForeignKey
ALTER TABLE "ReferralLink" ADD CONSTRAINT "ReferralLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "ReferralLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
