import { defineLink } from "@medusajs/utils";
import CustomerModule from "@medusajs/medusa/customer";
import StudentModule from "@/modules/student";

export default defineLink(CustomerModule.linkable.customer, {
	linkable: StudentModule.linkable.student,
	isList: true,
	deleteCascade: true,
});
