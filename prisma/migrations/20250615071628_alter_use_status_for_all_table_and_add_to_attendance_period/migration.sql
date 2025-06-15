/*
  Warnings:

  - The `status` column on the `payrolls` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `reimbursements` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'ongoing', 'completed', 'failed');

-- AlterTable
ALTER TABLE "attendance_periods" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ongoing';

-- AlterTable
ALTER TABLE "payrolls" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'completed';

-- AlterTable
ALTER TABLE "payslips" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "reimbursements" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'pending';

-- DropEnum
DROP TYPE "PayrollStatus";

-- DropEnum
DROP TYPE "ReimbursementStatus";
