import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import * as Sentry from '@sentry/react-native'
import { z } from 'zod'

import { validateApiResponse } from '../validateApiResponse'

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
	captureMessage: jest.fn()
}))

const TestSchema = z.object({
	id: z.number(),
	name: z.string()
})

describe('validateApiResponse', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should return the data if it matches the schema', () => {
		const validData = { id: 1, name: 'Test' }
		const result = validateApiResponse(validData, TestSchema)
		expect(result).toEqual(validData)
		expect(Sentry.captureMessage).not.toHaveBeenCalled()
		expect(console.error).not.toHaveBeenCalled()
	})

	it('should return the original data and log to console in DEV if it does not match', () => {
		const invalidData = { id: '1', name: 'Test' } // id is a string
		const result = validateApiResponse(invalidData, TestSchema)

		expect(result).toEqual(invalidData)
		expect(console.error).toHaveBeenCalledWith(
			'Invalid API response:',
			expect.any(z.ZodError)
		)
		expect(console.info).toHaveBeenCalledWith(invalidData)
		expect(Sentry.captureMessage).not.toHaveBeenCalled()
	})

	it('should return the original data and report to Sentry in PROD if it does not match', () => {
		const originalDev = __DEV__
		Object.defineProperty(global, '__DEV__', {
			value: false,
			configurable: true
		})

		const invalidData = { id: 1 } // name is missing
		const result = validateApiResponse(invalidData, TestSchema)

		expect(result).toEqual(invalidData)
		expect(Sentry.captureMessage).toHaveBeenCalledWith('Invalid API response', {
			extra: { response: invalidData, errors: expect.any(z.ZodError) }
		})
		expect(console.error).not.toHaveBeenCalled()

		Object.defineProperty(global, '__DEV__', { value: originalDev })
	})
})
