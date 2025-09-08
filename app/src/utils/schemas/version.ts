import { z } from 'zod'

import { DateTimeString } from './common'

// Version Schema
export const VersionBaseSchema = z.object({
	os: z.enum(['android', 'ios']),
	minVersion: z.string(),
	latestVersion: z.string(),
	updatedAt: DateTimeString
})
