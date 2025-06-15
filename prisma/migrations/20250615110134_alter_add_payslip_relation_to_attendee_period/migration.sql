/*
  Warnings:

  - Added the required column `attendance_period_id` to the `payslips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payslips" ADD COLUMN     "attendance_period_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_attendance_period_id_fkey" FOREIGN KEY ("attendance_period_id") REFERENCES "attendance_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
