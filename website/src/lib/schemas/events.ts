import { z } from 'zod'

import { CommonSchemas, PaginationResponseSchema } from './common'
import { CouponBaseSchema } from './coupons'
import { MediaBaseSchema } from './file'
import { HashtagSchema } from './hashtags'
import { HostBaseSchema } from './hosts'
import { PlaceBaseSchema } from './places'
import { TicketBaseSchema } from './tickets'

export const TagSchema = z.object({
	id: z.number(),
	eventId: z.number(),
	tag: z.string()
})

export const EventHashtagSchema = z.object({
	id: z.number(),
	tag: z.string(),
	hashtag: HashtagSchema.nullable()
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

export const EventInformationSchema = z.object({
	isNoSmoking: z.boolean(),
	hasSmokingBooth: z.boolean(),
	hasParkingArea: z.boolean(),
	hasWaitingArea: z.boolean()
})

export const EventBaseSchema = z.object({
	id: z.number(),
	hostId: z.number(),
	placeId: z.number(),
	name: z.string(),
	description: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	imageUrl: z.string().url(),
	memo: z.string().nullable(),
	notice: z.string().nullable(),
	instagramUrl: z.string().url().nullable(),
	tiktokUrl: z.string().url().nullable(),
	blogUrl: z.string().url().nullable(),
	youtubeUrl: z.string().url().nullable(),
	homepageUrl: z.string().url().nullable(),
	viewCount: z.number(),
	isRecommended: z.boolean(),
	isVenue: z.boolean(),
	createdAt: CommonSchemas.createdAt,
	updatedAt: CommonSchemas.updatedAt,
	deletedAt: CommonSchemas.deletedAt
})

export const EventResponseSchema = EventBaseSchema.extend({
	place: PlaceBaseSchema,
	host: z.lazy(() => HostBaseSchema),
	tags: z.array(TagSchema),
	eventMedias: z.array(MediaBaseSchema),
	informations: z.array(EventInformationSchema),
	tickets: z.array(
		TicketBaseSchema.extend({
			coupons: z.array(CouponBaseSchema)
		})
	),
	wishCount: z.number(),
	isWished: z.boolean(),
	eventHashtags: z.array(EventHashtagSchema)
})

export const EventsPaginationResponseSchema = PaginationResponseSchema.extend({
	items: z.array(
		EventBaseSchema.extend({
			place: PlaceBaseSchema,
			tags: z.array(TagSchema),
			host: z.lazy(() => HostBaseSchema),
			eventWishes: z.array(z.any())
		})
	)
})

export const EventsResponseSchema = z.array(
	EventBaseSchema.extend({
		place: PlaceBaseSchema,
		host: z.lazy(() => HostBaseSchema),
		tags: z.array(TagSchema)
	})
)

export const CreateEventResponseSchema = EventBaseSchema

export const CreateEventPayloadSchema = z.object({
	hostId: z.number(),
	placeId: z.number(),
	name: z.string(),
	description: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	medias: z.array(
		MediaBaseSchema.pick({ mediaUrl: true, mimeType: true, sortOrder: true })
	),
	memo: z.string().optional(),
	tags: z.array(z.string()).optional(),
	instagramUrl: z.string().url().optional(),
	tiktokUrl: z.string().url().optional(),
	blogUrl: z.string().url().optional(),
	youtubeUrl: z.string().url().optional(),
	homepageUrl: z.string().url().optional(),
	hashtags: z.array(z.string()).optional(),
	notice: z.string().optional(),
	informations: z.array(EventInformationSchema).optional(),
	isVenue: z.boolean()
})

export const CreateEventFormSchema = z.object({
	media: z.instanceof(File),
	thumbnail: z.instanceof(File).optional(),
	tags: z.string(),
	name: z.string(),
	instagramUrl: z.string().url().optional(),
	tiktokUrl: z.string().url().optional(),
	blogUrl: z.string().url().optional(),
	youtubeUrl: z.string().url().optional(),
	homepageUrl: z.string().url().optional(),
	startDate: z.date(),
	endDate: z.date(),
	startTime: z.string().regex(/^\d{2}:\d{2}$/, {
		message: '시간 형식이 올바르지 않습니다. (HH:MM)'
	}),
	endTime: z.string().regex(/^\d{2}:\d{2}$/, {
		message: '시간 형식이 올바르지 않습니다. (HH:MM)'
	}),
	placeRoadAddress: z.string(),
	placeName: z.string().optional(),
	placeInfo: z
		.array(z.enum(['noSmoking', 'smokingBooth', 'parkingSpace', 'waitingArea']))
		.optional()
		.default([]),
	memo: z.string().optional(),
	description: z.string().nonempty(),
	notice: z.string().optional(),
	hashtag: z.array(z.string()).optional().default([])
})

export const InstagramCrawlRequestSchema = z.object({
	urls: z.array(z.string().url())
})

export const InstagramCrawlPostSchema = z.object({
	inputUrl: z.string().url(),
	hashtags: z.array(z.string()).optional(),
	caption: z.string().optional(),
	type: z.string().optional(),
	url: z.string().url(),
	videoUrl: z.string().nullable().optional(),
	displayUrl: z.string().nullable().optional(),
	timestamp: z.string().datetime().optional(),
	id: z.any().optional(),
	images: z.array(z.string())
})

export const InstagramCrawlResponseSchema = z.array(InstagramCrawlPostSchema)

export const EventParticipantSchema = z.object({
	nickname: z.string(),
	ticketType: z.string(),
	status: z.string(),
	quantity: z.number()
})

export const EventParticipantsResponseSchema = z.array(EventParticipantSchema)
