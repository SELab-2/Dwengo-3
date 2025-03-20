import express, { Request, Response } from 'express';
import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import passport from 'passport';

import * as userDomain from '../domain/user.domain';
import {
  AuthenticationProvider,
  ClassRoleEnum,
  UserDto,
  UserEntity,
} from '../util/types/user.types';

export const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: (process.env.GOOGLE_CLIENT_ID as string) ?? '',
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET as string) ?? '',
      callbackURL: 'http://localhost:3001/auth/callback/google',
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      console.debug(req.path);
      try {
        let user = await userDomain.getUserById(profile.id);
        const role = req.path.includes('teacher')
          ? ClassRoleEnum.TEACHER
          : ClassRoleEnum.STUDENT;

        if (user === null) {
          user = await userDomain.registerUser({
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
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userDomain.getUserById(id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

router.get(
  '/student/login',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);
router.get(
  '/teacher/login',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);

router.get(
  '/callback/:provider',
  passport.authenticate('google', { session: true }),
  (req: Request, res: Response) => {
    const provider = req.params.provider;
    if (provider === undefined) throw new Error('Provider not found');
    res.json({ user: req.user as UserDto });
  },
);
