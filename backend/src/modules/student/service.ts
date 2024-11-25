import { MedusaService, Modules } from "@medusajs/utils";
import Student from "./models/student_model";

import type { StudentGenderEnum } from "./types";
import type { Logger } from "@medusajs/medusa/types"


export class StudentService extends MedusaService({
    Student,
}) {
    
}

export default StudentService;
