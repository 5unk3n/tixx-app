import { z } from 'zod'

import { BaseEntitySchema, DateTimeString } from './common'
import { EventBaseSchema, EventTagBaseSchema } from './event'
import { PlaceBaseSchema } from './place'
import { TicketBaseSchema } from './ticket'
import { UserBaseSchema } from './user'

// EventTicket Schema
export const EventTicketBaseSchema = BaseEntitySchema.extend({
	eventId: z.number(),
	ticketId: z.number(),
	clientId: z.number().nullable().optional(),
	userId: z.number().nullable(),
	usedAt: DateTimeString.nullable()
})

export const EventTicketTransferStatusEnum = z.nativeEnum({
	PENDING: 1,
	ACCEPTED: 2,
	REJECTED: 3,
	CANCELED: 4
})

export const EventTicketTransferBaseSchema = BaseEntitySchema.extend({
	eventTicketId: z.number(),
	fromHostId: z.number().nullable(),
	fromUserId: z.number().nullable(),
	toUserId: z.number().nullable(),
	toPhoneNumber: z.string().nullable(),
	status: EventTicketTransferStatusEnum,
	requestedAt: DateTimeString,
	respondedAt: DateTimeString.nullable()
})

export const EventTicketResponseSchema = EventTicketBaseSchema.extend({
	event: EventBaseSchema.extend({
		place: PlaceBaseSchema,
		tags: z.array(EventTagBaseSchema)
	}),
	ticket: TicketBaseSchema,
	transfers: z.array(EventTicketTransferBaseSchema)
})

export const EventTicketsResponseSchema = z.array(EventTicketResponseSchema)

export const EventTicketsTransferPayloadSchema = z.array(
	z.object({
		eventTicketId: z.number(),
		toUserId: z.number().optional(),
		toPhoneNumber: z.string().optional()
	})
)

export const EventTicketsTransfersResponseSchema = z.array(
	EventTicketTransferBaseSchema
)

export const EventTicketsUserTransfersResponseSchema = z.array(
	EventTicketTransferBaseSchema.extend({
		eventTicket: EventTicketResponseSchema.omit({ transfers: true }),
		fromUser: z.lazy(() => UserBaseSchema.nullable()),
		toUser: z.lazy(() => UserBaseSchema.nullable())
	})
)

export const EventTicketsActionPayloadSchema = z.object({
	eventTicketTransferId: z.number()
})

export const EventTicketsActionResponseSchema = EventTicketTransferBaseSchema

export const UseEventTicketByUserPayloadSchema = z.object({
	eventTicketId: z.number()
})

export const UseEventTicketByUserResponseSchema = z.object({
	message: z.string()
})
