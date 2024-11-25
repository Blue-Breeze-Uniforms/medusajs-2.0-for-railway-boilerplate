import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import type { ICustomerModuleService } from "@medusajs/framework/types";
import { ModuleRegistrationName } from "@medusajs/framework/utils";


export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
	try {
		const { customerId } = req.body;

		if (!customerId) {
			return res.status(400).json({
				message: "customerId is required in the request body",
			});
		}

		const customerModuleService: ICustomerModuleService = req.scope.resolve(
			ModuleRegistrationName.CUSTOMER,
		);
		let customer = await customerModuleService.listCustomers({
			id: customerId,
		});

		console.log("CUSTOMER METADATA HERE", customer[0].metadata);

		res.json({
			
			customer: customer,
		});
	} catch (error) {
		console.error("Error in customer creation trigger:", error);
		return res.json({
			message:
				"An error occurred while processing your request for customer creation",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
