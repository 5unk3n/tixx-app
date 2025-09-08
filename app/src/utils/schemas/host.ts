import { z } from 'zod'

import {
	BaseEntitySchema,
	DateTimeString,
	PaginationResponseSchema
} from './common'
import {
	EventBaseSchema,
	EventHashtagSchema,
	EventInformationSchema,
	EventTagBaseSchema
} from './event'
import { MediaBaseSchema } from './media'
import { PlaceBaseSchema } from './place'

// Host Schema
export const HostCategorySchema = z.nativeEnum({
	BRAND: 'Brand',
	PROMOTE: 'Promote',
	VENUE: 'Venue'
})

export const HostBaseSchema = BaseEntitySchema.extend({
	clientUserId: z.number(),
	placeId: z.number().nullable(),
	name: z.string(),
	description: z.string().nullable(),
	imageUrl: z.string(),
	contactName: z.string().nullable(),
	contactPhone: z.string().nullable(),
	category: HostCategorySchema
})

export const VenuesResponseSchema = PaginationResponseSchema.extend({
	items: z.lazy(() =>
		z.array(
			EventBaseSchema.extend({
				startDate: z.string().nullable(),
				endDate: z.string().nullable(),
				startTime: z.string().nullable(),
				endTime: z.string().nullable(),
				place: PlaceBaseSchema,
				tags: z.array(EventTagBaseSchema),
				host: HostBaseSchema,
				eventWishes: z.array(z.any())
			})
		)
	)
})

export const HostResponseSchema = HostBaseSchema.extend({
	followerCount: z.number(),
	events: z.lazy(() =>
		z.array(
			EventBaseSchema.extend({
				place: PlaceBaseSchema,
				eventMedias: z.array(MediaBaseSchema),
				informations: z.array(EventInformationSchema),
				eventHashtags: z.array(EventHashtagSchema)
			})
		)
	)
})

export const HostFollowBaseSchema = z.object({
	id: z.number(),
	userId: z.number(),
	hostId: z.number(),
	createdAt: DateTimeString
})

export const HostFollowResponseSchema = z.object({
	followed: z.boolean(),
	message: z.string()
})

export const FollowingHostsResponseSchema = PaginationResponseSchema.extend({
	items: z.array(HostBaseSchema)
})

export const IsFollowingHostResponseSchema = z.object({
	isFollowing: z.boolean()
})
