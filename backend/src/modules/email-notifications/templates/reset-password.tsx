import { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components'
import { Base } from './base'

export const RESET_PASSWORD = 'reset-password'

export interface ResetPasswordEmailProps {
    url: string
    preview?: string
}

export const isResetPasswordData = (data: any): data is ResetPasswordEmailProps =>
    typeof data.url === 'string' &&
    (typeof data.preview === 'string' || !data.preview)

export default function ResetPasswordEmail({
    url,
    preview = 'Reset your Blue Breeze Uniforms password'
}: ResetPasswordEmailProps) {
    return (
        <Base preview={preview}>
            <Section className="mt-8">
                <Img
                    src="https://placeholder.com/logo.png"
                    alt="Blue Breeze Uniforms"
                    width="200"
                    height="50"
                    className="mx-auto"
                />
            </Section>
            <Heading className="text-2xl font-bold text-center text-primary mt-8 mb-4">
                Reset Your Password
            </Heading>
            <Text className="text-base text-gray-700 mb-6">
                Hello,
            </Text>
            <Text className="text-base text-gray-700 mb-6">
                We received a request to reset the password for your Blue Breeze Uniforms account. If you didn't make this request, you can safely ignore this email.
            </Text>
            <Text className="text-base text-gray-700 mb-6">
                To reset your password, click the button below:
            </Text>
            <Section className="text-center mb-8">
                <Button
                    href={url}
                    className="bg-primary rounded text-white text-base font-semibold py-3 px-6 no-underline"
                >
                    Reset Your Password
                </Button>
            </Section>
            <Text className="text-sm text-gray-600 mb-4">
                If the button above doesn't work, you can copy and paste the following link into your browser:
            </Text>
            <Text className="text-sm text-blue-600 break-all mb-8">
                <Link href={url}>{url}</Link>
            </Text>
            <Hr className="border-t border-gray-300 my-6" />
            <Text className="text-sm text-gray-600">
                This password reset link will expire in 1 hour for security reasons. If you need to reset your password after that, please request a new reset link.
            </Text>
            <Text className="text-sm text-gray-600 mt-4">
                If you didn't request a password reset, please contact our support team immediately at support@bluebreezeuniforms.com.
            </Text>
            <Text className="text-sm font-semibold text-primary mt-6">
                The Blue Breeze Uniforms Team
            </Text>
        </Base>
    )
}

ResetPasswordEmail.PreviewProps = {
    url: 'https://bluebreezeuniforms.com/reset-password?token=abc123def456',
} as ResetPasswordEmailProps