import { z } from 'zod'

import { ClientUserSchema } from './clientUser'
import { CommonSchemas, OAuthProviderSchema } from './common'

export const SignupResponseSchema = z.object({
	clientUser: ClientUserSchema,
	jwt: z.string(),
	isNew: z.union([z.literal(0), z.literal(1)])
})

export const SignupPayloadSchema = z.object({
	name: z.string().min(2).max(20),
	companyName: z.string().min(2).max(20).optional(),
	email: CommonSchemas.email,
	password: z
		.string()
		.min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
		.max(16, '비밀번호는 최대 16자까지 입력 가능합니다.')
		.regex(/[0-9]/, '비밀번호에 숫자가 포함되어야 합니다.')
		.regex(/[a-zA-Z]/, '비밀번호에 영문자가 포함되어야 합니다.')
		.regex(
			/[!@#$%^&*(),.?":{}|<>]/,
			'비밀번호에 특수문자가 포함되어야 합니다.'
		),
	provider: OAuthProviderSchema.optional()
})

export const SignupFormSchema = SignupPayloadSchema.extend({
	verificationCode: z.string().refine((code) => code.length === 6, {
		message: '인증번호를 제대로 입력해주세요.'
	}),
	confirmPassword: z.string(),
	privacy: z.boolean(),
	terms: z.boolean()
}).refine((data) => data.password === data.confirmPassword, {
	path: ['confirmPassword'],
	message: '비밀번호가 일치하지 않습니다.'
})

export const LoginResponseSchema = z.object({
	clientUser: ClientUserSchema,
	jwt: z.string(),
	isNew: z.union([z.literal(0), z.literal(1)])
})

export const LoginPayloadSchema = z.object({
	email: CommonSchemas.email,
	password: z.string()
})

export const RequestEmailCodeResponseSchema = z.object({
	email: CommonSchemas.email,
	expiredAt: CommonSchemas.expiredAt
})

export const RequestEmailCodePayloadSchema = z.object({
	email: CommonSchemas.email
})

export const VerifyEmailCodeResponseSchema = z.object({
	success: z.boolean(),
	errorMsg: z.string()
})

export const VerifyEmailCodePayloadSchema = z.object({
	email: CommonSchemas.email,
	authCode: z.string()
})
