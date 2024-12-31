import { z } from 'zod'

import { ERRORS } from '@/constants/errors'

export const OAuthProviderSchema = z.enum(['naver', 'kakao', 'apple'])

const UserBaseSchema = z.object({
	id: z.number(),
	name: z.string(),
	nickname: z.string(),
	email: z.string().email(),
	password: z.string(),
	phone: z.string(),
	birth: z.string(),
	marketingOptIn: z.union([z.literal(0), z.literal(1)]),
	verified: z.union([z.literal(0), z.literal(1)]),
	provider: OAuthProviderSchema,
	fcmToken: z.string().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

// FIXME: 수정 가능한 항목은 nickname, marketingOptIn 뿐
const UserUpdateSchema = z.object({
	name: z.string({
		required_error: ERRORS.VALIDATION.REQUIRED_FIELD,
		invalid_type_error: ERRORS.VALIDATION.INVALID_TYPE
	}),
	nickname: z
		.string({
			required_error: ERRORS.VALIDATION.REQUIRED_FIELD,
			invalid_type_error: ERRORS.VALIDATION.INVALID_TYPE
		})
		.min(2, ERRORS.VALIDATION.INVALID_NICKNAME_LENGTH)
		.max(10, ERRORS.VALIDATION.INVALID_NICKNAME_LENGTH),
	email: z
		.string({
			required_error: ERRORS.VALIDATION.REQUIRED_FIELD,
			invalid_type_error: ERRORS.VALIDATION.INVALID_TYPE
		})
		.email(ERRORS.VALIDATION.INVALID_EMAIL),
	password: z.string({
		required_error: ERRORS.VALIDATION.REQUIRED_FIELD,
		invalid_type_error: ERRORS.VALIDATION.INVALID_TYPE
	}),
	phone: z.string({
		required_error: ERRORS.VALIDATION.REQUIRED_FIELD,
		invalid_type_error: ERRORS.VALIDATION.INVALID_TYPE
	}),
	marketingOptIn: z.union([z.literal(0), z.literal(1)]),
	fcmToken: z.string().nullable(),
	birth: z.string()
})

export const UserSchema = {
	getResponse: UserBaseSchema.omit({ password: true }),
	updateResponse: UserBaseSchema,
	updateInput: UserUpdateSchema.partial(),
	checkProfileInput: UserUpdateSchema.pick({ nickname: true, birth: true })
}

export const LoginResponseSchema = z.object({
	jwt: z.string(),
	user: UserSchema.getResponse,
	isNew: z.union([z.literal(0), z.literal(1)])
})

export const SignUpInputSchema = UserUpdateSchema.omit({
	password: true
}).extend({
	birthYYYYMMDD: z
		.string({
			required_error: ERRORS.VALIDATION.REQUIRED_FIELD,
			invalid_type_error: ERRORS.VALIDATION.INVALID_TYPE
		})
		.length(8),
	provider: OAuthProviderSchema
})

export const PhonAuthRequestInputSchema = z.object({
	phone: z.string({
		required_error: ERRORS.VALIDATION.REQUIRED_FIELD,
		invalid_type_error: ERRORS.VALIDATION.INVALID_TYPE
	}),
	carrier: z.string(),
	hash: z.string()
})

export const PhoneAuthCodeResponseSchema = z.object({
	phone: z.string(),
	expiredAt: z.string().datetime()
})

export const PhonAuthVerifyInputSchema = z.object({
	phone: z.string({
		required_error: ERRORS.VALIDATION.REQUIRED_FIELD,
		invalid_type_error: ERRORS.VALIDATION.INVALID_TYPE
	}),
	authCode: z.string()
})

export const PhoneAuthCodeVerifyResponseSchema = z.object({
	success: z.boolean(),
	errorMsg: z.string().optional()
})

export const CheckNicknameResponseSchema = z.object({
	success: z.boolean(),
	errorMsg: z.string().optional()
})

export const NicknameResponseSchema = z.array(
	z.object({
		phone: z.string(),
		nickname: z.string().nullable(),
		id: z.number().nullable()
	})
)

// Place Schema
const PlaceBaseSchema = z.object({
	id: z.number(),
	name: z.string(),
	ownerId: z.number(),
	address: z.string(),
	latitude: z.string(),
	longitude: z.string(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

// Event Schema
const EventBaseSchema = z.object({
	id: z.number(),
	placeId: z.number(),
	name: z.string(),
	description: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	imageUrl: z.string().url(),
	memo: z.string().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

const EventTagBaseSchema = z.object({
	id: z.number(),
	eventId: z.number(),
	tag: z.string()
})

export const EventResponseSchema = EventBaseSchema.extend({
	place: PlaceBaseSchema,
	tags: z.array(EventTagBaseSchema)
})

export const EventsResponseSchema = z.array(EventResponseSchema)

const TicketBaseSchema = z.object({
	id: z.number(),
	ownerId: z.number(),
	placeId: z.number(),
	name: z.string(),
	description: z.string().nullable(),
	memo: z.string(),
	imageUrl: z.string().url(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

export const EventReactionsResponseSchema = z.object({
	eventId: z.number(),
	reactions: z
		.object({
			0: z.number(),
			1: z.number()
		})
		.partial(),
	userReaction: z.union([z.literal(0), z.literal(1), z.literal(-1)]).nullable()
})

export const EventReactionPayloadSchema = z.object({
	reactionType: z.union([z.literal(0), z.literal(1)])
})

// EventTicket Schema
const EventTicketBaseSchema = z.object({
	id: z.number(),
	eventId: z.number(),
	ticketId: z.number(),
	userId: z.number().nullable(),
	startAt: z.string().datetime(),
	endAt: z.string().datetime(),
	usedAt: z.string().datetime().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

const EventTicketTransferBaseSchema = z.object({
	id: z.number(),
	eventTicketId: z.number(),
	fromUserId: z.number().nullable(),
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

export const EventTicketResponseSchema = EventTicketBaseSchema.extend({
	event: EventResponseSchema,
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
		fromUser: UserBaseSchema,
		toUser: UserBaseSchema.nullable()
	})
)

export const EventTicketsActionPayloadSchema = z.object({
	eventTicketTransferId: z.number()
})

export const EventTicketsActionResponseSchema = EventTicketTransferBaseSchema

// QRCode Schema
export const QRCodeResponseSchema = z.object({
	id: z.number(),
	userId: z.number(),
	imgUrl: z.string().url(),
	expiredAt: z.string().datetime(),
	metadata: z.object({
		userId: z.number(),
		issuedAt: z.string().datetime(),
		expiredAt: z.string().datetime()
	})
})

// Notifications Schema
export const NotificationsResponseSchema = z.array(
	z.object({
		id: z.number(),
		userId: z.number(),
		userPhoneNumber: z.string().nullable(),
		title: z.string(),
		body: z.string(),
		data: z.object({
			transferId: z.number()
		}),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
		deletedAt: z.string().datetime().nullable()
	})
)

export const NotificationsUnreadResponseSchema = z.object({
	hasUnread: z.boolean()
})
