import express, { NextFunction, Request, Response } from 'express';
import { Profile, Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';

import { UserDomain } from '../domain/user.domain';
import { UserEntity } from '../util/types/user.types';
import * as crypto from 'node:crypto';
import { AuthorizationError, BadRequestError, NotFoundError } from '../util/types/error.types';
import { RegisterParams, RegisterSchema } from '../util/types/auth.types';
import { ClassRoleEnum, AuthenticationProvider } from '../util/types/enums.types';

const userDomain = new UserDomain();
/**
 * Prevent users from registering as one role while using the endpoint for the other.
 * @param req the request being processed.
 * @returns true if the role is valid, false otherwise.
 */
function isValidRoleUrl(req: Request): boolean {
  return (
    (req.path.includes('teacher') && req.body.role === ClassRoleEnum.TEACHER) ||
    (req.path.includes('student') && req.body.role === ClassRoleEnum.STUDENT)
  );
}

/**
 * A middleware function that checks if the user is authenticated.
 *
 * If the user is authenticated, `next()` is called.
 * Otherwise, an AuthorizationError is thrown.
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }

  throw new AuthorizationError(40301);
}

/**
 * A middleware function that checks if the user is not authenticated.
 * Used to allow users to call register and login endpoints.
 *
 * If the user is not authenticated, `next()` is called.
 * Otherwise, an AuthorizationError is thrown.
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export function isNotAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isUnauthenticated()) {
    return next();
  }
  throw new AuthorizationError(40302);
}

export const router = express.Router();
const apiCallbackUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api/auth/callback/google'
    : 'https://sel2-3.ugent.be/api/auth/callback/google';

if (process.env.NODE_ENV !== 'testing') {
  passport.use(
    new GoogleStrategy(
      {
        clientID: (process.env.GOOGLE_CLIENT_ID as string) ?? '',
        clientSecret: (process.env.GOOGLE_CLIENT_SECRET as string) ?? '',
        callbackURL: apiCallbackUrl,
        passReqToCallback: true,
      },
      async (
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
      ) => {
        try {
          let user: UserEntity | null = await userDomain.getUserByEmail(profile.emails!![0].value);
          const role = req.query.state as ClassRoleEnum;
          if (user === null) {
            user = await userDomain.createUser({
              email: profile.emails!![0].value,
              name: profile.name!!.givenName,
              password: '',
              provider: AuthenticationProvider.GOOGLE,
              surname: profile.name!!.familyName,
              username: profile.displayName,
              role: role,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: true,
    },
    async (req: Request, username: string, password: string, done) => {
      try {
        const user = await userDomain.getUserByEmail(username);
        const role = req.path.includes('teacher') ? ClassRoleEnum.TEACHER : ClassRoleEnum.STUDENT;

        const provider = AuthenticationProvider.LOCAL;

        if (user === null) {
          return done(new AuthorizationError(40303));
        }

        if (crypto.createHash('sha256').update(password).digest('base64') !== user.password) {
          return done(new AuthorizationError(40303));
        }

        if (user.role !== role) {
          return done(new AuthorizationError(40303));
        }

        if (user.provider !== provider) {
          return done(new AuthorizationError(40303));
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user: UserEntity | null = await userDomain.getUserById(id);

    if (user === null) return done(new NotFoundError(40405), false);

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

/**
 * @swagger
 * /api/auth/student/login/google:
 *   get:
 *     tags:
 *      - Auth
 *     summary: Login / Register as a student through Google
 *     description: Redirects to the Google login page to login/register as a student
 *     responses:
 *       302:
 *         description: Redirect to google login page
 */
router.get(
  '/student/login/google',
  isNotAuthenticated,
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    session: true,
    state: ClassRoleEnum.STUDENT,
  }),
);

/**
 * @swagger
 * /api/auth/teacher/login/google:
 *   get:
 *     tags:
 *      - Auth
 *     summary: Login / Register as a teacher using Google
 *     description: Redirects to the Google login page to login/register as a teacher
 *     responses:
 *       302:
 *         description: Redirect to google login page
 */
router.get(
  '/teacher/login/google',
  isNotAuthenticated,
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    session: true,
    state: ClassRoleEnum.TEACHER,
  }),
);

/**
 * @swagger
 * /api/auth/student/login/local:
 *   post:
 *     tags:
 *      - Auth
 *     summary: Login as a student using local credentials
 *     description: Login as a student using username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login succesfull, received user data without password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserData'
 *       403:
 *         description: Already logged in / Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already logged in / Invalid credentials
 */
router.post(
  '/student/login/local',
  isNotAuthenticated,
  passport.authenticate('local', { session: true }),
  (req: Request, res: Response) => {
    if (!req.user) {
      // Throw an error if the credentials are invalid
      new AuthorizationError(40303);
    }

    req.login(req.user!, (err) => {
      if (err) {
        // todo: better error message?
        throw new AuthorizationError(-1);
      }

      // If login is successful, send the user data as a response
      res.status(200).json(req.user);
    });
  },
);

/**
 * @swagger
 * /api/auth/teacher/login/local:
 *   post:
 *     tags:
 *      - Auth
 *     summary: Login as a teacher using local credentials
 *     description: Login as a teacher using username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserData'
 *       403:
 *         description: Already logged in / Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already logged in / Invalid credentials
 */
router.post(
  '/teacher/login/local',
  isNotAuthenticated,
  passport.authenticate('local', { session: true }),
  (req: Request, res: Response) => {
    if (!req.user) {
      // Throw an error if the credentials are invalid
      throw new AuthorizationError(40303);
    }

    req.login(req.user!, (err) => {
      if (err) {
        // todo: better error message?
        throw new AuthorizationError(-1);
      }

      // If login is successful, send the user data as a response
      res.status(200).json(req.user);
    });
  },
);

/**
 * @swagger
 * /api/auth/student/register:
 *   put:
 *     tags:
 *      - Auth
 *     summary: Register a new student using local credentials
 *     description: Register a new student using username, password, name, surname and email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: Register succesfull, received user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserData'
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       403:
 *         description: User is already authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is already authenticated
 */
router.put(
  '/student/register',
  isNotAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isValidRoleUrl(req)) next(new BadRequestError(40013));

      const userEntity = RegisterSchema.parse(req.body);
      const user: UserEntity = await userDomain.createUser({
        ...userEntity,
        provider: AuthenticationProvider.LOCAL,
      });

      req.login(user, (err) => {
        if (err) {
          // todo: better error message?
          throw new AuthorizationError(-1);
        }

        // If login is successful, send the user data as a response
        res.status(200).json(user);
      });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /api/auth/teacher/register:
 *   put:
 *     tags:
 *      - Auth
 *     summary: Register a new student using local credentials
 *     description: Register a new student using username, password, name, surname and email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: Register succesfull, received user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserData'
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       403:
 *         description: User is already authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is already authenticated
 */
router.put(
  '/teacher/register',
  isNotAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isValidRoleUrl(req)) next(new BadRequestError(40012));

      const userEntity: RegisterParams = RegisterSchema.parse(req.body);
      const user: UserEntity = await userDomain.createUser({
        ...userEntity,
        provider: AuthenticationProvider.LOCAL,
      });

      req.login(user, (err) => {
        if (err) {
          // todo: better error message?
          throw new AuthorizationError(-1);
        }

        // If login is successful, send the user data as a response
        res.status(200).json(user);
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/callback/google',
  isNotAuthenticated,
  passport.authenticate('google'),
  (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'development') {
      res.redirect('http://localhost:5173');
    } else {
      res.redirect('https://sel2-3.ugent.be');
    }
  },
);

/**
 * @swagger
 * /api/auth/logout:
 *   delete:
 *     tags:
 *       - Auth
 *     summary: Logout the current user
 *     description: Logs out the authenticated user and destroys the session.
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       403:
 *         description: User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is not authenticated
 */
router.delete('/logout', isAuthenticated, (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    else {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.status(200).json({
          message: 'Logout successful',
        });
      });
    }
  });
});

router.delete(
  '/delete',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserEntity;
    req.logout((err) => {
      if (err) return next(err);
      else {
        req.session.destroy(() => {
          res.clearCookie('connect.sid');
        });
      }
    });
    await userDomain.deleteUser(user);
    res.status(200).json({
      message: 'Delete, successful',
    });
  },
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get the current user's data
 *     description: Returns the data of the authenticated user.
 *     responses:
 *       200:
 *         description: Authenticated, received user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserData'
 *       403:
 *         description: Unauthenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is not authenticated
 */
router.get('/me', isAuthenticated, (req: Request, res: Response) => {
  // Return the authenticated user's data
  res.json(req.user as UserEntity);
});
