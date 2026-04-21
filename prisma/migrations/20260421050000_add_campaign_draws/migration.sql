CREATE TABLE "CampaignDraw" (
  "id" SERIAL NOT NULL,
  "campaignId" INTEGER NOT NULL,
  "requestedWinners" INTEGER NOT NULL,
  "totalParticipants" INTEGER NOT NULL,
  "seed" TEXT NOT NULL,
  "createdByUserId" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CampaignDraw_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CampaignWinner" (
  "id" SERIAL NOT NULL,
  "drawId" INTEGER NOT NULL,
  "campaignId" INTEGER NOT NULL,
  "profileId" INTEGER NOT NULL,
  "ticketId" INTEGER NOT NULL,
  "position" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CampaignWinner_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CampaignDraw_campaignId_createdAt_idx" ON "CampaignDraw"("campaignId", "createdAt");
CREATE UNIQUE INDEX "CampaignWinner_drawId_profileId_key" ON "CampaignWinner"("drawId", "profileId");
CREATE UNIQUE INDEX "CampaignWinner_drawId_ticketId_key" ON "CampaignWinner"("drawId", "ticketId");
CREATE INDEX "CampaignWinner_campaignId_idx" ON "CampaignWinner"("campaignId");
CREATE INDEX "CampaignWinner_profileId_idx" ON "CampaignWinner"("profileId");

ALTER TABLE "CampaignDraw"
ADD CONSTRAINT "CampaignDraw_campaignId_fkey"
FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CampaignWinner"
ADD CONSTRAINT "CampaignWinner_drawId_fkey"
FOREIGN KEY ("drawId") REFERENCES "CampaignDraw"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CampaignWinner"
ADD CONSTRAINT "CampaignWinner_campaignId_fkey"
FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CampaignWinner"
ADD CONSTRAINT "CampaignWinner_profileId_fkey"
FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CampaignWinner"
ADD CONSTRAINT "CampaignWinner_ticketId_fkey"
FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
