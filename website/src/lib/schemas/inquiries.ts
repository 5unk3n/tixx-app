import { z } from 'zod'

export const InquireFormSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	title: z.string(),
	description: z.string(),
	privacyConsent: z.boolean()
})

export const ClientInquiryFormSchema = z.object({
	type: z.string(),
	title: z.string(),
	content: z.string(),
	name: z.string().optional(),
	email: z.string().email().optional()
})
