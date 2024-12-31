import * as Keychain from 'react-native-keychain'

// ! service를 key로 사용
// https://github.com/oblador/react-native-keychain/issues/36

class SecureStorage {
	private static instance: SecureStorage = new SecureStorage()
	private static cache: Record<string, string> = {}

	private constructor() {}

	public static getInstance(): SecureStorage {
		return SecureStorage.instance
	}

	public async set(key: string, value: string) {
		try {
			await Keychain.setGenericPassword('tixx', value, { service: key })
			SecureStorage.cache[key] = value
		} catch (error) {
			console.error(`Failed to save ${key}`, error)
			throw error
		}
	}

	public async get(key: string) {
		try {
			if (SecureStorage.cache[key]) {
				return SecureStorage.cache[key]
			}
			const credentials = await Keychain.getGenericPassword({ service: key })
			if (credentials && credentials.password) {
				SecureStorage.cache[key] = credentials.password
				return credentials.password
			}
			return null
		} catch (error) {
			console.error(`Failed to retrieve ${key}`, error)
			throw error
		}
	}

	public async remove(key: string) {
		try {
			await Keychain.resetGenericPassword({ service: key })
			delete SecureStorage.cache[key]
		} catch (error) {
			console.error(`Failed to delete ${key}`, error)
			throw error
		}
	}
}

export const secureStorage = SecureStorage.getInstance()
