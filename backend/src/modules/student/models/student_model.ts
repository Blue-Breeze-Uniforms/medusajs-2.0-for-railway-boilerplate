import { model } from "@medusajs/framework/utils";
import { StudentGenderEnum } from "../types";
import type { InferTypeOf } from "@medusajs/framework/types";

// import CustomerModule from "@medusajs/medusa/customer"
const Student = model.define("student", {
	id: model.id().primaryKey(),
	name: model.text(),
	age: model.number(),
	class: model.text(),
	gender: model.enum(StudentGenderEnum).default(StudentGenderEnum.MALE),
	school: model.text(),
	customer_id: model.text(),
	student_id: model.text().unique(),
	school_id: model.text(),
});
export default Student;



export type StudentModelType = InferTypeOf<typeof Student>

