import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import * as Keychain from 'react-native-keychain'

import { secureStorage } from '../secureStorage'

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
	setGenericPassword: jest.fn(),
	getGenericPassword: jest.fn(),
	resetGenericPassword: jest.fn()
}))

const mockedKeychain = Keychain as jest.Mocked<typeof Keychain>

describe('secureStorage', () => {
	beforeEach(() => {
		// Clear all mocks and the internal cache before each test
		jest.clearAllMocks()
		// This is a bit of a hack to reset the private static cache.
		// In a real scenario, you might add a static reset method for testing.
		;(secureStorage as any).constructor.cache = {}
	})

	describe('set', () => {
		it('should call Keychain.setGenericPassword with the correct parameters', async () => {
			const key = 'myKey'
			const value = 'myValue'
			await secureStorage.set(key, value)
			expect(mockedKeychain.setGenericPassword).toHaveBeenCalledWith(
				'tixx',
				value,
				{ service: key }
			)
		})

		it('should cache the value after setting it', async () => {
			const key = 'myKey'
			const value = 'myValue'
			await secureStorage.set(key, value)
			// It should not call getGenericPassword because the value is cached
			const result = await secureStorage.get(key)
			expect(result).toBe(value)
			expect(mockedKeychain.getGenericPassword).not.toHaveBeenCalled()
		})
	})

	describe('get', () => {
		it('should return cached value without calling keychain if it exists', async () => {
			const key = 'myKey'
			const value = 'myValue'
			await secureStorage.set(key, value) // set caches the value

			mockedKeychain.setGenericPassword.mockClear() // clear mock calls from set()

			const result = await secureStorage.get(key)
			expect(result).toBe(value)
			expect(mockedKeychain.getGenericPassword).not.toHaveBeenCalled()
		})

		it('should call Keychain.getGenericPassword and return the password if not cached', async () => {
			const key = 'myKey'
			const value = 'mySecret'
			mockedKeychain.getGenericPassword.mockResolvedValue({
				service: key,
				username: 'tixx',
				password: value,
				storage: 'someStorage'
			})

			const result = await secureStorage.get(key)
			expect(result).toBe(value)
			expect(mockedKeychain.getGenericPassword).toHaveBeenCalledWith({
				service: key
			})
		})

		it('should return null if keychain has no credentials', async () => {
			const key = 'nonExistentKey'
			mockedKeychain.getGenericPassword.mockResolvedValue(false)
			const result = await secureStorage.get(key)
			expect(result).toBeNull()
		})
	})

	describe('remove', () => {
		it('should call Keychain.resetGenericPassword', async () => {
			const key = 'myKey'
			await secureStorage.remove(key)
			expect(mockedKeychain.resetGenericPassword).toHaveBeenCalledWith({
				service: key
			})
		})

		it('should remove the key from the cache', async () => {
			const key = 'myKey'
			const value = 'myValue'
			await secureStorage.set(key, value) // cache it
			await secureStorage.remove(key) // remove it

			// To verify it's gone from cache, we call get() again
			// and expect keychain to be called.
			mockedKeychain.getGenericPassword.mockResolvedValue(false)
			await secureStorage.get(key)
			expect(mockedKeychain.getGenericPassword).toHaveBeenCalledWith({
				service: key
			})
		})
	})

	describe('secureStorage error handling', () => {
		it('set propagates error and logs', async () => {
			mockedKeychain.setGenericPassword.mockRejectedValueOnce(
				new Error('save failed')
			)
			await expect(secureStorage.set('k', 'v')).rejects.toThrow('save failed')
			expect(console.error).toHaveBeenCalledWith(
				'Failed to save k',
				expect.any(Error)
			)
		})

		it('get propagates error and logs', async () => {
			mockedKeychain.getGenericPassword.mockRejectedValueOnce(
				new Error('get failed')
			)
			await expect(secureStorage.get('k')).rejects.toThrow('get failed')
			expect(console.error).toHaveBeenCalledWith(
				'Failed to retrieve k',
				expect.any(Error)
			)
		})

		it('remove propagates error and logs', async () => {
			mockedKeychain.resetGenericPassword.mockRejectedValueOnce(
				new Error('remove failed')
			)
			await expect(secureStorage.remove('k')).rejects.toThrow('remove failed')
			expect(console.error).toHaveBeenCalledWith(
				'Failed to delete k',
				expect.any(Error)
			)
		})
	})
})
