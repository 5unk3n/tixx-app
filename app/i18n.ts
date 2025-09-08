import AsyncStorage from '@react-native-async-storage/async-storage'
import i18n, { ModuleType } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'react-native-localize'

import { LANGUAGE_KEY } from '@/constants/storeKey'

import english from './src/locales/en.json'
import korean from './src/locales/ko.json'

const supportedLanguages = ['en', 'ko']

const languageDetector = {
	type: 'languageDetector' as ModuleType,
	async: true,
	detect: async (callback: (lng: string) => void) => {
		const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY)

		if (savedLanguage) {
			callback(savedLanguage)
			return
		}
		const deviceLanguage = getLocales()[0].languageCode
		callback(deviceLanguage)
	},
	init: () => {},
	cacheUserLanguage: (language: string) => {
		AsyncStorage.setItem(LANGUAGE_KEY, language)
	}
}

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const resources = {
	en: {
		translation: english
	},
	ko: {
		translation: korean
	}
} as const

i18n
	.use(languageDetector)
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		supportedLngs: supportedLanguages,
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false // react already safes from xss
		}
	})

export default i18n
