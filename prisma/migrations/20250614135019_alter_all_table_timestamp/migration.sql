-- AlterTable
ALTER TABLE "attendance_configurations" ALTER COLUMN "isActive" SET DEFAULT true,
ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "deleted_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "attendance_periods" ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "deleted_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "attendances" ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "deleted_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "deleted_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "overtimes" ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "deleted_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payrolls" ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "deleted_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payslip_sumaries" ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "deleted_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payslips" ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "deleted_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reimbursements" ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "deleted_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "deleted_by" DROP NOT NULL;
