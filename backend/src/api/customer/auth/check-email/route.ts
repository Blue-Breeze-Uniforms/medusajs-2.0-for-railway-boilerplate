
import { container, type MedusaRequest, type MedusaResponse } from "@medusajs/framework";
import type { ICustomerModuleService, CustomerDTO } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, ModuleRegistrationName } from "@medusajs/framework/utils";
import { removeCustomerAccountWorkflow } from "@medusajs/medusa/core-flows";


export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
	const { email } = req.body;



	if (!email || typeof email !== "string") {
		return res.status(400).json({
			message: "Email is required in the request body",
		});
	}

	const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

	const customerModuleService: ICustomerModuleService = req.scope.resolve(
		ModuleRegistrationName.CUSTOMER,
	);

	let customer = await customerModuleService.listCustomers({
		email: email,
	});

	logger.info(JSON.stringify(customer, null, 2))
	let finalCUstomer: CustomerDTO | undefined;

	if (customer.length !== 0) {
		finalCUstomer = customer[0];

		if (
			finalCUstomer?.metadata &&
			finalCUstomer?.metadata.email_verified === true
		) {

			logger.info(JSON.stringify(finalCUstomer.metadata, null, 2))
			// log_it(finalCUstomer.metadata)

			res.status(200).json({
				verified: true,
				message: "Email Already Registered",
			});
		}

		// await customerModuleService.deleteCustomers(finalCUstomer.id);
		await removeCustomerAccountWorkflow(container).run({
			input: {
				customerId: finalCUstomer.id,
			},
		});

		res.status(200).json({
			verified: false,
			message: "Email Not Verified Yet! Deleting done",
		});
	} else {
		return res.status(200).json({
			message: "No Customer Found with that email",
			verified: false,
		});
	}
};
