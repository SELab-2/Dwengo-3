import { Router, Response, Request } from 'express';
import { AssignmentDomain } from '../domain/assignment.domain';

export class AssignmentController {
    public router: Router;
    private assignmentDomain: AssignmentDomain;

    public constructor() {
        this.router = Router();
        this.assignmentDomain = new AssignmentDomain();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.getAssignments.bind(this));
        this.router.post('/', this.createAssignment.bind(this));
    }

    private async getAssignments(req: Request, res: Response): Promise<void> {
        res.json(await this.assignmentDomain.getAssignments(req.query));
    }

    private async createAssignment(req: Request, res: Response): Promise<void> {
        res.json(await this.assignmentDomain.createAssigment(req.body));
    }
}