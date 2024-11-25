// src/api/routes/admin/parents/add-student.ts
import { STUDENT_MODULE } from "@/modules/student";
import type StudentService from "@/modules/student/service";
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
	const { customer_id, student_data } = req.body;
	const studentModuleService: StudentService =
		req.scope.resolve(STUDENT_MODULE);
	const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK);

	// Create a new student
	const student = await studentModuleService.createStudents(student_data);

	// Link the student to the parent (customer)
	await remoteLink.create({
		[Modules.CUSTOMER]: {
			customer_id: customer_id,
		},
		STUDENT_MODULE: {
			student_id: student.id,
		},
	});

	res.json({ student });
}
