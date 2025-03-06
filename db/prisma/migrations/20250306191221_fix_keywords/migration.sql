/*
  Warnings:

  - You are about to drop the `LearningObjectKeyword` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LearningObjectKeyword" DROP CONSTRAINT "LearningObjectKeyword_loId_fkey";

-- AlterTable
ALTER TABLE "LearningObject" ADD COLUMN     "learningObjectsKeywords" TEXT[];

-- AlterTable
ALTER TABLE "LearningPath" ADD COLUMN     "ownerId" TEXT;

-- DropTable
DROP TABLE "LearningObjectKeyword";

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
