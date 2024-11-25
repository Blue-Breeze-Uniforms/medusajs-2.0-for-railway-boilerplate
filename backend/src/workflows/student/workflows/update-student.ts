// src/workflows/update-student/index.ts
import {
	createWorkflow,
	WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

import updateStudentStep from "@/workflows/student/steps/update-students-steps";
import type { UpdateStudent } from "@/api/store/customer/student/helper";

export type UpdateStudentWorkflowInput = UpdateStudent;

const updateStudentWorkflow = createWorkflow(
	"update-student",
	(input: UpdateStudentWorkflowInput) => {
		const { student } = updateStudentStep(input);

		return new WorkflowResponse(student);
	},
);

export default updateStudentWorkflow;
