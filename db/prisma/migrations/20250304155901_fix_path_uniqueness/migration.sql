/*
  Warnings:

  - A unique constraint covering the columns `[hruid,language]` on the table `LearningPath` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_hruid_language_key" ON "LearningPath"("hruid", "language");
