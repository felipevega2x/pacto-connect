-- CreateEnum
CREATE TYPE "KeyMode" AS ENUM ('live', 'test');

-- CreateEnum
CREATE TYPE "KeyStatus" AS ENUM ('active', 'revoked');

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "publishableKey" TEXT NOT NULL,
    "secretKeyHash" TEXT NOT NULL,
    "secretLast4" TEXT NOT NULL,
    "mode" "KeyMode" NOT NULL DEFAULT 'test',
    "allowedOrigins" TEXT[],
    "status" "KeyStatus" NOT NULL DEFAULT 'active',
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_publishableKey_key" ON "ApiKey"("publishableKey");

-- CreateIndex
CREATE INDEX "ApiKey_publishableKey_idx" ON "ApiKey"("publishableKey");

-- CreateIndex
CREATE INDEX "ApiKey_status_idx" ON "ApiKey"("status");
