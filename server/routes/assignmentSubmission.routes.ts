import { Router, Request, Response } from "express";
import { AssignmentSubmissionDomain } from "../domain_layer/assignmentSubmission.domain";

export class AssignmentSubmissionController {
    private router: Router;
    private assignmentSubmissionsDomain: AssignmentSubmissionDomain;

    public constructor() {
        this.router = Router();
        this.assignmentSubmissionsDomain = new AssignmentSubmissionDomain();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.getAssignmentSubmission);
        this.router.patch('/', this.assignmentSubmissionsDomain.getUpload().single('file'), this.updateAssignmentSubmission); //TODO change 'file' to the correct field name

    }

    private async getAssignmentSubmission(req: Request, res: Response): Promise<void> {
        res.json(await this.assignmentSubmissionsDomain.getAssignmentSubmission(req.query));
    }

    private async updateAssignmentSubmission(req: Request, res: Response): Promise<void> {
        res.json(await this.assignmentSubmissionsDomain.updateAssignmentSubmission(req.body));
    }

    public getRouter(): Router {
        return this.router;
    }
}
