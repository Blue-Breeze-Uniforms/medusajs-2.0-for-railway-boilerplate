import { RESEND_FROM_EMAIL, BACKEND_URL } from "@/lib/constants";
import { EmailTemplates } from "@/modules/email-notifications/templates";
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import type { INotificationModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";


export default async function resetPasswordTokenHandler({
	event: {
		data: { entity_id: email, token, actor_type },
	},
	container,
}: SubscriberArgs<{ entity_id: string; token: string; actor_type: string }>) {
	// Resolve required services
	const notificationService: INotificationModuleService = container.resolve(
		Modules.NOTIFICATION,
	);
	console.log("Notification service resolved.");

	const urlPrefix =
		actor_type === "customer" ? "https://storefront.com" : "https://admin.com";

	try {
		await notificationService.createNotifications({
			to: email,
			channel: "email",

			template: EmailTemplates.RESET_PASSWORD,
			data: {
				emailOptions: {
					replyTo: RESEND_FROM_EMAIL || "info@help.yaaro.online",
					subject: "Password Reset URL",
				},
				url: `${BACKEND_URL}/customer/auth/reset-password?token=${token}&email=${email}`,
				preview: "Reset your password!",
			},
		});

		console.log({
			email: email,
			message: "Reset Token Sent Successfully.",
			token: token,
			actor_type: actor_type,
		});
	} catch (error) {
		console.error(error);
	}
}

export const config: SubscriberConfig = {
	event: "auth.password_reset",
};
