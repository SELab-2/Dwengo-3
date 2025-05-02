import { useMutation } from "@tanstack/react-query";
import { AssignmentSubmissionCreate } from "../util/interfaces/assignmentSubmission.interfaces";
import { createAssignmentSubmission } from "../api/assignmentSubmission";

export function useCreateAssignmentSubmission() {
    return useMutation({
        mutationFn: async(data: AssignmentSubmissionCreate) => {
            return await createAssignmentSubmission(data);
        },
    });
}