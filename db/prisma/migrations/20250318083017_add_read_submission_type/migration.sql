/*
  Warnings:

  - You are about to drop the column `canUploadSubmission` on the `LearningObject` table. All the data in the column will be lost.
  - Added the required column `name` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "SubmissionType" ADD VALUE 'READ';

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LearningObject" DROP COLUMN "canUploadSubmission";
