import { z } from 'zod'

import { DateTimeString, UrlString } from './common'

// QRCode Schema
export const QRCodeResponseSchema = z.object({
	id: z.number(),
	userId: z.number(),
	imgUrl: UrlString,
	expiredAt: DateTimeString,
	metadata: z.object({
		userId: z.number(),
		issuedAt: DateTimeString,
		expiredAt: DateTimeString
	})
})
