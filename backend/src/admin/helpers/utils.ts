import { faker } from "@faker-js/faker";

export function generateIndianPhoneNumber(): string {
    // Randomly decide if the number should include a country code
    const includeCountryCode = faker.datatype.boolean();
    const countryCode = "+91";

    // Generate a valid phone number starting with 6-9
    const phoneNumber = `${faker.number.int({ min: 6, max: 9 })}${faker.number.int({ min: 100000000, max: 999999999 })}`;

    return includeCountryCode ? `${countryCode}${phoneNumber}` : phoneNumber;
}


