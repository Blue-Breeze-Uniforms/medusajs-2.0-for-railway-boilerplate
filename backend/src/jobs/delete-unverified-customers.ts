import type { MedusaContainer } from "@medusajs/framework";
import type { ICustomerModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { removeCustomerAccountWorkflow } from "@medusajs/medusa/core-flows";

export default async function deleteUnverifiedCustomers(
	container: MedusaContainer,
) {
	const customerService: ICustomerModuleService = container.resolve(
		Modules.CUSTOMER,
	);

	// Get customers created more than 24 hours ago
	const twentyFourHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

	// const twentyFourHoursAgo = new Date(Date.now() - 1 * 60 * 1000);

	const customers = await customerService.listCustomers(
		{ created_at: { $lt: twentyFourHoursAgo } },
		{ relations: ["metadata"] },
	);

	for (const customer of customers) {
		// Check if email is not verified in metadata
		if (customer.metadata && customer.metadata.email_verified === false) {
			// Use the removeCustomerAccountWorkflow to delete everything
			await removeCustomerAccountWorkflow(container).run({
				input: {
					customerId: customer.id,
				},
			});

			await customerService.deleteCustomers(customer.id);
			console.log(`Deleted unverified customer: ${customer.email}`);

			console.log(
				`Deleted unverified customer and all associated data: ${customer.email}`,
			);
		}
	}
}

export const config = {
	name: "delete-unverified-customers",
	schedule: "*/30 * * * *",
};
