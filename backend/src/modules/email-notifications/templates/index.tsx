import { MedusaError } from "@medusajs/framework/utils";
import type { ReactNode } from "react";
import CustomerCreatedEmail, { CUSTOMER_CREATED, isCustomerCreatedData } from "./customer-created";
import InviteUserEmail, { INVITE_USER, isInviteUserData } from "./invite-user";
import OrderPlacedTemplate, { ORDER_PLACED, isOrderPlacedTemplateData } from "./order-placed";
import ResetPasswordEmail, { RESET_PASSWORD, isResetPasswordData } from "./reset-password";

export const EmailTemplates = {
  INVITE_USER,
  ORDER_PLACED,
  CUSTOMER_CREATED,
  RESET_PASSWORD,
} as const;

export type EmailTemplateType = keyof typeof EmailTemplates;

export function generateEmailTemplate(
  templateKey: string,
  data: unknown,
): ReactNode {
  switch (templateKey) {
    case EmailTemplates.INVITE_USER:
      if (!isInviteUserData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.INVITE_USER}"`,
        );
      }
      return <InviteUserEmail {...data} />;

    case EmailTemplates.ORDER_PLACED:
      if (!isOrderPlacedTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.ORDER_PLACED}"`,
        );
      }
      return <OrderPlacedTemplate {...data} />;

    case EmailTemplates.CUSTOMER_CREATED: {
      if (!isCustomerCreatedData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.CUSTOMER_CREATED}"`,
        );
      }
      return <CustomerCreatedEmail {...data} />;
    }

    case EmailTemplates.RESET_PASSWORD: {
      if (!isResetPasswordData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.RESET_PASSWORD}"`,
        );
      }
      return <ResetPasswordEmail {...data} />;
    }

    default:
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Unknown template key: "${templateKey}"`,
      );
  }
}

export { InviteUserEmail, OrderPlacedTemplate, CustomerCreatedEmail };
