import { z } from 'zod'

import { BaseEntitySchema } from './common'

// Place Schema
export const PlaceBaseSchema = BaseEntitySchema.extend({
	name: z.string(),
	address: z.string(),
	latitude: z.string(),
	longitude: z.string()
})
