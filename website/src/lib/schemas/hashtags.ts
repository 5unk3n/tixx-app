import { z } from 'zod'

export const HashtagSchema = z.object({
	id: z.number(),
	key: z.string(),
	korName: z.string().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

export const HashtagAliasSchema = z.object({
	id: z.number(),
	alias: z.string(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

export const HashtagsResponseSchema = z.array(
	HashtagSchema.extend({
		aliases: z.array(HashtagAliasSchema)
	})
)
