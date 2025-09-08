import { z } from 'zod'

import { BaseEntitySchema, NumericBoolean, OAuthProviderSchema } from './common'

// User Schema
export const UserBaseSchema = BaseEntitySchema.extend({
	name: z.string(),
	nickname: z.string(),
	email: z.string().email(),
	password: z.string(),
	phone: z.string(),
	birth: z.string().nullable(),
	marketingOptIn: NumericBoolean,
	verified: NumericBoolean,
	provider: OAuthProviderSchema,
	fcmToken: z.string().nullable(),
	appLanguage: z.enum(['ko', 'en'])
})

// FIXME: 수정 가능한 항목은 nickname, marketingOptIn 뿐
export const UserUpdateSchema = z.object({
	name: z.string(),
	nickname: z.string().min(2).max(10),
	email: z.string().email(),
	password: z.string(),
	phone: z.string(),
	marketingOptIn: NumericBoolean,
	fcmToken: z.string().nullable(),
	birth: z.string().nullable(),
	appLanguage: z.enum(['ko', 'en']).optional()
})

export const UserSchema = {
	getResponse: UserBaseSchema.omit({ password: true }),
	updateResponse: UserBaseSchema.omit({ fcmToken: true, marketingOptIn: true }),
	updateInput: UserUpdateSchema.partial(),
	checkProfileInput: UserUpdateSchema.pick({ nickname: true, birth: true })
}

export const CheckNicknameResponseSchema = z.object({
	success: z.boolean(),
	errorMsg: z.string().optional()
})

export const NicknameResponseSchema = z.array(
	z.object({
		phone: z.string(),
		nickname: z.string().nullable(),
		id: z.number().nullable()
	})
)
