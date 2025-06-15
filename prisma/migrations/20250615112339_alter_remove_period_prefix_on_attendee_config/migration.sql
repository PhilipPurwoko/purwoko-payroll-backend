/*
  Warnings:

  - You are about to drop the column `period_end_at` on the `attendance_configurations` table. All the data in the column will be lost.
  - You are about to drop the column `period_start_at` on the `attendance_configurations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendance_configurations" DROP COLUMN "period_end_at",
DROP COLUMN "period_start_at",
ADD COLUMN     "end_at" TIME,
ADD COLUMN     "start_at" TIME;

-- AlterTable
ALTER TABLE "overtimes" ADD COLUMN     "attendancePeriodId" TEXT;

-- AddForeignKey
ALTER TABLE "overtimes" ADD CONSTRAINT "overtimes_attendancePeriodId_fkey" FOREIGN KEY ("attendancePeriodId") REFERENCES "attendance_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
