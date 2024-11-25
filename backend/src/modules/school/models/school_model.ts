import { model } from "@medusajs/framework/utils"
import { z } from "zod"
// Import validator explicitly
import validator from 'validator';

const schoolModel = model.define("school", {
    id: model.id().primaryKey(),
    name: model.text().unique(),
    shortName: model.text().default(""), // Use shortName consistently
    type: model.enum(['primary', 'secondary', 'higher', 'vocational', 'university']),
    address: model.text().nullable(),
    city: model.text(),
    state: model.text(),
    country: model.text(),
    postalCode: model.text(),
    website: model.text().nullable(),
    studentCount: model.bigNumber().default(0),
    principalName: model.text().nullable(),
    contactPersonName: model.text().nullable(),
    contactPersonEmail: model.text().nullable(),
    contactPersonPhone: model.text().nullable(),
    isActive: model.boolean().default(true),
    logo: model.text().nullable()
})



const phoneRegex = /^(?:(?:\+91|91|0)[-\s]?)?[6-9]\d{9}$/; //Regex for Indian phone numbers

export const schoolSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters long").max(100, "Name must not exceed 100 characters"),
    shortName: z.string().max(10, "Short name must not exceed 10 characters").optional(), // Make shortName optional in the schema
    type: z.enum(["primary", "secondary", "university", "vocational"]), // Removed "higher" to match model
    address: z.string().min(5, "Address must be at least 5 characters long").max(200, "Address must not exceed 200 characters").nullable().optional(),
    city: z.string().min(2, "City must be at least 2 characters long").max(50, "City must not exceed 50 characters"),
    state: z.string().min(2, "State must be at least 2 characters long").max(50, "State must not exceed 50 characters"),
    country: z.string().min(2, "Country must be at least 2 characters long").max(50, "Country must not exceed 50 characters"),
    postalCode: z.string().min(3, "Postal code must be at least 3 characters long").max(20, "Postal code must not exceed 20 characters"),
    website: z.string().url("Invalid URL format").nullable().optional(),
    studentCount: z.number().int().nonnegative("Student count must be non-negative").optional(), // Make optional and add validation
    principalName: z.string().nullable().optional(), // Make nullable and optional
    contactPersonName: z.string().min(2, "Contact person name must be at least 2 characters long").max(100, "Contact person name must not exceed 100 characters").nullable().optional(),
    contactPersonEmail: z.string().email("Invalid email format").nullable().optional(),
    contactPersonPhone: z.string().regex(phoneRegex, "Invalid phone number format").nullable().optional(), // Added phone number regex validation
    isActive: z.boolean().default(true), // Make optional
    logo: z.string().url("Invalid URL format").nullable().optional(),
})

export type SchoolInput = z.infer<typeof schoolSchema>

export default schoolModel
