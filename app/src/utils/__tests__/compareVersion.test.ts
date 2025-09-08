import { describe, it, expect } from '@jest/globals'

import { compareVersion } from '../compareVersion'

describe('compareVersion', () => {
	it('should return 1 when v1 > v2', () => {
		expect(compareVersion('1.2.3', '1.2.0')).toBe(1)
		expect(compareVersion('2.0.0', '1.9.9')).toBe(1)
		expect(compareVersion('1.10.0', '1.2.0')).toBe(1)
	})

	it('should return -1 when v1 < v2', () => {
		expect(compareVersion('1.2.0', '1.2.3')).toBe(-1)
		expect(compareVersion('1.9.9', '2.0.0')).toBe(-1)
		expect(compareVersion('1.2.0', '1.10.0')).toBe(-1)
	})

	it('should return 0 when v1 === v2', () => {
		expect(compareVersion('1.2.3', '1.2.3')).toBe(0)
		expect(compareVersion('2.0.0', '2.0.0')).toBe(0)
	})

	it('should handle versions with different numbers of segments', () => {
		expect(compareVersion('1.2', '1.2.0')).toBe(0)
		expect(compareVersion('1.2.0', '1.2')).toBe(0)
		expect(compareVersion('1.2.3', '1.2')).toBe(1)
		expect(compareVersion('1.2', '1.2.3')).toBe(-1)
	})

	it('should handle versions with leading zeros', () => {
		expect(compareVersion('1.02.0', '1.2.0')).toBe(0)
		expect(compareVersion('1.2.0', '1.02.0')).toBe(0)
	})
})
