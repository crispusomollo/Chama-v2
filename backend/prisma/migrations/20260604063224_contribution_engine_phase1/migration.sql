-- CreateEnum
CREATE TYPE "ContributionPeriodStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'MPESA', 'BANK', 'CHEQUE');

-- CreateTable
CREATE TABLE "ContributionRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shareAmount" DECIMAL(12,2) NOT NULL,
    "insuranceAmount" DECIMAL(12,2) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContributionRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionPeriod" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "amountDue" DECIMAL(12,2) NOT NULL,
    "amountPaid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "ContributionPeriodStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributionPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionPayment" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "amountReceived" DECIMAL(12,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "transactionReference" TEXT,
    "notes" TEXT,
    "receivedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributionPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionAllocation" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "amountApplied" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributionAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionReceipt" (
    "id" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generatedByUserId" TEXT NOT NULL,

    CONSTRAINT "ContributionReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContributionPeriod_memberId_periodYear_periodMonth_key" ON "ContributionPeriod"("memberId", "periodYear", "periodMonth");

-- CreateIndex
CREATE UNIQUE INDEX "ContributionReceipt_receiptNumber_key" ON "ContributionReceipt"("receiptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ContributionReceipt_paymentId_key" ON "ContributionReceipt"("paymentId");

-- AddForeignKey
ALTER TABLE "ContributionPeriod" ADD CONSTRAINT "ContributionPeriod_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionPeriod" ADD CONSTRAINT "ContributionPeriod_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "ContributionRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionPayment" ADD CONSTRAINT "ContributionPayment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionPayment" ADD CONSTRAINT "ContributionPayment_receivedByUserId_fkey" FOREIGN KEY ("receivedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionAllocation" ADD CONSTRAINT "ContributionAllocation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "ContributionPayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionAllocation" ADD CONSTRAINT "ContributionAllocation_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "ContributionPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionReceipt" ADD CONSTRAINT "ContributionReceipt_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "ContributionPayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionReceipt" ADD CONSTRAINT "ContributionReceipt_generatedByUserId_fkey" FOREIGN KEY ("generatedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
