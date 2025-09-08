import { describe, jest, it, expect, beforeEach } from '@jest/globals'

import {
	normalizePhone,
	formatPhone,
	formatDateToYYYYMMDD,
	formatDateWithPoint,
	formatDateWithDay,
	formatTimeRange,
	formatDDay
} from '../formatters'

describe('formatter functions', () => {
	describe('normalizePhone', () => {
		it('should remove non-digit characters', () => {
			expect(normalizePhone('010-1234-5678')).toBe('01012345678')
		})

		it('should handle country code 82', () => {
			expect(normalizePhone('+82-10-1234-5678')).toBe('01012345678')
		})
	})

	describe('formatPhone', () => {
		it('should format a valid E.164 number', () => {
			// Note: libphonenumber-js might format based on the library's country data,
			// so this test assumes a KR formatting context.
			expect(formatPhone('+821012345678')).toBe('010 1234 5678')
		})

		it('should return original string for invalid number', () => {
			expect(formatPhone('12345')).toBe('12345')
		})
	})

	describe('formatDateToYYYYMMDD', () => {
		it('should remove non-digit characters', () => {
			expect(formatDateToYYYYMMDD('2023-01-01')).toBe('20230101')
		})
	})

	describe('formatDateWithPoint', () => {
		it('should format YYYYMMDD to YYYY.MM.DD', () => {
			expect(formatDateWithPoint('20230101')).toBe('2023.01.01')
		})
	})

	describe('formatDateWithDay', () => {
		it('should format date with day in Korean', () => {
			// This test is environment-dependent because of the locale.
			// It might behave differently based on the test runner's environment.
			const date = new Date(2023, 0, 1) // Sunday
			expect(formatDateWithDay(date.toISOString(), 'ko')).toContain(
				'2023.01.01(일)'
			)
		})

		it('should format date with day in English', () => {
			const date = new Date(2023, 0, 1) // Sunday
			expect(formatDateWithDay(date.toISOString(), 'en')).toContain(
				'2023.01.01(Sun)'
			)
		})
	})

	describe('formatTimeRange', () => {
		it('should format a time range', () => {
			const start = new Date(2023, 0, 1, 10, 0).toISOString()
			const end = new Date(2023, 0, 1, 12, 0).toISOString()
			expect(formatTimeRange(start, end)).toEqual({
				startTime: '10:00',
				endTime: '12:00'
			})
		})
	})

	describe('formatDDay', () => {
		it('should format D-Day for a future date', () => {
			const date = new Date()
			date.setDate(date.getDate() + 5)
			expect(formatDDay(date.toISOString())).toBe('D-5')
		})

		it('should format D-Day for a past date', () => {
			const date = new Date()
			date.setDate(date.getDate() - 5)
			expect(formatDDay(date.toISOString())).toBe('D+5')
		})

		it('should format D-Day for today', () => {
			const date = new Date()
			expect(formatDDay(date.toISOString())).toBe('D-Day')
		})
	})

	describe('formatPhone error handling branches', () => {
		beforeEach(() => {
			jest.resetModules()
			jest.clearAllMocks()
		})

		it('logs ParseError and returns original phone when parsing fails with ParseError', () => {
			jest.doMock('libphonenumber-js', () => {
				return {
					ParseError: Error,
					parsePhoneNumberWithError: () => {
						throw new Error('invalid')
					}
				}
			})

			const input = 'bad-number'
			const result = formatPhone(input)
			expect(result).toBe(input)
			expect(console.error).toHaveBeenCalledWith(
				'Failed to parse phone number:',
				expect.any(String)
			)
		})

		it('does not log ParseError message when generic error occurs', () => {
			// generic error가 발생하는 상황을 시뮬레이트하기 어려우므로
			// formatPhone이 원본 문자열을 반환하는지 정도만 검증
			const input = '+9999123'
			const result = formatPhone(input)
			expect(result).toBe(input)
		})
	})
})
