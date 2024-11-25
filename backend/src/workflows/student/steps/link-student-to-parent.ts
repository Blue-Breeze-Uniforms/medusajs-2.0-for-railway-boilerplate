// src/workflows/create-student/steps/link-student-to-parent.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { STUDENT_MODULE } from "@/modules/student"

export type LinkStudentToParentStepInput = {
    student_id: string
    customer_id: string
}

const linkStudentToParentStep = createStep(
    "link-student-to-parent-step",
    async (data: LinkStudentToParentStepInput, { container }) => {
        const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

        await remoteLink.create({
            [Modules.CUSTOMER]: {
                customer_id: data.customer_id,
            },
            [STUDENT_MODULE]: {
                student_id: data.student_id,
            },
        })

        return new StepResponse(
            { success: true },
            { student_id: data.student_id, customer_id: data.customer_id }
        )
    },
    async ({ student_id, customer_id }, { container }) => {
        const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
        await remoteLink.delete({
            [Modules.CUSTOMER]: {
                customer_id: customer_id,
            },
            [STUDENT_MODULE]: {
                student_id: student_id,
            },
        })
    }
)

export default linkStudentToParentStep