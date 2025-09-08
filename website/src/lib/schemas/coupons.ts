import { z } from 'zod'

export const CouponHistorySchema = z.object({
	id: z.number(),
	couponId: z.number(),
	eventTicketId: z.number(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

export const CouponBaseSchema = z.object({
	id: z.number(),
	ticketId: z.number(),
	code: z.string().max(20),
	quantity: z.number(),
	expiredAt: z.string(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

export const CreateCouponPayloadSchema = z.object({
	ticketId: z.number(),
	code: z.string(),
	quantity: z.number(),
	expiredAt: z.string().datetime()
})

export const UpdateCouponPayloadSchema = z.object({
	couponId: z.number(),
	code: z.string().optional(),
	quantity: z.number().optional(),
	expiredAt: z.string().datetime().optional()
})

export const UpdateCouponFormSchema = z.object({
	code: z
		.string()
		.min(6, { message: '코드는 최소 6자리 이상이어야 합니다.' })
		.max(20, { message: '코드는 최대 20자리 이하여야 합니다.' })
		.regex(/[a-z0-9]/, '코드는 영어 소문자와 숫자만 사용할 수 있습니다.'),
	quantity: z.string()
})
