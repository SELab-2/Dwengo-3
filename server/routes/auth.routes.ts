import express, { Express, NextFunction, Request, Response } from 'express';
import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';

import * as userDomain from '../domain/user.domain';
import {
  AuthenticationProvider,
  ClassRoleEnum,
  UserEntity,
} from '../util/types/user.types';
import * as crypto from 'node:crypto';

function isValidRoleUrl(path: string): boolean {
  return path.includes('teacher') || path.includes('student');
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
        const role = req.path.includes('teacher')
          ? ClassRoleEnum.TEACHER
          : ClassRoleEnum.STUDENT;

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
        const role = req.path.includes('teacher')
          ? ClassRoleEnum.TEACHER
          : ClassRoleEnum.STUDENT;

        const provider = AuthenticationProvider.LOCAL;
        console.debug(user);

        if (user === null) {
          return done(null, false, { message: 'incorrect login credentials' });
        }

        if (
          crypto.createHash('sha256').update(password).digest('base64') !==
          user.password
        ) {
          return done(null, false, { message: 'incorrect login credentials' });
        }

        if (user.role !== role) {
          return done(null, false, { message: 'incorrect login credentials' });
        }

        if (user.provider !== provider) {
          return done(null, false, { message: 'incorrect login credentials' });
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
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    session: true,
  }),
);
router.get(
  '/teacher/login/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    session: true,
  }),
);

router.post(
  '/student/login/local',
  passport.authenticate('local', { session: true }),
  (req: Request, res: Response) => {
    res.status(200).json(req.user);
  },
);

router.post(
  '/teacher/login/local',
  passport.authenticate('local', { session: true }),
  (req: Request, res: Response) => {
    res.status(200).json(req.user);
  },
);

router.put('/student/register', async (req: Request, res: Response) => {
  try {
    if (!isValidRoleUrl(req.path))
      res.status(400).json({ message: 'Invalid url' });

    const role = req.path.includes('teacher')
      ? ClassRoleEnum.TEACHER
      : ClassRoleEnum.STUDENT;

    const user: UserEntity = await userDomain.createUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      provider: AuthenticationProvider.LOCAL,
      role: role,
      surname: req.body.surname,
      username: req.body.username,
    });
    res.json(user);
  } catch (error) {
    res.status(400);
  }
});

router.get(
  '/callback/google',
  (req: Request, res: Response, next: NextFunction) => {
    // something wrong here... see gpt
    passport.authenticate('google')(req, res, next);
  },
  (req: Request, res: Response) => {
    res.status(200).json(req.user);
  },
);

router.delete(
  '/logout',
  (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => next(err));
  },
  (req: Request, res: Response) => {
    res.clearCookie('connect.sid', { maxAge: 0 });
    res.status(200).json({ message: 'Logout successful' });
  },
);
