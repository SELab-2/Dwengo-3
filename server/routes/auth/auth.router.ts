import express, {Request, Response, Router} from "express";
import {LoginRequest, Role} from "./RequestTypes";

const router: Router = express.Router();
const studentPrefix = "/api/auth/student";
const teacherPrefix = "/api/auth/teacher";


// STUDENT
router.post(studentPrefix + "/login", (req: Request, res: Response) => {
    const payload: LoginRequest = req.body as LoginRequest;

});

router.post(studentPrefix + "/logout", (req: Request, res: Response) => {

});