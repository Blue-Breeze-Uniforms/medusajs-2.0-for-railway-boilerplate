import { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components'
import { Base } from './base'

export const CUSTOMER_CREATED = 'customer-created'

export interface CustomerCreatedEmailProps {
    customerName?: string
    verificationLink: string
    preview?: string
}

export const isCustomerCreatedData = (data: any): data is CustomerCreatedEmailProps =>
    (typeof data.customerName === 'string' || !data.customerName) &&
    typeof data.verificationLink === 'string' &&
    (typeof data.preview === 'string' || !data.preview)

export const CustomerCreatedEmail = ({
    customerName,
    verificationLink,
    preview = 'Welcome to Blue Breeze Uniforms! Please verify your account.',
}: CustomerCreatedEmailProps) => {
    return (
        <Base preview={preview}>
            <Section className="mt-8">
                <Img
                    src="https://parsadi.com/wp-content/uploads/2023/01/Customer.jpg"
                    alt="Blue Breeze Uniforms"
                    width="200"
                    height="50"
                    className="mx-auto"
                />
            </Section>
            <Heading className="text-2xl font-bold text-center text-[#003366] mt-8 mb-4">
                Welcome to Blue Breeze Uniforms!
            </Heading>
            <Text className="text-base text-gray-700 mb-6">
                Dear {customerName ?? 'USER'},
            </Text>
            <Text className="text-base text-gray-700 mb-6">
                Thank you for creating an account with Blue Breeze Uniforms. We're excited to have you on board! To complete your registration and start exploring our wide range of high-quality uniforms, please verify your email address by clicking the button below:
            </Text>
            <Section className="text-center mb-8">
                <Button
                    href={verificationLink}
                    className="bg-[#003366] rounded text-white text-base font-semibold py-3 px-6 no-underline"
                >
                    Verify Your Email
                </Button>
            </Section>
            <Text className="text-sm text-gray-600 mb-4">
                If the button above doesn't work, you can copy and paste the following link into your browser:
            </Text>
            <Text className="text-sm text-blue-600 break-all mb-8">
                <Link href={verificationLink}>{verificationLink}</Link>
            </Text>
            <Hr className="border-t border-gray-300 my-6" />
            <Text className="text-sm text-gray-600">
                If you didn't create an account with Blue Breeze Uniforms, please ignore this email or contact our support team at support@bluebreezeuniforms.com.
            </Text>
            <Text className="text-sm text-gray-600 mt-4">
                We look forward to serving you with the best uniform solutions for your needs!
            </Text>
            <Text className="text-sm font-semibold text-[#003366] mt-6">
                The Blue Breeze Uniforms Team
            </Text>
        </Base>
    )
}

CustomerCreatedEmail.PreviewProps = {
    customerName: 'John Doe',
    verificationLink: 'https://bluebreezeuniforms.com/verify?token=abc123',
} as CustomerCreatedEmailProps

export default CustomerCreatedEmail