import { AssignmentSubmission, SubmissionType } from "@prisma/client";
import { AssignmentSubmissionPersistence } from "../persistence/assignmentSubmission.persistence";
import { FileSubmission, SubmissionSchema, SubmissionUpdateSchema, Uuid } from "./types";
import multer, { Multer } from 'multer';
import { Request } from 'express';

export class AssignmentSubmissionDomain {
    private assignmentSubPersistence: AssignmentSubmissionPersistence;
    private upload: Multer;
    private acceptedMimeTypes: string[];

    public constructor() {
        this.assignmentSubPersistence = new AssignmentSubmissionPersistence();
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
    }

    //TODO https://dev.to/ayanabilothman/file-type-validation-in-multer-is-not-safe-3h8l
    private fileFilter(req: any, file: Express.Multer.File, cb: any): void {
        if (this.acceptedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Expected mimiTypes: ${this.acceptedMimeTypes.toString()}`), false);
        }
    }

    public async getAssignmentSubmission(query: any): Promise<AssignmentSubmission | null> {
        const parseResult = SubmissionSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.assignmentSubPersistence.getAssignmentSubmission(parseResult.data);
    }

    public async createAssignmentSubmission(query: any): Promise<AssignmentSubmission> {
        const parseResult =  SubmissionSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        return this.assignmentSubPersistence.createAssignmentSubmission(parseResult.data);
    }

    public async updateAssignmentSubmission(req: Request): Promise<AssignmentSubmission> {
        //console.log(req.body);
        const parseResult = SubmissionUpdateSchema.safeParse(req.body);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        if (parseResult.data.submissionType === SubmissionType.FILE) {
            if (!req.file) {
                throw new Error("File submission is required when submissionType is FILE");
            }
            const fileSubmission: FileSubmission = {
                fileName: req.file!.originalname,
                filePath: req.file!.path
            }
            parseResult.data.submission = fileSubmission;
        }
        return this.assignmentSubPersistence.updateAssignmentSubmission(parseResult.data);
    }

    public getUpload(): Multer {
        return this.upload;
    }
}