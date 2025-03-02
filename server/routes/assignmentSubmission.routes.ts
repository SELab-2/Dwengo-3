import { Router, Request, Response } from "express";
import { AssignmentSubmissionDomain } from "../domain_layer/assignmentSubmission.domain";

export class AssignmentSubmissionController {
    private router: Router;
    private assignmentSubDomain: AssignmentSubmissionDomain;

    public constructor() {
        this.router = Router();
        this.assignmentSubDomain = new AssignmentSubmissionDomain();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.getAssignmentSubmission);
        this.router.patch('/', this.assignmentSubDomain.getUpload().single('file'), this.updateAssignmentSubmission); //TODO change 'file' to the correct field name

    }

    private async getAssignmentSubmission(req: Request, res: Response): Promise<void> {
        res.json(await this.assignmentSubDomain.getAssignmentSubmission(req.query));
    }

    private async updateAssignmentSubmission(req: Request, res: Response): Promise<void> {
        res.json(await this.assignmentSubDomain.updateAssignmentSubmission(req.body));
    }

    public getRouter(): Router {
        return this.router;
    }
}
