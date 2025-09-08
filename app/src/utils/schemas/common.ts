import { z } from 'zod'

export const OAuthProviderSchema = z.enum(['naver', 'kakao', 'apple', 'google'])

export const PaginationResponseSchema = z.object({
	items: z.array(z.any()),
	page: z.number(),
	limit: z.number(),
	total: z.number(),
	totalPages: z.number()
})

// --- Reusable Types ---
export const DateTimeString = z
	.string()
	.datetime({ message: '유효한 날짜 형식이 아닙니다.' })
export const UrlString = z
	.string()
	.url({ message: '유효한 URL 형식이 아닙니다.' })
export const NumericBoolean = z.union([z.literal(0), z.literal(1)])

// --- Base Schemas ---
export const BaseEntitySchema = z.object({
	id: z.number(),
	createdAt: DateTimeString,
	updatedAt: DateTimeString,
	deletedAt: DateTimeString.nullable()
})
