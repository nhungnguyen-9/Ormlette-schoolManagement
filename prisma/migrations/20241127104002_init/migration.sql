/*
  Warnings:

  - Made the column `phone` on table `Parent` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `address` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parent" ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "address" TEXT NOT NULL;
