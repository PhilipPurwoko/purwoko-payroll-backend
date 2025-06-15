-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_attendance_period_id_fkey";

-- AlterTable
ALTER TABLE "attendances" ALTER COLUMN "attendance_period_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_attendance_period_id_fkey" FOREIGN KEY ("attendance_period_id") REFERENCES "attendance_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
