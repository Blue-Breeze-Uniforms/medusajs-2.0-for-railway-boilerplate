import { JWT_SECRET } from "@/lib/constants";
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import type { ICustomerModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import jwt from "jsonwebtoken";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	try {
		const { token } = req.query;

		if (!token) {
			return res.status(400).json({
				success: false,
				message: "Missing verification token.",
			});
		}

		let payload;
		try {
			// Decode the URI-encoded JWT token
			const decodedToken = decodeURIComponent(token as string);

			const verified = jwt.verify(decodedToken, JWT_SECRET) as {
				payload: string;
			};
			payload = JSON.parse(verified.payload);
			console.log("Decoded payload from JWT:", payload);
		} catch (error) {
			console.error("JWT verification failed:", error);
			return res.status(400).json({
				success: false,
				message: "Invalid or expired verification token.",
			});
		}

		const { customerId, encryptedToken } = payload as {
			customerId: string;
			encryptedToken: string;
		};

		if (!customerId || !encryptedToken) {
			return res.status(400).json({
				success: false,
				message: "Invalid or incomplete verification data.",
			});
		}

		// Resolve the customer service
		const customerService: ICustomerModuleService = req.scope.resolve(
			Modules.CUSTOMER,
		);

		// Retrieve the customer
		const customer = await customerService.retrieveCustomer(customerId);
		if (!customer || !customer.metadata) {
			return res.status(404).json({
				success: false,
				message: "Customer not found.",
			});
		}

		const { verification_token, verification_token_expiry } = customer.metadata;

		// Check if the token matches
		if (verification_token !== encryptedToken) {
			return res.status(400).json({
				success: false,
				message: "Invalid verification token.",
			});
		}

		// Check if the token has expired
		if (
			verification_token_expiry &&
			new Date(verification_token_expiry) < new Date()
		) {
			return res.status(400).json({
				success: false,
				message: "Verification token has expired.",
			});
		}

		// Update customer metadata to mark email as verified
		await customerService.updateCustomers(customer.id, {
			metadata: {
				...customer.metadata,
				verification_token: null, // Clear the token
				verification_token_expiry: null, // Clear the expiry
				email_verified: true, // Mark email as verified
			},
		});

		console.log("Customer email verified successfully:", customerId);
		return res.status(200).json({
			success: true,
			message: "Email verified successfully.",
		});
	} catch (error) {
		console.error("Error verifying customer email:", error);
		return res.status(500).json({
			success: false,
			message: "An error occurred during verification.",
		});
	}
};
