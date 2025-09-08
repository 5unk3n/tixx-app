import { z } from 'zod'

export const validateApiResponse = <T>(
	data: unknown,
	schema: z.ZodSchema<T>
): T => {
	const parsedSchemaResult = schema.safeParse(data)

	if (!parsedSchemaResult.success) {
		if (import.meta.env.DEV) {
			// 개발 환경에서는 콘솔에 에러 출력
			console.error('Invalid API response:', parsedSchemaResult.error)
		} else {
			// TODO: Sentry에 에러 전송
			// Sentry.captureMessage('Invalid API response', {
			// 	extra: { response: data, errors: parsedSchemaResult.error }
			// })
		}

		return data as T
	}

	return parsedSchemaResult.data
}
