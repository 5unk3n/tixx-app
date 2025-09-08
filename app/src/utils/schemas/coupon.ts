import { z } from 'zod'

import { BaseEntitySchema, DateTimeString } from './common'
import { EventBaseSchema, EventTagBaseSchema } from './event'
import { EventTicketBaseSchema } from './eventTicket'
import { TicketBaseSchema } from './ticket'

// Coupon Schema
export const CouponBaseSchema = BaseEntitySchema.extend({
	ticketId: z.number(),
	code: z.string().max(20),
	quantity: z.number(),
	expiredAt: z.string()
})

export const CouponVerifyResponseSchema = z.object({
	quantity: z.number(),
	expiredAt: DateTimeString,
	ticket: TicketBaseSchema.extend({
		event: EventBaseSchema.extend({
			tags: z.array(EventTagBaseSchema.pick({ tag: true }))
		})
	}),
	available: z.number()
})

export const CouponIssueResponseSchema = z.array(EventTicketBaseSchema)

export const CouponPayloadSchema = z.object({ code: z.string() })
