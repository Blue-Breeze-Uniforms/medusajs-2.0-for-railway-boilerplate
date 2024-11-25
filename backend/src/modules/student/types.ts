// src/modules/StudentModel/types.ts
import type Student from "./models/student_model";

export interface IStudentService {
	createStudent(
		data: Partial<typeof Student>,
	): Promise<typeof Student>;
	retrieveStudent(id: string, config?: object): Promise<typeof Student>;
	updateStudent(
		id: string,
		data: Partial<typeof Student>,
	): Promise<typeof Student>;
	deleteStudent(id: string): Promise<void>;
	listStudentsByCustomer(
		customerId: string,
		config?: object,
	): Promise<Array<typeof Student>>;
}


export enum StudentGenderEnum {
	MALE = "male",
	FEMALE = "female",
}
