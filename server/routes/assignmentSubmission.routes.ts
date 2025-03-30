import { Router, Request, Response } from 'express';
import { AssignmentSubmissionDomain } from '../domain/assignmentSubmission.domain';
import multer, { Multer } from 'multer';
import { getUserFromReq } from '../domain/user.domain';

export class AssignmentSubmissionController {
  public router: Router;
  private assignmentSubmissionsDomain: AssignmentSubmissionDomain;
  private upload: Multer;
  private acceptedMimeTypes: string[];

  public constructor() {
    this.router = Router();
    this.assignmentSubmissionsDomain = new AssignmentSubmissionDomain();
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './submission_files/');
      },
      filename: (req, file, cb) => {
        cb(null, Math.random().toString()); //TODO
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
    this.router.get('/', this.getAssignmentSubmission.bind(this));
    this.router.get('/:id', this.getAssignmentById.bind(this));
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
     *       400:
     *         description: Bad request due to invalid parameters
     *       401:
     *         description: Unauthorized, user not authenticated
     */
    this.router.put('/', this.upload.single('file'), this.createAssignmentSubmission.bind(this));
    this.router.patch('/', this.upload.single('file'), this.updateAssignmentSubmission.bind(this)); //TODO change 'file' to the correct field name
  }

  private async getAssignmentSubmission(req: Request, res: Response): Promise<void> {
    res.json(
      await this.assignmentSubmissionsDomain.getAssignmentSubmissions(
        req.query,
        await getUserFromReq(req),
      ),
    );
  }

  private async getAssignmentById(req: Request, res: Response): Promise<void> {
    res.json(
      await this.assignmentSubmissionsDomain.getAssignmentSubmissionById(
        req.params.id,
        await getUserFromReq(req),
      ),
    );
  }

  private async createAssignmentSubmission(req: Request, res: Response): Promise<void> {
    res.json(
      await this.assignmentSubmissionsDomain.createAssignmentSubmission(
        req,
        await getUserFromReq(req),
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
        await getUserFromReq(req),
      ),
    );
  }
}
