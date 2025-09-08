import { z } from 'zod'

import { BaseEntitySchema, PaginationResponseSchema, UrlString } from './common'
import { CouponBaseSchema } from './coupon'
import { HostBaseSchema } from './host'
import { MediaBaseSchema } from './media'
import { PlaceBaseSchema } from './place'
import { TicketBaseSchema } from './ticket'

// Event Schema
export const EventTagBaseSchema = z.object({
	id: z.number(),
	eventId: z.number(),
	tag: z.string()
})

export const EventBaseSchema = BaseEntitySchema.extend({
	hostId: z.number(),
	placeId: z.number(),
	name: z.string(),
	description: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	imageUrl: UrlString,
	memo: z.string().nullable(),
	notice: z.string().nullable(),
	instagramUrl: UrlString.nullable(),
	tiktokUrl: UrlString.nullable(),
	blogUrl: UrlString.nullable(),
	youtubeUrl: UrlString.nullable(),
	homepageUrl: UrlString.nullable(),
	viewCount: z.number(),
	isRecommended: z.boolean(),
	isVenue: z.boolean()
})

export const EventInformationSchema = z.object({
	isNoSmoking: z.boolean(),
	hasSmokingBooth: z.boolean(),
	hasParkingArea: z.boolean(),
	hasWaitingArea: z.boolean()
})

export const HashtagSchema = BaseEntitySchema.extend({
	key: z.string(),
	korName: z.string().nullable()
})

export const EventHashtagSchema = z.object({
	id: z.number(),
	tag: z.string(),
	hashtag: HashtagSchema.nullable()
})

export const EventResponseSchema = EventBaseSchema.extend({
	place: PlaceBaseSchema,
	host: z.lazy(() => HostBaseSchema),
	tags: z.array(EventTagBaseSchema),
	eventMedias: z.array(MediaBaseSchema),
	informations: z.array(EventInformationSchema),
	tickets: z.array(
		z.lazy(() =>
			TicketBaseSchema.extend({
				coupons: z.array(CouponBaseSchema)
			})
		)
	),
	wishCount: z.number(),
	isWished: z.boolean(),
	eventHashtags: z.array(EventHashtagSchema),
	venue: EventBaseSchema.extend({
		host: z.lazy(() => HostBaseSchema),
		tags: z.array(EventTagBaseSchema),
		eventHashtags: z.array(EventHashtagSchema)
	}).nullable()
})

export const EventSortOrderSchema = z.enum([
	'today_opening',
	'this_week',
	'popular',
	'newest'
])

export const EventFilterSchema = z.object({
	sort: EventSortOrderSchema.optional(),
	tag: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
	isRecommended: z.boolean().optional(),
	isPicked: z.boolean().optional(),
	isActive: z.boolean().optional(),
	isVenue: z.boolean().optional(),
	searchTerm: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional()
})

export const EventsResponseSchema = PaginationResponseSchema.extend({
	items: z.array(
		EventBaseSchema.extend({
			place: PlaceBaseSchema,
			tags: z.array(EventTagBaseSchema),
			host: HostBaseSchema,
			eventWishes: z.array(z.any()),
			eventHashtags: z.array(EventHashtagSchema)
		})
	)
})

export const EventsByHostResponseSchema = z.array(
	EventBaseSchema.extend({
		host: HostBaseSchema,
		place: PlaceBaseSchema,
		tags: z.array(EventTagBaseSchema),
		eventWishes: z.array(z.any())
	})
)

export const NearbyEventsResponseSchema = z.array(
	EventBaseSchema.extend({
		place: PlaceBaseSchema,
		tags: z.array(EventTagBaseSchema),
		host: HostBaseSchema,
		eventWishes: z.array(z.any())
	})
)

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

export const WishResponseSchema = z.object({
	eventId: z.number(),
	isWished: z.boolean()
})
