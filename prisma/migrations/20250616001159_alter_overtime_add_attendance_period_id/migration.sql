/*
  Warnings:

  - You are about to drop the column `attendancePeriodId` on the `overtimes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "overtimes" DROP CONSTRAINT "overtimes_attendancePeriodId_fkey";

-- AlterTable
ALTER TABLE "overtimes" DROP COLUMN "attendancePeriodId",
ADD COLUMN     "attendance_period_id" TEXT;

-- AddForeignKey
ALTER TABLE "overtimes" ADD CONSTRAINT "overtimes_attendance_period_id_fkey" FOREIGN KEY ("attendance_period_id") REFERENCES "attendance_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
