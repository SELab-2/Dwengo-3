-- CreateEnum
CREATE TYPE "ContentTypeEnum" AS ENUM ('text/plain', 'text/markdown', 'image/image-block', 'image/image', 'audio/mpeg', 'application/pdf', 'extern', 'blockly');

-- CreateEnum
CREATE TYPE "ClassRole" AS ENUM ('TEACHER', 'STUDENT');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('MULTIPLE_CHOICE', 'FILE', 'READ');

-- CreateTable
CREATE TABLE "LearningObject"
(
    "id"               TEXT             NOT NULL,
    "hruid"            TEXT             NOT NULL,
    "uuid"             TEXT             NOT NULL,
    "version"          INTEGER          NOT NULL,
    "language"         TEXT             NOT NULL,
    "title"            TEXT             NOT NULL,
    "description"      TEXT,
    "contentType"      "ContentTypeEnum",
    "contentLocation"  TEXT,
    "targetAges"       INTEGER[],
    "teacherExclusive" BOOLEAN          NOT NULL DEFAULT false,
    "skosConcepts"     TEXT[],
    "educationalGoals" JSON[],
    "copyright"        TEXT,
    "licence"          TEXT,
    "difficulty"       DECIMAL,
    "estimatedTime"    DECIMAL,
    "returnValue"      JSON,
    "available"        BOOLEAN          NOT NULL DEFAULT true,
    "createdAt"        TIMESTAMP                 DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP,
    "content"          TEXT             NOT NULL,
    "multipleChoice"   JSON,
    "submissionType"   "SubmissionType" NOT NULL DEFAULT 'READ',

    CONSTRAINT "LearningObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningObjectKeyword"
(
    "learningObjectId" TEXT NOT NULL,
    "keyword"          TEXT NOT NULL,

    CONSTRAINT "LearningObjectKeyword_pkey" PRIMARY KEY ("learningObjectId", "keyword")
);

-- CreateTable
CREATE TABLE "LearningTheme"
(
    "id"       TEXT NOT NULL,
    "image"    TEXT NOT NULL,
    "title"    TEXT NOT NULL,
    "keywords" TEXT[],

    CONSTRAINT "LearningTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPathNode"
(
    "id"               TEXT    NOT NULL,
    "learningPathId"   TEXT    NOT NULL,
    "learningObjectId" TEXT    NOT NULL,
    "instruction"      TEXT,
    "index"            INTEGER NOT NULL,

    CONSTRAINT "LearningPathNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningNodeTransition"
(
    "id"                 TEXT    NOT NULL,
    "learningPathNodeId" TEXT    NOT NULL,
    "condition"          TEXT,
    "toNodeIndex"        INTEGER NOT NULL,

    CONSTRAINT "LearningNodeTransition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPath"
(
    "id"          TEXT NOT NULL,
    "hruid"       TEXT NOT NULL,
    "language"    TEXT NOT NULL,
    "title"       TEXT NOT NULL,
    "description" TEXT,
    "image"       TEXT,
    "ownerId"     TEXT,
    "createdAt"   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User"
(
    "id"       TEXT           NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "username" TEXT           NOT NULL,
    "email"    TEXT           NOT NULL,
    "password" TEXT           NOT NULL,
    "surname"  TEXT           NOT NULL,
    "name"     TEXT           NOT NULL,
    "role"     "ClassRole"    NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student"
(
    "id"     TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher"
(
    "id"     TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class"
(
    "id"          TEXT NOT NULL,
    "name"        TEXT NOT NULL DEFAULT 'New class',
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassJoinRequest"
(
    "id"      TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId"  TEXT NOT NULL,

    CONSTRAINT "ClassJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group"
(
    "id"               TEXT    NOT NULL,
    "name"             TEXT    NOT NULL,
    "assignmentId"     TEXT    NOT NULL,
    "progress"         INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "currentNodeIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment"
(
    "id"             TEXT      NOT NULL,
    "name"           TEXT      NOT NULL,
    "description"    TEXT      NOT NULL,
    "learningPathId" TEXT      NOT NULL,
    "teacherId"      TEXT      NOT NULL,
    "classId"        TEXT      NOT NULL,
    "deadline"       TIMESTAMP NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentSubmission"
(
    "id"             TEXT             NOT NULL,
    "groupId"        TEXT,
    "favoriteId"     TEXT,
    "nodeId"         TEXT             NOT NULL,
    "submissionType" "SubmissionType" NOT NULL,
    "submission"     JSONB,

    CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite"
(
    "id"               TEXT    NOT NULL,
    "userId"           TEXT    NOT NULL,
    "learningPathId"   TEXT    NOT NULL,
    "progress"         INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "currentNodeIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discussion"
(
    "id"      TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Discussion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message"
(
    "id"           SERIAL    NOT NULL,
    "content"      TEXT      NOT NULL,
    "senderId"     TEXT      NOT NULL,
    "discussionId" TEXT      NOT NULL,
    "createdAt"    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement"
(
    "id"        TEXT      NOT NULL,
    "title"     TEXT      NOT NULL,
    "content"   TEXT      NOT NULL,
    "classId"   TEXT      NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teacherId" TEXT      NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassToStudent"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassToStudent_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateTable
CREATE TABLE "_ClassToTeacher"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassToTeacher_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateTable
CREATE TABLE "_GroupToStudent"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupToStudent_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateTable
CREATE TABLE "_DiscussionToUser"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DiscussionToUser_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningObject_hruid_version_language_key" ON "LearningObject" ("hruid", "version", "language");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPathNode_learningPathId_index_key" ON "LearningPathNode" ("learningPathId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_hruid_language_key" ON "LearningPath" ("hruid", "language");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentSubmission_groupId_nodeId_key" ON "AssignmentSubmission" ("groupId", "nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Discussion_groupId_key" ON "Discussion" ("groupId");

-- CreateIndex
CREATE INDEX "_ClassToStudent_B_index" ON "_ClassToStudent" ("B");

-- CreateIndex
CREATE INDEX "_ClassToTeacher_B_index" ON "_ClassToTeacher" ("B");

-- CreateIndex
CREATE INDEX "_GroupToStudent_B_index" ON "_GroupToStudent" ("B");

-- CreateIndex
CREATE INDEX "_DiscussionToUser_B_index" ON "_DiscussionToUser" ("B");

-- AddForeignKey
ALTER TABLE "LearningObjectKeyword"
    ADD CONSTRAINT "LearningObjectKeyword_learningObjectId_fkey" FOREIGN KEY ("learningObjectId") REFERENCES "LearningObject" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearningPathNode"
    ADD CONSTRAINT "LearningPathNode_learningObjectId_fkey" FOREIGN KEY ("learningObjectId") REFERENCES "LearningObject" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearningPathNode"
    ADD CONSTRAINT "LearningPathNode_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearningNodeTransition"
    ADD CONSTRAINT "LearningNodeTransition_learningPathNodeId_fkey" FOREIGN KEY ("learningPathNodeId") REFERENCES "LearningPathNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPath"
    ADD CONSTRAINT "LearningPath_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Student"
    ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Teacher"
    ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ClassJoinRequest"
    ADD CONSTRAINT "ClassJoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ClassJoinRequest"
    ADD CONSTRAINT "ClassJoinRequest_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Group"
    ADD CONSTRAINT "Group_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Assignment"
    ADD CONSTRAINT "Assignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Assignment"
    ADD CONSTRAINT "Assignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Assignment"
    ADD CONSTRAINT "Assignment_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission"
    ADD CONSTRAINT "AssignmentSubmission_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "LearningPathNode" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission"
    ADD CONSTRAINT "AssignmentSubmission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission"
    ADD CONSTRAINT "AssignmentSubmission_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "Favorite" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Favorite"
    ADD CONSTRAINT "Favorite_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Favorite"
    ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Discussion"
    ADD CONSTRAINT "Discussion_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message"
    ADD CONSTRAINT "Message_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Announcement"
    ADD CONSTRAINT "Announcement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Announcement"
    ADD CONSTRAINT "Announcement_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_ClassToStudent"
    ADD CONSTRAINT "_ClassToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToStudent"
    ADD CONSTRAINT "_ClassToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToTeacher"
    ADD CONSTRAINT "_ClassToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToTeacher"
    ADD CONSTRAINT "_ClassToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToStudent"
    ADD CONSTRAINT "_GroupToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToStudent"
    ADD CONSTRAINT "_GroupToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscussionToUser"
    ADD CONSTRAINT "_DiscussionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Discussion" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscussionToUser"
    ADD CONSTRAINT "_DiscussionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
