import { z } from 'zod'

import { CommonSchemas } from './common'
import { EventBaseSchema, EventInformationSchema } from './events'
import { MediaBaseSchema } from './file'
import { PlaceBaseSchema } from './places'

export const HostCategorySchema = z.nativeEnum({
	BRAND: 'Brand',
	PROMOTE: 'Promote',
	VENUE: 'Venue'
})

export const HostBaseSchema = z.object({
	id: z.number(),
	clientUserId: z.number(),
	placeId: z.number().nullable(),
	name: z.string(),
	description: z.string().nullable(),
	imageUrl: z.string().nullable(),
	contactName: z.string().nullable(),
	contactPhone: z.string().nullable(),
	category: HostCategorySchema,
	createdAt: CommonSchemas.createdAt,
	updatedAt: CommonSchemas.updatedAt,
	deletedAt: CommonSchemas.deletedAt
})

export const CreateHostPayloadSchema = z.object({
	placeId: z.number().optional(),
	name: z.string(),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
	contactName: z.string(),
	contactPhone: z.string(),
	category: HostCategorySchema
})

export const UpdateHostPayloadSchema = z.object({
	hostId: z.number(),
	placeId: z.number().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
	contactName: z.string(),
	contactPhone: z.string(),
	category: HostCategorySchema.optional()
})

export const CreateHostFormSchema = z
	.object({
		name: z.string().nonempty(),
		image: z.instanceof(File).optional(),
		category: HostCategorySchema,
		description: z.string().nonempty(),
		contactName: z.string().nonempty(),
		contactPhone: z.string().nonempty(),
		venue: z
			.object({
				medias: z.array(z.instanceof(File)).optional(),
				startTime: z
					.string()
					.regex(/^\d{2}:\d{2}$/, {
						message: '시간 형식이 올바르지 않습니다. (HH:MM)'
					})
					.optional(),
				informations: EventInformationSchema.partial().optional(),
				hashtag: z.string().optional(),
				endTime: z
					.string()
					.regex(/^\d{2}:\d{2}$/, {
						message: '시간 형식이 올바르지 않습니다. (HH:MM)'
					})
					.optional(),
				placeRoadAddress: z.string().optional(),
				placeName: z.string().optional(),
				instagramUrl: z.string().url().optional(),
				tiktokUrl: z.string().url().optional(),
				blogUrl: z.string().url().optional(),
				youtubeUrl: z.string().url().optional(),
				homepageUrl: z.string().url().optional()
			})
			.optional()
	})
	.superRefine((data, ctx) => {
		if (data.category !== 'Venue' || !data.venue) {
			return
		}

		// 필수 입력 필드
		const { placeRoadAddress, medias, startTime, endTime } = data.venue
		const isAnyFieldFilled =
			placeRoadAddress || (medias && medias.length > 0) || startTime || endTime

		if (!isAnyFieldFilled) {
			return
		}

		// 필수 입력 필드 중 하나라도 입력했으면 유효성검사
		if (!placeRoadAddress) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['venue.placeRoadAddress']
			})
		}
		if (!medias || medias.length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['venue.medias']
			})
		}
		if (!startTime) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['venue.startTime']
			})
		}
		if (!endTime) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['venue.endTime']
			})
		}
	})

export const CreateHostResponseSchema = HostBaseSchema

// host는 event 정보를 함께 보내줌
export const HostsResponseSchema = z.array(
	HostBaseSchema.extend({
		events: z.array(
			z.lazy(() =>
				EventBaseSchema.extend({
					startDate: z.string().nullable(),
					endDate: z.string().nullable(),
					startTime: z.string().nullable(),
					endTime: z.string().nullable(),
					place: PlaceBaseSchema,
					eventMedias: z.array(MediaBaseSchema),
					informations: z.array(EventInformationSchema),
					hashtags: z.array(z.object({ id: z.number(), tag: z.string() }))
				})
			)
		)
	})
)

export const DeleteHostResponseSchema = z.object({
	message: z.string()
})
