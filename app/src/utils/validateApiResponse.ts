import * as Sentry from '@sentry/react-native'
import { z } from 'zod'

export const validateApiResponse = <T>(
	data: unknown,
	schema: z.ZodSchema<T>
): T => {
	const parsedSchemaResult = schema.safeParse(data)

	if (!parsedSchemaResult.success) {
		if (__DEV__) {
			// 개발 환경에서는 콘솔에 에러 출력
			console.error('Invalid API response:', parsedSchemaResult.error)
			console.info(data)
		} else {
			// Sentry에 에러 전송
			Sentry.captureMessage('Invalid API response', {
				extra: { response: data, errors: parsedSchemaResult.error }
			})
		}

		return data as T
	}

	return parsedSchemaResult.data
}
