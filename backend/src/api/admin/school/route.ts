import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { SCHOOL_MODULE } from "@/modules/school/index";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import type SchoolService from "@/modules/school/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	const schoolService: SchoolService = req.scope.resolve(SCHOOL_MODULE);
	const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);

	logger.info("Fetching schools from API");
	const schools = await schoolService.list();
	logger.info(`Returning ${schools.length} schools from API`);

	res.json({ schools });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
	//TODO VALIDATIOn
	const schoolService: SchoolService = req.scope.resolve(SCHOOL_MODULE);
	const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);

	logger.info("Creating new school from API");
	const school = await schoolService.create(req.body);
	logger.info(`School created with id: ${school.id}`);

	res.json({ school });
};

// Add other methods (PUT, DELETE) as needed
/*
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const schoolService: SchoolService = req.scope.resolve(SCHOOL_MODULE);
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
  
    const { id } = req.params; // Ensure that the school ID is passed in the request
    const updateData = req.body;
  
    try {
      logger.info(`Updating school with id: ${id}`);
      const updatedSchool = await schoolService.update(id, updateData);
      logger.info(`School updated with id: ${updatedSchool.id}`);
  
      res.json({ school: updatedSchool });
    } catch (error) {
      logger.error(`Failed to update school with id: ${id}`, error);
      res.status(400).json({ error: "Failed to update school", details: error.message });
    }
  };
  
  export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const schoolService: SchoolService = req.scope.resolve(SCHOOL_MODULE);
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
  
    const { id } = req.params; // Ensure that the school ID is passed in the request
  
    try {
      logger.info(`Deleting school with id: ${id}`);
      await schoolService.delete(id);
      logger.info(`School deleted with id: ${id}`);
  
      res.status(204).send(); // No Content response for successful deletion
    } catch (error) {
      logger.error(`Failed to delete school with id: ${id}`, error);
      res.status(400).json({ error: "Failed to delete school", details: error.message });
    }
  };*/
