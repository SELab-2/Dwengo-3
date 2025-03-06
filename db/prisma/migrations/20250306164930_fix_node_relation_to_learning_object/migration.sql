/*
  Warnings:

  - You are about to drop the column `loId` on the `LearningPathNode` table. All the data in the column will be lost.
  - You are about to drop the column `lpId` on the `LearningPathNode` table. All the data in the column will be lost.
  - Added the required column `learningObjectHruid` to the `LearningPathNode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learningObjectLanguage` to the `LearningPathNode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learningObjectVersion` to the `LearningPathNode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learningPathId` to the `LearningPathNode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LearningPathNode" DROP CONSTRAINT "LearningPathNode_loId_fkey";

-- DropForeignKey
ALTER TABLE "LearningPathNode" DROP CONSTRAINT "LearningPathNode_lpId_fkey";

-- AlterTable
ALTER TABLE "LearningObject" ADD COLUMN     "contentLocation" TEXT;

-- AlterTable
ALTER TABLE "LearningPathNode" DROP COLUMN "loId",
DROP COLUMN "lpId",
ADD COLUMN     "learningObjectHruid" TEXT NOT NULL,
ADD COLUMN     "learningObjectLanguage" TEXT NOT NULL,
ADD COLUMN     "learningObjectVersion" INTEGER NOT NULL,
ADD COLUMN     "learningPathId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LearningPathNode" ADD CONSTRAINT "LearningPathNode_learningObjectHruid_learningObjectLanguag_fkey" FOREIGN KEY ("learningObjectHruid", "learningObjectLanguage", "learningObjectVersion") REFERENCES "LearningObject"("hruid", "language", "version") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearningPathNode" ADD CONSTRAINT "LearningPathNode_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
