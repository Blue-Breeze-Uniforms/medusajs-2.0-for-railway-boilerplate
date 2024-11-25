import { MedusaService } from "@medusajs/framework/utils"
import type { Logger } from "@medusajs/framework/types"
import School from "./models/school_model"

type InjectedDependencies = {
    logger: Logger
}

class SchoolService extends MedusaService({
    School,
}) {
    protected logger_: Logger

    constructor({ logger }: InjectedDependencies) {
        super(...arguments)
        this.logger_ = logger
    }

    async create(schoolData) {
        this.logger_.info("Creating new school")
        const school = await this.createSchools(schoolData)
        this.logger_.info(`School created with id: ${school.id}`)
        return school
    }

    async list() {
        this.logger_.info("Fetching all schools")
        const schools = await this.listSchools()
        this.logger_.info(`Found ${schools.length} schools`)
        return schools
    }
}

export default SchoolService