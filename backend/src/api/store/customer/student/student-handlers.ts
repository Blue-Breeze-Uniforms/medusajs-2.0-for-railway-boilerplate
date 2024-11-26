import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import createStudentWorkflow from "@/workflows/student/workflows/create-student";
import updateStudentWorkflow from "@/workflows/student/workflows/update-student";
import deleteStudentWorkflow from "@/workflows/student/workflows/delete-student";

import { STUDENT_MODULE } from "@/modules/student";
import type StudentService from "@/modules/student/service";

import { SCHOOL_MODULE } from "modules/school";
import type SchoolService from "modules/school/service";
import {
  joinStudentSchool,
  createStudentSchema,
  updateStudentSchema,
  type CreateStudent,
  type UpdateStudent,
} from "./helper";

export async function getStudents(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  if (!req.auth_context) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const log = req.scope.resolve(ContainerRegistrationKeys.LOGGER);

  try {
    const {
      data: [customer],
    } = await query.graph({
      entity: "customer",
      fields: ["students.*"],
      filters: {
        id: [req.auth_context.actor_id],
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const schoolService: SchoolService = req.scope.resolve(SCHOOL_MODULE);
    const schools = await schoolService.list();

    const studentsWithSchool = await customer.students.map((student) => {
      const school = schools.find((s) => s.id === student.school_id);
      return joinStudentSchool(student, school);
    });

    log.info(
      `Retrieved ${studentsWithSchool.length} students for customer ${req.auth_context.actor_id}`
    );
    log.info(studentsWithSchool);

    return res.json({ students: studentsWithSchool });
  } catch (error) {
    log.error("Error retrieving students:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createStudent(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  try {
    const validatedBody = createStudentSchema.parse(
      req.body.student
    ) as CreateStudent;
    const { result: student } = await createStudentWorkflow(req.scope).run({
      input: validatedBody,
    });

    const schoolService: SchoolService = req.scope.resolve(SCHOOL_MODULE);
    const school = await schoolService.retrieveSchool(student.school_id);
    const studentWithSchool = joinStudentSchool(student, school);

    return res.status(201).json({ student: studentWithSchool });
  } catch (error) {
    console.error("Error creating student:", error);
    return res.status(400).json({
      message: "Failed to create student",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function updateStudent(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  try {
    const validatedBody = updateStudentSchema.parse(req.body) as UpdateStudent;
    const { result: updatedStudent } = await updateStudentWorkflow(
      req.scope
    ).run({
      input: validatedBody,
    });

    const schoolService: SchoolService = req.scope.resolve(SCHOOL_MODULE);
    const school = await schoolService.retrieveSchool(updatedStudent.school_id);
    const studentWithSchool = joinStudentSchool(updatedStudent, school);

    return res.status(200).json({ student: studentWithSchool });
  } catch (error) {
    console.error("Error updating student:", error);
    return res.status(400).json({
      message: "Failed to update student",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteStudent(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "id is required in the request parameters",
    });
  }

  try {
    const { result: deletedStudent } = await deleteStudentWorkflow(
      req.scope
    ).run({
      input: { id },
    });

    const schoolService: SchoolService = req.scope.resolve(SCHOOL_MODULE);
    const school = await schoolService.retrieveSchool(deletedStudent.school_id);
    const studentWithSchool = joinStudentSchool(deletedStudent, school);

    return res.status(200).json({
      message: "Student soft deleted successfully",
      student: studentWithSchool,
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return res.status(400).json({
      message: "Failed to delete student",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getStudent(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "id is required in the request parameters",
    });
  }

  try {
    const studentModuleService: StudentService =
      req.scope.resolve(STUDENT_MODULE);
    const student = await studentModuleService.retrieveStudent(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const schoolService: SchoolService = req.scope.resolve(SCHOOL_MODULE);
    const school = await schoolService.retrieveSchool(student.school_id);
    const studentWithSchool = joinStudentSchool(student, school);

    return res.status(200).json({ student: studentWithSchool });
  } catch (error) {
    console.error("Error retrieving student:", error);
    return res.status(400).json({
      message: "Failed to retrieve student",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
