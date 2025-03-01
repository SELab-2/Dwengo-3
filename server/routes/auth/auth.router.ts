import express, {Request, Response, Router} from "express";
import {LoginRequest, LoginSchema} from "./RequestTypes";
import {loginUser, registerUser} from "../../domain_layer/auth/auth.domain";
import {User} from "@prisma/client";
import crypto from "crypto";

export const router: Router = express.Router();
const studentPrefix = "/student";
const teacherPrefix = "/teacher";

type UserDto = Omit<User, "password">;

function generateCookie(user: UserDto): string {
    let cookie: string = user.id + "?";
    const hash = crypto.createHash("sha512").update(JSON.stringify(user)).digest("base64");
    return cookie + hash;
}


// STUDENT
router.post(studentPrefix + "/login", async (req: Request, res: Response) => {
    if (req.body === null || req.body === undefined) {
        res.status(400).send("Bad request");
        return;
    }

    try {
        const loginRequest = LoginSchema.safeParse(req.body);
        if (!loginRequest.success) {
            res.status(400).send("Bad request: " + loginRequest.error.message);
            return;
        }

        // password should not be sent to the client
        const user: UserDto = await loginUser(loginRequest.data as LoginRequest);
        const cookie = generateCookie(user);
        res.cookie("DWENGO_SESSION", cookie, {maxAge: 6 * 60 * 60 * 1000, httpOnly: true}); // 6 hours
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send("Internal server error"); // todo: may need better error handling
    }
});

router.post(studentPrefix + "/logout", (req: Request, res: Response) => {
    // todo check if user exists
    res.status(200).cookie("DWENGO_SESSION", "", {maxAge: 0}).send();
});

router.put(studentPrefix + "/register", async (req: Request, res: Response) => {
    console.log(req.body);
    const user: UserDto = await registerUser(req.body);
    const cookie = generateCookie(user);
    res.cookie("DWENGO_SESSION", cookie, {maxAge: 6 * 60 * 60 * 1000, httpOnly: true}); // 6 hours
    res.status(200).send(user);
});