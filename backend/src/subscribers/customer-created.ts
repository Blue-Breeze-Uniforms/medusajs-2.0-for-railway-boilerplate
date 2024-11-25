import { RESEND_FROM_EMAIL, JWT_SECRET, BACKEND_URL } from "@/lib/constants";
import { EmailTemplates } from "@/modules/email-notifications/templates";
import { encryptData } from "@/utils/crypt";
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import type {
	INotificationModuleService,
	ICustomerModuleService,
	CustomerDTO,
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import jwt from "jsonwebtoken";




export default async function customerInviteHandler({
	event: { data },
	container,
}: SubscriberArgs<{ id: string }>) {
	try {
		console.log("Handler invoked with event data:", data);

		// Resolve required services
		const notificationService: INotificationModuleService = container.resolve(
			Modules.NOTIFICATION,
		);
		console.log("Notification service resolved.");

		const customerService: ICustomerModuleService = container.resolve(
			Modules.CUSTOMER,
		);
		console.log("Customer service resolved.");

		// // Validate and retrieve the customer by ID
		// if (!data.id) {
		// 	throw new Error("Customer ID is missing in the event data.");
		// }
		// console.log(`Retrieving customer with ID: ${data.id}`);

		const customer = await customerService.retrieveCustomer(data.id);
		console.log("Customer retrieved:", customer);

		// if (!customer || !customer.email) {
		// 	throw new Error(`Customer not found or missing email: ${data.id}`);
		// }

		// Generate token and verification link
		const verificationToken = generateVerificationToken({ customer });
		console.log("Generated verification token:", verificationToken);

		const encryptedToken = encryptData(verificationToken);
		console.log("Encrypted verification token:", encryptedToken);

		const verificationLink = generateVerificationLink({
			customerId: customer.id,
			encryptedToken: encryptedToken,
		});
		console.log("Generated verification link:", verificationLink);

		// Send notification email
		console.log("Sending notification email to:", customer.email);

		await notificationService.createNotifications({
			to: customer.email,
			channel: "email",
			template: EmailTemplates.CUSTOMER_CREATED,
			data: {
				emailOptions: {
					replyTo: RESEND_FROM_EMAIL || "info@help.yaaro.online",
					subject: "Confirm Your Blue Breeze App Sign Up!",
				},
				customerName: customer.first_name ?? customer.email,
				verificationLink: verificationLink,
				preview: "The administration dashboard awaits...",
			},
		});
		console.log({
			customerId: customer.id,
			message: "Verification email sent successfully.",
		});

		// Store the hashed token in customer metadata
		console.log("Storing verification token in customer metadata.");
		await storeVerificationToken({
			customer,
			token: encryptedToken,
			customerService,
		});
		console.log(
			"Verification token stored successfully for customer:",
			customer.id,
		);
	} catch (error) {
		console.error("Error in customerInviteHandler:", error);
	}
}

// Store hashed verification token and update metadata
const storeVerificationToken = async ({
	customer,
	token,
	customerService,
}: {
	customer: CustomerDTO;
	token: string;
	customerService: ICustomerModuleService;
}) => {
	try {
		console.log("Preparing to store token for customer:", customer.id);

		const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
		console.log("Token expiry date set to:", expiryDate);

		await customerService.updateCustomers(customer.id, {
			metadata: {
				verification_token: token,
				email_verified: false,
				verification_token_expiry: expiryDate.toISOString(),
			},
		});
		console.log("Token and metadata updated for customer:", customer.id);
	} catch (error) {
		console.error({
			customerId: customer.id,
			error,
			message: "Error storing verification token.",
		});
	}
};

// Generate a 6-digit numeric verification token
const generateVerificationToken = ({
	customer,
}: { customer: CustomerDTO }): string => {
	console.log("Generating verification token for customer:", customer.id);

	const numericPart = customer.id.slice(-3).replace(/\D/g, "").padStart(3, "0");
	const randomDigits = Math.floor(100 + Math.random() * 900); // Random 3-digit number

	const token = numericPart + randomDigits.toString();
	console.log("Generated token:", token);

	return token;
};

// Encrypt customerId and token into a verification link
const generateVerificationLink = ({
	customerId,
	encryptedToken,
}: {
	customerId: string;
	encryptedToken: string;
}): string => {
	console.log("Generating verification link for customer:", customerId);

	const payload = JSON.stringify({
		customerId,
		encryptedToken,
	});

	const token = jwt.sign({ payload: payload }, JWT_SECRET, {
		expiresIn: "24h",
	});

	console.log("JWT generated:", token);
	const verificationLink = `${BACKEND_URL}/customer/auth/verify?token=${encodeURIComponent(token)}`;

	console.log("Verification link:", verificationLink);

	return verificationLink;
};

export const config: SubscriberConfig = {
	event: "customer.created",
};
