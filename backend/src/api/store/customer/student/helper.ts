import type Student from "@/modules/student/models/student_model";
import { StudentGenderEnum } from "@/modules/student/types";
import type { InferTypeOf } from "@medusajs/framework/types";
import type schoolModel from "@/modules/school/models/school_model";
import z from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(1),

  grade: z.string().min(1),
  gender: z.string().default(StudentGenderEnum.MALE),
  customer_id: z.string().min(1),
  student_school_id: z.string().optional().nullable(),
  school_id: z.string().optional().nullable(),
});

export type CreateStudent = Omit<InferTypeOf<typeof Student>, "id">;

export const updateStudentSchema = z.object({
  id: z.string().min(1),
  student_school_id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),

  grade: z.string().min(1).optional(),
  gender: z.nativeEnum(StudentGenderEnum).optional(), // Correctly referencing the enum
  school: z.string().optional(),
  school_id: z.string().optional().nullable(),
});

export type UpdateStudent = Required<
  Pick<z.infer<typeof updateStudentSchema>, "id">
> &
  Partial<Omit<z.infer<typeof updateStudentSchema>, "id">>;

export async function joinStudentSchool(
  student,
  school: InferTypeOf<typeof schoolModel>
) {
  return {
    id: student.id,
    name: student.name,
    student_school_id: student.student_school_id,
    gender: student.gender,
    grade: student.grade,
    createdAt: student.created_at,
    school: school
      ? {
          id: school.id,
          name: school.name,
          logo: school.logo ?? undefined,
          short_name: school.shortName ?? undefined,
        }
      : undefined,
  };
}
