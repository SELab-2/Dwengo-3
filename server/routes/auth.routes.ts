import express, { Express, NextFunction, Request, Response } from 'express';
import { Profile, Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';

import { UserDomain } from '../domain/user.domain';
import { AuthenticationProvider, ClassRoleEnum, UserEntity } from '../util/types/user.types';
import * as crypto from 'node:crypto';
import { AuthorizationError, BadRequestError } from '../util/types/error.types';

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
 * Otherwise, an error is thrown.
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }

  throw new AuthorizationError(-1, 'User is not authenticated');
}

/**
 * A middleware function that checks if the user is not authenticated.
 * Used to allow users to call register and login endpoints.
 *
 * If the user is not authenticated, `next()` is called.
 * Otherwise, an error is thrown.
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export function isNotAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isUnauthenticated()) {
    return next();
  }
  throw new AuthorizationError(-1, 'User is already authenticated');
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
        const role = req.path.includes('teacher') ? ClassRoleEnum.TEACHER : ClassRoleEnum.STUDENT;

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
          return done(new AuthorizationError(-1, 'Invalid credentials'));
        }

        if (crypto.createHash('sha256').update(password).digest('base64') !== user.password) {
          return done(new AuthorizationError(-1, 'Invalid credentials'));
        }

        if (user.role !== role) {
          return done(new AuthorizationError(-1, 'Invalid credentials'));
        }

        if (user.provider !== provider) {
          return done(new AuthorizationError(-1, 'Invalid credentials'));
        }

        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user: UserEntity | null = await userDomain.getUserById(id);

    // todo: change to error types
    if (user === null) return new Error('User not found');

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

router.get(
  '/student/login/google',
  isNotAuthenticated,
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    session: true,
  }),
);

router.get(
  '/teacher/login/google',
  isNotAuthenticated,
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    session: true,
  }),
);

router.post(
  '/student/login/local',
  isNotAuthenticated,
  passport.authenticate('local', { session: true }),
  (req: Request, res: Response) => {
    res.status(200).json(req.user);
  },
);

router.post(
  '/teacher/login/local',
  isNotAuthenticated,
  passport.authenticate('local', { session: true }),
  (req: Request, res: Response) => {
    res.status(200).json(req.user);
  },
);

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
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google')(req, res, next);
  },
  (req: Request, res: Response) => {
    res.status(200).json(req.user);
  },
);

router.delete(
  '/logout',
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => next(err));
  },
  (req: Request, res: Response) => {
    res.clearCookie('connect.sid', { maxAge: 0 });
    res.status(200).json({ message: 'Logout successful' });
  },
);
