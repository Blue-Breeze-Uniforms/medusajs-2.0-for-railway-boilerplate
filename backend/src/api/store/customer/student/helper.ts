import type Student from "@/modules/student/models/student_model";
import { StudentGenderEnum } from "@/modules/student/types";
import type { InferTypeOf } from "@medusajs/framework/types";
import z from "zod";

export const createStudentSchema = z.object({
    name: z.string().min(1),
    age: z.number().min(1),
    class: z.string().min(1),
    gender: z.enum(["male", "female"]).default("male"),
    school: z.string().optional(),
    customer_id: z.string().min(1),
    student_id: z.string().optional().nullable(),
    school_id: z.string().optional().nullable(),
});

export type CreateStudent = Omit<InferTypeOf<typeof Student>, "id">;


export const updateStudentSchema = z.object({
    id: z.string().min(1),
    student_id: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    age: z.number().min(1).optional(),
    class: z.string().min(1).optional(),
    gender: z.nativeEnum(StudentGenderEnum).optional(), // Correctly referencing the enum
    school: z.string().optional(),
    school_id: z.string().optional().nullable(),
});

export type UpdateStudent = Required<Pick<z.infer<typeof updateStudentSchema>, "id">> &
    Partial<Omit<z.infer<typeof updateStudentSchema>, "id">>;
