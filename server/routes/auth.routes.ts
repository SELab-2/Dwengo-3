import express, { NextFunction, Request, Response } from 'express';
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

export const router = express.Router();
const apiCallbackUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api/auth/callback/google'
    : 'https://sel2-3.ugent.be/api/auth/callback/google';
const providerMapper = {
  [AuthenticationProvider.GOOGLE]: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return passport.authenticate('google', {
      scope: ['email', 'profile'],
      session: true,
    })(req, res, next);
  },
  [AuthenticationProvider.LOCAL]: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return passport.authenticate('local', {
      session: true,
    })(req, res, next);
  },
};

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
    async (req: Request, email: string, password: string, done) => {
      try {
        const user = await userDomain.getUserByEmail(email);
        const role = req.path.includes('teacher')
          ? ClassRoleEnum.TEACHER
          : ClassRoleEnum.STUDENT;
        const provider = req.query.provider as AuthenticationProvider;
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
        return done(error);
      }
    },
  ),
);

function login(req: Request, res: Response, next: NextFunction) {
  const provider = req.query.provider;
  if (provider === undefined || provider === null)
    throw new Error('Provider not found');

  const providerEnum =
    provider === 'google'
      ? AuthenticationProvider.GOOGLE
      : AuthenticationProvider.LOCAL;

  return providerMapper[providerEnum](req, res, next);
}

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userDomain.getUserById(id);

    // todo: change to error types
    if (user === null) return new Error('User not found');

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

router.get(
  '/student/login',
  (req: Request, res: Response, next: NextFunction) => login(req, res, next),
);
router.get(
  '/teacher/login',
  (req: Request, res: Response, next: NextFunction) => login(req, res, next),
);

router.put('/student/register', async (req: Request, res: Response) => {
  try {
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
  '/callback/:provider',
  (req: Request, res: Response, next: NextFunction) => {
    console.log('OAuth Callback Hit:', req.params.provider);
    console.log('Query Params:', req.query);
    console.log('Session:', req.session);

    const provider = req.params.provider;
    if (provider === '' || (provider !== 'google' && provider !== 'local'))
      throw new Error('Unsupported provider');

    console.log('provider:', provider);

    // something wrong here... see gpt
    passport.authenticate(provider)(req, res, next);
  },
  (req: Request, res: Response) => {
    res.status(200).json(req.user);
  },
);
