import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info(`Auth Context: ${JSON.stringify(req.auth_context, null, 2)}`)
    logger.info(`Actor ID: ${req.auth_context?.actor_id}`)

    res.json({
        customer_id: req.auth_context?.actor_id,
        message: "Customer details retrieved successfully"
    })
}