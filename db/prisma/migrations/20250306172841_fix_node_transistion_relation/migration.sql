/*
  Warnings:

  - You are about to drop the column `nextNodeId` on the `LearningNodeTransition` table. All the data in the column will be lost.
  - You are about to drop the column `learningObjectHruid` on the `LearningPathNode` table. All the data in the column will be lost.
  - You are about to drop the column `learningObjectLanguage` on the `LearningPathNode` table. All the data in the column will be lost.
  - You are about to drop the column `learningObjectVersion` on the `LearningPathNode` table. All the data in the column will be lost.
  - Added the required column `learningObjectId` to the `LearningPathNode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LearningNodeTransition" DROP CONSTRAINT "LearningNodeTransition_nextNodeId_fkey";

-- DropForeignKey
ALTER TABLE "LearningPathNode" DROP CONSTRAINT "LearningPathNode_learningObjectHruid_learningObjectLanguag_fkey";

-- AlterTable
ALTER TABLE "LearningNodeTransition" DROP COLUMN "nextNodeId",
ADD COLUMN     "toNodeId" TEXT;

-- AlterTable
ALTER TABLE "LearningPathNode" DROP COLUMN "learningObjectHruid",
DROP COLUMN "learningObjectLanguage",
DROP COLUMN "learningObjectVersion",
ADD COLUMN     "learningObjectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LearningPathNode" ADD CONSTRAINT "LearningPathNode_learningObjectId_fkey" FOREIGN KEY ("learningObjectId") REFERENCES "LearningObject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearningNodeTransition" ADD CONSTRAINT "LearningNodeTransition_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "LearningPathNode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
