ALTER TABLE "Withdrawal"
ADD COLUMN "referenceMonth" INTEGER,
ADD COLUMN "referenceYear" INTEGER,
ADD COLUMN "invoiceUrl" TEXT,
ADD COLUMN "receiptUrl" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX "Withdrawal_walletId_referenceMonth_referenceYear_key" ON "Withdrawal"("walletId", "referenceMonth", "referenceYear");
CREATE INDEX "Withdrawal_status_idx" ON "Withdrawal"("status");
CREATE INDEX "Withdrawal_referenceYear_referenceMonth_idx" ON "Withdrawal"("referenceYear", "referenceMonth");
