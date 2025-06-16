/*
  Warnings:

  - You are about to drop the column `hourly_rate` on the `attendance_configurations` table. All the data in the column will be lost.
  - You are about to drop the column `overtime_multiplier` on the `attendance_configurations` table. All the data in the column will be lost.
  - You are about to drop the column `overtime_rate` on the `attendance_configurations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendance_configurations" DROP COLUMN "hourly_rate",
DROP COLUMN "overtime_multiplier",
DROP COLUMN "overtime_rate";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hourly_rate" INTEGER,
ADD COLUMN     "overtime_multiplier" DECIMAL(65,30),
ADD COLUMN     "overtime_rate" INTEGER;
