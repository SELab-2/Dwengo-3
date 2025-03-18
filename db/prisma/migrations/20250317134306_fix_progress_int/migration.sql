/*
  Warnings:

  - The `progress` column on the `Favorite` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `progress` column on the `Group` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[learningPathId,index]` on the table `LearningPathNode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "progress",
ADD COLUMN     "progress" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "progress",
ADD COLUMN     "progress" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- CreateIndex
CREATE UNIQUE INDEX "LearningPathNode_learningPathId_index_key" ON "LearningPathNode"("learningPathId", "index");
