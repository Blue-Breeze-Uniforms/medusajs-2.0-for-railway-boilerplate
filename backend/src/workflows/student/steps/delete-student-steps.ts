import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { STUDENT_MODULE } from "@/modules/student"
import type StudentService from "@/modules/student/service"
import type { DeleteStudentWorkflowInput } from "@/workflows/student/workflows/delete-student"



const deleteStudentStep = createStep(
    "delete-student-step",
    async (data: DeleteStudentWorkflowInput, { container }) => {
        const studentModuleService: StudentService = container.resolve(STUDENT_MODULE)

        const student = await studentModuleService.retrieveStudent(data.id)
        await studentModuleService.softDeleteStudents(data.id)

        return new StepResponse(
            { student },
            { id: data.id }
        )
    },
    async ({ id }, { container }) => {
        const studentModuleService: StudentService = container.resolve(STUDENT_MODULE)
        await studentModuleService.restoreStudents(id)
    }
)

export default deleteStudentStep