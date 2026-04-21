CREATE TYPE "CronSyncStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');

CREATE TABLE "CronSyncLog" (
    "id" SERIAL NOT NULL,
    "job" TEXT NOT NULL,
    "status" "CronSyncStatus" NOT NULL DEFAULT 'RUNNING',
    "trigger" TEXT NOT NULL DEFAULT 'cron',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "daysRequested" INTEGER NOT NULL DEFAULT 0,
    "syncedDays" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "error" TEXT,
    "details" JSONB,

    CONSTRAINT "CronSyncLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CronSyncLog_job_startedAt_idx" ON "CronSyncLog"("job", "startedAt");
CREATE INDEX "CronSyncLog_status_idx" ON "CronSyncLog"("status");
