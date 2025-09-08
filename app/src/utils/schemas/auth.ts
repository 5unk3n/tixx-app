import { z } from 'zod'

import { DateTimeString, NumericBoolean, OAuthProviderSchema } from './common'
import { UserSchema, UserUpdateSchema } from './user'

export const LoginResponseSchema = z.object({
	jwt: z.string(),
	user: UserSchema.getResponse,
	isNew: NumericBoolean
})

export const SignUpInputSchema = UserUpdateSchema.omit({
	password: true,
	birth: true,
	marketingOptIn: true
}).extend({
	birthYYYYMMDD: z.string().length(8).nullable(),
	provider: OAuthProviderSchema,
	verified: z.number()
})

export const PhonAuthRequestInputSchema = z.object({
	phone: z.string(),
	hash: z.string()
})

export const PhoneAuthCodeResponseSchema = z.object({
	phone: z.string(),
	expiredAt: DateTimeString
})

export const PhonAuthVerifyInputSchema = z.object({
	phone: z.string(),
	authCode: z.string()
})

export const PhoneAuthCodeVerifyResponseSchema = z.object({
	success: z.boolean(),
	errorMsg: z.string().optional()
})
