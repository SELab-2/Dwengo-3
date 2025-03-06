/*
  Warnings:

  - You are about to drop the column `learningObjectsKeywords` on the `LearningObject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LearningObject" DROP COLUMN "learningObjectsKeywords",
ADD COLUMN     "keywords" TEXT[];
