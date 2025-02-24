-- CreateEnum
CREATE TYPE "content_type_enum" AS ENUM ('text/plain', 'text/markdown', 'image/image-block', 'image/image', 'audio/mpeg', 'application/pdf', 'extern', 'blockly');

-- CreateTable
CREATE TABLE "learning_objects" (
    "hruid" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content_type" "content_type_enum",
    "target_ages" INTEGER[],
    "teacher_exclusive" BOOLEAN DEFAULT false,
    "skos_concepts" TEXT[],
    "educational_goals" JSON[],
    "copyright" TEXT,
    "licence" TEXT,
    "difficulty" DECIMAL,
    "estimated_time" DECIMAL,
    "return_value" JSON,
    "available" BOOLEAN DEFAULT true,
    "content_location" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_objects_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "learning_objects_keyword" (
    "lo_id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,

    CONSTRAINT "learning_objects_keyword_pkey" PRIMARY KEY ("lo_id")
);

-- CreateTable
CREATE TABLE "learning_path_nodes" (
    "_id" TEXT NOT NULL,
    "lp_id" TEXT NOT NULL,
    "lo_hruid" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "instruction" TEXT,
    "start_node" BOOLEAN DEFAULT false,

    CONSTRAINT "learning_path_nodes_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "learning_path_transitions" (
    "_id" TEXT NOT NULL,
    "from_node_id" TEXT NOT NULL,
    "to_lo_hruid" TEXT NOT NULL,
    "to_version" INTEGER NOT NULL,
    "to_language" TEXT NOT NULL,
    "condition" TEXT,
    "is_default" BOOLEAN DEFAULT false,

    CONSTRAINT "learning_path_transitions_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "learning_paths" (
    "_id" TEXT NOT NULL,
    "hruid" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "learning_objects_hruid_key" ON "learning_objects"("hruid");

-- CreateIndex
CREATE UNIQUE INDEX "learning_objects_uuid_key" ON "learning_objects"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "learning_objects_keyword_lo_id_keyword_key" ON "learning_objects_keyword"("lo_id", "keyword");

-- CreateIndex
CREATE UNIQUE INDEX "learning_paths_hruid_key" ON "learning_paths"("hruid");

-- AddForeignKey
ALTER TABLE "learning_objects_keyword" ADD CONSTRAINT "learning_objects_keyword_lo_id_fkey" FOREIGN KEY ("lo_id") REFERENCES "learning_objects"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "learning_path_nodes" ADD CONSTRAINT "learning_path_nodes_lo_hruid_fkey" FOREIGN KEY ("lo_hruid") REFERENCES "learning_objects"("hruid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "learning_path_nodes" ADD CONSTRAINT "learning_path_nodes_lp_id_fkey" FOREIGN KEY ("lp_id") REFERENCES "learning_paths"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "learning_path_transitions" ADD CONSTRAINT "learning_path_transitions_from_node_id_fkey" FOREIGN KEY ("from_node_id") REFERENCES "learning_path_nodes"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "learning_path_transitions" ADD CONSTRAINT "learning_path_transitions_to_lo_hruid_fkey" FOREIGN KEY ("to_lo_hruid") REFERENCES "learning_objects"("hruid") ON DELETE NO ACTION ON UPDATE NO ACTION;
