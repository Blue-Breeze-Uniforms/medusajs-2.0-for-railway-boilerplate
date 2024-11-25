import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { STUDENT_MODULE } from "@/modules/student";
import type StudentService from "@/modules/student/service";
import type { UpdateStudentWorkflowInput } from "@/workflows/student/workflows/update-student";

const updateStudentStep = createStep(
	"update-student-step",
	async (data: UpdateStudentWorkflowInput, { container }) => {
		const studentModuleService: StudentService =
			container.resolve(STUDENT_MODULE);

		const student = await studentModuleService.updateStudents({
			id: data.id,
			...data,
		});

		return new StepResponse({ student }, { previous_data: student });
	},
	async ({ previous_data }, { container }) => {
		const studentModuleService: StudentService =
			container.resolve(STUDENT_MODULE);
		await studentModuleService.updateStudents(previous_data);
	},
);

export default updateStudentStep;
