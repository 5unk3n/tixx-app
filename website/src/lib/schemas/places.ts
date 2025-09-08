import { z } from 'zod'

import { CommonSchemas } from './common'

export const PlaceBaseSchema = z.object({
	name: z.string(),
	address: z.string(),
	latitude: z.string(),
	longitude: z.string(),
	id: CommonSchemas.id,
	createdAt: CommonSchemas.createdAt,
	updatedAt: CommonSchemas.updatedAt,
	deletedAt: CommonSchemas.deletedAt
})

export const CreatePlacePayloadSchema = z.object({
	name: z.string(),
	address: z.string(),
	latitude: z.number(),
	longitude: z.number()
})

export const CreatePlaceResponseSchema = PlaceBaseSchema
