import { Router, Request, Response } from "express";
import { StudentDomain } from "../domain/student.domain";
import { getUserFromReq } from "../domain/user.domain";

export class StudentController {
  public router: Router;
  private studentDomain: StudentDomain;

  constructor() {
    this.router = Router();
    this.studentDomain = new StudentDomain();
    this.initializeRoutes();
  }

  private createStudent = async (req: Request, res: Response) => {
    res.json(await this.studentDomain.createStudent(req.body));
  };

  private getStudents = async (req: Request, res: Response) => {
    res.json(
      await this.studentDomain.getStudents(
        req.query,
        await getUserFromReq(req),
      ),
    );
  };

  private updateStudent = async (req: Request, res: Response) => {
    res.json(
      await this.studentDomain.updateStudent(
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private deleteStudent = async (req: Request, res: Response) => {
    res.json(
      await this.studentDomain.deleteStudent(
        req.body,
        await getUserFromReq(req),
      ),
    );
  };

  private initializeRoutes() {
    /**
     * @swagger
     * /api/student:
     *   post:
     *     security:
     *       - cookieAuth: []
     *     tags: [Student]
     *     summary: Create a student
     *     description: Create a student for the current user
     *     parameters:
     *       - name: userId
     *         in: body
     *         description: The ID of the user to create the student for
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Succesfully created the student
     *       401:
     *         description: Unauthorized, user not authenticated
     *       500:
     *         description: Server error
     */
    this.router.post("/", this.createStudent);

    /**
     * @swagger
     * /api/student:
     *   get:
     *     security:
     *       - cookieAuth: []
     *     tags: [Student]
     *     summary: Get list of students
     *     description: Fetches a list of students filtered by optional query parameters.
     *     parameters:
     *       - name: id
     *         in: body
     *         description: The ID of the student to get
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *       - name: userId
     *         in: body
     *         description: The userId of the student to get
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *       - name: classId
     *         in: body
     *         description: The classId of the students to get
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *       - name: groupId
     *         in: body
     *         description: The groupId of the students to get
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Succesfully fetched the list of students
     *       401:
     *         description: Unauthorized, user not authenticated
     *       500:
     *         description: Server error
     */
    this.router.get("/", this.getStudents);

    /**
     * @swagger
     * /api/student:
     *   patch:
     *     security:
     *       - cookieAuth: []
     *     tags: [Student]
     *     summary: Update a student
     *     description: Updates a students classes and groups
     *     parameters:
     *       - name: id
     *         in: body
     *         description: The ID of the student to update
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *       - name: classes
     *         in: body
     *         description: The classes the student needs to be in
     *         required: false
     *         schema:
     *           type: [string]
     *           format: [uuid]
     *       - name: groups
     *         in: body
     *         description: The groups the student needs to be in
     *         required: false
     *         schema:
     *           type: [string]
     *           format: [uuid]
     *     responses:
     *       200:
     *         description: Succesfully updated the student
     *       401:
     *         description: Unauthorized, user not authenticated
     *       500:
     *         description: Server error
     */
    this.router.patch("/", this.updateStudent);

    /**
     * @swagger
     * /api/student:
     *   delete:
     *     security:
     *       - cookieAuth: []
     *     tags: [Student]
     *     summary: Delete a student
     *     description: Deletes a student
     *     parameters:
     *       - name: id
     *         in: body
     *         description: The ID of the student to delete
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Succesfully deleted the student
     *       401:
     *         description: Unauthorized, user not authenticated
     *       500:
     *         description: Server error
     */
    this.router.delete("/", this.deleteStudent);
  }
}
