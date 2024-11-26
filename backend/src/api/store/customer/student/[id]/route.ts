import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { updateStudent, deleteStudent, getStudent } from "../student-handlers";

export const PUT = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  return updateStudent(req, res);
};

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  return deleteStudent(req, res);
};

export const HEAD = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  return getStudent(req, res);
};
