import { z } from 'zod'

import { BaseEntitySchema, UrlString } from './common'

// Ticket Schema
export const TicketBaseSchema = BaseEntitySchema.extend({
	eventId: z.number(),
	name: z.string(),
	// nullable은 아니지만 기존에 null인 데이터가 있음.
	type: z.string().nullable(),
	description: z.string().nullable(),
	memo: z.string().nullable(),
	imageUrl: UrlString.nullable(),
	startAt: z.string(),
	endAt: z.string(),
	price: z.number().nullable(),
	quantity: z.number().nullable()
})
