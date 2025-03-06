import { Router, Request, Response } from "express";
import { AssignmentSubmissionDomain } from "../domain/assignmentSubmission.domain";
import multer, { Multer } from "multer";

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
            }
        })
        this.upload = multer({
            storage: storage, 
            fileFilter: this.fileFilter.bind(this),
            //limits: {fileSize: 1024 * 1024} //bytes TODO add a max file size?
        });
        this.acceptedMimeTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]; //TODO add extra MimeTypes
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
        this.router.patch('/', this.upload.single('file'), this.updateAssignmentSubmission.bind(this)); //TODO change 'file' to the correct field name
    }

    private async getAssignmentSubmission(req: Request, res: Response): Promise<void> {
        res.json(await this.assignmentSubmissionsDomain.getAssignmentSubmission(req.query));
    }

    /*curl -X PATCH localhost:3001/api/assignmentSubmission 
     -F "file=@test.txt" 
     -F "groupId=6208ebc5-7a01-4c2c-b8cb-12d1db33d530" 
     -F "nodeId=4aa49f79-564b-4cf3-863f-421d0606e914"
     -F "submissionType=FILE"

     curl -X PATCH localhost:3001/api/assignmentSubmission 
     -H "Content-Type: application/json" 
     -d '{
     "groupId":"6208ebc5-7a01-4c2c-b8cb-12d1db33d530", 
     "nodeId":"4aa49f79-564b-4cf3-863f-421d0606e914", 
     "submissionType":"MULTIPLE_CHOICE", 
     "submission":"1"}'*/
    private async updateAssignmentSubmission(req: Request, res: Response): Promise<void> {
        res.json(await this.assignmentSubmissionsDomain.updateAssignmentSubmission(req));
    }
}
