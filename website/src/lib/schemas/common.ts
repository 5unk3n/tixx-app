import { z } from 'zod'

export const CommonSchemas = {
	id: z.number(),
	email: z.string().email('올바르지 않은 이메일 양식입니다.'),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	expiredAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
}

export const OAuthProviderSchema = z.enum([
	'email',
	'naver',
	'kakao',
	'apple',
	'google'
])

export const PaginationResponseSchema = z.object({
	items: z.array(z.any()),
	page: z.number(),
	limit: z.number(),
	total: z.number(),
	totalPages: z.number()
})
