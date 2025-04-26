import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { router as auth } from './routes/auth.routes';
import express, { Express, NextFunction, Request, Response } from 'express';
import { ClassController } from './routes/class.routes';
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
import session from 'express-session';
import { errorHandling } from './errorHandling';
import cors from 'cors';
import { FavoritesController } from './routes/favorites.routes';
import { OutgoingHttpHeader, OutgoingHttpHeaders } from 'node:http';

export const app: Express = express();
const port = 3001;

// Allow requests from frontend
// TODO: change this for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3001',
  'https://sel2-3.ugent.be',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from the allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

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

if (process.env.SESSION_SECRET === undefined) {
  throw new Error('Secret for cookies not present');
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 1000 * 60 * 60 * 5, // 5 hours
      path: '/',
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// todo: i am leaving it here as this is handy to debug some responses from express to the client
// app.use(function(req, res, next) {
//   res.on('finish', () => {
//     console.log(`request url = ${req.originalUrl}`);
//     console.log(res.getHeaders());
//   });
//   next();
// });

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
apiRouter.use('/learningPathNodeTransition', new LearningPathNodeTransitionController().router);
apiRouter.use('/learningObject', new LearningObjectController().router);
apiRouter.use('/announcement', new AnnouncementController().router);
apiRouter.use('/assignment', new AssignmentController().router);
apiRouter.use('/assignmentSubmission', new AssignmentSubmissionController().router);

apiRouter.use('/auth', auth);
apiRouter.use('/discussion', new DiscussionController().router);
apiRouter.use('/message', new MessageController().router);
apiRouter.use('/favorites', new FavoritesController().router);

// Error handling middleware
app.use(errorHandling);

app.listen(port, () => {
  console.log(`[SERVER] - listening on http://localhost:${port}`);
});
