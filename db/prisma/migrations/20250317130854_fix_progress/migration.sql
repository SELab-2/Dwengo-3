/*
  Warnings:

  - You are about to drop the column `fromNodeId` on the `LearningNodeTransition` table. All the data in the column will be lost.
  - You are about to drop the column `toNodeId` on the `LearningNodeTransition` table. All the data in the column will be lost.
  - You are about to drop the column `startNode` on the `LearningPathNode` table. All the data in the column will be lost.
  - Added the required column `learningPathNodeId` to the `LearningNodeTransition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toNodeIndex` to the `LearningNodeTransition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `LearningPathNode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_nodeId_fkey";

-- DropForeignKey
ALTER TABLE "LearningNodeTransition" DROP CONSTRAINT "LearningNodeTransition_fromNodeId_fkey";

-- DropForeignKey
ALTER TABLE "LearningNodeTransition" DROP CONSTRAINT "LearningNodeTransition_toNodeId_fkey";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "progress" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "LearningNodeTransition" DROP COLUMN "fromNodeId",
DROP COLUMN "toNodeId",
ADD COLUMN     "learningPathNodeId" TEXT NOT NULL,
ADD COLUMN     "toNodeIndex" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LearningPathNode" DROP COLUMN "startNode",
ADD COLUMN     "index" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "progress" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LearningNodeTransition" ADD CONSTRAINT "LearningNodeTransition_learningPathNodeId_fkey" FOREIGN KEY ("learningPathNodeId") REFERENCES "LearningPathNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
