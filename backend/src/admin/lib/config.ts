import { BACKEND_URL } from "./../../lib/constants";
import Medusa from "@medusajs/js-sdk";

class CustomSDK extends Medusa {
	listSchools() {
		return this.client.fetch(`${BACKEND_URL}/admin/school`, {
			method: "GET",
			credentials: "include",
		});
	}

	insertSchool(school: any) {
		return this.client.fetch(`${BACKEND_URL}/admin/school`, {
			method: "POST",
			body: school,
			credentials: "include",
		});
	}

	deleteSchool(id: string) {
		return this.client.fetch(`${BACKEND_URL}/admin/school/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
	}

	updateSchool(id: string) {
		return this.client.fetch(`${BACKEND_URL}/admin/school/${id}`, {
			method: "PUT",
			credentials: "include",
		});
	}
}
export const sdk = new CustomSDK({
	baseUrl: "http://localhost:9000",
	debug: process.env.NODE_ENV === "development",
	auth: {
		type: "session",
	},
});
