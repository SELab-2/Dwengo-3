import { Router, Request, Response } from 'express';
import { AssignmentSubmissionDomain } from '../domain/assignmentSubmission.domain';
import multer, { Multer } from 'multer';
import { UserDomain } from '../domain/user.domain';
import { isAuthenticated } from './auth.routes';
import path from 'path';
import { FileDownloadError, NotFoundError } from '../util/types/error.types';

export class AssignmentSubmissionController {
  public router: Router;
  private assignmentSubmissionsDomain: AssignmentSubmissionDomain;
  private upload: Multer;
  private acceptedMimeTypes: string[];
  private readonly userDomain: UserDomain;

  public constructor() {
    this.router = Router();
    this.assignmentSubmissionsDomain = new AssignmentSubmissionDomain();
    this.userDomain = new UserDomain();
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './submission_files/');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${extension}`);
      },
    });
    this.upload = multer({
      storage: storage,
      fileFilter: this.fileFilter.bind(this),
      //limits: {fileSize: 1024 * 1024} //bytes TODO add a max file size?
    });
    this.acceptedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ]; //TODO add extra MimeTypes
    this.initializeRoutes();
  }

  //TODO https://dev.to/ayanabilothman/file-type-validation-in-multer-is-not-safe-3h8l
  private fileFilter(req: any, file: Express.Multer.File, cb: any): void {
    if (this.acceptedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Expected mimiTypes: ${this.acceptedMimeTypes.toString()}`), false);
    }
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * /api/assignmentSubmission:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - AssignmentSubmission
     *     summary: Get assignmentSubmissions
     *     description: Retrieve a list of assignmentSubmissions based on filters
     *     parameters:
     *       - in: query
     *         name: groupId
     *         schema:
     *           type: string
     *         description: Filter by groupId
     *       - in: query
     *         name: favoriteId
     *         schema:
     *           type: string
     *         description: Filter by favoriteId
     *       - in: query
     *         name: nodeId
     *         schema:
     *           type: string
     *         description: Filter by nodeId
     *     responses:
     *       200:
     *         description: A list of assignmentSubmissions matching the filters.
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
     *                         $ref: '#/components/schemas/SubmissionShort'
     *       400:
     *         description: Bad request due to invalid input or no filters provided.
     *       403:
     *         description: Unauthorized, user not authenticated.
     */
    this.router.get('/', isAuthenticated, this.getAssignmentSubmission.bind(this));
    /**
     * @swagger
     * /api/assignmentsubmission/{id}:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - AssignmentSubmission
     *     summary: Get an assignmentSubmission by ID
     *     description: Gets the content of a specific assignmentSubmission selected by its UUID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the assignmentSubmission.
     *     responses:
     *       200:
     *         description: AssignmentSubmission fetched successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SubmissionDetail'
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: AssignmentSubmission not found.
     */
    this.router.get('/:id', isAuthenticated, this.getAssignmentById.bind(this));
    /**
     * @swagger
     * /api/assignmentSubmission:
     *   put:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - AssignmentSubmission
     *     summary: Create an assignment submission
     *     description: Allows a user to submit an assignment with a file upload.
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             allOf:
     *               - $ref: '#/components/schemas/SubmissionCreate'
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: The file to be uploaded as part of the submission
     *     responses:
     *       200:
     *         description: Submission successfully created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SubmissionDetail'
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.put(
      '/',
      isAuthenticated,
      this.upload.single('file'),
      this.createAssignmentSubmission.bind(this),
    );
    /**
     * @swagger
     * /api/assignmentSubmission/{id}:
     *   patch:
     *     security:
     *       - cookieAuth: []
     *     tags:
     *       - AssignmentSubmission
     *     summary: Update an assignmentSubmission
     *     description: Updates an existing assignmentSubmission with the provided data.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The unique identifier of the assignmentSubmission.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SubmissionUpdate'
     *     responses:
     *       200:
     *         description: AssignmentSubmission updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SubmissionDetail'
     *       400:
     *         description: Bad request due to invalid input.
     *       403:
     *         description: Unauthorized, user not authenticated.
     *       404:
     *         description: Announcement not found.
     */
    this.router.patch(
      '/:id',
      isAuthenticated,
      this.upload.single('file'),
      this.updateAssignmentSubmission.bind(this),
    ); //TODO change 'file' to the correct field name

    this.router.get('/:id/download', isAuthenticated, this.downloadFileSubmission.bind(this));
  }

  private async getAssignmentSubmission(req: Request, res: Response): Promise<void> {
    res.json(
      await this.assignmentSubmissionsDomain.getAssignmentSubmissions(
        req.query,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  }

  private async getAssignmentById(req: Request, res: Response): Promise<void> {
    res.json(
      await this.assignmentSubmissionsDomain.getAssignmentSubmissionById(
        req.params.id,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  }

  private async createAssignmentSubmission(req: Request, res: Response): Promise<void> {
    res.json(
      await this.assignmentSubmissionsDomain.createAssignmentSubmission(
        req,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  }

  /*curl -X PATCH localhost:3001/assignmentSubmission
     -F "file=@test.txt" 
     -F "groupId=6208ebc5-7a01-4c2c-b8cb-12d1db33d530" 
     -F "nodeId=4aa49f79-564b-4cf3-863f-421d0606e914"
     -F "submissionType=FILE"

     curl -X PATCH localhost:3001/assignmentSubmission
     -H "Content-Type: application/json" 
     -d '{
     "groupId":"6208ebc5-7a01-4c2c-b8cb-12d1db33d530", 
     "nodeId":"4aa49f79-564b-4cf3-863f-421d0606e914", 
     "submissionType":"MULTIPLE_CHOICE", 
     "submission":"1"}'*/
  private async updateAssignmentSubmission(req: Request, res: Response): Promise<void> {
    res.json(
      await this.assignmentSubmissionsDomain.updateAssignmentSubmission(
        req,
        await this.userDomain.getUserFromReq(req),
      ),
    );
  }

  private async downloadFileSubmission(req: Request, res: Response): Promise<void> {
    const filePath = await this.assignmentSubmissionsDomain.getFileSubmissionPath(
      req.params.id,
      await this.userDomain.getUserFromReq(req),
    );
    if (filePath) {
      res.download(filePath, (err) => {
        if (err) {
          throw new FileDownloadError(40400, err.message);
        }
      });
    } else {
      throw new NotFoundError(40417);
    }
  }
}
