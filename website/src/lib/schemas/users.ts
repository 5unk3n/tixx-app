import { z } from 'zod'

import { OAuthProviderSchema } from './common'

export const UserBaseSchema = z.object({
	id: z.number(),
	name: z.string(),
	nickname: z.string(),
	email: z.string().email(),
	password: z.string(),
	phone: z.string(),
	birth: z.string(),
	marketingOptIn: z.union([z.literal(0), z.literal(1)]),
	verified: z.union([z.literal(0), z.literal(1)]),
	provider: OAuthProviderSchema,
	fcmToken: z.string().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

export const NicknameResponseSchema = z.array(
	z.object({
		phone: z.string(),
		nickname: z.string().nullable(),
		id: z.number().nullable()
	})
)
