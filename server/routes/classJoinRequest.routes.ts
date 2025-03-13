import { Request, Response, Router } from "express";
import { ClassJoinRequestDomain } from "../domain/classJoinRequest.domain";
import { getUserFromReq } from "../domain/user.domain";

export class ClassJoinRequestController {
  public router: Router;
  private classJoinRequestDomain: ClassJoinRequestDomain;

  constructor() {
    this.router = Router();
    this.classJoinRequestDomain = new ClassJoinRequestDomain();
    this.initializeRoutes();
  }

  private createJoinRequest = async (req: Request, res: Response) => {
    res.json(
      await this.classJoinRequestDomain.createClassJoinRequest(
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private getJoinRequests = async (req: Request, res: Response) => {
    res.json(
      await this.classJoinRequestDomain.getJoinRequests(
        req.query,
        await getUserFromReq(req),
      ),
    );
  };

  private handleJoinRequest = async (req: Request, res: Response) => {
    res.json(
      await this.classJoinRequestDomain.handleJoinRequest(
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /class/studentRequest:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - classJoinRequest
     *     summary: Create a new class join request as a student
     *     description: Creates a new class join request with the provided data.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ClassJoinRequestCreate'
     *     responses:
     *       200:
     *         description: Class join request created successfully.
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       500:
     *         description: Internal server error.
     */
    this.router.put("/studentRequest", this.createJoinRequest);
    /**
     * @swagger
     * /class/teacherRequest:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - classJoinRequest
     *     summary: Create a new class join request as a teacher
     *     description: Creates a new class join request with the provided data.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ClassJoinRequestCreate'
     *     responses:
     *       200:
     *         description: Class join request created successfully.
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       500:
     *         description: Internal server error.
     */
    this.router.put("/teacherRequest", this.createJoinRequest);
    /**
     * @swagger
     * /class/studentRequest:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - classJoinRequest
     *     summary: Get all student class join requests
     *     description: Get all class join requests where the user who is trying to join is a student.
     *     parameters:
     *       - in: query
     *         name: classId
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *           description: The ID of the class to filter by. Must be a valid UUID.
     *           example: "e5c03d9c-d123-4a34-b88c-ff33f222b0f9"
     *       - in: query
     *         name: userId
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *           description: The ID of the user to filter by. Must be a valid UUID.
     *           example: "f1b024f9-b7a4-497b-b7d3-d9ef5e8e98c9"
     *     responses:
     *       200:
     *         description: Class join requests fetched successfully.
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       500:
     *         description: Internal server error.
     */
    this.router.get("/studentRequest", this.getJoinRequests);
    /**
     * @swagger
     * /class/teacherRequest:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - classJoinRequest
     *     summary: Get all teacher class join requests
     *     description: Get all class join requests where the user who is trying to join is a teacher.
     *     parameters:
     *       - in: query
     *         name: classId
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *           description: The ID of the class to filter by. Must be a valid UUID.
     *           example: "e5c03d9c-d123-4a34-b88c-ff33f222b0f9"
     *       - in: query
     *         name: userId
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *           description: The ID of the user to filter by. Must be a valid UUID.
     *           example: "f1b024f9-b7a4-497b-b7d3-d9ef5e8e98c9"
     *     responses:
     *       200:
     *         description: Class join requests fetched successfully.
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       500:
     *         description: Internal server error.
     */
    this.router.get("/teacherRequest", this.getJoinRequests);
    /**
     * @swagger
     * /class/studentRequest:
     *   post:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - classJoinRequest
     *     summary: Accept or deny a class join request from a student
     *     description: Accept or deny a class join request coming from an user who is a student.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ClassJoinRequestPost'
     *     responses:
     *       200:
     *         description: Class join request accepted/denied successfully.
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       500:
     *         description: Internal server error.
     */
    this.router.post("/studentRequest", this.handleJoinRequest);
    /**
     * @swagger
     * /class/teacherRequest:
     *   post:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - classJoinRequest
     *     summary: Accept or deny a class join request from a teacher
     *     description: Accept or deny a class join request coming from an user who is a teacher.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ClassJoinRequestPost'
     *     responses:
     *       200:
     *         description: Class join request accepted/denied successfully.
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       500:
     *         description: Internal server error.
     */
    this.router.post("/teacherRequest", this.handleJoinRequest);
  }
}
