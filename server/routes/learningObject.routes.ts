import { Request, Response, Router } from "express";
import { LearningObjectDomain } from "../domain/learningObject.domain";
import { getUserFromReq } from "../domain/user.domain";

export class LearningObjectController {
  public router: Router;
  private learningObjectDomain: LearningObjectDomain;

  constructor() {
    this.router = Router();
    this.learningObjectDomain = new LearningObjectDomain();
    this.initializeRoutes();
  }

  private createLearningObject = async (req: Request, res: Response) => {
    res.json(
      await this.learningObjectDomain.createLearningObject(
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private getLearningObjects = async (req: Request, res: Response) => {
    res.json(await this.learningObjectDomain.getLearningObjects(req.query));
  };

  private updateLearningObject = async (req: Request, res: Response) => {
    res.json(
      await this.learningObjectDomain.updateLearningObject(
        req.params.id,
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private deleteLearningObject = async (req: Request, res: Response) => {
    res.json(
      await this.learningObjectDomain.deleteLearningObject(
        req.params.id,
        await getUserFromReq(req),
      ),
    );
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /api/learningObject:
     *   post:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningObject
     *     summary: Create a new learning object
     *     description: Creates a new learning object with the provided data.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LearningObjectCreate'
     *     responses:
     *       201:
     *         description: Learning object created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LearningObjectGet'
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       500:
     *         description: Internal server error.
     */
    this.router.post("/", this.createLearningObject);
    /**
     * @swagger
     * /api/learningObject:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningObject
     *     summary: Get learning objects
     *     description: Retrieve a list of learning objects based on the provided filters.
     *     parameters:
     *       - in: query
     *         name: keywords
     *         schema:
     *           type: array
     *           items:
     *             type: string
     *         description: Keywords to filter learning objects by.
     *       - in: query
     *         name: targetAges
     *         schema:
     *           type: array
     *           items:
     *             type: integer
     *         description: Target age groups to filter learning objects by.
     *       - in: query
     *         name: id
     *         schema:
     *           type: string
     *         description: The unique identifier of the learning object to filter by.
     *     responses:
     *       200:
     *         description: A list of learning objects matching the filters.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/LearningObjectGet'
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       500:
     *         description: Internal server error.
     */
    this.router.get("/", this.getLearningObjects);
    /**
     * @swagger
     * /api/learningObject/{id}:
     *   patch:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningObject
     *     summary: Update a learning object
     *     description: Update an existing learning object with the provided data.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the learning object to delete.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LearningObjectUpdate'
     *     responses:
     *       200:
     *         description: Learning object updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LearningObjectGet'
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       500:
     *         description: Internal server error.
     */
    this.router.patch("/:id", this.updateLearningObject);
    /**
     * @swagger
     * /api/learningObject/{id}:
     *   delete:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - LearningObject
     *     summary: Delete a learning object
     *     description: Deletes a specific learning object by its unique identifier.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the learning object to delete.
     *     responses:
     *       204:
     *         description: Learning object deleted successfully.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Learning object not found.
     *       500:
     *         description: Internal server error.
     */
    this.router.delete("/:id", this.deleteLearningObject);
  }
}
