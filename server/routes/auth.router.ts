import express, { Request, Response, Router } from 'express';
import { LoginRequest, LoginSchema } from '../util/types/RequestTypes';
import { loginUser, registerUser } from '../domain/user.domain';
import { getUserById } from '../persistence/auth/users.persistance';
import { User } from '@prisma/client';
import crypto from 'crypto';
import * as http2 from 'node:http2';
import { UserDto, UserEntity } from '../util/types/user.types';

export const router: Router = express.Router();
const studentPrefix = '/student';
const teacherPrefix = '/teacher';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints for user login, registration, and logout
 */

/**
 * Handles a register request.
 *
 * @remarks
 * The request body should contain the username, email, password, name and surname of the user.
 * The response will contain the user object without the password.
 * A cookie will be set with the user id.
 * Errors will be sent as a 400 or 500 status code.
 *
 * @param req - The request.
 * @param res - The response.
 */
async function register(req: Request, res: Response): Promise<void> {
  const user: UserEntity = await registerUser(req.body);
  const cookie = generateCookie(user.id, user.email, user.password);
  res.cookie('DWENGO_SESSION', cookie, {
    maxAge: 6 * 60 * 60 * 1000,
    httpOnly: true,
  }); // 6 hours
  res.status(http2.constants.HTTP_STATUS_OK).send({
    id: user.id,
    email: user.email,
    username: user.username,
    surname: user.surname,
    name: user.name,
    role: user.role,
    student: user.student,
    teacher: user.teacher,
  } as UserDto);
}

/**
 * Handles a login request.
 *
 * @remarks
 * The request body should contain the email and password of the user.
 * The response will contain the user object without the password.
 * A cookie will be set with the user id.
 * Errors will be sent as a 400 or 500 status code.
 *
 * @param req - The request.
 * @param res - The response.
 */
async function login(req: Request, res: Response): Promise<void> {
  if (req.body === null || req.body === undefined) {
    res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send('Bad request');
    return;
  }

  const loginRequest = LoginSchema.safeParse(req.body);
  if (!loginRequest.success) {
    res
      .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
      .send('Bad request: ' + loginRequest.error.message);
    return;
  }

  // password should not be sent to the client
  const user: UserEntity = await loginUser(loginRequest.data as LoginRequest);
  const cookie = generateCookie(user.id, user.email, user.password);
  res.cookie('DWENGO_SESSION', cookie, {
    maxAge: 6 * 60 * 60 * 1000,
    httpOnly: true,
  }); // 6 hours
  res.status(http2.constants.HTTP_STATUS_OK).send({
    id: user.id,
    email: user.email,
    username: user.username,
    surname: user.surname,
    name: user.name,
    role: user.role,
    student: user.student,
    teacher: user.teacher,
  } as UserDto);
}

/**
 * Handles a logout request.
 *
 * @remarks
 * The response will contain an empty response with a 200 status code.
 * The cookie with the user id will be cleared.
 * Errors will be sent as a 500 status code.
 *
 * @param req - The request.
 * @param res - The response.
 */
async function clearCookie(req: Request, res: Response): Promise<void> {
  res.clearCookie('DWENGO_SESSION');
  res.status(http2.constants.HTTP_STATUS_OK).send();
}

/**
 * Generates a cookie from the given user.
 *
 * @remarks
 * The cookie will contain the user's id, followed by a question mark and a hash of the user's data.
 * The hash is created with the SHA-512 algorithm and encoded in base64.
 *
 * @returns The generated cookie.
 * @param userId the id of the user to generate a cookie for.
 * @param email the email of the user, used in the hash
 * @param password the password of the user, used in the hash
 */
export function generateCookie(
  userId: string,
  email: string,
  password: string,
): string {
  const cookie: string = userId + '?';
  const hash = crypto
    .createHash('sha512')
    .update(userId + email + password)
    .digest('base64');
  console.log(cookie + hash);
  return cookie + hash;
}

/**
 * Verifies the given cookie.
 *
 * @remarks
 * The cookie is verified by checking if it matches the hash of the user's data.
 * If the cookie is invalid, the function will return false.
 *
 * @param cookie - The cookie to verify.
 * @returns True if the cookie is valid, false otherwise.
 */
export async function verifyCookie(cookie: string): Promise<boolean> {
  if (cookie === undefined || cookie === null || cookie === '') return false;

  const [id, hash] = cookie.split('?');
  if (id === undefined || hash === undefined) return false;

  // todo: cleanup in backend rewrite/cleanup
  const user: User | null = await getUserById(id);
  if (user === null) return false;

  const string = user.id + user.email + user.password;

  const newHash = crypto.createHash('sha512').update(string).digest('base64');
  return hash.trim() === newHash.trim();
}

// STUDENT
/**
 * @swagger
 * /api/auth/student/login:
 *   post:
 *     tags: [Auth]
 *     summary: Student login
 *     description: Logs in a student and sets a session cookie upon successful authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login, returns user data (excluding password) and sets a session cookie.
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
 *                 surname:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *         headers:
 *           Set-Cookie:
 *             description: The session cookie containing user session information.
 *             schema:
 *               type: string
 *               example: "DWENGO_SESSION=someunreadablesessionid"
 *       500:
 *         description: Server error
 *     cookies:
 *       DWENGO_SESSION:
 *         description: A session cookie with the user ID and hash of the user data, set upon successful login.
 *         type: string
 */
router.post(studentPrefix + '/login', async (req: Request, res: Response) => {
  return login(req, res);
});

/**
 * @swagger
 * /api/auth/student/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Log out a student
 *     description: Clears the session cookie and logs out the student.
 *     responses:
 *       200:
 *         description: Successful logout. The session cookie is cleared.
 *         headers:
 *           Set-Cookie:
 *             description: The session cookie is cleared.
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post(studentPrefix + '/logout', (req: Request, res: Response) => {
  return clearCookie(req, res);
});

/**
 * @swagger
 * /api/auth/student/register:
 *   put:
 *     tags: [Auth]
 *     summary: Registers a new student and sets session cookie on successful registration.
 *     description: Registers a new student and sets a session cookie upon successful registration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "username"
 *               email:
 *                 type: string
 *                 example: "student@example.com"
 *               password:
 *                 type: string
 *                 example: "password"
 *               surname:
 *                 type: string
 *                 example: "surname"
 *               name:
 *                 type: string
 *                 example: "name"
 *               role:
 *                 type: string
 *                 example: "STUDENT"
 *     responses:
 *       200:
 *         description: Successful registration, returns user data (excluding password) and sets a session cookie.
 *         headers:
 *           Set-Cookie:
 *             description: The session cookie containing user session information.
 *             schema:
 *               type: string
 *             example: "DWENGO_SESSION=someunreadablesessionid"
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
 *                 surname:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                   example: "STUDENT"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.put(studentPrefix + '/register', async (req: Request, res: Response) => {
  return register(req, res);
});

/**
 * @swagger
 * /api/auth/teacher/login:
 *   post:
 *     tags: [Auth]
 *     summary: Teacher login
 *     description: Logs in a teacher and sets a session cookie upon successful authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "teacher@example.com"  # <-- FIXED INDENTATION
 *               password:
 *                 type: string
 *                 example: "password"  # <-- FIXED INDENTATION
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login, returns user data (excluding password) and sets a session cookie.
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
 *                 surname:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *         headers:
 *           Set-Cookie:
 *             description: The session cookie containing user session information.
 *             schema:
 *               type: string
 *               example: "DWENGO_SESSION=someunreadablesessionid"
 *       500:
 *         description: Server error
 *     cookies:
 *       DWENGO_SESSION:
 *         description: A session cookie with the user ID and hash of the user data, set upon successful login.
 *         type: string
 */
router.post(teacherPrefix + '/login', async (req: Request, res: Response) => {
  return login(req, res);
});

/**
 * @swagger
 * /api/auth/teacher/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Log out a teacher
 *     description: Clears the session cookie and logs out the teacher.
 *     responses:
 *       200:
 *         description: Successful logout. The session cookie is cleared.
 *         headers:
 *           Set-Cookie:
 *             description: The session cookie is cleared.
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post(teacherPrefix + '/logout', (req: Request, res: Response) => {
  return clearCookie(req, res);
});

/**
 * @swagger
 * /api/auth/teacher/register:
 *   put:
 *     tags: [Auth]
 *     summary: Registers a new teacher and sets session cookie on successful registration.
 *     description: Registers a new teacher and sets a session cookie upon successful registration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "username"
 *               email:
 *                 type: string
 *                 example: "teacher@example.com"
 *               password:
 *                 type: string
 *                 example: "password"
 *               surname:
 *                 type: string
 *                 example: "surname"
 *               name:
 *                 type: string
 *                 example: "name"
 *               role:
 *                 type: string
 *                 example: "TEACHER"
 *     responses:
 *       200:
 *         description: Successful registration, returns user data (excluding password) and sets a session cookie.
 *         headers:
 *           Set-Cookie:
 *             description: The session cookie containing user session information.
 *             schema:
 *               type: string
 *             example: "DWENGO_SESSION=someunreadablesessionid"
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
 *                 surname:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                   example: "TEACHER"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.put(teacherPrefix + '/register', async (req: Request, res: Response) => {
  return register(req, res);
});
