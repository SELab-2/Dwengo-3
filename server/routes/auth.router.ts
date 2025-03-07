import express, { Request, Response, Router } from "express";
import { LoginRequest, LoginSchema } from "../util/types/RequestTypes";
import { loginUser, registerUser } from "../domain/user.domain";
import { getUserById } from "../persistence/auth/users.persistance";
import { User } from "@prisma/client";
import crypto from "crypto";
import * as http2 from "node:http2";

export const router: Router = express.Router();
const studentPrefix = "/student";
const teacherPrefix = "/teacher";

// do not return the password of the user to the client.
type UserDto = Omit<User, "password">;

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
  const user: UserDto = await registerUser(req.body);
  const cookie = generateCookie(user);
  res.cookie("DWENGO_SESSION", cookie, {
    maxAge: 6 * 60 * 60 * 1000,
    httpOnly: true,
  }); // 6 hours
  res.status(http2.constants.HTTP_STATUS_OK).send(user);
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
    res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send("Bad request");
    return;
  }

  const loginRequest = LoginSchema.safeParse(req.body);
  if (!loginRequest.success) {
    res
      .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
      .send("Bad request: " + loginRequest.error.message);
    return;
  }

  // password should not be sent to the client
  const user: UserDto = await loginUser(loginRequest.data as LoginRequest);
  const cookie = generateCookie(user);
  res.cookie("DWENGO_SESSION", cookie, {
    maxAge: 6 * 60 * 60 * 1000,
    httpOnly: true,
  }); // 6 hours
  res.status(http2.constants.HTTP_STATUS_OK).send(user);
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
  res.clearCookie("DWENGO_SESSION");
  res.status(http2.constants.HTTP_STATUS_OK).send();
}

/**
 * Generates a cookie from the given user.
 *
 * @remarks
 * The cookie will contain the user's id, followed by a question mark and a hash of the user's data.
 * The hash is created with the SHA-512 algorithm and encoded in base64.
 *
 * @param user - The user to generate the cookie from.
 * @returns The generated cookie.
 */
export function generateCookie(user: UserDto): string {
  let cookie: string = user.id + "?";
  const hash = crypto
    .createHash("sha512")
    .update(JSON.stringify(user))
    .digest("base64");
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
  if (cookie === undefined || cookie === null || cookie === "") return false;

  const [id, hash] = cookie.split("?");
  if (id === undefined || hash === undefined) return false;

  const user: UserDto | null = await getUserById(id);
  if (user === null) return false;

  const newHash = crypto
    .createHash("sha512")
    .update(JSON.stringify(user))
    .digest("base64");
  return hash === newHash;
}

// STUDENT
router.post(studentPrefix + "/login", async (req: Request, res: Response) => {
  return login(req, res);
});

/**
 * Clear the cookie from the user.
 * Cookie is checked on validity in the middleware defined in [app.ts].
 */
router.post(studentPrefix + "/logout", (req: Request, res: Response) => {
  return clearCookie(req, res);
});

router.put(studentPrefix + "/register", async (req: Request, res: Response) => {
  return register(req, res);
});

// TEACHER
router.post(teacherPrefix + "/login", async (req: Request, res: Response) => {
  return login(req, res);
});

/**
 * Clear the cookie from the user.
 * Cookie is checked on validity in the middleware defined in [app.ts].
 */
router.post(teacherPrefix + "/logout", (req: Request, res: Response) => {
  return clearCookie(req, res);
});

router.put(teacherPrefix + "/register", async (req: Request, res: Response) => {
  return register(req, res);
});
