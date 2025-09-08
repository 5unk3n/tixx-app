import { z } from 'zod'

import { BaseEntitySchema, UrlString } from './common'

// Media Schema
export const UploadableMimeTypeSchema = z.enum([
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/gif',
	'video/mp4',
	'video/webm',
	'video/mov'
])

export const MediaBaseSchema = BaseEntitySchema.omit({ id: true }).extend({
	id: z.string(),
	eventId: z.number(),
	mediaUrl: UrlString,
	mimeType: UploadableMimeTypeSchema,
	thumbnailUrl: UrlString.nullable(),
	altText: z.string().nullable(),
	sortOrder: z.number()
})
