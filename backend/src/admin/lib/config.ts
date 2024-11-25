import Medusa from "@medusajs/js-sdk";

class CustomSDK extends Medusa {
	listSchools() {
		return this.client.fetch("admin/school", {
			method: "GET",
			credentials: "include",
		});
	}

	insertSchool(school: any) {
		return this.client.fetch("admin/school", {
			method: "POST",
			body: school,
			credentials: "include",
		});
	}

	deleteSchool(id: string) {
		return this.client.fetch(`admin/school/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
	}

	updateSchool(id: string) {
		return this.client.fetch(`admin/school/${id}`, {
			method: "PUT",
			credentials: "include",
		});
	}
}
export const sdk = new CustomSDK({
	// baseUrl: "https://sunny-equally-termite.ngrok-free.app",
	baseUrl: "https://backend-production-07ec.up.railway.app",
	debug: process.env.NODE_ENV === "development",
	auth: {
		type: "session",
	},
});
