import crypto from "node:crypto";
import { SECRET_KEY } from "@/lib/constants";

const IV_LENGTH = 16; // AES block size

// Encrypt data
export const encryptData = (data: string): string => {
	const iv = crypto.randomBytes(IV_LENGTH);
	const cipher = crypto.createCipheriv(
		"aes-256-cbc",
		Buffer.from(SECRET_KEY),
		iv,
	);
	let encrypted = cipher.update(data, "utf8", "hex");
	encrypted += cipher.final("hex");
	return `${iv.toString("hex")}:${encrypted}`;
};

// Decrypt data
export const decryptData = (encryptedData: string): string => {
	const [iv, encrypted] = encryptedData.split(":");
	const decipher = crypto.createDecipheriv(
		"aes-256-cbc",
		Buffer.from(SECRET_KEY),
		Buffer.from(iv, "hex"),
	);
	let decrypted = decipher.update(encrypted, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
};
