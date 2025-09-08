import { z } from 'zod'

import { CommonSchemas, OAuthProviderSchema } from './common'

export const ClientUserSchema = z.object({
	id: CommonSchemas.id,
	name: z.string(),
	companyName: z.string(),
	email: CommonSchemas.email,
	provider: OAuthProviderSchema,
	createdAt: CommonSchemas.createdAt,
	updatedAt: CommonSchemas.updatedAt,
	deletedAt: CommonSchemas.deletedAt
})

export const UpdatePasswordPayloadSchema = z.object({
	currentPassword: z.string().optional(),
	password: z
		.string()
		.min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
		.max(16, '비밀번호는 최대 16자까지 입력 가능합니다.')
		.regex(/[0-9]/, '비밀번호에 숫자가 포함되어야 합니다.')
		.regex(/[a-zA-Z]/, '비밀번호에 영문자가 포함되어야 합니다.')
		.regex(/[!@#$%^&*(),.?":{}|<>]/, '비밀번호에 특수문자가 포함되어야 합니다.')
})

export const UpdatePasswordFormSchema = UpdatePasswordPayloadSchema.extend({
	confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
	path: ['confirmPassword'],
	message: '비밀번호가 일치하지 않습니다.'
})

export const FindPasswordPayloadSchema = z.object({
	email: CommonSchemas.email
})
