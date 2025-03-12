-- DropForeignKey
ALTER TABLE "LearningObjectKeyword" DROP CONSTRAINT "LearningObjectKeyword_loId_fkey";

-- AlterTable
ALTER TABLE "LearningObject" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "LearningPath" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "LearningObjectKeyword" ADD CONSTRAINT "LearningObjectKeyword_loId_fkey" FOREIGN KEY ("loId") REFERENCES "LearningObject"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
