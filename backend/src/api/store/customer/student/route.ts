import type {
	AuthenticatedMedusaRequest,
	MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

import createStudentWorkflow from "@/workflows/student/workflows/create-student";

import { STUDENT_MODULE } from "@/modules/student";
import type StudentService from "@/modules/student/service";

import {
	type CreateStudent,
	createStudentSchema,
	type UpdateStudent,
	updateStudentSchema,
} from "./helper";
import updateStudentWorkflow from "@/workflows/student/workflows/update-student";
import deleteStudentWorkflow from "@/workflows/student/workflows/delete-student";

/**
 * GET ALL THE STUDENTS FOR THE CUSTOMER
 */
export const GET = async (
	req: AuthenticatedMedusaRequest,
	res: MedusaResponse,
) => {
	if (!req.auth_context) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
	const log = req.scope.resolve(ContainerRegistrationKeys.LOGGER);

	const {
		data: [customer],
	} = await query.graph({
		entity: "customer",
		fields: ["students.*"],
		filters: {
			id: [req.auth_context.actor_id],
		},
	});
	log.info(JSON.stringify(customer, null, 2));

	res.json({
		students: customer.students,
	});
};

/**
 * CREATE NEW STUDENT
 */
export const POST = async (
	req: AuthenticatedMedusaRequest,
	res: MedusaResponse,
) => {
	try {
		// Validate the request body
		const validatedBody = createStudentSchema.parse(
			req.body.student,
		) as CreateStudent;

		if (!validatedBody) {
			return res.status(400).json({
				message: "Data is required in the request body",
			});
		}

		// Run the student creation workflow
		const { result: student } = await createStudentWorkflow(req.scope).run({
			input: validatedBody,
		});

		// Respond with the created student
		return res.status(200).json({ student });
	} catch (error) {
		console.error("Error creating student:", error);

		// Handle validation or workflow errors
		return res.status(500).json({
			message: "Failed to create student",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * UPDATE STUDENT
 */
export const PUT = async (
	req: AuthenticatedMedusaRequest,
	res: MedusaResponse,
) => {
	const validatedBody = updateStudentSchema.parse(req.body) as UpdateStudent;

	if (!validatedBody) {
		return res.status(400).json({
			message: "data is required in the request body",
		});
	}

	const { result: updatedStudent } = await updateStudentWorkflow(req.scope).run(
		{
			input: validatedBody,
		},
	);

	return res.status(200).json({ student: updatedStudent });
};

/**
 * SOFT DELETE STUDENT
 */
export const DELETE = async (
	req: AuthenticatedMedusaRequest,
	res: MedusaResponse,
) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({
			message: "id is required in the request parameters",
		});
	}

	const { result: deletedStudent } = await deleteStudentWorkflow(req.scope).run(
		{
			input: { id },
		},
	);

	return res.status(200).json({
		message: "Student soft deleted successfully",
		student: deletedStudent,
	});
};

/**
 * GET SINGLE STUDENT
 */
export const HEAD = async (
	req: AuthenticatedMedusaRequest,
	res: MedusaResponse,
) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({
			message: "id is required in the request parameters",
		});
	}

	const studentModuleService: StudentService =
		req.scope.resolve(STUDENT_MODULE);
	const student = await studentModuleService.retrieveStudent(id);

	if (!student) {
		return res.status(404).json({ message: "Student not found" });
	}

	return res.status(200).json({ student });
};
