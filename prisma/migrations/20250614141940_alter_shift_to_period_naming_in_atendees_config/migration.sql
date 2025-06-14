/*
  Warnings:

  - You are about to drop the column `end_at` on the `attendance_configurations` table. All the data in the column will be lost.
  - You are about to drop the column `start_at` on the `attendance_configurations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendance_configurations" DROP COLUMN "end_at",
DROP COLUMN "start_at",
ADD COLUMN     "period_end_at" TIMESTAMP(3),
ADD COLUMN     "period_start_at" TIMESTAMP(3);
