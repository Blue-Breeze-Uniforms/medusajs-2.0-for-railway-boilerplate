import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import deleteStudentStep from "@/workflows/student/steps/delete-student-steps";

export type DeleteStudentWorkflowInput = {
    id: string;
}

const deleteStudentWorkflow = createWorkflow(
    "delete-student",
    (input: DeleteStudentWorkflowInput) => {
        const { student } = deleteStudentStep(input)

        return new WorkflowResponse(student)
    }
)

export default deleteStudentWorkflow