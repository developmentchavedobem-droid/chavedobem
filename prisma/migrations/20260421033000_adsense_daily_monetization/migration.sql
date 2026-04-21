CREATE TYPE "MonetizationStatus" AS ENUM ('ESTIMATED', 'CONFIRMED', 'ADJUSTED', 'PAID');

CREATE TABLE "AdSenseDailyReport" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "estimatedEarnings" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "pageViewsRpm" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "source" TEXT NOT NULL DEFAULT 'manual',
    "rawPayload" JSONB,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdSenseDailyReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PromoterDailyEarning" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "profileId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "reportId" INTEGER NOT NULL,
    "validVisits" INTEGER NOT NULL DEFAULT 0,
    "tickets" INTEGER NOT NULL DEFAULT 0,
    "grossRevenue" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "promoterShare" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "platformShare" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "status" "MonetizationStatus" NOT NULL DEFAULT 'ESTIMATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoterDailyEarning_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdSenseDailyReport_date_key" ON "AdSenseDailyReport"("date");
CREATE UNIQUE INDEX "PromoterDailyEarning_date_profileId_campaignId_key" ON "PromoterDailyEarning"("date", "profileId", "campaignId");
CREATE INDEX "PromoterDailyEarning_profileId_date_idx" ON "PromoterDailyEarning"("profileId", "date");
CREATE INDEX "PromoterDailyEarning_campaignId_date_idx" ON "PromoterDailyEarning"("campaignId", "date");
CREATE INDEX "PromoterDailyEarning_status_idx" ON "PromoterDailyEarning"("status");

ALTER TABLE "PromoterDailyEarning" ADD CONSTRAINT "PromoterDailyEarning_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PromoterDailyEarning" ADD CONSTRAINT "PromoterDailyEarning_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PromoterDailyEarning" ADD CONSTRAINT "PromoterDailyEarning_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "AdSenseDailyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
