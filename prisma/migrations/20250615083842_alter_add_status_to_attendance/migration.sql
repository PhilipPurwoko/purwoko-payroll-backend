-- AlterTable
ALTER TABLE "attendances" ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'pending';
