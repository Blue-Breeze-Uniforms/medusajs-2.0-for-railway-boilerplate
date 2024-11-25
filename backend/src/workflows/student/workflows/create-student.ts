// src/workflows/create-student/index.ts
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import createStudentStep from "@/workflows/student/steps/create-student-steps"
import linkStudentToParentStep from "@/workflows/student/steps/link-student-to-parent"
import type { StudentGenderEnum } from "@/modules/student/types"


export type CreateStudentWorkflowInput = {
    name: string;
    age: number;
    class: string;
    gender: StudentGenderEnum;
    customer_id: string;
    student_id: string;
    school_id: string | undefined;
}

const createStudentWorkflow = createWorkflow(
    "create-student",
    (input: CreateStudentWorkflowInput) => {
        const { student } = createStudentStep(input)

        linkStudentToParentStep({
            student_id: student.id,
            customer_id: input.customer_id,
        })

        return new WorkflowResponse(student)
    }
)

export default createStudentWorkflow