import { DEV_URL, PROD_URL } from '@env'
import axios from 'axios'

import { TOKEN_KEY } from '@/constants/storeKey'

import { secureStorage } from './secureStorage'

const BASE_URL = __DEV__ ? DEV_URL : PROD_URL

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
})

axiosInstance.interceptors.request.use(async (config) => {
	const token = await secureStorage.get(TOKEN_KEY)

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			console.error('Error Status:', error.response.status)
			console.error('Error Data:', error.response.data)
		} else if (error.request) {
			console.error('No Response Received:', error.request)
		} else {
			console.error('Request Error:', error.message)
		}
		console.error('Error Config:', error.config)

		throw error
	}
)

export default axiosInstance
