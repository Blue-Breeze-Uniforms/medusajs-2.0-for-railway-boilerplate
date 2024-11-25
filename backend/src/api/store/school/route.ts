import { SCHOOL_MODULE } from "@/modules/school";
import type SchoolService from "@/modules/school/service";
import type {
	AuthenticatedMedusaRequest,
	MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (
	req: AuthenticatedMedusaRequest,
	res: MedusaResponse,
) => {
	const schoolService: SchoolService = req.scope.resolve(SCHOOL_MODULE);
	const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);

	logger.info("Fetching schools from API");
	const schools = await schoolService.list();
	logger.info(`Returning ${schools.length} schools from API`);

	res.json({ schools });
};
