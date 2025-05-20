import { ContentTypeEnum, PrismaClient } from '@prisma/client';
import axios from 'axios';
import cliProgress from 'cli-progress';
import { learningThemes } from './learningThemes';

const contentTypeMap: Map<string, any> = new Map();
contentTypeMap.set('text/plain', ContentTypeEnum.TEXT_PLAIN);
contentTypeMap.set('text/markdown', ContentTypeEnum.TEXT_MARKDOWN);
contentTypeMap.set('image/image-block', ContentTypeEnum.IMAGE_IMAGE_BLOCK);
contentTypeMap.set('image/image', ContentTypeEnum.IMAGE_IMAGE);
contentTypeMap.set('audio/mpeg', ContentTypeEnum.AUDIO_MPEG);
contentTypeMap.set('application/pdf', ContentTypeEnum.APPLICATION_PDF);
contentTypeMap.set('extern', ContentTypeEnum.EXTERN);
contentTypeMap.set('blockly', ContentTypeEnum.BLOCKLY);

const API_URLS = {
  learningObjectsMeta: 'https://dwengo.org/backend/api/learningObject/search?all=',
  learningObjectsContentById: 'https://dwengo.org/backend/api/learningObject/getRaw', // append hruid, version, language
  learningPaths: 'https://dwengo.org/backend/api/learningPath/search?all=',
};

async function fetchRemoteData(url: string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch data from ${url}`, error);
    return [];
  }
}

async function fullSyncLearningObjects(prisma: PrismaClient) {
  const remoteObjects = await fetchRemoteData(API_URLS.learningObjectsMeta);

  // Initialize the progress bar
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(remoteObjects.length, 0);

  for (const [index, remote] of remoteObjects.entries()) {
    const rawContent = await fetchRemoteData(
      `${API_URLS.learningObjectsContentById}?hruid=${remote.hruid}&version=${remote.version}&language=${remote.language}`,
    );

    const data = await prisma.learningObject.upsert({
      where: {
        hruid_version_language: {
          hruid: remote.hruid,
          version: remote.version,
          language: remote.language,
        },
      },
      update: {
        title: remote.title,
        description: remote.description,
        contentType: contentTypeMap.get(remote.content_type),
        targetAges: remote.target_ages,
        teacherExclusive: remote.teacher_exclusive,
        skosConcepts: remote.skos_concepts,
        educationalGoals: remote.educational_goals,
        copyright: remote.copyright,
        licence: remote.licence,
        difficulty: remote.difficulty,
        estimatedTime: remote.estimated_time,
        returnValue: remote.return_value,
        available: remote.available,
        content: rawContent,
      },
      create: {
        id: remote._id,
        hruid: remote.hruid,
        uuid: remote.uuid,
        version: remote.version,
        language: remote.language,
        title: remote.title,
        description: remote.description,
        contentType: contentTypeMap.get(remote.content_type),
        targetAges: remote.target_ages,
        teacherExclusive: remote.teacher_exclusive,
        skosConcepts: remote.skos_concepts,
        educationalGoals: remote.educational_goals,
        copyright: remote.copyright,
        licence: remote.licence,
        difficulty: remote.difficulty,
        estimatedTime: remote.estimated_time,
        returnValue: remote.return_value,
        available: remote.available,
        content: rawContent,
      },
      select: {
        id: true,
      },
    });

    for (const keyword of remote.keywords) {
      await prisma.learningObjectKeyword.upsert({
        where: {
          learningObjectId_keyword: {
            learningObjectId: data.id,
            keyword: keyword,
          },
        },
        update: {
          keyword: keyword,
        },
        create: {
          learningObjectId: data.id,
          keyword: keyword,
        },
      });
    }

    // Update the progress bar
    progressBar.update(index + 1);
  }

  // Stop the progress bar
  progressBar.stop();
}

async function syncLearningThemes(prisma: PrismaClient) {
  for (const theme of learningThemes) {
    await prisma.learningTheme.upsert({
      where: { id: theme.id },
      update: {
        title: theme.title,
        image: theme.image,
        keywords: theme.keywords,
      },
      create: {
        id: theme.id,
        title: theme.title,
        image: theme.image,
        keywords: theme.keywords,
      },
    });
  }
}

async function fullSyncLearningPaths(prisma: PrismaClient) {
  const remotePaths = await fetchRemoteData(API_URLS.learningPaths);

  // Initialize the progress bar
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(remotePaths.length, 0);

  for (const [index, path] of remotePaths.entries()) {
    await prisma.learningPath.upsert({
      where: {
        hruid_language: {
          hruid: path.hruid,
          language: path.language,
        },
      },
      update: {
        title: path.title,
        description: path.description,
        image: path.image,
      },
      create: {
        id: path._id,
        hruid: path.hruid,
        language: path.language,
        title: path.title,
        description: path.description,
        image: path.image,
      },
    });

    for (const [index, node] of path.nodes.entries()) {
      const learningObject = await prisma.learningObject.findUnique({
        where: {
          hruid_version_language: {
            hruid: node.learningobject_hruid,
            version: node.version,
            language: node.language,
          },
        },
        select: { id: true },
      });

      await prisma.learningPathNode.upsert({
        where: { id: node._id },
        update: {
          learningPathId: path._id,
          learningObjectId: learningObject!.id,
          instruction: node.instruction,
          index: index,
        },
        create: {
          id: node._id,
          learningPathId: path._id,
          learningObjectId: learningObject!.id,
          instruction: node.instruction,
          index: index,
        },
      });
    }
    for (const [node_index, node] of path.nodes.entries()) {
      for (const transition of node.transitions) {
        const learningObject = await prisma.learningObject.findUnique({
          where: {
            hruid_version_language: {
              hruid: transition.next.hruid,
              version: transition.next.version,
              language: transition.next.language,
            },
          },
          include: {
            learningPathNodes: true,
          },
        });

        let toNodeIndex = learningObject?.learningPathNodes.find(
          (node: any) => node.learningPathId === path._id,
        )?.index;

        if (!toNodeIndex) {
          // KANKER API geeft transitions naar nodes die niet bestaan
          // Ik los dit op door gewoon naar de volgende node te verwijzen 🤬
          toNodeIndex = node_index + 1;
        }

        await prisma.learningNodeTransition.upsert({
          where: { id: transition._id },
          update: {
            learningPathNodeId: node._id,
            toNodeIndex: toNodeIndex,
            condition: transition.default ? null : 'true==true',
          },
          create: {
            id: transition._id,
            learningPathNodeId: node._id,
            toNodeIndex: toNodeIndex!,
            condition: transition.default ? null : 'true==true',
          },
        });
      }
    }
    // Update the progress bar
    progressBar.update(index + 1);
  }
  // Stop the progress bar
  progressBar.stop();
}

async function syncDatabases(prisma: PrismaClient) {
  try {
    console.log('Starting LearningObjects synchronization...');
    await fullSyncLearningObjects(prisma);
    console.log('LearningObjects synchronization completed successfully!');

    console.log('Starting LearningPaths synchronization...');
    await fullSyncLearningPaths(prisma);
    console.log('LearningPaths synchronization completed successfully!');

    console.log('Starting LearningThemes synchronization...');
    await syncLearningThemes(prisma);
    console.log('LearningThemes synchronization completed successfully!');
  } catch (error) {
    console.error('Error syncing databases:', error);
  }
}

export { syncDatabases };
