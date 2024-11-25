import SchoolService from "./service"
import { Module } from "@medusajs/framework/utils"

export const SCHOOL_MODULE = "schoolModuleService"

export default Module(SCHOOL_MODULE, {
  service: SchoolService,
})