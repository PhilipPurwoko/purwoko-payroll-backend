-- AlterTable
ALTER TABLE "payslips" ADD COLUMN     "hourly_rate" INTEGER,
ADD COLUMN     "hours_per_day" INTEGER,
ADD COLUMN     "overtime_rate" INTEGER,
ADD COLUMN     "take_home_pay" INTEGER,
ADD COLUMN     "total_attendance" INTEGER,
ADD COLUMN     "total_attendance_amount" INTEGER,
ADD COLUMN     "total_attendance_hours" INTEGER,
ADD COLUMN     "total_overtime_amount" INTEGER,
ADD COLUMN     "total_overtime_hours" INTEGER,
ADD COLUMN     "total_reimbursement_amount" INTEGER,
ALTER COLUMN "url" DROP NOT NULL;
