import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import type { ICustomerModuleService } from "@medusajs/framework/types";
import { createWorkflow } from "@medusajs/framework/workflows-sdk";
import { emitEventStep } from "@medusajs/medusa/core-flows";

const triggerCustomerCreatedWorkflow = createWorkflow(
	"trigger-customer-created",
	(input: { customerId: string }) => {
		emitEventStep({
			eventName: "customer.created",
			data: {
				id: input.customerId,
			},
		});
	},
);

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
	try {
		const { customerId } = req.body;

		if (!customerId) {
			return res.status(400).json({
				message: "customerId is required in the request body",
			});
		}

		const reff = await triggerCustomerCreatedWorkflow(req.scope).run({
			input: { customerId },
		});

		res.json({
			message: "customer.created event triggered successfully",
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

async function checkMetadata(
	customerModuleService: ICustomerModuleService,
	customerId: string,
) {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	let customer = await customerModuleService.listCustomers({
		id: customerId,
	})[0];

	// Retry logic: Check metadata until it's populated or 5 attempts
	let retryCount = 0;
	while (retryCount < 5) {
		if (customer.metadata !== null) {
			// If metadata is populated, break the loop
			console.log("Metadata populated:", customer.metadata);
			break;
		}

		// Wait for 1 second before retrying
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Retry fetching the customer details
		customer = await customerModuleService.listCustomers({
			id: customerId,
		})[0];

		retryCount++;

		if (customer.metadata !== null) {
			console.log("Metadata populated after retry:", customer.metadata);
			break;
		}

		// Log after 5 attempts if metadata still isn't populated
		if (retryCount === 5) {
			console.log("Metadata not populated after 5 retries.");
		}
	}
}
