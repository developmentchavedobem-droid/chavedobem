ALTER TABLE "AdSenseDailyReport"
ADD COLUMN "estimatedEarningsUsd" DECIMAL(12, 4) NOT NULL DEFAULT 0,
ADD COLUMN "exchangeRate" DECIMAL(12, 6) NOT NULL DEFAULT 1,
ADD COLUMN "exchangeRateDate" DATE,
ADD COLUMN "exchangeRateSource" TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN "sourceCurrency" TEXT NOT NULL DEFAULT 'USD';

UPDATE "AdSenseDailyReport"
SET
  "estimatedEarningsUsd" = CASE
    WHEN "currency" = 'USD' THEN "estimatedEarnings"
    ELSE 0
  END,
  "sourceCurrency" = CASE
    WHEN "currency" = 'USD' THEN 'USD'
    ELSE "currency"
  END,
  "currency" = 'BRL'
WHERE "estimatedEarningsUsd" = 0;
