import { Router, Request, Response } from "express";
import { AssignmentSubmissionDomain } from "../domain/assignmentSubmission.domain";

export class AssignmentSubmissionController {
    private router: Router;
    private assignmentSubmissionsDomain: AssignmentSubmissionDomain;

    public constructor() {
        this.router = Router();
        this.assignmentSubmissionsDomain = new AssignmentSubmissionDomain();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.getAssignmentSubmission.bind(this));
        this.router.patch('/', this.assignmentSubmissionsDomain.getUpload().single('file'), this.updateAssignmentSubmission.bind(this)); //TODO change 'file' to the correct field name

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

    public getRouter(): Router {
        return this.router;
    }
}
