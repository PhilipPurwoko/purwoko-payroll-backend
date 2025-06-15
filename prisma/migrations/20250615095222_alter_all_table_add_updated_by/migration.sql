-- AlterTable
ALTER TABLE "attendance_configurations" ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "attendance_periods" ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "attendances" ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "overtimes" ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "payrolls" ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "payslip_sumaries" ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "payslips" ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "reimbursements" ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "updated_by" TEXT;
