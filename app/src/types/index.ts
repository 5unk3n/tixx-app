import { z } from 'zod'

import {
	EventReactionPayloadSchema,
	EventReactionsResponseSchema,
	EventResponseSchema,
	EventsResponseSchema,
	EventTicketResponseSchema,
	EventTicketsActionPayloadSchema,
	EventTicketsActionResponseSchema,
	EventTicketsResponseSchema,
	EventTicketsTransferPayloadSchema,
	EventTicketsTransfersResponseSchema,
	EventTicketsUserTransfersResponseSchema,
	LoginResponseSchema,
	NotificationsResponseSchema,
	OAuthProviderSchema,
	PhonAuthRequestInputSchema,
	PhonAuthVerifyInputSchema,
	PhoneAuthCodeResponseSchema,
	PhoneAuthCodeVerifyResponseSchema,
	QRCodeResponseSchema,
	SignUpInputSchema,
	UserSchema
} from '@/utils/schemas'

// User
export type User = z.infer<typeof UserSchema.getResponse>
export type UserUpdateResponse = z.infer<typeof UserSchema.updateResponse>
export type UserUpdateInput = z.infer<typeof UserSchema.updateInput>
export type UserCheckProfileInput = z.infer<typeof UserSchema.checkProfileInput>

// Auth
export type OAuthProvider = z.infer<typeof OAuthProviderSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type SignUpInput = z.infer<typeof SignUpInputSchema>
export type PhonAuthRequestInput = z.infer<typeof PhonAuthRequestInputSchema>
export type PhoneAuthCodeResponse = z.infer<typeof PhoneAuthCodeResponseSchema>
export type PhonAuthVerifyInput = z.infer<typeof PhonAuthVerifyInputSchema>
export type PhoneAuthCodeVerifyResponse = z.infer<
	typeof PhoneAuthCodeVerifyResponseSchema
>

// Event
export type Event = z.infer<typeof EventResponseSchema>
export type Events = z.infer<typeof EventsResponseSchema>
export type Tags = Event['tags']
export type EventReaction = z.infer<typeof EventReactionsResponseSchema>
export type EventReactionPayload = z.infer<typeof EventReactionPayloadSchema>

// Event Ticket
export type EventTicket = z.infer<typeof EventTicketResponseSchema>
export type EventTicketStatus = 'available' | 'used' | 'expired' | 'cancelled'
export type GroupedEventTicket = EventTicket & {
	ids: number[]
	status: EventTicketStatus
}
export type EventTickets = z.infer<typeof EventTicketsResponseSchema>
export type EventTicketsTransfers = z.infer<
	typeof EventTicketsTransfersResponseSchema
>
export type EventTicketsTransferPayload = z.infer<
	typeof EventTicketsTransferPayloadSchema
>
enum Status {
	PENDING = 1,
	ACCEPTED = 2,
	REJECTED = 3,
	CANCELED = 4
}
export type EventTicketsTransfersParams = {
	fromUserId?: number
	toUserId?: number
	status?: Status
}
export type EventTicketsUserTransfer = z.infer<
	typeof EventTicketsUserTransfersResponseSchema
>[0] & { status: Status }
export type EventTicketsUserTransfers = EventTicketsUserTransfer[]
export type EventTicketsAction = z.infer<
	typeof EventTicketsActionResponseSchema
>
export type EventTicketsActionPayload = z.infer<
	typeof EventTicketsActionPayloadSchema
>

// QRCode
export type QRCode = z.infer<typeof QRCodeResponseSchema>

// Notifications
export type Notifications = z.infer<typeof NotificationsResponseSchema>
