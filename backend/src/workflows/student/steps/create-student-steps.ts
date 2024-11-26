// src/workflows/create-student/steps/create-student.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { STUDENT_MODULE } from "@/modules/student"
import type StudentService from "@/modules/student/service"
import type { StudentGenderEnum } from "@/modules/student/types"

export type CreateStudentStepInput = {
    name: string;

    grade: string;
    gender: StudentGenderEnum;
    customer_id: string;
    student_school_id: string;
    school_id: string | undefined;
}

const createStudentStep = createStep(
    "create-student-step",
    async (data: CreateStudentStepInput, { container }) => {
        const studentModuleService: StudentService = container.resolve(STUDENT_MODULE)

        const student = await studentModuleService.createStudents(data)

        return new StepResponse(
            { student },
            { student_id: student.id }
        )
    },
    async ({ student_id }, { container }) => {
        const studentModuleService: StudentService = container.resolve(STUDENT_MODULE)
        await studentModuleService.softDeleteStudents(student_id)
    }
)

export default createStudentStep