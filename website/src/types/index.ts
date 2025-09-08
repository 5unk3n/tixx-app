import { z } from 'zod'

import {
	LoginPayloadSchema,
	SignupFormSchema,
	SignupPayloadSchema,
	LoginResponseSchema,
	RequestEmailCodePayloadSchema,
	RequestEmailCodeResponseSchema,
	SignupResponseSchema,
	VerifyEmailCodePayloadSchema,
	VerifyEmailCodeResponseSchema
} from '@/lib/schemas/auth'
import {
	ClientUserSchema,
	UpdatePasswordFormSchema,
	UpdatePasswordPayloadSchema,
	FindPasswordPayloadSchema
} from '@/lib/schemas/clientUser'
import {
	CouponBaseSchema,
	CreateCouponPayloadSchema,
	UpdateCouponFormSchema,
	UpdateCouponPayloadSchema
} from '@/lib/schemas/coupons'
import {
	EventParticipantsResponseSchema,
	EventParticipantSchema,
	CreateEventFormSchema,
	CreateEventPayloadSchema,
	CreateEventResponseSchema,
	EventResponseSchema,
	EventsResponseSchema,
	InstagramCrawlRequestSchema,
	InstagramCrawlResponseSchema,
	InstagramCrawlPostSchema,
	EventFilterSchema,
	EventSortOrderSchema,
	EventsPaginationResponseSchema
} from '@/lib/schemas/events'
import {
	UploadableMimeTypeSchema,
	PresignedUrlFolderSchema,
	RequestPresignedUrlPayloadSchema,
	RequestPresignedUrlResponseSchema,
	UploadFilePayloadSchema,
	UploadImagePayloadSchema,
	UploadImageResponseSchema
} from '@/lib/schemas/file'
import { HashtagSchema, HashtagsResponseSchema } from '@/lib/schemas/hashtags'
import {
	CreateHostFormSchema,
	CreateHostPayloadSchema,
	CreateHostResponseSchema,
	DeleteHostResponseSchema,
	UpdateHostPayloadSchema
} from '@/lib/schemas/hosts'
import {
	ClientInquiryFormSchema,
	InquireFormSchema
} from '@/lib/schemas/inquiries'
import {
	CreatePlacePayloadSchema,
	CreatePlaceResponseSchema,
	PlaceBaseSchema
} from '@/lib/schemas/places'
import {
	ClientTransfersResponseSchema,
	ConsumeEventTicketPayloadSchema,
	CreateTicketFormSchema,
	CreateTicketPayloadSchema,
	EventTicketBaseSchema,
	EventTicketsTransferPayloadSchema,
	EventTicketTransferBaseSchema,
	TicketBaseSchema,
	TicketDetailResponseSchema,
	ValidateEventTicketPayloadSchema
} from '@/lib/schemas/tickets'
import { UserBaseSchema } from '@/lib/schemas/users'

export type Contact = {
	name: string
	phone: string
}

export type ContactWithUserInfo = Contact & {
	userId: number | null
	nickname: string
}

export type Category = 'all' | 'party' | 'venue'
export type Status = 'all' | 'notStarted' | 'inProgress' | 'completed'

// Client User
export type ClientUser = z.infer<typeof ClientUserSchema>
export type UpdatePasswordPayload = z.infer<typeof UpdatePasswordPayloadSchema>
export type UpdatePasswordForm = z.infer<typeof UpdatePasswordFormSchema>
export type FindPasswordPayload = z.infer<typeof FindPasswordPayloadSchema>
// Client User
export type User = z.infer<typeof UserBaseSchema>

// Auth
export type SignupResponse = z.infer<typeof SignupResponseSchema>
export type SignupPayload = z.infer<typeof SignupPayloadSchema>
export type SignupForm = z.infer<typeof SignupFormSchema>
export type LoginPayload = z.infer<typeof LoginPayloadSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type RequestEmailCodePayload = z.infer<
	typeof RequestEmailCodePayloadSchema
>
export type RequestEmailCodeResponse = z.infer<
	typeof RequestEmailCodeResponseSchema
>
export type VerifyEmailCodePayload = z.infer<
	typeof VerifyEmailCodePayloadSchema
>
export type VerifyEmailCodeResponse = z.infer<
	typeof VerifyEmailCodeResponseSchema
>

// File
export type PresignedUrlFolder = z.infer<typeof PresignedUrlFolderSchema>
export type UploadableMimeType = z.infer<typeof UploadableMimeTypeSchema>
export type RequestPresignedUrlPayload = z.infer<
	typeof RequestPresignedUrlPayloadSchema
>
export type RequestPresignedUrlResponse = z.infer<
	typeof RequestPresignedUrlResponseSchema
>
export type UploadFilePayload = z.infer<typeof UploadFilePayloadSchema>
export type UploadImagePayload = z.infer<typeof UploadImagePayloadSchema>
export type UploadImageResponse = z.infer<typeof UploadImageResponseSchema>

// Hosts
export type CreateHostPayload = z.infer<typeof CreateHostPayloadSchema>
export type UpdateHostPayload = z.infer<typeof UpdateHostPayloadSchema>
export type CreateHostResponse = z.infer<typeof CreateHostResponseSchema>
export type CreateHostForm = z.infer<typeof CreateHostFormSchema>
export type DeleteHostResponse = z.infer<typeof DeleteHostResponseSchema>

// Places
export type Place = z.infer<typeof PlaceBaseSchema>
export type CreatePlacePayload = z.infer<typeof CreatePlacePayloadSchema>
export type CreatePlaceResponse = z.infer<typeof CreatePlaceResponseSchema>

// Events
export type Event = z.infer<typeof EventResponseSchema>
export type Events = z.infer<typeof EventsResponseSchema>
export type PaginatedEvents = z.infer<typeof EventsPaginationResponseSchema>
export type EventSortOrder = z.infer<typeof EventSortOrderSchema>
export type EventFilter = z.infer<typeof EventFilterSchema>
export type CreateEventPayload = z.infer<typeof CreateEventPayloadSchema>
export type CreateEventResponse = z.infer<typeof CreateEventResponseSchema>
export type CreateEventForm = z.infer<typeof CreateEventFormSchema>
export type InstagramCrawlRequest = z.infer<typeof InstagramCrawlRequestSchema>
export type InstagramCrawlPost = z.infer<typeof InstagramCrawlPostSchema>
export type InstagramCrawlResponse = z.infer<
	typeof InstagramCrawlResponseSchema
>
export type EventParticipant = z.infer<typeof EventParticipantSchema>
export type EventParticipants = z.infer<typeof EventParticipantsResponseSchema>

// Tickets
export type Ticket = z.infer<typeof TicketBaseSchema>
export type CreateTicketPayload = z.infer<typeof CreateTicketPayloadSchema>
export type CreateTicketForm = z.infer<typeof CreateTicketFormSchema>
export type TicketDetail = z.infer<typeof TicketDetailResponseSchema>

export type EventTicket = z.infer<typeof EventTicketBaseSchema>
export type EventTicketTransfer = z.infer<typeof EventTicketTransferBaseSchema>
export type EventTicketsTransferPayload = z.infer<
	typeof EventTicketsTransferPayloadSchema
>
export type ClientTransfers = z.infer<typeof ClientTransfersResponseSchema>
export type ValidateEventTicketPayload = z.infer<
	typeof ValidateEventTicketPayloadSchema
>
export type ConsumeEventTicketPayload = z.infer<
	typeof ConsumeEventTicketPayloadSchema
>

// Coupons
export type Coupon = z.infer<typeof CouponBaseSchema>
export type CreateCouponPayload = z.infer<typeof CreateCouponPayloadSchema>
export type UpdateCouponPayload = z.infer<typeof UpdateCouponPayloadSchema>
export type UpdateCouponForm = z.infer<typeof UpdateCouponFormSchema>

// Inquiries
export type InquireForm = z.infer<typeof InquireFormSchema>
export type ClientInquiryForm = z.infer<typeof ClientInquiryFormSchema>

// Hashtags
export type Hashtag = z.infer<typeof HashtagSchema>
export type Hashtags = z.infer<typeof HashtagsResponseSchema>
