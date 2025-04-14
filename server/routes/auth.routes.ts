import express, { NextFunction, Request, Response } from 'express';
import { Profile, Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';

import { UserDomain } from '../domain/user.domain';
import { AuthenticationProvider, ClassRoleEnum, UserEntity } from '../util/types/user.types';
import * as crypto from 'node:crypto';
import { AuthorizationError, BadRequestError, NotFoundError } from '../util/types/error.types';

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
        let user: UserEntity | null = await userDomain.getUserById(profile.id);
        const role = req.query.state as ClassRoleEnum;

        if (user === null) {
          user = await userDomain.createUser({
            id: profile.id,
            email: profile.emails!![0].value,
            name: profile.name!!.familyName,
            password: '',
            provider: AuthenticationProvider.GOOGLE,
            surname: profile.name!!.givenName,
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
 * /login/student/google:
 *   post:
 *     tags:
 *      - auth
 *     summary: Login as student through Google
 *     description: Login as student using Google provider
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
 * /login/teacher/google:
 *   post:
 *     tags:
 *      - auth
 *     summary: Login as teacher using Google
 *     description: Login as teacher using Google provider
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
 * /login/student/local:
 *   post:
 *     tags:
 *      - auth
 *     summary: Login as student using local credentials
 *     description: Login as student using username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 surname:
 *                   type: string
 *                 role:
 *                   type: string
 *                 provider:
 *                   type: string
 *       403:
 *         description: Already logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 * /login/teacher/local:
 *   post:
 *     tags:
 *      - auth
 *     summary: Login as teacher using local credentials
 *     description: Login as teacher using username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 surname:
 *                   type: string
 *                 role:
 *                   type: string
 *                 provider:
 *                   type: string
 *       403:
 *         description: Already logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 * /student/register:
 *   put:
 *     tags:
 *      - auth
 *     summary: Register a new student using local credentials
 *     description: Register a new student using username, password, name, surname and email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - name
 *               - surname
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *     responses:
 *       201:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 surname:
 *                   type: string
 *                 role:
 *                   type: string
 *                 provider:
 *                   type: string
 *       403:
 *         description: Already logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put(
  '/student/register',
  isNotAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isValidRoleUrl(req)) next(new BadRequestError(40013));

      const user: UserEntity = await userDomain.createUser({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        provider: AuthenticationProvider.LOCAL,
        role: ClassRoleEnum.STUDENT,
        surname: req.body.surname,
        username: req.body.username,
      });
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /teacher/register:
 *   put:
 *     tags:
 *      - auth
 *     summary: Register a new student using local credentials
 *     description: Register a new student using username, password, name, surname and email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - name
 *               - surname
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *     responses:
 *       201:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 surname:
 *                   type: string
 *                 role:
 *                   type: string
 *                 provider:
 *                   type: string
 *       403:
 *         description: Already logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put(
  '/teacher/register',
  isNotAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isValidRoleUrl(req)) next(new BadRequestError(40012));

      const user: UserEntity = await userDomain.createUser({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        provider: AuthenticationProvider.LOCAL,
        role: ClassRoleEnum.TEACHER,
        surname: req.body.surname,
        username: req.body.username,
      });

      res.json(user);
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
 * /logout:
 *   delete:
 *     tags:
 *       - auth
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
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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

/**
 * @swagger
 * /me:
 *   get:
 *     tags:
 *       - auth
 *     summary: Get the current user's data
 *     description: Returns the data of the authenticated user.
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/me', isAuthenticated, (req: Request, res: Response) => {
  // Return the authenticated user's data
  res.json(req.user as UserEntity);
});
