import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { router as auth } from './routes/auth.routes';
import express, { Express, NextFunction, Request, Response } from 'express';
import { ClassController } from './routes/class.routes';
import { ZodError } from 'zod';
import { LearningPathController } from './routes/learningPath.routes';
import { LearningPathNodeController } from './routes/learningPathNode.routes';
import { LearningPathNodeTransitionController } from './routes/learningPathNodeTransition.routes';
import { DiscussionController } from './routes/discussion.routes';
import { MessageController } from './routes/message.routes';
import { AnnouncementController } from './routes/announcement.routes';
import { LearningObjectController } from './routes/learningObject.routes';
import { AssignmentController } from './routes/assignment.routes';
import { AssignmentSubmissionController } from './routes/assignmentSubmission.routes';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import swaggerJsdoc from 'swagger-jsdoc';
import { StudentController } from './routes/student.routes';
import { TeacherController } from './routes/teacher.routes';
import passport from 'passport';

export const app: Express = express();
const port = 3001;

const options = {
  swaggerDefinition: swaggerDocument, // Use the imported JSON configuration
  apis: ['./routes/*.ts'], // Specify where to find the JSDoc comments
};

const specs = swaggerJsdoc(options);
if (process.env.NODE_ENV === 'development') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
} else {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
}

app.use(passport.initialize());
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // TODO: Maybe make some error logging mechanism?
  console.error('[ERROR]', err);

  // If the error is a ZodError, it means that the request did not pass the validation
  const statusCode = err instanceof ZodError ? 400 : 500;

  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).send('Something broke!');
  } else {
    res.status(statusCode).json({
      message: err.message || 'Internal Server Error',
      stack: err.stack,
    });
  }
});

const apiRouter = express.Router();
if (process.env.NODE_ENV === 'development') {
  app.use('/api', apiRouter);
} else {
  app.use('/', apiRouter);
}

apiRouter.use('/student', new StudentController().router);
apiRouter.use('/teacher', new TeacherController().router);

apiRouter.use('/class', new ClassController().router);
apiRouter.use('/learningPath', new LearningPathController().router);
apiRouter.use('/learningPathNode', new LearningPathNodeController().router);
apiRouter.use(
  '/learningPathNodeTransition',
  new LearningPathNodeTransitionController().router,
);
apiRouter.use('/learningObject', new LearningObjectController().router);
apiRouter.use('/announcement', new AnnouncementController().router);
apiRouter.use('/assignment', new AssignmentController().router);
apiRouter.use(
  '/assignmentSubmission',
  new AssignmentSubmissionController().router,
);

apiRouter.use('/auth', auth);
apiRouter.use('/discussion', new DiscussionController().router);
apiRouter.use('/message', new MessageController().router);

app.listen(port, () => {
  console.log(`[SERVER] - listening on http://localhost:${port}`);
});
