import { describe, it, expect } from '@jest/globals'

import { opacityPercentToHex } from '../opacityPercentToHex'

describe('opacityPercentToHex', () => {
	it('should convert 100% to FF', () => {
		expect(opacityPercentToHex(100)).toBe('FF')
	})

	it('should convert 50% to 80', () => {
		// 255 * 0.5 = 127.5, rounded to 128, which is 80 in hex.
		expect(opacityPercentToHex(50)).toBe('80')
	})

	it('should convert 0% to 00', () => {
		expect(opacityPercentToHex(0)).toBe('00')
	})

	it('should convert 25% to 40', () => {
		// 255 * 0.25 = 63.75, rounded to 64, which is 40 in hex.
		expect(opacityPercentToHex(25)).toBe('40')
	})

	it('should handle single-digit hex results with padding', () => {
		// 255 * 0.03 = 7.65, rounded to 8, which is 08 in hex.
		expect(opacityPercentToHex(3)).toBe('08')
	})

	it('should throw an error for values less than 0', () => {
		expect(() => opacityPercentToHex(-10)).toThrow(
			'불투명도는 0에서 100 사이의 숫자여야 합니다.'
		)
	})

	it('should throw an error for values greater than 100', () => {
		expect(() => opacityPercentToHex(101)).toThrow(
			'불투명도는 0에서 100 사이의 숫자여야 합니다.'
		)
	})
})
