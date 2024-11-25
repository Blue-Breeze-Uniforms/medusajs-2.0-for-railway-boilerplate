import { Module } from "@medusajs/framework/utils";
import StudentService from "./service";


export const STUDENT_MODULE = "studentModuleService";

export default Module(STUDENT_MODULE, {
	service: StudentService,
});
