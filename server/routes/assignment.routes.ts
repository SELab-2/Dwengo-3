import { Router, Response, Request } from 'express';
import { AssignmentDomain } from '../domain_layer/assignment.domain';

export class AssignmentController {
    private router: Router;
    private assignmentDomain: AssignmentDomain;

    public constructor() {
        this.router = Router();
        this.assignmentDomain = new AssignmentDomain();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.getAssignments);
        this.router.get('/:id', this.getAssignment);
        this.router.post('/', this.createAssignment);
    }

    private async getAssignments(req: Request, res: Response): Promise<void> {
        res.json(await this.assignmentDomain.getAssignments(req.query));
    }

    private async getAssignment(req: Request, res: Response): Promise<void> {
        res.json(await this.assignmentDomain.getAssignment(req.params.id));
    }

    private async createAssignment(req: Request, res: Response): Promise<void> {
        res.json(await this.assignmentDomain.createAssigment(req.body));
    }

    public getRouter(): Router {
        return this.router;
    }
}