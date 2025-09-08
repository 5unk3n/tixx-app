import { z } from 'zod'

import { BaseEntitySchema, DateTimeString } from './common'
import { EventBaseSchema } from './event'
import { EventTicketBaseSchema } from './eventTicket'
import { TicketBaseSchema } from './ticket'

// Orders
export const PaymentStatusEnum = z.nativeEnum({
	PENDING: 1,
	READY: 2,
	PAID: 3,
	CANCELLED: 4,
	PARTIAL_CANCELLED: 5,
	FAILED: 6
})

export const OrderItemBaseSchema = z.object({
	id: z.number(),
	orderId: z.string(),
	ticketId: z.number(),
	quantity: z.number(),
	amountKrw: z.number(),
	cancelledAmountKrw: z.number().nullable(),
	cancelledAt: DateTimeString.nullable()
})

export const OrderBaseSchema = BaseEntitySchema.omit({ id: true }).extend({
	id: z.string(),
	userId: z.number(),
	amountKrw: z.number(),
	cancelledAmountKrw: z.number().nullable(),
	paymentMethod: z.string().nullable(),
	status: PaymentStatusEnum,
	expiredAt: DateTimeString.nullable(),
	paidAt: DateTimeString.nullable(),
	orderItems: z.lazy(() => z.array(OrderItemBaseSchema))
})

export const CreatePaymentPayloadSchema = z.array(
	z.object({
		ticketId: z.number(),
		quantity: z.number()
	})
)

export const CreatePaymentResponseSchema = OrderBaseSchema

export const PaymentValidationResponseSchema = OrderBaseSchema.extend({
	orderItems: z.array(
		OrderItemBaseSchema.extend({
			eventTickets: z.array(EventTicketBaseSchema),
			ticket: TicketBaseSchema
		})
	)
})

export const OrderResponseSchema = OrderBaseSchema.extend({
	orderItems: z.array(
		OrderItemBaseSchema.extend({
			eventTickets: z.array(EventTicketBaseSchema),
			ticket: TicketBaseSchema.extend({
				event: EventBaseSchema
			})
		})
	)
})

export const OrdersResponseSchema = z.array(
	OrderBaseSchema.extend({
		orderItems: z.array(
			OrderItemBaseSchema.extend({
				eventTickets: z.array(EventTicketBaseSchema),
				ticket: TicketBaseSchema.extend({
					event: EventBaseSchema
				})
			})
		)
	})
)

export const CancelPaymentPayloadSchema = z.array(
	z.object({
		eventTicketId: z.number(),
		reason: z.string().optional()
	})
)

export const CancelPaymentResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	order: OrderBaseSchema.extend({
		orderItems: z.array(
			OrderItemBaseSchema.extend({
				eventTickets: z.array(EventTicketBaseSchema.optional())
			})
		)
	}),
	cancelledTickets: z.array(EventTicketBaseSchema)
})
