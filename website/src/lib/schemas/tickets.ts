import { z } from 'zod'

import { CouponBaseSchema } from './coupons'
import { EventBaseSchema } from './events'
import { HostBaseSchema } from './hosts'
import { UserBaseSchema } from './users'

// Ticket Schema
export const TicketBaseSchema = z.object({
	id: z.number(),
	eventId: z.number(),
	name: z.string(),
	type: z.string(),
	description: z.string().nullable(),
	memo: z.string().nullable(),
	imageUrl: z.string().url().nullable(),
	startAt: z.string(),
	endAt: z.string(),
	price: z.number().nullable(),
	quantity: z.number().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

export const CreateTicketPayloadSchema = z.object({
	eventId: z.number(),
	name: z.string(),
	description: z.string().nullable(),
	memo: z.string().nullable(),
	imageUrl: z.string().url().nullable(),
	startAt: z.string().datetime(),
	endAt: z.string().datetime(),
	type: z.string().optional(),
	price: z.number().optional(),
	quantity: z.number().optional()
})

export const CreateTicketFormSchema = z.object({
	startDate: z.date(),
	endDate: z.date(),
	startTime: z.string().regex(/^\d{2}:\d{2}$/, {
		message: '시간 형식이 올바르지 않습니다. (HH:MM)'
	}),
	endTime: z.string().regex(/^\d{2}:\d{2}$/, {
		message: '시간 형식이 올바르지 않습니다. (HH:MM)'
	}),
	name: z.string(),
	type: z.string(),
	customName: z.string().optional(),
	entryDateType: z.string(),
	quantity: z.string().optional(),
	guestCodes: z
		.array(
			z
				.string()
				.min(6, { message: '코드는 최소 6자리 이상이어야 합니다.' })
				.max(20, { message: '코드는 최대 20자리 이하여야 합니다.' })
				.regex(/^[a-z0-9]+$/, '코드는 영어 소문자와 숫자만 사용할 수 있습니다.')
		)
		.optional(),
	price: z.string().optional()
})

export const TicketDetailResponseSchema = TicketBaseSchema.extend({
	rejectedInvites: z.number(),
	coupons: z.array(CouponBaseSchema),
	event: z.lazy(() =>
		EventBaseSchema.extend({
			host: HostBaseSchema
		})
	),
	eventTickets: z.lazy(() => z.array(EventTicketBaseSchema)),
	totalQuantity: z.number(),
	totalUsers: z.number(),
	usedTickets: z.number()
})

// EventTicket Schema
export const EventTicketBaseSchema = z.object({
	id: z.number(),
	eventId: z.number(),
	ticketId: z.number(),
	userId: z.number().nullable(),
	usedAt: z.string().datetime().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

export const EventTicketTransferBaseSchema = z.object({
	id: z.number(),
	eventTicketId: z.number(),
	fromUserId: z.number().nullable(),
	fromHostId: z.number().nullable(),
	toUserId: z.number().nullable(),
	toPhoneNumber: z.string().nullable(),
	status: z.nativeEnum({
		pending: 1,
		accepted: 2,
		rejected: 3,
		canceled: 4
	}),
	requestedAt: z.string().datetime(),
	respondedAt: z.string().datetime().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

export const EventTicketsTransferPayloadSchema = z.array(
	z.object({
		ticketId: z.number(),
		toUserId: z.number().optional(),
		toPhoneNumber: z.string().optional()
	})
)

export const ClientTransfersResponseSchema = z.array(
	EventTicketTransferBaseSchema.extend({
		eventTicket: EventTicketBaseSchema.extend({
			ticket: TicketBaseSchema
		}),
		toUser: UserBaseSchema.nullable()
	})
)

export const ValidateEventTicketResponseSchema = z.object({
	message: z.string(),
	eventTickets: z.array(EventTicketBaseSchema).optional()
})

export const ValidateEventTicketPayloadSchema = z.object({
	eventId: z.number(),
	token: z.string()
})

export const ConsumeEventTicketResponseSchema = z.object({
	message: z.string()
})

export const ConsumeEventTicketPayloadSchema = z.object({
	eventTicketId: z.number()
})
