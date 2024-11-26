import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { SCHOOL_MODULE } from "modules/school";
import type SchoolService from "modules/school/service";
import {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudent,
} from "./student-handlers";
/**
 * GET ALL THE STUDENTS FOR THE CUSTOMER
 */
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
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

  const schoolservice: SchoolService = req.scope.resolve(SCHOOL_MODULE);

  const schools = await schoolservice.list();

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  if (!schools) {
    return res.status(404).json({ message: "Schools not found" });
  }

  const students = customer.students;
  const studentsWithSchool = students
    .filter(
      (student) => student?.school_id && student.deleted_at === null
    )
    .map((student) => {
    //   log.info(`Student: CURRENT DATA:${JSON.stringify(student, null, 2)}`);

      const school = schools.find((school) => school.id === student.school_id);
      return {
        id: student.id,
        name: student.name,
        grade: student.grade,
        gender: student.gender,
        createdAt: student.created_at.toLocaleDateString(),
        student_school_id: student.student_school_id,
        school: school
          ? {
              id: school.id,
              name: school.name,
              logo: school.logo,
              short_name: school.shortName,
            }
          : undefined,
      };
    });

  log.info(JSON.stringify(studentsWithSchool, null, 2));

  res.json({
    students: studentsWithSchool,
  });
};

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  return createStudent(req, res);
};
