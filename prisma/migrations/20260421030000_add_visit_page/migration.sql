ALTER TABLE "Visit" ADD COLUMN "page" TEXT NOT NULL DEFAULT 'campaign';

CREATE INDEX "Visit_referralId_campaignId_page_ip_createdAt_idx" ON "Visit"("referralId", "campaignId", "page", "ip", "createdAt");
