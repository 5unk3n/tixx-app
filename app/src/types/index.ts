import { z } from 'zod'

import {
	CouponBaseSchema,
	CouponPayloadSchema,
	CouponVerifyResponseSchema,
	EventFilterSchema,
	EventReactionPayloadSchema,
	EventReactionsResponseSchema,
	EventResponseSchema,
	EventsResponseSchema,
	EventSortOrderSchema,
	WishResponseSchema,
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
	PaginationResponseSchema,
	PaymentValidationResponseSchema,
	PhonAuthRequestInputSchema,
	PhonAuthVerifyInputSchema,
	PhoneAuthCodeResponseSchema,
	PhoneAuthCodeVerifyResponseSchema,
	QRCodeResponseSchema,
	SignUpInputSchema,
	TicketBaseSchema,
	UserSchema,
	OrderBaseSchema,
	OrdersResponseSchema,
	CreateFeedbackPayloadSchema,
	InquiryBaseSchema,
	CreateFeedbackResponseSchema,
	InquiryTypeEnum,
	InquiryStatusEnum,
	CancelPaymentPayloadSchema,
	CancelPaymentResponseSchema,
	NearbyEventsResponseSchema,
	HostFollowBaseSchema,
	HostFollowResponseSchema,
	FollowingHostsResponseSchema,
	HostResponseSchema,
	CreatePaymentPayloadSchema,
	VenuesResponseSchema,
	UseEventTicketByUserPayloadSchema,
	UseEventTicketByUserResponseSchema,
	VersionBaseSchema,
	HashtagSchema,
	EventHashtagSchema,
	EventTicketTransferStatusEnum
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
export type EventSortOrder = z.infer<typeof EventSortOrderSchema>
export type EventFilter = z.infer<typeof EventFilterSchema>
export type PaginationResponse<T> = Omit<
	z.infer<typeof PaginationResponseSchema>,
	'items'
> & {
	items: T[]
}
export type Tags = Event['tags']
export type EventReaction = z.infer<typeof EventReactionsResponseSchema>
export type EventReactionPayload = z.infer<typeof EventReactionPayloadSchema>
export type WishResponse = z.infer<typeof WishResponseSchema>
export type NearbyEvents = z.infer<typeof NearbyEventsResponseSchema>
export type NearbyEventsParams = {
	lat1: number
	lng1: number
	lat2: number
	lng2: number
}

// Ticket
export type Ticket = z.infer<typeof TicketBaseSchema>

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
export type EventTicketTransferStatus = z.infer<
	typeof EventTicketTransferStatusEnum
>
export type EventTicketsTransfersParams = {
	fromUserId?: number
	toUserId?: number
	status?: EventTicketTransferStatus
}
export type EventTicketsUserTransfer = z.infer<
	typeof EventTicketsUserTransfersResponseSchema
>[0] & { status: EventTicketTransferStatus }
export type EventTicketsUserTransfers = EventTicketsUserTransfer[]
export type EventTicketsAction = z.infer<
	typeof EventTicketsActionResponseSchema
>
export type EventTicketsActionPayload = z.infer<
	typeof EventTicketsActionPayloadSchema
>
export type UseEventTicketByUserPayload = z.infer<
	typeof UseEventTicketByUserPayloadSchema
>
export type UseEventTicketByUserResponse = z.infer<
	typeof UseEventTicketByUserResponseSchema
>

// QRCode
export type QRCode = z.infer<typeof QRCodeResponseSchema>

// Notifications
export type Notifications = z.infer<typeof NotificationsResponseSchema>

// Coupons
export type Coupon = z.infer<typeof CouponBaseSchema>
export type CouponPayload = z.infer<typeof CouponPayloadSchema>
export type CouponVerifyResponse = z.infer<typeof CouponVerifyResponseSchema>

// Orders
export type Order = z.infer<typeof OrderBaseSchema>
export type CreatePaymentPayload = z.infer<typeof CreatePaymentPayloadSchema>
export type PaymentValidation = z.infer<typeof PaymentValidationResponseSchema>
export type OrdersResponse = z.infer<typeof OrdersResponseSchema>
export type CancelPaymentPayload = z.infer<typeof CancelPaymentPayloadSchema>
export type CancelPaymentResponse = z.infer<typeof CancelPaymentResponseSchema>

// Inquiries
export type InquiryType = z.infer<typeof InquiryTypeEnum>
export type InquiryStatus = z.infer<typeof InquiryStatusEnum>
export type CreateFeedbackPayload = z.infer<typeof CreateFeedbackPayloadSchema>
export type Inquiry = z.infer<typeof InquiryBaseSchema>
export type CreateFeedbackResponse = z.infer<
	typeof CreateFeedbackResponseSchema
>

// Host
export type HostFollow = z.infer<typeof HostFollowBaseSchema>
export type Host = z.infer<typeof HostResponseSchema>
export type HostFollowResponse = z.infer<typeof HostFollowResponseSchema>
export type FollowingHostsResponse = z.infer<
	typeof FollowingHostsResponseSchema
>
export type VenuesResponse = z.infer<typeof VenuesResponseSchema>

export type Version = z.infer<typeof VersionBaseSchema>

// Hashtag
export type Hashtag = z.infer<typeof HashtagSchema>
export type EventHashtag = z.infer<typeof EventHashtagSchema>
