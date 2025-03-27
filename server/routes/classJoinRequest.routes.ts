import { Request, Response, Router } from 'express';
import { ClassJoinRequestDomain } from '../domain/classJoinRequest.domain';
import { getUserFromReq } from '../domain/user.domain';

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
      await this.classJoinRequestDomain.createClassJoinRequest(req.body, await getUserFromReq(req)),
    );
  };

  private getJoinRequests = async (req: Request, res: Response) => {
    res.json(
      await this.classJoinRequestDomain.getJoinRequests(req.query, await getUserFromReq(req)),
    );
  };

  private handleJoinRequest = async (req: Request, res: Response) => {
    res.json(
      await this.classJoinRequestDomain.handleJoinRequest(req.body, await getUserFromReq(req)),
    );
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /api/class/studentRequest:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - ClassJoinRequest
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
     */
    this.router.put('/studentRequest', this.createJoinRequest);
    /**
     * @swagger
     * /api/class/teacherRequest:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - ClassJoinRequest
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
     */
    this.router.put('/teacherRequest', this.createJoinRequest);
    /**
     * @swagger
     * /api/class/studentRequest:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - ClassJoinRequest
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
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/PaginatedResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/ClassJoinRequestDetail'
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.get('/studentRequest', this.getJoinRequests);
    /**
     * @swagger
     * /api/class/teacherRequest:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - ClassJoinRequest
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
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/PaginatedResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/ClassJoinRequestDetail'
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.get('/teacherRequest', this.getJoinRequests);
    /**
     * @swagger
     * /api/class/studentRequest:
     *   post:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - ClassJoinRequest
     *     summary: Accept or deny a class join request from a student
     *     description: Accept or deny a class join request coming from a student.
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
     */
    this.router.post('/studentRequest', this.handleJoinRequest);
    /**
     * @swagger
     * /api/class/teacherRequest:
     *   post:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - ClassJoinRequest
     *     summary: Accept or deny a class join request from a teacher
     *     description: Accept or deny a class join request coming from a teacher.
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
     */
    this.router.post('/teacherRequest', this.handleJoinRequest);
  }
}
